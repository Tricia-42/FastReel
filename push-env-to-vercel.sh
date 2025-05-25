#!/bin/bash

# Script to push local .env.local variables to Vercel
# Usage: ./push-env-to-vercel.sh

echo "🚀 Pushing environment variables to Vercel..."
echo ""

# Check if project is linked
if [ ! -d ".vercel" ]; then
    echo "❌ Project not linked to Vercel. Please run 'vercel link' first."
    exit 1
fi

echo "📤 Reading .env.local and pushing to Vercel..."
echo ""

# Read .env.local and push each variable
while IFS='=' read -r key value; do
    # Skip empty lines and comments
    if [[ -z "$key" || "$key" == \#* ]]; then
        continue
    fi
    
    # Remove quotes if present
    value="${value%\"}"
    value="${value#\"}"
    value="${value%\'}"
    value="${value#\'}"
    
    # Push to Vercel (production, preview, and development)
    echo "Setting $key..."
    echo "$value" | vercel env add "$key" production --force 2>/dev/null || echo "  ⚠️  $key already exists, skipping..."
    
done < .env.local

echo ""
echo "✅ Environment variables pushed to Vercel!"
echo ""
echo "🔍 To verify, run: vercel env ls"
echo "🚀 To deploy with new env vars, run: vercel --prod" 