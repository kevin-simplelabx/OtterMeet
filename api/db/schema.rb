# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_10_28_150000) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "accounts", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "email", limit: 255, null: false
    t.string "name", limit: 255, null: false
    t.string "password_digest", null: false
    t.string "tier", limit: 50, default: "free"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_accounts_on_email", unique: true
  end

  create_table "auth_tokens", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "account_id", null: false
    t.string "token_digest", null: false
    t.datetime "expires_at", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_auth_tokens_on_account_id"
    t.index ["token_digest"], name: "index_auth_tokens_on_token_digest", unique: true
  end

  create_table "game_feedbacks", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "timeline_block_id", null: false
    t.uuid "participant_id", null: false
    t.string "rating", limit: 20, null: false
    t.string "tag", limit: 50
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["participant_id"], name: "index_game_feedbacks_on_participant_id"
    t.index ["timeline_block_id", "participant_id"], name: "index_game_feedbacks_on_timeline_block_id_and_participant_id", unique: true
    t.index ["timeline_block_id"], name: "index_game_feedbacks_on_timeline_block_id"
  end

  create_table "participants", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "session_id", null: false
    t.string "socket_client_id", limit: 100
    t.string "nickname", limit: 50, null: false
    t.string "avatar_icon", limit: 50, null: false
    t.string "token_digest", null: false
    t.integer "total_score", default: 0, null: false
    t.boolean "is_connected", default: true, null: false
    t.datetime "last_seen_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["session_id", "is_connected"], name: "idx_participants_session"
    t.index ["session_id", "nickname"], name: "unique_nickname_per_session", unique: true
    t.index ["token_digest"], name: "index_participants_on_token_digest", unique: true
  end

  create_table "qna_questions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "session_id", null: false
    t.uuid "participant_id"
    t.text "content", null: false
    t.boolean "is_anonymous", default: false, null: false
    t.string "status", limit: 50, default: "PENDING", null: false
    t.integer "upvotes_count", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["participant_id"], name: "index_qna_questions_on_participant_id"
    t.index ["session_id", "status", "upvotes_count"], name: "idx_qna_feed", order: { upvotes_count: :desc }
  end

  create_table "qna_upvotes", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "qna_question_id", null: false
    t.uuid "participant_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["participant_id"], name: "index_qna_upvotes_on_participant_id"
    t.index ["qna_question_id", "participant_id"], name: "index_qna_upvotes_on_qna_question_id_and_participant_id", unique: true
  end

  create_table "responses", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "timeline_block_id", null: false
    t.uuid "participant_id", null: false
    t.string "key", limit: 40, null: false
    t.jsonb "value", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["participant_id"], name: "index_responses_on_participant_id"
    t.index ["timeline_block_id", "key"], name: "idx_responses_tally"
    t.index ["timeline_block_id", "participant_id", "key"], name: "idx_responses_unique", unique: true
  end

  create_table "sessions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "account_id", null: false
    t.string "room_code", limit: 6, null: false
    t.string "title", limit: 255, null: false
    t.string "status", limit: 50, default: "DRAFT", null: false
    t.integer "active_block_index", default: 0, null: false
    t.jsonb "settings", default: {"max_participants" => 150, "allow_emoji_shower" => true, "collect_game_feedback" => true}, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id", "status"], name: "idx_sessions_active"
    t.index ["room_code"], name: "index_sessions_on_room_code", unique: true
  end

  create_table "squad_memberships", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "squad_id", null: false
    t.uuid "participant_id", null: false
    t.string "assigned_word", limit: 100
    t.string "assigned_role", limit: 50, default: "CIVILIAN"
    t.string "verification_pin", limit: 4
    t.integer "merged_stage", default: 1, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "pair_number", default: 0, null: false
    t.boolean "confirmed", default: false, null: false
    t.integer "speaking_order", default: 0, null: false
    t.index ["participant_id"], name: "index_squad_memberships_on_participant_id"
    t.index ["squad_id"], name: "index_squad_memberships_on_squad_id"
  end

  create_table "squads", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "timeline_block_id", null: false
    t.integer "squad_number", null: false
    t.string "master_tribe_name", limit: 100
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "round", default: 0, null: false
    t.string "clue", limit: 100
    t.index ["timeline_block_id", "round"], name: "index_squads_on_timeline_block_id_and_round"
    t.index ["timeline_block_id"], name: "index_squads_on_timeline_block_id"
  end

  create_table "timeline_blocks", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "session_id", null: false
    t.integer "position", null: false
    t.string "block_type", limit: 50, null: false
    t.string "title", limit: 255, null: false
    t.integer "duration_estimate_sec", default: 300, null: false
    t.jsonb "config", default: {}, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["session_id", "position"], name: "idx_timeline_sequence"
  end

  add_foreign_key "auth_tokens", "accounts", on_delete: :cascade
  add_foreign_key "game_feedbacks", "participants", on_delete: :cascade
  add_foreign_key "game_feedbacks", "timeline_blocks", on_delete: :cascade
  add_foreign_key "participants", "sessions", on_delete: :cascade
  add_foreign_key "qna_questions", "participants", on_delete: :nullify
  add_foreign_key "qna_questions", "sessions", on_delete: :cascade
  add_foreign_key "qna_upvotes", "participants", on_delete: :cascade
  add_foreign_key "qna_upvotes", "qna_questions", on_delete: :cascade
  add_foreign_key "responses", "participants", on_delete: :cascade
  add_foreign_key "responses", "timeline_blocks", on_delete: :cascade
  add_foreign_key "sessions", "accounts", on_delete: :cascade
  add_foreign_key "squad_memberships", "participants", on_delete: :cascade
  add_foreign_key "squad_memberships", "squads", on_delete: :cascade
  add_foreign_key "squads", "timeline_blocks", on_delete: :cascade
  add_foreign_key "timeline_blocks", "sessions", on_delete: :cascade
end
