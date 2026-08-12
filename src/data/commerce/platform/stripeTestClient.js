/**
 * Phase M3 — Stripe TEST client (no SDK required).
 * Never logs secrets. Live keys rejected unless LIVE gate is present.
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import {
    PAYMENT_MODES,
    resolvePaymentMode,
} from "./paymentMode.js";

const MIN_SECRET_LEN = 20;

export function redactSecret(value) {
    const s = String(value || "");
    if (!s) return "";
    if (s.startsWith("sk_test_")) return "sk_test_***";
    if (s.startsWith("sk_live_")) return "sk_live_***";
    if (s.startsWith("whsec_")) return "whsec_***";
    if (s.startsWith("pk_test_")) return "pk_test_***";
    if (s.startsWith("pk_live_")) return "pk_live_***";
    return "***";
}

export function classifyStripeSecretKey(key) {
    const raw = String(key || "").trim();
    if (!raw) return { ok: false, kind: "missing", error: "KEY_MISSING" };
    if (raw.startsWith("sk_live_")) {
        return raw.length > MIN_SECRET_LEN
            ? { ok: true, kind: "live", error: null }
            : { ok: false, kind: "malformed", error: "KEY_MALFORMED" };
    }
    if (raw.startsWith("sk_test_")) {
        return raw.length > MIN_SECRET_LEN
            ? { ok: true, kind: "test", error: null }
            : { ok: false, kind: "malformed", error: "KEY_MALFORMED" };
    }
    return { ok: false, kind: "malformed", error: "KEY_MALFORMED" };
}

export function classifyStripeWebhookSecret(secret) {
    const raw = String(secret || "").trim();
    if (!raw) return { ok: false, error: "WEBHOOK_SECRET_MISSING" };
    if (!raw.startsWith("whsec_") || raw.length < 16) {
        return { ok: false, error: "WEBHOOK_SECRET_MALFORMED" };
    }
    return { ok: true, error: null };
}

/**
 * Resolve usable Stripe secret for TEST charges only.
 * Live key without approval → rejected.
 */
export function resolveStripeTestSecret(env = process.env) {
    const mode = resolvePaymentMode(env);
    const key = String(env.STRIPE_SECRET_KEY || env.STRIPE_TEST_SECRET_KEY || "").trim();
    const classified = classifyStripeSecretKey(key);

    if (!classified.ok) {
        return { ok: false, error: classified.error, mode, keyPrefix: redactSecret(key) };
    }
    if (classified.kind === "live") {
        if (mode !== PAYMENT_MODES.LIVE) {
            return { ok: false, error: "LIVE_KEY_REJECTED", mode, keyPrefix: "sk_live_***" };
        }
        return { ok: false, error: "LIVE_NOT_FOR_TEST_CLIENT", mode, keyPrefix: "sk_live_***" };
    }
    if (mode !== PAYMENT_MODES.TEST) {
        return { ok: false, error: "NOT_IN_TEST_MODE", mode, keyPrefix: "sk_test_***" };
    }
    return { ok: true, error: null, mode, secret: key, keyPrefix: "sk_test_***" };
}

/**
 * Stripe-compatible signature: HMAC-SHA256 of `${t}.${payload}`.
 * Timestamp must be within toleranceSeconds (default 300).
 */
