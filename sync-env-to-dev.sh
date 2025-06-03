#!/bin/bash

# Script to sync production environment variables to development in Vercel
# Excludes NEXTAUTH_URL which should be different between environments

echo "🔄 Syncing production environment variables to development..."
echo ""

# Check if project is linked
if [ ! -d ".vercel" ]; then
    echo "❌ Project not linked to Vercel. Please run 'vercel link' first."
    exit 1
fi

# List of variables that are currently only in production
PROD_ONLY_VARS=(
    "NEXT_PUBLIC_TEST_MODE"
    "LIVEKIT_API_SECRET"
    "LIVEKIT_API_KEY"
    "NEXT_PUBLIC_LIVEKIT_URL"
    "TRICIA_API_BEARER_TOKEN"
    "NEXT_PUBLIC_TRICIA_AGENT_ID"
    "NEXT_PUBLIC_TRICIA_BASE_URL"
    "POSTGRES_URL_NON_POOLING"
    "POSTGRES_PRISMA_URL"
    "POSTGRES_DATABASE"
    "POSTGRES_PASSWORD"
    "POSTGRES_HOST"
    "POSTGRES_USER"
    "POSTGRES_URL"
    "SUPABASE_JWT_SECRET"
    "SUPABASE_ANON_KEY"
    "SUPABASE_URL"
    "SUPABASE_SERVICE_ROLE_KEY"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    "NEXT_PUBLIC_SUPABASE_URL"
)

echo "📋 Variables to sync from production to development:"
printf '%s\n' "${PROD_ONLY_VARS[@]}"
echo ""

# Pull production environment variables to a temporary file
echo "📥 Pulling production environment variables..."
vercel env pull .env.production --environment=production

if [ ! -f ".env.production" ]; then
    echo "❌ Failed to pull production environment variables"
    exit 1
fi

# Sync each variable to development
echo ""
echo "🚀 Syncing to development environment..."
for var in "${PROD_ONLY_VARS[@]}"; do
    # Extract value from production env file
    value=$(grep "^$var=" .env.production | cut -d'=' -f2-)
    
    if [ -n "$value" ]; then
        # Remove quotes if present
        value="${value%\"}"
        value="${value#\"}"
        value="${value%\'}"
        value="${value#\'}"
        
        echo "Setting $var in development..."
        echo "$value" | vercel env add "$var" development --force 2>/dev/null || echo "  ⚠️  Error setting $var"
    else
        echo "⚠️  $var not found in production environment"
    fi
done

# Clean up
rm -f .env.production

echo ""
echo "✅ Environment sync complete!"
echo ""
echo "🔍 To verify, run: vercel env ls"
echo "💡 Note: NEXTAUTH_URL was not synced (it should be different for each environment)" 