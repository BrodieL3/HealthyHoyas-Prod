import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // Create a response object that we can modify
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: "pkce",
        autoRefreshToken: true,
        detectSessionInUrl: false,
        persistSession: true,
      },
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          // This is used by the server to set cookies in the browser
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name, options) {
          // This is used by the server to remove cookies in the browser
          response.cookies.set({
            name,
            value: "",
            ...options,
            maxAge: 0,
          });
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const { data } = await supabase.auth.getUser();

  if (
    !data.user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/auth") &&
    !request.nextUrl.pathname.startsWith("/sign-up") &&
    !request.nextUrl.pathname.startsWith("/forgot-password")
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/auth/login";
    // Use the response to redirect
    return NextResponse.redirect(redirectUrl);
  }

  // IMPORTANT: DO NOT REMOVE the return statement below
  // It is crucial to return the response object to avoid session issues
  return response;
}
