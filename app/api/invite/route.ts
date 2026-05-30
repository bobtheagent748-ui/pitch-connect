import { NextResponse } from "next/server"
import { Resend } from "resend"
import { auth } from "@/../auth"

const resend = new Resend(process.env.AUTH_RESEND_KEY)

export async function POST(request: Request) {
  try {
    // Require authentication
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { email, groupName, type } = await request.json()

    if (!email || !groupName || !type) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const from = process.env.AUTH_RESEND_FROM || "The Pitch Connect <noreply@thepitchconnect.com>"
    const signinUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://pitch-connect-xi.vercel.app"}/signin?email=${encodeURIComponent(email)}`

    if (type === "added") {
      await resend.emails.send({
        from,
        to: email,
        subject: `You've been added to ${groupName} on The Pitch Connect`,
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #ef4444;">⚽ The Pitch Connect</h2>
            <p>You've been added as a player to <strong>${groupName}</strong>.</p>
            <p>Sign in to see your games and RSVP:</p>
            <a href="${signinUrl}" style="display: inline-block; background: #ef4444; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Sign in to Pitch Connect</a>
          </div>
        `,
      })
    } else if (type === "invited") {
      await resend.emails.send({
        from,
        to: email,
        subject: `You're invited to join ${groupName} on The Pitch Connect`,
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #ef4444;">⚽ The Pitch Connect</h2>
            <p>You've been invited to join <strong>${groupName}</strong>!</p>
            <p>Click below to create your account and start playing:</p>
            <a href="${signinUrl}" style="display: inline-block; background: #ef4444; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Join The Pitch Connect</a>
          </div>
        `,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error("Invite error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
