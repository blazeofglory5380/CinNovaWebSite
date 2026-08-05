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

/* ────────────────────────────────────────────────────────────────────────────
   Phase 11 revenue pages + unified-architecture guarantees.

   A second revenue effort was developed in parallel against a stale base. These
   assertions fail the build if a duplicate partner registry, a second affiliate
   feature flag, a second outbound-link resolution path, or a duplicate
   disclosure component is ever reintroduced alongside the platform on main.
   ──────────────────────────────────────────────────────────────────────────── */

const { PUBLIC_PAGE_ROUTES, PHASE_2B_PAGE_ROUTES, REVENUE_PAGE_ROUTES, getPublicPagePath } =
    await import(pathToFileURL(join(root, "src/data/publicPageRoutes.js")).href);
const { legalDocuments, getLegalIndex, LEGAL_PAGE_KEYS } = await import(
    pathToFileURL(join(root, "src/data/legalCenter.js")).href
);
const {
    NEWSLETTER_CATEGORY_KEYS,
    NEWSLETTER_PREMIUM,
    newsletterArchive,
    normalizePreferences,
    getDefaultCategoryKeys,
} = await import(pathToFileURL(join(root, "src/data/newsletterProgram.js")).href);
const { downloadableAssets, buildAssetContent } = await import(
    pathToFileURL(join(root, "src/data/brandAssets.js")).href
);
const { readdirSync, existsSync } = await import("node:fs");

// ── Exactly one affiliate architecture ──────────────────────────────────────
try {
    // 1. One partner registry.
    for (const dup of ["src/data/affiliateCenter.js", "src/data/partnerCatalog.js"]) {
        if (existsSync(join(root, dup))) throw new Error(`duplicate partner catalog present: ${dup}`);
    }
    if (!existsSync(join(root, "src/data/affiliate/partnerRegistry.js"))) {
        throw new Error("canonical partner registry is missing");
    }
    pass("affiliate: exactly one partner registry");

    // 2. One feature flag. The hard-coded Phase 11 constant must not return.
    const affiliateSources = readdirSync(join(root, "src/data/affiliate"))
        .filter((file) => file.endsWith(".js"))
        .map((file) => readFileSync(join(root, "src/data/affiliate", file), "utf8"))
        .join("\n");
    if (affiliateSources.includes("AFFILIATE_PROGRAM_ENABLED")) {
        throw new Error("hard-coded AFFILIATE_PROGRAM_ENABLED flag reintroduced");
    }
    if (!affiliateSources.includes("VITE_AFFILIATES_ENABLED")) {
        throw new Error("VITE_AFFILIATES_ENABLED gate is missing");
    }
    pass("affiliate: exactly one feature flag (VITE_AFFILIATES_ENABLED)");

    // 3. One outbound-link resolution path, one disclosure component.
    if (existsSync(join(root, "src/components/affiliate"))) {
        throw new Error("duplicate src/components/affiliate directory present");
    }
    const resolvers = readdirSync(join(root, "src/data/affiliate")).filter((file) =>
        file.toLowerCase().includes("resolvepartnerlink"),
    );
    if (resolvers.length !== 1) throw new Error(`expected 1 partner link resolver, found ${resolvers.length}`);
    const commerceComponents = readdirSync(join(root, "src/components/commerce"));
    const outbound = commerceComponents.filter((file) => file.endsWith("OutboundLink.jsx"));
    if (outbound.length !== 1) throw new Error(`expected 1 outbound-link component, found ${outbound.length}`);
    const disclosures = commerceComponents.filter((file) => file === "AffiliateDisclosure.jsx");
    if (disclosures.length !== 1) throw new Error(`expected 1 disclosure component, found ${disclosures.length}`);
    pass("affiliate: one resolver, one outbound-link component, one disclosure component");

    // 4. No placeholder affiliate identifier anywhere in the affiliate source.
    if (affiliateSources.includes("AFFILIATE_ID_PLACEHOLDER")) {
        throw new Error("affiliate placeholder token present in source");
    }
    pass("affiliate: no placeholder affiliate identifier in source");
} catch (error) {
    fail(`affiliate architecture: ${error.message}`);
}

