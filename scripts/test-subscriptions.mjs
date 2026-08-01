#!/usr/bin/env node
/**
 * Phase 12 — subscription architecture tests.
 */

import assert from "node:assert/strict";
import * as commerce from "../src/data/commerce/index.js";

let failed = 0;
function pass(msg) {
    console.log(`PASS: ${msg}`);
}
function fail(msg) {
    failed += 1;
    console.error(`FAIL: ${msg}`);
}

try {
    assert.deepEqual(commerce.SUBSCRIPTION_TIER_LIST, [
        "FREE",
        "PLUS",
        "PRO",
        "FAMILY",
        "TEAM",
        "ENTERPRISE",
    ]);
    const tiers = commerce.listSubscriptionTier();
    assert.equal(tiers.length, 6);
    const free = commerce.getSubscriptionTierDefinition("FREE");
    const enterprise = commerce.getSubscriptionTierDefinition("ENTERPRISE");
    assert.ok(free.upgradePaths.includes("PRO"));
    assert.ok(enterprise.downgradePaths.includes("FREE"));
    assert.ok(enterprise.upgradePaths.length === 0);
    pass("subscription tiers + upgrade/downgrade paths");
} catch (error) {
    fail(`tiers: ${error.message}`);
}

try {
    const plans = commerce.listCommerceSubscriptionPlans();
    assert.ok(plans.length >= 8);
    assert.equal(commerce.validateSubscriptionArchitecture().ok, true);
    assert.ok(plans.every((p) => p.price === null));
    assert.ok(plans.every((p) => p.currency === null));
    assert.ok(plans.every((p) => p.billingProvider === null));
    assert.ok(plans.every((p) => p.activated === false));
    assert.ok(plans.every((p) => !commerce.isSubscriptionPlanPurchasable(p)));
    assert.ok(plans.every((p) => p.status !== commerce.SUBSCRIPTION_PLAN_STATUS.ACTIVE));
    pass("no purchasable / activated subscription plans");
} catch (error) {
    fail(`plans: ${error.message}`);
}

try {
    assert.throws(() =>
        commerce.createSubscriptionPlan({
            planId: "bad",
            productId: "commerce-app-poisonguard",
            title: "Bad",
            tier: "PRO",
            price: 9.99,
        }),
    );
    assert.throws(() =>
        commerce.createSubscriptionPlan({
            planId: "bad2",
            productId: "commerce-app-poisonguard",
            title: "Bad",
            tier: "PRO",
            activated: true,
        }),
    );
    assert.throws(() =>
        commerce.createSubscriptionPlan({
            planId: "bad3",
            productId: "commerce-app-poisonguard",
            title: "Bad",
            tier: "PRO",
            status: commerce.SUBSCRIPTION_PLAN_STATUS.ACTIVE,
        }),
    );
    pass("subscription factory rejects billing activation");
} catch (error) {
    fail(`factory: ${error.message}`);
}

try {
    const pg = commerce.listPlansForProduct("commerce-app-poisonguard");
    assert.ok(pg.some((p) => p.tier === "FREE"));
    assert.ok(pg.some((p) => p.tier === "PRO" || p.tier === "FAMILY"));
    assert.ok(commerce.getCommerceSubscriptionPlanById("studynest-pro"));
    assert.ok(commerce.getCommerceSubscriptionPlanById("stagescout-pro"));
    assert.ok(commerce.getCommerceSubscriptionPlanById("real-estate-pro"));
    pass("product-linked architecture plans present");
} catch (error) {
    fail(`product-plans: ${error.message}`);
}

try {
    // Phase 11 storefront plans remain architecture-only / non-purchasable.
    const legacy = await import("../src/data/subscriptionPlans.js");
    assert.ok(legacy.getSubscriptionPlans().every((p) => !legacy.isSubscriptionPlanPurchasable(p)));
    pass("legacy Phase 11 subscriptionPlans remain non-purchasable");
} catch (error) {
    fail(`legacy: ${error.message}`);
}

if (failed > 0) {
    console.error(`\nSubscription tests failed (${failed}).`);
    process.exit(1);
}
console.log("\nAll subscription architecture tests passed.");
