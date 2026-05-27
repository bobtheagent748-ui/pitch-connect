import NextAuth from "next-auth"
import Resend from "next-auth/providers/resend"
import { Pool } from "pg"
import { PostgresAdapter } from "@auth/pg-adapter"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PostgresAdapter(pool),
  providers: [
    Resend({
      from: process.env.AUTH_RESEND_FROM || "PitchConnect <onboarding@resend.dev>",
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
  },
})
