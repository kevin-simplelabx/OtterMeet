# Schema from the OtterMeet master spec, section 7. Additions: accounts.password_digest and auth_tokens for host login.
class CreateCoreSchema < ActiveRecord::Migration[8.1]
  def change
    create_table :accounts, id: :uuid do |t|
      t.string :email, null: false, limit: 255, index: { unique: true }
      t.string :name, null: false, limit: 255
      t.string :password_digest, null: false
      t.string :tier, limit: 50, default: "free"
      t.timestamps
    end

    create_table :auth_tokens, id: :uuid do |t|
      t.references :account, type: :uuid, null: false, foreign_key: { on_delete: :cascade }
      t.string :token_digest, null: false, index: { unique: true }
      t.datetime :expires_at, null: false
      t.timestamps
    end

    create_table :sessions, id: :uuid do |t|
      t.references :account, type: :uuid, null: false, foreign_key: { on_delete: :cascade }, index: false
      t.string :room_code, null: false, limit: 6, index: { unique: true }
      t.string :title, null: false, limit: 255
      t.string :status, null: false, limit: 50, default: "DRAFT"
      t.integer :active_block_index, null: false, default: 0
      t.jsonb :settings, null: false, default: { allow_emoji_shower: true, collect_game_feedback: true, max_participants: 150 }
      t.timestamps
      t.index [:account_id, :status], name: "idx_sessions_active"
    end

    create_table :timeline_blocks, id: :uuid do |t|
      t.references :session, type: :uuid, null: false, foreign_key: { on_delete: :cascade }, index: false
      t.integer :position, null: false
      t.string :block_type, null: false, limit: 50
      t.string :title, null: false, limit: 255
      t.integer :duration_estimate_sec, null: false, default: 300
      t.jsonb :config, null: false, default: {}
      t.timestamps
      t.index [:session_id, :position], name: "idx_timeline_sequence"
    end

    create_table :participants, id: :uuid do |t|
      t.references :session, type: :uuid, null: false, foreign_key: { on_delete: :cascade }, index: false
      t.string :socket_client_id, limit: 100
      t.string :nickname, null: false, limit: 50
      t.string :avatar_icon, null: false, limit: 50
      t.string :token_digest, null: false, index: { unique: true }
      t.integer :total_score, null: false, default: 0
      t.boolean :is_connected, null: false, default: true
      t.datetime :last_seen_at
      t.timestamps
      t.index [:session_id, :nickname], unique: true, name: "unique_nickname_per_session"
      t.index [:session_id, :is_connected], name: "idx_participants_session"
    end

    create_table :squads, id: :uuid do |t|
      t.references :timeline_block, type: :uuid, null: false, foreign_key: { on_delete: :cascade }
      t.integer :squad_number, null: false
      t.string :master_tribe_name, limit: 100
      t.timestamps
    end

    create_table :squad_memberships, id: :uuid do |t|
      t.references :squad, type: :uuid, null: false, foreign_key: { on_delete: :cascade }
      t.references :participant, type: :uuid, null: false, foreign_key: { on_delete: :cascade }
      t.string :assigned_word, limit: 100
      t.string :assigned_role, limit: 50, default: "CIVILIAN"
      t.string :verification_pin, limit: 4
      t.integer :merged_stage, null: false, default: 1
      t.timestamps
    end

    create_table :qna_questions, id: :uuid do |t|
      t.references :session, type: :uuid, null: false, foreign_key: { on_delete: :cascade }, index: false
      t.references :participant, type: :uuid, foreign_key: { on_delete: :nullify }
      t.text :content, null: false
      t.boolean :is_anonymous, null: false, default: false
      t.string :status, null: false, limit: 50, default: "PENDING"
      t.integer :upvotes_count, null: false, default: 0
      t.timestamps
      t.index [:session_id, :status, :upvotes_count], order: { upvotes_count: :desc }, name: "idx_qna_feed"
    end

    create_table :game_feedbacks, id: :uuid do |t|
      t.references :timeline_block, type: :uuid, null: false, foreign_key: { on_delete: :cascade }
      t.references :participant, type: :uuid, null: false, foreign_key: { on_delete: :cascade }
      t.string :rating, null: false, limit: 20
      t.string :tag, limit: 50
      t.timestamps
    end
  end
end
