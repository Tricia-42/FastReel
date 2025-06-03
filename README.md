# FastReel

[![Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://demo.heytricia.ai)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](LICENSE)
[![Slack](https://img.shields.io/badge/slack-join-purple)](https://fastreel-community.slack.com)

An open-source framework for building AI-powered voice agents and dynamic social storytelling applications. Create TikTok-style reels and personalized narrative experiences from conversations.

**🌟 Experience FastReel: [Tricia Demo](https://demo.heytricia.ai) - AI companion for dementia care**

## What is FastReel?

FastReel is a developer framework for building AI-powered voice agents and social storytelling applications. Like [FastChat](https://github.com/lm-sys/FastChat) for chatbots, FastReel provides the infrastructure to create empathetic AI companions that generate dynamic, shareable content from conversations.

### Current Status

- ✅ **Demo Application** - Fully functional Tricia companion (using Tricia API)
- ✅ **Frontend Components** - React/Next.js UI toolkit for voice agents
- 🚧 **FastReel Backend** - Core framework under development (WIP)

The demo currently uses Tricia's hosted API. The full FastReel backend framework will be gradually rolled out.

## Architecture

```
FastReel/
├── fastreel/              # 🚀 FastReel Backend Framework (WIP)
│   ├── api-server/        # Core API for story generation
│   ├── voice-agent/       # LiveKit voice agent with guardrails
│   ├── mcp-server/        # MCP server for journal generation
│   └── README.md          # Backend documentation
│
├── playground/            # Demo frontend application
│   ├── src/              # Next.js source code
│   ├── public/           # Static assets
│   ├── package.json      # Frontend dependencies
│   └── README.md         # Playground documentation
│
└── docs/                  # Project documentation
```

## Quick Start (Demo App)

The demo app showcases FastReel capabilities using Tricia's API:

```bash
# Clone the repository
git clone https://github.com/Tricia-42/FastReel.git
cd FastReel

# Navigate to playground
cd playground

# Install dependencies
npm install

# Configure environment (uses Tricia API)
cp .env.example .env.local
# Add your Tricia API key and other credentials

# Run the demo
npm run dev
```

Visit http://localhost:8005 to see the Tricia companion demo.

## FastReel Backend (Coming Soon)

The FastReel backend will include three specialized servers:

### 1. API Server
- Story/reel generation from conversations
- Content management and storage
- AI model orchestration

### 2. LiveKit Voice Agent
- Fully customizable voice interactions
- Input/output guardrails for safety
- Senior-optimized speech processing
- Real-time conversation handling

### 3. MCP Server
- Automated journal generation
- Memory context preservation
- Tool integration for rich content
- Workflow automation

## Roadmap

- [x] **Phase 1**: Demo application with Tricia API
- [ ] **Phase 2**: FastReel API Server release
- [ ] **Phase 3**: Voice Agent framework
- [ ] **Phase 4**: MCP Server for automation
- [ ] **Phase 5**: Self-hosting documentation

## Use Cases

FastReel enables applications for:
- 🧠 **Memory Care** - AI companions for dementia patients
- 📖 **Story Generation** - Convert conversations to shareable content
- 🎙️ **Voice Journaling** - Automated diary creation
- 👥 **Social Storytelling** - TikTok-style reels from chats
- ♿ **Accessible Interfaces** - Senior-first design patterns

## Community

- **[Demo](https://demo.heytricia.ai)** - Try the Tricia companion
- **[Slack](https://fastreel-community.slack.com)** - Join our community
- **[Issues](https://github.com/Tricia-42/FastReel/issues)** - Report bugs
- **[Twitter](https://twitter.com/heytricia)** - Follow updates

## License

Apache 2.0 - See [LICENSE](LICENSE)

---

**Built by [Tricia](https://heytricia.ai)** | **FastReel Framework** *(gradual rollout in progress)* 