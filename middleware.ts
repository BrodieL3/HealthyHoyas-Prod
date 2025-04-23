import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes
     * - auth routes and login pages
     * - public assets
     */
    "/((?!_next/static|_next/image|_next/webpack|favicon.ico|api|login|auth|sign-up|forgot-password|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export default async function middleware(request: NextRequest) {
  // Always refresh the auth session
  const response = await updateSession(request);
  return response;
}
