/**
 * Phase 12.9 — Admin foundation (internal data APIs only).
 * No public admin UI. No authentication in this phase.
 */

import { listCustomers } from "./customerModel.js";
import {
    listCommerceProducts,
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

    return Object.freeze({
        productCatalogCount: products.length,
        customerCatalogCount: customers.length,
        subscriptionPlanCount: plans.length,
        entitlementCount: entitlements.length,
        licenseCount: licenses.length,
        partnerStatus: "see Phase 11.4D partner catalog — not linked here",
        analytics: Object.freeze({
            note: "Commerce analytics hooks reserved; no purchase events",
            purchases: 0,
            checkouts: 0,
            subscriptionActivations: 0,
        }),
        revenueSummary: Object.freeze({
            currency: "USD",
            gross: 0,
            net: 0,
            refunds: 0,
            placeholder: true,
            note: "Revenue unavailable — no payments or activated subscriptions",
        }),
        paymentProvidersConfigured: Object.freeze([]),
        futurePaymentProviders: FUTURE_PAYMENT_PROVIDER_LIST.slice(),
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

    const catalog = validateCommerceProductCatalog();
    const subs = validateSubscriptionArchitecture();
    const ents = validateEntitlementStore();
    const lic = validateLicenseStore();
    errors.push(...catalog.errors, ...subs.errors, ...ents.errors, ...lic.errors);

    return { ok: errors.length === 0, errors, summary };
}
