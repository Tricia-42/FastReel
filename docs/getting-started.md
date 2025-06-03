# Getting Started with FastReel

Welcome to FastReel! This guide will help you get started with the FastReel demo application that showcases AI-powered voice agents and social storytelling capabilities.

## Prerequisites

- Node.js 18.0 or higher
- npm or yarn
- Git
- A LiveKit account (for real-time voice features)
- Firebase account (for authentication and data storage)

## Installation

### Quick Setup

The fastest way to get started is using our setup script:

```bash
git clone https://github.com/Tricia-42/FastReel.git
cd FastReel
./scripts/setup.sh
```

The setup script will:
1. Check your Node.js version
2. Install dependencies
3. Set up environment variables
4. Create necessary configuration files

### Manual Setup

If you prefer to set up manually:

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tricia-42/FastReel.git
   cd FastReel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Edit `.env.local`** with your credentials:
   ```env
   # LiveKit Configuration
   LIVEKIT_API_KEY=your_api_key
   LIVEKIT_API_SECRET=your_api_secret
   LIVEKIT_WS_URL=wss://your-instance.livekit.cloud
   
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   
   # Tricia API (optional - for using Tricia's backend)
   TRICIA_API_KEY=your_tricia_api_key
   ```

## Running the Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at http://localhost:8005

### Remote Development

For remote development or testing on other devices:

```bash
npm run dev:remote
```

This binds to all network interfaces, allowing access from other devices on your network.

## Project Structure

```
FastReel/
├── playground/         # Frontend playground app
│   ├── components/     # React UI components
│   ├── pages/          # Next.js pages and API routes
│   ├── lib/            # Core utilities and helpers
│   ├── hooks/          # Custom React hooks
│   └── types/          # TypeScript type definitions
├── fastreel/           # Backend servers (WIP)
├── public/             # Static assets
├── scripts/            # Build and setup scripts
└── docs/               # Documentation
```

## Using Tricia's Backend

The FastReel demo currently uses Tricia's API for AI processing:

1. **Get API Access**: Contact i@heytricia.ai for beta access
2. **Add to `.env.local`**:
   ```env
   TRICIA_API_BEARER_TOKEN=your_bearer_token
   NEXT_PUBLIC_TRICIA_BASE_URL=https://api.heytricia.ai
   NEXT_PUBLIC_TRICIA_AGENT_ID=tricia-companion-v1
   ```

### What Tricia API Provides:
- LiveKit-powered voice chat rooms
- AI agent dispatch and management
- Real-time voice conversations
- Reel generation from conversations
- Senior-optimized speech processing

### FastReel Backend (Coming Soon):
The FastReel backend framework is under development and will include:
- **API Server** - Core FastReel functionality
- **Voice Agent** - Customizable LiveKit agents with guardrails
- **MCP Server** - Journal generation and automation

## Next Steps

- Explore the [Architecture Documentation](architecture.md)
- Check out the [API Reference](api-reference.md)
- Try the example implementations in `/playground/pages/`
- Join our [Slack Community](https://fastreel-community.slack.com)

## Common Issues

### Port Already in Use

If port 8005 is already in use, you can change it in `package.json`:

```json
"dev": "next dev -p YOUR_PORT -H 0.0.0.0"
```

### LiveKit Connection Issues

Ensure your LiveKit credentials are correct and your firewall allows WebSocket connections.

### Firebase Authentication Errors

Check that your Firebase project has authentication enabled and the correct sign-in methods configured.

## Getting Help

- **Documentation**: Check our [full documentation](../README.md)
- **Community**: Join our [Slack workspace](https://fastreel-community.slack.com)
- **Issues**: Report bugs on [GitHub](https://github.com/Tricia-42/FastReel/issues)
- **Email**: support@fastreel.ai 