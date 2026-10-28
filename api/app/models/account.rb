class Account < ApplicationRecord
  has_secure_password
  has_many :auth_tokens, dependent: :delete_all
  has_many :sessions, dependent: :destroy

  normalizes :email, with: ->(email) { email.strip.downcase }
  normalizes :name, with: ->(name) { name.strip }

  validates :name, presence: true, length: { maximum: 80 }
  validates :email, presence: true, length: { maximum: 255 }, format: { with: URI::MailTo::EMAIL_REGEXP },
                    uniqueness: { message: "already has an account. Try logging in instead." }
  validates :password, length: { minimum: 8, maximum: 200 }, allow_nil: true

  def as_json(*) = { id:, name:, email:, tier: }
end
