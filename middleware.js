import { next } from "@vercel/functions";
import { resolveLegacyRouteRedirect } from "./src/data/legacyRouteRedirects.js";

/**
 * Vercel Routing Middleware.
 *
 * Only runs on "/" (see `config.matcher`), where the legacy product/resource/
 * public-page/news query URLs live. For a supported legacy query it emits a true
 * edge-level 308 whose Location is the clean pathname with NO query string.
 * Everything else — plain "/", admin query routes, and any unrelated/invalid
 * query — continues normally via next(). Clean routes like /products/studynest
 * or /news never hit this middleware, so a redirect can never loop.
 */
export const config = {
    matcher: "/",
};

export default function middleware(request) {
    const url = new URL(request.url);
    const cleanPath = resolveLegacyRouteRedirect(url.searchParams);

    if (cleanPath) {
        const location = new URL(cleanPath, url.origin).toString();
        return new Response(null, {
            status: 308,
            headers: { Location: location },
        });
    }

    return next();
}
