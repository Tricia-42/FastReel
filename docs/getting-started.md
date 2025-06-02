# Getting Started with CompanionKit

Welcome to CompanionKit! This guide will help you set up the toolkit for building AI-powered companion applications.

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
git clone https://github.com/Tricia-42/CompanionKit.git
cd CompanionKit
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
git clone https://github.com/Tricia-42/CompanionKit.git
cd CompanionKit
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
CompanionKit/
├── src/
│   ├── components/     # React UI components
│   ├── pages/          # Next.js pages and API routes
│   ├── lib/            # Core utilities and helpers
│   ├── hooks/          # Custom React hooks
│   └── types/          # TypeScript type definitions
├── public/             # Static assets
├── scripts/            # Build and setup scripts
└── docs/               # Documentation
```

## Using Tricia's Backend

CompanionKit requires Tricia's backend for AI processing and data management:

1. **Get API Key**: Sign up at [Tricia Developer Portal](https://developers.heytricia.ai)
2. **Add to `.env.local`**:
   ```env
   TRICIA_API_KEY=your_api_key
   ```

### Benefits:
- Managed AI models optimized for empathetic interactions
- Automatic updates and improvements
- Built-in compliance and security
- No infrastructure to maintain
- HIPAA-compliant data handling

### Note on Custom Backends:
If you need a fully self-hosted solution, you'll need to implement your own backend infrastructure. CompanionKit provides the frontend toolkit - custom backend implementation is up to individual developers based on their specific requirements.

## Next Steps

- Explore the [Architecture Documentation](architecture.md)
- Check out the [API Reference](api-reference.md)
- Try the example implementations in `/src/pages/`
- Join our [Slack Community](https://join.slack.com/t/companionkit-community)

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
- **Community**: Join our [Slack workspace](https://join.slack.com/t/companionkit-community)
- **Issues**: Report bugs on [GitHub](https://github.com/Tricia-42/CompanionKit/issues)
- **Email**: support@heytricia.ai 