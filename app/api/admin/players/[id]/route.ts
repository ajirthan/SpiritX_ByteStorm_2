// app/api/admin/players/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { players } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const playerId = parseInt(params.id, 10);
    if (isNaN(playerId)) {
      return NextResponse.json({ error: "Invalid player ID" }, { status: 400 });
    }

    const result = await db
      .select()
      .from(players)
      .where(eq(players.id, playerId))
      .limit(1);

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error fetching player details:", error);
    return NextResponse.json(
      { error: "Failed to fetch player details" },
      { status: 500 }
    );
  }
}
