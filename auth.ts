import NextAuth from "next-auth"
import Resend from "next-auth/providers/resend"
import { SupabaseAdapter } from "@/lib/auth-adapter"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: SupabaseAdapter(),
  providers: [
    Resend({
      from: process.env.AUTH_RESEND_FROM || "The Pitch Connect <onboarding@resend.dev>",
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user?.id || ""
      }
      return session
    },
  },
})
