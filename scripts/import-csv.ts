// scripts/import-csv.ts
import fs from "fs";
import path from "path";
import csvParser from "csv-parser";
import { db } from "../lib/drizzle";
import { players } from "../db/schema";

// Define the expected CSV row structure with the actual headers
interface PlayerCSV {
  Name: string;
  University: string;
  Category: string;
  "Total Runs": string;
  "Balls Faced": string;
  "Innings Played": string;
  Wickets: string;
  "Overs Bowled": string;
  "Runs Conceded": string;
}

// Define the type for the record to be inserted into the database.
interface PlayerRecord {
  name: string;
  university: string;
  battingAverage: string | null; // You might derive this from other fields if needed
  battingStrikeRate: string | null; // Ditto
  bowlingEconomy: string | null; // Ditto
  bowlingStrikeRate: string | null; // Ditto
  runs: number | null;
  wickets: number | null;
}

async function importCSV() {
  const csvFilePath = path.join(process.cwd(), "sample_data.csv");
  const records: PlayerRecord[] = [];

  fs.createReadStream(csvFilePath)
    .pipe(csvParser())
    .on("data", (row: PlayerCSV) => {
      // Check required fields using the correct header names
      if (!row.Name || !row.University) {
        console.warn("Skipping row due to missing required fields:", row);
        return;
      }

      // Map the CSV row to our PlayerRecord.
      // For numeric columns, if you have a column in CSV that corresponds to, say, runs, we use that.
      // You might need to adjust mapping for battingAverage etc. if they're not present.
      const player: PlayerRecord = {
        name: row.Name,
        university: row.University,
        battingAverage: null, // Or derive if available
        battingStrikeRate: null, // Or derive if available
        bowlingEconomy: null, // Or derive if available
        bowlingStrikeRate: null, // Or derive if available
        runs: row["Total Runs"] ? parseInt(row["Total Runs"], 10) : null,
        wickets: row.Wickets ? parseInt(row.Wickets, 10) : null,
      };
      records.push(player);
    })
    .on("end", async () => {
      console.log(`Parsed ${records.length} valid records from CSV.`);
      if (records.length === 0) {
        console.error("No valid records to insert.");
        return;
      }
      try {
        // Insert the records in bulk
        const result = await db.insert(players).values(records).returning();
        console.log("Inserted records:", result);
      } catch (error) {
        console.error("Error inserting records:", error);
      }
    })
    .on("error", (error) => {
      console.error("Error reading CSV file:", error);
    });
}

importCSV();
