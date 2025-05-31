#!/bin/bash

# StayReel Development Setup Script
# Usage: ./scripts/setup.sh

set -e

echo "🎬 Setting up StayReel - Memory preservation platform..."

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ is required. Current version: $(node -v)"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check for Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📥 Installing Vercel CLI..."
    npm i -g vercel
fi

# Setup environment
if [ ! -f .env.local ]; then
    echo "🔧 Setting up environment variables..."
    
    # Check if user has Vercel access
    echo "Are you a Tricia community member with Vercel access? (y/n)"
    read -r HAS_VERCEL_ACCESS
    
    if [ "$HAS_VERCEL_ACCESS" = "y" ]; then
        echo "🔗 Linking to Vercel project..."
        vercel link
        
        echo "📥 Pulling environment variables..."
        vercel env pull .env.local
    else
        echo "📝 Creating .env.local from template..."
        cp .env.example .env.local
        
        echo ""
        echo "⚠️  Please edit .env.local with your credentials:"
        echo "   - Google OAuth (https://console.cloud.google.com)"
        echo "   - Tricia AI Backend API token"
        echo ""
        echo "📧 Need API access? Contact support@heytricia.ai"
        echo ""
    fi
else
    echo "✅ .env.local already exists"
fi

# Verify setup
echo ""
echo "🔍 Verifying setup..."

if grep -q "your-" .env.local 2>/dev/null; then
    echo "⚠️  Don't forget to update placeholder values in .env.local"
fi

echo ""
echo "✨ Setup complete! Run 'npm run dev' to start the development server."
echo "🌐 Visit http://localhost:8005 after starting the server."
echo ""
echo "📚 Next steps:"
echo "   - Read the README.md to understand our mission"
echo "   - Check CONTRIBUTING.md for contribution guidelines"
echo "   - Join our Slack: https://join.slack.com/t/stayreel-community/shared_invite/xyz"
echo ""
echo "💙 Thank you for helping us preserve memories and support families!"
echo "" 