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

  // 2. Auth logic — check HTTP-only cookies
  const hasAccessToken = request.cookies.has('access_token');
  const hasRefreshToken = request.cookies.has('refresh_token');
  const isAuthorized = hasAccessToken || hasRefreshToken;

  const response = intlMiddleware(request);

  // 3. Auth Hint cho Client (Non-HTTP-Only)
  // Giúp Client quyết định có gọi API /me hay không mà không cần thử sai
  if (isAuthorized) {
    response.cookies.set('has_session', 'true', {
      httpOnly: false,
      path: '/',
      sameSite: 'lax',
    });
  } else {
    response.cookies.delete('has_session');
  }

  // 4. Redirect logic
  const [, locale] = pathname.split('/');
  const validLocale = routing.locales.includes(locale as "vi" | "en")
    ? locale
    : routing.defaultLocale;

  const pathWithoutLocale = pathname.startsWith(`/${validLocale}`)
    ? pathname.slice(validLocale.length + 1) || '/'
    : pathname;

  const isAuthRoute = pathWithoutLocale.startsWith('/login') ||
    pathWithoutLocale.startsWith('/register');
  
  const isProtectedRoute = 
    pathWithoutLocale.startsWith('/profile') ||
    pathWithoutLocale.startsWith('/employer-registration') ||
    pathWithoutLocale.startsWith('/employer') ||
    pathWithoutLocale.startsWith('/admin');

  if (isAuthorized) {
    // Nếu đã đăng nhập mà truy cập trang auth thì redirect về home
    if (isAuthRoute) {
      const homeUrl = new URL(`/${validLocale}`, request.url);
      const redirectResponse = NextResponse.redirect(homeUrl);
      // Giữ lại cookie has_session khi redirect
      redirectResponse.cookies.set('has_session', 'true', {
        httpOnly: false,
        path: '/',
        sameSite: 'lax',
      });
      return redirectResponse;
    }
  } else {
    // Nếu chưa đăng nhập mà truy cập route bảo vệ thì redirect về login
    if (isProtectedRoute) {
      const loginUrl = new URL(`/${validLocale}/login`, request.url);
      // Lưu lại URL hiện tại để quay lại sau khi login (tùy chọn)
      loginUrl.searchParams.set('callbackUrl', pathname);
      
      const redirectResponse = NextResponse.redirect(loginUrl);
      redirectResponse.cookies.delete('has_session');
      return redirectResponse;
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
