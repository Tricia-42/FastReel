# Tricia API Reference

## Overview

The Tricia API powers AI-driven voice agents and social storytelling applications. This reference covers the core endpoints for creating voice chat sessions and generating reels from conversations.

**Base URL**: `https://api.heytricia.ai`

**Beta Access**: Contact i@heytricia.ai for API access and authorization tokens.

## Authentication

All API requests require authentication via Bearer token:

```http
Authorization: Bearer YOUR_TRICIA_API_TOKEN
```

## Core Endpoints

### Create Chat Session

The primary endpoint creates a LiveKit-powered chat room with an AI agent ready for voice interaction.

```http
POST /api/v1/chats
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "agent_id": "tricia-companion-v1"
}
```

**Response:**
```json
{
  "id": "18f158fa-6853-409a-839f-275dec3af26b",
  "room_name": "chat_18f158fa",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "livekit_url": "wss://livekit.heytricia.ai",
  "agent_status": "dispatched",
  "created_at": "2025-06-03T20:04:40.145Z"
}
```

### How It Works

1. **Room Creation**: Creates a LiveKit room for real-time voice communication
2. **Agent Dispatch**: Automatically dispatches the AI agent to the room
3. **Access Token**: Returns a LiveKit access token for the client to join
4. **Voice Chat**: Client uses the token to connect and start voice conversation
5. **Reel Generation**: Conversations can be converted to shareable reels

### Client Integration

Use the returned `access_token` with LiveKit SDK to join the room:

```javascript
import { Room, RoomEvent } from 'livekit-client';

// Create and connect to room
const room = new Room();
await room.connect(response.livekit_url, response.access_token);

// Handle voice chat events
room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
  // Handle incoming audio from AI agent
  if (track.kind === 'audio') {
    const audioElement = track.attach();
    document.body.appendChild(audioElement);
  }
});

// Start voice conversation
await room.localParticipant.setMicrophoneEnabled(true);
```

## User Management

### Check User Exists

```http
GET /api/v1/users/{userId}
Authorization: Bearer YOUR_TOKEN
```

### Create User

```http
POST /api/v1/users
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "id": "user-google-id",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "locale": "en-US"
}
```

## Reel Generation

After a conversation, generate shareable reels:

```http
POST /api/v1/reels/generate
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "chat_id": "18f158fa-6853-409a-839f-275dec3af26b",
  "style": "tiktok",
  "duration": 60
}
```

## WebSocket Events

When connected to a LiveKit room, the AI agent handles:

### Voice Interaction
- Real-time speech recognition
- Natural conversation flow
- Context-aware responses
- Senior-optimized speech processing

### Memory Preservation
- Automatic transcription
- Story extraction
- Journal generation
- Shareable content creation

## Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| Chat creation | 10 | 1 hour |
| Reel generation | 20 | 1 hour |
| API requests | 1000 | 1 hour |

## Error Responses

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid API token"
  }
}
```

Common error codes:
- `UNAUTHORIZED` - Invalid or missing token
- `RATE_LIMITED` - Too many requests
- `INVALID_REQUEST` - Bad request parameters
- `SERVER_ERROR` - Internal server error

## SDK Support

Currently, integrate directly with the REST API and LiveKit client SDK. Official Tricia SDK coming soon.

## Beta Access

The Tricia API is currently in beta. For access:
1. Contact i@heytricia.ai
2. Describe your use case
3. Receive API credentials
4. Start building with voice AI

## Coming Soon

- **Journal API** - Automated journal generation from conversations
- **Memory API** - Long-term memory management
- **Analytics API** - Conversation insights and metrics
- **Webhook Events** - Real-time notifications
- **Official SDKs** - JavaScript/Python client libraries 