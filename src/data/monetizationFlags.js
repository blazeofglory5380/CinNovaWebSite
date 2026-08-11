/**
 * Phase M1 — unified monetization feature flags.
 * Defaults are fail-closed / safe. Live payments never default on.
 */

function envFlag(name, fallback = false) {
    try {
        const raw = String(import.meta.env?.[name] ?? "").trim().toLowerCase();
        if (!raw) return fallback;
        return raw === "true" || raw === "1" || raw === "yes";
    } catch {
        return fallback;
    }
}

/**
 * Canonical activation map. Report this in completion docs.
 * Do not flip payments/checkout/store to true without explicit authorization.
 */
export const MONETIZATION_FLAGS = Object.freeze({
    store: envFlag("VITE_STORE_ENABLED", false),
    affiliateLinks: envFlag("VITE_AFFILIATES_ENABLED", false),
    newsletterMonetization: envFlag("VITE_NEWSLETTER_MONETIZATION_ENABLED", false),
    sponsorships: envFlag("VITE_SPONSORSHIPS_ENABLED", false),
    checkout: envFlag("VITE_CHECKOUT_ENABLED", false),
    payments: envFlag("VITE_PAYMENTS_ENABLED", false),
    premiumMembership: envFlag("VITE_PREMIUM_MEMBERSHIP_ENABLED", false),
    ads: envFlag("VITE_ADS_ENABLED", false),
    premiumNewsletter: envFlag("VITE_PREMIUM_NEWSLETTER_ENABLED", false),
    adminRoutes: envFlag("VITE_ENABLE_ADMIN_ROUTES", false),
    revenueDashboardDemo: envFlag("VITE_REVENUE_DASHBOARD_DEMO", false),
});

export function getMonetizationFlag(name) {
    return Boolean(MONETIZATION_FLAGS[name]);
}

export function isStoreLive() {
    return MONETIZATION_FLAGS.store && MONETIZATION_FLAGS.checkout && MONETIZATION_FLAGS.payments;
}

export function isCheckoutLive() {
    return MONETIZATION_FLAGS.checkout && MONETIZATION_FLAGS.payments;
}

export function isAffiliateLive() {
    return MONETIZATION_FLAGS.affiliateLinks;
}

export function getMonetizationActivationReport() {
    return {
        flags: { ...MONETIZATION_FLAGS },
        liveHostedPayments: false,
        liveCheckout: isCheckoutLive(),
        liveStore: isStoreLive(),
        liveAffiliates: isAffiliateLive(),
        liveAds: MONETIZATION_FLAGS.ads,
        paymentModeNote:
            "Server CINNOVA_PAYMENTS_MODE controls UNCONFIGURED|TEST|LIVE_DISABLED|LIVE. Client flags alone cannot enable LIVE.",
        note: "All revenue activation flags default OFF. Live payment activation requires explicit authorization.",
    };
}
