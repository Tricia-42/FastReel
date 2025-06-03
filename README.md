# Tricia Playground

[![Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://demo.heytricia.ai)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](LICENSE)
[![Slack](https://img.shields.io/badge/slack-join-purple)](https://join.slack.com/t/companionkit-community/shared_invite/xyz)

An open-source playground and demo application showcasing AI-powered companion experiences for dementia care, built with [Tricia](https://heytricia.ai).

**🚀 [Try the live demo at demo.heytricia.ai](https://demo.heytricia.ai)**

## What is this?

This repository contains the **frontend playground** for demonstrating Tricia's AI companion capabilities. It's similar to how [FastChat's Chatbot Arena](https://chat.lmsys.org) showcases their framework - a public demo that lets you experience what's possible.

### What's Included
- ✅ **Frontend Components** - React/Next.js UI components for companion apps
- ✅ **Trip Demo App** - Memory companion for dementia care and journaling
- ✅ **Voice Integration** - Real-time voice chat via LiveKit  
- ✅ **Example Implementations** - Show how to build companion UIs for seniors

### What's Not Included (Yet)
- ❌ **CompanionKit Backend** - The full AI companion framework (currently private)
- ❌ **Self-hosting** - Requires Tricia API access
- ❌ **Custom Models** - Uses Tricia's hosted AI models

> **Note**: The complete **CompanionKit framework** (backend + self-hosting) will be released as open-source in the future. This playground demonstrates what you can build with it.

## Quick Start

```bash
git clone https://github.com/Tricia-42/companion-kit.git
cd companion-kit
npm install

# Set up your environment
cp .env.example .env.local
# Add your Tricia API key to .env.local

npm run dev
```

Visit http://localhost:8005 to see the Trip demo app locally.

## Live Demo

**🌟 [demo.heytricia.ai](https://demo.heytricia.ai)** - Experience the Trip memory companion

See [Arena Documentation](docs/arena.md) for details about the hosted demo.

## Use Cases Demonstrated

This playground shows how to build companions for:
- 🧠 **Memory Preservation** - Help seniors capture and journal life stories
- 👥 **Dementia Care** - Empathetic companion for memory loss support
- 💬 **Social Voice Chat** - Natural conversations that generate content
- 📖 **Story Generation** - Transform conversations into journals and memories
- ♿ **Senior Accessibility** - WCAG compliant, dementia-friendly interfaces

## Architecture

```
Tricia Playground (This Repo)
├── Frontend Components (React/Next.js)
├── Trip Demo (Memory Companion)
├── Senior-Friendly UI Patterns
└── Dementia Care Examples

CompanionKit Backend (Private)
├── AI Companion Framework
├── Memory Processing & Journaling
├── Tricia API Services (Dementia Care)
├── Voice Processing & Story Generation
└── Empathy Engine
```

## Requirements

- Node.js 18+
- **Tricia API key** ([Request access](https://developers.heytricia.ai))
- LiveKit account (for voice features)
- Firebase account (for authentication)

## Documentation

- **[Arena Demo](docs/arena.md)** - About the live demo at demo.heytricia.ai
- **[Trip App](docs/trip.md)** - Travel companion demo walkthrough
- **[Getting Started](docs/getting-started.md)** - Setup and development
- **[Components](docs/components.md)** - Frontend component library
- **[Deployment](docs/deployment.md)** - Host your own playground

## Roadmap

- [x] **Phase 1**: Frontend playground with Trip memory companion *(Current)*
- [ ] **Phase 2**: Additional dementia care demos (family photos, music memories)
- [ ] **Phase 3**: Senior-friendly component library documentation  
- [ ] **Phase 4**: CompanionKit backend framework release
- [ ] **Phase 5**: Self-hosting support for care facilities

## Community

- **[Live Demo](https://demo.heytricia.ai)** - Try it now
- **[Slack](https://join.slack.com/t/companionkit-community/shared_invite/xyz)** - Join the community
- **[GitHub Issues](https://github.com/Tricia-42/companion-kit/issues)** - Report bugs
- **[Twitter](https://twitter.com/heytricia)** - Follow updates

## FAQ

**Q: Can I self-host this?**  
A: Not yet. This playground requires Tricia's hosted API. The full CompanionKit framework for self-hosting will be released later.

**Q: How is this different from the full CompanionKit?**  
A: This is like FastChat's Arena - a demo playground. The complete framework (backend, self-hosting, custom models) is in development.

**Q: Can I build my own companion app for dementia care?**  
A: Yes! Use this as a reference implementation. You'll need a Tricia API key and can customize the frontend components for your specific care needs.

## License

Apache 2.0 - See [LICENSE](LICENSE)

---

**Built by [Tricia](https://heytricia.ai)** | **Powered by CompanionKit** *(framework coming soon)*


