# Tricia - AI Companion for Dementia Care

## Overview

Tricia is the flagship demo application built with FastReel, showcasing AI-powered memory companion capabilities for dementia care. Tricia demonstrates how to build empathetic, voice-enabled companions that help seniors preserve their life stories and memories through natural conversation, generating TikTok-style reels and journals.

**🌟 Live Demo:** [demo.heytricia.ai](https://demo.heytricia.ai) | **📖 Demo Docs:** [demo.md](demo.md)

## What is Tricia?

Tricia is an AI companion specializing in dementia care - a reference implementation that shows developers how FastReel enables:
- Building voice-first companion interfaces for seniors with memory loss
- Creating conversational AI that transforms chat into shareable stories and journals  
- Handling real-time voice interactions optimized for aging users
- Designing accessible and dementia-friendly companion experiences
- Generating TikTok-style content from life memories and conversations

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

### Running Tricia Locally

```bash
# Clone the FastReel repository
git clone https://github.com/Tricia-42/FastReel.git
cd FastReel

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Tricia API keys to .env.local

# Run the development server
npm run dev
```

Visit http://localhost:8005 to experience Tricia in action.

## Architecture

Tricia demonstrates the FastReel framework architecture for AI-powered storytelling companions:

```
Tricia Demo App (Frontend - This Repo)
├── FastReel UI Components
│   ├── Voice Interface (LiveKit) - Senior-optimized
│   ├── Memory Companion Components (React)
│   ├── Real-time Transcription (Large text)
│   ├── Story & Reel Generation Display
│   └── Journal Export & Family Sharing
├── FastReel Integration Layer
│   ├── Voice-to-Story Processing
│   ├── TikTok-style Reel Generation
│   ├── Memory Preservation APIs
│   └── Real-time Conversation Processing
└── Supporting Services
    ├── Firebase Authentication (Family access)
    ├── LiveKit Voice Infrastructure
    ├── Image Upload for Memory Enhancement
    └── Session & Story Management

FastReel Backend (Private Framework)
├── AI Storytelling Engine (Dementia-specialized)
├── Voice-to-Reel Processing Pipeline
├── Memory Context & Empathy Engine
├── Multi-modal Content Generation
└── Senior-First Accessibility Framework
```

## Key Components Used

### From FastReel Framework

- **VoiceAgent Component** - Main companion interaction interface
- **AudioInputTile** - Senior-optimized voice visualization
- **TranscriptionTile** - Large-text real-time transcription display
- **StoryGenerator** - Voice-to-reel conversion interface
- **MemoryCapture** - Photo and context integration
- **ConfigPanel** - Accessibility and personalization settings

### Tricia-Specific Components

- **DementiaCompanion** - Empathetic conversation interface
- **LifeStoryCapture** - Memory preservation workflows
- **FamilyShare** - Generated content sharing for relatives
- **CognitiveAccessibility** - Simplified navigation and large UI elements

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

Tricia demonstrates how FastReel can be adapted for:

- **Memory Preservation** - Help seniors capture and preserve life stories as TikTok-style reels
- **Dementia Support** - Provide empathetic AI companionship during memory loss progression
- **Family Connection** - Generate shareable video content and journals for family members
- **Care Facility Integration** - Support memory care programs with AI-assisted storytelling
- **Reminiscence Therapy** - Structured conversation that generates lasting content
- **"TikTok for Dementia"** - Transform memories into engaging, digestible video content

## Contributing

Tricia is open source as part of the FastReel framework. To contribute:

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
- **Source Code**: [GitHub](https://github.com/Tricia-42/FastReel)  
- **Demo Docs**: [demo.md](demo.md)
- **FastReel Docs**: [index.md](index.md)
- **Community**: [Slack](https://fastreel-community.slack.com)
- **Tricia Platform**: [heytricia.ai](https://heytricia.ai)

## License

Tricia is released under the Apache 2.0 license as part of the FastReel framework. 