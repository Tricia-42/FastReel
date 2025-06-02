# StayReel API Reference

## Overview

StayReel provides a comprehensive API for building memory preservation applications. This reference covers both the JavaScript/TypeScript SDK and the REST API endpoints.

## JavaScript SDK

### Installation

```bash
npm install @stayreel/core
```

### Basic Usage

```typescript
import { StayReel, MemorySession } from '@stayreel/core'

// Initialize StayReel
const stayreel = new StayReel({
  apiKey: process.env.STAYREEL_API_KEY,
  options: {
    environment: 'production',
    region: 'us-east-1'
  }
})

// Create a memory session
const session = await stayreel.createSession({
  userId: 'user-123',
  companion: 'sarah-gentle-guide',
  mode: 'voice'
})
```

## Core Classes

### StayReel

The main client for interacting with the StayReel API.

```typescript
class StayReel {
  constructor(config: StayReelConfig)
  
  // Session Management
  createSession(options: SessionOptions): Promise<MemorySession>
  getSession(sessionId: string): Promise<MemorySession>
  listSessions(userId: string): Promise<MemorySession[]>
  
  // Memory Management
  createMemory(data: MemoryData): Promise<Memory>
  getMemory(memoryId: string): Promise<Memory>
  updateMemory(memoryId: string, updates: Partial<Memory>): Promise<Memory>
  deleteMemory(memoryId: string): Promise<void>
  
  // AI Companions
  listCompanions(): Promise<Companion[]>
  getCompanion(companionId: string): Promise<Companion>
}
```

### MemorySession

Represents an active memory preservation session.

```typescript
class MemorySession {
  // Properties
  id: string
  userId: string
  companion: Companion
  status: SessionStatus
  startedAt: Date
  
  // Methods
  connect(): Promise<void>
  disconnect(): Promise<void>
  
  // Voice Methods
  startRecording(): Promise<void>
  stopRecording(): Promise<void>
  
  // Text Methods
  sendMessage(text: string): Promise<Response>
  
  // Memory Methods
  saveMemory(): Promise<Memory>
  getTranscript(): Promise<Transcript>
  
  // Events
  on(event: 'connected' | 'disconnected' | 'error', handler: Function): void
  on(event: 'transcription', handler: (text: string) => void): void
  on(event: 'response', handler: (response: Response) => void): void
}
```

### Memory

Represents a preserved memory.

```typescript
interface Memory {
  id: string
  userId: string
  sessionId: string
  title: string
  summary: string
  transcript: Transcript
  tags: string[]
  createdAt: Date
  updatedAt: Date
  media?: MediaAttachment[]
  shareSettings: ShareSettings
  metadata: Record<string, any>
}
```

## REST API

Base URL: `https://api.stayreel.ai/v1`

### Authentication

All API requests require authentication via API key:

```http
Authorization: Bearer YOUR_API_KEY
```

### Endpoints

#### Sessions

##### Create Session
```http
POST /sessions
Content-Type: application/json

{
  "userId": "user-123",
  "companionId": "sarah-gentle-guide",
  "mode": "voice",
  "metadata": {
    "source": "web-app"
  }
}
```

Response:
```json
{
  "id": "session-456",
  "userId": "user-123",
  "companion": {
    "id": "sarah-gentle-guide",
    "name": "Sarah",
    "description": "A gentle guide for life stories"
  },
  "status": "active",
  "connectionUrl": "wss://rt.stayreel.ai/session-456",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

##### Get Session
```http
GET /sessions/{sessionId}
```

##### List Sessions
```http
GET /sessions?userId={userId}&limit=10&offset=0
```

#### Memories

##### Create Memory
```http
POST /memories
Content-Type: application/json

{
  "sessionId": "session-456",
  "title": "My First Day at School",
  "tags": ["childhood", "education"],
  "shareSettings": {
    "visibility": "private"
  }
}
```

##### Get Memory
```http
GET /memories/{memoryId}
```

##### Update Memory
```http
PATCH /memories/{memoryId}
Content-Type: application/json

{
  "title": "Updated Title",
  "tags": ["childhood", "school", "1960s"]
}
```

##### Delete Memory
```http
DELETE /memories/{memoryId}
```

##### Export Memory
```http
POST /memories/{memoryId}/export
Content-Type: application/json

