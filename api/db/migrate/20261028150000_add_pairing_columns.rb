# Phase 3: Split Words pairs and Imposter rounds reuse the spec's squads / squad_memberships tables.
#   squads.round                       Imposter round (Split Words uses 0)
#   squad_memberships.pair_number      which pair (or trio) inside the tribe
#   squad_memberships.confirmed        this person's match has been verified by PIN
#   squad_memberships.speaking_order   Imposter: the order clues are given in
class AddPairingColumns < ActiveRecord::Migration[8.1]
  def change
    add_column :squads, :round, :integer, null: false, default: 0
    add_column :squads, :clue, :string, limit: 100
    add_column :squad_memberships, :pair_number, :integer, null: false, default: 0
    add_column :squad_memberships, :confirmed, :boolean, null: false, default: false
    add_column :squad_memberships, :speaking_order, :integer, null: false, default: 0
    add_index :squads, [:timeline_block_id, :round]
  end
end
