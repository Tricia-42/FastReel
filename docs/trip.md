# Trip - Memory Companion for Dementia Care

## Overview

Trip is the flagship demo in the Tricia Playground, showcasing AI-powered memory companion capabilities for dementia care. It demonstrates how to build empathetic, voice-enabled companions that help seniors preserve their life stories and memories through natural conversation.

**🌟 Live Demo:** [demo.heytricia.ai](https://demo.heytricia.ai) | **📖 Arena Docs:** [arena.md](arena.md)

## What is Trip?

Trip is a memory journey companion - a reference implementation that shows developers how to:
- Build frontend companion interfaces for dementia care with Tricia integration
- Create conversational AI that transforms chat into journals and memory preservation
- Handle real-time voice interactions that generate stories from conversations
- Design accessible and senior-friendly companion UIs for memory care

## Features Demonstrated

### 1. Memory Preservation Through Voice
- Real-time voice chat using LiveKit that captures life stories
- Natural conversation flow that encourages reminiscing
- Voice activity detection optimized for seniors
- Echo cancellation for clear communication

### 2. AI Companion for Dementia Care
- Empathetic responses tailored for memory loss support
- Context-aware conversations that help seniors recall memories
- Multi-turn dialogue that builds coherent life stories
- Personalized interactions that adapt to individual cognitive needs

### 3. Journal & Story Generation
- Transform conversations into readable journals
- Generate short video summaries (TikTok-style for dementia)
- Support for image uploads to enhance memory stories
- Export capabilities for family sharing

### 4. Senior-Friendly UI/UX
- Large, clear interfaces designed for aging eyes
- Simplified navigation for cognitive accessibility
- Real-time transcription with large, readable text
- Visual feedback optimized for dementia patients

## Quick Start

### Running Trip Locally

```bash
# Clone the Tricia Playground repository
git clone https://github.com/Tricia-42/companion-kit.git
cd companion-kit

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your API keys to .env.local

# Run the development server
npm run dev
```

Visit http://localhost:8005 to see Trip in action.

## Architecture

Trip demonstrates the frontend architecture for Tricia-powered memory companion applications:

```
Trip Demo (Frontend - This Repo)
├── Next.js Application
│   ├── Voice Interface (LiveKit) - Senior-optimized
│   ├── Memory UI Components (React)
│   ├── Real-time Transcription (Large text)
│   ├── Journal Export & Sharing
│   └── Story Generation Display
├── Tricia API Integration
│   ├── Memory Companion Chat API
│   ├── Story & Journal Generation
│   ├── Voice Synthesis (Senior-friendly)
│   └── Real-time Memory Processing
└── Supporting Services
    ├── Firebase Authentication (Family access)
    ├── LiveKit Voice Infrastructure
    ├── Image Upload for Memory Enhancement
    └── Session & Memory Management

Tricia Backend (Private - CompanionKit)
├── AI Companion Engine (Dementia-specialized)
├── Memory Processing & Story Generation
├── Empathy Engine for Seniors
├── Voice & Language Models (Dementia-tuned)
└── Journal & Content Generation Framework
```

## Key Components Used

### From CompanionKit

- **Playground Component** - Main interaction interface
- **AudioInputTile** - Voice visualization
- **TranscriptionTile** - Real-time transcription display
- **ConfigPanel** - Settings and configuration

### Custom Components

- Trip-specific UI elements
- Journey tracking features
- Memory capture interfaces

## Customization Guide

### 1. Changing the Companion Personality

Edit the agent configuration:

```typescript
const tripCompanion = {
  name: "Trip",
  personality: "friendly travel companion",
  specializations: ["travel", "exploration", "storytelling"],
  voice: "warm and encouraging"
}
```

### 2. Adding New Features

Extend the base components:

```typescript
import { Playground } from '@/components/playground/Playground'

export function TripPlayground() {
  return (
    <Playground
      onConnect={handleConnect}
      themeColors={customColors}
      logo={<TripLogo />}
    />
  )
}
```

### 3. Styling

Customize the appearance:

```css
/* Override CompanionKit defaults */
:root {
  --ck-primary: #your-color;
  --ck-background: #your-bg;
}
```

## Use Cases

Trip demonstrates how CompanionKit can be adapted for:

- **Memory Preservation** - Help seniors capture and preserve life stories
- **Dementia Support** - Provide empathetic companionship during memory loss
- **Family Connection** - Generate shareable content for family members
- **Care Facility Integration** - Support memory care programs in facilities
- **Reminiscence Therapy** - Structured conversation for cognitive stimulation

## Contributing

Trip is open source as part of the Tricia Playground. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

**Focus Areas:**
- Frontend UI/UX improvements
- Accessibility enhancements
- New demo applications
- Documentation updates

See [Contributing Guide](contributing.md) for details.

## Resources

- **Live Demo**: [demo.heytricia.ai](https://demo.heytricia.ai)
- **Source Code**: [GitHub](https://github.com/Tricia-42/companion-kit)  
- **Arena Docs**: [arena.md](arena.md)
- **Playground Docs**: [index.md](index.md)
- **Community**: [Slack](https://companionkit-community.slack.com)
- **Tricia Platform**: [heytricia.ai](https://heytricia.ai)

## License

Trip is released under the Apache 2.0 license as part of the Tricia Playground. 