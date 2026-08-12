/**
 * Phase M2 — canonical order model.
 * Never store raw card data. Totals are server-authoritative only.
 */

export const ORDER_STATES = Object.freeze({
    PENDING: "PENDING",
    PAYMENT_PENDING: "PAYMENT_PENDING",
    PAID: "PAID",
    FULFILLING: "FULFILLING",
    FULFILLED: "FULFILLED",
    FAILED: "FAILED",
    CANCELLED: "CANCELLED",
    REFUND_PENDING: "REFUND_PENDING",
    REFUNDED: "REFUNDED",
    PARTIALLY_REFUNDED: "PARTIALLY_REFUNDED",
    DISPUTED: "DISPUTED",
});

export const ORDER_STATE_LIST = Object.freeze(Object.values(ORDER_STATES));

/** Allowed transitions (fail closed on illegal moves). */
const TRANSITIONS = Object.freeze({
    [ORDER_STATES.PENDING]: [ORDER_STATES.PAYMENT_PENDING, ORDER_STATES.CANCELLED, ORDER_STATES.FAILED],
    [ORDER_STATES.PAYMENT_PENDING]: [
        ORDER_STATES.PAID,
        ORDER_STATES.FAILED,
        ORDER_STATES.CANCELLED,
    ],
    [ORDER_STATES.PAID]: [
        ORDER_STATES.FULFILLING,
        ORDER_STATES.REFUND_PENDING,
        ORDER_STATES.DISPUTED,
    ],
    [ORDER_STATES.FULFILLING]: [
        ORDER_STATES.FULFILLED,
        ORDER_STATES.REFUND_PENDING,
        ORDER_STATES.FAILED,
    ],
    [ORDER_STATES.FULFILLED]: [
        ORDER_STATES.REFUND_PENDING,
        ORDER_STATES.DISPUTED,
    ],
    [ORDER_STATES.FAILED]: [],
    [ORDER_STATES.CANCELLED]: [],
    [ORDER_STATES.REFUND_PENDING]: [
        ORDER_STATES.REFUNDED,
        ORDER_STATES.PARTIALLY_REFUNDED,
        ORDER_STATES.FAILED,
    ],
    [ORDER_STATES.REFUNDED]: [],
    [ORDER_STATES.PARTIALLY_REFUNDED]: [
        ORDER_STATES.REFUND_PENDING,
        ORDER_STATES.REFUNDED,
    ],
    [ORDER_STATES.DISPUTED]: [
        ORDER_STATES.REFUNDED,
        ORDER_STATES.PARTIALLY_REFUNDED,
        ORDER_STATES.FULFILLED,
    ],
});

/** In-memory architecture store — not production persistence. */
const ORDER_STORE = new Map();

export function createOrderRecord({
    orderId,
    customerId = null,
    guestEmail = null,
    lineItems = [],
    subtotalCents = 0,
    discountCents = 0,
    taxCents = 0,
    totalCents = 0,
    currency = "USD",
    paymentProviderRef = null,
    paymentMode = "TEST",
    channel = "TEST",
    status = ORDER_STATES.PENDING,
    createdAt = null,
    updatedAt = null,
} = {}) {
    if (!orderId) throw new Error("orderId required");
    if (!ORDER_STATE_LIST.includes(status)) throw new Error("invalid order status");
    if (totalCents < 0) throw new Error("negative total rejected");

    const now = new Date().toISOString();
    const record = Object.freeze({
        orderId,
        customerId,
        guestEmail: guestEmail ? String(guestEmail).slice(0, 254) : null,
        lineItems: Object.freeze(lineItems.map((l) => Object.freeze({ ...l }))),
        subtotalCents,
        discountCents,
        taxCents,
        totalCents,
        currency,
        paymentProviderRef,
        paymentMode,
        channel,
        status,
        createdAt: createdAt || now,
        updatedAt: updatedAt || now,
        // Never store card / PAN / CVC.
        paymentMethodSummary: null,
        rawCardDataForbidden: true,
    });
    ORDER_STORE.set(orderId, record);
    return record;
}

export function getOrderById(orderId) {
    return ORDER_STORE.get(orderId) || null;
}

export function listOrders() {
    return [...ORDER_STORE.values()];
}

export function clearOrderStore() {
    ORDER_STORE.clear();
}

export function canTransitionOrder(from, to) {
    return (TRANSITIONS[from] || []).includes(to);
}

export function transitionOrder(orderId, nextStatus, { providerVerified = false } = {}) {
    const current = ORDER_STORE.get(orderId);
    if (!current) return { ok: false, error: "ORDER_NOT_FOUND", order: null };

    if (!canTransitionOrder(current.status, nextStatus)) {
        return { ok: false, error: "ILLEGAL_TRANSITION", order: current };
    }

    // Browser redirect alone cannot mark PAID.
    if (nextStatus === ORDER_STATES.PAID && !providerVerified) {
        return { ok: false, error: "PROVIDER_VERIFICATION_REQUIRED", order: current };
    }

    const updated = Object.freeze({
        ...current,
        status: nextStatus,
        updatedAt: new Date().toISOString(),
    });
    ORDER_STORE.set(orderId, updated);
    return { ok: true, error: null, order: updated };
}

/**
 * Prevent trivial order-id enumeration in public APIs.
 * Public lookups require customer/session binding (architecture rule).
 */
export function authorizeOrderLookup({
    orderId,
    requesterCustomerId = null,
    adminAuthorized = false,
} = {}) {
    const order = getOrderById(orderId);
    if (!order) return { ok: false, error: "NOT_FOUND", order: null };
    if (adminAuthorized) return { ok: true, error: null, order };
    if (!requesterCustomerId || requesterCustomerId !== order.customerId) {
        return { ok: false, error: "FORBIDDEN", order: null };
    }
    return { ok: true, error: null, order };
}
