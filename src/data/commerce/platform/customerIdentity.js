/**
 * Phase M2 — minimum secure customer identity layer.
 * Reuses Phase 12 customerModel concepts; no public PII exposure.
 */

import { createCustomerRecord, validateCustomerRecord } from "./customerModel.js";

export const EMAIL_VERIFICATION_STATES = Object.freeze({
    UNVERIFIED: "UNVERIFIED",
    PENDING: "PENDING",
    VERIFIED: "VERIFIED",
});

const IDENTITY_STORE = new Map();

export function clearCustomerIdentityStore() {
    IDENTITY_STORE.clear();
}

/** Re-export Phase 12 validators for callers that need non-email fixtures. */
export { createCustomerRecord, validateCustomerRecord };

export function createCustomerIdentity({
    customerId,
    email,
    emailVerified = false,
    authProvider = "architecture",
    guest = false,
} = {}) {
    if (!customerId || !email) {
        return { ok: false, error: "CUSTOMER_ID_AND_EMAIL_REQUIRED", identity: null };
    }
    const identity = Object.freeze({
        customerId: String(customerId).slice(0, 64),
        email: String(email).toLowerCase().slice(0, 254),
        emailVerification: emailVerified
            ? EMAIL_VERIFICATION_STATES.VERIFIED
            : EMAIL_VERIFICATION_STATES.UNVERIFIED,
        authProvider,
        guest: Boolean(guest),
        createdAt: new Date().toISOString(),
        publicExposureForbidden: true,
    });

    // Identity store is authoritative for M2; Phase 12 customer factory remains
    // architecture-only and forbids email on fixtures — do not dual-write PII there.
    IDENTITY_STORE.set(identity.customerId, identity);
    return { ok: true, error: null, identity };
}

export function getCustomerIdentity(customerId) {
    return IDENTITY_STORE.get(customerId) || null;
}

/**
 * Guest checkout allowed only when recovery path is designed.
 */
export function evaluateGuestCheckout({
    guestEmail = "",
    recoveryMagicLinkDesigned = true,
    orderReceiptEmailDesigned = true,
} = {}) {
    if (!guestEmail) {
        return { ok: false, error: "GUEST_EMAIL_REQUIRED", allowed: false };
    }
    if (!recoveryMagicLinkDesigned || !orderReceiptEmailDesigned) {
        return {
            ok: false,
            error: "ENTITLEMENT_RECOVERY_NOT_DESIGNED",
            allowed: false,
            message: "Guest checkout blocked until secure entitlement recovery exists.",
        };
    }
    return {
        ok: true,
        error: null,
        allowed: true,
        recovery: "email_magic_link_architecture",
    };
}

export function publicCustomerPayloadForbidden() {
    return true;
}
