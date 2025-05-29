import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { createFirebaseUser } from "@/lib/firebase-admin"

export const authOptions: NextAuthOptions = {
  providers: [
    // Google provider for production
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!.trim(),
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!.trim(),
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    // Test mode provider for local development
    ...(process.env.NEXT_PUBLIC_TEST_MODE === 'true' ? [
      CredentialsProvider({
        name: "Test Mode",
        credentials: {},
        async authorize() {
          // In test mode, automatically sign in as test user
          return {
            id: "test-user-id",
            name: "Test User",
            email: "test@example.com",
          }
        }
      })
    ] : [])
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('[NextAuth] Sign in attempt:', {
        user: user?.email,
        provider: account?.provider,
        timestamp: new Date().toISOString()
      })
      
      // Only process Google sign-ins for Firebase
      if (account?.provider === "google" && user) {
        try {
          // Create or get Firebase user
          const { firebaseUser, isNewUser } = await createFirebaseUser({
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          });
          
          // If this is a new user AND Firebase is available, create them in your backend
          if (isNewUser && firebaseUser) {
            console.log('[NextAuth] Creating new user in backend for:', user.email);
            
            // Small delay to ensure Firebase user is fully created
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Parse name into first and last
            const nameParts = (user.name || '').split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            
            // Call your backend API to create user
            const apiUrl = process.env.NEXT_PUBLIC_TRICIA_BASE_URL || 'https://api.heytricia.ai/api/v1';
            const bearerToken = process.env.TRICIA_API_BEARER_TOKEN || 'admin';
            
            const response = await fetch(`${apiUrl}/users`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${bearerToken}`,
              },
              body: JSON.stringify({
                id: user.id, // Firebase UID
                first_name: firstName,
                last_name: lastName,
                email: user.email,
                avatar_url: user.image,
                notification_enabled: true,
                account_type: 'personal',
              }),
            });
            
            if (!response.ok) {
              const errorText = await response.text();
              console.error('[NextAuth] Failed to create user in backend:', response.status, errorText);
              // Note: We don't throw here to allow sign-in to continue
              // The user exists in Firebase but not in your backend
            } else {
              console.log('[NextAuth] User created successfully in backend');
            }
          }
        } catch (error) {
          console.error('[NextAuth] Error in sign-in process:', error);
          // Decide if you want to block sign-in on Firebase/backend errors
          // return false; // Uncomment to block sign-in on errors
        }
      }
      
      return true
    },
    async redirect({ url, baseUrl }) {
      console.log('[NextAuth] Redirect:', { url, baseUrl })
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    async session({ session, token }) {
      console.log('[NextAuth] Session callback:', { 
        userEmail: session.user?.email,
        hasToken: !!token 
      })
      
      // Pass user ID to the session for client-side use
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      
      // Add Firebase custom token to session
      if (token.sub) {
        try {
          const { customToken } = await createFirebaseUser({
            id: token.sub,
            email: session.user?.email,
            name: session.user?.name,
            image: session.user?.image,
          });
          
          // Add custom token to session
          (session as any).firebaseToken = customToken;
        } catch (error) {
          console.error('[NextAuth] Error creating Firebase custom token:', error);
        }
      }
      
      return session
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        console.log('[NextAuth] JWT token created for:', user.email)
      }
      return token
    }
  },
  events: {
    async signIn(message) {
      console.log('[NextAuth] User signed in:', message.user.email)
    },
    async signOut(message) {
      console.log('[NextAuth] User signed out')
    },
    async createUser(message) {
      console.log('[NextAuth] User created:', message.user.email)
    },
    async linkAccount(message) {
      console.log('[NextAuth] Account linked:', message.profile)
    },
    async session(message) {
      // This can be verbose, only log in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[NextAuth] Session accessed')
      }
    }
  },
  debug: true, // Enable debug messages in production temporarily
  logger: {
    error(code, metadata) {
      console.error('[NextAuth] Error:', code, metadata)
    },
    warn(code) {
      console.warn('[NextAuth] Warning:', code)
    },
    debug(code, metadata) {
      console.log('[NextAuth] Debug:', code, metadata)
    }
  },
  // Add session configuration
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // Add JWT configuration
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  }
}

export default NextAuth(authOptions) 