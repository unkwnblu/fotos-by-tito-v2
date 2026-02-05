import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // Define allowed domains (localhost and production)
  // You might need to adjust this based on your specific deployment URL
  const allowedDomains = ["fotosbytito.nl", "localhost:3000"];

  // Check if we are on a subdomain
  // This logic assumes a standard format like sub.domain.com or sub.localhost:3000
  const isSubdomain = !allowedDomains.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
  );

  // Extract subdomain
  let subdomain = "";
  if (hostname.includes(".")) {
    const parts = hostname.split(".");
    // Handle localhost case (e.g. dashboard.localhost:3000)
    if (
      parts.length > 0 &&
      (hostname.includes("localhost") ? parts.length > 1 : parts.length > 2)
    ) {
      subdomain = parts[0];
    }
  }

  // Handle admin subdomain (dashboard)
  if (subdomain === "dashboard") {
    // Allow access to login page without rewriting to /admin/login
    // This allows the auth page (at root level) to be served on the subdomain used for auth cookies
    if (url.pathname === "/login") {
      return await updateSession(request, true);
    }

    // Rewrite logic: internal path becomes /admin + path
    // e.g. dashboard.domain.com/foo -> /admin/foo
    // Prevent double prefixing if path already starts with /admin
    if (!url.pathname.startsWith("/admin")) {
      url.pathname = `/admin${url.pathname}`;
    }
    return await updateSession(request, true); // Pass flag that we are on admin subdomain
  }

  // If user tries to access /admin path on main domain, redirect to dashboard subdomain
  if (url.pathname.startsWith("/admin")) {
    // Construct dashboard subdomain URL
    const host = request.headers.get("host");
    // This simple replacement might need detailed testing for localhost vs prod
    const newHost = `dashboard.${host?.replace("www.", "")}`;
    const newUrl = new URL(
      url.pathname.replace("/admin", "") || "/",
      `http://${newHost}`,
    );
    return NextResponse.redirect(newUrl);
  }

  return await updateSession(request, false);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
