/**
 * Phase 3 — entity normalization for event matching / independence.
 * Do not merge distinct legal entities incorrectly.
 */

const ENTITY_ALIASES = Object.freeze([
    { id: "openai", labels: ["openai", "open ai", "chatgpt", "gpt-4", "gpt-5", "sora"] },
    { id: "anthropic", labels: ["anthropic", "claude"] },
    { id: "google", labels: ["google", "alphabet", "deepmind", "gemini", "bard"] },
    { id: "microsoft", labels: ["microsoft", "microsoft corp", "msft", "azure"] },
    { id: "meta", labels: ["meta", "facebook", "meta platforms", "llama", "threads"] },
    { id: "apple", labels: ["apple", "apple inc", "iphone", "ipad", "wwdc"] },
    { id: "nvidia", labels: ["nvidia", "nvda", "geforce", "cuda", "blackwell"] },
    { id: "amazon", labels: ["amazon", "aws", "amazon web services", "alexa"] },
    { id: "nasa", labels: ["nasa", "webb", "artemis", "jet propulsion laboratory", "jpl"] },
    { id: "noaa", labels: ["noaa", "national oceanic"] },
    { id: "fda", labels: ["fda", "u.s. fda", "us fda", "food and drug administration"] },
    { id: "cdc", labels: ["cdc", "centers for disease control"] },
    { id: "nih", labels: ["nih", "national institutes of health"] },
    { id: "sec", labels: ["sec", "securities and exchange commission"] },
    { id: "federal_reserve", labels: ["federal reserve", "the fed", "fed chair", "fomc"] },
    { id: "ftc", labels: ["ftc", "federal trade commission"] },
    { id: "doj", labels: ["doj", "department of justice", "justice department"] },
    { id: "cisa", labels: ["cisa", "cybersecurity and infrastructure security"] },
    { id: "nist", labels: ["nist", "national institute of standards"] },
    { id: "bbc", labels: ["bbc", "british broadcasting"] },
    { id: "npr", labels: ["npr", "national public radio"] },
]);

/** Escape for word-boundary-ish matching of multi-word labels. */
function labelPattern(label) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
    return new RegExp(`(?:^|[^a-z0-9])${escaped}(?:[^a-z0-9]|$)`, "i");
}

export function normalizeEntityId(raw = "") {
    const text = String(raw || "").trim().toLowerCase();
    if (!text) return "";
    for (const entry of ENTITY_ALIASES) {
        if (entry.id === text || entry.labels.includes(text)) return entry.id;
    }
    return text.replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

/** Canonical entity ids mentioned in free text. */
export function extractNormalizedEntities(text = "") {
    const hay = String(text || "");
    const found = [];
    for (const entry of ENTITY_ALIASES) {
        if (entry.labels.some((label) => labelPattern(label).test(hay))) {
            found.push(entry.id);
        }
    }
    return [...new Set(found)];
}

export function sharedNormalizedEntities(aText = "", bText = "") {
    const left = new Set(extractNormalizedEntities(aText));
    return extractNormalizedEntities(bText).filter((id) => left.has(id));
}

export { ENTITY_ALIASES as ENTITY_ALIASES_FOR_TESTS };
