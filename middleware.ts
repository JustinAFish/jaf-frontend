import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const publicRoutes = createRouteMatcher([
  '/chat/sign-in(.*)',
  '/chat/sign-up(.*)',
  '/',
]);

export default clerkMiddleware(async (auth, req) => {
  // Debug: confirm the routing decision
  const isPublic = publicRoutes(req);
  console.log('Clerk middleware active, path:', req.url, 'isPublic:', isPublic);

  if (!isPublic) {
    const { userId } = await auth();
    if (!userId) {
      // Local dev: ensure http scheme to avoid HTTPS-origin issues
      const isLocalDev = req.nextUrl.hostname === 'localhost';
      const signInUrl = isLocalDev
        ? new URL('http://localhost:3000/chat/sign-in')
        : new URL('/chat/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }
  }
});

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
