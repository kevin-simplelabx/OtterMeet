# An attendee who joined from their phone. No account: the phone keeps a random token (localStorage) to rejoin.
class Participant < ApplicationRecord
  AVATARS = %w[🦦 🦊 🐻 🐼 🐨 🐯 🦁 🐸 🐵 🐧 🦉 🐙 🦄 🐳 🦋 🐢].freeze

  belongs_to :session

  normalizes :nickname, with: ->(name) { name.squish }

  validates :nickname, presence: true, length: { maximum: 24 },
                       uniqueness: { scope: :session_id, case_sensitive: false, message: "is already swimming in this room. Try another." }
  validates :avatar_icon, inclusion: { in: AVATARS }

  def self.issue!(attrs)
    raw = SecureRandom.urlsafe_base64(24)
    participant = create!(attrs.merge(token_digest: AuthToken.digest(raw), last_seen_at: Time.current))
    [participant, raw]
  end

  def self.find_by_token(raw)
    find_by(token_digest: AuthToken.digest(raw)) if raw.present?
  end

  def as_json(*) = { id:, nickname:, avatar: avatar_icon, total_score:, is_connected: }
end
