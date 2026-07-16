/**
 * Shared resolver for legacy product / resource / migrated-public-page query URLs
 * → clean pathnames.
 *
 * Single source of truth used by:
 *   - middleware.js       (Vercel Routing Middleware: emits the edge 308)
 *   - src/App.jsx         (client-side replaceState fallback for local dev / non-Vercel hosting)
 *   - scripts/audit-seo.mjs (drift guard: fails the build if products/resources/pages change without updating the registries)
 *
 * Deliberately self-contained and browser/edge-neutral: it imports no heavy data
 * graph (no analytics, images, or blog inventory), so it stays small and safe in
 * the Vercel Edge runtime. The migrated public-page map comes from the equally
 * light publicPageRoutes.js registry so page routes are never duplicated here.
 * The `audit-seo` sync check keeps the sets below in lock-step with
 * src/data/products.js and src/data/resources.js.
 */
import { getPublicPagePath } from "./publicPageRoutes.js";

/** Product `page` keys — mirrors src/data/products.js `page` values. */
export const LEGACY_PRODUCT_KEYS = new Set([
    "studynest",
    "poisonguard",
    "kiddo",
    "techmate",
    "real-estate",
]);

/** Resource slugs — mirrors src/data/resources.js `slug` values. */
export const LEGACY_RESOURCE_SLUGS = new Set([
    "ai-study-planning-starter-guide",
    "poison-safety-technology-white-paper",
    "cin-nova-product-ecosystem-brochure",
    "real-estate-deal-analysis-template",
    "techmate-ai-troubleshooting-brochure",
    "kiddo-early-learning-case-study",
    "newsletter-growth-playbook-for-app-companies",
    "family-safety-resource-kit",
    "ai-product-launch-checklist",
    "household-chemical-safety-checklist",
    "weekly-student-study-planner-template",
    "real-estate-cash-flow-analysis-template",
]);

/**
 * Normalize the many acceptable inputs into a URLSearchParams instance.
 * Accepts a URL, a URLSearchParams, a raw search string ("?a=b" or "a=b"),
 * or a URL-like object exposing `searchParams`/`search`. Returns null otherwise.
 */
function toSearchParams(input) {
    if (input == null) return null;
    if (input instanceof URLSearchParams) return input;
    if (typeof URL !== "undefined" && input instanceof URL) return input.searchParams;
    if (typeof input === "string") {
        const q = input.indexOf("?");
        return new URLSearchParams(q >= 0 ? input.slice(q + 1) : input);
    }
    if (input.searchParams instanceof URLSearchParams) return input.searchParams;
    if (typeof input.search === "string") return new URLSearchParams(input.search);
    return null;
}

/**
 * Resolve a legacy product/resource query URL to its canonical clean pathname.
 *
 * @param {URL|URLSearchParams|string|{search?:string,searchParams?:URLSearchParams}} input
 * @returns {string|null} A clean pathname (no query, no fragment) for a supported
 *   legacy route (products, resources, or a migrated public page), or null for
 *   unrelated/invalid/unmigrated/admin values (which must continue through normal
 *   application behavior — never redirect to an invented route).
 */
export function resolveLegacyRouteRedirect(input) {
    const params = toSearchParams(input);
    if (!params) return null;

    // Resource legacy form takes precedence: /?resource=<slug>
    const resource = params.get("resource");
    if (resource !== null) {
        return LEGACY_RESOURCE_SLUGS.has(resource) ? `/resources/${resource}` : null;
    }

    // Product/index legacy form: /?page=<key>
    const page = params.get("page");
    if (page === null) return null;
    if (page === "products") return "/products";
    if (page === "resources") return "/resources";
    if (LEGACY_PRODUCT_KEYS.has(page)) return `/products/${page}`;

    // Migrated public marketing/company/tool/hub pages (Phase 2B). Admin keys,
    // unmigrated guides, and invalid values are not in the registry → null.
    return getPublicPagePath(page);
}
