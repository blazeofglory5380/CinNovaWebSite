#!/usr/bin/env node
/**
 * CinNova Books route regression: canonical /books, legacy /?page=books,
 * detail paths, hero assets, catalog statuses, and sitemap.
 */
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveLegacyRouteRedirect } from "../src/data/legacyRouteRedirects.js";
import {
    BOOK_RELEASE_STATUSES,
    getBookBySlug,
    getBookPath,
    getBooksIndexPath,
    getBooksIndexUrl,
    getCatalogBooks,
    getFeaturedBook,
    isPurchasable,
    statusLabel,
} from "../src/data/booksCatalog.js";
import { collectSitemapEntries, getStaticPageUrl, siteUrl } from "../src/data/seoConfig.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

assert.equal(getBooksIndexPath(), "/books");
assert.equal(getBooksIndexUrl(), `${siteUrl}/books`);
assert.equal(getStaticPageUrl("books"), `${siteUrl}/books`);

assert.equal(resolveLegacyRouteRedirect("?page=books"), "/books");
assert.equal(resolveLegacyRouteRedirect("/?page=books"), "/books");
assert.equal(
    resolveLegacyRouteRedirect("?page=books&book=beyond-the-last-light"),
    "/books/beyond-the-last-light",
);

const catalog = getCatalogBooks();
assert.ok(catalog.length >= 4, "expected at least four catalog titles");

const featured = getFeaturedBook();
assert.equal(featured.slug, "the-southeast-asian-table");
assert.equal(featured.releaseStatus, BOOK_RELEASE_STATUSES.AVAILABLE);
assert.equal(isPurchasable(featured), true);
assert.ok(featured.externalUrl?.includes("amazon.com"), "featured purchasable book needs verified Amazon URL");

const beyond = getBookBySlug("beyond-the-last-light");
assert.ok(beyond);
assert.equal(beyond.releaseStatus, BOOK_RELEASE_STATUSES.COMING_SOON);
assert.equal(isPurchasable(beyond), false);
assert.equal(beyond.externalUrl, null);
assert.equal(statusLabel(beyond), "Coming Soon");

const nightmare = getBookBySlug("nightmare-forest");
assert.ok(nightmare);
assert.equal(nightmare.releaseStatus, BOOK_RELEASE_STATUSES.IN_DEVELOPMENT);
assert.equal(isPurchasable(nightmare), false);

const kiddo = getBookBySlug("kiddo-illustrated-collection");
assert.ok(kiddo);
assert.equal(kiddo.releaseStatus, BOOK_RELEASE_STATUSES.IN_DEVELOPMENT);
assert.equal(isPurchasable(kiddo), false);

for (const book of catalog) {
    assert.equal(getBookPath(book), `/books/${book.slug}`);
}

const heroVideo = path.join(root, "public/images/hero/cinnova-books-hero-nightmare-beyond.mp4");
const heroPoster = path.join(root, "public/images/hero/cinnova-books-hero-nightmare-beyond-master.png");
await access(heroVideo);
await access(heroPoster);

const sitemap = collectSitemapEntries();
const booksIndex = sitemap.filter((entry) => entry.loc === `${siteUrl}/books`);
assert.equal(booksIndex.length, 1, "sitemap must contain /books exactly once");
assert.equal(
    sitemap.filter((entry) => entry.loc.includes("?page=books")).length,
    0,
    "sitemap must not include legacy ?page=books",
);
for (const book of catalog) {
    assert.ok(
        sitemap.some((entry) => entry.loc === `${siteUrl}/books/${book.slug}`),
        `sitemap missing book ${book.slug}`,
    );
}

const analyticsSrc = await readFile(path.join(root, "src/utils/analytics.js"), "utf8");
for (const eventName of [
    "books_hero_explore_click",
    "books_hero_featured_click",
    "book_card_click",
    "book_external_purchase_click",
]) {
    assert.ok(analyticsSrc.includes(`"${eventName}"`), `analytics missing event ${eventName}`);
}

const booksPageSrc = await readFile(path.join(root, "src/pages/Books.jsx"), "utf8");
assert.ok(booksPageSrc.includes("cinnova-books-hero-nightmare-beyond.mp4"));
assert.ok(booksPageSrc.includes("cinnova-books-hero-nightmare-beyond-master.png"));
assert.ok(booksPageSrc.includes("cn-core-hero--books"));
assert.ok(booksPageSrc.includes("Explore Books"));
assert.ok(booksPageSrc.includes("Featured Release"));

const heroCss = await readFile(path.join(root, "src/components/brand-dna/CinNovaCoreHero.css"), "utf8");
assert.ok(heroCss.includes("cn-core-hero--books"));

const heroComponent = await readFile(path.join(root, "src/components/brand-dna/CinNovaCoreHero.jsx"), "utf8");
assert.ok(heroComponent.includes("prefers-reduced-motion"));
assert.ok(heroComponent.includes("showStill"));

const productsSrc = await readFile(path.join(root, "src/pages/ProductsPage.jsx"), "utf8");
assert.ok(productsSrc.includes("Books & Publishing"));
assert.ok(productsSrc.includes('onNavigate("books")'));

const appSrc = await readFile(path.join(root, "src/App.jsx"), "utf8");
assert.ok(appSrc.includes("goBooks"));
assert.ok(appSrc.includes('path === "/books"'));

// Primary nav: Books is a top-level control (not only under More).
const primaryBooksMatch = appSrc.match(
    /Primary links[\s\S]*?<button[\s\S]*?>\s*Books\s*<\/button>[\s\S]*?NavMoreMenu/,
);
assert.ok(primaryBooksMatch, "Books must appear in the primary nav before NavMoreMenu");
assert.ok(
    primaryBooksMatch[0].includes("goBooks()"),
    "primary Books button must navigate via goBooks → /books",
);
assert.ok(
    primaryBooksMatch[0].includes('page === "book-detail"'),
    "Books nav active state must cover /books/:slug (book-detail)",
);

// About moves to More; must not remain a primary sibling beside Blog/Books.
const moreItemsMatch = appSrc.match(/NavMoreMenu\s*\n?\s*items=\{\[([\s\S]*?)\]\}/);
assert.ok(moreItemsMatch, "expected NavMoreMenu items array");
assert.ok(moreItemsMatch[1].includes('label: "About"'), "About must appear under More");
assert.equal(
    moreItemsMatch[1].includes('label: "Books"'),
    false,
    "Books must not be duplicated in the More menu",
);
assert.equal(
    /Primary links[\s\S]*?>\s*About\s*<\/button>[\s\S]*?NavMoreMenu/.test(appSrc),
    false,
    "About must not remain a primary nav button",
);
assert.ok(appSrc.includes('openPage("about")'), "/about must remain reachable");

const footerSrc = await readFile(path.join(root, "src/components/SiteFooter.jsx"), "utf8");
assert.ok(footerSrc.includes('onNavigate("books")'));
assert.ok(footerSrc.includes('onNavigate("about")'));

console.log("test:books-route passed");
