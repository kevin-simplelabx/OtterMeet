# Speed Quiz (spec module 5): four-option trivia scored on correctness and speed, three presses per question:
#   step 3n     question open, the clock runs on every screen
#   step 3n+1   answer revealed with how the room split
#   step 3n+2   top-5 leaderboard
# One answer per question, no changing your mind. Points: 1000 for an instant right answer, down to 500 at the
# buzzer, 0 if wrong. The clock starts on the server when the room first arrives at the question.
module Activities
  module SpeedQuiz
    SHAPES = %w[▲ ◆ ● ■].freeze
    GRACE_MS = 750 # network slack after the buzzer

    module_function

    def defaults
      { questions: [
        { prompt: "What do you call a group of otters floating together?", options: ["A pod", "A raft", "A gaggle", "A crew"], correct: 1, seconds: 20 },
        { prompt: "Why do sea otters hold paws while they sleep?", options: ["To keep warm", "To share snacks", "So they don't drift apart", "To practise dancing"], correct: 2, seconds: 20 },
        { prompt: "Where does a sea otter keep its favourite rock?", options: ["Behind its ear", "In a pouch under its arm", "Buried in its den", "It doesn't have one"], correct: 1, seconds: 20 }
      ] }
    end

    def config(block)
      qs = Array(block.config.deep_symbolize_keys[:questions]).filter_map do |q|
        q = q.to_h.symbolize_keys
        options = Array(q[:options]).map { |o| o.to_s.strip.first(80) }
        next unless q[:prompt].present? && options.size == 4 && options.all?(&:present?)
        { prompt: q[:prompt].to_s.strip.first(160), options:, correct: q[:correct].to_i.clamp(0, 3), seconds: q[:seconds].to_i.clamp(5, 120).nonzero? || 20 }
      end
      { questions: qs.presence || defaults[:questions] }
    end

    def steps(block) = config(block)[:questions].size * 3

    def current(block, step)
      qs = config(block)[:questions]
      index = (step / 3).clamp(0, qs.size - 1)
      phase = %w[question reveal leaderboard][step % 3]
      [index, qs[index], phase]
    end

    def timer_key(block, index) = LiveStore.key("quiz", block.id, index)

    def started_at(block, index) = LiveStore.redis.get(timer_key(block, index))&.to_i

    def remaining_ms(block, index, q)
      start = started_at(block, index)
      return q[:seconds] * 1000 unless start
      [start + q[:seconds] * 1000 - now_ms, 0].max
    end

    def now_ms = (Time.now.to_f * 1000).to_i

    # Starts the clock the first time the room reaches a question (going back doesn't restart it), and banks
    # everyone's points at the reveal, so nobody's total gives the answer away early.
    def on_enter(_session, block, step)
      index, _, phase = current(block, step)
      case phase
      when "question" then LiveStore.redis.set(timer_key(block, index), now_ms, nx: true, ex: 2.days.to_i)
      else bank_points!(block, index)
      end
    end

    # Leaving the block mid-question still counts the answers already given.
    def on_leave(_session, block, step)
      index, = current(block, step)
      bank_points!(block, index)
    end

    def bank_points!(block, index)
      return false unless LiveStore.redis.set(LiveStore.key("quiz", block.id, index, "banked"), "1", nx: true, ex: 7.days.to_i)
      Response.where(timeline_block: block, key: "q#{index}").pluck(:participant_id, Arel.sql("(value->>'points')::int")).each do |id, points|
        Participant.where(id:).update_all(["total_score = total_score + ?", points]) if points.to_i.positive?
      end
      true
    end

    def view(block, step)
      index, q, phase = current(block, step)
      base = { kind: "SPEED_QUIZ", index:, total: config(block)[:questions].size, phase:, prompt: q[:prompt],
               options: q[:options], shapes: SHAPES, seconds: q[:seconds] }
      case phase
      when "question" then base.merge(remaining_ms: remaining_ms(block, index, q))
      when "reveal" then base.merge(correct: q[:correct], results: tally(block, step))
      else base.merge(correct: q[:correct], leaderboard: leaderboard(block.session))
      end
    end

    def tally(block, step)
      index, = current(block, step)
      answers = Response.where(timeline_block: block, key: "q#{index}").pluck(:value)
      counts = (0..3).map { |i| answers.count { |a| a["choice"] == i } }
      { question: index, answered: answers.size, counts: }
    end

    def leaderboard(session, limit: 5)
      session.participants.where("total_score > 0").order(total_score: :desc, created_at: :asc).limit(limit)
             .map.with_index(1) { |p, rank| { rank:, nickname: p.nickname, avatar: p.avatar_icon, score: p.total_score } }
    end

    def respond!(block, step, participant, data)
      index, q, phase = current(block, step)
      raise ArgumentError, "Answers are locked for this one. Get ready for the next." unless phase == "question"
      elapsed = now_ms - (started_at(block, index) || now_ms)
      raise ArgumentError, "Time’s up on this one. Speedier paws next round." if elapsed > q[:seconds] * 1000 + GRACE_MS
      choice = Integer(data["choice"], exception: false)
      raise ArgumentError, "Tap one of the four shapes." unless choice&.between?(0, 3)

      correct = choice == q[:correct]
      points = correct ? (1000 - 500.0 * elapsed.clamp(0, q[:seconds] * 1000) / (q[:seconds] * 1000)).round : 0
      inserted = Response.insert({ timeline_block_id: block.id, participant_id: participant.id, key: "q#{index}",
                                   value: { choice:, ms: elapsed, points: } },
                                 unique_by: :idx_responses_unique, record_timestamps: true)
      raise ArgumentError, "You’ve already locked in an answer." if inserted.rows.empty?
      nil
    end

    # Your own answer, without giving away whether it's right until the reveal.
    def mine(block, step, participant)
      index, q, phase = current(block, step)
      answer = Response.find_by(timeline_block: block, participant:, key: "q#{index}")&.value
      personal = { answered: answer ? answer["choice"] : nil }
      if phase != "question"
        personal[:correct] = answer ? answer["choice"] == q[:correct] : nil
        personal[:points] = answer ? answer["points"] : 0
      end
      if phase == "leaderboard"
        ahead = block.session.participants.where("total_score > ?", participant.reload.total_score).count
        personal[:rank] = ahead + 1
        personal[:of] = block.session.participants.count
      end
      { answers: {}, personal: }
    end
  end
end
