# Batches emoji taps in Redis and flushes them to the stage every 100ms via LiveTicker (spec 9.3), so a room of
# 150 phones tapping 6 times a second becomes 10 messages a second to the projector instead of 900.
module ReactionAggregator
  EMOJIS = %w[❤️ 🔥 👏 🎉 🚀].freeze
  MAX_PER_FRAME = 40

  module_function

  def push(room_code, emoji)
    return unless EMOJIS.include?(emoji)
    particle = { emoji:, x_percent: rand(6..94), timestamp: Time.now.to_f.round(3) }.to_json
    LiveStore.redis.multi do |tx|
      tx.rpush(LiveStore.key("reactions", room_code), particle)
      tx.ltrim(LiveStore.key("reactions", room_code), -MAX_PER_FRAME * 5, -1)
      tx.sadd(LiveStore.key("reactions", "active"), room_code)
    end
  end

  def flush
    redis = LiveStore.redis
    redis.smembers(LiveStore.key("reactions", "active")).each do |code|
      list = LiveStore.key("reactions", code)
      raw, = redis.multi do |tx|
        tx.lrange(list, 0, -1)
        tx.del(list)
      end
      if raw.empty?
        redis.srem(LiveStore.key("reactions", "active"), code)
      else
        LiveBroadcast.emoji_burst(code, raw.last(MAX_PER_FRAME).map { |p| JSON.parse(p) })
      end
    end
  end
end
