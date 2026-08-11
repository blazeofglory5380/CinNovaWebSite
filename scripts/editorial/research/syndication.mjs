import { SOURCE_TIERS, canonicalizeTier } from "./sourceTiers.mjs";
import { jaccard, normalizeHeadline, tokenize } from "../../lib/editorial-dedupe.mjs";

const WIRE_MARKERS = [
    ["reuters", /\b(reuters|thomson reuters)\b/i],
    ["associated-press", /\b(associated press|the ap|ap news)\b/i],
    ["bbc", /\b(bbc news|bbc)\b/i],
    ["npr", /\b(npr|national public radio)\b/i],
];

function wireMarker(candidate) {
    const text = `${candidate.sourceName || ""} ${candidate.headline || ""} ${candidate.summary || ""}`;
    return WIRE_MARKERS.find(([, pattern]) => pattern.test(text))?.[0] || "";
}

function comparablePath(value) {
    try {
        const url = new URL(value);
        return url.pathname.replace(/\/+$/, "").toLowerCase();
    } catch {
        return "";
    }
}

export function detectSyndicationGroup(candidate) {
    const wire = wireMarker(candidate);
    if (wire) return `wire:${wire}`;
    if (candidate.guid) return `guid:${normalizeHeadline(candidate.guid)}`;
    const path = comparablePath(candidate.articleUrl);
    return path ? `path:${path}` : `headline:${normalizeHeadline(candidate.headline)}`;
}

export function areLikelySyndicated(a, b) {
    const markerA = wireMarker(a);
    const markerB = wireMarker(b);
    if (markerA && markerA === markerB) return true;
    if (a.guid && b.guid && normalizeHeadline(a.guid) === normalizeHeadline(b.guid)) return true;
    const pathA = comparablePath(a.articleUrl);
    const pathB = comparablePath(b.articleUrl);
    if (pathA && pathA === pathB) return true;
    // Same organization republishing across subdomains.
    try {
        const hostA = new URL(a.articleUrl).hostname.toLowerCase().replace(/^www\./, "");
        const hostB = new URL(b.articleUrl).hostname.toLowerCase().replace(/^www\./, "");
        const baseA = hostA.split(".").slice(-2).join(".");
        const baseB = hostB.split(".").slice(-2).join(".");
        if (baseA && baseA === baseB && jaccard(tokenize(a.headline), tokenize(b.headline)) >= 0.55) {
            return true;
        }
    } catch {
        // ignore invalid URLs
    }
    // Near-copy paragraph rewrite.
    if (jaccard(tokenize(`${a.headline} ${a.summary || ""}`), tokenize(`${b.headline} ${b.summary || ""}`)) >= 0.82) {
        return true;
    }
    return jaccard(tokenize(a.headline), tokenize(b.headline)) >= 0.86;
}

/** Wire/newsroom tiers may still carry wire markers — preserve for independence. */
export function isWireAttributed(candidate = {}) {
    return Boolean(wireMarker(candidate));
}

export { SOURCE_TIERS, canonicalizeTier };

