/**
 * Phase M3 — commerce email log sink.
 * Never send real external mail unless COMMERCE_EMAIL_DELIVERY=external and configured.
 */

export const COMMERCE_EMAIL_TYPES = Object.freeze({
    ORDER_CONFIRMATION: "order_confirmation",
    DOWNLOAD_LINK: "download_link",
    REFUND_CONFIRMATION: "refund_confirmation",
    PAYMENT_FAILED: "payment_failed",
});

const SINK = [];

export function clearCommerceEmailSink() {
    SINK.length = 0;
}

export function listCommerceEmails() {
    return [...SINK];
}

export function queueCommerceEmail({
    type,
    to = "",
    orderId = "",
    env = typeof process !== "undefined" ? process.env : {},
} = {}) {
    if (!Object.values(COMMERCE_EMAIL_TYPES).includes(type)) {
        return { ok: false, error: "INVALID_EMAIL_TYPE", delivered: false };
    }
    const delivery = String(env.COMMERCE_EMAIL_DELIVERY || "sink").toLowerCase();
    const entry = {
        type,
        to: String(to).slice(0, 254),
        orderId,
        at: new Date().toISOString(),
        sink: true,
        externalSent: false,
    };
    SINK.push(entry);

    if (delivery === "external") {
        return {
            ok: false,
            error: "EXTERNAL_EMAIL_NOT_CONFIGURED_FOR_TESTS",
            delivered: false,
            entry,
            message: "External send blocked unless explicitly configured outside tests.",
        };
    }

    return { ok: true, error: null, delivered: true, channel: "sink", entry };
}
