# Per-block game logic for the live room. Each activity defines:
#   config(block)          the block's settings with defaults filled in
#   steps(block)           how many clicker presses it takes to get through it (at least 1)
#   view(block, step)      what every screen sees right now (rides along in STATE)
#   tally(block, step)     live results for the stage and cockpit (TALLY, throttled)
#   respond!(...)          records one attendee answer; may return other participants whose phones need a refresh
# and optionally:
#   on_enter(session, block, step)   runs when the room arrives at a step (start a timer, deal words, score a reveal)
#   on_leave(session, block, step)   runs when the room moves on to another block
#   Both return true when they changed anyone's points, so phones get their new totals straight away.
#   mine(block, step, participant)   what only this person's phone sees (their word, PIN, role, result)
# Split Words, Imposter and Speed Quiz live in app/services/activities/.
module Activities
  GAME_TYPES = %w[SPLIT_WORDS IMPOSTER THIS_OR_THAT WORD_CLOUD SPEED_QUIZ].freeze

  module_function

  def for(block) = REGISTRY[block&.block_type]
  def config(block) = self.for(block)&.config(block) || block&.config || {}
  def steps(block) = [self.for(block)&.steps(block) || 1, 1].max
  def view(block, step) = self.for(block)&.view(block, step)
  def tally(block, step) = self.for(block)&.tally(block, step)
  def game?(block) = GAME_TYPES.include?(block&.block_type)

  def defaults_for(block_type) = REGISTRY[block_type]&.defaults || {}

  # Returns other participants whose phones should get a fresh MINE (e.g. your partner after a PIN match).
  def respond!(session, block, step, participant, data)
    activity = self.for(block)
    raise ArgumentError, "Nothing to answer here. Just enjoy the ride." unless activity.respond_to?(:respond!)
    affected = activity.respond!(block, step, participant, data)
    mark_dirty(session, block)
    Array(affected).grep(Participant) - [participant]
  end

  def on_enter(session, block, step)
    activity = self.for(block)
    activity.respond_to?(:on_enter) && activity.on_enter(session, block, step) == true
  end

  def on_leave(session, block, step)
    activity = self.for(block)
    activity.respond_to?(:on_leave) && activity.on_leave(session, block, step) == true
  end

  # Does this block show each phone something different (so step changes need a MINE per phone)?
  def personal?(block) = self.for(block).respond_to?(:mine)

  def mine(block, step, participant)
    return { answers: {} } unless block && participant
    activity = self.for(block)
    return activity.mine(block, step, participant) if activity.respond_to?(:mine)
    { answers: Response.where(timeline_block: block, participant:).pluck(:key, :value).to_h }
  end

  def word_packs
    @word_packs ||= YAML.load_file(Rails.root.join("config/content/word_packs.yml"), symbolize_names: true).freeze
  end

  def pack(id) = word_packs.find { |p| p[:id] == id } || word_packs.first

  # Lenient compare for typed guesses: case, spaces and punctuation don't matter.
  def same_words?(a, b) = squash(a) == squash(b)
  def squash(text) = text.to_s.downcase.gsub(/[^\p{L}\p{N}]/, "")

  def mark_dirty(session, block)
    LiveStore.redis.sadd(LiveStore.key("dirty"), "#{session.id}:#{block.id}")
  end

  def question_bank
    @question_bank ||= YAML.load_file(Rails.root.join("config/content/this_or_that.yml"), symbolize_names: true).freeze
  end

  module ThisOrThat
    module_function

    def defaults(random: Random.new)
      { questions: Activities.question_bank.sample(3, random:).map { |q| { prompt: q[:topic], a: q[:a], b: q[:b] } }, majority_rule: true }
    end

    def config(block)
      c = block.config.deep_symbolize_keys
      questions = Array(c[:questions]).filter_map do |q|
        q = q.to_h.symbolize_keys
        { prompt: q[:prompt].to_s.strip.first(140), a: q[:a].to_s.strip.first(60), b: q[:b].to_s.strip.first(60) } if q[:a].present? && q[:b].present?
      end
      # A block saved without questions gets a fixed pick (seeded by its id), so it can't change mid-vote.
      fallback = -> { defaults(random: Random.new(Digest::MD5.hexdigest(block.id.to_s).to_i(16)))[:questions] }
      { questions: questions.presence || fallback.call, majority_rule: c.fetch(:majority_rule, true) }
    end

    # Two presses per question: open voting, then reveal.
    def steps(block) = config(block)[:questions].size * 2

    def current(block, step)
      qs = config(block)[:questions]
      index = (step / 2).clamp(0, qs.size - 1)
      [index, qs[index], step.odd?]
    end

    def view(block, step)
      index, q, revealed = current(block, step)
      base = { kind: "THIS_OR_THAT", index:, total: config(block)[:questions].size, prompt: q[:prompt], a: q[:a], b: q[:b],
               revealed:, majority_rule: config(block)[:majority_rule] }
      revealed ? base.merge(results: tally(block, step)) : base
    end

    def tally(block, step)
      index, = current(block, step)
      counts = Response.where(timeline_block: block, key: "q#{index}").group(Arel.sql("value #>> '{}'")).count
      a = counts["A"].to_i
      b = counts["B"].to_i
      total = a + b
      pa = total.zero? ? 50 : (a * 100.0 / total).round
      { question: index, votes_a: a, votes_b: b, total_votes: total, percent_a: pa, percent_b: 100 - pa }
    end

    def respond!(block, step, participant, data)
      index, _, revealed = current(block, step)
      raise ArgumentError, "The votes are already in. Catch the next one." if revealed
      choice = data["choice"].to_s.upcase
      raise ArgumentError, "Pick a riverbank: This or That." unless %w[A B].include?(choice)
      Response.record!(block, participant, "q#{index}", choice)
    end

    def on_enter(_session, block, step)
      score_reveal!(block, step) if step.odd?
    end

    # Majority Rule: +100 to everyone who picked the room's majority. Runs once per question, on reveal.
    def score_reveal!(block, step)
      index, = current(block, step)
      return unless config(block)[:majority_rule]
      return unless LiveStore.redis.set(LiveStore.key("scored", block.id, index), "1", nx: true, ex: 7.days.to_i)
      t = tally(block, step)
      return if t[:votes_a] == t[:votes_b]
      winner = t[:votes_a] > t[:votes_b] ? "A" : "B"
      ids = Response.where(timeline_block: block, key: "q#{index}").where("value #>> '{}' = ?", winner).pluck(:participant_id)
      Participant.where(id: ids).update_all("total_score = total_score + 100")
      true
    end
  end

  module WordCloud
    MAX_WORDS = 3
    # Words that never reach the projector. ROOTS are blocked anywhere inside a word (they don't hide inside
    # normal English words); WHOLE_WORDS only when they stand alone, so "class", "cocktail" and "Dickens" pass.
    ROOTS = %w[fuck fck shit bitch bastard faggot retard whore twat motherf cocksuck dickhead
               asshole arsehole slut porn bollock].freeze
    WHOLE_WORDS = %w[ass arse dick cock prick pussy tits tit boobs fag piss cum jizz spunk douche hoe hoes thot
                     nazi kys stfu wtf cunt wank wanker rapist pedo nigger nigga].freeze
    LEET = { "0" => "o", "1" => "i", "3" => "e", "4" => "a", "5" => "s", "7" => "t", "8" => "b", "@" => "a", "$" => "s", "!" => "i" }.freeze

    module_function

    def defaults = { mode: "cloud", prompt: "One word for how you're feeling right now?", options: [] }

    def config(block)
      c = block.config.deep_symbolize_keys
      mode = c[:mode] == "poll" ? "poll" : "cloud"
      options = Array(c[:options]).map { |o| o.to_s.strip.first(60) }.reject(&:blank?).first(6)
      { mode:, prompt: c[:prompt].to_s.strip.first(140).presence || defaults[:prompt], options: }
    end

    def steps(_block) = 1

    def view(block, _step)
      c = config(block)
      { kind: "WORD_CLOUD", mode: c[:mode], prompt: c[:prompt], options: c[:options], max_words: MAX_WORDS }
    end

    def tally(block, _step)
      c = config(block)
      responses = Response.where(timeline_block: block)
      if c[:mode] == "poll"
        counts = responses.where(key: "choice").group(Arel.sql("value #>> '{}'")).count
        votes = c[:options].each_index.map { |i| counts[i.to_s].to_i }
        { mode: "poll", votes:, total: votes.sum }
      else
        words = responses.where("key LIKE 'word%'").group(Arel.sql("value #>> '{}'")).order(Arel.sql("count(*) DESC")).limit(40).count
        { mode: "cloud", words: words.map { |text, count| { text:, count: } }, total: responses.distinct.count(:participant_id) }
      end
    end

    def respond!(block, _step, participant, data)
      c = config(block)
      if c[:mode] == "poll"
        i = Integer(data["choice"], exception: false)
        raise ArgumentError, "Tap one of the options to vote." unless i && i >= 0 && i < c[:options].size
        Response.record!(block, participant, "choice", i.to_s)
      else
        word = clean(data["word"])
        raise ArgumentError, "Keep it to a word or two, up to 30 letters." unless word
        raise ArgumentError, "Let’s keep the river friendly. Try another word." if rude?(raw_for_filter(data["word"]))
        used = Response.where(timeline_block: block, participant:).where("key LIKE 'word%'").count
        raise ArgumentError, "That’s all #{MAX_WORDS} of your words. Look up and watch them float." if used >= MAX_WORDS
        Response.record!(block, participant, "word#{used}", word)
      end
    end

    def clean(raw)
      word = raw.to_s.unicode_normalize(:nfkc).downcase.gsub(/[^\p{L}\p{N}\s'-]/, "").squish
      word if word.length.between?(1, 30) && word.split.size <= 3
    end

    # Undo look-alike swaps (sh1t, @ss, $hit) before cleaning, since cleaning strips the symbols.
    def raw_for_filter(raw) = raw.to_s.unicode_normalize(:nfkc).downcase.gsub(/[01345780@$!]/, LEET)

    # Checked word by word. Stretched letters still count ("fuuuck", "asss"), but never make a word shorter
    # than the bad one, so "as" isn't mistaken for "ass".
    def rude?(text)
      text.gsub(/[*._-]/, "").gsub(/[^\p{L}\s]/, " ").split.any? do |w|
        s = w.squeeze
        WHOLE_WORDS.any? { |bad| [bad, "#{bad}s"].include?(w) || (s == bad.squeeze && w.length >= bad.length) } ||
          ROOTS.any? { |root| w.include?(root) || s.include?(root.squeeze) }
      end
    end
  end

  module Qna
    module_function

    def defaults = {}
    def config(block) = block.config
    def steps(_block) = 1
    def view(_block, _step) = { kind: "QNA" }
    def tally(_block, _step) = nil
  end

  module Feedback
    KINDS = %w[rating chips text].freeze

    module_function

    def defaults
      { questions: [
        { id: "overall", kind: "rating", prompt: "How was today overall?" },
        { id: "best", kind: "chips", prompt: "What worked best?", options: ["The talks", "The games", "Meeting people", "Q&A"] },
        { id: "improve", kind: "text", prompt: "One thing we should change next time?" }
      ] }
    end

    def config(block)
      qs = Array(block.config.deep_symbolize_keys[:questions]).each_with_index.filter_map do |q, i|
        q = q.to_h.symbolize_keys
        next unless KINDS.include?(q[:kind]) && q[:prompt].present?
        { id: q[:id].presence&.to_s&.first(40) || "q#{i}", kind: q[:kind], prompt: q[:prompt].to_s.strip.first(140),
          options: q[:kind] == "chips" ? Array(q[:options]).map { |o| o.to_s.strip.first(40) }.reject(&:blank?).first(8) : nil }.compact
      end
      { questions: qs.presence || defaults[:questions] }
    end

    def steps(_block) = 1

    def view(block, _step) = { kind: "FEEDBACK", questions: config(block)[:questions] }

    # The stage only ever sees the count; answers stay in the cockpit.
    def tally(block, _step) = { responses: Response.where(timeline_block: block, key: "survey").count }

    def results(block)
      answers = Response.where(timeline_block: block, key: "survey").pluck(:value)
      config(block)[:questions].map do |q|
        values = answers.filter_map { |a| a[q[:id]] }
        summary = case q[:kind]
                  when "rating"
                    nums = values.map(&:to_i).select { |n| n.between?(1, 5) }
                    { average: nums.empty? ? nil : (nums.sum.to_f / nums.size).round(1), count: nums.size,
                      distribution: (1..5).map { |n| nums.count(n) } }
                  when "chips" then { counts: q[:options].map { |o| values.flatten.count(o) }, count: values.size }
                  else { answers: values.map(&:to_s).reject(&:blank?), count: values.size }
                  end
        q.merge(summary)
      end
    end

    def respond!(block, _step, participant, data)
      qs = config(block)[:questions]
      raw = data["answers"].respond_to?(:to_h) ? data["answers"].to_h : {}
      answers = qs.each_with_object({}) do |q, out|
        v = raw[q[:id]]
        case q[:kind]
        when "rating" then out[q[:id]] = v.to_i if v.to_i.between?(1, 5)
        when "chips" then out[q[:id]] = Array(v).map(&:to_s) & q[:options]
        when "text" then out[q[:id]] = v.to_s.squish.first(500) if v.present?
        end
      end
      raise ArgumentError, "Answer at least one question and we’ll send it off." if answers.empty?
      Response.record!(block, participant, "survey", answers)
    end
  end

  REGISTRY = {
    "THIS_OR_THAT" => ThisOrThat, "WORD_CLOUD" => WordCloud, "QNA" => Qna, "FEEDBACK" => Feedback,
    "SPEED_QUIZ" => SpeedQuiz, "SPLIT_WORDS" => SplitWords, "IMPOSTER" => Imposter
  }.freeze
end
