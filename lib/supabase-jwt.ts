import { SignJWT } from "jose"

/**
 * Creates a Supabase-compatible JWT from a NextAuth user session.
 * This JWT is used by the Supabase client so RLS policies see auth.uid().
 */
export async function createSupabaseJWT(userId: string, email: string) {
  const secret = new TextEncoder().encode(
    process.env.SUPABASE_JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  return new SignJWT({
    sub: userId,
    email: email,
    role: "authenticated",
    aud: "authenticated",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret)
}
