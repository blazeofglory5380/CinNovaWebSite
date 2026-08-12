/**
 * Phase M3 — redirect + affiliate destination injection guards.
 */

export function assertSafeReturnUrl(url, { allowedHosts = ["getcinnova.com"] } = {}) {
    if (!url) return { ok: false, error: "URL_REQUIRED" };
    try {
        const parsed = new URL(url);
        if (parsed.protocol !== "https:") return { ok: false, error: "HTTPS_REQUIRED" };
        if (!allowedHosts.includes(parsed.hostname)) return { ok: false, error: "OPEN_REDIRECT" };
        return { ok: true, error: null };
    } catch {
        return { ok: false, error: "INVALID_URL" };
    }
}

export function assertAffiliateDestinationAllowed(url, allowedDomains = []) {
    if (!url) return { ok: false, error: "URL_REQUIRED" };
    try {
        const parsed = new URL(url);
        if (parsed.protocol !== "https:") return { ok: false, error: "HTTPS_REQUIRED" };
        const host = parsed.hostname.replace(/^www\./, "");
        const ok = allowedDomains.some((d) => host === d.replace(/^www\./, "") || host.endsWith(`.${d.replace(/^www\./, "")}`));
        return ok ? { ok: true, error: null } : { ok: false, error: "DESTINATION_INJECTION" };
    } catch {
        return { ok: false, error: "INVALID_URL" };
    }
}

export function assertNoSecretInLogs(text) {
    if (/sk_(live|test)_[A-Za-z0-9]{8,}|whsec_[A-Za-z0-9]{8,}/.test(String(text))) {
        return { ok: false, error: "SECRET_IN_LOGS" };
    }
    return { ok: true, error: null };
}

export function assertNoLiveKeyInClientBundle(source) {
    if (/sk_live_|sk_test_[A-Za-z0-9]{10,}/.test(String(source))) {
        return { ok: false, error: "SECRET_IN_CLIENT" };
    }
    return { ok: true, error: null };
}
