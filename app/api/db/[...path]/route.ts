import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { auth } from '@/auth'

/**
 * Authenticated PostgREST proxy.
 *
 * The browser no longer holds a Supabase key. supabase-js points at
 * /api/db and every request is authorised here (NextAuth session or the
 * admin panel's signed cookie), then forwarded to PostgREST with the
 * service key. RLS stays enabled with no anon policies, so the public
 * anon key cannot read or write anything directly.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Headers we must not copy from the browser request, or must replace.
const SKIP_REQUEST_HEADERS = new Set([
  'host',
  'connection',
  'content-length',
  'cookie',
  'authorization',
  'apikey',
  'accept-encoding',
])

// Response headers that matter to supabase-js (.single(), .range(), counting).
const KEEP_RESPONSE_HEADERS = ['content-type', 'content-range', 'range-unit', 'preference-applied']

async function isAuthorized(req: NextRequest): Promise<boolean> {
  const session = await auth()
  if (session?.user) return true

  const adminCookie = req.cookies.get('admin_session')?.value
  if (adminCookie && process.env.AUTH_SECRET) {
    try {
      await jwtVerify(adminCookie, new TextEncoder().encode(process.env.AUTH_SECRET))
      return true
    } catch {
      return false
    }
  }
  return false
}

async function handle(req: NextRequest, { params }: { params: { path: string[] } }) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const target = `${SUPABASE_URL}/${params.path.join('/')}${req.nextUrl.search}`
  const headers = new Headers()
  req.headers.forEach((value, key) => {
    if (!SKIP_REQUEST_HEADERS.has(key.toLowerCase())) headers.set(key, value)
  })
  headers.set('apikey', SERVICE_KEY)
  headers.set('authorization', `Bearer ${SERVICE_KEY}`)

  const body =
    req.method === 'GET' || req.method === 'HEAD' ? undefined : await req.arrayBuffer()

  const upstream = await fetch(target, {
    method: req.method,
    headers,
    body,
    cache: 'no-store',
    redirect: 'manual',
  })

  const outHeaders = new Headers()
  for (const name of KEEP_RESPONSE_HEADERS) {
    const value = upstream.headers.get(name)
    if (value) outHeaders.set(name, value)
  }
  return new NextResponse(upstream.body, { status: upstream.status, headers: outHeaders })
}

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export {
  handle as GET,
  handle as POST,
  handle as PATCH,
  handle as PUT,
  handle as DELETE,
  handle as HEAD,
  handle as OPTIONS,
}
