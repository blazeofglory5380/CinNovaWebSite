/**
 * Phase M2 — payment provider mode (server-authoritative).
 * Client Vite flags alone must NEVER enable LIVE payments.
 *
 * Modes: UNCONFIGURED | TEST | LIVE_DISABLED | LIVE
 */

export const PAYMENT_MODES = Object.freeze({
    UNCONFIGURED: "UNCONFIGURED",
    TEST: "TEST",
    LIVE_DISABLED: "LIVE_DISABLED",
    LIVE: "LIVE",
});

export const PAYMENT_MODE_LIST = Object.freeze(Object.values(PAYMENT_MODES));

/** Recommended primary hosted processor for CinNova launch (decision doc). */
export const RECOMMENDED_PRIMARY_PROVIDER = "stripe";

/**
 * Resolve payment mode from server-side env only.
 * Never trust client-supplied mode strings for LIVE.
 *
 * @param {Record<string, string|undefined>} [env]
 */
export function resolvePaymentMode(env = typeof process !== "undefined" ? process.env : {}) {
    const raw = String(env.CINNOVA_PAYMENTS_MODE || env.PAYMENTS_MODE || "")
        .trim()
        .toUpperCase();
    const liveApproved = String(env.CINNOVA_LIVE_PAYMENTS_APPROVED || "").toLowerCase() === "true";
    const hasTestKey = Boolean(
        String(env.STRIPE_SECRET_KEY || "").startsWith("sk_test_")
        || String(env.STRIPE_TEST_SECRET_KEY || "").startsWith("sk_test_"),
    );
    const hasLiveKey = Boolean(
        String(env.STRIPE_SECRET_KEY || "").startsWith("sk_live_")
        || String(env.STRIPE_LIVE_SECRET_KEY || "").startsWith("sk_live_"),
    );

    // Explicit LIVE requires dual server gate: mode + approval + live key.
    if (raw === PAYMENT_MODES.LIVE) {
        if (liveApproved && hasLiveKey) return PAYMENT_MODES.LIVE;
        return PAYMENT_MODES.LIVE_DISABLED;
    }

    if (raw === PAYMENT_MODES.LIVE_DISABLED) return PAYMENT_MODES.LIVE_DISABLED;

    if (raw === PAYMENT_MODES.TEST) {
        return hasTestKey ? PAYMENT_MODES.TEST : PAYMENT_MODES.UNCONFIGURED;
    }

    // Auto: test credentials present → TEST; else UNCONFIGURED.
    if (hasTestKey && !hasLiveKey) return PAYMENT_MODES.TEST;
    if (hasLiveKey && !liveApproved) return PAYMENT_MODES.LIVE_DISABLED;

    return PAYMENT_MODES.UNCONFIGURED;
}

export function isPaymentMode(value) {
    return PAYMENT_MODE_LIST.includes(value);
}

export function canCreateTestCheckoutSession(mode = resolvePaymentMode()) {
    return mode === PAYMENT_MODES.TEST;
}

export function canCreateLiveCheckoutSession(mode = resolvePaymentMode()) {
    return mode === PAYMENT_MODES.LIVE;
}

export function canChargeCustomers(mode = resolvePaymentMode()) {
    return mode === PAYMENT_MODES.TEST || mode === PAYMENT_MODES.LIVE;
}

/**
 * Client may learn publishable key mode hints only — never secret keys.
 * Live charges still require server LIVE gate.
 */
export function getClientPaymentPublishableHint(env = {}) {
    const pk = String(env.VITE_STRIPE_PUBLISHABLE_KEY || "").trim();
    if (!pk) return { present: false, modeHint: null, keyPrefix: null };
    if (pk.startsWith("pk_test_")) {
        return { present: true, modeHint: PAYMENT_MODES.TEST, keyPrefix: "pk_test_" };
    }
    if (pk.startsWith("pk_live_")) {
        return { present: true, modeHint: PAYMENT_MODES.LIVE_DISABLED, keyPrefix: "pk_live_" };
    }
    return { present: true, modeHint: PAYMENT_MODES.UNCONFIGURED, keyPrefix: "unknown" };
}

export function getPaymentModeReport(env = typeof process !== "undefined" ? process.env : {}) {
    const mode = resolvePaymentMode(env);
    return {
        mode,
        recommendedProvider: RECOMMENDED_PRIMARY_PROVIDER,
        canTestCheckout: canCreateTestCheckoutSession(mode),
        canLiveCheckout: canCreateLiveCheckoutSession(mode),
        liveRequiresServerApproval: true,
        clientFlagAloneCannotEnableLive: true,
        note: "Default UNCONFIGURED. TEST only with sk_test_ credentials. LIVE requires CINNOVA_LIVE_PAYMENTS_APPROVED + sk_live_.",
    };
}
