/**
 * Phase 11.2 revenue activation tests.
 * Run: npm run test:revenue-activation
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

const { getBookBySlug, getCatalogBooks, isPurchasable, BOOK_RELEASE_STATUSES } =
    await import(pathToFileURL(join(root, "src/data/booksCatalog.js")).href);
const { getCommerceEntityForBook } = await import(
    pathToFileURL(join(root, "src/data/commerceCatalog.js")).href
);
const { resolveCommercialModule, isCommercialModuleEnabled } = await import(
    pathToFileURL(join(root, "src/data/commercialModules.js")).href
);
const { getPublishedBlogPosts } = await import(
    pathToFileURL(join(root, "src/data/blogPosts.js")).href
);
const { canShowPurchaseCta, COMMERCE_AVAILABILITY, isSafeExternalCommerceUrl } = await import(
    pathToFileURL(join(root, "src/data/commerceModels.js")).href
);

const bookDetailSource = readFileSync(join(root, "src/pages/BookDetailPage.jsx"), "utf8");
const booksSource = readFileSync(join(root, "src/pages/Books.jsx"), "utf8");
const newsSource = readFileSync(join(root, "src/pages/News.jsx"), "utf8");
const analyticsSource = readFileSync(join(root, "src/utils/analytics.js"), "utf8");
const blogPostsSource = readFileSync(join(root, "src/data/blogPosts.js"), "utf8");

const AMAZON = "https://www.amazon.com/dp/B0H8YL3L5L";

try {
    const seat = getBookBySlug("the-southeast-asian-table");
    const commerce = getCommerceEntityForBook(seat);
    assert.equal(seat.externalUrl, AMAZON);
    assert.equal(commerce.destinationUrl, AMAZON);
    assert.equal(commerce.affiliateEnabled, false);
    assert.ok(Array.isArray(seat.highlights) && seat.highlights.length >= 3);
    assert.match(bookDetailSource, /placement="hero"/);
    assert.match(bookDetailSource, /placement="footer"/);
    assert.doesNotMatch(bookDetailSource, /placement="mid_page"/);
    assert.equal((bookDetailSource.match(/https:\/\/www\.amazon\.com\/dp\/B0H8YL3L5L/g) || []).length, 0);
    // URL comes from catalog entity — not hard-coded repeatedly in JSX
    pass("SEAT CTA placements + Amazon URL consistency via catalog");
} catch (error) {
    fail(`SEAT placements: ${error.message}`);
}

try {
    assert.match(booksSource, /placement="books"/);
    assert.match(booksSource, /Get new releases and publishing updates/);
    assert.match(bookDetailSource, /placement="book_detail"/);
    assert.match(bookDetailSource, /entitySlug=\{book\.slug\}/);
    const beyond = getBookBySlug("beyond-the-last-light");
    assert.equal(beyond.releaseStatus, BOOK_RELEASE_STATUSES.COMING_SOON);
    assert.equal(isPurchasable(beyond), false);
    assert.match(bookDetailSource, /Join Updates/);
    pass("newsletter attribution + Coming Soon lead CTA");
} catch (error) {
    fail(`newsletter/coming soon: ${error.message}`);
}

try {
    assert.equal(resolveCommercialModule(null), null);
    assert.equal(resolveCommercialModule({ enabled: false, type: "book", bookSlug: "x" }), null);
    assert.equal(isCommercialModuleEnabled({ enabled: true, type: "book" }), false);
    const bookMod = resolveCommercialModule({
        enabled: true,
        type: "book",
        bookSlug: "the-southeast-asian-table",
    });
    assert.equal(bookMod.type, "book");
    assert.equal(bookMod.bookSlug, "the-southeast-asian-table");
    // Live published article with contextual newsletter module (not a shadowed id 1–15 stub).
    const founders = getPublishedBlogPosts().find(
        (p) => p.slug === "how-founders-can-validate-multiple-app-ideas",
    );
    assert.ok(founders?.commercialModule?.enabled);
    assert.equal(founders.commercialModule.type, "newsletter");
    // Cornerstone override must not inherit a leaked commercialModule from shadowed stubs.
    const construction = getPublishedBlogPosts().find(
        (p) => p.slug === "ai-in-construction-and-engineering",
    );
    assert.equal(construction?.commercialModule, undefined);
    // No SEAT cookbook promo attached via blog post metadata.
    assert.doesNotMatch(blogPostsSource, /bookSlug:\s*"the-southeast-asian-table"/);
    pass("Blog commercial module gating (manual metadata only)");
} catch (error) {
    fail(`blog commercial module: ${error.message}`);
}

try {
    assert.doesNotMatch(newsSource, /amazon\.com\/dp/);
    assert.doesNotMatch(newsSource, /the-southeast-asian-table/);
    assert.doesNotMatch(newsSource, /View on Amazon/);
    assert.match(newsSource, /Join the newsletter/);
    pass("News has no random cookbook promo; newsletter CTA only");
} catch (error) {
    fail(`news promo safety: ${error.message}`);
}

try {
    const ordered = getCatalogBooks();
    assert.equal(ordered[0].slug, "the-southeast-asian-table");
    assert.ok(ordered.every((b, i, arr) => {
        if (i === 0) return true;
        const rank = { AVAILABLE: 0, COMING_SOON: 1, IN_DEVELOPMENT: 2 };
        return rank[arr[i - 1].releaseStatus] <= rank[b.releaseStatus];
    }));
    assert.equal(
        canShowPurchaseCta({
            availability: COMMERCE_AVAILABILITY.COMING_SOON,
            destinationUrl: AMAZON,
        }),
        false,
    );
    assert.equal(isSafeExternalCommerceUrl("javascript:alert(1)"), false);
    pass("availability behavior + catalog ordering");
} catch (error) {
    fail(`availability: ${error.message}`);
}

try {
    assert.doesNotMatch(analyticsSource, /trackEvent\(\s*["']purchase["']/);
    assert.doesNotMatch(analyticsSource, /trackEvent\(\s*["']begin_checkout["']/);
    assert.doesNotMatch(analyticsSource, /trackEvent\(\s*["']subscribe["']/);
    assert.match(analyticsSource, /commerce_outbound_click/);
    const booksCss = readFileSync(join(root, "src/pages/Books.css"), "utf8");
    assert.match(booksCss, /min-height:\s*44px/);
    assert.match(bookDetailSource, /books-v2__card-actions/);
    pass("no fake purchase events + mobile-friendly CTA structure hooks");
} catch (error) {
    fail(`analytics/mobile: ${error.message}`);
}

if (!process.exitCode) {
    console.log("\nAll revenue activation checks passed.");
}
