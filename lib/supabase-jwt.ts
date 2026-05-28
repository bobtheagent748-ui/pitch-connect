import { SignJWT } from "jose"

/**
 * Creates a Supabase-compatible JWT from a NextAuth user session.
 * Requires SUPABASE_JWT_SECRET from Supabase Dashboard → Settings → API → JWT Secret.
 * Falls back gracefully if not configured — the app works but RLS runs as anon.
 */
export async function createSupabaseJWT(userId: string, email: string) {
  const jwtSecret = process.env.SUPABASE_JWT_SECRET

  // Skip JWT signing if secret is not configured
  if (!jwtSecret) {
    return null
  }

  const secret = new TextEncoder().encode(jwtSecret)

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
