'use client'

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Trophy, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"

function SignInForm() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) setEmail(emailParam)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    await signIn("resend", {
      email: email.trim(),
      redirect: false,
      callbackUrl: "/",
    })
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-red-500 font-bold text-lg mb-6">
            <Trophy className="w-6 h-6" />
            The Pitch Connect
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {sent ? "Check your email" : "Sign in"}
          </h1>
          <p className="text-gray-600 text-sm">
            {sent
              ? `We sent a magic link to ${email}`
              : "Enter your email to receive a magic sign-in link"}
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoFocus
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              {loading ? "Sending link..." : "Send magic link"}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-500">
              Click the link in the email to sign in. If you don&apos;t see it, check your spam folder.
            </p>
            <button
              onClick={() => { setSent(false); setEmail("") }}
              className="text-sm text-red-500 hover:text-red-600 font-medium inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              Try a different email
            </button>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-8">
          No password needed. We&apos;ll email you a link that signs you in instantly.
        </p>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SignInForm />
    </Suspense>
  )
}
