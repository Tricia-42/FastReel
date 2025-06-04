import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the authenticated session
    const session = await getServerSession(req, res, authOptions);
    
    if (!session?.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { chatId, style = 'tiktok', duration = 60 } = req.body;

    if (!chatId) {
      return res.status(400).json({ error: 'Chat ID is required' });
    }

    // Call Tricia API to generate reel
    const apiUrl = `${process.env.TRICIA_BASE_URL || 'https://api.heytricia.ai/api/v1'}/reels/generate`;
    const authToken = process.env.TRICIA_AUTH_TOKEN || 'admin';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        chat_id: chatId,
        style,
        duration,
        user_id: session.user.id,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[Reel Generation] Error:', error);
      return res.status(response.status).json({ 
        error: 'Failed to generate reel',
        details: error 
      });
    }

    const reelData = await response.json();

    // Return the generated reel data
    return res.status(200).json({
      success: true,
      reel: {
        id: reelData.id,
        videoUrl: reelData.video_url,
        thumbnailUrl: reelData.thumbnail_url,
        caption: reelData.caption,
        duration: reelData.duration,
        chatId: chatId,
        createdAt: reelData.created_at,
      }
    });

  } catch (error) {
    console.error('[API] Error generating reel:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 