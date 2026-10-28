# Flush batched emoji and live tallies while the web server runs (not in the console, rake or tests).
Rails.application.config.after_initialize do
  LiveTicker.start if defined?(Rails::Server) || ENV["START_LIVE_TICKER"] == "1"
end
