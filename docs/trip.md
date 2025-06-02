# Trip - CompanionKit Demo App

## Overview

Trip is a demo application showcasing the capabilities of CompanionKit. It demonstrates how to build an AI-powered companion for travel and journey experiences using the CompanionKit toolkit.

**Live Demo:** [demo.heytricia.ai](https://demo.heytricia.ai)

## What is Trip?

Trip is a reference implementation that shows developers how to:
- Integrate CompanionKit components
- Build conversational AI experiences
- Handle real-time voice interactions
- Create empathetic companion interfaces

## Features Demonstrated

### 1. Voice Conversations
- Real-time voice chat using LiveKit
- Natural conversation flow
- Voice activity detection
- Echo cancellation

### 2. AI Companion Integration
- Empathetic responses
- Context-aware conversations
- Multi-turn dialogue management
- Personalized interactions

### 3. UI/UX Patterns
- Responsive design
- Accessibility features
- Real-time transcription
- Visual feedback

## Quick Start

### Running Trip Locally

```bash
# Clone the CompanionKit repository
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

Trip demonstrates the recommended architecture for CompanionKit applications:

```
Trip Demo App
├── Frontend (Next.js)
│   ├── Voice Interface (LiveKit)
│   ├── UI Components (React)
│   └── State Management
├── CompanionKit Integration
│   ├── AI Agent Connection
│   ├── Real-time Events
│   └── Data Handling
└── Backend Services
    ├── Tricia AI Backend
    ├── Authentication (Firebase)
    └── Session Management
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

- **Travel Journaling** - Capture journey memories
- **Trip Planning** - Interactive travel assistant
- **Story Sharing** - Document adventures
- **Language Practice** - Conversational learning

## Contributing

Trip is open source and part of CompanionKit. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

See [Contributing Guide](contributing.md) for details.

## Resources

- **Source Code**: [GitHub](https://github.com/Tricia-42/companion-kit)
- **Documentation**: [CompanionKit Docs](index.md)
- **Community**: [Slack](https://companionkit-community.slack.com)
- **Support**: support@companionkit.ai

## License

Trip is released under the same Apache 2.0 license as CompanionKit. 