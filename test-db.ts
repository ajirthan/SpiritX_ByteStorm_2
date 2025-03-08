// test-db.ts
import postgres from "postgres";

// Ensure that the DATABASE_URL environment variable is set
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not defined");
}

// Initialize the postgres client with the connection string
const sql = postgres(connectionString);

async function testConnection() {
  try {
    // Execute a simple query
    const result = await sql`SELECT 1 as test`;
    // Get the first row from the result
    const row = result[0];
    console.log("Query result:", row);
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

// Run the test
testConnection();