import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { resendVerificationEmail } from "@/lib/email";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "your email address",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.username || !credentials.password) {
          return null;
        }
        const { username, password } = credentials as {
          username: string;
          password: string;
        };

        const userData = await db
          .select()
          .from(users)
          .where(eq(users.username, username))
          .limit(1);

        if (userData.length === 0) {
          return null;
        }

        // If email is not verified, send confirmation email and then throw an error.
        if (!userData[0].verified) {
          // Send confirmation email using the existing verification token.
          // Optionally, you could generate a new token if needed.
          await resendVerificationEmail(
            userData[0].username,
            userData[0].verificationToken!
          );
          throw new Error("EmailNotVerified");
        }

        const isValid = bcrypt.compareSync(password, userData[0].password);
        if (!isValid) {
          return null;
        }

        return { id: userData[0].id.toString(), name: userData[0].username };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      const updatedUser = { ...session.user, id: token.id as string };
      return { ...session, user: updatedUser };
    },
  },
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };
