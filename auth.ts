import NextAuth from "next-auth"
import Resend from "next-auth/providers/resend"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Resend({
      from: process.env.AUTH_RESEND_FROM || "PitchConnect <onboarding@resend.dev>",
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    // Make user ID available on the session
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
  },
})
