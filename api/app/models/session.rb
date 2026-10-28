# A live event: one room code and QR code for the whole day, run as a timeline of activity blocks.
class Session < ApplicationRecord
  STATUSES = %w[DRAFT LIVE COMPLETED].freeze
  ROOM_CODE_ALPHABET = %w[A B C D E F G H J K L M N P Q R S T U V W X Y Z 2 3 4 5 6 7 8 9].freeze

  belongs_to :account
  has_many :timeline_blocks, -> { order(:position) }, dependent: :destroy, inverse_of: :session
  has_many :participants, dependent: :destroy
  has_many :qna_questions, dependent: :destroy

  normalizes :title, with: ->(title) { title.strip }

  validates :title, presence: true, length: { maximum: 120 }
  validates :status, inclusion: { in: STATUSES }
  validates :room_code, presence: true, uniqueness: true, length: { in: 4..6 }
  validate :one_live_session_per_account, if: -> { status == "LIVE" && will_save_change_to_status? }

  before_validation :assign_room_code, on: :create

  scope :live, -> { where(status: "LIVE") }

  def live? = status == "LIVE"
  def active_block = timeline_blocks[active_block_index]

  def as_json(*)
    { id:, title:, room_code:, status:, active_block_index:, settings:, created_at:, updated_at:,
      blocks: timeline_blocks.map(&:as_json) }
  end

  private

  # Unambiguous 4-letter codes (no 0/O, 1/I) are easy to read off a projector.
  def assign_room_code
    self.room_code ||= loop do
      code = Array.new(4) { ROOM_CODE_ALPHABET.sample }.join
      break code unless Session.exists?(room_code: code)
    end
  end

  def one_live_session_per_account
    if account.sessions.live.where.not(id:).exists?
      errors.add(:base, "You’ve already got a session live. End that one before you launch another.")
    end
  end
end
