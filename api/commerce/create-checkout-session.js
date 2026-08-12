/**
 * Phase M3 — checkout session API with Stripe TEST wiring.
 * Fail closed without test credentials. No client prices. No secrets in responses.
 */

import {
    resolvePaymentMode,
    PAYMENT_MODES,
} from "../../src/data/commerce/platform/paymentMode.js";
import { beginServerCheckout, createCartState } from "../../src/data/commerce/platform/checkoutFlow.js";
import { isTaxConfigured, assertTaxAllowsLiveSales } from "../../src/data/commerce/platform/taxArchitecture.js";
import {
    createStripeCheckoutSession,
    resolveStripeTestSecret,
} from "../../src/data/commerce/platform/stripeTestClient.js";
import { queueCommerceEmail, COMMERCE_EMAIL_TYPES } from "../../src/data/commerce/platform/commerceEmail.js";
import { assertSafeReturnUrl } from "../../src/data/commerce/platform/securityGuards.js";

function json(res, status, body) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.end(JSON.stringify(body));
}

function readJson(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        req.on("data", (c) => chunks.push(c));
        req.on("end", () => {
            try {
                resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"));
            } catch (error) {
                reject(error);
            }
        });
        req.on("error", reject);
    });
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return json(res, 405, { ok: false, error: "METHOD_NOT_ALLOWED" });
    }

    const mode = resolvePaymentMode(process.env);
    if (mode === PAYMENT_MODES.UNCONFIGURED) {
        return json(res, 503, { ok: false, error: "PAYMENTS_UNCONFIGURED" });
    }
    if (mode === PAYMENT_MODES.LIVE_DISABLED) {
        return json(res, 403, { ok: false, error: "LIVE_DISABLED" });
    }
    if (mode === PAYMENT_MODES.LIVE) {
        const taxOk = assertTaxAllowsLiveSales({
            taxConfigured: isTaxConfigured({
                stripeTaxEnabled: process.env.STRIPE_TAX_ENABLED === "true",
            }),
        });
        if (!taxOk.ok) {
            return json(res, 403, { ok: false, error: taxOk.error, message: taxOk.message });
        }
    }

    let body;
    try {
        body = await readJson(req);
    } catch {
        return json(res, 400, { ok: false, error: "INVALID_JSON" });
    }

    if (body.price != null || body.salePrice != null || body.total != null) {
        return json(res, 400, { ok: false, error: "CLIENT_PRICE_REJECTED" });
    }

    if (body.successUrl) {
        const safeSuccess = assertSafeReturnUrl(body.successUrl);
        if (!safeSuccess.ok) return json(res, 400, { ok: false, error: safeSuccess.error });
    }
    if (body.cancelUrl) {
        const safeCancel = assertSafeReturnUrl(body.cancelUrl);
        if (!safeCancel.ok) return json(res, 400, { ok: false, error: safeCancel.error });
    }

    const taxConfigured = isTaxConfigured({
        stripeTaxEnabled: process.env.STRIPE_TAX_ENABLED === "true",
    });
    const cart = createCartState(body.items || []);
    const result = beginServerCheckout({
        cart,
        customerId: body.customerId || null,
        couponCode: body.couponCode || "",
        paymentMode: mode,
        taxConfigured,
        taxCents: taxConfigured ? Number(body.taxCents) || 0 : null,
    });
    if (!result.ok) {
        return json(res, 400, { ok: false, error: result.error, state: result.state });
    }

    let stripeSession = null;
    const testSecret = resolveStripeTestSecret(process.env);
    if (mode === PAYMENT_MODES.TEST && testSecret.ok) {
        const created = await createStripeCheckoutSession({
            env: process.env,
            quote: result.quote,
            orderId: result.orderId,
            customerId: body.customerId || null,
            successUrl: body.successUrl,
            cancelUrl: body.cancelUrl,
        });
        if (!created.ok) {
            return json(res, 502, {
                ok: false,
                error: created.error,
                orderId: result.orderId,
                keyPrefix: testSecret.keyPrefix,
            });
        }
        stripeSession = {
            idPrefix: created.session.idPrefix,
            url: created.session.url,
            status: created.session.status,
        };
    }

    queueCommerceEmail({
        type: COMMERCE_EMAIL_TYPES.ORDER_CONFIRMATION,
        to: body.email || "",
        orderId: result.orderId,
    });

    return json(res, 200, {
        ok: true,
        mode,
        orderId: result.orderId,
        quote: result.quote,
        stripe: stripeSession,
        credentials: testSecret.ok ? "test" : "absent",
        fakeSuccessForbidden: true,
        paid: false,
        message: stripeSession
            ? "Stripe TEST Checkout Session created. Order remains unpaid until webhook."
            : "Architecture checkout ready. Stripe TEST credentials not present — provider session skipped.",
    });
}
