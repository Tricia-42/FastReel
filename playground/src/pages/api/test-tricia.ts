import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Log environment variables (without exposing sensitive data)
  const config = {
    hasBaseUrl: !!process.env.TRICIA_BASE_URL,
    baseUrl: process.env.TRICIA_BASE_URL || 'NOT SET',
    hasAuthToken: !!process.env.TRICIA_AUTH_TOKEN,
    defaultUserId: process.env.NEXT_PUBLIC_TRICIA_USER_ID || 'NOT SET',
    testMode: process.env.NEXT_PUBLIC_TEST_MODE === 'true'
  };

  console.log('[Test API] Configuration:', config);

  // Try to make a test request to Tricia API
  if (config.hasBaseUrl && config.hasAuthToken) {
    try {
      const testUrl = `${process.env.TRICIA_BASE_URL}/health`;
      console.log('[Test API] Testing connection to:', testUrl);
      
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.TRICIA_AUTH_TOKEN}`,
          'Accept': 'application/json'
        }
      });

      const responseText = await response.text();
      
      return res.status(200).json({
        config,
        healthCheck: {
          status: response.status,
          statusText: response.statusText,
          response: responseText
        }
      });
    } catch (error) {
      return res.status(200).json({
        config,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return res.status(200).json({ config });
} 