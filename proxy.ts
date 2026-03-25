import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PREVIEW_COOKIE = "forhemit_preview";
const PREVIEW_COOKIE_VALUE = "granted";

function isGateDisabled(): boolean {
  return process.env.PREVIEW_GATE_DISABLED === "true";
}

function isPublicPath(pathname: string): boolean {
  if (pathname.startsWith("/_next/")) return true;
  if (pathname === "/favicon.ico") return true;
  if (pathname === "/robots.txt" || pathname === "/sitemap.xml") return true;
  if (pathname === "/manifest.webmanifest") return true;
  if (pathname.startsWith("/icon")) return true;
  if (pathname.startsWith("/api/")) return true;
  if (pathname === "/coming-soon") return true;
  if (/\.(ico|png|jpg|jpeg|svg|gif|webp|txt|xml|webmanifest|woff2?)$/i.test(pathname)) {
    return true;
  }
  return false;
}

function hasPreviewAccess(request: NextRequest): boolean {
  return request.cookies.get(PREVIEW_COOKIE)?.value === PREVIEW_COOKIE_VALUE;
}

/** Dev / Playwright: allow `?preview=true` without a cookie (ignored in production). */
function hasDevPreviewBypass(request: NextRequest): boolean {
  if (process.env.NODE_ENV !== "development") return false;
  return request.nextUrl.searchParams.get("preview") === "true";
}

export function proxy(request: NextRequest) {
  if (isGateDisabled()) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (hasPreviewAccess(request) || hasDevPreviewBypass(request)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/coming-soon";
  const search = request.nextUrl.search;
  if (pathname !== "/" || search) {
    const nextPath = `${pathname}${search}`;
    url.searchParams.set("next", nextPath);
  } else {
    url.search = "";
  }
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
