/**
 * POST /api/subscribe — newsletter / waitlist / resource-gate lead notification.
 *
 * Accepts JSON: { email, source, tags, product, page, referrer, userAgent, timestamp }
 * Validates server-side, then emails the owner via the Resend helper. The client
 * (saveSubscriber) still writes localStorage as a fallback and treats this call
 * as fire-and-forget, so a failure here never breaks the UI.
 */
import { sendLeadEmail, isLeadEmailConfigured } from "./_utils/sendLeadEmail.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_BYTES = 10000;

// Replace control chars with a space, collapse whitespace, trim, cap length.
// A codepoint loop avoids any control-char literals in the source.
function clean(value, max = 200) {
    if (typeof value !== "string") return "";
    let out = "";
    for (const ch of value) {
        const code = ch.codePointAt(0);
        out += code < 32 || code === 127 ? " " : ch;
    }
    return out.replace(/\s+/g, " ").trim().slice(0, max);
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    // Oversized-payload guard.
    const contentLength = Number(req.headers["content-length"] || 0);
    if (contentLength > MAX_BODY_BYTES) {
        return res.status(413).json({ ok: false, error: "Payload too large" });
    }

    let body = req.body;
    if (typeof body === "string") {
        if (body.length > MAX_BODY_BYTES) return res.status(413).json({ ok: false, error: "Payload too large" });
        try {
            body = JSON.parse(body);
        } catch {
            return res.status(400).json({ ok: false, error: "Invalid JSON" });
        }
    }
    if (!body || typeof body !== "object") {
        return res.status(400).json({ ok: false, error: "Invalid body" });
    }

    const email = clean(body.email, 254).toLowerCase();
    if (!email || !EMAIL_RE.test(email)) {
        return res.status(400).json({ ok: false, error: "Valid email required" });
    }

    const source = clean(body.source, 100) || "website";
    const product = clean(body.product, 60);
    const page = clean(body.page, 200);
    const referrer = clean(body.referrer, 300);
    const userAgent = clean(body.userAgent, 300);
    const timestamp = clean(body.timestamp, 40) || new Date().toISOString();
    const tags = Array.isArray(body.tags)
        ? body.tags.map((t) => clean(t, 60)).filter(Boolean).slice(0, 20)
        : [];

    if (!isLeadEmailConfigured()) {
        return res.status(503).json({ ok: false, error: "Lead email service not configured" });
    }

    const text = [
        "New CinNova lead",
        "",
        "Email:     " + email,
        "Source:    " + source,
        product ? "Product:   " + product : null,
        tags.length ? "Tags:      " + tags.join(", ") : null,
        page ? "Page:      " + page : null,
        referrer ? "Referrer:  " + referrer : null,
        "Timestamp: " + timestamp,
        userAgent ? "Device:    " + userAgent : null,
    ]
        .filter(Boolean)
        .join("\n");

    const subject = "New lead - " + source + (product ? " / " + product : "");

    const result = await sendLeadEmail({ subject, text, replyTo: email });

    if (!result.ok) {
        return res.status(502).json({ ok: false, error: "Lead notification failed" });
    }

    return res.status(200).json({ ok: true });
}