// ── Phase 11 revenue page registration ──────────────────────────────────────
try {
    if (PHASE_2B_PAGE_ROUTES.length !== 50) {
        throw new Error(`Phase 2B route count drifted: ${PHASE_2B_PAGE_ROUTES.length}`);
    }
    // 3 company + 2 newsletter + 1 legal index + 6 legal documents.
    if (REVENUE_PAGE_ROUTES.length !== 12) {
        throw new Error(`expected 12 Phase 11 revenue pages, found ${REVENUE_PAGE_ROUTES.length}`);
    }
    if (PHASE_2B_PAGE_ROUTES.length + REVENUE_PAGE_ROUTES.length !== PUBLIC_PAGE_ROUTES.length) {
        throw new Error("every route must belong to exactly one phase");
    }
    for (const key of [
        "press-kit",
        "brand-assets",
        "contact-sales",
        "newsletter-archive",
        "newsletter-preferences",
        "legal",
    ]) {
        if (!getPublicPagePath(key)) throw new Error(`route not registered: ${key}`);
    }
    pass(`revenue pages: ${REVENUE_PAGE_ROUTES.length} registered, Phase 2B invariant intact`);
} catch (error) {
    fail(`revenue routes: ${error.message}`);
}

// ── Legal Center ────────────────────────────────────────────────────────────
try {
    if (legalDocuments.length !== 6) {
        throw new Error(`expected 6 legal documents, found ${legalDocuments.length}`);
    }
    for (const doc of legalDocuments) {
        if (!LEGAL_PAGE_KEYS.has(doc.pageKey)) throw new Error(`${doc.pageKey} missing from LEGAL_PAGE_KEYS`);
        if (getPublicPagePath(doc.pageKey) !== `/legal/${doc.slug}`) {
            throw new Error(`${doc.pageKey} route path does not match its slug`);
        }
        if (doc.sections.length < 4) throw new Error(`${doc.key} has fewer than four sections`);
        for (const section of doc.sections) {
            if (!section.heading || !section.heading.trim()) {
                throw new Error(`${doc.key} has an unheaded section`);
            }
            if (!(section.body || []).length && !(section.list || []).length) {
                throw new Error(`${doc.key} section "${section.heading}" is empty`);
            }
        }
    }
    if (getLegalIndex().length !== legalDocuments.length + 2) {
        throw new Error("legal index must also list privacy and terms");
    }
    // The disclosure must describe the architecture that actually ships.
    const disclosureText = JSON.stringify(legalDocuments.find((doc) => doc.key === "affiliate-disclosure"));
    if (disclosureText.includes("no link on this site carries affiliate tracking")) {
        throw new Error("affiliate disclosure still describes the removed Phase 11 flag model");
    }
    if (!disclosureText.includes("two independent conditions")) {
        throw new Error("affiliate disclosure must describe the dual-gate activation model");
    }
    pass("legal center: 6 documents registered, disclosure matches the live architecture");
} catch (error) {
    fail(`legal center: ${error.message}`);
}

// ── Newsletter program ──────────────────────────────────────────────────────
try {
    if (newsletterArchive.length !== 0) throw new Error("archive must not claim issues it has not sent");
    if (NEWSLETTER_PREMIUM.enabled !== false) throw new Error("premium tier must not be enabled");
    const bogus = normalizePreferences({ categories: ["nope"], frequency: "hourly", format: "fax" });
    if (bogus.frequency !== "as-published" || bogus.format !== "rich") {
        throw new Error("preference normalisation did not fall back safely");
    }
    for (const key of getDefaultCategoryKeys()) {
        if (!NEWSLETTER_CATEGORY_KEYS.includes(key)) throw new Error(`default ${key} is not a real category`);
    }
    pass("newsletter: archive honest, premium disabled, preferences normalise safely");
} catch (error) {
    fail(`newsletter: ${error.message}`);
}

// ── Brand + press assets ────────────────────────────────────────────────────
try {
    if (!downloadableAssets.length) throw new Error("no downloadable assets defined");
    for (const asset of downloadableAssets) {
        const body = buildAssetContent(asset.key).join("\n");
        if (body.length < 200) throw new Error(`${asset.key} asset body is suspiciously short`);
        if (body.includes("No asset is defined")) throw new Error(`${asset.key} has no content builder`);
    }
    pass(`brand assets: ${downloadableAssets.length} downloadable assets generate real content`);
} catch (error) {
    fail(`brand assets: ${error.message}`);
}

if (!process.exitCode) {
    console.log("\nAll monetization foundation checks passed.");
}
