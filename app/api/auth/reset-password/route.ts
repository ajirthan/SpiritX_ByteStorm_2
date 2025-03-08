import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(req: Request) {
  const { token, password } = await req.json();
  if (!token || !password) {
    return NextResponse.json(
      { error: "Token and new password are required" },
      { status: 400 }
    );
  }

  const userData = await db
    .select()
    .from(users)
    .where(eq(users.resetToken, token))
    .limit(1);
  if (userData.length === 0) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 }
    );
  }

  const user = userData[0];
  const now = new Date();
  if (!user.resetTokenExpiry || now > new Date(user.resetTokenExpiry)) {
    return NextResponse.json({ error: "Token has expired" }, { status: 400 });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  await db
    .update(users)
    .set({ password: hashedPassword, resetToken: null, resetTokenExpiry: null })
    .where(eq(users.id, user.id));

  return NextResponse.json({
    message: "Password has been reset successfully.",
  });
}
