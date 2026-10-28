# Split Words & Tribes (spec module 1, pairing engine 9.1). Everyone gets half a word and their own 4-digit PIN,
# unique within the block, so partners never share one and a lucky guess is 1 in 10,000 (with 5 tries a minute).
#   step 0  pairs:  find the other half of your word and type their PIN to lock the match
#   step 1  quads:  your pair finds the other pair from your tribe
#   step 2  squads: the whole tribe of 8 gathers
# A tribe is one sub-category of a word pack (4 pairs). Odd numbers turn one pair into a trio using its bracket word.
# Words are dealt the first time the room arrives at the block; latecomers are placed by straggler rescue.
module Activities
  module SplitWords
    TRIBE_SIZE = 8
    PINS = (0..9999).map { |n| format("%04d", n) }.freeze
    PIN_TRIES_PER_MINUTE = 5

    module_function

    def defaults
      { pack: "pack1", prompts: [
        "What’s your go-to comfort supper?",
        "What’s one thing you want to learn this year?",
        "If your team were a TV show, what would it be called?"
      ] }
    end

    def config(block)
      c = block.config.deep_symbolize_keys
      prompts = Array(c[:prompts]).map { |p| p.to_s.strip.first(160) }
      prompts = defaults[:prompts].each_with_index.map { |d, i| prompts[i].presence || d }
      { pack: Activities.pack(c[:pack].to_s)[:id], prompts: }
    end

    def steps(_block) = 3
    def phase(step) = %w[pairs quads squads][step.clamp(0, 2)]

    def squads(block) = Squad.where(timeline_block: block, round: 0).includes(squad_memberships: :participant).order(:squad_number)

    def on_enter(session, block, step)
      deal!(session, block) if step.zero? && !Squad.exists?(timeline_block: block, round: 0)
    end

    # --- dealing ---

    def deal!(session, block)
      people = session.participants.where(is_connected: true).to_a.shuffle
      return if people.size < 2
      tribes = Activities.pack(config(block)[:pack])[:tribes].shuffle
      pins = unique_pins(people.size)
      groups = split_evenly(people.dup, (people.size / TRIBE_SIZE.to_f).ceil)
      Squad.transaction do
        groups.each_with_index do |members, i|
          tribe = tribes[i % tribes.size]
          squad = Squad.create!(timeline_block: block, squad_number: i + 1, master_tribe_name: tribe[:name], round: 0)
          pairs_for(members).each_with_index do |pair_members, pair_number|
            words = tribe[:pairs][pair_number % tribe[:pairs].size]
            pair_members.zip(%i[a b trio]).each do |person, slot|
              squad.squad_memberships.create!(participant: person, assigned_word: words[slot], verification_pin: pins.pop, pair_number:)
            end
          end
        end
      end
    end

    # Sizes as equal as possible, e.g. 20 people into 3 tribes = 7, 7, 6.
    def split_evenly(people, n)
      base, extra = people.size.divmod(n)
      sizes = Array.new(n) { |i| base + (i < extra ? 1 : 0) }
      rest = people.dup
      sizes.map { |s| rest.shift(s) }
    end

    # Pairs, with the last one becoming a trio when the count is odd.
    def pairs_for(members)
      pairs = members.each_slice(2).to_a
      if pairs.size > 1 && pairs.last.size == 1
        pairs[-2] << pairs.pop.first
      end
      pairs
    end

    def unique_pins(n) = PINS.sample(n)

    # --- straggler rescue (cockpit button / S key) ---

    # Places latecomers, and people whose whole pair has left, into pairs: two strays become a new pair in the
    # emptiest tribe; a single stray joins a pair as its trio. Returns everyone who got a new word.
    def rescue!(session, block)
      unless Squad.exists?(timeline_block: block, round: 0)
        deal!(session, block)
        return session.participants.where(is_connected: true).to_a
      end
      all = squads(block).to_a
      placed = all.flat_map(&:squad_memberships)
      stranded = placed.select do |m|
        partners = placed.select { |o| o.squad_id == m.squad_id && o.pair_number == m.pair_number && o.id != m.id }
        !m.confirmed && m.participant.is_connected && partners.any? && partners.none? { |o| o.participant.is_connected }
      end
      SquadMembership.where(id: stranded.map(&:id)).delete_all
      placed_ids = (placed - stranded).map(&:participant_id)
      strays = session.participants.where(is_connected: true).where.not(id: placed_ids).to_a.shuffle
      return [] if strays.empty?

      used_pins = (placed - stranded).map(&:verification_pin)
      pins = (PINS - used_pins).shuffle
      Squad.transaction do
        strays.each_slice(2) do |slice|
          if slice.size == 2
            squad = all.min_by { |s| s.squad_memberships.reload.size }
            tribe = tribe_for(block, squad)
            pair_number = (squad.squad_memberships.maximum(:pair_number) || -1) + 1
            words = tribe[:pairs][pair_number % tribe[:pairs].size]
            slice.zip(%i[a b]).each do |person, slot|
              squad.squad_memberships.create!(participant: person, assigned_word: words[slot], verification_pin: pins.pop, pair_number:)
            end
          else
            squad, pair_number = open_pair(all)
            words = tribe_for(block, squad)[:pairs][pair_number % 4]
            # The pair keeps its match; only the newcomer has to type one of their PINs.
            squad.squad_memberships.create!(participant: slice.first, assigned_word: words[:trio], verification_pin: pins.pop, pair_number:)
          end
        end
      end
      strays
    end

    def tribe_for(block, squad)
      tribes = Activities.pack(config(block)[:pack])[:tribes]
      tribes.find { |t| t[:name] == squad.master_tribe_name } || tribes.first
    end

    # A pair (not already a trio) to take a third member: one still searching if possible, so nobody who has
    # already matched gets disturbed, then the smallest tribe.
    def open_pair(all)
      candidates = all.flat_map do |squad|
        squad.squad_memberships.reload.group_by(&:pair_number).filter_map do |pair_number, ms|
          [squad, pair_number, ms.all?(&:confirmed) ? 1 : 0, squad.squad_memberships.size] if ms.size == 2
        end
      end
      best = candidates.min_by { |_, _, matched, size| [matched, size] }
      return best.first(2) if best
      squad = all.first
      [squad, squad.squad_memberships.maximum(:pair_number).to_i]
    end

    # --- answers ---

    # Typing your other half's PIN confirms you both. A trio is matched once all three are confirmed.
    def respond!(block, step, participant, data)
      raise ArgumentError, "The pairing round is over. Follow your phone to find your tribe." unless phase(step) == "pairs"
      me = SquadMembership.joins(:squad).find_by(participant:, squads: { timeline_block_id: block.id, round: 0 })
      raise ArgumentError, "You don’t have a word yet. Your host can slot you in." unless me
      unless LiveStore.allow_per_minute?("pin:#{participant.id}", limit: PIN_TRIES_PER_MINUTE)
        raise ArgumentError, "That’s a lot of guesses. Take a breather and find your other half in person."
      end
      pin = data["pin"].to_s.gsub(/\D/, "")
      partners = SquadMembership.where(squad_id: me.squad_id, pair_number: me.pair_number).where.not(id: me.id)
      match = partners.find_by(verification_pin: pin)
      raise ArgumentError, "That PIN isn’t your other half. Keep looking." unless match
      SquadMembership.where(id: [me.id, match.id]).update_all(confirmed: true)
      partners.includes(:participant).map(&:participant)
    end

    # --- what screens see ---

    def view(block, step)
      { kind: "SPLIT_WORDS", phase: phase(step), prompt: config(block)[:prompts][step.clamp(0, 2)],
        tribes: phase(step) == "pairs" ? nil : tribes_json(block) }
    end

    def tribes_json(block)
      squads(block).map do |s|
        { number: s.squad_number, name: s.master_tribe_name, avatars: s.squad_memberships.map { |m| m.participant.avatar_icon } }
      end
    end

    def tally(block, _step)
      members = squads(block).flat_map(&:squad_memberships)
      matched = members.group_by { |m| [m.squad_id, m.pair_number] }.values.select { |g| g.all?(&:confirmed) }.sum(&:size)
      session = block.session
      placed = members.map(&:participant_id)
      stragglers = members.reject(&:confirmed).map { |m| straggler_json(m.participant, m.assigned_word) } +
                   session.participants.where(is_connected: true).where.not(id: placed).map { |p| straggler_json(p, nil) }
      { matched_count: matched, total_count: members.size, stragglers: stragglers.first(40), dealt: members.any? }
    end

    def straggler_json(p, word) = { id: p.id, nickname: p.nickname, avatar: p.avatar_icon, word:, connected: p.is_connected }

    def mine(block, step, participant)
      me = SquadMembership.joins(:squad).includes(:squad).find_by(participant:, squads: { timeline_block_id: block.id, round: 0 })
      return { answers: {}, personal: { dealt: false } } unless me
      pair = SquadMembership.includes(:participant).where(squad_id: me.squad_id, pair_number: me.pair_number).order(:id).to_a
      tribe = SquadMembership.where(squad_id: me.squad_id).order(:pair_number, :id).to_a.group_by(&:pair_number)
      words = tribe_for(block, me.squad)[:pairs]
      phrase = ->(ms) { order_words(words, ms.map(&:assigned_word)) }
      my_pair = tribe[me.pair_number] || pair
      other_pairs = tribe.except(me.pair_number).values
      quad_partner = other_pairs.find { |ms| ms.first.pair_number / 2 == me.pair_number / 2 }
      {
        answers: {},
        personal: {
          dealt: true, word: me.assigned_word, pin: me.verification_pin, trio: pair.size == 3,
          matched: pair.all?(&:confirmed), confirmed: me.confirmed,
          partners: pair.reject { |m| m.id == me.id }.map { |m| m.confirmed || me.confirmed ? { nickname: m.participant.nickname, avatar: m.participant.avatar_icon } : nil }.compact,
          pair_phrase: phrase.call(my_pair),
          quad_phrase: quad_partner && phrase.call(quad_partner),
          tribe: me.squad.master_tribe_name,
          tribe_phrases: tribe.values.map { |ms| phrase.call(ms) }
        }
      }
    end

    # Puts held words back in pack order (trio word first), so "Butter Kaya Toast" reads naturally.
    def order_words(pack_pairs, held)
      pair = pack_pairs.find { |pp| held.include?(pp[:a]) || held.include?(pp[:b]) }
      return held.join(" ") unless pair
      [pair[:trio], pair[:a], pair[:b]].select { |w| held.include?(w) }.join(" ")
    end
  end
end
