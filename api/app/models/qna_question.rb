class QnaQuestion < ApplicationRecord
  STATUSES = %w[PENDING APPROVED REJECTED ANSWERED].freeze

  belongs_to :session
  belongs_to :participant, optional: true
  has_many :qna_upvotes, dependent: :delete_all

  normalizes :content, with: ->(text) { text.squish }

  validates :content, presence: true, length: { maximum: 280 }
  validates :status, inclusion: { in: STATUSES }

  scope :feed, -> { where(status: %w[APPROVED ANSWERED]).order(status: :asc, upvotes_count: :desc, created_at: :asc) }

  def author_name = is_anonymous ? "Anonymous" : (participant&.nickname || "Anonymous")

  def public_json = { id:, content:, author: author_name, upvotes: upvotes_count, status: }
  def host_json = public_json.merge(avatar: is_anonymous ? nil : participant&.avatar_icon, created_at:)
end
