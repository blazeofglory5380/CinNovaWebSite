/**
 * Phase M2 — server-authoritative pricing.
 * Browser must never determine the final charge.
 *
 * Client may send: productId, quantity, couponCode.
 * Server alone: lookup product/price, validate, tax placeholder, totals.
 */

import { getCommerceProductById, getCommerceProductBySlug } from "./productCatalog.js";
import { RECORD_KINDS } from "./constants.js";
import { canChargeCustomers, PAYMENT_MODES, resolvePaymentMode } from "./paymentMode.js";

/** Architecture / test price book — not live offers. Amounts in minor units (cents). */
export const TEST_PRICE_BOOK = Object.freeze({
    // Intentionally empty for public catalog — no invented live SKUs.
    // Harness may register ephemeral test products via createTestPriceEntry.
});

const ephemeralTestPrices = new Map();

export function registerEphemeralTestPrice(entry) {
    if (!entry?.productId || entry.unitAmountCents == null) {
        throw new Error("Test price requires productId and unitAmountCents");
    }
    if (entry.unitAmountCents < 0) throw new Error("unitAmountCents must be >= 0");
    ephemeralTestPrices.set(entry.productId, Object.freeze({
        productId: entry.productId,
        currency: entry.currency || "USD",
        unitAmountCents: Math.floor(Number(entry.unitAmountCents)),
        available: entry.available !== false,
        label: entry.label || "test",
    }));
    return ephemeralTestPrices.get(entry.productId);
}

export function clearEphemeralTestPrices() {
    ephemeralTestPrices.clear();
}

export function lookupCanonicalPrice(productId, { paymentMode = resolvePaymentMode() } = {}) {
    if (!productId) return null;
    const ephemeral = ephemeralTestPrices.get(productId);
    // Ephemeral entries are harness-only SKUs registered in-process — never public catalog.
    if (ephemeral) return ephemeral;
    void paymentMode;
    const book = TEST_PRICE_BOOK[productId];
    return book || null;
}

function resolveProduct(productIdOrSlug) {
    return (
        getCommerceProductById(productIdOrSlug)
        || getCommerceProductBySlug(productIdOrSlug)
        || null
    );
}

/**
 * Validate coupon architecture. No live coupons — expire/reject unless
 * serverValidated fixture explicitly provided for TEST harness.
 */
export function validateServerCoupon({
    code = "",
    serverCouponRecord = null,
    now = Date.now(),
} = {}) {
    if (!code) {
        return { ok: true, discountCents: 0, coupon: null, error: null };
    }
    if (!serverCouponRecord || serverCouponRecord.code !== code) {
        return {
            ok: false,
            discountCents: 0,
            coupon: null,
            error: "COUPON_INVALID",
        };
    }
    if (serverCouponRecord.expiresAt && Date.parse(serverCouponRecord.expiresAt) < now) {
        return {
            ok: false,
            discountCents: 0,
            coupon: null,
            error: "COUPON_EXPIRED",
        };
    }
    if (serverCouponRecord.disabled) {
        return {
            ok: false,
            discountCents: 0,
            coupon: null,
            error: "COUPON_DISABLED",
        };
    }
    const discountCents = Math.max(0, Math.floor(Number(serverCouponRecord.discountCents) || 0));
    return {
        ok: true,
        discountCents,
        coupon: { code: serverCouponRecord.code, discountCents },
        error: null,
    };
}

/**
 * Server quote. Rejects client-supplied price/salePrice/total.
 */
