// app/api/admin/stats/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { players } from "@/db/schema";

// Define an interface for the expected player record.
interface PlayerRecord {
  id: number;
  name: string;
  university: string;
  runs: number | null;
  wickets: number | null;
  ballsFaced: number; // Expected from CSV import
  inningsPlayed: number; // Expected from CSV import
  oversBowled: number; // Expected from CSV import
  runsConceded: number; // Expected from CSV import
  createdAt: Date | null;
}

// Helper function to compute player stats from a PlayerRecord.
function computePlayerStats(p: PlayerRecord) {
  // Use 0 as default if any numeric value is missing.
  const runs = p.runs ?? 0;
  const wickets = p.wickets ?? 0;

  // Batting Average: runs / inningsPlayed if inningsPlayed > 0, else 0.
  const battingAverage = p.inningsPlayed > 0 ? runs / p.inningsPlayed : 0;

  // Batting Strike Rate: (runs / ballsFaced) * 100 if ballsFaced > 0, else 0.
  const battingStrikeRate = p.ballsFaced > 0 ? (runs / p.ballsFaced) * 100 : 0;

  // Bowling Economy: runsConceded / oversBowled if oversBowled > 0, else 0.
  const bowlingEconomy = p.oversBowled > 0 ? p.runsConceded / p.oversBowled : 0;

  // Bowling Strike Rate: (oversBowled * 6) / wickets if wickets > 0, else 0.
  const bowlingStrikeRate = wickets > 0 ? (p.oversBowled * 6) / wickets : 0;

  // Calculate batting and bowling points using the provided formulas.
  const battingPoints = battingStrikeRate / 5 + battingAverage * 0.8;
  let bowlingPoints = 0;
  if (bowlingStrikeRate > 0) {
    bowlingPoints += 500 / bowlingStrikeRate;
  }
  if (bowlingEconomy > 0) {
    bowlingPoints += 140 / bowlingEconomy;
  }
  const playerPoints = battingPoints + bowlingPoints;

  // Calculate player value: Multiply points by 1000 then round to the nearest multiple of 50,000.
  const rawValue = playerPoints * 1000;
  const playerValue = Math.round(rawValue / 50000) * 50000;

  return {
    battingAverage,
    battingStrikeRate,
    bowlingEconomy,
    bowlingStrikeRate,
    playerPoints,
    playerValue,
  };
}

export async function GET() {
  try {
    // Fetch raw player records from the database.
    // The DB record might not have ballsFaced, inningsPlayed, oversBowled, or runsConceded.
    // We map each record to our PlayerRecord interface with default values for missing fields.
    const rawPlayers = await db.select().from(players);
    const playersData: PlayerRecord[] = rawPlayers.map((p) => ({
      id: p.id,
      name: p.name,
      university: p.university,
      runs: p.runs,
      wickets: p.wickets,
      // If these fields are missing in the DB record, default them to 0.
      ballsFaced: (p as { ballsFaced?: number }).ballsFaced ?? 0,
      inningsPlayed: (p as { inningsPlayed?: number }).inningsPlayed ?? 0,
      oversBowled: (p as { oversBowled?: number }).oversBowled ?? 0,
      runsConceded: (p as { runsConceded?: number }).runsConceded ?? 0,
      createdAt: p.createdAt,
    }));

    // Compute derived stats for each player.
    const computedStats = playersData.map((p) => {
      const stats = computePlayerStats(p);
      return {
        name: p.name,
        university: p.university,
        battingAverage: stats.battingAverage,
        battingStrikeRate: stats.battingStrikeRate,
        bowlingEconomy: stats.bowlingEconomy,
        bowlingStrikeRate: stats.bowlingStrikeRate,
        runs: p.runs ?? 0,
        wickets: p.wickets ?? 0,
        playerPoints: stats.playerPoints,
        playerValue: stats.playerValue,
      };
    });

    return NextResponse.json(computedStats);
  } catch (error) {
    console.error("Error computing stats:", error);
    return NextResponse.json(
      { error: "Failed to compute stats." },
      { status: 500 }
    );
  }
}
