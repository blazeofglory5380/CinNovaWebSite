/**
 * Phase M2 revenue activation readiness tests.
 * Run: npm run test:monetization-m2
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

const paymentMode = await import(
    pathToFileURL(join(root, "src/data/commerce/platform/paymentMode.js")).href
);
const pricing = await import(
    pathToFileURL(join(root, "src/data/commerce/platform/serverPricing.js")).href
);
const harness = await import(
    pathToFileURL(join(root, "src/data/commerce/platform/testTransactionHarness.js")).href
);
const onboarding = await import(
    pathToFileURL(join(root, "src/data/affiliate/affiliateOnboarding.js")).href
);
const priority = await import(
    pathToFileURL(join(root, "src/data/affiliate/affiliatePriority.js")).href
);
const ads = await import(pathToFileURL(join(root, "src/data/adSafetyZones.js")).href);
const legal = await import(pathToFileURL(join(root, "src/data/legalActivationMatrix.js")).href);
const tax = await import(
    pathToFileURL(join(root, "src/data/commerce/platform/taxArchitecture.js")).href
);
const analytics = await import(
    pathToFileURL(join(root, "src/data/commerce/platform/revenueAnalytics.js")).href
);
const webhook = await import(
    pathToFileURL(join(root, "src/data/commerce/platform/webhookArchitecture.js")).href
);
const providers = await import(
    pathToFileURL(join(root, "src/data/commerce/platform/providers.js")).href
);

try {
    assert.equal(paymentMode.resolvePaymentMode({}), paymentMode.PAYMENT_MODES.UNCONFIGURED);
    assert.equal(
        paymentMode.resolvePaymentMode({
            CINNOVA_PAYMENTS_MODE: "LIVE",
            CINNOVA_LIVE_PAYMENTS_APPROVED: "false",
            STRIPE_SECRET_KEY: "sk_live_x",
        }),
        paymentMode.PAYMENT_MODES.LIVE_DISABLED,
    );
    assert.equal(
        paymentMode.resolvePaymentMode({
            CINNOVA_PAYMENTS_MODE: "LIVE",
            CINNOVA_LIVE_PAYMENTS_APPROVED: "true",
            STRIPE_SECRET_KEY: "sk_live_x",
        }),
        paymentMode.PAYMENT_MODES.LIVE,
    );
    assert.equal(
        paymentMode.resolvePaymentMode({
            STRIPE_SECRET_KEY: "sk_test_abc",
        }),
        paymentMode.PAYMENT_MODES.TEST,
    );
    assert.equal(paymentMode.RECOMMENDED_PRIMARY_PROVIDER, "stripe");
    assert.equal(providers.getRecommendedPrimaryProvider(), "stripe");
    pass("payment mode gates + Stripe recommendation");
} catch (error) {
    fail(`payment mode: ${error.message}`);
}

try {
    pricing.clearEphemeralTestPrices();
    pricing.registerEphemeralTestPrice({
        productId: "test-digital-pack",
        unitAmountCents: 500,
    });
    const rejected = pricing.quoteServerCheckout({
        items: [{ productId: "test-digital-pack", quantity: 1 }],
        clientTotal: 1,
        paymentMode: paymentMode.PAYMENT_MODES.TEST,
    });
    assert.equal(rejected.error, "CLIENT_PRICE_REJECTED");
    const badQty = pricing.quoteServerCheckout({
        items: [{ productId: "test-digital-pack", quantity: 0 }],
        paymentMode: paymentMode.PAYMENT_MODES.TEST,
    });
    assert.equal(badQty.error, "INVALID_QUANTITY");
    const liveTax = pricing.quoteServerCheckout({
        items: [{ productId: "test-digital-pack", quantity: 1 }],
        paymentMode: paymentMode.PAYMENT_MODES.LIVE,
        taxConfigured: false,
    });
    assert.equal(liveTax.error, "TAX_BLOCKS_LIVE");
    const ok = pricing.quoteServerCheckout({
        items: [{ productId: "test-digital-pack", quantity: 2 }],
        paymentMode: paymentMode.PAYMENT_MODES.TEST,
        taxConfigured: true,
        taxCents: 0,
        couponCode: "SAVE",
        serverCouponRecord: { code: "SAVE", discountCents: 100 },
    });
    assert.equal(ok.ok, true);
    assert.equal(ok.quote.subtotalCents, 1000);
    assert.equal(ok.quote.discountCents, 100);
    assert.equal(ok.quote.totalCents, 900);
    assert.equal(ok.quote.serverAuthoritative, true);
    pass("server-authoritative pricing");
} catch (error) {
    fail(`pricing: ${error.message}`);
}

try {
    assert.equal(webhook.browserRedirectAloneMarksPaid(), false);
    assert.equal(tax.getTaxReadinessReport().liveBlocked, true);
    assert.equal(legal.anyDocumentMarkedReady(), false);
    assert.ok(legal.listLivePaymentLegalBlockers().length > 0);
    pass("webhook/tax/legal gates");
} catch (error) {
    fail(`gates: ${error.message}`);
}

try {
    assert.equal(
        ads.mayRenderAdOrSponsorship({
            zone: "poisonguard_scanner_safety_result",
            adsEnabled: true,
        }).allowed,
        false,
    );
    assert.equal(
        ads.mayRenderAdOrSponsorship({
            zone: "checkout_payment_forms",
            sponsorshipsEnabled: true,
        }).allowed,
        false,
    );
    pass("ad safety zones");
} catch (error) {
    fail(`ads: ${error.message}`);
}

try {
    const rows = onboarding.buildAffiliateOnboardingTracker();
    assert.ok(rows.length > 10);
    const summary = onboarding.summarizeAffiliateOnboarding(rows);
    assert.equal(summary.ACTIVE, 0);
    assert.equal(summary.withAffiliateId, 0);
    assert.equal(onboarding.assertNoApprovedWithoutEvidence(rows).ok, true);
    assert.equal(
        onboarding.assertAffiliateIdSafeForPublic("PLACEHOLDER_ID").publicSafe,
        false,
    );
    assert.equal(
        onboarding.mayRenderMonetizedAffiliateUrl({
            globalAffiliatesEnabled: true,
            lifecycleStatus: "ACTIVE",
            activationStatus: "active",
            affiliateId: "TODO_AFFILIATE",
        }).ok,
        false,
    );
    const groups = priority.groupAffiliatePriorities();
    assert.ok(groups.HIGH_PRIORITY.length >= 3);
    assert.ok(groups.HIGH_PRIORITY.every((r) => r.partnershipImplied === false));
    pass("affiliate onboarding + priority + placeholder guard");
} catch (error) {
    fail(`affiliates: ${error.message}`);
}

try {
    analytics.clearRevenueAnalyticsStores();
    const a = analytics.recordRevenueFunnelEvent({
        eventName: "checkout_started",
        channel: analytics.REVENUE_DATA_CHANNELS.TEST,
        params: { productId: "x", cardNumber: "4111" },
    });
    assert.equal(a.ok, true);
    assert.equal(a.entry.params.cardNumber, undefined);
    const snap = analytics.getRevenueChannelSnapshot(analytics.REVENUE_DATA_CHANNELS.TEST);
    assert.equal(snap.combinedWithOthers, false);
    pass("revenue analytics channel separation + sanitize");
} catch (error) {
    fail(`analytics: ${error.message}`);
}

try {
    const report = harness.runTestTransactionHarness({
        env: {},
        simulateProvider: true,
    });
    assert.equal(report.fabricatedPassingTransaction, false);
    assert.equal(report.ok, true, JSON.stringify(report.results.filter((r) => !r.ok), null, 2));
    assert.ok(report.results.some((r) => r.name === "provider_live_charge" && r.status === "SKIP"));
    pass("test transaction harness");
} catch (error) {
    fail(`harness: ${error.message}`);
}

try {
    const decision = readFileSync(join(root, "docs/PAYMENT_PROVIDER_DECISION_M2.md"), "utf8");
    const checklist = readFileSync(join(root, "docs/FIRST_REVENUE_ACTIVATION_CHECKLIST.md"), "utf8");
    assert.match(decision, /Stripe/);
    assert.match(checklist, /CINNOVA_LIVE_PAYMENTS_APPROVED/);
    assert.match(checklist, /Tax configured/);
    pass("docs present");
} catch (error) {
    fail(`docs: ${error.message}`);
}

try {
    const apiCheckout = readFileSync(
        join(root, "api/commerce/create-checkout-session.js"),
        "utf8",
    );
    assert.match(apiCheckout, /CLIENT_PRICE_REJECTED/);
    assert.doesNotMatch(apiCheckout, /sk_live_/);
    assert.doesNotMatch(apiCheckout, /sk_test_[A-Za-z0-9]{10,}/);
    pass("API stub fail-closed / no secrets");
} catch (error) {
    fail(`api: ${error.message}`);
}

if (process.exitCode) {
    console.error("\nMonetization M2 tests failed.");
} else {
    console.log("\nAll monetization M2 tests passed.");
}
