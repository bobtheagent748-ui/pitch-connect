#!/bin/bash
set -e
TOKEN="$VERCEL_TOKEN"
TEAM="" # not using team ID
# Get project ID from link
echo "Setting env vars..."
# Create env var: NEXT_PUBLIC_SUPABASE_URL
curl -s -X PUT "https://api.vercel.com/v2/projects/bobtheagent748-3027s-projects/pitch-connect/env/NEXT_PUBLIC_SUPABASE_URL?teamId=${TEAM}&target=production" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "value": "https://hcwrbxqplrxouhfvnbcc.supabase.co",
    "type": "encrypted"
  }' | jq .

echo "Setting SUPABASE_URL..."
# Also set the non-public Supabase URL for server-side use
curl -s -X PUT "https://api.vercel.com/v2/projects/bobtheagent748-3027s-projects/pitch-connect/env/SUPABASE_URL?teamId=${TEAM}&target=production" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "value": "https://hcwrbxqplrxouhfvnbcc.supabase.co",
    "type": "encrypted"
  }' | jq .

echo "Setting SUPABASE_SERVICE_ROLE_KEY..."
curl -s -X PUT "https://api.vercel.com/v2/projects/bobtheagent748-3027s-projects/pitch-connect/env/SUPABASE_SERVICE_ROLE_KEY?teamId=${TEAM}&target=production" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "value": "sb_publishable_KxQ5wVBJmi7xv0n_zwjHPA_ggv_TcfU",
    "type": "encrypted"
  }' | jq .

echo "Deploying..."
curl -s -X POST "https://api.vercel.com/v13/deployments?projectId=bobtheagent748-3027s-projects/pitch-connect&target=production" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "pitch-connect",
    "gitSource": {"provider": "gitHub", "ref": "main"},
    "production": true
  }' | jq '.url, .readyState'
