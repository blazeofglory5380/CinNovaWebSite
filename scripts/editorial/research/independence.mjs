/**
 * Phase 10B.3 — source independence beyond simple syndication markers.
 * Tier 4 discovery-only sources never independently satisfy a consequential claim.
 */

import { jaccard, normalizeHeadline, tokenize } from "../../lib/editorial-dedupe.mjs";
import { areLikelySyndicated, detectSyndicationGroup } from "./syndication.mjs";

const ELIGIBLE_TIERS = new Set([
    "TIER_1_PRIMARY",
    "TIER_2_HIGH_AUTHORITY",
    "TIER_3_REPUTABLE_SECONDARY",
]);

function registrableHost(url) {
    try {
        const host = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
        const parts = host.split(".");
        if (parts.length <= 2) return host;
        // Keep last two labels for common TLDs; leave government multi-part hosts intact.
        if (/\.(gov|mil|edu)$/.test(host) || host.endsWith(".gov.uk")) return host;
        return parts.slice(-2).join(".");
    } catch {
        return "";
    }
}

function orgKey(candidate = {}) {
    const host = registrableHost(candidate.articleUrl || "");
    if (host) return `host:${host}`;
    const name = normalizeHeadline(candidate.sourceName || candidate.sourceId || "");
    return name ? `name:${name}` : "";
}

function paragraphTokens(text = "") {
    return tokenize(String(text).slice(0, 800));
}

/** True when B appears to be a press-release mirror / rewrite of A. */
export function isPressReleaseMirror(a = {}, b = {}) {
    const aText = `${a.headline || ""} ${a.summary || ""}`;
    const bText = `${b.headline || ""} ${b.summary || ""}`;
    if (!aText.trim() || !bText.trim()) return false;
    const overlap = jaccard(paragraphTokens(aText), paragraphTokens(bText));
    if (overlap >= 0.78) return true;
    const aHost = registrableHost(a.articleUrl || "");
    const bHost = registrableHost(b.articleUrl || "");
    if (aHost && bHost && aHost === bHost && jaccard(tokenize(a.headline), tokenize(b.headline)) >= 0.55) {
        return true;
    }
    return false;
}

/**
 * Independent enough to count as separate corroboration?
 * Returns { independent, reasons[] }.
 */
export function assessPairIndependence(a = {}, b = {}) {
    const reasons = [];
    if (!a || !b) return { independent: false, reasons: ["missing candidate"] };
    if (a.sourceId && b.sourceId && a.sourceId === b.sourceId) {
        reasons.push("same sourceId");
    }
    if (areLikelySyndicated(a, b)) reasons.push("syndicated/wire/guid/path/headline-copy");
    if (detectSyndicationGroup(a) && detectSyndicationGroup(a) === detectSyndicationGroup(b)) {
        reasons.push("shared syndication group");
    }
    const orgA = orgKey(a);
    const orgB = orgKey(b);
    if (orgA && orgB && orgA === orgB) reasons.push("same organization / registrable domain");
    if (isPressReleaseMirror(a, b)) reasons.push("press-release mirror or near-copy rewrite");
    if (!ELIGIBLE_TIERS.has(a.sourceTier) || !ELIGIBLE_TIERS.has(b.sourceTier)) {
        reasons.push("non-eligible authority tier (Tier 4 cannot independently corroborate)");
    }
    return { independent: reasons.length === 0, reasons };
}

/**
 * Build an independence-filtered list of corroborating sources.
 * Tier 4 never enters independentSupport.
 */
export function filterIndependentSources(candidates = [], { registry = [] } = {}) {
    const eligible = (candidates || []).filter((candidate) => ELIGIBLE_TIERS.has(candidate.sourceTier));
    const independent = [];
    const rejected = [];

    for (const candidate of eligible) {
        const definition = registry.find((source) => source.id === candidate.sourceId);
        const clash = independent.find((other) => !assessPairIndependence(other, candidate).independent);
        if (clash) {
            rejected.push({
                candidate,
                against: clash.sourceId || clash.articleUrl,
                reasons: assessPairIndependence(clash, candidate).reasons,
            });
            continue;
        }
        independent.push({
            ...candidate,
            requiresSecondaryConfirmation: definition?.requiresSecondaryConfirmation ?? candidate.sourceTier !== "TIER_1_PRIMARY",
        });
    }

    const tier4 = (candidates || []).filter((candidate) => candidate.sourceTier === "TIER_4_DISCOVERY_ONLY");
    return {
        independent,
        rejected,
        discoveryOnly: tier4,
        independentSourceIds: independent.map((item) => item.sourceId).filter(Boolean),
        primarySupport: independent.filter((item) => item.sourceTier === "TIER_1_PRIMARY"),
        secondarySupport: independent.filter((item) =>
            ["TIER_2_HIGH_AUTHORITY", "TIER_3_REPUTABLE_SECONDARY"].includes(item.sourceTier)),
    };
}

export function canTier4IndependentlySatisfy() {
    return false;
}
