# Tricia - Pilot App

<!--BEGIN_DESCRIPTION-->
The Tricia Pilot App is a Next.js application that enables users to interact with Tricia, an AI-powered conversational assistant, through voice and chat. Users authenticate with a simple password, and the app automatically connects to a LiveKit WebRTC session for real-time audio/video communication with Tricia.
<!--END_DESCRIPTION-->

## Overview

This application transforms the LiveKit Agents Playground into a dedicated interface for Tricia, featuring:
- **Simple Password Authentication**: Quick access with password protection
- **Automatic Room Connection**: No manual URL/token entry required
- **Seamless Integration**: Direct connection to Tricia backend API
- **Real-time Communication**: Voice, video, and chat capabilities powered by LiveKit

## Prerequisites

1. **Tricia Backend API**: Access to the Tricia backend API
2. **Node.js**: Version 18 or higher

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env.local` file by copying the example:

```bash
cp env.example .env.local
```

Then update the values in `.env.local` with your actual credentials:

- **Supabase**: Update all Supabase-related URLs and keys
- **Postgres**: Update database connection strings
- **Tricia API**: Update the agent ID and bearer token if needed
- **LiveKit**: Update if using development/fallback mode

Note: The current implementation uses hardcoded values for the Tricia connection. To use environment variables instead, you would need to update the code in `src/hooks/useConnection.tsx` and `src/pages/api/tricia-proxy.ts`.

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Usage

1. **Access the App**: Navigate to the application URL
2. **Enter Password**: Use the password "tricia" to authenticate
3. **Connect**: Click the Connect button to start your session with Tricia
4. **Interact**: Use voice, video, or chat to communicate with your AI assistant

## Key Features

### Authentication Flow
- Simple password-based authentication
- Password hint provided for ease of use
- Secure connection to Tricia backend

### Connection Management
- Automatic API integration with Tricia backend
- LiveKit WebRTC session management
- Real-time audio/video streaming

### User Interface
- Clean, modern design with Tricia branding
- Responsive layout for desktop and mobile
- Intuitive controls for audio/video settings

## API Integration

The app connects to the Tricia API at `https://api.heytricia.ai/api/v1` with:
- Endpoint: `/chats` (POST)
- Authentication: Bearer token
- Creates chat sessions and retrieves LiveKit connection details

## Deployment

### Vercel Deployment

1. **Push to GitHub**: Ensure your code is in a GitHub repository
2. **Import to Vercel**: Connect your GitHub repo to Vercel
3. **Configure Environment**: Add any required environment variables
4. **Deploy**: Vercel will automatically build and deploy your app

### Production Considerations
- Ensure HTTPS is enabled for secure WebRTC connections
- Configure CORS if needed for API access
- Monitor API availability and handle errors gracefully

## Troubleshooting

### Common Issues

1. **API Connection Errors**:
   - Check if the Tricia API is accessible
   - Verify the API endpoint and authentication
   - Check browser console for detailed error messages

2. **WebRTC Issues**:
   - Ensure microphone/camera permissions are granted
   - Check firewall settings for WebRTC connections
   - Try using a different browser if issues persist

3. **Password Authentication**:
   - Password is case-insensitive
   - Default password is "tricia"

## Development

### Project Structure

```
src/
├── components/
│   ├── PlaygroundConnect.tsx (authentication UI)
│   ├── playground/
│   │   ├── Playground.tsx
│   │   └── PlaygroundHeader.tsx (Tricia branding)
│   └── chat/
├── hooks/
│   ├── useConnection.tsx (Tricia API integration)
│   └── useConfig.tsx
├── pages/
│   ├── index.tsx
│   └── api/
│       └── tricia-proxy.ts (CORS proxy for API)
└── styles/
```

### Making Changes

1. **Branding**: Update logos and colors in `PlaygroundHeader.tsx`
2. **Authentication**: Modify password logic in `PlaygroundConnect.tsx`
3. **API Integration**: Update connection logic in `useConnection.tsx`

## Support

For questions or issues:
- Tricia Backend API: Contact your API administrator
- LiveKit Documentation: [https://docs.livekit.io](https://docs.livekit.io)

---

Built with ❤️ using Next.js and LiveKit
