/**
 * Phase M2 — payment webhook architecture.
 * No production endpoint activation. Signature verification required.
 */

import { ORDER_STATES, transitionOrder } from "./orderModel.js";

export const WEBHOOK_EVENT_ALLOWLIST = Object.freeze([
    "checkout.session.completed",
    "payment_intent.succeeded",
    "payment_intent.payment_failed",
    "charge.refunded",
    "charge.dispute.created",
]);

/** Processed event ids for idempotency (architecture memory). */
const processedEvents = new Set();

export function clearWebhookIdempotencyStore() {
    processedEvents.clear();
}

export function verifyWebhookSignature({
    payload = "",
    signatureHeader = "",
    secret = "",
    // Architecture verifier — production must use provider SDK.
    verifier = null,
} = {}) {
    if (!secret) {
        return { ok: false, error: "WEBHOOK_SECRET_MISSING" };
    }
    if (!signatureHeader) {
        return { ok: false, error: "SIGNATURE_MISSING" };
    }
    if (typeof verifier === "function") {
        try {
            const valid = verifier({ payload, signatureHeader, secret });
            return valid ? { ok: true, error: null } : { ok: false, error: "SIGNATURE_INVALID" };
        } catch {
            return { ok: false, error: "SIGNATURE_VERIFY_FAILED" };
        }
    }
    // Without a real verifier, never accept as valid in architecture path.
    return { ok: false, error: "VERIFIER_REQUIRED" };
}

export function assertWebhookEventAllowed(eventType) {
    if (!WEBHOOK_EVENT_ALLOWLIST.includes(eventType)) {
        return { ok: false, error: "EVENT_NOT_ALLOWED" };
    }
    return { ok: true, error: null };
}

/**
 * Safe log fields only — never log secrets, raw card data, or full PII payloads.
 */
export function sanitizeWebhookLog({ eventId = "", eventType = "", orderId = "" } = {}) {
    return {
        eventId: String(eventId).slice(0, 64),
        eventType: String(eventType).slice(0, 80),
        orderId: orderId ? String(orderId).slice(0, 64) : null,
        at: new Date().toISOString(),
    };
}

export function handleWebhookEventArchitecture({
    eventId = "",
    eventType = "",
    orderId = "",
    signatureOk = false,
    replayWindowOk = true,
} = {}) {
    if (!signatureOk) {
        return { ok: false, error: "SIGNATURE_INVALID", duplicate: false };
    }
    if (!replayWindowOk) {
        return { ok: false, error: "REPLAY_REJECTED", duplicate: false };
    }
    const allowed = assertWebhookEventAllowed(eventType);
    if (!allowed.ok) return { ...allowed, duplicate: false };

    if (!eventId) {
        return { ok: false, error: "EVENT_ID_REQUIRED", duplicate: false };
    }
    if (processedEvents.has(eventId)) {
        return { ok: true, error: null, duplicate: true, message: "Idempotent replay ignored." };
    }

    processedEvents.add(eventId);

    let transition = null;
    if (orderId && (eventType === "checkout.session.completed" || eventType === "payment_intent.succeeded")) {
        transition = transitionOrder(orderId, ORDER_STATES.PAID, { providerVerified: true });
        if (!transition.ok && transition.error === "ILLEGAL_TRANSITION") {
            // Already paid — treat as idempotent success path.
            return { ok: true, error: null, duplicate: false, transition };
        }
    }
    if (orderId && eventType === "payment_intent.payment_failed") {
        transition = transitionOrder(orderId, ORDER_STATES.FAILED, { providerVerified: true });
    }
    if (orderId && eventType === "charge.refunded") {
        transition = transitionOrder(orderId, ORDER_STATES.REFUNDED, { providerVerified: true });
    }
    if (orderId && eventType === "charge.dispute.created") {
        transition = transitionOrder(orderId, ORDER_STATES.DISPUTED, { providerVerified: true });
    }

    return {
        ok: true,
        error: null,
        duplicate: false,
        transition,
        log: sanitizeWebhookLog({ eventId, eventType, orderId }),
    };
}

export function browserRedirectAloneMarksPaid() {
    return false;
}
