# One background timer per server process. Every 100ms it flushes batched emoji to the stage; every 300ms
# it pushes fresh tallies for any block or Q&A feed that changed. A room of 150 voting at once becomes
# about three updates a second instead of 150.
module LiveTicker
  TICK = 0.1
  TALLY_EVERY = 3

  module_function

  def start
    @ticks = 0
    @timer ||= Concurrent::TimerTask.new(execution_interval: TICK) do
      ReactionAggregator.flush
      flush_dirty if ((@ticks += 1) % TALLY_EVERY).zero?
    rescue => e
      Rails.logger.error("[LiveTicker] #{e.class}: #{e.message}")
    end.tap(&:execute)
  end

  def flush_dirty
    redis = LiveStore.redis
    key = LiveStore.key("dirty")
    members, = redis.multi do |tx|
      tx.smembers(key)
      tx.del(key)
    end
    return if members.empty?

    Rails.application.executor.wrap do
      members.each do |member|
        session_id, target = member.split(":", 2)
        session = Session.includes(:timeline_blocks).find_by(id: session_id)
        next unless session
        if target == "qna"
          LiveBroadcast.qna(session)
        else
          LiveBroadcast.tally(session, session.timeline_blocks.find { |b| b.id == target })
        end
      end
    end
  end
end
