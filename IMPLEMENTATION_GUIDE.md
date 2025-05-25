# Tricia Pilot App - Implementation Guide

This guide provides step-by-step instructions for transforming the LiveKit Agents Playground into the Tricia Pilot App.

## Step 1: Install Dependencies

First, install the Firebase SDK:

```bash
npm install firebase
```

## Step 2: Create Firebase Configuration

Create `src/lib/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};
```

## Step 3: Create Supabase Configuration

Create `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Optional: Create a service role client for server-side operations
export const getServiceSupabase = () => {
  if (typeof window !== 'undefined') {
    throw new Error('Service role client should only be used server-side');
  }
  
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
};

// Helper function to store chat sessions
export async function storeChatSession(
  userId: string,
  chatId: string,
  agentId: string,
  metadata?: any
) {
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({
      id: chatId,
      user_id: userId,
      agent_id: agentId,
      metadata: metadata || {},
      created_at: new Date().toISOString(),
    });
    
  if (error) {
    console.error('Error storing chat session:', error);
    throw error;
  }
  
  return data;
}

// Helper function to get user's chat history
export async function getUserChatHistory(userId: string) {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
  
  return data;
}
```

### Supabase Database Schema

Create these tables in your Supabase project:

```sql
-- Chat sessions table
CREATE TABLE chat_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own chat sessions
CREATE POLICY "Users can view own chat sessions" ON chat_sessions
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own chat sessions
CREATE POLICY "Users can insert own chat sessions" ON chat_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Optional: Chat messages table for storing conversation history
CREATE TABLE chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_session_id TEXT REFERENCES chat_sessions(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for messages
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view messages from their chat sessions
CREATE POLICY "Users can view own messages" ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = chat_messages.chat_session_id 
      AND chat_sessions.user_id = auth.uid()
    )
  );
```

## Step 4: Create Tricia API Client

Create `src/lib/tricia-api.ts`:

```typescript
const TRICIA_BASE_URL = process.env.NEXT_PUBLIC_TRICIA_BASE_URL || 'https://api.heytricia.ai/api/v1';
const TRICIA_AGENT_ID = process.env.NEXT_PUBLIC_TRICIA_AGENT_ID || 'aa0b0d4e-bc28-4e4e-88c1-40b829b6fb9d';
const TRICIA_BEARER_TOKEN = process.env.TRICIA_API_BEARER_TOKEN || 'admin';

// Fallback user ID for development
const FALLBACK_USER_ID = 'Xe9nkrHVetU1lHiK8wt7Ujf6SrH3';

export interface ChatSession {
  id: string;
  server_url: string;
  room_name: string;
  participant_name: string;
  participant_token: string;
}

export interface TriciaAPIError extends Error {
  status?: number;
  code?: string;
}

class TriciaAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = TRICIA_BASE_URL;
  }

  async createUser(firebaseUserId: string, email: string, displayName: string) {
    const [firstName, ...lastNameParts] = displayName.split(' ');
    const lastName = lastNameParts.join(' ') || undefined;

    const response = await fetch(`${this.baseUrl}/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TRICIA_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: firebaseUserId || FALLBACK_USER_ID,
        first_name: firstName,
        last_name: lastName,
        email: email,
      }),
    });

    if (!response.ok && response.status !== 409) { // 409 means user already exists
      throw new Error('Failed to create user');
    }

    return response.json();
  }

  async createChat(userId: string, agentId: string = TRICIA_AGENT_ID): Promise<ChatSession> {
    const response = await fetch(`${this.baseUrl}/chats`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TRICIA_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId || FALLBACK_USER_ID,
        agent_id: agentId,
        metadata: {
          platform: 'web',
          version: '1.0.0',
          title: 'Tricia Conversation',
        },
      }),
    });

    if (!response.ok) {
      const error: TriciaAPIError = new Error('Failed to create chat session');
      error.status = response.status;
      throw error;
    }

    // The response contains LiveKit connection details
    return response.json();
  }
}

