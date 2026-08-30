import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectMongo } from "@/lib/db/mongo";
import { User } from "@/lib/db/models";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const conn = await connectMongo();
        if (!conn) {
          // Fallback: allow the demo user when DB is unavailable so the
          // dashboard remains explorable during local development.
          if (
            credentials.email === "admin@growthco.co" &&
            credentials.password === "Admin@123"
          ) {
            return {
              id: "demo-admin",
              name: "Alex Morgan",
              email: "admin@growthco.co",
              role: "Admin",
            };
          }
          return null;
        }

        const user = await User.findOne({ email: credentials.email })
          .select("+password")
          .lean();

        if (!user || !user.password) {
          return null;
        }

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) {
          return null;
        }

        return {
          id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "Reviewer";
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
