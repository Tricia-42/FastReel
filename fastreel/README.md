# FastReel Backend (WIP)

🚧 **Work in Progress** - This backend infrastructure is currently under development.

## Overview

The FastReel backend will consist of three specialized servers working together to provide a comprehensive AI-powered storytelling and companion experience:

### 1. API Server
- RESTful API for core FastReel functionality
- Story/reel generation from conversations
- User management and content storage
- Integration with AI models for content creation

### 2. LiveKit Voice Agent Server
- Fully customizable voice agent powered by LiveKit
- Real-time voice conversation capabilities
- Input/output guardrails for safe interactions
- Senior-optimized speech processing
- Customizable voice personas and interaction styles

### 3. MCP (Model Context Protocol) Server
- Handles journal generation from conversations
- Memory management and context preservation
- Automated content creation workflows
- Integration with external tools for rich content generation

## Architecture (Planned)

```
fastreel/
├── api-server/          # Core API endpoints
├── voice-agent/         # LiveKit-based voice agent
├── mcp-server/          # Journal generation & automation
└── shared/              # Shared utilities and configs
```

## Status

This backend infrastructure is being developed to replace the current Tricia API integration and provide a fully open-source, self-hosted solution for FastReel.

## Contributing

As this is a work in progress, we welcome ideas and contributions. Please check the main repository issues for planned features and development roadmap.

## License

Apache 2.0 - Same as FastReel 