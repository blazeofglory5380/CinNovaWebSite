/**
 * Phase M2 — authenticated download stub.
 * Never returns permanent raw file URLs.
 */

import { authorizeSecureDownload } from "../../src/data/commerce/platform/entitlementGrants.js";

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

    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    let body;
    try {
        body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
    } catch {
        return json(res, 400, { ok: false, error: "INVALID_JSON" });
    }

    const result = authorizeSecureDownload({
        entitlementId: body.entitlementId,
        customerId: body.customerId,
        productId: body.productId,
    });

    if (!result.ok) {
        return json(res, 403, { ok: false, error: result.error });
    }

    return json(res, 200, {
        ok: true,
        // Architecture: token only — never a permanent raw asset URL.
        downloadToken: result.grant?.token || null,
        expiresAt: result.grant?.expiresAt || null,
        url: null,
        message: "Use authenticated file service with this short-lived token. Raw URLs forbidden.",
    });
}
