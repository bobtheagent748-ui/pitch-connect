import { createClient } from '@/lib/supabase/client'

export function createGameClient(isServer: boolean = false) {
  return createClient()
}

async function main() {
  const client = createGameClient()
  
  console.log('Testing Supabase connection...')
  console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('Has anon key:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  
  // Check if tables exist
  const { data: tables, error } = await client.rpc('pg_tables', {
    schemaname: 'public',
  } as any)
  
  if (error) {
    console.error('Error checking tables:', error)
  } else {
    console.log('Tables:', tables)
  }
  
  // Try a simple insert
  const { error: insertError } = await client
    .from('games')
    .insert({
      field_name: 'Test Field',
      full_address: '123 Test St',
      date: '2026-01-01',
      time: '18:00',
      notes: 'Test note',
    })
  
  if (insertError) {
    console.error('Insert error:', insertError)
  } else {
    console.log('Insert succeeded')
  }
  
  // Check existing data
  const { data, error: selectError } = await client.from('games').select('*')
  if (selectError) {
    console.error('Select error:', selectError)
  } else {
    console.log('Games:', data)
  }
}

main()
