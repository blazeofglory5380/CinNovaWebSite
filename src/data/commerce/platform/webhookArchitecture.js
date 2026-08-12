/**
 * Phase M2 — payment webhook architecture.
 * No production endpoint activation. Signature verification required.
 */

import { ORDER_STATES, transitionOrder, getOrderById } from "./orderModel.js";
import { grantEntitlementFromPaidOrder, listGrantedEntitlements } from "./entitlementGrants.js";
import { verifyStripeWebhookSignature } from "./stripeTestClient.js";

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
    verifier = null,
    nowSeconds = Math.floor(Date.now() / 1000),
    toleranceSeconds = 300,
} = {}) {
    if (typeof verifier === "function") {
        try {
            const valid = verifier({ payload, signatureHeader, secret });
            return valid ? { ok: true, error: null } : { ok: false, error: "SIGNATURE_INVALID" };
        } catch {
            return { ok: false, error: "SIGNATURE_VERIFY_FAILED" };
        }
    }
    return verifyStripeWebhookSignature({
        payload,
        signatureHeader,
        secret,
        nowSeconds,
        toleranceSeconds,
    });
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
    let entitlements = [];
    if (orderId && (eventType === "checkout.session.completed" || eventType === "payment_intent.succeeded")) {
        transition = transitionOrder(orderId, ORDER_STATES.PAID, { providerVerified: true });
        if (!transition.ok && transition.error === "ILLEGAL_TRANSITION") {
            return { ok: true, error: null, duplicate: true, transition, entitlements };
        }
        if (transition.ok) {
            const order = getOrderById(orderId);
            const existing = listGrantedEntitlements().filter((e) => e.orderId === orderId);
            if (existing.length === 0 && order) {
                entitlements = (order.lineItems || []).map((line) =>
                    grantEntitlementFromPaidOrder({
                        orderId,
                        productId: line.productId,
                        customerId: order.customerId,
                    }),
                );
            }
        }
    }
    if (orderId && eventType === "payment_intent.payment_failed") {
        transition = transitionOrder(orderId, ORDER_STATES.FAILED, { providerVerified: true });
    }
    if (orderId && eventType === "charge.refunded") {
        const current = getOrderById(orderId);
        if (current && current.status !== ORDER_STATES.REFUND_PENDING) {
            transitionOrder(orderId, ORDER_STATES.REFUND_PENDING, { providerVerified: true });
        }
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
        entitlements,
        log: sanitizeWebhookLog({ eventId, eventType, orderId }),
    };
}

export function browserRedirectAloneMarksPaid() {
    return false;
}
