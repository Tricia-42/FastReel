import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Proxy request to Tricia API');
    console.log('Request body:', req.body);

    const apiUrl = process.env.NEXT_PUBLIC_TRICIA_BASE_URL || 'https://api.heytricia.ai/api/v1';
    const bearerToken = process.env.TRICIA_API_BEARER_TOKEN || 'admin';

    const response = await fetch(`${apiUrl}/chats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const responseText = await response.text();
    console.log('Tricia API response status:', response.status);
    console.log('Tricia API response:', responseText);

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'Tricia API error',
        status: response.status,
        message: responseText
      });
    }

    try {
      const data = JSON.parse(responseText);
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