export const triciaAPI = new TriciaAPI();
```

## Step 5: Create Authentication Context

Create `src/contexts/AuthContext.tsx`:

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, signInWithGoogle, logOut } from '@/lib/firebase';
import { triciaAPI } from '@/lib/tricia-api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          // Create or update user in Tricia backend
          await triciaAPI.createUser(
            user.uid,
            user.email || '',
            user.displayName || 'Anonymous User'
          );
        } catch (error) {
          console.error('Failed to sync with Tricia API:', error);
        }
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

## Step 6: Update Connection Hook

Modify `src/hooks/useConnection.tsx`:

```typescript
import { useAuth } from "@/contexts/AuthContext";
import { triciaAPI, ChatSession } from "@/lib/tricia-api";
// ... other imports

export type ConnectionMode = "tricia" | "manual" | "env"; // Updated modes

// In the ConnectionProvider component:
const { user } = useAuth();

const connect = useCallback(
  async (mode: ConnectionMode) => {
    let token = "";
    let url = "";
    
    if (mode === "tricia") {
      // New Tricia connection mode
      if (!user) {
        setToastMessage({
          type: "error",
          message: "Please sign in to connect to Tricia",
        });
        return;
      }
      
      try {
        // Create chat session with Tricia
        const chatSession: ChatSession = await triciaAPI.createChat(user.uid);
        
        url = chatSession.server_url;
        token = chatSession.participant_token;
        
        // Store chat session ID for later use
        sessionStorage.setItem('currentChatId', chatSession.id);
      } catch (error) {
        setToastMessage({
          type: "error",
          message: "Failed to connect to Tricia. Please try again.",
        });
        console.error('Tricia connection error:', error);
        return;
      }
    } else if (mode === "manual") {
      // Keep existing manual mode for development
      token = config.settings.token;
      url = config.settings.ws_url;
    } else if (mode === "env") {
      // Keep existing env mode
      // ... existing env mode code
    }
    
    setConnectionDetails({ wsUrl: url, token, shouldConnect: true, mode });
  },
  [user, config.settings, setToastMessage]
);
```

## Step 7: Create Sign-In Page

Create `src/pages/signin.tsx`:

```typescript
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import Head from 'next/head';

export default function SignIn() {
  const { user, signIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Sign In - Tricia</title>
      </Head>
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome to Tricia
            </h1>
            <p className="text-gray-400">
              Your AI-powered conversational assistant
            </p>
          </div>
          
          <div className="mt-8">
            <button
              onClick={signIn}
              className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
```

## Step 8: Update Main App

Modify `src/pages/_app.tsx` to include AuthProvider:

```typescript
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/contexts/AuthContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
```

## Step 9: Update Home Page

Modify `src/pages/index.tsx`:

```typescript
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
// ... other imports

export function HomeInner() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const { shouldConnect, wsUrl, token, mode, connect, disconnect } = useConnection();
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    // Auto-connect to Tricia when user is authenticated
    if (user && !shouldConnect) {
      connect('tricia');
    }
  }, [user, shouldConnect, connect]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    return null; // Will redirect to sign-in
  }
  
  // ... rest of the component with LiveKitRoom
}
```

## Step 10: Update UI Components

Create a user profile component in the Playground to show the signed-in user and provide sign-out functionality.

## Step 11: Testing

1. Set up your Firebase project with Google authentication enabled
2. Configure all environment variables in `.env.local`
3. Ensure your Tricia backend API is running and accessible
4. Test the sign-in flow
5. Verify automatic connection to LiveKit room
6. Test voice/video communication with Tricia

## Additional Considerations

### Security
- In production, API authentication should be handled server-side
- Implement proper token refresh mechanisms
- Add rate limiting and error handling

### User Experience
- Add loading states during authentication and connection
- Implement error boundaries for graceful error handling
- Add reconnection logic for dropped connections

### Performance
- Implement lazy loading for heavy components
- Cache user data appropriately
- Optimize API calls to reduce latency 