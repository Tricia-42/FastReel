# StayReel

| [Demo](https://demo.heytricia.ai) | [Discord](https://discord.gg/stayreel) |

StayReel is an open-source conversational AI platform built on LiveKit WebRTC infrastructure. It provides a React/Next.js frontend for real-time voice conversations with AI agents, featuring automatic transcription, multi-modal response generation, and session recording.

## Features

- **Real-time Voice Communication**: WebRTC-based audio streaming via LiveKit
- **Live Transcription**: Speech-to-text with speaker diarization
- **Multi-modal AI Responses**: Text generation with accompanying image synthesis
- **Session Management**: Automatic room creation and JWT-based authentication
- **Google OAuth Integration**: NextAuth + Firebase for user management
- **Extensible Agent Framework**: Compatible with any LiveKit agent implementation

## Contents

- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [API Reference](#api-reference)
- [Development](#development)
- [Deployment](#deployment)
- [Building Custom Agents](#building-custom-agents)
- [Troubleshooting](#troubleshooting)

## Quick Start

### Prerequisites

- Node.js 18+
- Google Cloud OAuth credentials
- Firebase project (optional - for user persistence)
- LiveKit-compatible agent backend

### Installation

```bash
# Clone repository
git clone git@github.com:Tricia-42/StayReel.git
cd StayReel

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Configure environment variables (see .env.example)
# Required: Google OAuth, NextAuth secret, Backend API endpoint

# Run development server
npm run dev
```

The application runs on port 8005 by default (configured for OAuth redirect).

## Architecture

### System Components

```
┌─────────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│    Web Client       │────▶│   Next.js API        │────▶│  Agent Backend  │
│  (React + LiveKit)  │     │  (/api/tricia)       │     │  (LiveKit Agent)│
└─────────────────────┘     └──────────────────────┘     └─────────────────┘
           │                            │                           │
           ▼                            ▼                           ▼
┌─────────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│    NextAuth.js      │     │    Firebase Admin    │     │  LiveKit Cloud  │
│  (OAuth Provider)   │     │  (User Management)   │     │   (WebRTC SFU)  │
└─────────────────────┘     └──────────────────────┘     └─────────────────┘
```

### Request Flow

1. **Authentication**:
   ```
   Client → /api/auth/signin → Google OAuth → NextAuth Session
   NextAuth → Firebase Admin SDK → Create/Update User
   ```

2. **LiveKit Session**:
   ```
   Client → /api/tricia → Backend API → Create Room
   Backend → Generate JWT Token → Return Connection Details
   Client → LiveKit SDK → Connect to Room → Agent Joins
   ```

3. **Data Streaming**:
   ```
   User Audio → LiveKit → Agent → Transcription + Response
   Agent → RPC Methods → Client (for UI updates)
   ```

### Project Structure

```
src/
├── components/
│   └── playground/         # Main UI components
│       ├── Playground.tsx  # LiveKit room management
│       ├── AgentTile.tsx   # Agent audio/video display
│       └── Header.tsx      # Navigation and controls
│
├── pages/
│   ├── index.tsx          # Protected main application
│   ├── api/
│   │   ├── auth/[...nextauth].ts  # OAuth endpoints
│   │   └── tricia/index.ts         # Backend proxy
│   └── auth/
│       └── signin.tsx     # Login page
│
├── lib/
│   ├── tricia-api.ts      # Backend API client
│   ├── tricia-backend.ts  # User management
│   └── firebase-*.ts      # Firebase integration
│
└── hooks/
    ├── useConnection.tsx  # LiveKit connection state
    └── useFirebaseAuth.ts # Auth synchronization
```

## API Reference

### Backend Requirements

Your agent backend must implement:

#### `POST /chats` - Create LiveKit Session
```typescript
// Request
{
  "user_id": string,
  "metadata": {
    "title": string,
    "user_email": string,
    "user_name": string
  }
}

// Response
{
  "id": string,                    // Session ID
  "room_name": string,             // LiveKit room name
  "participant_name": string,      // User identity
  "participant_token": string,     // JWT with room grants
  "server_url": string             // LiveKit server URL
}
```

#### JWT Token Structure
```json
{
  "iss": "API_KEY",
  "sub": "participant_identity",
  "video": {
    "room": "room_name",
    "roomJoin": true,
    "canPublish": true,
    "canSubscribe": true
  },
  "roomConfig": {
    "agents": [{
      "agentName": "your-agent-name"
    }]
  }
}
```

### RPC Methods

The frontend registers these RPC handlers:

- `agent.journal_generated` - Receives generated content
- `agent.journal_saved` - Acknowledgment handler

## Development

### Environment Variables

See `.env.example` for complete list. Key variables:

```bash
# Authentication
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
NEXTAUTH_SECRET=xxx
NEXTAUTH_URL=http://localhost:8005

# Backend API
NEXT_PUBLIC_TRICIA_BASE_URL=https://api.heytricia.ai/api/v1
TRICIA_API_BEARER_TOKEN=xxx

# Firebase (optional)
FIREBASE_PROJECT_ID=xxx
FIREBASE_CLIENT_EMAIL=xxx
FIREBASE_PRIVATE_KEY=xxx
```

### Running Locally

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build
npm start

# Run on all network interfaces (for mobile testing)
npm run dev:remote
```

### Testing WebRTC

1. Ensure microphone permissions are granted
2. Use HTTPS in production (required for WebRTC)
3. Check browser console for LiveKit connection logs

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add GOOGLE_CLIENT_ID
# ... add all required variables
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Building Custom Agents

### LiveKit Agent Requirements

1. Implement a LiveKit agent worker that:
   - Connects to LiveKit rooms
   - Processes audio streams
   - Generates responses
   - Publishes audio/video tracks

2. Register your agent with LiveKit Cloud or self-hosted server

3. Update environment variables:
   ```bash
   NEXT_PUBLIC_TRICIA_BASE_URL=https://your-api.com
   TRICIA_API_BEARER_TOKEN=your-token
   ```

### Example Agent Implementation

```python
# Python LiveKit Agent Example
from livekit.agents import JobContext, WorkerOptions, cli
from livekit.agents.llm import LLM
from livekit.agents.voice_assistant import VoiceAssistant

async def entrypoint(ctx: JobContext):
    # Initialize your LLM
    llm = LLM(model="gpt-4")
    
    # Create voice assistant
    assistant = VoiceAssistant(
        llm=llm,
        transcriber=YourTranscriber(),
        synthesizer=YourSynthesizer()
    )
    
    # Connect to room
    await ctx.connect()
    assistant.start(ctx.room)

if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            agent_name="your-agent-name"
        )
    )
```

## Troubleshooting

### Common Issues

#### WebRTC Connection Failed
```bash
# Check LiveKit connection
curl -X POST http://localhost:8005/api/tricia \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test"}'
```

#### Agent Not Joining Room
- Verify agent name in JWT matches registered worker
- Check agent logs for connection errors
- Ensure LiveKit server has agent dispatch enabled

#### OAuth Errors
- Verify redirect URI: `http://localhost:8005/api/auth/callback/google`
- Check Google Cloud Console for correct client configuration

### Debug Mode

Enable verbose logging:
```javascript
// In useConnection.tsx
console.log('[LiveKit]', 'Connection state:', state);
console.log('[LiveKit]', 'Participants:', room.remoteParticipants.size);
```

## Performance

- Audio latency: ~200-500ms (depending on network)
- Transcription accuracy: 85-95% (model dependent)
- Concurrent sessions: Limited by agent backend capacity
- WebRTC bandwidth: ~50-100 kbps per audio stream

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/your-feature`)
3. Follow existing code patterns
4. Add tests for new functionality
5. Submit pull request

## License

Apache License 2.0 - see [LICENSE](LICENSE)

---

Built on [LiveKit](https://livekit.io) | Default agent: [Tricia AI](https://heytricia.ai)


