import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Allow the request to continue
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Check if the user is authenticated
        return !!token
      },
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
)

// Protect all routes except auth, api/auth, and static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth routes)
     * - auth (sign in/out pages)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, favicon.png (favicon files)
     * - apple-touch-icon (iOS icons)
     * - public folder
     * - manifest.json
     */
    "/((?!api/auth|auth|_next/static|_next/image|favicon\\.ico|favicon\\.png|apple-touch-icon.*|public|manifest\\.json).*)",
  ],
} 