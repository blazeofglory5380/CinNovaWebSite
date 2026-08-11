/**
 * Phase 11.3 full-site SEO regression checks.
 * Run: npm run test:seo
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fail = (msg) => {
    console.error(`FAIL: ${msg}`);
    process.exitCode = 1;
};
const pass = (msg) => console.log(`PASS: ${msg}`);

const {
    collectSitemapEntries,
    siteUrl,
    ROBOTS_DISALLOW_PATHS,
    EXCLUDED_PAGE_KEYS,
    NOINDEX_PUBLIC_PAGE_KEYS,
} = await import(pathToFileURL(join(root, "src/data/seoConfig.js")).href);
const { resolveLegacyRouteRedirect } = await import(
    pathToFileURL(join(root, "src/data/legacyRouteRedirects.js")).href
);
const { getPublishedBlogPosts, blogCategories, slugifyCategory } = await import(
    pathToFileURL(join(root, "src/data/blogPosts.js")).href
);
const { getPublicNewsStories } = await import(pathToFileURL(join(root, "src/data/newsPosts.js")).href);
const { getCatalogBooks, getBookUrl, isPurchasable, BOOK_RELEASE_STATUSES } = await import(
    pathToFileURL(join(root, "src/data/booksCatalog.js")).href
);
const { products, getProductUrl, getProductsUrl } = await import(
    pathToFileURL(join(root, "src/data/products.js")).href
);
const { resources, getResourceUrl } = await import(pathToFileURL(join(root, "src/data/resources.js")).href);
const { PUBLIC_PAGE_ROUTES } = await import(pathToFileURL(join(root, "src/data/publicPageRoutes.js")).href);

const bookDetailSource = readFileSync(join(root, "src/pages/BookDetailPage.jsx"), "utf8");
const studyNestSource = readFileSync(join(root, "src/pages/StudyNest.jsx"), "utf8");
const pricingSource = readFileSync(join(root, "src/pages/Pricing.jsx"), "utf8");
const newsletterSuccessSource = readFileSync(join(root, "src/pages/NewsletterSuccess.jsx"), "utf8");
const freeRentalSource = readFileSync(join(root, "src/pages/FreeRentalCalculator.jsx"), "utf8");
const indexHtml = readFileSync(join(root, "index.html"), "utf8");
const aboutSource = readFileSync(join(root, "src/pages/About.jsx"), "utf8");
const homeSource = readFileSync(join(root, "src/pages/HomePage.jsx"), "utf8");

function classify(loc) {
    const path = loc.replace(siteUrl, "") || "/";
    if (path === "/") return "Home";
    if (path === "/products") return "Products";
    if (path.startsWith("/products/")) return "Product details";
    if (path === "/books") return "Books";
    if (path.startsWith("/books/")) return "Book details";
    if (path === "/news") return "News";
    if (path.startsWith("/news/")) return "News stories";
    if (path === "/blog") return "Blog";
    if (path.startsWith("/blog/category/")) return "Blog categories";
    if (path.startsWith("/blog/")) return "Blog posts";
    if (path === "/resources" || path.startsWith("/resources/")) return "Resources";
    if (path === "/guides" || path.startsWith("/guides/")) return "Guides";
    if (path.startsWith("/company/")) return "Company";
    if (path.startsWith("/tools/")) return "Tools";
    if (
        [
            "/pricing",
            "/about",
            "/contact",
            "/newsletter",
            "/languages",
            "/privacy",
            "/terms",
            "/affiliate-disclosure",
            "/refund-policy",
            "/digital-product-terms",
            "/cookie-policy",
            "/disclaimer",
            "/accessibility",
            "/dmca",
            "/sponsorship-disclosure",
        ].includes(path)
    ) {
        return "Migrated pages";
    }
    return "Other";
}

try {
    const entries = collectSitemapEntries();
    const locs = entries.map((e) => e.loc);
    assert.equal(new Set(locs).size, locs.length, "duplicate sitemap locs");
    assert.ok(locs.includes(`${siteUrl}/`));
    assert.ok(locs.includes(getProductsUrl()));
    assert.ok(locs.includes(`${siteUrl}/books`));
    assert.ok(locs.includes(`${siteUrl}/news`));
    assert.ok(locs.includes(`${siteUrl}/blog`));
    assert.ok(locs.includes(`${siteUrl}/about`));
    assert.ok(locs.includes(`${siteUrl}/newsletter`));
    assert.ok(!locs.includes(`${siteUrl}/pricing`), "pricing must be excluded (waitlist; hosted billing offline)");
    assert.ok(!locs.includes(`${siteUrl}/cart`), "cart must be noindex");
    assert.ok(!locs.includes(`${siteUrl}/checkout`), "checkout must be noindex");
    assert.ok(!locs.includes(`${siteUrl}/store`), "store must be noindex while hosted commerce offline");
    assert.ok(!locs.some((l) => l.includes("?page=")), "no legacy query locs in sitemap");
    assert.ok(!locs.some((l) => l.includes("newsletter-success")));
    assert.ok(!locs.some((l) => l.includes("blog-admin")));
    assert.ok(locs.every((l) => l.startsWith("https://getcinnova.com")), "production origin only");
    assert.ok(!locs.some((l) => l.includes("www.")), "non-www only");

    for (const book of getCatalogBooks()) {
        assert.ok(locs.includes(getBookUrl(book)), `missing book ${book.slug}`);
    }
    for (const product of products) {
        assert.ok(locs.includes(getProductUrl(product.page)), `missing product ${product.page}`);
    }
    for (const resource of resources) {
        assert.ok(locs.includes(getResourceUrl(resource)), `missing resource ${resource.slug}`);
    }
    for (const post of getPublishedBlogPosts()) {
        assert.ok(locs.includes(`${siteUrl}/blog/${post.slug}`), `missing blog ${post.slug}`);
    }
    for (const story of getPublicNewsStories()) {
        assert.ok(locs.includes(`${siteUrl}/news/${story.slug}`), `missing news ${story.slug}`);
    }
    for (const category of blogCategories) {
        assert.ok(
            locs.includes(`${siteUrl}/blog/category/${slugifyCategory(category)}`),
            `missing category ${category}`,
        );
    }
    for (const route of PUBLIC_PAGE_ROUTES) {
        if (NOINDEX_PUBLIC_PAGE_KEYS.has(route.key)) {
            assert.ok(!locs.includes(`${siteUrl}${route.path}`), `noindex route in sitemap: ${route.path}`);
            continue;
        }
        assert.ok(locs.includes(`${siteUrl}${route.path}`), `missing migrated ${route.path}`);
    }

    const counts = {};
    for (const loc of locs) {
        const family = classify(loc);
        counts[family] = (counts[family] || 0) + 1;
    }
    assert.equal(counts.Home, 1);
    assert.equal(counts.Products, 1);
    assert.equal(counts["Product details"], 5);
    assert.equal(counts.Books, 1);
    assert.equal(counts["Book details"], 4);
    assert.equal(counts.News, 1);
    assert.equal(counts["News stories"], 36);
    assert.equal(counts.Blog, 1);
    assert.equal(counts["Blog posts"], 50);
    assert.equal(counts["Blog categories"], 11);
    assert.equal(counts.Resources, 13); // index + 12
    assert.equal(counts.Guides, 35); // hub + 34
    assert.equal(counts.Company, 9);
    assert.equal(counts.Tools, 1);
    assert.equal(counts["Migrated pages"], 14); // core migrated + legal trust pages (pricing/store/cart/checkout excluded)
    assert.equal(counts.Other || 0, 0);
    assert.equal(locs.length, 183);

    pass(`sitemap unique + family counts (${locs.length} URLs; pricing/cart/checkout/store excluded)`);
} catch (error) {
    fail(`sitemap: ${error.message}`);
}

try {
    assert.equal(
        resolveLegacyRouteRedirect("?article=how-founders-can-validate-multiple-app-ideas"),
        "/blog/how-founders-can-validate-multiple-app-ideas",
    );
    assert.equal(resolveLegacyRouteRedirect("?page=news"), "/news");
    assert.equal(resolveLegacyRouteRedirect("?page=blog"), "/blog");
    assert.equal(resolveLegacyRouteRedirect("?page=books"), "/books");
    assert.equal(
        resolveLegacyRouteRedirect("?page=books&book=the-southeast-asian-table"),
        "/books/the-southeast-asian-table",
    );
    assert.equal(resolveLegacyRouteRedirect("?page=products"), "/products");
    assert.equal(
        resolveLegacyRouteRedirect("?resource=ai-product-launch-checklist"),
        "/resources/ai-product-launch-checklist",
    );
    assert.equal(resolveLegacyRouteRedirect("?page=newsletter-admin"), null);
    assert.equal(resolveLegacyRouteRedirect("?page=newsletter-success"), null);
    assert.equal(resolveLegacyRouteRedirect("?page=pricing"), "/pricing");
    pass("legacy redirects (including ?article= and ?page=blog)");
} catch (error) {
    fail(`legacy redirects: ${error.message}`);
}

try {
    assert.ok(ROBOTS_DISALLOW_PATHS.includes("/?page=newsletter-success"));
    assert.ok(EXCLUDED_PAGE_KEYS.has("newsletter-success"));
    assert.ok(NOINDEX_PUBLIC_PAGE_KEYS.has("pricing"));
    assert.match(pricingSource, /\bnoindex\b/);
    assert.match(newsletterSuccessSource, /\bnoindex\b/);
    assert.match(newsletterSuccessSource, /\bnoCanonical\b/);
    assert.match(indexHtml, /G-CD944CHBK6|%VITE_GA_MEASUREMENT_ID%/);
    const verificationMatches = indexHtml.match(/name="google-site-verification"/g) || [];
    assert.equal(verificationMatches.length, 1, "exactly one GSC verification meta");
    assert.match(
        indexHtml,
        /content="bIkFCba9eay4SEEiR3u_X6TulZKU69o64-QwKlUtT4I"/,
    );
    assert.match(indexHtml, /rel="canonical" href="https:\/\/getcinnova\.com\/"/);
    pass("robots/noindex + GSC verification hooks");
} catch (error) {
    fail(`robots/canonical: ${error.message}`);
}

try {
    assert.doesNotMatch(studyNestSource, /offers:\s*\{\s*"@type":\s*"Offer",\s*price:\s*"0"/);
    assert.doesNotMatch(bookDetailSource, /"@type":\s*"Offer"/);
    assert.doesNotMatch(pricingSource, /"@type":\s*"Offer"/);
    assert.match(bookDetailSource, /BreadcrumbList|buildBreadcrumbSchema/);
    assert.match(aboutSource, /"@type":\s*"AboutPage"/);
    assert.match(homeSource, /\/books/);
    assert.match(freeRentalSource, /"@type":\s*"Offer"/);
    assert.match(freeRentalSource, /price:\s*"0"/);
    pass("structured data honesty (no fake Offers; FreeRental free Offer retained)");
} catch (error) {
    fail(`structured data: ${error.message}`);
}

try {
    const seat = getCatalogBooks().find((b) => b.slug === "the-southeast-asian-table");
    const beyond = getCatalogBooks().find((b) => b.slug === "beyond-the-last-light");
    const nightmare = getCatalogBooks().find((b) => b.slug === "nightmare-forest");
    const kiddo = getCatalogBooks().find((b) => b.slug === "kiddo-illustrated-collection");
    assert.ok(seat && isPurchasable(seat));
    assert.equal(seat.releaseStatus, BOOK_RELEASE_STATUSES.AVAILABLE);
    assert.equal(beyond.releaseStatus, BOOK_RELEASE_STATUSES.COMING_SOON);
    assert.equal(nightmare.releaseStatus, BOOK_RELEASE_STATUSES.IN_DEVELOPMENT);
    assert.equal(kiddo.releaseStatus, BOOK_RELEASE_STATUSES.IN_DEVELOPMENT);
    for (const book of getCatalogBooks()) {
        if (book.slug === "the-southeast-asian-table") continue;
        assert.equal(isPurchasable(book), false);
    }
    assert.equal(getPublishedBlogPosts().length, 50);
    assert.equal(getPublicNewsStories().length, 36);
    assert.equal(getCatalogBooks().length, 4);
    assert.equal(products.length, 5);
    assert.equal(resources.length, 12);
    pass("content inventory + book release statuses");
} catch (error) {
    fail(`inventory: ${error.message}`);
}

try {
    const blogSlugs = getPublishedBlogPosts().map((p) => p.slug);
    assert.equal(new Set(blogSlugs).size, blogSlugs.length, "duplicate blog slugs");
    for (const post of getPublishedBlogPosts()) {
        assert.ok(post.slug && post.title && post.status === "published");
        assert.notEqual(post.shadowed, true);
    }
    const newsSlugs = getPublicNewsStories().map((s) => s.slug);
    assert.equal(new Set(newsSlugs).size, newsSlugs.length, "duplicate news slugs");
    for (const story of getPublicNewsStories()) {
        assert.ok(story.slug && story.title);
        assert.notEqual(story.isDemo, true);
        assert.ok(story.publishedAt || story.date, `news ${story.slug} missing publication date`);
    }
    for (const resource of resources) {
        assert.ok(Array.isArray(resource.sections) && resource.sections.length >= 1);
        assert.ok(resource.description);
    }
    pass("blog/news/resource integrity (no demos/duplicates; resources have sections)");
} catch (error) {
    fail(`content metadata: ${error.message}`);
}

if (!process.exitCode) {
    console.log("\nAll SEO checks passed.");
}
