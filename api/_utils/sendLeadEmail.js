/**
 * Lead-notification email helper (Vercel serverless).
 *
 * Sends a notification to the site owner via Resend's HTTP API using the global
 * `fetch` — no SDK/package required. Files under `api/_utils/` are ignored by
 * Vercel's function router (leading underscore), so this is a helper only.
 *
 * Required environment variables (set in the Vercel project, never committed):
 *   RESEND_API_KEY    — Resend API key
 *   LEAD_NOTIFY_TO    — owner address that receives lead notifications
 *   LEAD_FROM_EMAIL   — verified "from" address on the Resend account
 */

export function isLeadEmailConfigured() {
    return Boolean(
        process.env.RESEND_API_KEY &&
            process.env.LEAD_NOTIFY_TO &&
            process.env.LEAD_FROM_EMAIL,
    );
}

/**
 * @returns {Promise<{ ok: boolean, configured?: boolean, status?: number, error?: string }>}
 */
export async function sendLeadEmail({ subject, text, replyTo } = {}) {
    if (!isLeadEmailConfigured()) {
        return { ok: false, configured: false, error: "Lead email service not configured" };
    }

    const payload = {
        from: process.env.LEAD_FROM_EMAIL,
        to: [process.env.LEAD_NOTIFY_TO],
        subject: String(subject || "New CinNova lead").slice(0, 200),
        text: String(text || "").slice(0, 8000),
        ...(replyTo ? { reply_to: replyTo } : {}),
    };

    try {
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            return { ok: false, configured: true, status: response.status, error: `Resend error ${response.status}` };
        }
        return { ok: true, configured: true };
    } catch (err) {
        return { ok: false, configured: true, error: "Email send failed" };
    }
}