export function verifyStripeWebhookSignature({
    payload = "",
    signatureHeader = "",
    secret = "",
    nowSeconds = Math.floor(Date.now() / 1000),
    toleranceSeconds = 300,
} = {}) {
    const secretCheck = classifyStripeWebhookSecret(secret);
    if (!secretCheck.ok) return { ok: false, error: secretCheck.error, replayWindowOk: false };

    if (!signatureHeader) {
        return { ok: false, error: "SIGNATURE_MISSING", replayWindowOk: false };
    }

    const parts = String(signatureHeader).split(",").map((p) => p.trim());
    const timestampPart = parts.find((p) => p.startsWith("t="));
    const v1Parts = parts.filter((p) => p.startsWith("v1="));
    if (!timestampPart || v1Parts.length === 0) {
        return { ok: false, error: "SIGNATURE_MALFORMED", replayWindowOk: false };
    }

    const timestamp = Number(timestampPart.slice(2));
    if (!Number.isFinite(timestamp)) {
        return { ok: false, error: "SIGNATURE_MALFORMED", replayWindowOk: false };
    }

    const age = Math.abs(nowSeconds - timestamp);
    const replayWindowOk = age <= toleranceSeconds;
    if (!replayWindowOk) {
        return { ok: false, error: "REPLAY_REJECTED", replayWindowOk: false };
    }

    const signed = `${timestamp}.${payload}`;
    const expected = createHmac("sha256", secret).update(signed, "utf8").digest("hex");
    let matched = false;
    for (const v1 of v1Parts) {
        const provided = v1.slice(3);
        const a = Buffer.from(expected, "utf8");
        const b = Buffer.from(provided, "utf8");
        if (a.length === b.length && timingSafeEqual(a, b)) {
            matched = true;
            break;
        }
    }
    if (!matched) {
        return { ok: false, error: "SIGNATURE_INVALID", replayWindowOk: true };
    }
    return { ok: true, error: null, replayWindowOk: true };
}

function toFormBody(obj, prefix = "") {
    const parts = [];
    for (const [key, value] of Object.entries(obj)) {
        const name = prefix ? `${prefix}[${key}]` : key;
        if (value == null) continue;
        if (Array.isArray(value)) {
            value.forEach((item, i) => {
                if (item && typeof item === "object") {
                    parts.push(...toFormBody(item, `${name}[${i}]`));
                } else {
                    parts.push(`${encodeURIComponent(`${name}[${i}]`)}=${encodeURIComponent(String(item))}`);
                }
            });
        } else if (typeof value === "object") {
            parts.push(...toFormBody(value, name));
        } else {
            parts.push(`${encodeURIComponent(name)}=${encodeURIComponent(String(value))}`);
        }
    }
    return parts;
}

/**
 * Create a Stripe Checkout Session in TEST mode via HTTPS API.
 * Does not run if credentials missing.
 */
export async function createStripeCheckoutSession({
    env = process.env,
    quote,
    orderId,
    customerId,
    successUrl,
    cancelUrl,
    fetchImpl = globalThis.fetch,
} = {}) {
    const resolved = resolveStripeTestSecret(env);
    if (!resolved.ok) {
        return { ok: false, error: resolved.error, session: null };
    }
    if (!quote?.totalCents || !orderId) {
        return { ok: false, error: "QUOTE_REQUIRED", session: null };
    }
    if (typeof fetchImpl !== "function") {
        return { ok: false, error: "FETCH_UNAVAILABLE", session: null };
    }

    const body = toFormBody({
        mode: "payment",
        success_url: successUrl || "https://getcinnova.com/checkout?status=success&session_id={CHECKOUT_SESSION_ID}",
        cancel_url: cancelUrl || "https://getcinnova.com/checkout?status=cancelled",
        client_reference_id: orderId,
        metadata: {
            orderId,
            customerId: customerId || "",
            cinnova_mode: "TEST",
        },
        line_items: [
            {
                quantity: 1,
                price_data: {
                    currency: String(quote.currency || "usd").toLowerCase(),
                    unit_amount: quote.totalCents,
                    product_data: { name: "CinNova test digital product" },
                },
            },
        ],
    }).join("&");

    const response = await fetchImpl("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${resolved.secret}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
    });

    const json = await response.json().catch(() => ({}));
    if (!response.ok) {
        return {
            ok: false,
            error: "STRIPE_SESSION_FAILED",
            status: response.status,
            stripeErrorType: json.error?.type || null,
            session: null,
        };
    }

    return {
        ok: true,
        error: null,
        session: {
            idPrefix: String(json.id || "").slice(0, 8),
            id: json.id,
            url: json.url || null,
            status: json.status || "open",
            amountTotal: json.amount_total,
            currency: json.currency,
            mode: "TEST",
            fakeSuccessForbidden: true,
        },
    };
}

export function sessionIdPrefixOnly(sessionId) {
    return String(sessionId || "").slice(0, 8);
}
