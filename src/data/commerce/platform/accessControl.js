/**
 * Phase 12 — fail-closed access evaluation.
 *
 * A commerce customerId is NOT an authenticated identity.
 * User-supplied customer IDs must never be trusted for ownership or entitlements.
 * Amazon outbound clicks, relationships, and newsletter prefs never grant access.
 */

import {
    ENTITLEMENT_KIND_LIST,
    ENTITLEMENT_KINDS,
    ENTITLEMENT_STATUS,
    LICENSE_STATES,
} from "./constants.js";
import { getCommerceProductById } from "./productCatalog.js";
import { listRecommendationsForProduct } from "./productRelationships.js";

/**
 * @typedef {object} AccessDecision
 * @property {boolean} allowed
 * @property {string} reason
 */

/**
 * Production entitlement/license grants require a future authenticated principal.
 * Phase 12 always returns false.
 */
export function isAuthenticatedCommercePrincipal() {
    return false;
}

/** Never trust a client-supplied customer id for access decisions. */
export function trustUserSuppliedCustomerId() {
    return false;
}

/**
 * Evaluate product access. Fail closed on unknown product, unknown kind,
 * missing auth, pending/expired/suspended grants, or empty stores.
 *
 * @param {object} args
 * @param {string} args.customerId
 * @param {string} args.productId
 * @param {ReadonlyArray<object>} [args.entitlements]
 * @param {ReadonlyArray<object>} [args.licenses]
 * @param {boolean} [args.authenticated]
 * @param {string|null} [args.featureKey]
 * @returns {AccessDecision}
 */
export function evaluateProductAccess({
    customerId,
    productId,
    entitlements = [],
    licenses = [],
    authenticated = false,
    featureKey = null,
} = {}) {
    if (!customerId || typeof customerId !== "string") {
        return { allowed: false, reason: "missing_customer_id" };
    }
    if (!productId || typeof productId !== "string") {
        return { allowed: false, reason: "missing_product_id" };
    }
    if (!getCommerceProductById(productId)) {
        return { allowed: false, reason: "unknown_product" };
    }
    // BLOCKED UNTIL AUTHENTICATION — no production grants without auth.
    if (!authenticated) {
        return { allowed: false, reason: "authentication_required" };
    }
    if (!isAuthenticatedCommercePrincipal({ customerId })) {
        return { allowed: false, reason: "principal_not_authenticated" };
    }

    const matchingEntitlements = entitlements.filter(
        (e) => e.customerId === customerId && e.productId === productId,
    );
    for (const entitlement of matchingEntitlements) {
        if (!ENTITLEMENT_KIND_LIST.includes(entitlement.kind)) {
            return { allowed: false, reason: "unknown_entitlement_kind" };
        }
        if (entitlement.status !== ENTITLEMENT_STATUS.ACTIVE) {
            continue;
        }
        if (
            entitlement.kind !== ENTITLEMENT_KINDS.OWN &&
            entitlement.kind !== ENTITLEMENT_KINDS.ACCESS &&
            entitlement.kind !== ENTITLEMENT_KINDS.FEATURE &&
            entitlement.kind !== ENTITLEMENT_KINDS.DOWNLOAD &&
            entitlement.kind !== ENTITLEMENT_KINDS.SEAT
        ) {
            return { allowed: false, reason: "unknown_entitlement_kind" };
        }
        if (featureKey && entitlement.featureKey !== featureKey) {
            continue;
        }
        // Even with ACTIVE entitlement records, Phase 12 principal auth is false,
        // so this path is unreachable today — kept for future wiring.
        return { allowed: true, reason: "active_entitlement" };
    }

    const matchingLicenses = licenses.filter(
        (l) => l.customerId === customerId && l.productId === productId,
    );
    for (const license of matchingLicenses) {
        if (!licenseGrantsAccess(license)) continue;
        return { allowed: true, reason: "active_license" };
    }

    return { allowed: false, reason: "no_active_grant" };
}

export function licenseGrantsAccess(license) {
    if (!license) return false;
    if (license.state !== LICENSE_STATES.ACTIVE) return false;
    if (license.activated !== true) return false;
    if (!getCommerceProductById(license.productId)) return false;
    return true;
}

/** Product relationships never imply ownership or access. */
export function relationshipGrantsEntitlement(productId) {
    const edges = listRecommendationsForProduct(productId);
    return edges.some((edge) => edge.grantsEntitlement === true);
}

export function amazonOutboundClickGrantsOwnership() {
    return false;
}

export function newsletterSubscriptionIsPaidEntitlement() {
    return false;
}

/**
 * Convenience: deny access for the default Phase 12 empty store + unauthenticated caller.
 */
export function customerHasProductAccessFailClosed(customerId, productId, options = {}) {
    return evaluateProductAccess({
        customerId,
        productId,
        entitlements: options.entitlements || [],
        licenses: options.licenses || [],
        authenticated: options.authenticated === true,
        featureKey: options.featureKey ?? null,
    }).allowed;
}
