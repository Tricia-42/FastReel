# FastReel Backend (Placeholder)

This backend folder contains placeholder Python scripts for the future self-hosted FastReel API server.

**⚠️ Note: Currently, FastReel uses the Tricia hosted API. This backend is for future open-source release.**

## Structure

```
backend/
├── api/
│   ├── companion.py      # Companion chat endpoints
│   ├── story.py         # Story/reel generation
│   └── voice.py         # Voice processing
├── config/
│   └── settings.py      # Configuration management
├── utils/
│   ├── ai_models.py     # AI model interfaces
│   └── media.py         # Media processing utilities
├── server.py            # Main FastAPI server
├── requirements.txt     # Python dependencies
└── README.md           # This file
```

## Quick Start (For Development Only)

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the placeholder server
python server.py
```

The server will start on http://localhost:8000

## API Endpoints (Placeholders)

- `POST /api/companion/chat` - Companion conversation
- `POST /api/story/generate` - Generate stories/reels from conversations
- `POST /api/voice/process` - Process voice input
- `GET /api/health` - Health check

## Future Features

When the full FastReel backend is released, it will include:

- **AI Storytelling Engine** - Convert conversations to TikTok-style reels
- **Dementia-Specialized Models** - Fine-tuned for senior care
- **Voice Processing Pipeline** - Senior-optimized speech recognition
- **Memory Context Management** - Maintain conversation coherence
- **Multi-modal Generation** - Create videos, journals, and shareable content

## Current Production Setup

In production, the frontend connects directly to:
- **Tricia API** - For AI companion functionality
- **LiveKit** - For real-time voice
- **Firebase** - For authentication

## Contributing

This backend is a placeholder for now. To contribute to FastReel:
1. Focus on frontend components in the main repository
2. Use Tricia API for backend functionality
3. Document any backend requirements for future implementation

## License

Apache 2.0 - Same as FastReel 