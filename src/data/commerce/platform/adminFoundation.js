/**
 * Phase 12.9 — Admin foundation (internal data APIs only).
 * No public admin UI. No authentication in this phase.
 */

import { listCustomers } from "./customerModel.js";
import {
    countActiveCommercialInventory,
    listArchitecturePlaceholders,
    listCommerceProducts,
    listPublicCommerceProducts,
    validateCommerceProductCatalog,
} from "./productCatalog.js";
import {
    listCommerceSubscriptionPlans,
    validateSubscriptionArchitecture,
} from "./subscriptionModel.js";
import {
    listEntitlements,
    validateEntitlementStore,
} from "./entitlementEngine.js";
import { listLicenses, validateLicenseStore } from "./licensingModel.js";
import { FUTURE_PAYMENT_PROVIDER_LIST } from "./constants.js";
import { FORBIDDEN_COMMERCE_ANALYTICS_EVENTS } from "./constants.js";

/**
 * Internal inventory snapshot for future authenticated admin tools.
 * Revenue remains zero — nothing is commercially active.
 */
export function getCommerceAdminSummary() {
    const products = listCommerceProducts();
    const customers = listCustomers();
    const plans = listCommerceSubscriptionPlans();
    const entitlements = listEntitlements();
    const licenses = listLicenses();
    const placeholders = listArchitecturePlaceholders();

    return Object.freeze({
        productCatalogCount: products.length,
        publicProductCount: listPublicCommerceProducts().length,
        architecturePlaceholderCount: placeholders.length,
        activeCommercialInventory: countActiveCommercialInventory(),
        customerCatalogCount: customers.length,
        subscriptionPlanCount: plans.length,
        activeSubscriptionCount: 0,
        entitlementCount: entitlements.length,
        activeEntitlementCount: 0,
        licenseCount: licenses.length,
        activeLicenseCount: 0,
        partnerStatus: "see Phase 11.4D partner catalog — not linked here",
        analytics: Object.freeze({
            note: "Commerce analytics hooks reserved; no purchase events",
            purchases: 0,
            checkouts: 0,
            subscriptionActivations: 0,
            forbiddenEvents: FORBIDDEN_COMMERCE_ANALYTICS_EVENTS.slice(),
        }),
        revenueSummary: Object.freeze({
            currency: "USD",
            gross: 0,
            net: 0,
            refunds: 0,
            placeholder: true,
            unavailable: true,
            note: "Revenue unavailable — no payments or activated subscriptions",
        }),
        invoices: Object.freeze([]),
        receipts: Object.freeze([]),
        paymentProvidersConfigured: Object.freeze([]),
        futurePaymentProviders: FUTURE_PAYMENT_PROVIDER_LIST.slice(),
        providerSelection: "undecided",
        publicAdminUi: false,
        authentication: false,
    });
}

export function validateCommerceAdminFoundation() {
    const errors = [];
    const summary = getCommerceAdminSummary();
    if (summary.publicAdminUi) errors.push("publicAdminUi must be false");
    if (summary.authentication) errors.push("authentication must be false");
    if (summary.revenueSummary.gross !== 0) errors.push("revenue must be zero");
    if (summary.paymentProvidersConfigured.length > 0) {
        errors.push("no payment providers may be configured");
    }
    if (summary.customerCatalogCount !== 0) {
        errors.push("production customer catalog must be empty");
    }
    if (summary.activeCommercialInventory !== 0) {
        errors.push("active commercial inventory must be zero");
    }
    if (summary.activeSubscriptionCount !== 0) {
        errors.push("active subscriptions must be zero");
    }
    if (summary.activeEntitlementCount !== 0) {
        errors.push("active entitlements must be zero");
    }
    if (summary.activeLicenseCount !== 0) {
        errors.push("active licenses must be zero");
    }
    if (summary.invoices.length || summary.receipts.length) {
        errors.push("invoices/receipts must be empty placeholders");
    }

    const catalog = validateCommerceProductCatalog();
    const subs = validateSubscriptionArchitecture();
    const ents = validateEntitlementStore();
    const lic = validateLicenseStore();
    errors.push(...catalog.errors, ...subs.errors, ...ents.errors, ...lic.errors);

    return { ok: errors.length === 0, errors, summary };
}
