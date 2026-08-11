/**
 * Future payment / tax / invoicing provider slots (Phase 12 — unwired).
 */

import { FUTURE_PAYMENT_PROVIDERS, FUTURE_PAYMENT_PROVIDER_LIST } from "./constants.js";

/**
 * @typedef {object} PaymentProviderSlot
 * @property {string} provider
 * @property {boolean} configured
 * @property {null} apiKeyRef
 * @property {string} status
 * @property {string} notes
 */

export function listPaymentProviderSlots() {
    return FUTURE_PAYMENT_PROVIDER_LIST.map((provider) =>
        Object.freeze({
            provider,
            configured: false,
            apiKeyRef: null,
            status: "architecture_only",
            notes:
                provider === FUTURE_PAYMENT_PROVIDERS.APPLE
                    || provider === FUTURE_PAYMENT_PROVIDERS.GOOGLE
                    ? `${provider} Pay via supported processor (e.g. Stripe) — not activated`
                    : `${provider} integration reserved — not activated`,
        }),
    );
}

export function getPaymentProviderSlot(provider) {
    return listPaymentProviderSlots().find((s) => s.provider === provider) || null;
}

export const TAX_HANDLING_ARCHITECTURE = Object.freeze({
    enabled: false,
    provider: null,
    notes:
        "Future tax handling (e.g. Stripe Tax / Avalara) — not implemented in Phase 12",
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
        notes: "Future App Store IAP / subscriptions",
    }),
    google: Object.freeze({
        provider: FUTURE_PAYMENT_PROVIDERS.GOOGLE,
        configured: false,
        notes: "Future Google Play Billing",
    }),
});

/** True only when a real provider is configured — always false in Phase 12. */
export function isAnyPaymentProviderConfigured() {
    return listPaymentProviderSlots().some((s) => s.configured);
}
