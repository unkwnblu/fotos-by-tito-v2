import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(
  request: NextRequest,
  isAdminSubdomain: boolean = false,
) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // If we are rewriting, we need to pass the rewrite in the response
  if (isAdminSubdomain) {
    const url = request.nextUrl.clone();
    // Rewrite is already done in main middleware, but safer to enforce it here too
    // in case request.nextUrl mutation didn't persist as expected
    if (url.pathname !== "/login" && !url.pathname.startsWith("/admin")) {
      url.pathname = `/admin${url.pathname}`;
    }
    supabaseResponse = NextResponse.rewrite(url);
  }

  // Add headers to stop caching (preserving existing middleware logic)
  supabaseResponse.headers.set(
    "Cache-Control",
    "no-store, max-age=0, must-revalidate",
  );

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );

          // If rewriting, we need to maintain the rewrite
          if (isAdminSubdomain) {
            const url = request.nextUrl.clone();
            // Ensure we rewrite to /admin/... (unless it's login)
            if (
              url.pathname !== "/login" &&
              !url.pathname.startsWith("/admin")
            ) {
              url.pathname = `/admin${url.pathname}`;
            }
            supabaseResponse = NextResponse.rewrite(url);
          } else {
            supabaseResponse = NextResponse.next({
              request,
            });
          }

          // Re-apply cache headers to the new response
          supabaseResponse.headers.set(
            "Cache-Control",
            "no-store, max-age=0, must-revalidate",
          );

          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Note: For localhost, cookies might not share correctly across subdomains depending on the browser.
  // Ideally, you'd use a custom domain like lvh.me or set domain to "localhost" (though inconsistent support).

  // Actually, createServerClient doesn't take specific cookieOptions in the 3rd arg like createBrowserClient?
  // Checking docs: createServerClient(url, key, options) where options has `cookies` methods AND `cookieOptions`.
  // Wait, no. options is { cookies: { get, set, remove } }.
  // The cookie attributes (domain, path, etc) are passed in the `set` method calls in `options` for set/remove?
  // OR we can pass `cookieOptions` alongside `cookies`?
  // Supabase SSR docs say: global cookie options can be passed.

  // Let's refactor to ensure we pass the domain when setting cookies.

  // Wait, I can't just modify the 3rd arg structure blindly if I don't know the types.
  // Standard pattern:
  /*
    {
      cookies: { ... },
      cookieOptions: {
         domain: process.env.NODE_ENV === 'production' ? '.fotosbytito.nl' : undefined,
      }
    }
  */

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAdminSubdomain) {
    if (!user) {
      // If we are already on the login page (on any subdomain), don't redirect again
      if (request.nextUrl.pathname === "/login") {
        return supabaseResponse;
      }

      const url = request.nextUrl.clone();
      // On admin subdomain (dashboard), redirect to specific login page (or main login served on subdomain)
      // We will serve the main login page on the subdomain by NOT rewriting /login in main middleware
      // So we just redirect to /login relative to current host

      const newUrl = new URL("/login", request.url);
      return NextResponse.redirect(newUrl);
    }

    // Ensure that if we are on dashboard subdomain, we are rewriting to /admin internally
    // This is a safety check in case the mutation in main middleware didn't persist to the cloned url here
    const url = request.nextUrl.clone();
    if (url.pathname !== "/login" && !url.pathname.startsWith("/admin")) {
      url.pathname = `/admin${url.pathname}`;
      // Update the response with the new rewrite
      supabaseResponse = NextResponse.rewrite(url);
    }

    // Check user role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/access-denied";

      // Allow access denied on subdomain? Or redirect to main?
      // Redirect to main site for non-admins
      const host = request.headers.get("host");
      const mainHost = host?.replace("dashboard.", "");
      const newUrl = new URL("/", `http://${mainHost}`);
      return NextResponse.redirect(newUrl);
    }
  }

  // Also protect Verify page from being accessed if not coming from flow?
  // Actually, usually verify is public to handle the token.
  // But we might want to prevent logged in users from seeing login page?
  if (user && request.nextUrl.pathname.startsWith("/login")) {
    // Check user role to decide redirect
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const url = request.nextUrl.clone();
    if (profile?.role === "admin") {
      // Redirect to admin subdomain
      const host = request.headers.get("host");
      // If we are already on admin subdomain (unlikely here if logic holds), just go root
      if (isAdminSubdomain) {
        url.pathname = "/";
      } else {
        // Redirect to admin subdomain
        const adminHost = `dashboard.${host}`; // simplified
        const newUrl = new URL("/", `http://${adminHost}`);
        return NextResponse.redirect(newUrl);
      }
    } else {
      url.pathname = "/";
    }
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
