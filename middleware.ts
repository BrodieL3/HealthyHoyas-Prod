// middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse }            from "next/server";
import type { NextRequest }        from "next/server";

// Paths that anyone can visit without signing in
const PUBLIC_ROUTES = [
  "/",
  "/features-page",
  "/how-it-works-page",
  "/about-page",
  "/auth/sign-in",
  "/auth/sign-up",
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (e) {
    // ignore, treat as not signed in
  }

  const { pathname } = req.nextUrl;
  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  if (!isPublic && !user) {
    const signInUrl = new URL("/auth/sign-in", req.url);
    signInUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return res;
}

export const config = {
  matcher: [
    /*
      Run this middleware on *every* path except:
        - Next.js internals
        - static files
        - favicon
    */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
