# One channel per room. Phones subscribe as participants; the cockpit and stage subscribe as the host
# (role: "host" or "stage"). Host-only actions check the subscriber owns the session.
class SessionChannel < ApplicationCable::Channel
  REACTIONS_PER_SECOND = 6
  ANSWERS_PER_SECOND = 4
  QUESTIONS_PER_MINUTE = 3

  def subscribed
    @session = Session.includes(:timeline_blocks).find_by(room_code: params[:room_code].to_s.upcase)
    return reject unless @session

    if participant && participant.session_id == @session.id
      stream_from LiveBroadcast.room_stream(@session)
      stream_from LiveBroadcast.participant_stream(participant)
      participant.update_columns(is_connected: true, last_seen_at: Time.current)
      LiveBroadcast.roster(@session)
      transmit_mine
      transmit({ event: "QNA_FEED", **LiveBroadcast.qna_feed_json(@session), upvoted: upvoted_ids })
    elsif account && @session.account_id == account.id
      stream_from LiveBroadcast.room_stream(@session)
      stream_from LiveBroadcast.stage_stream(@session)
      transmit({ event: "QNA_FEED", **LiveBroadcast.qna_feed_json(@session) })
      if params[:role] == "host"
        stream_from LiveBroadcast.host_stream(@session)
        transmit({ event: "QNA_QUEUE", **LiveBroadcast.qna_queue_json(@session) })
      end
      LiveBroadcast.tally(@session, @session.active_block)
    else
      return reject
    end
    # Every (re)connect gets the room as it is now, so a dropped phone or a sleeping laptop can't miss a step.
    transmit({ event: "STATE", **LiveBroadcast.public_state(@session) })
  end

  def unsubscribed
    return unless @session && participant
    participant.update_columns(is_connected: false, last_seen_at: Time.current)
    LiveBroadcast.roster(@session)
  end

  # --- attendee actions ---

  def send_reaction(data)
    return unless attendee? && @session.settings.fetch("allow_emoji_shower", true)
    return unless LiveStore.allow?("reaction:#{participant.id}", limit: REACTIONS_PER_SECOND)
    ReactionAggregator.push(@session.room_code, data["emoji"])
  end

  # An answer for the block on screen: { block_id, choice | word | answers }.
  def respond(data)
    return unless attendee?
    return unless LiveStore.allow?("answer:#{participant.id}", limit: ANSWERS_PER_SECOND)
    @session.reload
    block = @session.active_block
    return error("That one has floated downstream. Look up for what’s next.") unless block && block.id == data["block_id"]
    affected = Activities.respond!(@session, block, LiveStore.step(@session), participant, data)
    transmit_mine
    affected.each { |p| LiveBroadcast.mine(@session, p) }
  rescue ArgumentError, ActiveRecord::RecordInvalid => e
    error(e.message)
  end

  def ask_qna(data)
    return unless attendee?
    return error("Speedy paws. You can ask three questions a minute.") unless LiveStore.allow_per_minute?("ask:#{participant.id}", limit: QUESTIONS_PER_MINUTE)
    @session.qna_questions.create!(participant:, content: data["content"], is_anonymous: ActiveModel::Type::Boolean.new.cast(data["anonymous"]))
    transmit({ event: "QNA_ASKED" })
    LiveBroadcast.mark_qna_dirty(@session)
  rescue ActiveRecord::RecordInvalid => e
    error(e.record.errors.full_messages.first)
  end

  def upvote_qna(data)
    return unless attendee?
    question = @session.qna_questions.where(status: "APPROVED").find_by(id: data["question_id"])
    return unless question
    existing = question.qna_upvotes.find_by(participant:)
    existing ? existing.destroy! : question.qna_upvotes.create!(participant:)
    transmit({ event: "QNA_UPVOTED", upvoted: upvoted_ids })
    LiveBroadcast.mark_qna_dirty(@session)
  rescue ActiveRecord::RecordNotUnique
    nil
  end

  def submit_feedback(data)
    return unless attendee?
    block = @session.timeline_blocks.find { |b| b.id == data["block_id"] }
    return unless block && Activities.game?(block)
    feedback = GameFeedback.find_or_initialize_by(timeline_block: block, participant:)
    feedback.update!(rating: data["rating"], tag: data["tag"].presence)
  rescue ActiveRecord::RecordInvalid
    nil
  end

  # --- host actions (presentation clicker, moderation) ---

  def goto_block(data)
    host_only { move_to(data["index"].to_i, 0) }
  end

  # Next/Back walk through a block's steps (e.g. vote, reveal, next question) before changing block.
  def next_block
    host_only do
      step = LiveStore.step(@session)
      if step + 1 < Activities.steps(@session.active_block)
        set_step(step + 1)
      else
        move_to(@session.active_block_index + 1, 0)
      end
    end
  end

  def prev_block
    host_only do
      step = LiveStore.step(@session)
      step.positive? ? set_step(step - 1) : move_to(@session.active_block_index - 1, 0)
    end
  end

  def toggle_blackout(data = {})
    host_only { LiveStore.set_blackout(@session, data.key?("on") ? data["on"] : !LiveStore.blackout?(@session)) }
  end

  # Straggler rescue (S key): slots latecomers and stranded people into Split Words pairs.
  def rescue_stragglers
    return unless host?
    @session.reload
    block = @session.active_block
    return unless block&.block_type == "SPLIT_WORDS"
    Activities::SplitWords.rescue!(@session, block)
    LiveBroadcast.mine_all(@session)
    LiveBroadcast.tally(@session, block)
  end

  def moderate_qna(data)
    return unless host?
    question = @session.qna_questions.find_by(id: data["question_id"])
    return unless question
    case data["decision"]
    when "approve" then question.update!(status: "APPROVED")
    when "reject" then question.update!(status: "REJECTED")
    when "answered" then question.update!(status: "ANSWERED")
    when "spotlight" then LiveStore.set_spotlight(@session, LiveStore.spotlight(@session) == question.id ? nil : question.id)
    end
    LiveStore.set_spotlight(@session, nil) if %w[reject answered].include?(data["decision"]) && LiveStore.spotlight(@session) == question.id
    LiveBroadcast.qna(@session)
  end

  private

  # Re-reads the session at most every 2s, so a busy room's taps don't each hit the database.
  def attendee?
    return false unless participant
    if !@checked_at || @checked_at < 2.seconds.ago
      @session.reload
      @checked_at = Time.current
    end
    @session.live?
  end
  def host? = account && @session.account_id == account.id

  def move_to(index, step)
    index = index.clamp(0, [@session.timeline_blocks.size - 1, 0].max)
    leaving = @session.active_block
    if leaving && leaving.id != @session.timeline_blocks[index]&.id
      @scores_changed |= Activities.on_leave(@session, leaving, LiveStore.step(@session))
    end
    @session.update!(active_block_index: index)
    LiveStore.set_step(@session, step)
    LiveStore.set_blackout(@session, false)
    @scores_changed |= Activities.on_enter(@session, @session.active_block, step)
    if leaving && leaving.id != @session.active_block&.id && Activities.game?(leaving) && @session.settings.fetch("collect_game_feedback", true)
      LiveBroadcast.feedback_prompt(@session, leaving)
    end
  end

  def set_step(step)
    LiveStore.set_step(@session, step)
    @scores_changed |= Activities.on_enter(@session, @session.active_block, step)
  end

  def host_only
    return unless host?
    @session.reload
    @scores_changed = false
    yield
    LiveBroadcast.state(@session)
    LiveBroadcast.tally(@session, @session.active_block)
    # Phones get their own view again when the game deals per-person data, or when points just changed
    # (e.g. a This or That reveal), so totals only move at the reveal.
    LiveBroadcast.mine_all(@session) if @scores_changed || Activities.personal?(@session.active_block)
  end

  def upvoted_ids = QnaUpvote.joins(:qna_question).where(participant:, qna_questions: { session_id: @session.id }).pluck(:qna_question_id)

  def transmit_mine = transmit(LiveBroadcast.mine_json(@session.reload, participant))

  def error(message) = transmit({ event: "ERROR", message: })
end
