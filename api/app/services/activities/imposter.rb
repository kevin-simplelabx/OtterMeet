# Imposter (spec module 2): squad social deduction. Each round takes three presses:
#   step 3r     words: hold to reveal your card, then take turns giving one clue out loud
#   step 3r+1   vote:  tap who you think the imposter is
#   step 3r+2   reveal: caught imposters get 15 seconds of Last Breath to guess the word and steal points
# Squads come from the most recent Split Words tribes, or tables of about 6 if there were none. In "blank" mode the
# imposter knows and sees only the category; in "chameleon" mode they get a similar word and don't know.
module Activities
  module Imposter
    TABLE_SIZE = 6
    LAST_BREATH_MS = 15_000
    CAUGHT_POINTS = 200   # each civilian, when their table catches the imposter
    ESCAPE_POINTS = 300   # the imposter, when nobody catches them
    STEAL_POINTS = 300    # a caught imposter who guesses the word

    module_function

    def defaults = { pack: "pack1", mode: "blank", rounds: 2 }

    def config(block)
      c = block.config.deep_symbolize_keys
      { pack: Activities.pack(c[:pack].to_s)[:id], mode: c[:mode] == "chameleon" ? "chameleon" : "blank",
        rounds: c[:rounds].to_i.clamp(1, 5).nonzero? || 2 }
    end

    def steps(block) = config(block)[:rounds] * 3

    def current(step) = [step / 3, %w[words vote reveal][step % 3]]

    def squads(block, round) = Squad.where(timeline_block: block, round:).includes(squad_memberships: :participant).order(:squad_number)

    def on_enter(session, block, step)
      round, phase = current(step)
      deal!(session, block, round) if phase == "words" && !Squad.exists?(timeline_block: block, round:)
      if phase == "reveal" && LiveStore.redis.set(LiveStore.key("imposter", block.id, round, "revealed"), now_ms, nx: true, ex: 2.days.to_i)
        score!(block, round)
      end
    end

    def now_ms = (Time.now.to_f * 1000).to_i
    def revealed_at(block, round) = LiveStore.redis.get(LiveStore.key("imposter", block.id, round, "revealed"))&.to_i

    # --- dealing ---

    def deal!(session, block, round)
      tables = round.zero? ? first_tables(session, block) : repeat_tables(block)
      return if tables.empty?
      tribes = Activities.pack(config(block)[:pack])[:tribes].shuffle
      last_imposters = round.zero? ? [] : squads(block, round - 1).flat_map(&:squad_memberships).select { |m| m.assigned_role == "IMPOSTER" }.map(&:participant_id)
      Squad.transaction do
        tables.each_with_index do |(name, members), i|
          tribe = tribes[i % tribes.size]
          real, decoy = tribe[:pairs].sample(2).map { |p| "#{p[:a]} #{p[:b]}" }
          imposter = (members.reject { |m| last_imposters.include?(m.id) }.presence || members).sample
          squad = Squad.create!(timeline_block: block, squad_number: i + 1, master_tribe_name: name, round:, clue: tribe[:name])
          members.shuffle.each_with_index do |person, order|
            is_imposter = person == imposter
            word = is_imposter ? (config(block)[:mode] == "chameleon" ? decoy : nil) : real
            squad.squad_memberships.create!(participant: person, assigned_word: word, assigned_role: is_imposter ? "IMPOSTER" : "CIVILIAN",
                                            speaking_order: order + 1)
          end
        end
      end
    end

    # Tribes from the latest Split Words block before this one, else tables of about 6.
    def first_tables(session, block)
      here = session.participants.where(is_connected: true).to_a
      split = session.timeline_blocks.select { |b| b.block_type == "SPLIT_WORDS" && b.position < block.position }.max_by(&:position)
      if split
        tribes = Squad.where(timeline_block: split, round: 0).includes(squad_memberships: :participant).order(:squad_number).map do |s|
          [s.master_tribe_name, s.squad_memberships.map(&:participant) & here]
        end.reject { |_, ms| ms.size < 3 }
        seated = tribes.flat_map(&:last)
        rest = here - seated
        tribes.min_by { |_, ms| ms.size }&.last&.concat(rest) if rest.any? && tribes.any?
        return tribes if tribes.any?
      end
      return [] if here.size < 3
      SplitWords.split_evenly(here.shuffle, (here.size / TABLE_SIZE.to_f).ceil).each_with_index.map { |ms, i| ["Table #{i + 1}", ms] }
    end

    def repeat_tables(block)
      squads(block, 0).map { |s| [s.master_tribe_name, s.squad_memberships.map(&:participant).select(&:is_connected)] }.reject { |_, ms| ms.size < 3 }
    end

    # --- results ---

    def results(block, round)
      votes = Response.where(timeline_block: block, key: "vote#{round}").pluck(:participant_id, :value).to_h
      breaths = Response.where(timeline_block: block, key: "breath#{round}").pluck(:participant_id, :value).to_h
      squads(block, round).map do |s|
        ms = s.squad_memberships
        imposter = ms.find { |m| m.assigned_role == "IMPOSTER" }
        counts = ms.filter_map { |m| votes[m.participant_id] }.tally
        top = counts.values.max
        suspects = counts.select { |_, n| n == top }.keys
        caught = suspects.size == 1 && suspects.first == imposter&.participant_id
        breath = breaths[imposter&.participant_id]
        { number: s.squad_number, name: s.master_tribe_name, clue: s.clue,
          word: ms.find { |m| m.assigned_role == "CIVILIAN" }&.assigned_word,
          imposter: imposter && { id: imposter.participant_id, nickname: imposter.participant.nickname, avatar: imposter.participant.avatar_icon },
          caught:, votes: counts.values.sum, players: ms.size,
          breath: caught ? breath_status(block, round, breath) : nil }
      end
    end

    def breath_status(block, round, breath)
      return breath["correct"] ? "stolen" : "missed" if breath
      now_ms - revealed_at(block, round).to_i > LAST_BREATH_MS ? "missed" : "pending"
    end

    def score!(block, round)
      results(block, round).each do |r|
        ms = SquadMembership.joins(:squad).where(squads: { timeline_block_id: block.id, round:, squad_number: r[:number] })
        if r[:caught]
          Participant.where(id: ms.where(assigned_role: "CIVILIAN").select(:participant_id)).update_all(["total_score = total_score + ?", CAUGHT_POINTS])
        elsif r[:imposter]
          Participant.where(id: r[:imposter][:id]).update_all(["total_score = total_score + ?", ESCAPE_POINTS])
        end
      end
    end

    # --- answers ---

    def respond!(block, step, participant, data)
      round, phase = current(step)
      me = membership(block, round, participant)
      raise ArgumentError, "You’re not at a table this round. Enjoy the show." unless me

      if phase == "vote"
        suspect = SquadMembership.where(squad_id: me.squad_id).where.not(participant_id: participant.id).find_by(participant_id: data["suspect_id"])
        raise ArgumentError, "Pick someone at your table (not yourself)." unless suspect
        Response.record!(block, participant, "vote#{round}", suspect.participant_id)
      elsif phase == "reveal" && data.key?("guess")
        result = results(block, round).find { |r| r[:number] == me.squad.squad_number }
        raise ArgumentError, "Only a caught imposter gets a Last Breath." unless result[:caught] && result.dig(:imposter, :id) == participant.id
        raise ArgumentError, "Last Breath is over. So close." if now_ms - revealed_at(block, round).to_i > LAST_BREATH_MS + 750
        correct = Activities.same_words?(data["guess"], result[:word]) || result[:word].to_s.split.any? { |w| Activities.same_words?(data["guess"], w) }
        inserted = Response.insert({ timeline_block_id: block.id, participant_id: participant.id, key: "breath#{round}",
                                     value: { guess: data["guess"].to_s.first(60), correct: } },
                                   unique_by: :idx_responses_unique, record_timestamps: true)
        raise ArgumentError, "You’ve already had your Last Breath." if inserted.rows.empty?
        Participant.where(id: participant.id).update_all(["total_score = total_score + ?", STEAL_POINTS]) if correct
      else
        raise ArgumentError, "Hold tight, it’s not time for that yet."
      end
      SquadMembership.where(squad_id: me.squad_id).includes(:participant).map(&:participant)
    end

    def membership(block, round, participant)
      SquadMembership.joins(:squad).includes(:squad).find_by(participant:, squads: { timeline_block_id: block.id, round: })
    end

    # --- what screens see ---

    def view(block, step)
      round, phase = current(step)
      base = { kind: "IMPOSTER", round:, rounds: config(block)[:rounds], phase:, mode: config(block)[:mode] }
      return base unless phase == "reveal"
      remaining = [revealed_at(block, round).to_i + LAST_BREATH_MS - now_ms, 0].max
      base.merge(results: results(block, round), last_breath_ms: remaining)
    end

    def tally(block, step)
      round, phase = current(step)
      players = squads(block, round).sum { |s| s.squad_memberships.size }
      data = { round:, phase:, players:, votes_in: Response.where(timeline_block: block, key: "vote#{round}").count, tables: squads(block, round).size }
      phase == "reveal" ? data.merge(results: results(block, round)) : data
    end

    def mine(block, step, participant)
      round, phase = current(step)
      me = membership(block, round, participant)
      return { answers: {}, personal: { seated: false } } unless me
      ms = SquadMembership.includes(:participant).where(squad_id: me.squad_id).order(:speaking_order)
      imposter = me.assigned_role == "IMPOSTER"
      chameleon = config(block)[:mode] == "chameleon"
      card = if imposter && !chameleon then { imposter: true, clue: me.squad.clue }
             else { imposter: false, word: me.assigned_word, clue: nil }
             end
      personal = {
        seated: true, table: me.squad.master_tribe_name, order: me.speaking_order, card:,
        players: ms.map { |m| { id: m.participant_id, nickname: m.participant.nickname, avatar: m.participant.avatar_icon, order: m.speaking_order } },
        vote: Response.find_by(timeline_block: block, participant:, key: "vote#{round}")&.value
      }
      if phase == "reveal"
        result = results(block, round).find { |r| r[:number] == me.squad.squad_number }
        breath = Response.find_by(timeline_block: block, participant:, key: "breath#{round}")&.value
        personal[:result] = result.merge(you_were_imposter: imposter,
                                         last_breath_ms: [revealed_at(block, round).to_i + LAST_BREATH_MS - now_ms, 0].max,
                                         your_guess: breath)
      end
      { answers: {}, personal: }
    end
  end
end
