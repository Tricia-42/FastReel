#!/usr/bin/env python3
"""
FastReel Backend API Server (Placeholder)
Currently using Tricia hosted API - this is for future self-hosting
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="FastReel API",
    description="AI-powered storytelling and voice agent backend for dementia care",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8005", "https://demo.heytricia.ai"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class CompanionMessage(BaseModel):
    message: str
    user_id: Optional[str] = None
    session_id: str
    context: Optional[dict] = None

class StoryGenerationRequest(BaseModel):
    conversation_id: str
    format: str = "journal"  # journal, reel, video
    include_images: bool = False

class VoiceProcessingRequest(BaseModel):
    audio_data: str  # base64 encoded
    session_id: str
    language: str = "en"

# API Routes
@app.get("/")
async def root():
    return {
        "message": "FastReel API Server",
        "status": "placeholder",
        "note": "Currently using Tricia hosted API. This server is for future self-hosting."
    }

@app.post("/api/companion/chat")
async def companion_chat(request: CompanionMessage):
    """
    Placeholder for companion chat endpoint
    In production, this connects to Tricia API
    """
    return {
        "response": "This is a placeholder response. Please use Tricia API.",
        "session_id": request.session_id,
        "status": "placeholder"
    }

@app.post("/api/story/generate")
async def generate_story(request: StoryGenerationRequest):
    """
    Placeholder for story/reel generation
    Transforms conversations into shareable content
    """
    return {
        "story_id": "placeholder_123",
        "format": request.format,
        "status": "placeholder",
        "message": "Story generation requires Tricia API access"
    }

@app.post("/api/voice/process")
async def process_voice(request: VoiceProcessingRequest):
    """
    Placeholder for voice processing
    Handles senior-optimized voice interactions
    """
    return {
        "transcription": "Voice processing placeholder",
        "session_id": request.session_id,
        "status": "placeholder"
    }

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "FastReel Backend (Placeholder)"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    ) 