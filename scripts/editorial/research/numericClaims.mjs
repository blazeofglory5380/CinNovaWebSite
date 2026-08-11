/**
 * Phase 3 — numeric / currency claim normalization and conflict detection.
 * Equivalent formats agree; materially different values HOLD (not READY).
 */

const CURRENCY_RE =
    /\$\s*(\d+(?:\.\d+)?)\s*(trillion|tn|t|billion|bn|b|million|mn|m|thousand|k)?\b|\b(\d+(?:\.\d+)?)\s*(trillion|tn|billion|bn|million|mn)\s*(?:dollars|usd)?\b/gi;
const PERCENT_RE = /\b(\d+(?:\.\d+)?)\s*%|\b(\d+(?:\.\d+)?)\s+percent\b/gi;
const PLAIN_COUNT_RE = /\b(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)\s*(agencies|vendors|systems|users|people|jobs|employees)?\b/gi;

const MULTIPLIERS = Object.freeze({
    trillion: 1e12,
    tn: 1e12,
    t: 1e12,
    billion: 1e9,
    bn: 1e9,
    b: 1e9,
    million: 1e6,
    mn: 1e6,
    m: 1e6,
    thousand: 1e3,
    k: 1e3,
});

function parseNumber(raw) {
    return Number(String(raw).replace(/,/g, ""));
}

/**
 * Normalize a money expression to absolute USD (approx).
 * Returns null when not parseable.
 */
export function normalizeCurrencyToken(token = "") {
    const text = String(token || "").trim();
    if (!text) return null;
    const match = text.match(
        /\$?\s*(\d+(?:\.\d+)?)\s*(trillion|tn|t|billion|bn|b|million|mn|m|thousand|k)?/i,
    );
    if (!match) return null;
    const amount = parseNumber(match[1]);
    if (!Number.isFinite(amount)) return null;
    const unit = (match[2] || "").toLowerCase();
    const mult = MULTIPLIERS[unit] || 1;
    // Ambiguous bare "b"/"m"/"t" after $ — treat as billion/million/trillion only when unit present.
    return amount * mult;
}

export function extractCurrencyClaims(text = "") {
    const claims = [];
    const hay = String(text || "");
    CURRENCY_RE.lastIndex = 0;
    let match;
    while ((match = CURRENCY_RE.exec(hay)) !== null) {
        const raw = match[0];
        const value = normalizeCurrencyToken(raw);
        if (value == null) continue;
        claims.push({ kind: "currency", raw, value, unit: "usd" });
    }
    return claims;
}

export function extractPercentClaims(text = "") {
    const claims = [];
    PERCENT_RE.lastIndex = 0;
    let match;
    while ((match = PERCENT_RE.exec(String(text || ""))) !== null) {
        const amount = parseNumber(match[1] || match[2]);
        if (!Number.isFinite(amount)) continue;
        claims.push({ kind: "percent", raw: match[0], value: amount, unit: "percent" });
    }
    return claims;
}

export function extractNumericClaims(text = "") {
    return [...extractCurrencyClaims(text), ...extractPercentClaims(text)];
}

/**
 * True when two normalized values agree within relative tolerance (default 5%)
 * or absolute $1 for small amounts.
 */
export function numericValuesAgree(a, b, { relativeTolerance = 0.05 } = {}) {
    if (!Number.isFinite(a) || !Number.isFinite(b)) return false;
    if (a === b) return true;
    const max = Math.max(Math.abs(a), Math.abs(b));
    if (max === 0) return true;
    const delta = Math.abs(a - b);
    if (max >= 1e6) return delta / max <= relativeTolerance;
    return delta <= Math.max(1, max * relativeTolerance);
}

function sameBallpark(a, b) {
    if (!Number.isFinite(a) || !Number.isFinite(b) || a === 0 || b === 0) return false;
    const ratio = Math.max(Math.abs(a), Math.abs(b)) / Math.min(Math.abs(a), Math.abs(b));
    return ratio <= 20;
}

/**
 * Compare currency/percent claims between two texts.
 * Returns { agree: [], conflict: [] }.
 * Only flags conflict when values are in the same ballpark but disagree —
 * unrelated smaller/larger figures in the same article do not conflict.
 */
export function compareNumericClaims(textA = "", textB = "") {
    const aClaims = extractNumericClaims(textA);
    const bClaims = extractNumericClaims(textB);
    const agree = [];
    const conflict = [];
    const usedB = new Set();

    for (const left of aClaims) {
        const peers = bClaims.filter((right) => right.kind === left.kind);
        if (!peers.length) continue;
        const match = peers.find((right) => numericValuesAgree(left.value, right.value));
        if (match) {
            agree.push({ kind: left.kind, a: left, b: match });
            usedB.add(match.raw);
            continue;
        }
        const rival = peers.find(
            (right) => !usedB.has(right.raw) && sameBallpark(left.value, right.value),
        );
        if (rival) {
            conflict.push({
                kind: left.kind,
                a: left,
                b: rival,
                notes: `Numeric conflict: "${left.raw}" vs "${rival.raw}"`,
            });
            usedB.add(rival.raw);
        }
    }
    return { agree, conflict };
}

/**
 * Shared distinctive currency amount across texts (for event matching).
 */
export function sharedCurrencyAgreement(textA = "", textB = "") {
    const { agree } = compareNumericClaims(textA, textB);
    return agree.filter((row) => row.kind === "currency");
}

export function extractPlainCounts(text = "") {
    const out = [];
    PLAIN_COUNT_RE.lastIndex = 0;
    let match;
    while ((match = PLAIN_COUNT_RE.exec(String(text || ""))) !== null) {
        const amount = parseNumber(match[1]);
        if (!Number.isFinite(amount)) continue;
        out.push({
            kind: "count",
            raw: match[0],
            value: amount,
            unit: (match[2] || "count").toLowerCase(),
        });
    }
    return out;
}
