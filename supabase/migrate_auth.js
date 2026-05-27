const { Pool } = require('pg');

// Try Supabase session pooler (port 6543)
const pool = new Pool({
  host: 'aws-0-us-east-2.pooler.supabase.com',
  port: 6543,
  user: 'postgres.hcwrbxqplrxouhfvnbcc',
  password: '5tYvmfj8170Dr6e9',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  const client = await pool.connect();
  console.log('Connected to Supabase ✓');
  try {
    await client.query(`CREATE TABLE IF NOT EXISTS "user" (id UUID DEFAULT gen_random_uuid() NOT NULL, name TEXT, email TEXT NOT NULL, "emailVerified" TIMESTAMPTZ, image TEXT, CONSTRAINT user_pkey PRIMARY KEY (id), CONSTRAINT user_email_unique UNIQUE (email))`);
    console.log('[1/4] user table ✓');
    await client.query(`CREATE TABLE IF NOT EXISTS "account" (id UUID DEFAULT gen_random_uuid() NOT NULL, "userId" UUID NOT NULL, type TEXT NOT NULL, provider TEXT NOT NULL, "providerAccountId" TEXT NOT NULL, refresh_token TEXT, access_token TEXT, expires_at INTEGER, token_type TEXT, scope TEXT, id_token TEXT, session_state TEXT, CONSTRAINT account_pkey PRIMARY KEY (id), CONSTRAINT account_userId_user_id_fk FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE, CONSTRAINT account_provider_unique UNIQUE (provider, "providerAccountId"))`);
    console.log('[2/4] account table ✓');
    await client.query(`CREATE TABLE IF NOT EXISTS "session" (id UUID DEFAULT gen_random_uuid() NOT NULL, "sessionToken" TEXT NOT NULL, "userId" UUID NOT NULL, expires TIMESTAMPTZ NOT NULL, CONSTRAINT session_pkey PRIMARY KEY (id), CONSTRAINT session_sessionToken_unique UNIQUE ("sessionToken"), CONSTRAINT session_userId_user_id_fk FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE)`);
    console.log('[3/4] session table ✓');
    await client.query(`CREATE TABLE IF NOT EXISTS "verification_token" ("identifier" TEXT NOT NULL, "token" TEXT NOT NULL, expires TIMESTAMPTZ NOT NULL, CONSTRAINT verification_token_pkey PRIMARY KEY ("identifier", "token"))`);
    console.log('[4/4] verification_token table ✓');
    console.log('\nAll NextAuth tables created.');
  } finally {
    client.release();
    await pool.end();
  }
}
run().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
