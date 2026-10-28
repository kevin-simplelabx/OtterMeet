class TimelineBlock < ApplicationRecord
  TYPES = %w[LOBBY SPLIT_WORDS IMPOSTER THIS_OR_THAT WORD_CLOUD SPEED_QUIZ QNA FEEDBACK HOLDING BLACKOUT BREAK].freeze

  belongs_to :session

  normalizes :title, with: ->(title) { title.strip }

  validates :block_type, inclusion: { in: TYPES }
  validates :title, presence: true, length: { maximum: 120 }
  validates :duration_estimate_sec, numericality: { only_integer: true, in: 0..14_400 }
  validates :position, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  def as_json(*) = { id:, position:, block_type:, title:, duration_estimate_sec:, config: }
end
