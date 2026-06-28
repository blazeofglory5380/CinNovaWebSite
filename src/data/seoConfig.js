import {
    blogCategories,
    getArticleUrl,
    getBlogUrl,
    getCategoryUrl,
    getPublishedBlogPosts,
    siteUrl,
} from "./blogPosts.js";
import { productMarketing } from "./marketingImages.js";
import { products } from "./products.js";
import { getResourceUrl, resources } from "./resources.js";

export { siteUrl };

/** Default Open Graph / Twitter preview image (absolute URL). */
export const defaultOgImage = `${siteUrl}/images/home/homepage-hero-innovation.jpg`;

/** Routes that must never appear in the sitemap. */
export const EXCLUDED_PAGE_KEYS = new Set([
    "blog-manager",
    "newsletter-admin",
    "newsletter-success",
]);

/** Admin URL paths blocked in robots.txt. */
export const ROBOTS_DISALLOW_PATHS = ["/blog-admin"];

function toAbsoluteImageUrl(path = "") {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${siteUrl}${path.startsWith("/") ? "" : "/"}${path}`;
}

const BUILD_LASTMOD = new Date().toISOString().slice(0, 10);

function toIsoDate(value) {
    if (!value) return BUILD_LASTMOD;
    const parsed = Date.parse(value);
    if (Number.isNaN(parsed)) return BUILD_LASTMOD;
    return new Date(parsed).toISOString().slice(0, 10);
}

export function getStaticPageUrl(pageKey) {
    if (pageKey === "home") return `${siteUrl}/`;
    return `${siteUrl}/?page=${encodeURIComponent(pageKey)}`;
}

/**
 * All public static marketing pages (excluding product landings — added separately).
 */
export const STATIC_PUBLIC_PAGES = [
    { key: "home", changefreq: "weekly", priority: "1.0", lastmod: BUILD_LASTMOD },
    { key: "products", changefreq: "weekly", priority: "0.9", lastmod: BUILD_LASTMOD },
    { key: "resources", changefreq: "weekly", priority: "0.9", lastmod: BUILD_LASTMOD },
    { key: "pricing", changefreq: "monthly", priority: "0.8", lastmod: BUILD_LASTMOD },
    { key: "about", changefreq: "monthly", priority: "0.7", lastmod: BUILD_LASTMOD },
    { key: "contact", changefreq: "monthly", priority: "0.7", lastmod: BUILD_LASTMOD },
    { key: "newsletter", changefreq: "monthly", priority: "0.7", lastmod: BUILD_LASTMOD },
    { key: "partners", changefreq: "monthly", priority: "0.6", lastmod: BUILD_LASTMOD },
    { key: "partnerships", changefreq: "monthly", priority: "0.7", lastmod: BUILD_LASTMOD },
    { key: "press-center", changefreq: "monthly", priority: "0.7", lastmod: BUILD_LASTMOD },
    { key: "media-kit", changefreq: "monthly", priority: "0.6", lastmod: BUILD_LASTMOD },
    { key: "advertise", changefreq: "monthly", priority: "0.6", lastmod: BUILD_LASTMOD },
    { key: "partner-with-us", changefreq: "monthly", priority: "0.6", lastmod: BUILD_LASTMOD },
    { key: "sponsor-newsletter", changefreq: "monthly", priority: "0.6", lastmod: BUILD_LASTMOD },
    { key: "privacy", changefreq: "yearly", priority: "0.4", lastmod: BUILD_LASTMOD },
    { key: "terms", changefreq: "yearly", priority: "0.4", lastmod: BUILD_LASTMOD },
];

/** Valid `?page=` keys and internal route identifiers. */
export const VALID_PAGE_KEYS = new Set([
    ...STATIC_PUBLIC_PAGES.map((page) => page.key),
    ...products.map((product) => product.page),
    "blog-manager",
    "newsletter-admin",
    "newsletter-success",
    "not-found",
]);

/**
 * Build the complete deduplicated sitemap entry list for production.
 * @returns {Array<{ loc: string, lastmod: string, changefreq: string, priority: string }>}
 */
export function collectSitemapEntries() {
    const entries = [];

    for (const page of STATIC_PUBLIC_PAGES) {
        entries.push({
            loc: getStaticPageUrl(page.key),
            lastmod: page.lastmod,
            changefreq: page.changefreq,
            priority: page.priority,
        });
    }

    entries.push({
        loc: getBlogUrl(),
        lastmod: BUILD_LASTMOD,
        changefreq: "daily",
        priority: "0.9",
    });

    for (const category of blogCategories) {
        entries.push({
            loc: getCategoryUrl(category),
            lastmod: BUILD_LASTMOD,
            changefreq: "weekly",
            priority: "0.8",
        });
    }

    for (const product of products) {
        entries.push({
            loc: getStaticPageUrl(product.page),
            lastmod: BUILD_LASTMOD,
            changefreq: "monthly",
            priority: "0.85",
        });
    }

    for (const post of getPublishedBlogPosts()) {
        entries.push({
            loc: getArticleUrl(post),
            lastmod: toIsoDate(post.date),
            changefreq: "monthly",
            priority: post.featured ? "0.85" : "0.75",
        });
    }

    for (const resource of resources) {
        entries.push({
            loc: getResourceUrl(resource),
            lastmod: BUILD_LASTMOD,
            changefreq: "monthly",
            priority: resource.featured ? "0.75" : "0.7",
        });
    }

    const seen = new Set();
    const deduped = [];

    for (const entry of entries) {
        if (seen.has(entry.loc)) continue;
        seen.add(entry.loc);
        deduped.push(entry);
    }

    return attachSitemapImages(deduped.sort((a, b) => a.loc.localeCompare(b.loc)));
}

/**
 * Attach image metadata for Google image sitemap extension.
 * @param {Array<{ loc: string, lastmod: string, changefreq: string, priority: string }>} entries
 */
export function attachSitemapImages(entries) {
    const postsByUrl = new Map(getPublishedBlogPosts().map((post) => [getArticleUrl(post), post]));
    const resourcesByUrl = new Map(resources.map((resource) => [getResourceUrl(resource), resource]));
    const productsByUrl = new Map(products.map((product) => [getStaticPageUrl(product.page), product]));

    return entries.map((entry) => {
        const images = [];
        const seen = new Set();

        function pushImage(src, title) {
            const loc = toAbsoluteImageUrl(src);
            if (!loc || seen.has(loc)) return;
            seen.add(loc);
            images.push({ loc, title: title || "" });
        }

        const post = postsByUrl.get(entry.loc);
        if (post) {
            pushImage(post.heroImage || post.ogImage, post.title);
        }

        const resource = resourcesByUrl.get(entry.loc);
        if (resource) {
            pushImage(resource.coverImage, resource.title);
        }

        const product = productsByUrl.get(entry.loc);
        if (product) {
            pushImage(product.image, product.name);
            const marketing = productMarketing[product.page];
            if (marketing?.hero?.src) {
                pushImage(marketing.hero.src, product.name);
            }
        }

        if (entry.loc === `${siteUrl}/`) {
            pushImage(defaultOgImage, "Cin Nova");
        }

        return images.length ? { ...entry, images } : entry;
    });
}
