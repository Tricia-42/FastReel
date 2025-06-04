/**
 * Tricia API client library
 * Business logic for interacting with Tricia's backend services
 */

interface TriciaCreateChatPayload {
  user_id: string;
  metadata?: {
    title?: string;
    user_email?: string | null;
    user_name?: string | null;
    auth_provider?: string;
  };
}

interface TriciaCreateChatResponse {
  id: string;
  participant_name: string;
  participant_token: string;
  room_name: string;
  server_url: string;
}

export class TriciaAPIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: any
  ) {
    super(message);
    this.name = 'TriciaAPIError';
  }
}

/**
 * Create a new chat session with Tricia
 */
export async function createTriciaChat(payload: TriciaCreateChatPayload): Promise<TriciaCreateChatResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_TRICIA_API_URL || 'https://api.heytricia.ai'}/api/v1/chats`;
  const authToken = process.env.TRICIA_AUTH_TOKEN || 'admin';

  console.log('[Tricia API] Creating chat for user:', payload.user_id);
  console.log('[Tricia API] Using URL:', apiUrl);

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const responseText = await response.text();

  if (!response.ok) {
    console.error('[Tricia API] Error - Status:', response.status);
    console.error('[Tricia API] Error - Response:', responseText);
    
    let errorMessage = `Failed to create chat: ${response.status} ${response.statusText}`;
    let errorDetails = {};
    
    try {
      const errorData = JSON.parse(responseText);
      errorDetails = errorData;
      
      if (errorData.detail) {
        errorMessage = errorData.detail;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch (e) {
      errorDetails = { rawError: responseText };
    }
    
    throw new TriciaAPIError(errorMessage, response.status, errorDetails);
  }

  let data;
  try {
    data = JSON.parse(responseText);
  } catch (e) {
    console.error('[Tricia API] Failed to parse response as JSON:', e);
    throw new TriciaAPIError('Invalid JSON response from Tricia API', 500, { rawResponse: responseText });
  }

  console.log('[Tricia API] Chat created successfully:', data.id);
  
  // Validate response structure
  const chatData = data.data || data;
  
  if (!chatData.participant_token || !chatData.server_url) {
    throw new TriciaAPIError(
      'Invalid response structure from Tricia API',
      500,
      { receivedData: chatData }
    );
  }

  return {
    id: chatData.id,
    participant_name: chatData.participant_name,
    participant_token: chatData.participant_token,
    room_name: chatData.room_name,
    server_url: chatData.server_url
  };
}

/**
 * Get default user ID for unauthenticated users
 */
export function getDefaultUserId(): string {
  return process.env.NEXT_PUBLIC_TRICIA_USER_ID || 'Xe9nkrHVetU1lHiK8wt7Ujf6SrH3';
} 