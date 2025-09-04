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

  // For protected routes like /chat, redirect to sign-in if no auth header
  // This provides a server-side fallback, but the main auth check happens client-side
  if (pathname.startsWith('/chat') && !token) {
    const signInUrl = new URL('/chat/sign-in', 'https://main.d325l4yh4si1cx.amplifyapp.com')
    // Always use production URL for redirect_url
    const redirectUrl = `https://main.d325l4yh4si1cx.amplifyapp.com${pathname}`
    signInUrl.searchParams.set('redirect_url', redirectUrl)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
}
