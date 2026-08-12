#!/usr/bin/env node
/**
 * Phase 12 — commerce platform architecture tests (hardened).
 */

import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as commerce from "../src/data/commerce/index.js";
import { booksCatalog, isPurchasable } from "../src/data/booksCatalog.js";
import {
    getCommerceEntityForBook,
    getActiveCommercialDestinations,
} from "../src/data/commerceCatalog.js";
import { canShowPurchaseCta } from "../src/data/commerceModels.js";
import { collectSitemapEntries } from "../src/data/seoConfig.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
let failed = 0;

function pass(msg) {
    console.log(`PASS: ${msg}`);
}
function fail(msg) {
    failed += 1;
    console.error(`FAIL: ${msg}`);
}

try {
    assert.equal(commerce.COMMERCE_PLATFORM_PHASE, "12.0");
    assert.ok(commerce.RECORD_KIND_LIST.includes("architecture_placeholder"));
    assert.ok(commerce.FORBIDDEN_COMMERCE_ANALYTICS_EVENTS.includes("purchase"));
    assert.ok(commerce.FORBIDDEN_COMMERCE_ANALYTICS_EVENTS.includes("begin_checkout"));
    pass("platform constants");
} catch (error) {
    fail(`constants: ${error.message}`);
}

try {
    const customer = commerce.createArchitectureFixtureCustomer();
    assert.equal(customer.isProductionAccount, false);
    assert.equal(customer.isArchitectureFixture, true);
    assert.equal(customer.isAuthenticatedIdentity, false);
    assert.equal(customer.email, null);
    assert.equal(customer.passwordHash, null);
    assert.equal(customer.cardData, null);
    assert.equal(customer.authToken, null);
    assert.equal(commerce.listCustomers().length, 0);
    assert.throws(() =>
        commerce.createCustomerRecord({
            customerId: "x",
            displayName: "Nope",
            isProductionAccount: true,
        }),
    );
    assert.throws(() =>
        commerce.createCustomerRecord({
            customerId: "x",
            displayName: "Nope",
            passwordHash: "secret",
        }),
    );
    assert.throws(() =>
        commerce.createCustomerRecord({
            customerId: "x",
            displayName: "Nope",
            isArchitectureFixture: true,
            email: "person@example.com",
        }),
    );
    assert.equal(commerce.trustUserSuppliedCustomerId("x"), false);
    assert.equal(commerce.isAuthenticatedCommercePrincipal({ customerId: "x" }), false);
    pass("customer safety + identity boundary");
} catch (error) {
    fail(`customer: ${error.message}`);
}

try {
    const products = commerce.listCommerceProducts();
    assert.equal(products.length, 16);
    assert.equal(commerce.validateCommerceProductCatalog().ok, true);
    assert.ok(products.every((p) => p.commerceEligible === false));
    assert.ok(products.every((p) => p.futurePricePlaceholder === null));
    assert.ok(products.every((p) => p.checkoutUrl === null));
    assert.ok(products.every((p) => !commerce.canOfferHostedCheckout(p)));
    assert.equal(commerce.countActiveCommercialInventory(), 0);
    assert.throws(() =>
        commerce.createCommerceProduct({
            id: "bad",
            name: "Bad",
            category: "book",
            availability: "UNAVAILABLE",
            ownershipType: "purchase",
            launchStatus: "concept",
            commerceEligible: true,
        }),
    );

    for (const book of booksCatalog) {
        const product = commerce.getCommerceProductById(`commerce-${book.id}`);
        assert.ok(product, book.id);
        assert.equal(product.name, book.title);
        assert.equal(product.slug, book.slug);
        assert.equal(product.availability, book.releaseStatus);
        assert.equal(product.heroImage, book.cover);
        const phase11 = getCommerceEntityForBook(book);
        assert.equal(product.availability, phase11.availability);
    }

    for (const id of [
        "commerce-app-poisonguard",
        "commerce-app-stagescout",
        "commerce-app-studynest",
        "commerce-app-real-estate",
        "commerce-app-techmate",
        "commerce-app-kiddo",
    ]) {
        assert.ok(commerce.getCommerceProductById(id), id);
    }

    const seat = commerce.getCommerceProductBySlug("the-southeast-asian-table");
    assert.equal(seat.availability, "AVAILABLE");
    assert.equal(seat.commerceEligible, false);
    pass("catalog consistency + fail-closed commerceEligible");
} catch (error) {
    fail(`catalog: ${error.message}`);
}

