# Tricia Web - Memory Guide Interface

![Next.js](https://img.shields.io/badge/Next.js-14.0.4-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue?logo=typescript)
![LiveKit](https://img.shields.io/badge/LiveKit-2.5.1-FF5B00)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)

A modern web interface for Tricia, your personal memory guide. Built on LiveKit's real-time communication infrastructure, this application provides seamless voice, video, and chat capabilities for capturing and preserving your stories through guided conversations.

## 🏗️ Architecture Overview

### Technology Stack
- **Frontend Framework**: Next.js 14 with TypeScript
- **Real-time Communication**: LiveKit WebRTC
- **Styling**: Tailwind CSS with custom components
- **State Management**: React Context API + Hooks
- **Deployment**: Vercel
- **API Integration**: Tricia Backend API

### Project Structure
```
src/
├── components/          # React components
│   ├── playground/      # Main app interface components
│   ├── chat/           # Chat functionality
│   ├── config/         # Configuration UI components
│   └── toast/          # Notification system
├── hooks/              # Custom React hooks
│   ├── useConnection   # WebRTC connection management
│   └── useConfig       # App configuration
├── pages/              # Next.js pages
│   ├── api/           # API routes (including CORS proxy)
│   └── index.tsx      # Main application page
├── styles/            # Global styles
└── lib/              # Utility functions
```

## 🚀 Getting Started for Developers

### Prerequisites
- Node.js 18+ and npm
- Access to Vercel team (for deployment)
- Access to Tricia backend API credentials

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tricia-Inc/Web.git
   cd Web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Get environment variables from Vercel**
   
   Since you're part of the Vercel team, pull the environment variables:
   ```bash
   vercel env pull .env.local
   ```
   
   This will download all production environment variables to your local `.env.local` file.

4. **Verify your `.env.local`**
   
   Ensure these critical variables are present:
   ```env
   # Tricia API (Required)
   NEXT_PUBLIC_TRICIA_BASE_URL=https://api.heytricia.ai/api/v1
   NEXT_PUBLIC_TRICIA_AGENT_ID=<agent-id>
   NEXT_PUBLIC_TRICIA_USER_ID=<user-id>
   TRICIA_API_BEARER_TOKEN=<bearer-token>
   
   # Optional: LiveKit fallback
   LIVEKIT_API_KEY=<if-using-env-mode>
   LIVEKIT_API_SECRET=<if-using-env-mode>
   NEXT_PUBLIC_LIVEKIT_URL=<if-using-env-mode>
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:8005](http://localhost:8005) (note: custom port 8005)

## 🔑 Key Features & Implementation Details

### Authentication Flow
- **Password-based**: Simple password authentication (default: "tricia")
- **Implementation**: `src/components/PlaygroundConnect.tsx`
- **No database required**: Authentication is handled client-side for simplicity

### Connection Management
- **Automatic connection**: Connects to Tricia backend upon authentication
- **WebRTC session**: Managed via LiveKit SDK
- **Implementation**: `src/hooks/useConnection.tsx`
- **Connection modes**:
  - `tricia`: Production mode - connects to Tricia API
  - `env`: Development mode - uses LiveKit credentials from env
  - `manual`: Debug mode - manual URL/token entry

### API Integration
- **Tricia Backend**: `POST /chats` endpoint creates WebRTC sessions
- **CORS Proxy**: `/api/tricia-proxy` handles browser CORS restrictions
- **Response format**:
  ```json
  {
    "participant_token": "jwt-token",
    "server_url": "wss://livekit-server.com"
  }
  ```

### Real-time Features
- **Voice communication**: Full-duplex audio with echo cancellation
- **Video streaming**: Agent video display with configurable quality
- **Chat interface**: Real-time transcription display
- **RPC capabilities**: Remote procedure calls to agent

### UI/UX Customization
- **Theme colors**: 8 pre-defined color schemes
- **Responsive design**: Desktop and mobile optimized
- **Settings panel**: Runtime configuration options
- **Audio visualization**: Real-time audio level indicators

## 🛠️ Development Workflow

### Making Changes

1. **UI Components**
   - Modify components in `src/components/`
   - Use Tailwind CSS for styling
   - Follow existing component patterns

2. **Branding**
   - Logo: Update in `src/components/playground/PlaygroundHeader.tsx`
   - Colors: Modify theme options in `src/pages/index.tsx`
   - Title/Meta: Update in `src/hooks/useConfig.tsx`

3. **API Integration**
   - Connection logic: `src/hooks/useConnection.tsx`
   - Proxy endpoints: `src/pages/api/tricia-proxy.ts`
   - Add new API calls as needed

4. **Testing Locally**
   ```bash
   # Run with hot reload
   npm run dev
   
   # Test production build
   npm run build
   npm start
   
   # Lint code
   npm run lint
   ```

## 📦 Deployment

### Automatic Deployment (Recommended)
Every push to `main` branch automatically deploys to Vercel.

### Manual Deployment
```bash
# Deploy to production
vercel --prod

# Deploy preview
vercel
```

### Environment Variable Management

**Update environment variables:**
```bash
# Pull latest from Vercel
vercel env pull .env.local

# Push local changes to Vercel
./push-env-to-vercel.sh

# Or use Vercel dashboard
# Project Settings → Environment Variables
```

**Required environment variables:**
| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_TRICIA_BASE_URL` | Tricia API base URL | ✅ |
| `NEXT_PUBLIC_TRICIA_AGENT_ID` | Agent identifier | ✅ |
| `NEXT_PUBLIC_TRICIA_USER_ID` | User identifier | ✅ |
| `TRICIA_API_BEARER_TOKEN` | API authentication token | ✅ |
| `NEXT_PUBLIC_SUPABASE_*` | Supabase config (if using) | ❌ |
| `LIVEKIT_*` | LiveKit config (dev mode) | ❌ |

## 🐛 Troubleshooting

### Common Issues

1. **"NotAllowedError: A user gesture is required"**
   - Browser security requires user interaction for media access
   - Solution: Click "Enable audio playback" button when prompted

2. **CORS errors with API**
   - Use the proxy endpoint: `/api/tricia-proxy`
   - Ensure `TRICIA_API_BEARER_TOKEN` is set

3. **WebRTC connection failures**
   - Check browser console for detailed errors
   - Verify firewall allows WebRTC traffic
   - Test with different browser/network

4. **Build failures on Vercel**
   - Check all `NEXT_PUBLIC_*` variables are set
   - Review build logs in Vercel dashboard

### Debug Mode
Add `#debug=1` to URL for additional logging and manual connection options.

## 🔧 Advanced Configuration

### Custom Deployment
To deploy to your own infrastructure:

1. Build the application:
   ```bash
   npm run build
   ```

2. The build output is in `.next/` directory

3. Deploy using Node.js:
   ```bash
   npm start
   ```

4. Or use Docker:
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY .next ./.next
   COPY public ./public
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

### Performance Optimization
- **Dynamic imports**: Heavy components are lazy-loaded
- **Image optimization**: Next.js Image component used
- **API caching**: Consider implementing SWR for API calls
- **WebRTC optimization**: Adaptive bitrate enabled by default

## 📚 Additional Resources

- **LiveKit Documentation**: [https://docs.livekit.io](https://docs.livekit.io)
- **Next.js Documentation**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **Tailwind CSS**: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Test thoroughly (including mobile)
4. Create a pull request
5. Ensure CI checks pass
6. Request review from team

### Code Style
- TypeScript strict mode enabled
- ESLint configuration included
- Prettier for formatting
- Follow existing patterns

## 📄 License

Proprietary - Tricia Inc. All rights reserved.

---

Built with ❤️ by the Tricia team using Next.js, LiveKit, and modern web technologies.
