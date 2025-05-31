import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { createFirebaseUser } from "@/lib/firebase-admin"
import { ensureUserExists } from "@/lib/tricia-backend"

// 擴展 Session 型別
declare module "next-auth" {
  interface Session {
    user: {
      id?: string
      name?: string | null
      first_name?: string | null
      last_name?: string | null
      email?: string | null
      image?: string | null
      locale?: string
    }
  }
}

// 擴展 JWT 型別
declare module "next-auth/jwt" {
  interface JWT {
    locale?: string
  }
}

// 擴展 Profile 型別
interface GoogleProfile {
  sub: string
  name: string
  email: string
  picture: string
  locale?: string
  given_name?: string
  family_name?: string
}

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
      },
      profile(profile) {
        const googleProfile = profile as GoogleProfile;
        console.log('[NextAuth] Google profile:', {
          sub: googleProfile.sub,
          name: googleProfile.name,
          email: googleProfile.email,
          picture: googleProfile.picture,
          given_name: googleProfile.given_name,
          family_name: googleProfile.family_name,
          locale: googleProfile.locale
        });
        
        return {
          id: googleProfile.sub,
          name: googleProfile.name,
          email: googleProfile.email,
          image: googleProfile.picture,
          first_name: googleProfile.given_name,
          last_name: googleProfile.family_name,
          locale: googleProfile.locale
        }
      },
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
            image: user.image
          });
          
          // Only create Tricia backend user for NEW users (first-time sign-in)
          if (firebaseUser && isNewUser) {
            console.log('[NextAuth] First-time user detected, creating in Tricia backend:', user.email);
            
            // 從 profile 中取得 Google 提供的資訊
            const googleProfile = profile as GoogleProfile;
            
            // 使用預設語系，因為在 signIn 階段無法取得 accept-language
            const locale = 'en-US';
            
            console.log('[NextAuth] Creating user with profile data:', {
              id: user.id,
              email: user.email,
              first_name: googleProfile.given_name,
              last_name: googleProfile.family_name,
              locale: locale
            });
            
            const userCreated = await ensureUserExists({
              id: user.id,
              email: user.email,
              first_name: googleProfile.given_name,
              last_name: googleProfile.family_name,
              image: user.image,
              locale: locale
            });
            
            if (!userCreated) {
              console.error('[NextAuth] Failed to create new user in backend');
              // Optionally block sign-in if backend user creation fails
              // return false;
            } else {
              console.log('[NextAuth] New user created successfully in backend');
            }
          } else if (firebaseUser && !isNewUser) {
            console.log('[NextAuth] Existing user signed in:', user.email);
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
    async session({ session, token, user }) {
      console.log('[NextAuth] Session callback:', { 
        userEmail: session.user?.email,
        hasToken: !!token 
      })
      
      // Pass user ID to the session for client-side use
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      
      // 從 token 中取得 Google 提供的資訊
      if (token.given_name) {
        (session.user as any).first_name = token.given_name
      }
      if (token.family_name) {
        (session.user as any).last_name = token.family_name
      }
      if (token.locale) {
        session.user.locale = token.locale
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
    async jwt({ token, user, account, profile }) {
      if (account && user) {
        console.log('[NextAuth] JWT token created for:', user.email)
      }
      
      // 加入 Google 提供的資訊到 token
      const googleProfile = profile as GoogleProfile;
      if (googleProfile?.given_name) {
        token.given_name = googleProfile.given_name
      }
      if (googleProfile?.family_name) {
        token.family_name = googleProfile.family_name
      }
      if (googleProfile?.locale) {
        token.locale = googleProfile.locale
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