import { redirect } from 'next/navigation'

export default function LeaguePlayersPage({ params }: { params: { slug: string } }) {
  redirect(`/leagues/${params.slug}#players`)
}
