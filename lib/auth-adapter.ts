import { createClient } from "@supabase/supabase-js"
import type { Adapter } from "next-auth/adapters"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const admin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
})

export function SupabaseAdapter(): Adapter {
  return {
    async createUser(user) {
      const { data, error } = await admin
        .from("users")
        .insert({
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image,
        })
        .select()
        .single()
      if (error) throw error
      return data
    },

    async getUser(id) {
      const { data, error } = await admin
        .from("users")
        .select()
        .eq("id", id)
        .maybeSingle()
      if (error) throw error
      return data
    },

    async getUserByEmail(email) {
      const { data, error } = await admin
        .from("users")
        .select()
        .eq("email", email)
        .maybeSingle()
      if (error) throw error
      return data
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const { data: account, error } = await admin
        .from("accounts")
        .select("userId")
        .eq("provider", provider)
        .eq("providerAccountId", providerAccountId)
        .maybeSingle()
      if (error || !account) return null
      return this.getUser!(account.userId)
    },

    async updateUser(user) {
      const { data, error } = await admin
        .from("users")
        .update({
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image,
        })
        .eq("id", user.id)
        .select()
        .single()
      if (error) throw error
      return data
    },

    async deleteUser(userId) {
      await admin.from("sessions").delete().eq("userId", userId)
      await admin.from("accounts").delete().eq("userId", userId)
      const { error } = await admin.from("users").delete().eq("id", userId)
      if (error) throw error
    },

    async linkAccount(account) {
      const { data, error } = await admin
        .from("accounts")
        .insert({
          userId: account.userId,
          type: account.type,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          refresh_token: account.refresh_token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
          session_state: account.session_state,
        })
        .select()
        .single()
      if (error) throw error
      return data
    },

    async unlinkAccount({ provider, providerAccountId }) {
      const { error } = await admin
        .from("accounts")
        .delete()
        .eq("provider", provider)
        .eq("providerAccountId", providerAccountId)
      if (error) throw error
    },

    async createSession(session) {
      const { data, error } = await admin
        .from("sessions")
        .insert({
          sessionToken: session.sessionToken,
          userId: session.userId,
          expires: session.expires,
        })
        .select()
        .single()
      if (error) throw error
      return data
    },

    async getSessionAndUser(sessionToken) {
      const { data: session, error } = await admin
        .from("sessions")
        .select()
        .eq("sessionToken", sessionToken)
        .maybeSingle()
      if (error || !session) return null
      const user = await this.getUser!(session.userId)
      if (!user) return null
      return { session, user }
    },

    async updateSession(session) {
      const { data, error } = await admin
        .from("sessions")
        .update({ expires: session.expires })
        .eq("sessionToken", session.sessionToken)
        .select()
        .maybeSingle()
      if (error) throw error
      return data
    },

    async deleteSession(sessionToken) {
      const { error } = await admin
        .from("sessions")
        .delete()
        .eq("sessionToken", sessionToken)
      if (error) throw error
    },

    async createVerificationToken(token) {
      const { data, error } = await admin
        .from("verification_token")
        .insert({
          identifier: token.identifier,
          token: token.token,
          expires: token.expires,
        })
        .select()
        .single()
      // Handle conflict (token already exists for identifier)
      if (error) {
        await admin
          .from("verification_token")
          .delete()
          .eq("identifier", token.identifier)
        const { data: retry, error: retryErr } = await admin
          .from("verification_token")
          .insert({
            identifier: token.identifier,
            token: token.token,
            expires: token.expires,
          })
          .select()
          .single()
        if (retryErr) throw retryErr
        return retry
      }
      return data
    },

    async useVerificationToken({ identifier, token }) {
      const { data, error } = await admin
        .from("verification_token")
        .select()
        .eq("identifier", identifier)
        .eq("token", token)
        .maybeSingle()
      if (error || !data) return null
      await admin
        .from("verification_token")
        .delete()
        .eq("identifier", identifier)
        .eq("token", token)
      return data
    },
  }
}
