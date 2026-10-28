# Phase 2 activities. `responses` holds one attendee answer per block and key:
#   THIS_OR_THAT "q<n>" => "A" | "B"   WORD_CLOUD "word<n>" => "text"   poll "choice" => index   FEEDBACK "survey" => {...}
class CreateActivityTables < ActiveRecord::Migration[8.1]
  def change
    create_table :responses, id: :uuid do |t|
      t.references :timeline_block, type: :uuid, null: false, foreign_key: { on_delete: :cascade }, index: false
      t.references :participant, type: :uuid, null: false, foreign_key: { on_delete: :cascade }
      t.string :key, null: false, limit: 40
      t.jsonb :value, null: false
      t.timestamps
      t.index [:timeline_block_id, :participant_id, :key], unique: true, name: "idx_responses_unique"
      t.index [:timeline_block_id, :key], name: "idx_responses_tally"
    end

    create_table :qna_upvotes, id: :uuid do |t|
      t.references :qna_question, type: :uuid, null: false, foreign_key: { on_delete: :cascade }, index: false
      t.references :participant, type: :uuid, null: false, foreign_key: { on_delete: :cascade }
      t.timestamps
      t.index [:qna_question_id, :participant_id], unique: true
    end

    add_index :game_feedbacks, [:timeline_block_id, :participant_id], unique: true
  end
end
