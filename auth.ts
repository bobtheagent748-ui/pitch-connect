import NextAuth from "next-auth"
import Resend from "next-auth/providers/resend"
import { SupabaseAdapter } from "@/lib/auth-adapter"
import { createSupabaseJWT } from "@/lib/supabase-jwt"

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
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user?.id || ""
      }
      // Bridge NextAuth to Supabase RLS: sign a Supabase-compatible JWT
      if (session.user?.id && session.user?.email) {
        try {
          session.supabaseAccessToken = await createSupabaseJWT(
            session.user.id,
            session.user.email
          )
        } catch {
          // JWT signing fails silently — RLS won't apply but the app still works
        }
      }
      return session
    },
  },
})