try {
    const placeholders = commerce.listArchitecturePlaceholders();
    assert.ok(placeholders.length >= 6);
    assert.ok(
        placeholders.every(
            (p) =>
                p.recordKind === "architecture_placeholder" &&
                p.isPublicSurface === false &&
                p.availability === "UNAVAILABLE" &&
                p.commerceEligible === false,
        ),
    );
    const publicList = commerce.listPublicCommerceProducts();
    assert.ok(publicList.every((p) => p.recordKind === "authoritative"));
    assert.ok(
        publicList.every((p) => !placeholders.some((ph) => ph.id === p.id)),
    );
    pass("placeholder isolation");
} catch (error) {
    fail(`placeholders: ${error.message}`);
}

try {
    assert.equal(commerce.ENTITLEMENT_STORE.length, 0);
    assert.equal(commerce.validateEntitlementStore().ok, true);
    assert.equal(
        commerce.customerHasProductAccess(
            "arch-fixture-customer-001",
            "commerce-app-poisonguard",
        ),
        false,
    );
    const pending = commerce.ENTITLEMENT_ARCHITECTURE_EXAMPLES[0];
    assert.equal(pending.status, "pending");
    assert.equal(
        commerce.customerHasProductAccess(pending.customerId, pending.productId, [
            pending,
        ]),
        false,
    );
    const active = commerce.createEntitlement({
        entitlementId: "test-active",
        customerId: "arch-fixture-customer-001",
        productId: "commerce-app-poisonguard",
        status: commerce.ENTITLEMENT_STATUS.ACTIVE,
        kind: commerce.ENTITLEMENT_KINDS.ACCESS,
    });
    assert.equal(
        commerce.storeHasActiveEntitlementRecord(
            active.customerId,
            active.productId,
            [active],
        ),
        true,
    );
    assert.equal(
        commerce.customerHasProductAccess(active.customerId, active.productId, [
            active,
        ]),
        false,
        "ACTIVE store row still denied without auth",
    );
    assert.equal(
        commerce.evaluateProductAccess({
            customerId: "arch-fixture-customer-001",
            productId: "commerce-unknown",
            entitlements: [active],
            authenticated: true,
        }).allowed,
        false,
    );
    assert.equal(
        commerce.evaluateProductAccess({
            customerId: "arch-fixture-customer-001",
            productId: "commerce-app-poisonguard",
            entitlements: [],
            authenticated: false,
        }).reason,
        "authentication_required",
    );
    assert.equal(commerce.relationshipGrantsEntitlement("commerce-app-poisonguard"), false);
    assert.equal(commerce.amazonOutboundClickGrantsOwnership(), false);
    assert.equal(commerce.newsletterSubscriptionIsPaidEntitlement(), false);
    pass("entitlement fail-closed + negative cases");
} catch (error) {
    fail(`entitlements: ${error.message}`);
}

try {
    assert.equal(commerce.LICENSE_STORE.length, 0);
    for (const state of ["expired", "pending", "suspended", "cancelled", "active"]) {
        const license =
            state === "active"
                ? Object.freeze({
                      ...commerce.createLicense({
                          licenseId: `L-${state}`,
                          customerId: "c1",
                          productId: "commerce-app-poisonguard",
                          state: "pending",
                      }),
                      state: "active",
                      activated: false,
                  })
                : commerce.createLicense({
                      licenseId: `L-${state}`,
                      customerId: "c1",
                      productId: "commerce-app-poisonguard",
                      state,
                  });
        assert.equal(commerce.licenseGrantsAccess(license), false, state);
    }
    assert.throws(() =>
        commerce.createLicense({
            licenseId: "L1",
            customerId: "c1",
            productId: "p1",
            activated: true,
        }),
    );
    pass("licensing denial for non-qualified states");
} catch (error) {
    fail(`licensing: ${error.message}`);
}

try {
    const rels = commerce.listProductRelationships();
    assert.equal(rels.length, 8);
    assert.equal(commerce.validateProductRelationships().ok, true);
    assert.ok(rels.every((r) => r.grantsEntitlement === false));
    assert.ok(rels.every((r) => r.grantsOwnership === false));
    pass("relationships do not grant entitlement/ownership");
} catch (error) {
    fail(`relationships: ${error.message}`);
}

try {
    const customer = commerce.createArchitectureFixtureCustomer();
    const dash = commerce.buildCustomerDashboard(customer);
    assert.equal(dash.paymentsEnabled, false);
    assert.equal(dash.checkoutEnabled, false);
    const invoices = dash.sections.find((s) => s.key === "invoices");
    const receipts = dash.sections.find((s) => s.key === "receipts");
    assert.equal(invoices.status, "placeholder");
    assert.equal(receipts.data.items.length, 0);
    assert.ok(
        !dash.sections
            .find((s) => s.key === "books")
            .data.catalogPreview.some((p) => p.recordKind === "architecture_placeholder"),
    );
    const admin = commerce.validateCommerceAdminFoundation();
    assert.equal(admin.ok, true, admin.errors.join("; "));
    assert.equal(admin.summary.revenueSummary.unavailable, true);
    assert.equal(admin.summary.activeSubscriptionCount, 0);
    assert.equal(admin.summary.publicAdminUi, false);
    pass("dashboard/admin architecture safety");
} catch (error) {
    fail(`dashboard: ${error.message}`);
}

