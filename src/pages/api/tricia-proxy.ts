import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the session to check if user is authenticated
    const session = await getServerSession(req, res, authOptions);
    
    console.log('=== Tricia Proxy Request ===');
    console.log('Proxy request to Tricia API');
    console.log('Authenticated user:', session?.user?.email || 'none');
    
    // Modify the request body to use authenticated user ID if available
    let requestBody = { ...req.body };
    
    if (session?.user?.id) {
      // Override the user_id with the authenticated user's ID
      // This ID is the same as the Firebase UID
      requestBody.user_id = session.user.id;
      console.log('Using authenticated user ID (Firebase UID):', session.user.id);
      
      // Also enhance metadata with user info
      requestBody.metadata = {
        ...requestBody.metadata,
        auth_user_id: session.user.id,
        auth_user_email: session.user.email,
        auth_user_name: session.user.name,
        auth_provider: 'google',
        firebase_uid: session.user.id // Explicitly note this is Firebase UID
      };
    } else {
      console.log('No authenticated session, using provided user_id');
    }
    
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const apiUrl = process.env.NEXT_PUBLIC_TRICIA_BASE_URL || 'https://api.heytricia.ai/api/v1';
    const bearerToken = process.env.TRICIA_API_BEARER_TOKEN || 'admin';
    
    console.log('API URL:', `${apiUrl}/chats`);
    console.log('Bearer Token:', bearerToken ? `${bearerToken.substring(0, 10)}...` : 'not set');

    const response = await fetch(`${apiUrl}/chats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const responseText = await response.text();
    console.log('=== Tricia API Response ===');
    console.log('Tricia API response status:', response.status);
    console.log('Tricia API response headers:', response.headers);
    console.log('Tricia API response:', responseText);

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (!response.ok) {
      console.error('Tricia API returned error status:', response.status);
      return res.status(response.status).json({
        error: 'Tricia API error',
        status: response.status,
        message: responseText
      });
    }

    try {
      const data = JSON.parse(responseText);
      console.log('=== Parsed Response Data ===');
      console.log('Response structure:', Object.keys(data));
      if (data.participant_token) {
        console.log('Token received, length:', data.participant_token.length);
        console.log('Room name:', data.room_name);
        console.log('Server URL:', data.server_url);
        console.log('Participant name:', data.participant_name);
        
        // Try to decode the token to check agent config
        try {
          const tokenParts = data.participant_token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
            console.log('=== JWT Token Analysis ===');
            console.log('Token payload full:', JSON.stringify(payload, null, 2));
            console.log('Token - identity (sub):', payload.sub);
            console.log('Token - issuer (iss):', payload.iss);
            
            // Safely handle timestamps
            try {
              if (payload.iat) {
                const iatDate = new Date(payload.iat * 1000);
                if (!isNaN(iatDate.getTime())) {
                  console.log('Token - issued at:', iatDate.toISOString());
                } else {
                  console.log('Token - issued at (raw):', payload.iat);
                }
              }
              if (payload.exp) {
                const expDate = new Date(payload.exp * 1000);
                if (!isNaN(expDate.getTime())) {
                  console.log('Token - expires at:', expDate.toISOString());
                } else {
                  console.log('Token - expires at (raw):', payload.exp);
                }
              }
            } catch (e) {
              console.log('Error parsing timestamps:', e);
            }
            
            // Check video grant
            if (payload.video) {
              console.log('Video grant:', JSON.stringify(payload.video, null, 2));
              console.log('Video grant - room:', payload.video.room);
              console.log('Video grant - roomJoin:', payload.video.roomJoin);
            }
            
            // Check room config for agent dispatch
            if (payload.roomConfig) {
              console.log('Room config:', JSON.stringify(payload.roomConfig, null, 2));
              if (payload.roomConfig.agents) {
                console.log('!!! AGENTS CONFIGURED IN TOKEN !!!');
                console.log('Agents config:', JSON.stringify(payload.roomConfig.agents, null, 2));
              } else {
                console.log('!!! NO AGENTS IN ROOM CONFIG !!!');
                console.log('This might be why agent is not dispatching');
              }
            } else {
              console.log('!!! NO ROOM CONFIG IN TOKEN !!!');
              console.log('Agent dispatch requires roomConfig.agents in JWT');
            }
          }
        } catch (e) {
          console.log('Could not decode token payload:', e);
        }
      }
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({
        error: 'Invalid JSON response from Tricia API',
        rawResponse: responseText
      });
    }
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({
      error: 'Proxy server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 