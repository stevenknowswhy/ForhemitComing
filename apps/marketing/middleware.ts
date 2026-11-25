import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME, verifyAdminSession } from "@/lib/admin-session";

const markdownRoutes: Record<string, string> = {
  '/': `# Forhemit

Founder succession through employee ownership, with ESOP structuring and post-close stewardship support.

## Navigation

- [About](/about)
- [Blog](/blog)
- [Contact](/contact)
- [FAQ](/faq)
- [Business Owners](/business-owners)
- [Brokers](/brokers)
- [Lenders](/lenders)
- [Accounting Firms](/accounting-firms)
- [Legal Practices](/legal-practices)
- [Wealth Managers](/wealth-managers)
- [Appraisers](/appraisers)

## Services

Forhemit helps business owners transition their companies to employee ownership through ESOPs (Employee Stock Ownership Plans).

[Learn more](/introduction)
`,
  '/about': `# About Forhemit

Forhemit PBC is a public benefit corporation dedicated to helping founders exit through employee ownership.
`,
  '/faq': `# Frequently Asked Questions

Find answers to common questions about ESOPs and founder succession.
`,
  '/introduction': `# Introduction to ESOPs

Learn how Employee Stock Ownership Plans work and how they can benefit your business.
`,
}

const PREVIEW_COOKIE = "forhemit_preview";
const PREVIEW_COOKIE_VALUE = "granted";

function isGateDisabled(): boolean {
  return true;
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

const ADMIN_LOGIN = "/admin/login";
const ADMIN_LOGOUT = "/admin/logout";

async function adminAuthResponse(
  request: NextRequest
): Promise<NextResponse | null> {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin")) return null;
  if (pathname === ADMIN_LOGIN || pathname.startsWith(`${ADMIN_LOGOUT}`)) {
    return null;
  }

  const secret = process.env.ADMIN_TOKEN;
  if (!secret?.length) return null;

  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  const ok = await verifyAdminSession(cookie, secret);
  if (ok) return null;

  const url = request.nextUrl.clone();
  url.pathname = ADMIN_LOGIN;
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export async function proxy(request: NextRequest) {
  const accept = request.headers.get('accept') || ''
  const { pathname } = request.nextUrl;

  if (accept.includes('text/markdown')) {
    const markdown = markdownRoutes[pathname]
    if (markdown) {
      return new NextResponse(markdown, {
        status: 200,
        headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
      })
    }
    return new NextResponse('Not found', { status: 404 })
  }

  const adminRes = await adminAuthResponse(request);
  if (adminRes) return adminRes;

  if (isGateDisabled()) {
    return NextResponse.next();
  }

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
