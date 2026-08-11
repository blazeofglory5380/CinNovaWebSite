/**
 * Phase 10B.3 / Phase 2 — source independence beyond simple syndication markers.
 * Discovery-only and BLOCKED sources never independently satisfy a consequential claim.
 */

import { jaccard, normalizeHeadline, tokenize } from "../../lib/editorial-dedupe.mjs";
import { areLikelySyndicated, detectSyndicationGroup } from "./syndication.mjs";
import {
    CORROBORATION_ELIGIBLE_TIERS,
    isCorroborationEligibleTier,
    isDiscoveryOnlyTier,
    isPrimaryTier,
    canonicalizeTier,
    SOURCE_TIERS,
} from "./sourceTiers.mjs";

const ELIGIBLE_TIERS = new Set(CORROBORATION_ELIGIBLE_TIERS);

function registrableHost(url) {
    try {
        const host = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
        const parts = host.split(".");
        if (parts.length <= 2) return host;
        if (/\.(gov|mil|edu)$/.test(host) || host.endsWith(".gov.uk")) return host;
        return parts.slice(-2).join(".");
    } catch {
        return "";
    }
}

/** Parent-org groups so about.fb.com and meta.com count as one organization. */
const ORG_ALIASES = Object.freeze({
    "about.fb.com": "meta",
    "fb.com": "meta",
    "meta.com": "meta",
    "blog.google": "google",
    "deepmind.google": "google",
    "google.com": "google",
    "openai.com": "openai",
    "nvidia.com": "nvidia",
    "blogs.nvidia.com": "nvidia",
    "microsoft.com": "microsoft",
    "apple.com": "apple",
    "aws.amazon.com": "amazon",
    "amazon.com": "amazon",
});

function orgKey(candidate = {}) {
    const host = registrableHost(candidate.articleUrl || candidate.sourceUrl || "");
    if (host && ORG_ALIASES[host]) return `org:${ORG_ALIASES[host]}`;
    if (host) {
        for (const [aliasHost, org] of Object.entries(ORG_ALIASES)) {
            if (host === aliasHost || host.endsWith(`.${aliasHost}`)) return `org:${org}`;
        }
        return `host:${host}`;
    }
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

/** One article primarily quoting/attributing the other outlet as sole source. */
export function isAttributionCopy(a = {}, b = {}) {
    const textA = `${a.headline || ""} ${a.summary || ""}`.toLowerCase();
    const textB = `${b.headline || ""} ${b.summary || ""}`.toLowerCase();
    const nameA = String(a.sourceName || "").toLowerCase();
    const nameB = String(b.sourceName || "").toLowerCase();
    const cites = (text, name) => {
        if (!name || name.length < 3) return false;
        const short = name.split(/[:(/]/)[0].trim();
        if (short.length < 3) return false;
        return (
            text.includes(`according to ${short}`)
            || text.includes(`${short} reported`)
            || text.includes(`${short} says`)
            || text.includes(`${short} said`)
            || text.includes(`via ${short}`)
            || text.includes(`source: ${short}`)
            || text.includes(`reported by ${short}`)
        );
    };
    return cites(textA, nameB) || cites(textB, nameA);
}

/** Long identical quoted spans without independent wording → not independent. */
export function sharesIdenticalQuotedLanguage(a = {}, b = {}) {
    const quotes = (text) =>
        [...String(text || "").matchAll(/[“"]([^”"]{40,})[”"]/g)].map((m) =>
            m[1].toLowerCase().replace(/\s+/g, " ").trim());
    const aQuotes = quotes(`${a.headline || ""} ${a.summary || ""}`);
    const bQuotes = quotes(`${b.headline || ""} ${b.summary || ""}`);
    if (!aQuotes.length || !bQuotes.length) return false;
    return aQuotes.some((q) => bQuotes.some((other) => other === q || (q.length > 60 && other.includes(q.slice(0, 60)))));
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
    if (isAttributionCopy(a, b)) reasons.push("one source primarily attributes/quotes the other");
    if (sharesIdenticalQuotedLanguage(a, b)) {
        reasons.push("identical quoted language without independent reporting");
    }
    if (!isCorroborationEligibleTier(a.sourceTier) || !isCorroborationEligibleTier(b.sourceTier)) {
        reasons.push("non-eligible authority tier (discovery-only/BLOCKED cannot independently corroborate)");
    }
    return { independent: reasons.length === 0, reasons };
}

/**
 * Build an independence-filtered list of corroborating sources.
 * Discovery-only never enters independentSupport.
 */
export function filterIndependentSources(candidates = [], { registry = [] } = {}) {
    const eligible = (candidates || []).filter((candidate) => ELIGIBLE_TIERS.has(candidate.sourceTier)
        || isCorroborationEligibleTier(candidate.sourceTier));
    const independent = [];
    const rejected = [];

    for (const candidate of eligible) {
        if (isDiscoveryOnlyTier(candidate.sourceTier)) {
            rejected.push({
                candidate,
                against: null,
                reasons: ["discovery-only tier"],
            });
            continue;
        }
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
        const tier = canonicalizeTier(candidate.sourceTier);
        independent.push({
            ...candidate,
            sourceTier: candidate.sourceTier,
            requiresSecondaryConfirmation:
                definition?.requiresSecondaryConfirmation
                ?? tier !== SOURCE_TIERS.TIER_1_PRIMARY,
        });
    }

    const discoveryOnly = (candidates || []).filter((candidate) => isDiscoveryOnlyTier(candidate.sourceTier));
    return {
        independent,
        rejected,
        discoveryOnly,
        independentSourceIds: independent.map((item) => item.sourceId).filter(Boolean),
        primarySupport: independent.filter((item) => isPrimaryTier(item.sourceTier)),
        secondarySupport: independent.filter((item) => {
            const tier = canonicalizeTier(item.sourceTier);
            return tier === SOURCE_TIERS.TIER_1_NEWS || tier === SOURCE_TIERS.TIER_2_REPUTABLE;
        }),
    };
}

export function canTier4IndependentlySatisfy() {
    return false;
}

export { orgKey as organizationKeyForTests };
