import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from './lib/auth/config';

const intlMiddleware = createMiddleware(routing);

const LOGIN_PAGE = '/keystatic-login';

async function checkAuth(request: NextRequest): Promise<boolean> {
  try {
    const response = NextResponse.next();
    const session = await getIronSession<SessionData>(
      request,
      response,
      sessionOptions
    );
    return session.isAuthenticated === true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is a Keystatic route (UI or API)
  const isKeystaticRoute =
    pathname.startsWith('/keystatic') ||
    pathname.startsWith('/api/keystatic');

  // Check if this is an auth API route
  const isAuthApiRoute = pathname.startsWith('/api/auth');

  // Don't protect the login page itself
  const isLoginPage = pathname === LOGIN_PAGE;

  // Skip i18n middleware for login page and auth API routes - just allow them through
  if (isLoginPage || isAuthApiRoute) {
    return NextResponse.next();
  }

  // If it's a Keystatic route (and not the login page), check authentication
  if (isKeystaticRoute) {
    const isAuthenticated = await checkAuth(request);

    if (!isAuthenticated) {
      // Not authenticated - redirect to login
      const loginUrl = new URL(LOGIN_PAGE, request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Authenticated - allow access
    return NextResponse.next();
  }

  // For all other routes, run i18n middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/",
    "/(en|fr)/:path*",
    "/keystatic/:path*",
    "/api/keystatic/:path*",
    "/keystatic-login",
    "/api/auth/:path*",
  ],
}
