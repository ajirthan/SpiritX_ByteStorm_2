// lib/drizzle.ts
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

// Option 1: Check at runtime and throw an error if not set
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}
const sql = postgres(databaseUrl);
export const db = drizzle(sql);

// Option 2: Use the non-null assertion operator (if you're sure it's defined)
// const sql = postgres(process.env.DATABASE_URL!);
// export const db = drizzle(sql);