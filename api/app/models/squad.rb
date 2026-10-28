# A tribe (Split Words) or a table of players for one Imposter round.
class Squad < ApplicationRecord
  belongs_to :timeline_block
  has_many :squad_memberships, -> { order(:pair_number, :speaking_order) }, dependent: :delete_all, inverse_of: :squad
  has_many :participants, through: :squad_memberships
end
