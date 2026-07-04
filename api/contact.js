/**
 * POST /api/contact — contact-form message notification.
 *
 * Accepts JSON: { name, email, message, source, page, inquiryType }
 * Validates + sanitizes server-side, then emails the owner via the Resend
 * helper. Previously the contact form discarded messages entirely; this delivers
 * them. Returns { ok: true } only after a successful send.
 */
import { sendLeadEmail, isLeadEmailConfigured } from "./_utils/sendLeadEmail.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_BYTES = 20000;
const MAX_MESSAGE = 5000;

// Strip control chars (except newline/tab in message), collapse, cap length.
function clean(value, max = 200, keepNewlines = false) {
    if (typeof value !== "string") return "";
    let out = "";
    for (const ch of value) {
        const code = ch.codePointAt(0);
        if (keepNewlines && (ch === "\n" || ch === "\t")) {
            out += ch;
        } else if (code < 32 || code === 127) {
            out += " ";
        } else {
            out += ch;
        }
    }
    out = keepNewlines ? out.replace(/[ \t]+/g, " ") : out.replace(/\s+/g, " ");
    return out.trim().slice(0, max);
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

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

    const name = clean(body.name, 100);
    const email = clean(body.email, 254).toLowerCase();
    const message = clean(body.message, MAX_MESSAGE, true);
    const source = clean(body.source, 100) || "contact_form";
    const page = clean(body.page, 200);
    const inquiryType = clean(body.inquiryType, 80);

    if (!name) return res.status(400).json({ ok: false, error: "Name required" });
    if (!email || !EMAIL_RE.test(email)) return res.status(400).json({ ok: false, error: "Valid email required" });
    if (message.length < 10) return res.status(400).json({ ok: false, error: "Message required" });

    if (!isLeadEmailConfigured()) {
        return res.status(503).json({ ok: false, error: "Lead email service not configured" });
    }

    const text = [
        "New CinNova contact message",
        "",
        "Name:    " + name,
        "Email:   " + email,
        inquiryType ? "Inquiry: " + inquiryType : null,
        source ? "Source:  " + source : null,
        page ? "Page:    " + page : null,
        "",
        "Message:",
        message,
    ]
        .filter((line) => line !== null)
        .join("\n");

    const subject = "Contact form - " + name + (inquiryType ? " / " + inquiryType : "");

    const result = await sendLeadEmail({ subject, text, replyTo: email });

    if (!result.ok) {
        return res.status(502).json({ ok: false, error: "Message delivery failed" });
    }

    return res.status(200).json({ ok: true });
}
