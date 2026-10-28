class Response < ApplicationRecord
  belongs_to :timeline_block
  belongs_to :participant

  # Upserts one answer, so changing your mind replaces the old one.
  def self.record!(block, participant, key, value)
    upsert({ timeline_block_id: block.id, participant_id: participant.id, key:, value: },
           unique_by: :idx_responses_unique, record_timestamps: true)
  end
end
