import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';

mkdirSync('data', { recursive: true });

export const db = new DatabaseSync(process.env.DB_PATH || 'data/ottermeet.db');

db.exec(`
  PRAGMA foreign_keys = ON;
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS hosts (
    id            INTEGER PRIMARY KEY,
    name          TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- Login tokens. Only a SHA-256 of the cookie value is stored.
  CREATE TABLE IF NOT EXISTS auth_tokens (
    token_hash TEXT PRIMARY KEY,
    host_id    INTEGER NOT NULL REFERENCES hosts(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL
  );

  -- Sessions a host runs (meetups, workshops, talks).
  CREATE TABLE IF NOT EXISTS event_sessions (
    id           INTEGER PRIMARY KEY,
    host_id      INTEGER NOT NULL REFERENCES hosts(id) ON DELETE CASCADE,
    title        TEXT NOT NULL,
    description  TEXT NOT NULL DEFAULT '',
    starts_at    TEXT NOT NULL,
    duration_min INTEGER NOT NULL DEFAULT 60,
    format       TEXT NOT NULL DEFAULT 'in_person',
    location     TEXT NOT NULL DEFAULT '',
    link         TEXT NOT NULL DEFAULT '',
    capacity     INTEGER,
    status       TEXT NOT NULL DEFAULT 'draft',
    created_at   TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_sessions_host ON event_sessions(host_id, starts_at);
`);
