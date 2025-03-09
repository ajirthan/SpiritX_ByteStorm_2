import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { resendResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  const { username } = await req.json();
  if (!username)
    return NextResponse.json({ error: "Email is required" }, { status: 400 });

  const userData = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);
  if (userData.length === 0) {
    return NextResponse.json({
      message: "If an account exists, a reset link has been sent.",
    });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await db
    .update(users)
    .set({ resetToken, resetTokenExpiry })
    .where(eq(users.id, userData[0].id));

  await resendResetEmail(username, resetToken);

  return NextResponse.json({ message: "Password reset email sent." });
}
