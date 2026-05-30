import { NextResponse } from "next/server"
import { Resend } from "resend"
import { auth } from "@/auth"
import { createClient } from "@supabase/supabase-js"

const resend = new Resend(process.env.AUTH_RESEND_KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { gameId } = await request.json()
    if (!gameId) {
      return NextResponse.json({ error: "Missing gameId" }, { status: 400 })
    }

    // Fetch the game
    const { data: game } = await supabase
      .from("games")
      .select("id, field_name, date, time, league_id")
      .eq("id", gameId)
      .single()

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 })
    }

    // Get group name
    const { data: group } = await supabase
      .from("leagues")
      .select("name, slug")
      .eq("id", game.league_id)
      .single()

    const groupName = group?.name || "your group"
    const groupSlug = group?.slug || ""

    // Find players in the group who haven't RSVP'd
    const { data: players } = await supabase
      .from("players")
      .select("id, name, email")
      .eq("league_id", game.league_id)

    if (!players || players.length === 0) {
      return NextResponse.json({ error: "No players in this group" }, { status: 400 })
    }

    // Get existing RSVPs
    const { data: rsvps } = await supabase
      .from("rsvps")
      .select("player_id")
      .eq("game_id", gameId)

    const rsvpPlayerIds = new Set((rsvps || []).map(r => r.player_id))

    // Filter to unreplied players with emails
    const unreplied = players.filter(
      p => p.email && !rsvpPlayerIds.has(p.id)
    )

    if (unreplied.length === 0) {
      return NextResponse.json({ sent: 0, message: "All players have already replied" })
    }

    const signinUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://pitch-connect-xi.vercel.app"}/groups/${groupSlug}/games`
    const from = process.env.AUTH_RESEND_FROM || "The Pitch Connect <noreply@thepitchconnect.com>"

    // Send to each unreplied player
    const results = await Promise.allSettled(
      unreplied.map(player =>
        resend.emails.send({
          from,
          to: player.email,
          subject: `⚽ RSVP needed: ${game.field_name} on ${game.date}`,
          html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
              <h2 style="color: #ef4444;">⚽ The Pitch Connect</h2>
              <p>Hi ${player.name || "there"},</p>
              <p>You haven't RSVP'd yet for <strong>${game.field_name}</strong> on <strong>${game.date} at ${game.time}</strong> (${groupName}).</p>
              <p>Sign in to let your team know if you're coming:</p>
              <a href="${signinUrl}" style="display: inline-block; background: #ef4444; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">RSVP Now</a>
              <p style="margin-top: 24px; color: #9ca3af; font-size: 12px;">
                You're receiving this because you're a player in ${groupName} on The Pitch Connect.
              </p>
            </div>
          `,
        })
      )
    )

    const sent = results.filter(r => r.status === "fulfilled").length

    // Update reminder timestamp
    await supabase
      .from("games")
      .update({ reminder_sent_at: new Date().toISOString() })
      .eq("id", gameId)

    return NextResponse.json({ sent, total: unreplied.length })
  } catch (error: any) {
    console.error("Reminder error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
