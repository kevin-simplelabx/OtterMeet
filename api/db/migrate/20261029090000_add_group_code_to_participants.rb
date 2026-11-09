# Hosts can set up tables / groups for a session (sessions.settings["groups"]); attendees pick theirs when joining.
class AddGroupCodeToParticipants < ActiveRecord::Migration[8.1]
  def change
    add_column :participants, :group_code, :string, limit: 20
    add_index :participants, [:session_id, :group_code]
  end
end
