# StayReel - AI-Powered Memory Preservation

A web application that transforms conversations into preserved memories through AI-guided storytelling. Built on LiveKit for real-time communication, with support for custom AI agents.

## Features

- 🎙️ **Voice-First Interaction**: Natural conversation with AI agents using LiveKit
- 📸 **Memory Visualization**: AI-generated images that capture the essence of your stories
- 📝 **Automatic Journaling**: Stories are transformed into beautiful journal entries
- 🔐 **Secure Authentication**: Google Sign-In with Firebase integration
- 🎨 **Customizable Themes**: Multiple color themes for personalization
- 🔌 **Extensible Agent Backend**: Default Tricia agent or bring your own LiveKit agent

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Google Cloud account (for OAuth)
- Firebase project (for authentication)
- LiveKit Cloud account or self-hosted LiveKit server
- Backend API (defaults to Tricia, or implement your own)

### 1. Clone and Install

```bash
git clone git@github.com:Tricia-42/StayReel.git
cd StayReel
npm install
```

### 2. Environment Setup

Create `.env.local` file with your credentials:

```bash
# Firebase Client SDK (from Firebase Console > Project Settings)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin SDK (for server-side operations)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:8005

# Backend API Configuration
TRICIA_BASE_URL=https://api.heytricia.ai/api/v1  # Or your custom agent API
TRICIA_AUTH_TOKEN=your-api-token

# Test Mode (optional)
NEXT_PUBLIC_TEST_MODE=false
```

### 3. Google OAuth Setup

In [Google Cloud Console](https://console.cloud.google.com/apis/credentials):

1. Create OAuth 2.0 Client ID
2. Add authorized redirect URIs:
   - `http://localhost:8005/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:8005](http://localhost:8005) to start using StayReel.

## Architecture

```
┌─────────────────────┐     ┌──────────────────────┐
│  StayReel Frontend  │────▶│   Agent Backend      │
│  (Next.js + React)  │     │ (Default: Tricia API)│
└──────────┬──────────┘     └──────────────────────┘
           │                          │
           ▼                          ▼
┌─────────────────────┐     ┌──────────────────────┐
│  NextAuth + Google  │     │      LiveKit         │
│  Firebase Auth      │     │  (Voice/Video/RTC)   │
└─────────────────────┘     └──────────────────────┘
```

## Backend Integration

### Default: Tricia Backend

StayReel connects to the Tricia API by default, which provides:
- LiveKit room management and token generation
- AI agent ("tricia-agent") for guided conversations
- Memory processing and journal generation
- Image generation for visualizing memories

### Custom Agent Implementation

You can implement your own agent backend using LiveKit Agents SDK:

1. **Create your LiveKit Agent** following the [LiveKit Agents documentation](https://docs.livekit.io/agents/)
2. **Implement required endpoints**:
   - `POST /chats` - Create chat session and return LiveKit credentials
   - User management endpoints (optional)
3. **Update environment variables** to point to your API
4. **Configure agent dispatch** in your LiveKit token

Example response format for `/chats` endpoint:
```json
{
  "id": "session-id",
  "room_name": "unique-room-name",
  "participant_name": "user-id",
  "participant_token": "livekit-jwt-token",
  "server_url": "wss://your-livekit-server.com"
}
```

## Authentication Flow

1. User signs in with Google via NextAuth
2. Firebase user is automatically created/synced
3. Backend user profile is created on first sign-in
4. Each session gets a unique LiveKit room

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Tricia-42/StayReel)

1. Click the deploy button above
2. Set up environment variables in Vercel dashboard
3. Deploy!

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
src/
├── components/        # React components
│   ├── playground/   # Main UI components
│   ├── chat/         # Chat interface
│   └── config/       # Settings components
├── hooks/            # Custom React hooks
├── lib/              # Business logic
│   ├── firebase-admin.ts   # Server-side Firebase
│   ├── firebase-client.ts  # Client-side Firebase
│   ├── tricia-api.ts      # Backend API client
│   └── tricia-backend.ts  # User management
├── pages/            # Next.js pages
│   ├── api/          # API routes
│   │   ├── auth/     # NextAuth endpoints
│   │   └── tricia/   # Backend proxy
│   └── auth/         # Authentication pages
└── styles/           # CSS styles
```

## Key Features

### For Users
- **Protected Routes**: Authentication required to access the app
- **Auto-Connect**: Seamless connection to AI agent after sign-in
- **Real-time Transcription**: See your words and agent responses as you speak
- **Memory Journal**: Beautiful visualization of captured memories

### For Developers
- **Clean Architecture**: Separation of concerns with dedicated API layer
- **Type Safety**: Full TypeScript support
- **Extensible**: Easy to swap backend implementations
- **Modern Stack**: Next.js 14, React 18, Tailwind CSS

## Configuration

### Required Services

1. **Firebase Project**
   - Enable Google Sign-In provider
   - Configure OAuth redirect URLs
   - Download service account key

2. **Google Cloud Project**
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Configure consent screen

3. **LiveKit Server**
   - Use LiveKit Cloud or self-hosted
   - Configure agent workers
   - Set up room settings

## Troubleshooting

### Agent Not Connecting?
- Verify agent is running in your backend
- Check agent name matches configuration
- Ensure LiveKit tokens include agent dispatch
- Review backend logs for errors

### Authentication Issues?
- Verify Google OAuth redirect URIs
- Check Firebase configuration
- Ensure all environment variables are set
- Clear browser cookies and retry

### Connection Problems?
- Check NEXTAUTH_URL matches your dev server port
- Verify backend API is accessible
- Look for CORS errors in console
- Check network requests in browser DevTools

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Apache License 2.0 - see [LICENSE](LICENSE) file

## Acknowledgments

- Built on [LiveKit](https://livekit.io) for real-time communication
- Default AI agent powered by [Tricia](https://heytricia.ai)
- UI components from [LiveKit Components](https://github.com/livekit/components-js)

---

Built with ❤️ for preserving memories


