import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { players } from "@/db/schema";

export async function GET() {
  const allStats = await db.select().from(players);
  return NextResponse.json(allStats);
}
