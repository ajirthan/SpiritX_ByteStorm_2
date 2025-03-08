import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/drizzle";
import { users } from "@/db/schema";
import { resendVerificationEmail } from "@/lib/email";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);
  if (existing.length > 0) {
    return NextResponse.json(
      { error: "Username already taken" },
      { status: 400 }
    );
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const verificationToken = randomBytes(32).toString("hex");

  const newUser = await db
    .insert(users)
    .values({
      username,
      password: hashedPassword,
      verified: false,
      verificationToken,
    })
    .returning();

  await resendVerificationEmail(newUser[0].username, verificationToken);

  return NextResponse.json(
    {
      message:
        "Signup successful. Please check your email to verify your account.",
    },
    { status: 201 }
  );
}
