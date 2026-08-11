/**
 * Phase M1 — coupon architecture (server-validated only).
 */

import { assertCheckoutAllowed } from "./checkoutArchitecture.js";

export function validateCouponArchitecture({
    code = "",
    serverValidated = false,
    cartSubtotal = 0,
} = {}) {
    const gate = assertCheckoutAllowed();
    if (!gate.ok) {
        return { ...gate, discount: 0, coupon: null };
    }
    if (!serverValidated) {
        return {
            ok: false,
            error: "COUPON_REQUIRES_SERVER_VALIDATION",
            discount: 0,
            coupon: null,
            message: "Client cannot trust coupon codes. Server validation required.",
        };
    }
    if (!code) {
        return { ok: false, error: "EMPTY_CODE", discount: 0, coupon: null };
    }
    return {
        ok: true,
        discount: 0,
        coupon: { code: String(code).slice(0, 40), cartSubtotal },
        message: "Architecture path — live coupon engine not activated.",
    };
}
