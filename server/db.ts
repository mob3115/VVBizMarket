import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

// Supabase transaction pooler (port 6543) — optimised for serverless
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 3,                      // Low limit for serverless — pooler handles the rest
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 10000,
  ssl: { rejectUnauthorized: false }, // Required for Supabase
});

pool.on("error", (err) => {
  console.error("Unexpected pool error:", err);
});

export const db = drizzle(pool, { schema });
export { pool };
