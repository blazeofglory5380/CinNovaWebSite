/**
 * CinNova Phase 11.1 — shared monetization primitives.
 *
 * Architectural capabilities only. Declaring a revenue model here does NOT
 * mean every product currently uses it, and does NOT invent prices, retailers,
 * affiliates, or sponsorships.
 */

export const REVENUE_MODELS = Object.freeze({
    DIRECT_SALE: "DIRECT_SALE",
    EXTERNAL_RETAIL: "EXTERNAL_RETAIL",
    AFFILIATE: "AFFILIATE",
    SUBSCRIPTION: "SUBSCRIPTION",
    SPONSORSHIP: "SPONSORSHIP",
    ADVERTISING: "ADVERTISING",
    LEAD_GENERATION: "LEAD_GENERATION",
    FREE_TO_PAID: "FREE_TO_PAID",
    COMING_SOON: "COMING_SOON",
});

export const COMMERCE_AVAILABILITY = Object.freeze({
    AVAILABLE: "AVAILABLE",
    COMING_SOON: "COMING_SOON",
    IN_DEVELOPMENT: "IN_DEVELOPMENT",
    BETA: "BETA",
    UNAVAILABLE: "UNAVAILABLE",
});

export const COMMERCE_AVAILABILITY_LABELS = Object.freeze({
    AVAILABLE: "Available",
    COMING_SOON: "Coming Soon",
    IN_DEVELOPMENT: "In Development",
    BETA: "Beta",
    UNAVAILABLE: "Unavailable",
});

export const DESTINATION_TYPES = Object.freeze({
    INTERNAL: "INTERNAL",
    EXTERNAL_RETAILER: "EXTERNAL_RETAILER",
    AFFILIATE: "AFFILIATE",
    LEAD_CAPTURE: "LEAD_CAPTURE",
    NONE: "NONE",
});

export const CTA_TYPES = Object.freeze({
    BUY_EXTERNAL: "BUY_EXTERNAL",
    VIEW_EXTERNAL: "VIEW_EXTERNAL",
    EXPLORE: "EXPLORE",
    LEARN_MORE: "LEARN_MORE",
    JOIN_UPDATES: "JOIN_UPDATES",
    FOLLOW_DEVELOPMENT: "FOLLOW_DEVELOPMENT",
    BETA: "BETA",
    COMING_SOON: "COMING_SOON",
    UNAVAILABLE: "UNAVAILABLE",
});

/**
 * Conversion funnel stages. Only DISCOVERY → INTEREST → INTENT → OUTBOUND → LEAD
 * are currently measurable. CHECKOUT / PURCHASE / SUBSCRIPTION are reserved.
 */
export const FUNNEL_STAGES = Object.freeze({
    DISCOVERY: "DISCOVERY",
    INTEREST: "INTEREST",
    INTENT: "INTENT",
    OUTBOUND: "OUTBOUND",
    LEAD: "LEAD",
    CHECKOUT: "CHECKOUT",
    PURCHASE: "PURCHASE",
    SUBSCRIPTION: "SUBSCRIPTION",
});

export const ACTIVE_FUNNEL_STAGES = Object.freeze([
    FUNNEL_STAGES.DISCOVERY,
    FUNNEL_STAGES.INTEREST,
    FUNNEL_STAGES.INTENT,
    FUNNEL_STAGES.OUTBOUND,
    FUNNEL_STAGES.LEAD,
]);

export const FUTURE_FUNNEL_STAGES = Object.freeze([
    FUNNEL_STAGES.CHECKOUT,
    FUNNEL_STAGES.PURCHASE,
    FUNNEL_STAGES.SUBSCRIPTION,
]);

/** Safe rel for verified external commercial destinations (non-affiliate). */
export const EXTERNAL_COMMERCE_REL = "noopener noreferrer";

/** Safe rel when a destination is verified affiliate-enabled. */
export const AFFILIATE_COMMERCE_REL = "noopener noreferrer sponsored nofollow";

export function availabilityLabel(status) {
    return COMMERCE_AVAILABILITY_LABELS[status] || status;
}

/**
 * External commercial destinations must be https only.
 * Rejects javascript:, data:, http:, and malformed URLs.
 */
export function isSafeExternalCommerceUrl(url) {
    if (typeof url !== "string" || !url.trim()) return false;
    try {
        const parsed = new URL(url);
        return parsed.protocol === "https:";
    } catch {
        return false;
    }
}

/**
 * Purchase CTAs are only allowed when availability is AVAILABLE and a real
 * https destination URL exists. Never invent Buy for COMING_SOON / IN_DEVELOPMENT.
 */
export function canShowPurchaseCta({ availability, destinationUrl } = {}) {
    return (
        availability === COMMERCE_AVAILABILITY.AVAILABLE &&
        isSafeExternalCommerceUrl(destinationUrl)
    );
}

export function isExternalDestination(destinationType) {
    return (
        destinationType === DESTINATION_TYPES.EXTERNAL_RETAILER ||
        destinationType === DESTINATION_TYPES.AFFILIATE
    );
}

/**
 * Strip PII-like keys from analytics payloads. Never send email/name/phone/address.
 */
export function sanitizeCommerceAnalyticsParams(params = {}) {
    const blocked = new Set([
        "email",
        "email_address",
        "name",
        "full_name",
        "first_name",
        "last_name",
        "phone",
        "phone_number",
        "address",
        "street",
        "street_address",
        "card",
        "payment",
    ]);
    const out = {};
    for (const [key, value] of Object.entries(params)) {
        if (blocked.has(String(key).toLowerCase())) continue;
        if (value === undefined || value === null || value === "") continue;
        out[key] = value;
    }
    return out;
}

export function destinationHostFromUrl(url) {
    if (!url || typeof url !== "string") return null;
    try {
        return new URL(url).hostname;
    } catch {
        return null;
    }
}
