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

const { collectSitemapEntries, siteUrl, ROBOTS_DISALLOW_PATHS, EXCLUDED_PAGE_KEYS } = await import(
    pathToFileURL(join(root, "src/data/seoConfig.js")).href
);
const { resolveLegacyRouteRedirect } = await import(
    pathToFileURL(join(root, "src/data/legacyRouteRedirects.js")).href
);
const { getPublishedBlogPosts } = await import(pathToFileURL(join(root, "src/data/blogPosts.js")).href);
const { getPublicNewsStories } = await import(pathToFileURL(join(root, "src/data/newsPosts.js")).href);
const { getCatalogBooks, getBookUrl, isPurchasable } = await import(
    pathToFileURL(join(root, "src/data/booksCatalog.js")).href
);
const { products, getProductUrl, getProductsUrl } = await import(
    pathToFileURL(join(root, "src/data/products.js")).href
);
const { resources } = await import(pathToFileURL(join(root, "src/data/resources.js")).href);

const bookDetailSource = readFileSync(join(root, "src/pages/BookDetailPage.jsx"), "utf8");
const studyNestSource = readFileSync(join(root, "src/pages/StudyNest.jsx"), "utf8");
const indexHtml = readFileSync(join(root, "index.html"), "utf8");
const aboutSource = readFileSync(join(root, "src/pages/About.jsx"), "utf8");
const homeSource = readFileSync(join(root, "src/pages/HomePage.jsx"), "utf8");

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
    assert.ok(!locs.some((l) => l.includes("?page=")), "no legacy query locs in sitemap");
    assert.ok(!locs.some((l) => l.includes("newsletter-success")));
    assert.ok(!locs.some((l) => l.includes("blog-admin")));
    for (const book of getCatalogBooks()) {
        assert.ok(locs.includes(getBookUrl(book)), `missing book ${book.slug}`);
    }
    for (const product of products) {
        assert.ok(locs.includes(getProductUrl(product.page)), `missing product ${product.page}`);
    }
    pass(`sitemap unique + core routes (${locs.length} URLs)`);
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
    assert.equal(resolveLegacyRouteRedirect("?page=books&book=the-southeast-asian-table"), "/books/the-southeast-asian-table");
    assert.equal(resolveLegacyRouteRedirect("?page=products"), "/products");
    assert.equal(resolveLegacyRouteRedirect("?resource=ai-product-launch-checklist"), "/resources/ai-product-launch-checklist");
    assert.equal(resolveLegacyRouteRedirect("?page=newsletter-admin"), null);
    assert.equal(resolveLegacyRouteRedirect("?page=newsletter-success"), null);
    pass("legacy redirects (including ?article= and ?page=blog)");
} catch (error) {
    fail(`legacy redirects: ${error.message}`);
}

try {
    assert.ok(ROBOTS_DISALLOW_PATHS.includes("/?page=newsletter-success"));
    assert.ok(EXCLUDED_PAGE_KEYS.has("newsletter-success"));
    assert.match(indexHtml, /G-CD944CHBK6|%VITE_GA_MEASUREMENT_ID%/);
    assert.match(indexHtml, /google-site-verification/);
    assert.match(indexHtml, /rel="canonical" href="https:\/\/getcinnova\.com\/"/);
    pass("robots exclusions + homepage canonical/verification hooks");
} catch (error) {
    fail(`robots/canonical: ${error.message}`);
}

try {
    assert.doesNotMatch(studyNestSource, /offers:\s*\{\s*"@type":\s*"Offer",\s*price:\s*"0"/);
    assert.doesNotMatch(bookDetailSource, /"@type":\s*"Offer"/);
    assert.match(bookDetailSource, /BreadcrumbList|buildBreadcrumbSchema/);
    assert.match(aboutSource, /"@type":\s*"AboutPage"/);
    assert.match(homeSource, /\/books/);
    pass("structured data: no fake book/product Offers; AboutPage + Book breadcrumbs");
} catch (error) {
    fail(`structured data: ${error.message}`);
}

try {
    const seat = getCatalogBooks().find((b) => b.slug === "the-southeast-asian-table");
    assert.ok(seat && isPurchasable(seat));
    for (const book of getCatalogBooks()) {
        if (book.slug === "the-southeast-asian-table") continue;
        assert.equal(isPurchasable(book), false);
    }
    assert.ok(getPublishedBlogPosts().length >= 40);
    assert.ok(getPublicNewsStories().length >= 20);
    assert.ok(resources.length >= 10);
    pass(
        `content inventory blogs=${getPublishedBlogPosts().length} news=${getPublicNewsStories().length} books=${getCatalogBooks().length} products=${products.length} resources=${resources.length}`,
    );
} catch (error) {
    fail(`inventory: ${error.message}`);
}

try {
    for (const post of getPublishedBlogPosts()) {
        assert.ok(post.slug && post.title && post.status === "published");
        const url = `${siteUrl}/blog/${post.slug}`;
        assert.ok(url.startsWith("https://getcinnova.com/blog/"));
    }
    for (const story of getPublicNewsStories()) {
        assert.ok(story.slug && story.title);
        assert.notEqual(story.isDemo, true);
    }
    pass("blog/news metadata integrity (no demo news; published posts have slugs)");
} catch (error) {
    fail(`content metadata: ${error.message}`);
}

if (!process.exitCode) {
    console.log("\nAll SEO checks passed.");
}
