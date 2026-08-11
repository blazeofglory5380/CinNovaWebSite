/**
 * Future payment / tax / invoicing provider slots.
 * Phase M2: Stripe recommended as primary hosted processor — still unwired.
 */

import { FUTURE_PAYMENT_PROVIDERS, FUTURE_PAYMENT_PROVIDER_LIST } from "./constants.js";
import { RECOMMENDED_PRIMARY_PROVIDER } from "./paymentMode.js";

/**
 * @typedef {object} PaymentProviderSlot
 * @property {string} provider
 * @property {boolean} configured
 * @property {null} apiKeyRef
 * @property {string} status
 * @property {string} notes
 * @property {boolean} [recommendedPrimary]
 */

export function listPaymentProviderSlots() {
    return FUTURE_PAYMENT_PROVIDER_LIST.map((provider) =>
        Object.freeze({
            provider,
            configured: false,
            apiKeyRef: null,
            status: "architecture_only",
            recommendedPrimary: provider === RECOMMENDED_PRIMARY_PROVIDER,
            notes:
                provider === RECOMMENDED_PRIMARY_PROVIDER
                    ? "RECOMMENDED primary for CinNova launch (see docs/PAYMENT_PROVIDER_DECISION_M2.md) — not activated"
                    : provider === FUTURE_PAYMENT_PROVIDERS.APPLE
                        || provider === FUTURE_PAYMENT_PROVIDERS.GOOGLE
                        ? `${provider} Pay via Stripe (or supported processor) — not activated`
                        : `${provider} reserved as secondary/future — not activated`,
        }),
    );
}

export function getPaymentProviderSlot(provider) {
    return listPaymentProviderSlots().find((s) => s.provider === provider) || null;
}

export const TAX_HANDLING_ARCHITECTURE = Object.freeze({
    enabled: false,
    provider: null,
    recommended: "stripe_tax",
    notes:
        "Tax via Stripe Tax (preferred with Stripe) or equivalent — LIVE blocked until configured. Do not invent rates.",
});

export const INVOICING_ARCHITECTURE = Object.freeze({
    enabled: false,
    provider: null,
    invoices: Object.freeze([]),
    receipts: Object.freeze([]),
    notes: "Invoicing and receipts require a payment provider — placeholder only",
});

export const MOBILE_IAP_ARCHITECTURE = Object.freeze({
    apple: Object.freeze({
        provider: FUTURE_PAYMENT_PROVIDERS.APPLE,
        configured: false,
        notes: "Future App Store IAP / subscriptions; Apple Pay on web via Stripe",
    }),
    google: Object.freeze({
        provider: FUTURE_PAYMENT_PROVIDERS.GOOGLE,
        configured: false,
        notes: "Future Google Play Billing; Google Pay on web via Stripe",
    }),
});

/** True only when a real provider is configured — always false until activation. */
export function isAnyPaymentProviderConfigured() {
    return listPaymentProviderSlots().some((s) => s.configured);
}

export function getRecommendedPrimaryProvider() {
    return RECOMMENDED_PRIMARY_PROVIDER;
}
