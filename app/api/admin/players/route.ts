// app/api/admin/players/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { players } from "@/db/schema";
import { eq } from "drizzle-orm";
import { computeStats, RawStats } from "@/app/lib/computeStats";

// GET: Return all players
export async function GET() {
  try {
    const allPlayers = await db.select().from(players);
    return NextResponse.json(allPlayers);
  } catch (error) {
    console.error("Error fetching players:", error);
    return NextResponse.json(
      { error: "Failed to fetch players" },
      { status: 500 }
    );
  }
}

// POST: Create a new player (with computed stats)
export async function POST(req: Request) {
  try {
    const {
      name,
      university,
      runs,
      ballsFaced,
      inningsPlayed,
      wickets,
      oversBowled,
      runsConceded,
    } = await req.json();

    // Create a RawStats object (using 0 as default if any field is null)
    const rawStats: RawStats = {
      runs: runs ?? 0,
      ballsFaced: ballsFaced ?? 0,
      inningsPlayed: inningsPlayed ?? 0,
      wickets: wickets ?? 0,
      oversBowled: oversBowled ?? 0,
      runsConceded: runsConceded ?? 0,
    };

    // Compute derived statistics
    const stats = computeStats(rawStats);

    // Insert a new player with both raw and computed fields
    const inserted = await db
      .insert(players)
      .values({
        name,
        university,
        runs: runs ?? 0,
        ballsFaced: ballsFaced ?? 0,
        inningsPlayed: inningsPlayed ?? 0,
        wickets: wickets ?? 0,
        oversBowled: oversBowled ?? 0,
        runsConceded: runsConceded ?? 0,
        battingAverage: stats.battingAverage,
        battingStrikeRate: stats.battingStrikeRate,
        bowlingEconomy: stats.bowlingEconomy,
        bowlingStrikeRate: stats.bowlingStrikeRate,
        playerPoints: stats.playerPoints,
        playerValue: stats.playerValue,
      })
      .returning();

    return NextResponse.json(
      { message: "Player created successfully", player: inserted[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating player:", error);
    return NextResponse.json(
      { error: "Failed to create player" },
      { status: 500 }
    );
  }
}

// PUT: Update an existing player (recalculate computed stats)
export async function PUT(req: Request) {
  try {
    const {
      id,
      name,
      university,
      runs,
      ballsFaced,
      inningsPlayed,
      wickets,
      oversBowled,
      runsConceded,
    } = await req.json();

    const rawStats: RawStats = {
      runs: runs ?? 0,
      ballsFaced: ballsFaced ?? 0,
      inningsPlayed: inningsPlayed ?? 0,
      wickets: wickets ?? 0,
      oversBowled: oversBowled ?? 0,
      runsConceded: runsConceded ?? 0,
    };

    const stats = computeStats(rawStats);

    await db
      .update(players)
      .set({
        name,
        university,
        runs: runs ?? 0,
        ballsFaced: ballsFaced ?? 0,
        inningsPlayed: inningsPlayed ?? 0,
        wickets: wickets ?? 0,
        oversBowled: oversBowled ?? 0,
        runsConceded: runsConceded ?? 0,
        battingAverage: stats.battingAverage,
        battingStrikeRate: stats.battingStrikeRate,
        bowlingEconomy: stats.bowlingEconomy,
        bowlingStrikeRate: stats.bowlingStrikeRate,
        playerPoints: stats.playerPoints,
        playerValue: stats.playerValue,
      })
      .where(eq(players.id, id));

    return NextResponse.json({ message: "Player updated successfully" });
  } catch (error) {
    console.error("Error updating player:", error);
    return NextResponse.json(
      { error: "Failed to update player" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a player by id
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Player ID is required" },
        { status: 400 }
      );
    }
    await db.delete(players).where(eq(players.id, parseInt(id, 10)));
    return NextResponse.json({ message: "Player deleted successfully" });
  } catch (error) {
    console.error("Error deleting player:", error);
    return NextResponse.json(
      { error: "Failed to delete player" },
      { status: 500 }
    );
  }
}
