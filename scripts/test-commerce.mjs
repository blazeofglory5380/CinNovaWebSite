#!/usr/bin/env node
/**
 * Phase 12 — commerce platform architecture tests.
 */

import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as commerce from "../src/data/commerce/index.js";

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
    assert.deepEqual(commerce.PRODUCT_CATEGORY_LIST.slice().sort(), [
        "application",
        "book",
        "bundle",
        "course",
        "download",
        "membership",
        "resource",
        "service",
    ]);
    pass("platform constants and product categories");
} catch (error) {
    fail(`constants: ${error.message}`);
}

try {
    const customer = commerce.createArchitectureFixtureCustomer();
    assert.equal(customer.isProductionAccount, false);
    assert.equal(customer.passwordHash, null);
    assert.equal(customer.paymentMethods, null);
    assert.equal(customer.billingAddress, null);
    assert.equal(commerce.listCustomers().length, 0);
    assert.throws(() =>
        commerce.createCustomerRecord({
            customerId: "x",
            displayName: "Nope",
            isProductionAccount: true,
        }),
    );
    const v = commerce.validateCustomerRecord(customer);
    assert.equal(v.ok, true);
    pass("customer model: no production accounts / no secrets");
} catch (error) {
    fail(`customer: ${error.message}`);
}

try {
    const products = commerce.listCommerceProducts();
    assert.ok(products.length >= 10);
    assert.equal(commerce.validateCommerceProductCatalog().ok, true);
    assert.ok(products.every((p) => p.futurePricePlaceholder === null));
    assert.ok(products.every((p) => p.futureSkuPlaceholder === null));
    assert.ok(products.every((p) => p.commerceEligible === false));
    for (const cat of commerce.PRODUCT_CATEGORY_LIST) {
        assert.ok(
            products.some((p) => p.category === cat),
            `missing category ${cat}`,
        );
    }
    assert.ok(commerce.getCommerceProductById("commerce-book-beyond-the-last-light"));
    assert.ok(commerce.getCommerceProductById("commerce-app-poisonguard"));
    assert.ok(commerce.getCommerceProductById("commerce-app-stagescout"));
    pass("product catalog covers categories with null price/sku");
} catch (error) {
    fail(`catalog: ${error.message}`);
}

try {
    assert.equal(commerce.ENTITLEMENT_STORE.length, 0);
    assert.equal(commerce.validateEntitlementStore().ok, true);
    assert.ok(commerce.ENTITLEMENT_ARCHITECTURE_EXAMPLES.length >= 6);
    assert.equal(
        commerce.customerHasProductAccess("arch-fixture-customer-001", "commerce-app-poisonguard"),
        false,
    );
    const granted = [
        commerce.createEntitlement({
            entitlementId: "test-active",
            customerId: "arch-fixture-customer-001",
            productId: "commerce-app-poisonguard",
            status: commerce.ENTITLEMENT_STATUS.ACTIVE,
            kind: commerce.ENTITLEMENT_KINDS.ACCESS,
        }),
    ];
    assert.equal(
        commerce.customerHasProductAccess(
            "arch-fixture-customer-001",
            "commerce-app-poisonguard",
            granted,
        ),
        true,
    );
    pass("entitlement engine gates access without live grants");
} catch (error) {
    fail(`entitlements: ${error.message}`);
}

try {
    assert.equal(commerce.LICENSE_STORE.length, 0);
    assert.equal(commerce.validateLicenseStore().ok, true);
    assert.throws(() =>
        commerce.createLicense({
            licenseId: "L1",
            customerId: "c1",
            productId: "p1",
            activated: true,
        }),
    );
    pass("licensing model forbids activation");
} catch (error) {
    fail(`licensing: ${error.message}`);
}

try {
    const rels = commerce.listProductRelationships();
    assert.ok(rels.length >= 3);
    assert.equal(commerce.validateProductRelationships().ok, true);
    const fromBtll = commerce.listRecommendationsForProduct(
        "commerce-book-beyond-the-last-light",
    );
    assert.ok(fromBtll.some((r) => r.toProductId.includes("nightmare")));
    pass("product relationships graph");
} catch (error) {
    fail(`relationships: ${error.message}`);
}

try {
    assert.deepEqual(
        commerce.NOTIFICATION_CATEGORY_ARCHITECTURE.slice().sort(),
        commerce.NOTIFICATION_CATEGORY_LIST.slice().sort(),
    );
    assert.equal(commerce.NOTIFICATION_STORE.length, 0);
    const n = commerce.createNotification({
        notificationId: "n1",
        customerId: "arch-fixture-customer-001",
        category: commerce.NOTIFICATION_CATEGORIES.BOOKS,
        title: "Architecture notice",
    });
    assert.equal(n.deliverable, false);
    pass("notification architecture");
} catch (error) {
    fail(`notifications: ${error.message}`);
}

try {
    const customer = commerce.createArchitectureFixtureCustomer();
    const dash = commerce.buildCustomerDashboard(customer);
    assert.equal(dash.paymentsEnabled, false);
    assert.equal(dash.checkoutEnabled, false);
    assert.equal(dash.sections.length, commerce.DASHBOARD_SECTION_LIST.length);
    const invoices = dash.sections.find((s) => s.key === "invoices");
    const receipts = dash.sections.find((s) => s.key === "receipts");
    assert.equal(invoices.status, "placeholder");
    assert.equal(receipts.status, "placeholder");
    assert.equal(invoices.data.items.length, 0);
    pass("customer dashboard architecture placeholders");
} catch (error) {
    fail(`dashboard: ${error.message}`);
}

try {
    const admin = commerce.validateCommerceAdminFoundation();
    assert.equal(admin.ok, true);
    assert.equal(admin.summary.publicAdminUi, false);
    assert.equal(admin.summary.authentication, false);
    assert.equal(admin.summary.revenueSummary.gross, 0);
    assert.equal(admin.summary.customerCatalogCount, 0);
    assert.equal(commerce.isAnyPaymentProviderConfigured(), false);
    assert.equal(commerce.TAX_HANDLING_ARCHITECTURE.enabled, false);
    assert.equal(commerce.INVOICING_ARCHITECTURE.enabled, false);
    pass("admin foundation + provider slots unwired");
} catch (error) {
    fail(`admin: ${error.message}`);
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
        assert.equal(existsSync(join(root, doc)), true, doc);
        const text = readFileSync(join(root, doc), "utf8");
        assert.match(text, /Phase 12|architecture|Architecture/i);
    }
    const roadmap = readFileSync(join(root, "docs/COMMERCE_ROADMAP.md"), "utf8");
    for (const needle of ["Stripe", "PayPal", "Apple", "Google", "tax", "invoic", "Migration"]) {
        assert.match(roadmap, new RegExp(needle, "i"));
    }
    pass("commerce documentation present");
} catch (error) {
    fail(`docs: ${error.message}`);
}

try {
    assert.equal(existsSync(join(root, "src/pages/CommerceAdmin.jsx")), false);
    assert.equal(existsSync(join(root, "src/pages/CustomerDashboard.jsx")), false);
    const app = readFileSync(join(root, "src/App.jsx"), "utf8");
    assert.equal(/CommerceAdmin|CustomerDashboard/.test(app), false);
    pass("no public commerce/customer admin UI routes");
} catch (error) {
    fail(`ui: ${error.message}`);
}

if (failed > 0) {
    console.error(`\nCommerce tests failed (${failed}).`);
    process.exit(1);
}
console.log("\nAll commerce platform tests passed.");
