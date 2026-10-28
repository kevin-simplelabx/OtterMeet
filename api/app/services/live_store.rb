# Redis for fast-changing live state that doesn't belong in Postgres: state revisions, blackout, throttles, reactions.
module LiveStore
  module_function

  def redis
    @redis ||= Redis.new(url: ENV.fetch("REDIS_URL", "redis://localhost:6379/2"))
  end

  def key(*parts) = ["om", *parts].join(":")

  def next_rev(session) = redis.incr(key("rev", session.id))
  def rev(session) = redis.get(key("rev", session.id)).to_i

  def blackout?(session) = redis.get(key("blackout", session.id)) == "1"
  def set_blackout(session, on) = redis.set(key("blackout", session.id), on ? "1" : "0")

  # Position inside the current block (e.g. This or That: question 2, revealed). Resets when the block changes.
  def step(session) = redis.get(key("step", session.id)).to_i
  def set_step(session, step) = redis.set(key("step", session.id), step)

  # The Q&A question the host has put up on the big screen.
  def spotlight(session) = redis.get(key("spotlight", session.id))
  def set_spotlight(session, id) = id ? redis.set(key("spotlight", session.id), id) : redis.del(key("spotlight", session.id))

  # Fixed-window limiter: true while the caller is under `limit` hits in the current second.
  def allow?(name, limit:)
    k = key("throttle", name, Time.now.to_i)
    count, = redis.multi do |tx|
      tx.incr(k)
      tx.expire(k, 2)
    end
    count <= limit
  end

  def allow_per_minute?(name, limit:)
    k = key("throttle", name, Time.now.to_i / 60)
    count, = redis.multi do |tx|
      tx.incr(k)
      tx.expire(k, 120)
    end
    count <= limit
  end
end
