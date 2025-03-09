// app/api/chat/data/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { players } from "@/db/schema";

export async function GET() {
  // Example: fetch all players and their stats
  const allPlayers = await db.select().from(players);

  // You could also join userTeams, or compute additional summaries
  // or fetch the top performers from the leaderboard, etc.

  return NextResponse.json({ players: allPlayers });
}
