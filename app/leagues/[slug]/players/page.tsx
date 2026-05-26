import { use } from 'react'
import { redirect } from 'next/navigation'

export default function LeaguePlayersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  redirect(`/leagues/${slug}#players`)
}
