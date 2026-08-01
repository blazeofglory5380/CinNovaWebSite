/**
 * Phase 11.1 monetization foundation tests.
 * Run: npm run test:monetization
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
    REVENUE_MODELS,
    COMMERCE_AVAILABILITY,
    canShowPurchaseCta,
    isSafeExternalCommerceUrl,
    sanitizeCommerceAnalyticsParams,
    EXTERNAL_COMMERCE_REL,
    AFFILIATE_COMMERCE_REL,
} = await import(pathToFileURL(join(root, "src/data/commerceModels.js")).href);

const {
    getCommerceEntityForBook,
    getActiveCommercialDestinations,
    getAllCommerceEntities,
} = await import(pathToFileURL(join(root, "src/data/commerceCatalog.js")).href);

const { booksCatalog, isPurchasable, getBookBySlug } = await import(
    pathToFileURL(join(root, "src/data/booksCatalog.js")).href
);

const { subscriptionPlans, isSubscriptionPlanPurchasable } = await import(
    pathToFileURL(join(root, "src/data/subscriptionPlans.js")).href
);

const { advertisingConfig, shouldRenderAdPlacement } = await import(
    pathToFileURL(join(root, "src/data/advertisingPlacements.js")).href
);

const { normalizeSponsorMeta, shouldShowSponsoredDisclosure } = await import(
    pathToFileURL(join(root, "src/data/sponsorMeta.js")).href
);

const analyticsSource = readFileSync(join(root, "src/utils/analytics.js"), "utf8");
const ctaSource = readFileSync(join(root, "src/components/commerce/CommerceCTA.jsx"), "utf8");
const affiliateDisclosureSource = readFileSync(
    join(root, "src/components/commerce/AffiliateDisclosure.jsx"),
    "utf8",
);
const bookDetailSource = readFileSync(join(root, "src/pages/BookDetailPage.jsx"), "utf8");
const newsletterSignupSource = readFileSync(join(root, "src/components/NewsletterSignup.jsx"), "utf8");
const appSource = readFileSync(join(root, "src/App.jsx"), "utf8");
const robotsSource = readFileSync(join(root, "public/robots.txt"), "utf8");
const seoConfigSource = readFileSync(join(root, "src/data/seoConfig.js"), "utf8");

// --- revenue model mapping ---
try {
    assert.ok(REVENUE_MODELS.EXTERNAL_RETAIL);
    assert.ok(REVENUE_MODELS.AFFILIATE);
    assert.ok(REVENUE_MODELS.SUBSCRIPTION);
    const seat = getCommerceEntityForBook(getBookBySlug("the-southeast-asian-table"));
    assert.equal(seat.revenueModels[0], REVENUE_MODELS.EXTERNAL_RETAIL);
    assert.equal(seat.affiliateEnabled, false);
    assert.equal(seat.price, null);
    assert.equal(seat.destinationUrl, "https://www.amazon.com/dp/B0H8YL3L5L");
    assert.equal(seat.retailer, "Amazon Kindle");
    pass("commerce configuration + SEAT EXTERNAL_RETAIL mapping");
} catch (error) {
    fail(`commerce config: ${error.message}`);
}

// --- availability behavior ---
try {
    assert.equal(
        canShowPurchaseCta({
            availability: COMMERCE_AVAILABILITY.AVAILABLE,
            destinationUrl: "https://www.amazon.com/dp/B0H8YL3L5L",
        }),
        true,
    );
    assert.equal(
        canShowPurchaseCta({
            availability: COMMERCE_AVAILABILITY.COMING_SOON,
            destinationUrl: "https://www.amazon.com/dp/B0H8YL3L5L",
        }),
        false,
    );
    assert.equal(
        canShowPurchaseCta({
            availability: COMMERCE_AVAILABILITY.IN_DEVELOPMENT,
            destinationUrl: "https://example.com",
        }),
        false,
    );
    assert.equal(isSafeExternalCommerceUrl("https://www.amazon.com/dp/B0H8YL3L5L"), true);
    assert.equal(isSafeExternalCommerceUrl("javascript:alert(1)"), false);
    assert.equal(isSafeExternalCommerceUrl("http://www.amazon.com/dp/B0H8YL3L5L"), false);
    assert.equal(
        canShowPurchaseCta({
            availability: COMMERCE_AVAILABILITY.AVAILABLE,
            destinationUrl: "javascript:alert(1)",
        }),
        false,
    );
    const beyond = getCommerceEntityForBook(getBookBySlug("beyond-the-last-light"));
    assert.equal(beyond.availability, COMMERCE_AVAILABILITY.COMING_SOON);
    assert.equal(beyond.destinationUrl, null);
    assert.equal(isPurchasable(getBookBySlug("beyond-the-last-light")), false);
    pass("availability behavior (AVAILABLE vs COMING_SOON / IN_DEVELOPMENT)");
} catch (error) {
    fail(`availability: ${error.message}`);
}

// --- active destinations ---
try {
    const active = getActiveCommercialDestinations();
    assert.equal(active.length, 1);
    assert.equal(active[0].slug, "the-southeast-asian-table");
    assert.ok(getAllCommerceEntities().length >= 8);
    pass("active commercial destinations + catalog size");
} catch (error) {
    fail(`destinations: ${error.message}`);
}

// --- Amazon outbound path / no fake purchase event ---
try {
    assert.match(analyticsSource, /commerce_outbound_click/);
    assert.match(analyticsSource, /commerce_cta_click/);
    assert.match(analyticsSource, /book_external_purchase_click/);
    assert.match(analyticsSource, /RESERVED_COMMERCE_EVENTS/);
    assert.doesNotMatch(analyticsSource, /trackEvent\(\s*["']purchase["']/);
    assert.doesNotMatch(analyticsSource, /trackEvent\(\s*["']begin_checkout["']/);
    assert.doesNotMatch(analyticsSource, /trackEvent\(\s*["']subscribe["']/);
    assert.match(ctaSource, /trackCommerceOutboundClick/);
    assert.match(ctaSource, /trackBookExternalPurchaseClick/);
    assert.match(ctaSource, /noopener,noreferrer|EXTERNAL_COMMERCE_REL/);
    pass("Amazon outbound analytics path + no fake purchase/checkout/subscribe fire");
} catch (error) {
    fail(`outbound analytics: ${error.message}`);
}

// --- affiliate / sponsored disclosure gating ---
try {
    assert.match(affiliateDisclosureSource, /if \(!visible\) return null/);
    assert.match(affiliateDisclosureSource, /data-ftc-disclosure/);
    assert.equal(shouldShowSponsoredDisclosure(null), false);
    assert.equal(shouldShowSponsoredDisclosure({ sponsored: true, sponsorName: "X" }), false);
    assert.equal(
        shouldShowSponsoredDisclosure({
            sponsored: true,
            sponsorName: "Acme",
            sponsorUrl: "https://example.com",
        }),
        true,
    );
    assert.equal(normalizeSponsorMeta({ sponsored: false }), null);
    const seat = getCommerceEntityForBook(getBookBySlug("the-southeast-asian-table"));
    assert.equal(seat.affiliateDisclosureRequired, false);
    pass("affiliate + sponsored disclosure gating");
} catch (error) {
    fail(`disclosure gating: ${error.message}`);
}

// --- newsletter attribution / no PII ---
try {
    const cleaned = sanitizeCommerceAnalyticsParams({
        entity_slug: "the-southeast-asian-table",
        email: "person@example.com",
        name: "Ada",
        phone: "555",
        placement: "book_detail",
    });
    assert.equal(cleaned.email, undefined);
    assert.equal(cleaned.name, undefined);
    assert.equal(cleaned.phone, undefined);
    assert.equal(cleaned.entity_slug, "the-southeast-asian-table");
    assert.match(analyticsSource, /commerce_lead_start/);
    assert.match(analyticsSource, /commerce_lead_complete/);
    assert.match(bookDetailSource, /placement="book_detail"/);
    assert.match(bookDetailSource, /Join Updates/);
    assert.match(newsletterSignupSource, /result\?\.status !== "created"/);
    assert.match(newsletterSignupSource, /trackCommerceLeadComplete/);
    pass("newsletter attribution + PII sanitization");
} catch (error) {
    fail(`newsletter/PII: ${error.message}`);
}

// --- no unauthenticated monetization-admin surface ---
try {
    assert.doesNotMatch(appSource, /MonetizationAdmin/);
    assert.doesNotMatch(appSource, /monetization-admin/);
    assert.doesNotMatch(seoConfigSource, /monetization-admin/);
    assert.doesNotMatch(robotsSource, /monetization-admin/);
    pass("monetization-admin public route removed (Option A)");
} catch (error) {
    fail(`admin surface: ${error.message}`);
}

// --- subscriptions / ads remain inert ---
try {
    assert.ok(subscriptionPlans.every((plan) => plan.price === null));
    assert.ok(subscriptionPlans.every((plan) => !isSubscriptionPlanPurchasable(plan)));
    assert.equal(advertisingConfig.networkStatus, "NOT_INSTALLED");
    assert.equal(shouldRenderAdPlacement(), false);
    pass("subscription prices null + ads not rendering");
} catch (error) {
    fail(`future commerce inert: ${error.message}`);
}

// --- safe external rel constants ---
try {
    assert.equal(EXTERNAL_COMMERCE_REL, "noopener noreferrer");
    assert.match(AFFILIATE_COMMERCE_REL, /sponsored/);
    assert.match(ctaSource, /EXTERNAL_COMMERCE_REL|AFFILIATE_COMMERCE_REL/);
    assert.match(ctaSource, /target="_blank"/);
    assert.doesNotMatch(ctaSource, /window\.open\s*\(/);
    pass("safe external-link rel attributes");
} catch (error) {
    fail(`rel attributes: ${error.message}`);
}

// --- trust: no invented SEAT price/offers in detail schema ---
try {
    assert.doesNotMatch(bookDetailSource, /"@type":\s*"Offer"/);
    assert.doesNotMatch(bookDetailSource, /bestseller|limited stock|selling fast/i);
    assert.ok(booksCatalog.every((book) => !book.price));
    pass("structured data / trust: no fake offers or urgency copy in book detail");
} catch (error) {
    fail(`trust/schema: ${error.message}`);
}

if (!process.exitCode) {
    console.log("\nAll monetization foundation checks passed.");
}
