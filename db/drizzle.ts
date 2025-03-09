// import { drizzle } from "drizzle-orm/vercel-postgres";
// import { sql } from "@vercel/postgres";

// export const db = drizzle(sql);

import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

config({ path: ".env" }); // or .env.local

export const db = drizzle(process.env.DATABASE_URL!);
