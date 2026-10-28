# The 👍 Fun / 👎 Meh toast phones show after each game block.
class GameFeedback < ApplicationRecord
  RATINGS = %w[UP DOWN].freeze
  TAGS = ["Too fast", "Confusing rules", "Bug", "Too long", "Loved it"].freeze

  belongs_to :timeline_block
  belongs_to :participant

  validates :rating, inclusion: { in: RATINGS }
  validates :tag, inclusion: { in: TAGS }, allow_nil: true
end