try {
    // SEAT external retail remains Phase 11 outbound — not Phase 12 ownership.
    const seatBook = booksCatalog.find((b) => b.slug === "the-southeast-asian-table");
    assert.equal(isPurchasable(seatBook), true);
    assert.match(seatBook.externalUrl, /amazon\.com\/dp\/B0H8YL3L5L/);
    const seatEntity = getCommerceEntityForBook(seatBook);
    assert.equal(seatEntity.affiliateEnabled, false);
    assert.equal(seatEntity.destinationType, "EXTERNAL_RETAILER");
    assert.equal(
        canShowPurchaseCta({
            availability: seatEntity.availability,
            destinationUrl: seatEntity.destinationUrl,
        }),
        true,
    );
    const seatPlatform = commerce.getCommerceProductBySlug("the-southeast-asian-table");
    assert.equal(seatPlatform.commerceEligible, false);
    assert.equal(commerce.amazonOutboundClickGrantsOwnership(), false);
    assert.ok(
        getActiveCommercialDestinations().some(
            (e) => e.slug === "the-southeast-asian-table",
        ),
    );
    pass("SEAT Amazon external retail unchanged / not ownership");
} catch (error) {
    fail(`seat: ${error.message}`);
}

try {
    const sitemapBlob = collectSitemapEntries().map((e) => e.loc).join("\n");
    for (const needle of [
        "ai-foundations-course",
        "prompt-packs",
        "cinnova-membership",
        "family-safety-bundle",
        "customer-dashboard",
        "commerce-admin",
    ]) {
        assert.equal(sitemapBlob.includes(needle), false, needle);
    }
    const app = readFileSync(join(root, "src/App.jsx"), "utf8");
    assert.equal(/CommerceAdmin|CustomerDashboard/.test(app), false);
    assert.equal(existsSync(join(root, "src/pages/CommerceAdmin.jsx")), false);
    assert.equal(existsSync(join(root, "src/pages/CustomerDashboard.jsx")), false);
    pass("no sitemap/public route leakage for placeholders or dashboards");
} catch (error) {
    fail(`seo-routes: ${error.message}`);
}

try {
    const analytics = readFileSync(join(root, "src/utils/analytics.js"), "utf8");
    for (const event of commerce.FORBIDDEN_COMMERCE_ANALYTICS_EVENTS) {
        assert.equal(
            new RegExp(`trackEvent\\(\\s*["']${event}["']`).test(analytics),
            false,
            event,
        );
    }
    const indexHtml = readFileSync(join(root, "index.html"), "utf8");
    assert.match(indexHtml, /VITE_GA_MEASUREMENT_ID/);
    pass("no commercial analytics events; GA env hook unchanged");
} catch (error) {
    fail(`analytics: ${error.message}`);
}

try {
    const platform = commerce.validateCommercePlatform();
    assert.equal(platform.ok, true, platform.errors.join("; "));
    pass("aggregate commerce platform validation");
} catch (error) {
    fail(`platform: ${error.message}`);
}

try {
    for (const doc of [
        "docs/COMMERCE_PLATFORM.md",
        "docs/CUSTOMER_MODEL.md",
        "docs/PRODUCT_MODEL.md",
        "docs/SUBSCRIPTION_MODEL.md",
        "docs/ENTITLEMENT_MODEL.md",
        "docs/LICENSING_MODEL.md",
        "docs/COMMERCE_ROADMAP.md",
    ]) {
        const text = readFileSync(join(root, doc), "utf8");
        assert.match(text, /CURRENTLY IMPLEMENTED|ARCHITECTURE ONLY|BLOCKED UNTIL/i);
    }
    const roadmap = readFileSync(join(root, "docs/COMMERCE_ROADMAP.md"), "utf8");
    assert.match(roadmap, /undecided/i);
    assert.match(roadmap, /Stripe/);
    assert.match(roadmap, /does \*\*not\*\* mean|slots only|not integrated/i);
    pass("documentation status distinctions");
} catch (error) {
    fail(`docs: ${error.message}`);
}

if (failed > 0) {
    console.error(`\nCommerce tests failed (${failed}).`);
    process.exit(1);
}
console.log("\nAll commerce platform tests passed.");
