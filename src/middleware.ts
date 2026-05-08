import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes không cần auth checking
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') // Static files
  ) {
    return NextResponse.next();
  }

  // 1. Chạy next-intl middleware để xử lý locale routing
  const response = intlMiddleware(request);

  // 2. Auth logic — check HTTP-only cookies
  const hasAccessToken = request.cookies.has('access_token');
  const hasRefreshToken = request.cookies.has('refresh_token');
  const isAuthorized = hasAccessToken || hasRefreshToken;

  // Lấy locale từ URL
  const [, locale] = pathname.split('/');
  const validLocale = routing.locales.includes(locale as "vi" | "en")
    ? locale
    : routing.defaultLocale;

  // Normalize pathname bỏ locale prefix
  const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';

  const isAuthRoute = pathWithoutLocale.startsWith('/login') ||
    pathWithoutLocale.startsWith('/register');
  const isEmployerRoute = pathWithoutLocale.startsWith('/employer');
  const isAdminRoute = pathWithoutLocale.startsWith('/admin');

  if (isAuthorized) {
    // Đã đăng nhập → redirect ra khỏi login/register
    if (isAuthRoute) {
      return NextResponse.redirect(new URL(`/${validLocale}/`, request.url));
    }
    // Employer/Admin route: không redirect ở middleware theo role
    // → Client-side RoleGuard sẽ hiển thị Forbidden nếu không đủ quyền
  } else {
    // Chưa đăng nhập → bảo vệ các route cần auth
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
