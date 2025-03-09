import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { players } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET: List all players
export async function GET() {
  const allPlayers = await db.select().from(players);
  return NextResponse.json(allPlayers);
}

// POST: Create a new player (for testing CRUD; do not modify dataset players)
export async function POST(req: Request) {
  const data = await req.json();
  const newPlayer = await db.insert(players).values(data).returning();
  return NextResponse.json(newPlayer);
}

// PUT: Update an existing player
export async function PUT(req: Request) {
  const data = await req.json();
  const { id, ...updates } = data;
  if (!id) {
    return NextResponse.json(
      { error: "Player ID is required for update." },
      { status: 400 }
    );
  }
  const updatedPlayer = await db
    .update(players)
    .set(updates)
    .where(eq(players.id, id))
    .returning();
  return NextResponse.json(updatedPlayer);
}

// DELETE: Delete a player
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { error: "Player ID is required for deletion." },
      { status: 400 }
    );
  }
  await db.delete(players).where(eq(players.id, parseInt(id)));
  return NextResponse.json({ message: "Player deleted successfully." });
}
