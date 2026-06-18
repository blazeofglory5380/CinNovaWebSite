const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export function sanitizeText(value, maxLength = 500) {
    return String(value ?? "").trim().slice(0, maxLength);
}

export function normalizeEmailInput(value) {
    return sanitizeText(value, 254).toLowerCase();
}

export function isValidEmail(value) {
    const email = normalizeEmailInput(value);
    return EMAIL_PATTERN.test(email);
}

export function safeJsonParse(value, fallback) {
    if (!value) return fallback;

    try {
        const parsed = JSON.parse(value);
        return parsed ?? fallback;
    } catch {
        return fallback;
    }
}

export function safeReadArray(key) {
    if (typeof window === "undefined") return [];
    const parsed = safeJsonParse(window.localStorage.getItem(key), []);
    return Array.isArray(parsed) ? parsed : [];
}

export function safeWriteArray(key, items) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, JSON.stringify(Array.isArray(items) ? items : []));
}

export function safeGetSessionFlag(key) {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem(key) === "1" || window.sessionStorage.getItem(key) === "true";
}

export function safeSetSessionFlag(key) {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(key, "1");
}

export function sanitizeTags(tags = []) {
    return Array.isArray(tags)
        ? tags.map((tag) => sanitizeText(tag, 80)).filter(Boolean).slice(0, 12)
        : [];
}
