// drizzle.config.ts
import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

// Load environment variables from .env file
config({ path: '.env.local' });

export default defineConfig({
  schema: "./src/db/schema.ts", // Adjust the path if your schema is located elsewhere (e.g., "./db/schema.ts")
  out: "./migrations",          // Folder where migration files will be stored
  dialect: "postgresql",        // Specify the SQL dialect for PostgreSQL
  dbCredentials: {
    url: process.env.DATABASE_URL!,  // The connection string from your environment variables
  },
});