{
  "format": "pdf",
  "options": {
    "includeTranscript": true,
    "includeMedia": true
  }
}
```

#### Companions

##### List Companions
```http
GET /companions
```

Response:
```json
{
  "companions": [
    {
      "id": "sarah-gentle-guide",
      "name": "Sarah",
      "description": "A gentle guide for life stories",
      "specialties": ["life-stories", "family-history"],
      "languages": ["en", "es", "fr"],
      "voiceId": "voice-sarah-v2"
    }
  ]
}
```

#### Media

##### Upload Media
```http
POST /media/upload
Content-Type: multipart/form-data

file: [binary data]
memoryId: memory-789
type: photo
description: "Family reunion photo from 1985"
```

##### Get Media
```http
GET /media/{mediaId}
```

## WebSocket Events

When connected to a session via WebSocket:

### Client -> Server

```json
// Start recording
{
  "type": "start_recording",
  "data": {}
}

// Send text message
{
  "type": "message",
  "data": {
    "text": "I remember my first day of school..."
  }
}

// Stop recording
{
  "type": "stop_recording",
  "data": {}
}
```

### Server -> Client

```json
// Transcription update
{
  "type": "transcription",
  "data": {
    "text": "I remember my first day of school...",
    "isFinal": false
  }
}

// AI response
{
  "type": "response",
  "data": {
    "text": "That sounds like an important memory. Can you tell me more about how you felt that day?",
    "audioUrl": "https://audio.stayreel.ai/response-123.mp3"
  }
}

// Session status
{
  "type": "status",
  "data": {
    "status": "active",
    "duration": 120
  }
}
```

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The companion ID provided is invalid",
    "details": {
      "companionId": "invalid-id"
    }
  }
}
```

### Common Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `UNAUTHORIZED` | Invalid or missing API key | 401 |
| `FORBIDDEN` | Access denied to resource | 403 |
| `NOT_FOUND` | Resource not found | 404 |
| `INVALID_REQUEST` | Invalid request parameters | 400 |
| `RATE_LIMITED` | Too many requests | 429 |
| `SERVER_ERROR` | Internal server error | 500 |

## Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| Session creation | 10 | 1 hour |
| Memory creation | 100 | 1 hour |
| API requests | 1000 | 1 hour |
| Media uploads | 50 | 1 day |

## Webhooks

Configure webhooks to receive real-time updates:

```http
POST /webhooks
Content-Type: application/json

{
  "url": "https://your-app.com/webhooks/stayreel",
  "events": ["session.completed", "memory.created"],
  "secret": "your-webhook-secret"
}
```

### Webhook Events

- `session.started` - New session started
- `session.completed` - Session ended
- `memory.created` - New memory created
- `memory.updated` - Memory updated
- `memory.shared` - Memory shared
- `media.uploaded` - Media attached to memory

## SDK Examples

### React Hook

```typescript
import { useMemorySession } from '@stayreel/react'

function MemoryRecorder() {
  const { session, isConnected, startRecording, stopRecording } = useMemorySession({
    companionId: 'sarah-gentle-guide',
    onTranscription: (text) => console.log('Transcription:', text),
    onResponse: (response) => console.log('AI Response:', response)
  })
  
  return (
    <div>
      <button onClick={startRecording}>Start</button>
      <button onClick={stopRecording}>Stop</button>
    </div>
  )
}
```

### Node.js Integration

```typescript
import { StayReel } from '@stayreel/node'

const stayreel = new StayReel({
  apiKey: process.env.STAYREEL_API_KEY
})

// Process uploaded audio
async function processAudioMemory(audioFile: Buffer, userId: string) {
  const session = await stayreel.createSession({
    userId,
    companion: 'sarah-gentle-guide',
    mode: 'audio-upload'
  })
  
  const memory = await session.processAudio(audioFile)
  return memory
}
```

## Best Practices

1. **Session Management**: Always properly disconnect sessions when done
2. **Error Handling**: Implement exponential backoff for retries
3. **Security**: Never expose API keys in client-side code
4. **Privacy**: Encrypt sensitive data before storing
5. **Performance**: Use pagination for listing endpoints
6. **Webhooks**: Verify webhook signatures for security 