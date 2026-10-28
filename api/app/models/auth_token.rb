# A host login. The browser holds the raw token in an httpOnly cookie; only its SHA-256 is stored.
class AuthToken < ApplicationRecord
  TTL = 30.days

  belongs_to :account

  def self.issue!(account)
    raw = SecureRandom.urlsafe_base64(32)
    create!(account:, token_digest: digest(raw), expires_at: TTL.from_now)
    raw
  end

  def self.find_account(raw)
    return if raw.blank?
    where(token_digest: digest(raw)).where("expires_at > ?", Time.current).first&.account
  end

  def self.revoke(raw)
    where(token_digest: digest(raw)).delete_all if raw.present?
  end

  def self.digest(raw) = Digest::SHA256.hexdigest(raw)
end
