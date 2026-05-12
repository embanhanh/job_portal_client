import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

function decodeJwt(token: string) {
  try {
    // Tách phần payload của JWT (phần thứ 2)
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

export default async function middleware(request: NextRequest) {
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
  let accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;
  
  let isAuthorized = !!(accessToken || refreshToken);
  let backendSetCookies: string[] = [];
  let didRefresh = false;

  if (isAuthorized) {
    let shouldRefresh = false;
    
    if (!accessToken && refreshToken) {
      shouldRefresh = true;
    } else if (accessToken) {
      const payload = decodeJwt(accessToken);
      // Nếu không parse được hoặc exp < hiện tại (thêm buffer 10s cho an toàn)
      if (!payload || !payload.exp || Date.now() >= (payload.exp * 1000) - 10000) {
        shouldRefresh = true;
      }
    }

    if (shouldRefresh && refreshToken) {
      try {
        const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Cookie: `refresh_token=${refreshToken}`,
          },
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          if (data.accessToken) {
            accessToken = data.accessToken as string;
            didRefresh = true;
            // Cập nhật request.cookies để các Server Component phía sau đọc được token mới
            request.cookies.set('access_token', accessToken);
            
            // Lưu lại set-cookie header từ Backend để forward cho Next.js Response
            const setCookieHeader = refreshResponse.headers.getSetCookie 
              ? refreshResponse.headers.getSetCookie() 
              : refreshResponse.headers.get('set-cookie');
              
            if (Array.isArray(setCookieHeader)) {
              backendSetCookies = setCookieHeader;
            } else if (typeof setCookieHeader === 'string') {
              // Trong một số môi trường get('set-cookie') gộp bằng dấu phẩy
              backendSetCookies = [setCookieHeader];
            }
          }
        } else {
          // Refresh thất bại (token hết hạn hoặc ko hợp lệ)
          isAuthorized = false;
          request.cookies.delete('access_token');
          request.cookies.delete('refresh_token');
        }
      } catch (error) {
        // Lỗi network, tạm coi như unauthorized hoặc tuỳ theo chiến lược.
        // Ở đây ta cứ false để force re-login
        isAuthorized = false;
      }
    }
  }

  const response = intlMiddleware(request);

  // Áp dụng các Set-Cookie từ Backend vào Next Response để trình duyệt nhận được token mới
  if (backendSetCookies.length > 0) {
    backendSetCookies.forEach((cookieStr) => {
      response.headers.append('Set-Cookie', cookieStr);
    });
  }

  // Override request cookie cho các Server Components phía sau (Next.js internals)
  // Khi Middleware refresh thành công, cần inject Cookie header mới vào request
  // để next/headers (trong Server Component) đọc được access_token mới
  if (didRefresh && accessToken) {
    response.headers.set('x-middleware-request-cookie', request.cookies.toString());
    
    const existingOverrides = response.headers.get('x-middleware-override-headers');
    const parts = existingOverrides ? existingOverrides.split(',').map(s => s.trim()) : [];
    if (!parts.includes('cookie')) {
      parts.push('cookie');
      response.headers.set('x-middleware-override-headers', parts.join(','));
    }
  }

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
