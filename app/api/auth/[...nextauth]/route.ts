// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { username, password } = credentials;
        const user = await db
          .select()
          .from(users)
          .where(eq(users.username, username))
          .limit(1);
        if (user.length > 0 && bcrypt.compareSync(password, user[0].password)) {
          return { id: user[0].id.toString(), name: user[0].username };
        }
        return null;
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
      // Construct a new user object that includes the id from token
      const updatedUser = { ...session.user, id: token.id as string };
      return { ...session, user: updatedUser };
    },
  },
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };