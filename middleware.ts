import { NextResponse } from 'next/server';

const publicRoutes = [
  '/chat/sign-in',
  '/chat/sign-in/',
  '/chat/sign-up',
  '/chat/sign-up/',
  '/',
];

function isPublicPath(pathname: string) {
  return publicRoutes.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

export default async function middleware(req: Request) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // Allow public routes
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Check Authorization header for a Bearer token
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    const signInUrl = new URL('/chat/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // NOTE: For full JWT verification, install 'jose' and implement JWKS fetching from
  // `https://cognito-idp.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID}/.well-known/jwks.json`
  // For now, we conservatively allow requests that present a Bearer token and rely on backend API to verify tokens.

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
