/**
 * Phase M2 — revenue analytics channel separation.
 * REAL, TEST, and DEMO must never be combined.
 */

export const REVENUE_DATA_CHANNELS = Object.freeze({
    REAL: "REAL",
    TEST: "TEST",
    DEMO: "DEMO",
});

const CHANNEL_EVENTS = {
    REAL: [],
    TEST: [],
    DEMO: [],
};

export function clearRevenueAnalyticsStores() {
    CHANNEL_EVENTS.REAL.length = 0;
    CHANNEL_EVENTS.TEST.length = 0;
    CHANNEL_EVENTS.DEMO.length = 0;
}

const ALLOWED_FUNNEL_EVENTS = Object.freeze([
    "product_view",
    "product_cta_click",
    "add_to_cart",
    "checkout_started",
    "checkout_completed",
    "affiliate_link_click",
    "newsletter_signup",
    "sponsor_inquiry",
    "app_cta_click",
    "book_cta_click",
]);

const FORBIDDEN_PARAM_KEYS = Object.freeze([
    "card",
    "cardNumber",
    "cvc",
    "cvv",
    "pan",
    "secret",
    "stripeSecret",
    "payment_secret",
    "scanner",
    "health",
    "ssn",
    "password",
]);

export function sanitizeRevenueEventParams(params = {}) {
    const out = {};
    for (const [key, value] of Object.entries(params)) {
        if (FORBIDDEN_PARAM_KEYS.some((f) => key.toLowerCase().includes(f.toLowerCase()))) {
            continue;
        }
        if (typeof value === "string") {
            out[key] = value.slice(0, 120);
        } else if (typeof value === "number" || typeof value === "boolean") {
            out[key] = value;
        }
    }
    return out;
}

export function recordRevenueFunnelEvent({
    eventName,
    channel = REVENUE_DATA_CHANNELS.TEST,
    params = {},
} = {}) {
    if (!ALLOWED_FUNNEL_EVENTS.includes(eventName)) {
        return { ok: false, error: "EVENT_NOT_ALLOWED" };
    }
    if (!Object.values(REVENUE_DATA_CHANNELS).includes(channel)) {
        return { ok: false, error: "INVALID_CHANNEL" };
    }
    const entry = {
        eventName,
        channel,
        params: sanitizeRevenueEventParams(params),
        at: new Date().toISOString(),
    };
    CHANNEL_EVENTS[channel].push(entry);
    return { ok: true, error: null, entry };
}

export function getRevenueChannelSnapshot(channel) {
    if (!REVENUE_DATA_CHANNELS[channel] && !Object.values(REVENUE_DATA_CHANNELS).includes(channel)) {
        return { ok: false, error: "INVALID_CHANNEL", events: [] };
    }
    return {
        ok: true,
        channel,
        events: [...CHANNEL_EVENTS[channel]],
        combinedWithOthers: false,
    };
}

export function assertChannelsNotCombined(report) {
    const channels = new Set((report?.series || []).map((s) => s.channel));
    if (channels.size > 1) {
        return { ok: false, error: "CHANNELS_COMBINED" };
    }
    return { ok: true, error: null };
}

export { ALLOWED_FUNNEL_EVENTS, FORBIDDEN_PARAM_KEYS };
