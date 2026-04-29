import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public routes that don't need auth checking
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') // Static files
  ) {
    return NextResponse.next();
  }

  // 1. Run next-intl middleware to handle locale routing
  const response = intlMiddleware(request);

  // 2. Auth & Role gating logic
  const token = request.cookies.get('access_token')?.value;
  const role = request.cookies.get('user_role')?.value;
  
  // Get current locale from URL or fallback
  const [, locale] = pathname.split('/');
  const validLocale = routing.locales.includes(locale as "vi" | "en") ? locale : routing.defaultLocale;
  
  // Normalize pathname to exclude locale prefix for easier matching
  const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
  
  const isAuthRoute = pathWithoutLocale.startsWith('/login') || pathWithoutLocale.startsWith('/register');
  const isEmployerRoute = pathWithoutLocale.startsWith('/employer');
  const isAdminRoute = pathWithoutLocale.startsWith('/admin');
  
  if (token) {
    // If logged in and trying to access login/register -> redirect to appropriate home
    if (isAuthRoute) {
      if (role === 'EMPLOYER') return NextResponse.redirect(new URL(`/${validLocale}/employer/dashboard`, request.url));
      if (role === 'ADMIN') return NextResponse.redirect(new URL(`/${validLocale}/admin`, request.url));
      return NextResponse.redirect(new URL(`/${validLocale}/`, request.url));
    }

    // Role-based protection
    if (isEmployerRoute && role !== 'EMPLOYER' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL(`/${validLocale}/`, request.url));
    }
    
    if (isAdminRoute && role !== 'ADMIN') {
      return NextResponse.redirect(new URL(`/${validLocale}/`, request.url));
    }
  } else {
    // If not logged in and trying to access protected routes
    if (isEmployerRoute || isAdminRoute) {
      return NextResponse.redirect(new URL(`/${validLocale}/login`, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Match all pathnames except:
    // - /api, /_next, /_vercel, /monitoring
    // - Files with extensions (e.g. favicon.ico)
    "/((?!api|_next|_vercel|monitoring|.*\\..*).*)",
  ],
};
