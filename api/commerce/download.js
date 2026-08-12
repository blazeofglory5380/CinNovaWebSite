/**
 * Phase M3 — authenticated download (token only, no permanent URL).
 */

import { authorizeTestDownload } from "../../src/data/commerce/platform/secureDownload.js";
import { authorizeOrderLookup } from "../../src/data/commerce/platform/orderModel.js";

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

    if (body.orderId) {
        const lookup = authorizeOrderLookup({
            orderId: body.orderId,
            requesterCustomerId: body.customerId,
            adminAuthorized: false,
        });
        if (!lookup.ok) {
            return json(res, 403, { ok: false, error: "FORGED_OR_UNAUTHORIZED_ORDER" });
        }
    }

    const result = authorizeTestDownload({
        entitlementId: body.entitlementId,
        customerId: body.customerId,
        productId: body.productId,
        requestedPath: body.path || "",
    });

    if (!result.ok) {
        return json(res, 403, { ok: false, error: result.error });
    }

    return json(res, 200, {
        ok: true,
        downloadToken: result.grant?.token || null,
        expiresAt: result.grant?.expiresAt || null,
        url: null,
        headers: result.headers,
        message: "Short-lived grant only. Permanent/raw URLs forbidden.",
    });
}
