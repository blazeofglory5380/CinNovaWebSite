/**
 * Phase M3 — Stripe TEST webhook with HMAC verification.
 */

import {
    verifyWebhookSignature,
    handleWebhookEventArchitecture,
    sanitizeWebhookLog,
    assertWebhookEventAllowed,
} from "../../src/data/commerce/platform/webhookArchitecture.js";
import { queueCommerceEmail, COMMERCE_EMAIL_TYPES } from "../../src/data/commerce/platform/commerceEmail.js";
import { persistOrdersToDisk } from "../../src/data/commerce/platform/orderPersistence.js";

function json(res, status, body) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return json(res, 405, { ok: false, error: "METHOD_NOT_ALLOWED" });
    }

    const secret = process.env.STRIPE_WEBHOOK_SECRET || "";
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const payload = Buffer.concat(chunks).toString("utf8");
    const signatureHeader = req.headers["stripe-signature"] || "";

    const verified = verifyWebhookSignature({ payload, signatureHeader, secret });
    if (!verified.ok) {
        return json(res, 400, { ok: false, error: verified.error });
    }

    let event;
    try {
        event = JSON.parse(payload);
    } catch {
        return json(res, 400, { ok: false, error: "INVALID_JSON" });
    }

    const allowed = assertWebhookEventAllowed(event.type || "");
    if (!allowed.ok) {
        return json(res, 200, {
            ok: true,
            ignored: true,
            error: allowed.error,
            log: sanitizeWebhookLog({ eventId: event.id, eventType: event.type }),
        });
    }

    const result = handleWebhookEventArchitecture({
        eventId: event.id || "",
        eventType: event.type || "",
        orderId: event.data?.object?.metadata?.orderId || event.data?.object?.client_reference_id || "",
        signatureOk: true,
        replayWindowOk: verified.replayWindowOk !== false,
    });

    if (result.ok && !result.duplicate && event.type === "checkout.session.completed") {
        queueCommerceEmail({
            type: COMMERCE_EMAIL_TYPES.DOWNLOAD_LINK,
            orderId: event.data?.object?.metadata?.orderId || "",
        });
        persistOrdersToDisk();
    }
    if (event.type === "charge.refunded") {
        queueCommerceEmail({
            type: COMMERCE_EMAIL_TYPES.REFUND_CONFIRMATION,
            orderId: event.data?.object?.metadata?.orderId || "",
        });
        persistOrdersToDisk();
    }
    if (event.type === "payment_intent.payment_failed") {
        queueCommerceEmail({
            type: COMMERCE_EMAIL_TYPES.PAYMENT_FAILED,
            orderId: event.data?.object?.metadata?.orderId || "",
        });
    }

    return json(res, result.ok ? 200 : 400, {
        ok: result.ok,
        duplicate: result.duplicate,
        error: result.error,
        log: sanitizeWebhookLog({
            eventId: event.id,
            eventType: event.type,
            orderId: event.data?.object?.metadata?.orderId,
        }),
    });
}
