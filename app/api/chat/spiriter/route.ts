// app/api/chat/spiriter/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/drizzle";
import { players } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // 1) Retrieve data from DB (or from a dedicated endpoint)
    const allPlayers = await db.select().from(players);
    // You might also fetch the highest run scorer, wicket taker, etc.

    // 2) Build a context string that enumerates player stats
    // Example: you might list each player's name, runs, wickets, etc.
    const playerContext = allPlayers
      .map(
        (p) =>
          `${p.name} [University: ${p.university}, Runs: ${p.runs}, Wickets: ${p.wickets}]`
      )
      .join("\n");

    const context = `
You are an advanced cricket fantasy assistant. Below is the player data from the single-season tournament:

${playerContext}

You can use this data to answer questions about players and to suggest an 11-player fantasy team.
    `;

    // 3) Combine user query with context
    const fullPrompt = `
${context}

User Query: ${query}
    `;

    // 4) Send the combined prompt to Gemini
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(fullPrompt);

    return NextResponse.json({ response: result.response.text() });
  } catch (error: unknown) {
    let errorMessage = "Failed to communicate with Gemini API";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
