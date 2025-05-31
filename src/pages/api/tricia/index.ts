/**
 * API Route: /api/tricia
 * Proxy endpoint for Tricia API to avoid CORS issues
 * This is a thin handler that delegates to the business logic in lib/tricia-api
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { createTriciaChat, getDefaultUserId, TriciaAPIError } from '@/lib/tricia-api';
import { ensureUserExists } from '@/lib/tricia-backend';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the authenticated session
    const session = await getServerSession(req, res, authOptions);
    
    // If user is authenticated, ensure they exist in Tricia backend
    if (session?.user) {
      console.log('[API] Authenticated user:', session.user.email);
      
      // Get locale from request headers
      const acceptLanguage = req.headers["accept-language"] || "";
      const locale = acceptLanguage.split(",")[0].trim() || 'en-US';
      
      // Get user names from session
      const first_name = (session.user as any).first_name;
      const last_name = (session.user as any).last_name;
      
      // Ensure user exists in backend
      const userCreated = await ensureUserExists({
        id: session.user.id!,
        email: session.user.email,
        first_name: first_name,
        last_name: last_name,
        image: session.user.image,
        locale: locale
      });
      
      if (!userCreated) {
        console.error('[API] Failed to ensure user exists in Tricia backend');
        return res.status(500).json({ 
          error: 'Failed to create or verify user in backend',
          message: 'User setup failed. Please try again.'
        });
      }
    }
    
    // Get user ID from request or session
    const userId = req.body.user_id || session?.user?.id || getDefaultUserId();
    
    // Prepare metadata
    const metadata = {
      ...req.body.metadata,
      // Add session info if available
      ...(session && {
        user_email: session.user?.email,
        user_name: session.user?.name,
        auth_provider: 'google',
        locale: req.headers["accept-language"]?.split(",")[0].trim() || 'en-US'
      })
    };

    // Call Tricia API
    const chatData = await createTriciaChat({
      user_id: userId,
      metadata
    });

    // Return successful response
    return res.status(200).json(chatData);
    
  } catch (error) {
    console.error('[API] Error in /api/tricia:', error);
    
    // Handle TriciaAPIError specifically
    if (error instanceof TriciaAPIError) {
      return res.status(error.statusCode).json({
        error: error.message,
        details: error.details
      });
    }
    
    // Handle other errors
    if (error instanceof Error) {
      return res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
    
    // Unknown error
    return res.status(500).json({
      error: 'An unexpected error occurred'
    });
  }
} 