/**
 * Phase M1 — checkout / cart / order architecture (fail closed).
 * No fake successful purchases. Provider disabled → all mutations reject.
 */

import { MONETIZATION_FLAGS, isCheckoutLive } from "../../monetizationFlags.js";

export const CHECKOUT_STATES = Object.freeze({
    IDLE: "idle",
    CART: "cart",
    CHECKOUT: "checkout",
    PROCESSING: "processing",
    SUCCESS: "success",
    FAILURE: "failure",
    CANCELLED: "cancelled",
    RETRY: "retry",
});

export function createEmptyCart() {
    return {
        items: [],
        currency: "USD",
        subtotal: 0,
        taxPlaceholder: 0,
        discount: 0,
        total: 0,
        couponCode: null,
        updatedAt: new Date().toISOString(),
    };
}

/**
 * Server-trust model: client totals are never authoritative.
 * When payments/checkout are off, every mutating call fails closed.
 */
export function assertCheckoutAllowed() {
    if (!isCheckoutLive()) {
        return {
            ok: false,
            error: "CHECKOUT_DISABLED",
            message: "Checkout and payments are disabled. No purchase can complete.",
        };
    }
    if (!MONETIZATION_FLAGS.store) {
        return {
            ok: false,
            error: "STORE_DISABLED",
            message: "Store is disabled.",
        };
    }
    return { ok: true, error: null, message: null };
}

export function applyCouponArchitecture({ cart, couponCode, serverValidated = false } = {}) {
    const gate = assertCheckoutAllowed();
    if (!gate.ok) return { ...gate, cart };
    if (!serverValidated) {
        return {
            ok: false,
            error: "COUPON_REQUIRES_SERVER_VALIDATION",
            message: "Coupons must be validated server-side. Client cannot apply discounts.",
            cart,
        };
    }
    return {
        ok: true,
        cart: {
            ...cart,
            couponCode: couponCode || null,
        },
        message: "Coupon accepted (architecture path only).",
    };
}

export function beginCheckoutArchitecture({ cart } = {}) {
    const gate = assertCheckoutAllowed();
    if (!gate.ok) {
        return {
            ...gate,
            state: CHECKOUT_STATES.FAILURE,
            orderId: null,
            fakeSuccessForbidden: true,
        };
    }
    if (!cart?.items?.length) {
        return {
            ok: false,
            error: "EMPTY_CART",
            state: CHECKOUT_STATES.CART,
            orderId: null,
            fakeSuccessForbidden: true,
        };
    }
    return {
        ok: true,
        state: CHECKOUT_STATES.CHECKOUT,
        orderId: null,
        fakeSuccessForbidden: true,
        message: "Checkout session architecture ready — provider must confirm payment.",
    };
}

export function completePurchaseArchitecture({ providerConfirmed = false } = {}) {
    const gate = assertCheckoutAllowed();
    if (!gate.ok) {
        return { ...gate, state: CHECKOUT_STATES.FAILURE, purchaseCompleted: false };
    }
    if (!providerConfirmed) {
        return {
            ok: false,
            error: "PROVIDER_NOT_CONFIRMED",
            state: CHECKOUT_STATES.FAILURE,
            purchaseCompleted: false,
            message: "No fake successful purchases. Provider confirmation required.",
        };
    }
    return {
        ok: true,
        state: CHECKOUT_STATES.SUCCESS,
        purchaseCompleted: true,
    };
}

export const TAX_ARCHITECTURE = Object.freeze({
    enabled: false,
    placeholder: true,
    note: "Tax calculation reserved for provider/tax service activation.",
});
