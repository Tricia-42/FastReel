# FastReel

[![Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://demo.heytricia.ai)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](LICENSE)
[![Slack](https://img.shields.io/badge/slack-join-purple)](https://fastreel-community.slack.com)

An open-source toolkit for rapidly building AI-driven voice agents and dynamic social storytelling apps. Create TikTok-style reels and personalized narrative experiences for dementia care and beyond.

**🌟 Experience FastReel with our flagship demo: [Tricia](https://demo.heytricia.ai) - AI companion for dementia care**

## What is FastReel?

FastReel is a developer-first framework for building AI-powered voice agents and social storytelling applications. Like [FastChat](https://github.com/lm-sys/FastChat) for chatbots, FastReel provides the tools to rapidly create empathetic companions that generate dynamic, TikTok-style content.

### What's Included
- ✅ **Frontend Components** - React/Next.js UI toolkit for voice agents
- ✅ **Tricia Demo** - Complete dementia care companion showcasing FastReel capabilities
- ✅ **Voice Integration** - Real-time voice chat optimized for seniors via LiveKit  
- ✅ **Story Generation** - Transform conversations into shareable reels and journals
- ✅ **Senior-First Design** - Accessibility patterns for aging users

### What's Not Included (Yet)
- ❌ **FastReel Backend** - The full AI storytelling framework (currently private)
- ❌ **Self-hosting** - Requires Tricia API access for AI processing
- ❌ **Custom Models** - Uses Tricia's hosted dementia-specialized models

> **Note**: The complete **FastReel framework** (backend + self-hosting) will be released as open-source. This demo showcases what you can build with it.

## Quick Start

### Frontend (Next.js)

```bash
# Clone the repository
git clone https://github.com/Tricia-42/FastReel.git
cd FastReel

# Install dependencies
npm install

# Set up environment variables
# Create .env.local and add your API keys:
# - TRICIA_API_KEY
# - LIVEKIT_API_KEY & LIVEKIT_API_SECRET
# - Firebase configuration
# See docs/setup.md for detailed configuration

# Run development server
npm run dev
```

Visit http://localhost:8005 to experience Tricia locally.

### Backend (Python - Optional Placeholder)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the placeholder API server
python server.py
```

The placeholder API runs on http://localhost:8000

## Live Demo

**🌟 [demo.heytricia.ai](https://demo.heytricia.ai)** - Experience Tricia, the dementia care companion

See [Demo Documentation](docs/demo.md) for details about the hosted application.

## Use Cases Demonstrated

Tricia showcases how FastReel enables:
- 🧠 **Memory Preservation** - Help seniors capture and journal life stories
- 👥 **Dementia Care** - Empathetic companion for memory loss support
- 💬 **Social Voice Chat** - Natural conversations that generate shareable content
- 📖 **Story Generation** - Transform conversations into TikTok-style reels and journals
- ♿ **Senior Accessibility** - WCAG compliant, dementia-friendly interfaces

## File Structure

```
FastReel/
├── src/
│   ├── pages/                    # Next.js Pages Router
│   │   ├── api/                 # API routes
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   └── tricia/         # Tricia API integration
│   │   ├── auth/               # Auth pages
│   │   ├── _app.tsx            # App configuration
│   │   └── index.tsx           # Home page
│   ├── components/              # React components
│   │   ├── button/             # UI components
│   │   ├── chat/               # Chat interface
│   │   ├── playground/         # Main companion interface
│   │   └── toast/              # Notifications
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utility functions
│   ├── styles/                  # Global styles
│   └── types/                   # TypeScript types
├── backend/                      # Python API (Placeholder)
│   ├── api/                    # API endpoints
│   ├── config/                 # Configuration
│   ├── utils/                  # Utilities
│   ├── server.py               # FastAPI server
│   └── requirements.txt        # Python deps
├── public/                       # Static assets
├── docs/                         # Documentation
│   ├── tricia.md               # Tricia companion docs
│   └── demo.md                 # Live demo docs
├── scripts/                      # Build scripts
├── package.json                  # Node dependencies
├── next.config.js               # Next.js config
├── tsconfig.json                # TypeScript config
└── README.md                    # This file
```

## Architecture

```
FastReel Frontend (This Repo)
├── Next.js 14 (Pages Router)
├── React 18 Components
├── TypeScript
├── Tailwind CSS
├── LiveKit Voice Integration
└── Firebase Auth

FastReel Backend (Currently Tricia API)
├── AI Storytelling Engine
├── Voice-to-Reel Processing
├── Memory Context Management
├── Dementia-Specialized Models
└── Content Generation Pipeline
```

## Requirements

### Frontend
- Node.js 18+
- npm or yarn
- **Tricia API key** ([Request access](https://developers.heytricia.ai))
- LiveKit account (for voice features)
- Firebase account (for authentication)

### Backend (For future self-hosting)
- Python 3.9+
- pip
- Virtual environment (recommended)

## Documentation

- **[Live Demo](docs/demo.md)** - About Tricia at demo.heytricia.ai
- **[Tricia App](docs/tricia.md)** - Dementia care companion walkthrough
- **[Getting Started](docs/getting-started.md)** - Setup and development
- **[Components](docs/components.md)** - FastReel component library
- **[Deployment](docs/deployment.md)** - Deploy your own FastReel app

## Roadmap

- [x] **Phase 1**: FastReel frontend with Tricia dementia companion *(Current)*
- [ ] **Phase 2**: Additional storytelling demos (family photos, music memories)
- [ ] **Phase 3**: Complete FastReel component library documentation  
- [ ] **Phase 4**: FastReel backend framework open-source release
- [ ] **Phase 5**: Self-hosting support for care facilities

## Community

- **[Live Demo](https://demo.heytricia.ai)** - Experience Tricia now
- **[Slack](https://fastreel-community.slack.com)** - Join the FastReel community
- **[GitHub Issues](https://github.com/Tricia-42/FastReel/issues)** - Report bugs and feature requests
- **[Twitter](https://twitter.com/heytricia)** - Follow FastReel updates

## FAQ

**Q: Can I self-host FastReel?**  
A: Not yet. This demo requires Tricia's hosted API. The full FastReel framework for self-hosting will be released as open-source.

**Q: How is this different from the full FastReel framework?**  
A: This is like FastChat's demo - showcasing capabilities. The complete framework (backend, self-hosting, custom models) is in development.

**Q: Can I build my own AI storytelling app for dementia care?**  
A: Yes! Use Tricia as a reference implementation. You'll need a Tricia API key and can customize the FastReel components for your specific needs.

**Q: What makes FastReel different from other AI frameworks?**  
A: FastReel specializes in voice-to-story generation, creating TikTok-style reels from conversations, with senior-first accessibility design.

## Supported Development Environment

- **Next.js** 14.x (Pages Router)
- **React** 18.x
- **TypeScript** 5.x
- **Node.js** 18.x - 20.x
- **Python** 3.9+ (for backend placeholder)

## Tech Stack

### Frontend
- **Framework**: Next.js 14 with Pages Router
- **UI Library**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Voice**: LiveKit WebRTC
- **Auth**: Firebase Authentication
- **State**: React Context + Hooks

### Backend (Placeholder)
- **Framework**: FastAPI
- **Language**: Python 3.9+
- **API**: RESTful + WebSocket
- **Future**: AI models, voice processing, content generation

## License

Apache 2.0 - See [LICENSE](LICENSE)

---

**Built by [Tricia](https://heytricia.ai)** | **Powered by FastReel** *(framework coming soon)*


