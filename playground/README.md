# FastReel Playground

This is the demo frontend application for FastReel, showcasing the capabilities of the FastReel framework.

## About

The FastReel Playground is a Next.js application that demonstrates how to build AI-powered voice agents and social storytelling apps. It was initially forked from [LiveKit Agent Playground](https://github.com/livekit/agent-playground) and has been extensively customized.

Currently, this playground connects to Tricia's hosted API while the FastReel backend is under development.

## Structure

```
playground/
├── src/
│   ├── pages/          # Next.js pages and API routes
│   ├── components/     # React components
│   ├── lib/           # Utility functions
│   ├── hooks/         # Custom React hooks
│   ├── styles/        # Global styles
│   └── types/         # TypeScript definitions
├── public/            # Static assets
├── package.json       # Dependencies
└── next.config.js     # Next.js configuration
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

The app will run on http://localhost:8005

## Features

- **Voice Chat** - Real-time voice conversations with AI
- **Story Generation** - Convert conversations to shareable content
- **Senior-Friendly UI** - Accessible design for all ages
- **Firebase Auth** - Secure user authentication
- **LiveKit Integration** - High-quality voice streaming

## License

Apache 2.0 