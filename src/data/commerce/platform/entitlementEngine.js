/**
 * Phase 12.4 — Entitlement engine (access determination only).
 * No grants are active for production customers in this phase.
 */

import {
    ENTITLEMENT_KIND_LIST,
    ENTITLEMENT_KINDS,
    ENTITLEMENT_STATUS,
    ENTITLEMENT_STATUS_LIST,
} from "./constants.js";
import { customerHasProductAccessFailClosed } from "./accessControl.js";

/**
 * @typedef {object} EntitlementRecord
 * @property {string} entitlementId
 * @property {string} customerId
 * @property {string} productId
 * @property {string} kind
 * @property {string} status
 * @property {string|null} sourcePlanId
 * @property {string|null} sourceLicenseId
 * @property {string|null} featureKey
 * @property {string|null} grantedAt
 * @property {string|null} expiresAt
 * @property {string} notes
 */

/**
 * @param {object} input
 * @returns {Readonly<EntitlementRecord>}
 */
export function createEntitlement(input) {
    if (!input?.entitlementId || !input?.customerId || !input?.productId) {
        throw new Error("Entitlement requires entitlementId, customerId, productId");
    }
    const kind = input.kind ?? ENTITLEMENT_KINDS.ACCESS;
    const status = input.status ?? ENTITLEMENT_STATUS.PENDING;
    if (!ENTITLEMENT_KIND_LIST.includes(kind)) {
        throw new Error(`Invalid entitlement kind: ${kind}`);
    }
    if (!ENTITLEMENT_STATUS_LIST.includes(status)) {
        throw new Error(`Invalid entitlement status: ${status}`);
    }

    return Object.freeze({
        entitlementId: input.entitlementId,
        customerId: input.customerId,
        productId: input.productId,
        kind,
        status,
        sourcePlanId: input.sourcePlanId ?? null,
        sourceLicenseId: input.sourceLicenseId ?? null,
        featureKey: input.featureKey ?? null,
        grantedAt: input.grantedAt ?? null,
        expiresAt: input.expiresAt ?? null,
        notes: input.notes ?? "Architecture entitlement — not a live grant",
    });
}

/** Empty live grant store — Phase 12 does not grant production entitlements. */
export const ENTITLEMENT_STORE = Object.freeze([]);

/** Named architecture examples (documentation / tests) — not assigned to real users. */
export const ENTITLEMENT_ARCHITECTURE_EXAMPLES = Object.freeze([
    createEntitlement({
        entitlementId: "ex-own-beyond-the-last-light",
        customerId: "arch-fixture-customer-001",
        productId: "commerce-book-beyond-the-last-light",
        kind: ENTITLEMENT_KINDS.OWN,
        status: ENTITLEMENT_STATUS.PENDING,
        notes: "Example: customer owns Beyond the Last Light eBook",
    }),
    createEntitlement({
        entitlementId: "ex-own-southeast-asian-table",
        customerId: "arch-fixture-customer-001",
        productId: "commerce-book-southeast-asian-table",
        kind: ENTITLEMENT_KINDS.OWN,
        status: ENTITLEMENT_STATUS.PENDING,
        notes: "Example: Southeast Asian Table Complete",
    }),
    createEntitlement({
        entitlementId: "ex-access-poisonguard-premium",
        customerId: "arch-fixture-customer-001",
        productId: "commerce-app-poisonguard",
        kind: ENTITLEMENT_KINDS.ACCESS,
        status: ENTITLEMENT_STATUS.PENDING,
        sourcePlanId: "poisonguard-pro",
        featureKey: "premium",
        notes: "Example: PoisonGuard Premium",
    }),
    createEntitlement({
        entitlementId: "ex-access-stagescout-premium",
        customerId: "arch-fixture-customer-001",
        productId: "commerce-app-stagescout",
        kind: ENTITLEMENT_KINDS.ACCESS,
        status: ENTITLEMENT_STATUS.PENDING,
        sourcePlanId: "stagescout-pro",
        notes: "Example: StageScout Premium",
    }),
    createEntitlement({
        entitlementId: "ex-access-studynest-pro",
        customerId: "arch-fixture-customer-001",
        productId: "commerce-app-studynest",
        kind: ENTITLEMENT_KINDS.ACCESS,
        status: ENTITLEMENT_STATUS.PENDING,
        sourcePlanId: "studynest-pro",
        notes: "Example: StudyNest Pro",
    }),
    createEntitlement({
        entitlementId: "ex-access-real-estate-pro",
        customerId: "arch-fixture-customer-001",
        productId: "commerce-app-real-estate",
        kind: ENTITLEMENT_KINDS.ACCESS,
        status: ENTITLEMENT_STATUS.PENDING,
        sourcePlanId: "real-estate-pro",
        notes: "Example: Real Estate AI Professional",
    }),
]);

export function listEntitlements() {
    return ENTITLEMENT_STORE.slice();
}

export function listEntitlementsForCustomer(customerId) {
    return ENTITLEMENT_STORE.filter((e) => e.customerId === customerId);
}

/**
 * Access check — fail closed.
 * Pending/expired grants do not allow access. Authentication is required for
 * any future production grant; Phase 12 principals are never authenticated.
 */
export function customerHasProductAccess(customerId, productId, store = ENTITLEMENT_STORE, options = {}) {
    return customerHasProductAccessFailClosed(customerId, productId, {
        entitlements: store,
        licenses: options.licenses || [],
        authenticated: options.authenticated === true,
        featureKey: options.featureKey ?? null,
    });
}

/**
 * Low-level store matcher for tests only — does NOT authorize production access.
 */
export function storeHasActiveEntitlementRecord(customerId, productId, store = ENTITLEMENT_STORE) {
    return store.some(
        (e) =>
            e.customerId === customerId &&
            e.productId === productId &&
            e.status === ENTITLEMENT_STATUS.ACTIVE &&
            (e.kind === ENTITLEMENT_KINDS.OWN ||
                e.kind === ENTITLEMENT_KINDS.ACCESS ||
                e.kind === ENTITLEMENT_KINDS.FEATURE),
    );
}

export function customerHasFeature(
    customerId,
    productId,
    featureKey,
    store = ENTITLEMENT_STORE,
    options = {},
) {
    return customerHasProductAccessFailClosed(customerId, productId, {
        entitlements: store,
        authenticated: options.authenticated === true,
        featureKey,
    });
}

export function validateEntitlementStore(store = ENTITLEMENT_STORE) {
    const errors = [];
    for (const e of store) {
        if (e.status === ENTITLEMENT_STATUS.ACTIVE) {
            errors.push(
                `${e.entitlementId}: live ACTIVE entitlements forbidden in Phase 12 store`,
            );
        }
    }
    for (const example of ENTITLEMENT_ARCHITECTURE_EXAMPLES) {
        if (example.status === ENTITLEMENT_STATUS.ACTIVE) {
            errors.push(`${example.entitlementId}: examples must not be ACTIVE`);
        }
        if (
            customerHasProductAccess(
                example.customerId,
                example.productId,
                [example],
            )
        ) {
            errors.push(`${example.entitlementId}: example unexpectedly grants access`);
        }
    }
    return { ok: errors.length === 0, errors };
}
