/**
 * Phase M2 — Stripe webhook stub (fail closed).
 * Production endpoint must not be activated until checklist complete.
 */

import {
    verifyWebhookSignature,
    handleWebhookEventArchitecture,
    sanitizeWebhookLog,
} from "../../src/data/commerce/platform/webhookArchitecture.js";

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
    if (!secret) {
        return json(res, 503, {
            ok: false,
            error: "WEBHOOK_SECRET_MISSING",
            message: "Webhook not configured. No production activation.",
        });
    }

    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const payload = Buffer.concat(chunks).toString("utf8");
    const signatureHeader = req.headers["stripe-signature"] || "";

    // Architecture: require a real verifier wiring (Stripe SDK) before accepting.
    const verified = verifyWebhookSignature({
        payload,
        signatureHeader,
        secret,
        verifier: null,
    });
    if (!verified.ok) {
        return json(res, 400, { ok: false, error: verified.error });
    }

    let event;
    try {
        event = JSON.parse(payload);
    } catch {
        return json(res, 400, { ok: false, error: "INVALID_JSON" });
    }

    const result = handleWebhookEventArchitecture({
        eventId: event.id || "",
        eventType: event.type || "",
        orderId: event.data?.object?.metadata?.orderId || "",
        signatureOk: true,
    });

    return json(res, result.ok ? 200 : 400, {
        ...result,
        log: sanitizeWebhookLog({
            eventId: event.id,
            eventType: event.type,
            orderId: event.data?.object?.metadata?.orderId,
        }),
    });
}
