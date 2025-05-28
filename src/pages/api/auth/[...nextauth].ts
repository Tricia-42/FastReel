import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
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
  }
}

export default NextAuth(authOptions) 