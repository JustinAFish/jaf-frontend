// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// const isProtectedRoute = createRouteMatcher(["/chat(.*)"]);

// export default clerkMiddleware(async (auth, req) => {
//   // Add environment variable validation for debugging
//   if (!process.env.CLERK_SECRET_KEY) {
//     console.error('CLERK_SECRET_KEY is not available in middleware');
//     console.error('Available env vars:', Object.keys(process.env).filter(key => key.includes('CLERK')));
//   }

//   if (isProtectedRoute(req)) {
//     await auth.protect();
//   }
// });

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//   ],
// };
