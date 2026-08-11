/**
 * Phase M1 monetization completion tests.
 * Run: npm run test:monetization-m1
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
    MONETIZATION_FLAGS,
    getMonetizationActivationReport,
    isCheckoutLive,
    isStoreLive,
    isAffiliateLive,
} = await import(pathToFileURL(join(root, "src/data/monetizationFlags.js")).href);

const {
    assertCheckoutAllowed,
    beginCheckoutArchitecture,
    completePurchaseArchitecture,
    createEmptyCart,
} = await import(
    pathToFileURL(join(root, "src/data/commerce/platform/checkoutArchitecture.js")).href
);

const {
    createSignedDownloadGrant,
    DIGITAL_DELIVERY_RULES,
} = await import(
    pathToFileURL(join(root, "src/data/commerce/platform/digitalDelivery.js")).href
);

const { getRevenueDashboardModel } = await import(
    pathToFileURL(join(root, "src/data/commerce/platform/revenueDashboard.js")).href
);

const { toPartnerLifecycleStatus, PARTNER_LIFECYCLE_STATUSES } = await import(
    pathToFileURL(join(root, "src/data/affiliate/partnerLifecycle.js")).href
);

const { getLegalDocument, ATTORNEY_REVIEW_STATUS, listLegalDocuments } = await import(
    pathToFileURL(join(root, "src/data/legalDocuments.js")).href
);

const {
    getPublicPageKeyFromPath,
    getPublicPagePath,
    PUBLIC_PATH_ALIASES,
} = await import(pathToFileURL(join(root, "src/data/publicPageRoutes.js")).href);

const { listMediaKitMetrics } = await import(
    pathToFileURL(join(root, "src/data/mediaKitMetrics.js")).href
);

const { canClaimAppAvailable, listAppPromos } = await import(
    pathToFileURL(join(root, "src/data/promoAppsCatalog.js")).href
);

const { formatMonetizationPrice, listMonetizationLocales } = await import(
    pathToFileURL(join(root, "src/data/monetizationI18n.js")).href
);

const { isAnyPaymentProviderConfigured } = await import(
    pathToFileURL(join(root, "src/data/commerce/platform/providers.js")).href
);

const pricingSource = readFileSync(join(root, "src/pages/Pricing.jsx"), "utf8");
const analyticsSource = readFileSync(join(root, "src/utils/analytics.js"), "utf8");
const appSource = readFileSync(join(root, "src/App.jsx"), "utf8");

try {
    assert.equal(MONETIZATION_FLAGS.store, false);
    assert.equal(MONETIZATION_FLAGS.checkout, false);
    assert.equal(MONETIZATION_FLAGS.payments, false);
    assert.equal(MONETIZATION_FLAGS.ads, false);
    assert.equal(MONETIZATION_FLAGS.premiumMembership, false);
    assert.equal(isCheckoutLive(), false);
    assert.equal(isStoreLive(), false);
    assert.equal(isAffiliateLive(), false);
    assert.equal(isAnyPaymentProviderConfigured(), false);
    const report = getMonetizationActivationReport();
    assert.equal(report.liveHostedPayments, false);
    pass("feature flags default fail-closed");
} catch (error) {
    fail(`flags: ${error.message}`);
}

try {
    const gate = assertCheckoutAllowed();
    assert.equal(gate.ok, false);
    assert.equal(gate.error, "CHECKOUT_DISABLED");
    const begin = beginCheckoutArchitecture({ cart: { items: [{ id: "x" }] } });
    assert.equal(begin.ok, false);
    assert.equal(begin.fakeSuccessForbidden, true);
    const done = completePurchaseArchitecture({ providerConfirmed: false });
    assert.equal(done.purchaseCompleted, false);
    assert.equal(createEmptyCart().items.length, 0);
    pass("checkout fail-closed / no fake success");
} catch (error) {
    fail(`checkout: ${error.message}`);
}

try {
    const grant = createSignedDownloadGrant({
        productId: "p1",
        customerId: "c1",
        serverValidatedEntitlement: false,
    });
    assert.equal(grant.ok, false);
    assert.equal(grant.url, null);
    assert.equal(DIGITAL_DELIVERY_RULES.noPublicRawPaidUrls, true);
    pass("digital delivery entitlement required");
} catch (error) {
    fail(`delivery: ${error.message}`);
}

try {
    const live = getRevenueDashboardModel({ includeDemo: false });
    assert.equal(live.demo, false);
    assert.equal(live.productRevenue, 0);
    const demo = getRevenueDashboardModel({ includeDemo: true });
    assert.equal(demo.demo, true);
    assert.equal(demo.label, "DEMO");
    pass("revenue dashboard live zeros / DEMO labeled");
} catch (error) {
    fail(`dashboard: ${error.message}`);
}

try {
    assert.equal(
        toPartnerLifecycleStatus({}),
        PARTNER_LIFECYCLE_STATUSES.NOT_APPLIED,
    );
    pass("partner lifecycle mapping");
} catch (error) {
    fail(`lifecycle: ${error.message}`);
}

try {
    assert.ok(getLegalDocument("affiliate-disclosure"));
    assert.equal(listLegalDocuments().length >= 8, true);
    assert.equal(
        getLegalDocument("refund-policy").attorneyReview,
        ATTORNEY_REVIEW_STATUS,
    );
    pass("legal documents present + attorney review flagged");
} catch (error) {
    fail(`legal: ${error.message}`);
}

try {
    assert.equal(getPublicPageKeyFromPath("/advertise"), "advertise");
    assert.equal(getPublicPagePath("advertise"), "/company/advertise");
    assert.equal(getPublicPageKeyFromPath("/contact-sales"), "contact-sales");
    assert.equal(getPublicPageKeyFromPath("/store"), "store");
    assert.ok(PUBLIC_PATH_ALIASES["/press"]);
    pass("route aliases + store paths");
} catch (error) {
    fail(`routes: ${error.message}`);
}

try {
    for (const m of listMediaKitMetrics()) {
        if (m.value == null) {
            assert.match(m.display, /Available on request/i);
        }
    }
    pass("media kit metrics honesty");
} catch (error) {
    fail(`media kit: ${error.message}`);
}

try {
    for (const app of listAppPromos()) {
        if (app.availability !== "AVAILABLE") {
            assert.equal(canClaimAppAvailable(app), false);
        }
    }
    pass("app promo no false availability claims");
} catch (error) {
    fail(`promo: ${error.message}`);
}

try {
    assert.ok(listMonetizationLocales().includes("hi"));
    assert.ok(listMonetizationLocales().includes("nb"));
    assert.match(formatMonetizationPrice(null, { locale: "en" }), /soon/i);
    pass("monetization i18n locales + null price");
} catch (error) {
    fail(`i18n: ${error.message}`);
}

try {
    assert.doesNotMatch(pricingSource, /\$9\.99/);
    assert.doesNotMatch(pricingSource, /\$4\.99/);
    assert.doesNotMatch(pricingSource, /\$14\.99/);
    assert.doesNotMatch(pricingSource, /\$29\/mo/);
    assert.doesNotMatch(pricingSource, /\$199\/mo/);
    assert.match(pricingSource, /Coming Soon|Planned|waitlist/i);
    pass("pricing page no invented dollar amounts");
} catch (error) {
    fail(`pricing honesty: ${error.message}`);
}

try {
    assert.match(analyticsSource, /affiliate_link_view/);
    assert.match(analyticsSource, /affiliate_link_click/);
    assert.match(analyticsSource, /partner_page_view/);
    assert.match(analyticsSource, /comparison_view/);
    assert.match(appSource, /AffiliateDisclosurePage/);
    assert.match(appSource, /CheckoutPage/);
    pass("analytics events + App wiring");
} catch (error) {
    fail(`wiring: ${error.message}`);
}

if (process.exitCode) {
    console.error("\nMonetization M1 tests failed.");
} else {
    console.log("\nAll monetization M1 tests passed.");
}
