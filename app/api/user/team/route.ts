import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { userTeams, players } from "@/db/schema";
import { and, eq } from "drizzle-orm";

// GET: Return the user's selected players
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }

  // fetch the userTeams for this user
  const selectedPlayers = await db
    .select({
      // returning columns from players
      playerId: userTeams.playerId,
      name: players.name,
      university: players.university,
      runs: players.runs,
      wickets: players.wickets,
    })
    .from(userTeams)
    .innerJoin(players, eq(userTeams.playerId, players.id))
    .where(eq(userTeams.userId, parseInt(userId, 10)));

  return NextResponse.json(selectedPlayers);
}

// POST: Add a player to the user's team
export async function POST(req: Request) {
  const { userId, playerId } = await req.json();
  if (!userId || !playerId) {
    return NextResponse.json(
      { error: "User ID and Player ID required" },
      { status: 400 }
    );
  }

  // check if the user already has 11 players
  const existingPlayers = await db
    .select()
    .from(userTeams)
    .where(eq(userTeams.userId, userId));
  if (existingPlayers.length >= 11) {
    return NextResponse.json(
      { error: "Team is already complete" },
      { status: 400 }
    );
  }

  // check if player is already in team
  const alreadySelected = await db
    .select()
    .from(userTeams)
    .where(and(eq(userTeams.userId, userId), eq(userTeams.playerId, playerId)));
  if (alreadySelected.length > 0) {
    return NextResponse.json(
      { error: "Player already selected" },
      { status: 400 }
    );
  }

  // optional: check cost of player, subtract from user's budget if you have cost logic
  // e.g. if each player has a "value" field, you'd fetch that, then subtract from user.budget

  const inserted = await db
    .insert(userTeams)
    .values({
      userId,
      playerId,
    })
    .returning();
  return NextResponse.json(inserted);
}

// DELETE: remove a player from user’s team
export async function DELETE(req: Request) {
  const { userId, playerId } = await req.json();
  if (!userId || !playerId) {
    return NextResponse.json(
      { error: "User ID and Player ID required" },
      { status: 400 }
    );
  }
  await db
    .delete(userTeams)
    .where(and(eq(userTeams.userId, userId), eq(userTeams.playerId, playerId)));
  return NextResponse.json({ message: "Player removed from team" });
}
