import { CookieOptions } from "@supabase/ssr";

export function getCookieOptions(): CookieOptions {
  // In production, we want to share cookies with subdomains (e.g. .fotosbytito.nl)
  // In development, we want to share with localhost subdomains
  const isProd = process.env.NODE_ENV === "production";

  return {
    domain: isProd ? ".fotosbytito.nl" : "localhost",
    path: "/",
    sameSite: "lax",
    secure: isProd,
  };
}
