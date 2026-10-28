class SquadMembership < ApplicationRecord
  belongs_to :squad
  belongs_to :participant
end
