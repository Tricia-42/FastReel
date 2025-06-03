/**
 * Utility functions for Tricia backend user management
 */

const API_URL = process.env.NEXT_PUBLIC_TRICIA_BASE_URL || 'https://api.heytricia.ai/api/v1';
const BEARER_TOKEN = process.env.TRICIA_API_BEARER_TOKEN || 'admin';

export interface TriciaUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url?: string;
  notification_enabled?: boolean;
  account_type?: string;
  locale?: string;
}

/**
 * Check if a user exists in the Tricia backend
 */
export async function checkUserExists(userId: string): Promise<boolean> {
  try {
    console.log('[Tricia Backend] Checking if user exists:', userId);
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
      },
    });
    
    if (response.ok) {
      console.log('[Tricia Backend] User exists:', userId);
      return true;
    } else if (response.status === 404) {
      console.log('[Tricia Backend] User does not exist:', userId);
      return false;
    } else {
      console.error('[Tricia Backend] Unexpected response:', response.status);
      return false;
    }
  } catch (error) {
    console.error('[Tricia Backend] Error checking user existence:', error);
    return false;
  }
}

/**
 * Create a user in the Tricia backend
 */
export async function createUser(user: TriciaUser): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BEARER_TOKEN}`,
      },
      body: JSON.stringify(user),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Tricia Backend] Failed to create user:', response.status, errorText);
      return false;
    }
    
    console.log('[Tricia Backend] User created successfully:', user.id);
    return true;
  } catch (error) {
    console.error('[Tricia Backend] Error creating user:', error);
    return false;
  }
}

/**
 * Ensure a user exists in the Tricia backend, creating them if necessary
 */
export async function ensureUserExists(user: {
  id: string;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  image?: string | null;
  locale?: string | null;
}): Promise<boolean> {
  // First check if user exists
  const exists = await checkUserExists(user.id);
  
  if (exists) {
    console.log('[Tricia Backend] User already exists:', user.id);
    return true;
  }
  
  console.log('[Tricia Backend] User not found, creating:', user.id);
  
  console.log('[Tricia Backend] User first_name:', user.first_name);
  console.log('[Tricia Backend] User last_name:', user.last_name);
  // Parse name into first and last
  const firstName = user.first_name || '';
  const lastName = user.last_name || '';
  
  // Create the user
  return await createUser({
    id: user.id,
    first_name: firstName,
    last_name: lastName,
    email: user.email || '',
    avatar_url: user.image || undefined,
    notification_enabled: true,
    account_type: 'personal',
    locale: user.locale || 'en-US',
  });
} 