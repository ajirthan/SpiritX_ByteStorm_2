// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { resendVerificationEmail } from "@/lib/email";
import type { JWT } from "next-auth/jwt";

// Custom user type returned from authorize
interface CustomUser {
  id: string;
  name: string;
  role: string;
}

// Custom token type extending JWT
interface CustomToken extends JWT {
  id: string;
  role: string;
}

// Extended session user type (to be used for session.user)
interface ExtendedUser {
  id: string;
  role: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export const authOptions: NextAuthOptions = {
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
        if (!credentials || !credentials.username || !credentials.password)
          return null;
        const { username, password } = credentials as {
          username: string;
          password: string;
        };

        const userData = await db
          .select()
          .from(users)
          .where(eq(users.username, username))
          .limit(1);
        if (userData.length === 0) return null;
        if (!userData[0].verified) {
          await resendVerificationEmail(
            userData[0].username,
            userData[0].verificationToken!
          );
          throw new Error("EmailNotVerified");
        }
        const isValid = bcrypt.compareSync(password, userData[0].password);
        if (!isValid) return null;

        return {
          id: userData[0].id.toString(),
          name: userData[0].username,
          role: userData[0].role,
        } as CustomUser;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({
      token,
      user,
    }: {
      token: JWT;
      user?: unknown;
    }): Promise<CustomToken> {
      if (user) {
        const customUser = user as CustomUser;
        token.id = customUser.id;
        token.role = customUser.role;
      }
      return token as CustomToken;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      const customToken = token as CustomToken;
      const extendedUser: ExtendedUser = {
        ...(session.user as ExtendedUser),
        id: customToken.id,
        role: customToken.role,
      };
      return { ...session, user: extendedUser };
    },
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
