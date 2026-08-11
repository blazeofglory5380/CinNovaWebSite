/**
 * Phase M2 — checkout flow orchestration (test-mode ready, fail closed).
 * Success requires verified server payment state — never browser alone.
 */

import { createEmptyCart } from "./checkoutArchitecture.js";
import { quoteServerCheckout, createPaymentSessionFromQuote } from "./serverPricing.js";
import {
    ORDER_STATES,
    createOrderRecord,
    transitionOrder,
    getOrderById,
} from "./orderModel.js";
import { resolvePaymentMode, PAYMENT_MODES, canCreateTestCheckoutSession } from "./paymentMode.js";
import { grantEntitlementFromPaidOrder } from "./entitlementGrants.js";

export const CHECKOUT_FLOW_STATES = Object.freeze({
    CART: "cart",
    CHECKOUT: "checkout",
    PROCESSING: "processing",
    SUCCESS: "success",
    FAILURE: "failure",
    CANCELLED: "cancelled",
    RETRY: "retry",
});

export function createCartState(items = []) {
    const cart = createEmptyCart();
    return {
        ...cart,
        items: items.map((i) => ({
            productId: i.productId,
            quantity: Number(i.quantity) || 1,
        })),
    };
}

export function updateCartQuantity(cart, productId, quantity) {
    const items = cart.items
        .map((i) => (i.productId === productId ? { ...i, quantity } : i))
        .filter((i) => i.quantity > 0);
    return { ...cart, items, updatedAt: new Date().toISOString() };
}

export function removeCartItem(cart, productId) {
    return {
        ...cart,
        items: cart.items.filter((i) => i.productId !== productId),
        updatedAt: new Date().toISOString(),
    };
}

export function beginServerCheckout({
    cart,
    customerId,
    couponCode = "",
    serverCouponRecord = null,
    paymentMode = resolvePaymentMode(),
    taxConfigured = false,
    taxCents = null,
} = {}) {
    if (!cart?.items?.length) {
        return { ok: false, error: "EMPTY_CART", state: CHECKOUT_FLOW_STATES.CART };
    }

    const quoteResult = quoteServerCheckout({
        items: cart.items,
        couponCode,
        serverCouponRecord,
        paymentMode,
        taxConfigured,
        taxCents,
    });
    if (!quoteResult.ok) {
        return {
            ok: false,
            error: quoteResult.error,
            state: CHECKOUT_FLOW_STATES.FAILURE,
            quote: quoteResult.quote,
        };
    }

    const orderId = `ord_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    createOrderRecord({
        orderId,
        customerId,
        lineItems: quoteResult.quote.lineItems,
        subtotalCents: quoteResult.quote.subtotalCents,
        discountCents: quoteResult.quote.discountCents,
        taxCents: quoteResult.quote.taxCents,
        totalCents: quoteResult.quote.totalCents,
        currency: quoteResult.quote.currency,
        status: ORDER_STATES.PAYMENT_PENDING,
    });

    const session = createPaymentSessionFromQuote({
        quote: quoteResult.quote,
        paymentMode,
        providerConfirmed: paymentMode === PAYMENT_MODES.TEST && canCreateTestCheckoutSession(paymentMode),
    });

    if (!session.ok) {
        transitionOrder(orderId, ORDER_STATES.FAILED, { providerVerified: true });
        return {
            ok: false,
            error: session.error,
            state: CHECKOUT_FLOW_STATES.FAILURE,
            orderId,
        };
    }

    return {
        ok: true,
        error: null,
        state: CHECKOUT_FLOW_STATES.PROCESSING,
        orderId,
        quote: quoteResult.quote,
        session: session.session,
        fakeSuccessForbidden: true,
    };
}

/**
 * Complete checkout only with provider-verified payment (webhook/session retrieve).
 */
export function completeCheckoutFromProvider({
    orderId,
    providerVerified = false,
    cancelled = false,
    failed = false,
} = {}) {
    if (cancelled) {
        const t = transitionOrder(orderId, ORDER_STATES.CANCELLED, { providerVerified: true });
        return {
            ok: t.ok,
            state: CHECKOUT_FLOW_STATES.CANCELLED,
            error: t.error,
            order: getOrderById(orderId),
        };
    }
    if (failed) {
        const t = transitionOrder(orderId, ORDER_STATES.FAILED, { providerVerified: true });
        return {
            ok: t.ok,
            state: CHECKOUT_FLOW_STATES.FAILURE,
            error: t.error,
            order: getOrderById(orderId),
        };
    }
    if (!providerVerified) {
        return {
            ok: false,
            state: CHECKOUT_FLOW_STATES.FAILURE,
            error: "PROVIDER_VERIFICATION_REQUIRED",
            message: "No fake success. Browser redirect alone cannot complete checkout.",
            order: getOrderById(orderId),
        };
    }

    const paid = transitionOrder(orderId, ORDER_STATES.PAID, { providerVerified: true });
    if (!paid.ok) {
        return {
            ok: false,
            state: CHECKOUT_FLOW_STATES.FAILURE,
            error: paid.error,
            order: paid.order,
        };
    }

    const order = paid.order;
    const grants = (order.lineItems || []).map((line) =>
        grantEntitlementFromPaidOrder({
            orderId,
            productId: line.productId,
            customerId: order.customerId,
        }),
    );

    transitionOrder(orderId, ORDER_STATES.FULFILLING, { providerVerified: true });
    transitionOrder(orderId, ORDER_STATES.FULFILLED, { providerVerified: true });

    return {
        ok: true,
        state: CHECKOUT_FLOW_STATES.SUCCESS,
        error: null,
        order: getOrderById(orderId),
        entitlements: grants,
    };
}

export function retryCheckout(previous) {
    return {
        ok: true,
        state: CHECKOUT_FLOW_STATES.RETRY,
        previousOrderId: previous?.orderId || null,
        message: "Retry returns customer to checkout with a fresh server quote.",
    };
}
