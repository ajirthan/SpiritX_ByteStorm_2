import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (!token)
    return NextResponse.json({ error: "Token missing" }, { status: 400 });

  const userData = await db
    .select()
    .from(users)
    .where(eq(users.verificationToken, token))
    .limit(1);
  if (userData.length === 0)
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });

  await db
    .update(users)
    .set({ verified: true, verificationToken: null })
    .where(eq(users.id, userData[0].id));

  return NextResponse.redirect(new URL("/dashboard", req.url));
}
