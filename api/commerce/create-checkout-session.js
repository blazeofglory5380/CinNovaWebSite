/**
 * Phase M2 — fail-closed commerce API stubs.
 * No production activation. No secrets in repo.
 * LIVE charges require server payment mode gate (see paymentMode.js).
 */

import {
    resolvePaymentMode,
    PAYMENT_MODES,
    canCreateTestCheckoutSession,
} from "../../src/data/commerce/platform/paymentMode.js";
import { quoteServerCheckout, createPaymentSessionFromQuote } from "../../src/data/commerce/platform/serverPricing.js";
import { beginServerCheckout, createCartState } from "../../src/data/commerce/platform/checkoutFlow.js";
import { isTaxConfigured, assertTaxAllowsLiveSales } from "../../src/data/commerce/platform/taxArchitecture.js";

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
                const raw = Buffer.concat(chunks).toString("utf8") || "{}";
                resolve(JSON.parse(raw));
            } catch (error) {
                reject(error);
            }
        });
        req.on("error", reject);
    });
}

/**
 * POST /api/commerce/create-checkout-session
 * Body: { items, couponCode, customerId }
 */
export default async function handler(req, res) {
    if (req.method !== "POST") {
        return json(res, 405, { ok: false, error: "METHOD_NOT_ALLOWED" });
    }

    const mode = resolvePaymentMode(process.env);
    if (mode === PAYMENT_MODES.UNCONFIGURED) {
        return json(res, 503, {
            ok: false,
            error: "PAYMENTS_UNCONFIGURED",
            message: "Payment provider not configured. Supply test credentials for TEST mode.",
        });
    }
    if (mode === PAYMENT_MODES.LIVE_DISABLED) {
        return json(res, 403, {
            ok: false,
            error: "LIVE_DISABLED",
            message: "Live payments are disabled until explicit server approval.",
        });
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

    // Reject client prices immediately.
    if (body.price != null || body.salePrice != null || body.total != null) {
        return json(res, 400, { ok: false, error: "CLIENT_PRICE_REJECTED" });
    }

    const cart = createCartState(body.items || []);
    const taxConfigured = isTaxConfigured({
        stripeTaxEnabled: process.env.STRIPE_TAX_ENABLED === "true",
    });

    const result = beginServerCheckout({
        cart,
        customerId: body.customerId || null,
        couponCode: body.couponCode || "",
        paymentMode: mode,
        taxConfigured,
        taxCents: taxConfigured ? Number(body.taxCents) || 0 : null,
    });

    if (!result.ok) {
        return json(res, 400, {
            ok: false,
            error: result.error,
            state: result.state,
        });
    }

    // Do not call Stripe SDK here until credentials + activation checklist complete.
    // Architecture response only.
    return json(res, 200, {
        ok: true,
        mode,
        orderId: result.orderId,
        session: result.session,
        quote: result.quote,
        testModeReady: canCreateTestCheckoutSession(mode),
        message:
            "Checkout session architecture accepted. Provider SDK charge not invoked in M2 stubs.",
        fakeSuccessForbidden: true,
    });
}

// Silence unused import warnings in some bundlers
void quoteServerCheckout;
void createPaymentSessionFromQuote;
