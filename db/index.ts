import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const url =
  process.env.TURSO_DATABASE_URL ||
  process.env.DATABASE_URL ||
  (process.env.VERCEL ? "file:/tmp/sqite.db" : "file:sqite.db");

const client = createClient({
  url,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });

let initialized = false;
export async function ensureDb() {
  if (initialized) return;
  await client.execute(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      createdAt TEXT
    );
  `);
  initialized = true;
}
