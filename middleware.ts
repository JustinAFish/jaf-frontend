// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Commented out to disable middleware and test if it's causing 500 errors
// const isProtectedRoute = createRouteMatcher(["/chat(.*)"]);

// export default clerkMiddleware(async (auth, req) => {
//   if (isProtectedRoute(req)) await auth.protect();
// });

// Minimal middleware that does nothing - just passes requests through
export default function middleware() {
  // No authentication or protection logic
  return;
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
