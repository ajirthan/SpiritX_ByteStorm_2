import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";

export async function GET() {
  // Calculate team points as the sum of runs from players in a user's team.
  // Use double quotes to reference case-sensitive column names.
  const leaderboard = await db.execute(`
    SELECT u.username, COALESCE(SUM(p.runs), 0) AS total_points
    FROM users u
    LEFT JOIN user_teams ut ON ut."userId" = u.id
    LEFT JOIN players p ON p.id = ut."playerId"
    GROUP BY u.id, u.username
    ORDER BY total_points DESC;
  `);
  return NextResponse.json(leaderboard.rows);
}
