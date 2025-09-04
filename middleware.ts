import { NextResponse } from 'next/server'

// Routes that don't require authentication
const publicRoutes = [
  '/',
  '/chat/sign-in',
  '/chat/sign-up', 
  '/chat/callback',  // Add callback route for OAuth
  '/api/contact',
  '/api/debug',
]

function isPublicPath(pathname: string) {
  return publicRoutes.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

export default async function middleware(req: Request) {
  const url = new URL(req.url)
  const pathname = url.pathname

  // Allow public routes
  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  // Check Authorization header for a Bearer token (for API calls)
  const authHeader = req.headers.get('authorization') || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  // If this is an API call without a token, block it
  if (pathname.startsWith('/api/') && !token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // For /chat route, allow it through - authentication is handled client-side by Amplify
  // The client-side code will redirect to sign-in if needed
  if (pathname.startsWith('/chat')) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
}
