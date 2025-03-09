import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";

export async function GET() {
  const summary = await db.execute(`
    SELECT 
      COALESCE(SUM(runs), 0) AS total_runs,
      COALESCE(SUM(wickets), 0) AS total_wickets,
      (SELECT name FROM players ORDER BY runs DESC LIMIT 1) AS highest_run_scorer,
      (SELECT name FROM players ORDER BY wickets DESC LIMIT 1) AS highest_wicket_taker
    FROM players
  `);
  return NextResponse.json(summary.rows[0]);
}
