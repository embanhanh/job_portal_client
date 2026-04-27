import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all pathnames except:
    // - /api, /_next, /_vercel, /monitoring
    // - Files with extensions (e.g. favicon.ico)
    "/((?!api|_next|_vercel|monitoring|.*\\..*).*)",
  ],
};
