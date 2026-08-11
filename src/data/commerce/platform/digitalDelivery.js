/**
 * Phase M1 — secure digital delivery architecture.
 * No public raw file URLs for paid assets. Entitlement must be server-validated.
 */

import { isCheckoutLive } from "../../monetizationFlags.js";

/** In-memory demo store — never treat as production entitlements. */
const DEMO_ENTITLEMENTS = [];

export function createSignedDownloadGrant({
    productId = "",
    customerId = "",
    ttlSeconds = 900,
    serverValidatedEntitlement = false,
} = {}) {
    if (!serverValidatedEntitlement) {
        return {
            ok: false,
            error: "ENTITLEMENT_REQUIRED",
            url: null,
            message: "Download access requires server-validated entitlement. No client-only unlock.",
        };
    }
    if (!isCheckoutLive()) {
        return {
            ok: false,
            error: "PAYMENTS_DISABLED",
            url: null,
            message: "Paid digital delivery is disabled while payments are offline.",
        };
    }
    if (!productId || !customerId) {
        return {
            ok: false,
            error: "INVALID_GRANT",
            url: null,
            message: "productId and customerId required.",
        };
    }
    // Architecture only — never return a real raw file URL here.
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
    return {
        ok: true,
        url: null,
        token: `grant_${productId}_${customerId}_${Date.now()}`,
        expiresAt,
        downloadCount: 0,
        maxDownloads: 5,
        message: "Signed grant token issued (architecture). File bytes served only by authorized API.",
    };
}

export function revokeDownloadGrant({ grantToken = "", reason = "refund" } = {}) {
    return {
        ok: Boolean(grantToken),
        revoked: Boolean(grantToken),
        reason,
        message: grantToken
            ? "Grant marked revoked (architecture)."
            : "Missing grant token.",
    };
}

export function listDemoEntitlements() {
    return {
        demo: true,
        label: "DEMO",
        entitlements: [...DEMO_ENTITLEMENTS],
        note: "Empty by design — no fake paid entitlements.",
    };
}

export const DIGITAL_DELIVERY_RULES = Object.freeze({
    noPublicRawPaidUrls: true,
    entitlementServerValidated: true,
    expiringAccessSupported: true,
    downloadCountSupported: true,
    refundRevocationSupported: true,
    unpublishedManuscriptsNeverExposed: true,
});