export function quoteServerCheckout({
    items = [],
    couponCode = "",
    clientPrice = undefined,
    clientSalePrice = undefined,
    clientTotal = undefined,
    serverCouponRecord = null,
    taxCents = null,
    paymentMode = resolvePaymentMode(),
    taxConfigured = false,
} = {}) {
    if (clientPrice !== undefined || clientSalePrice !== undefined || clientTotal !== undefined) {
        return {
            ok: false,
            error: "CLIENT_PRICE_REJECTED",
            message: "Client-supplied prices are never trusted.",
            quote: null,
        };
    }

    if (!Array.isArray(items) || items.length === 0) {
        return { ok: false, error: "EMPTY_CART", message: "Cart is empty.", quote: null };
    }

    const lineItems = [];
    for (const raw of items) {
        const productId = String(raw.productId || raw.id || "").trim();
        const quantity = Number(raw.quantity);
        if (!productId) {
            return { ok: false, error: "UNKNOWN_PRODUCT", message: "Missing productId.", quote: null };
        }
        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
            return { ok: false, error: "INVALID_QUANTITY", message: `Invalid quantity for ${productId}.`, quote: null };
        }

        const product = resolveProduct(productId);
        const price = lookupCanonicalPrice(productId, { paymentMode });

        // Architecture placeholders / unknown / no price → reject for charge.
        if (!price || price.available === false) {
            return {
                ok: false,
                error: "PRODUCT_UNAVAILABLE",
                message: `No chargeable price for ${productId}.`,
                quote: null,
            };
        }
        if (product && product.recordKind === RECORD_KINDS.ARCHITECTURE_PLACEHOLDER) {
            return {
                ok: false,
                error: "PRODUCT_DISABLED",
                message: `Product ${productId} is not purchasable.`,
                quote: null,
            };
        }
        if (product && product.commerceEligible === false && paymentMode !== PAYMENT_MODES.TEST) {
            // Hosted commerce remains ineligible outside explicit TEST harness prices.
            return {
                ok: false,
                error: "PRODUCT_DISABLED",
                message: `Hosted commerce disabled for ${productId}.`,
                quote: null,
            };
        }

        const unit = price.unitAmountCents;
        lineItems.push({
            productId,
            quantity,
            unitAmountCents: unit,
            lineTotalCents: unit * quantity,
            currency: price.currency || "USD",
        });
    }

    const currencies = new Set(lineItems.map((l) => l.currency));
    if (currencies.size !== 1) {
        return { ok: false, error: "CURRENCY_MISMATCH", message: "Mixed currencies rejected.", quote: null };
    }
    const currency = [...currencies][0];

    const subtotalCents = lineItems.reduce((sum, l) => sum + l.lineTotalCents, 0);
    const couponResult = validateServerCoupon({ code: couponCode, serverCouponRecord });
    if (!couponResult.ok) {
        return {
            ok: false,
            error: couponResult.error,
            message: "Coupon rejected.",
            quote: null,
        };
    }

    const discountCents = Math.min(subtotalCents, couponResult.discountCents);
    const afterDiscount = subtotalCents - discountCents;

    // Tax: never invent rates. Null tax until provider configured.
    let resolvedTax = 0;
    let taxStatus = "not_configured";
    if (taxConfigured && taxCents != null && Number.isFinite(Number(taxCents)) && Number(taxCents) >= 0) {
        resolvedTax = Math.floor(Number(taxCents));
        taxStatus = "provider_supplied";
    } else if (taxCents != null && !taxConfigured) {
        return {
            ok: false,
            error: "TAX_NOT_CONFIGURED",
            message: "Tax amounts rejected until a real tax provider is configured.",
            quote: null,
        };
    }

    const totalCents = afterDiscount + resolvedTax;
    if (totalCents < 0) {
        return { ok: false, error: "NEGATIVE_TOTAL", message: "Negative totals rejected.", quote: null };
    }

    const quote = {
        lineItems,
        currency,
        subtotalCents,
        discountCents,
        taxCents: resolvedTax,
        taxStatus,
        totalCents,
        coupon: couponResult.coupon,
        paymentMode,
        canCharge: canChargeCustomers(paymentMode) && taxStatus !== "blocked",
        serverAuthoritative: true,
        createdAt: new Date().toISOString(),
    };

    // Live sales blocked without tax configuration (explicit product requirement).
    if (paymentMode === PAYMENT_MODES.LIVE && taxStatus === "not_configured") {
        return {
            ok: false,
            error: "TAX_BLOCKS_LIVE",
            message: "LIVE payment activation blocked until tax is configured.",
            quote,
        };
    }

    return { ok: true, error: null, message: null, quote };
}

export function createPaymentSessionFromQuote({
    quote = null,
    paymentMode = resolvePaymentMode(),
    providerConfirmed = false,
} = {}) {
    if (!quote) {
        return { ok: false, error: "NO_QUOTE", session: null };
    }
    if (paymentMode === PAYMENT_MODES.UNCONFIGURED) {
        return { ok: false, error: "PAYMENTS_UNCONFIGURED", session: null };
    }
    if (paymentMode === PAYMENT_MODES.LIVE_DISABLED) {
        return { ok: false, error: "LIVE_DISABLED", session: null };
    }
    if (paymentMode === PAYMENT_MODES.LIVE && !providerConfirmed) {
        return { ok: false, error: "LIVE_NOT_APPROVED", session: null };
    }
    if (paymentMode === PAYMENT_MODES.TEST && !canChargeCustomers(paymentMode)) {
        return { ok: false, error: "TEST_CREDENTIALS_MISSING", session: null };
    }
    // Architecture session id only — no real provider call without credentials adapter.
    return {
        ok: true,
        error: null,
        session: {
            id: `sess_arch_${Date.now()}`,
            status: "requires_provider",
            amountTotal: quote.totalCents,
            currency: quote.currency,
            mode: paymentMode,
            fakeSuccessForbidden: true,
        },
    };
}
