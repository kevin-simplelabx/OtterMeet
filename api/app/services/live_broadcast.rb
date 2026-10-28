# Everything pushed over Action Cable for a live session.
#   room stream  ottermeet:session:<CODE>  every phone, the stage and the cockpit
#   stage stream ottermeet:stage:<CODE>    stage canvas and cockpit only (emoji bursts, live tallies)
#   host stream  ottermeet:host:<ID>       cockpit only (roster, Q&A vetting queue)
module LiveBroadcast
  module_function

  def room_stream(session) = "ottermeet:session:#{session.room_code}"
  def stage_stream(session) = "ottermeet:stage:#{session.room_code}"
  def host_stream(session) = "ottermeet:host:#{session.id}"

  def public_state(session, rev: LiveStore.rev(session))
    block = session.active_block
    step = LiveStore.step(session)
    {
      code: session.room_code, title: session.title, status: session.status, rev:,
      blackout: LiveStore.blackout?(session),
      block_index: session.active_block_index, block_count: session.timeline_blocks.size,
      block: block && { id: block.id, block_type: block.block_type, title: block.title,
                        duration_sec: block.duration_estimate_sec },
      step:, step_count: Activities.steps(block),
      activity: Activities.view(block, step),
      allow_emoji_shower: session.settings.fetch("allow_emoji_shower", true)
    }
  end

  def state(session)
    ActionCable.server.broadcast(room_stream(session),
                                 { event: "STATE", **public_state(session, rev: LiveStore.next_rev(session)) })
  end

  def tally(session, block)
    return unless block
    step = block.id == session.active_block&.id ? LiveStore.step(session) : 0
    data = Activities.tally(block, step)
    ActionCable.server.broadcast(stage_stream(session), { event: "TALLY", block_id: block.id, step:, **data }) if data
  end

  # --- each phone's own view (their word, PIN, role, result) ---

  def participant_stream(participant) = "ottermeet:participant:#{participant.id}"

  def mine_json(session, participant)
    block = session.active_block
    step = LiveStore.step(session)
    { event: "MINE", block_id: block&.id, step:, **Activities.mine(block, step, participant), score: participant.reload.total_score }
  end

  def mine(session, participant)
    ActionCable.server.broadcast(participant_stream(participant), mine_json(session, participant))
  end

  def mine_all(session)
    session.participants.where(is_connected: true).find_each { |p| mine(session, p) }
  end

  def roster_json(session)
    participants = session.participants.order(:created_at).to_a
    { count: participants.count { |p| p.is_connected }, total: participants.size, participants: participants.map(&:as_json) }
  end

  def roster(session)
    roster = roster_json(session)
    ActionCable.server.broadcast(host_stream(session), { event: "ROSTER", **roster })
    # The stage lobby shows the crowd's avatars; phones only need the head count.
    ActionCable.server.broadcast(stage_stream(session), { event: "CROWD", count: roster[:count],
                                                          avatars: roster[:participants].select { |p| p[:is_connected] }.last(60).map { |p| p[:avatar] } })
  end

  # --- Town Hall Q&A ---

  def qna_feed_json(session)
    { questions: session.qna_questions.feed.includes(:participant).limit(50).map(&:public_json), spotlight: LiveStore.spotlight(session) }
  end

  def qna_queue_json(session)
    { questions: session.qna_questions.where(status: "PENDING").includes(:participant).order(:created_at).map(&:host_json) }
  end

  def qna(session)
    ActionCable.server.broadcast(room_stream(session), { event: "QNA_FEED", **qna_feed_json(session) })
    ActionCable.server.broadcast(host_stream(session), { event: "QNA_QUEUE", **qna_queue_json(session) })
  end

  def mark_qna_dirty(session) = LiveStore.redis.sadd(LiveStore.key("dirty"), "#{session.id}:qna")

  # Phones show a 10-second 👍 Fun / 👎 Meh toast after each game.
  def feedback_prompt(session, block)
    ActionCable.server.broadcast(room_stream(session), { event: "FEEDBACK_PROMPT", block_id: block.id, title: block.title, tags: GameFeedback::TAGS })
  end

  def emoji_burst(room_code, particles)
    ActionCable.server.broadcast("ottermeet:stage:#{room_code}", { event: "EMOJI_BURST", particles: })
  end
end
