// =============================================================================
// src/lib/db.ts — Turso (libSQL) client singleton
// =============================================================================

import { createClient, Client } from '@libsql/client';

let _client: Client | null = null;
let _initialized = false;

export async function getDb(): Promise<Client> {
  if (!_client) {
    _client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }

  if (!_initialized) {
    await initSchema(_client);
    _initialized = true;
  }

  return _client;
}

async function initSchema(client: Client): Promise<void> {
  await client.batch(
    [
      {
        sql: `CREATE TABLE IF NOT EXISTS slots (
          id          INTEGER PRIMARY KEY AUTOINCREMENT,
          date        TEXT    NOT NULL,
          heure_debut TEXT    NOT NULL,
          heure_fin   TEXT    NOT NULL,
          disponible  INTEGER NOT NULL DEFAULT 1
        )`,
        args: [],
      },
      {
        sql: `CREATE TABLE IF NOT EXISTS bookings (
          id         INTEGER PRIMARY KEY AUTOINCREMENT,
          slot_id    INTEGER NOT NULL REFERENCES slots(id) ON DELETE CASCADE,
          nom        TEXT    NOT NULL,
          email      TEXT    NOT NULL,
          message    TEXT    NOT NULL,
          status     TEXT    NOT NULL DEFAULT 'pending',
          created_at TEXT    NOT NULL DEFAULT (datetime('now'))
        )`,
        args: [],
      },
      {
        sql: `CREATE TABLE IF NOT EXISTS config (
          key   TEXT PRIMARY KEY,
          value TEXT NOT NULL
        )`,
        args: [],
      },
      {
        sql: `INSERT OR IGNORE INTO config (key, value) VALUES ('calendrier_public', '1')`,
        args: [],
      },
    ],
    'write'
  );
}

export default getDb;
