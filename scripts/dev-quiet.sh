#!/bin/bash

# Development script with reduced console noise

echo "🤫 Starting CompanionKit in quiet mode..."
echo "   - Suppressing React warnings"
echo "   - Filtering LiveKit diagnostics"
echo "   - Keeping essential logs only"
echo ""

# Set environment variables for quiet logging
export NEXT_PUBLIC_LOG_LEVEL=info
export NEXT_PUBLIC_LOG_CATEGORIES=connection,journal,error
export NEXT_PUBLIC_SUPPRESS_DEV_WARNINGS=true

# Start the development server
npm run dev 