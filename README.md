# Tricia Web - Memory Guide

A web application for Tricia, an AI-powered memory guide that helps capture and preserve meaningful moments through guided conversations.

## Features

- 🎙️ **Voice-First Interaction**: Natural conversation with Tricia using LiveKit
- 📸 **Memory Visualization**: AI-generated images that capture the essence of your stories
- 📝 **Automatic Journaling**: Stories are transformed into beautiful journal entries
- 🔐 **Secure Authentication**: Google Sign-In with Firebase integration
- 🎨 **Customizable Themes**: Multiple color themes for personalization

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Google Cloud account (for OAuth)
- Firebase project (for authentication)
- Access to Tricia backend API

### 1. Clone and Install

```bash
git clone <repository-url>
cd tricia-web
npm install
```

### 2. Environment Setup

Copy the environment template and fill in your credentials:

```bash
cp .env.example .env.local
```

Required environment variables:
- **Firebase Client SDK** (get from Firebase Console)
- **Firebase Admin SDK** (download service account key)
- **Google OAuth** (from Google Cloud Console)
- **NextAuth** configuration
- **Tricia API** endpoints

See [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md) for detailed instructions.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:8005](http://localhost:8005) to start using Tricia.

## Architecture

```
┌─────────────────────┐     ┌──────────────────┐
│   Next.js Frontend  │────▶│  Tricia Backend  │
│   (This Repo)       │     │  (Python/FastAPI)│
└──────────┬──────────┘     └──────────────────┘
           │                          │
           ▼                          ▼
┌─────────────────────┐     ┌──────────────────┐
│  NextAuth + Google  │     │     LiveKit      │
│  Firebase Auth      │     │  (Voice/Video)   │
└─────────────────────┘     └──────────────────┘
```

## Authentication Flow

1. User signs in with Google via NextAuth
2. Firebase user is automatically created/synced
3. Backend user profile is created on first sign-in
4. Each user gets their own isolated sessions

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/tricia-web)

1. Click the deploy button above
2. Set up environment variables in Vercel dashboard
3. Deploy!

### Manual Vercel Deployment

```bash
# Link to Vercel project
vercel link

# Push environment variables
./push-env-to-vercel.sh

# Deploy to production
vercel --prod
```

## Team Development

Team members can pull environment variables from Vercel:

```bash
vercel env pull .env.local
```

## Project Structure

```
src/
├── components/        # React components
│   ├── playground/   # Main UI components
│   ├── chat/         # Chat interface
│   └── config/       # Settings components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
│   ├── firebase-admin.ts  # Server-side Firebase
│   └── firebase-client.ts # Client-side Firebase
├── pages/            # Next.js pages
│   ├── api/          # API routes
│   └── auth/         # Authentication pages
└── styles/           # CSS styles
```

## Key Components

- **Playground**: Main interface for interacting with Tricia
- **Journal Display**: Shows generated memories with images
- **Voice Interaction**: Real-time transcription and audio visualization
- **Settings Panel**: User preferences and connection status

## Configuration

### Firebase Setup

1. Enable Google Sign-In in Firebase Console
2. Add authorized domains for OAuth redirects
3. Download service account key for server-side operations

See [FIREBASE_AUTH_SETUP.md](FIREBASE_AUTH_SETUP.md) for complete instructions.

### LiveKit Configuration

The application connects to LiveKit through the Tricia backend, which provides:
- Room tokens with proper permissions
- Agent dispatch configuration
- Transcription services

## Security

- Environment variables are properly scoped (server vs client)
- Firebase Admin SDK runs only on server-side
- Authentication required for all Tricia interactions
- User data is isolated by Firebase UID

## Troubleshooting

### Common Issues

**Agent not connecting?**
- Check backend logs for agent worker status
- Verify LiveKit API credentials match between frontend and backend
- Ensure agent name "tricia-agent" is registered

**Authentication failing?**
- Verify Google OAuth redirect URIs include your domain
- Check Firebase configuration in environment variables
- Ensure NextAuth secret is set

**No transcriptions?**
- Verify microphone permissions in browser
- Check LiveKit room connection status
- Look for errors in browser console

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

Apache License 2.0 - see [LICENSE](LICENSE) file

## Support

For issues and questions:
- Check [TECHNICAL_DEBT.md](TECHNICAL_DEBT.md) for known issues
- Open a GitHub issue
- Contact the Tricia team

---

Built with ❤️ by the Tricia team


