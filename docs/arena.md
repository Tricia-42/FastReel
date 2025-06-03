# Tricia Arena - Live Demo

**🌟 [demo.heytricia.ai](https://demo.heytricia.ai)**

The Tricia Arena is a live demonstration of AI companion capabilities, hosted publicly to showcase what's possible with the Tricia platform and CompanionKit framework.

## What is the Arena?

Similar to [FastChat's Chatbot Arena](https://chat.lmsys.org), the Tricia Arena is a hosted playground where users can:

- **Experience AI Companions** - Chat with Trip, the memory companion for seniors
- **Test Voice Interactions** - Real-time voice conversations optimized for dementia care
- **Explore Use Cases** - See how empathetic AI companions help preserve memories
- **Try Before Building** - Experience the platform before getting API access

## Current Demo: Trip

**Trip** is a memory companion AI designed for dementia care that demonstrates:

### Core Capabilities
- 🧠 **Memory Preservation** - Help seniors capture and preserve life stories
- 💭 **Story Generation** - Transform conversations into journals and memories
- 🗣️ **Senior Voice Chat** - Natural voice conversations optimized for aging users
- ❤️ **Dementia Support** - Empathetic responses tailored for memory loss
- 👨‍👩‍👧‍👦 **Family Connection** - Generate shareable content for loved ones  
- 📖 **Journal Creation** - Turn conversations into readable stories with images

### Technical Features
- **Senior-Optimized Voice** - Powered by LiveKit WebRTC with echo cancellation
- **Large Text Transcription** - Real-time conversation display for aging eyes
- **Dementia-Friendly Design** - Simple, clear interfaces for cognitive accessibility  
- **Memory-Safe UI** - WCAG compliant, optimized for memory care
- **Privacy Focused** - No permanent storage, safe for sensitive conversations

## Architecture

```
demo.heytricia.ai
├── Frontend (This Playground)
│   ├── Next.js Application
│   ├── LiveKit Voice Integration
│   ├── Real-time UI Components
│   └── Trip Demo Interface
│
├── Tricia API Backend
│   ├── AI Companion Engine
│   ├── Empathy Processing
│   ├── Voice Synthesis
│   └── Context Management
│
└── Infrastructure
    ├── Vercel Hosting
    ├── LiveKit Cloud
    ├── Firebase Auth
    └── CDN Distribution
```

## Usage Statistics

The arena helps us understand:
- User interaction patterns
- Voice vs text preferences  
- Popular conversation topics
- Technical performance metrics
- Accessibility usage patterns

*Note: All interactions are anonymous and temporary*

## Deployment Info

- **Hosting**: Vercel
- **Domain**: demo.heytricia.ai
- **SSL**: Cloudflare
- **Voice**: LiveKit Cloud
- **Auth**: Firebase
- **Analytics**: Privacy-focused metrics only

## Comparison to Other Arenas

| Feature | Tricia Arena | FastChat Arena | Character.AI |
|---------|--------------|----------------|--------------|
| **Focus** | Dementia Care | LLM Comparison | Character Chat |
| **Voice** | ✅ Senior-optimized | ❌ Text only | ❌ Text only |
| **Memory Care** | ✅ Specialized | ❌ None | ❌ None |
| **Journal Generation** | ✅ Core feature | ❌ None | ❌ None |
| **Privacy** | ✅ Medical-safe | ⚠️ Logged | ❌ Permanent |
| **Use Case** | Senior Care | Research | Entertainment |

## Future Expansions

### Planned Demo Apps
- **Sage** - Advanced dementia care with family photo recognition
- **Chronicle** - Life story documentation with multi-media memories
- **Connect** - Family bridge for sharing generated content
- **Comfort** - Late-stage dementia emotional support companion

### Arena Features
- **A/B Testing** - Compare companion personalities
- **Multi-Modal** - Image and document sharing
- **Custom Companions** - User-created personalities
- **Analytics Dashboard** - Public usage insights

## Technical Specifications

### Performance
- **Response Time**: < 200ms average
- **Voice Latency**: < 100ms real-time
- **Uptime**: 99.9% target
- **Concurrent Users**: 1000+ supported

### Browser Support
- **Chrome/Edge**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Voice may require user gesture
- **Mobile**: Responsive design, touch optimized

### Accessibility
- **Screen Readers**: Full ARIA support
- **Keyboard Navigation**: Complete keyboard control
- **High Contrast**: Automatic dark/light mode
- **Text Size**: Dynamic scaling support

## API Rate Limits

The arena uses the same Tricia API with these limits:
- **Conversations**: 50 messages per session
- **Voice Minutes**: 30 minutes per session  
- **Concurrent Sessions**: 1 per IP
- **Daily Limit**: 5 sessions per IP

*For production use, [request API access](https://developers.heytricia.ai)*

## Privacy & Data

### What We Collect
- ❌ **No Personal Data** - Anonymous sessions only
- ❌ **No Conversation Storage** - Messages deleted after session
- ❌ **No Voice Recording** - Audio not saved
- ✅ **Usage Metrics** - Anonymous performance data only

### What We Don't Collect
- Personal information
- Conversation content
- Voice recordings
- Account data
- Tracking across sessions

## Feedback & Support

### Report Issues
- **Bug Reports**: [GitHub Issues](https://github.com/Tricia-42/companion-kit/issues)
- **Feature Requests**: [Community Slack](https://companionkit-community.slack.com)
- **General Feedback**: feedback@heytricia.ai

### Community
- **Demo Feedback**: Share your experience
- **Feature Ideas**: What companions would you build?
- **Technical Questions**: Ask in Slack
- **Partnership Inquiries**: partners@heytricia.ai

## Getting Started Building

Inspired by the arena? Start building your own companion:

1. **Try the Demo**: [demo.heytricia.ai](https://demo.heytricia.ai)
2. **Clone the Playground**: This repository
3. **Request API Access**: [developers.heytricia.ai](https://developers.heytricia.ai)
4. **Join Community**: [Slack](https://companionkit-community.slack.com)
5. **Read Docs**: [Getting Started](getting-started.md)

---

**Arena Status**: ✅ Live and Operational  
**Last Updated**: December 2024  
**Next Demo**: Sage (Advanced Dementia Care) - Coming Q1 2025 