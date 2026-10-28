class QnaUpvote < ApplicationRecord
  belongs_to :qna_question, counter_cache: :upvotes_count
  belongs_to :participant
end
