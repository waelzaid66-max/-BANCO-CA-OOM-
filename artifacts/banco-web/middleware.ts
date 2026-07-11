import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/workspace(.*)",
  "/saved(.*)",
  "/en/workspace(.*)",
  "/en/saved(.*)",
]);

const clerkGuard = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

// Clerk's publishable key is inlined at build time. When it is absent — the CI
// SEO/Lighthouse smoke, static previews, keyless local runs — clerkMiddleware
// throws on every request, so no page (not even the public home) can render.
// Fall back to a pass-through in that case so public pages stay servable;
// protected routes are still gated on every build that ships a key (all real
// production builds), so production behaviour is unchanged.
export default function middleware(req: NextRequest, event: NextFetchEvent) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return NextResponse.next();
  }
  return clerkGuard(req, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
