/**
 * Phase 3 — evergreen Blog qualification (separate from breaking-news freshness).
 *
 * Accept:
 *  A. 1 authoritative primary + supporting authoritative documentation
 *  B. 2 reputable independent educational/research sources
 *  C. 1 authoritative technical standard + clearly labeled explanatory synthesis
 *
 * Do NOT require breaking-news freshness or same-event multi-outlet corroboration.
 * Factual claims still require source support. No SEO farms / affiliate / invented sources.
 */

import {
    canonicalizeTier,
    isDiscoveryOnlyTier,
    isPrimaryTier,
    SOURCE_TIERS,
} from "./sourceTiers.mjs";
import { filterIndependentSources } from "./independence.mjs";
import { scoreCinovaRelevance } from "./relevance.mjs";

const ICS_PRODUCT_ADVISORY =
    /\b(icsa-\d|c-cure|stimulator|hormone monitor|igss|victor application|rockwell|siemens|abb |mikrotik|johnson controls|pulsetto|mira )\b/i;
const STANDARD_RE =
    /\b(nist|sp\s*\d|framework|standard|guidance|guideline|best practice|sbom minimum|rfc\s*\d+|risk management)\b/i;
const EVERGREEN_RE =
    /\b(guide|explainer|how to|what .+ means|understanding|practical|framework|overview|faq|basics)\b/i;

export function isEvergreenBlogCandidate(cluster = {}) {
    const text = `${cluster.canonicalTopic || ""} ${(cluster.sources || [])
        .map((s) => `${s.headline || ""} ${s.summary || ""}`)
        .join(" ")}`;
    if (ICS_PRODUCT_ADVISORY.test(text) && !STANDARD_RE.test(text)) return false;
    if (EVERGREEN_RE.test(text) || STANDARD_RE.test(text)) return true;
    // BACKGROUND freshness with authoritative sources → evergreen-eligible.
    if (cluster.freshness === "BACKGROUND" || cluster.freshness === "RECENT") {
        return (cluster.sources || []).some((s) => isPrimaryTier(s.sourceTier));
    }
    return Boolean(cluster.route?.route === "BLOG");
}

/**
 * Blog source-standard paths A/B/C.
 */
export function assessBlogSourceStandard(cluster = {}, { registry = [] } = {}) {
    const eligible = (cluster.sources || []).filter(
        (s) => !isDiscoveryOnlyTier(s.sourceTier) && s.sourceTier !== SOURCE_TIERS.BLOCKED,
    );
    const filtered = filterIndependentSources(eligible, { registry });
    const independent = filtered.independent;
    const primaries = independent.filter((s) => isPrimaryTier(s.sourceTier));
    const reputable = independent.filter((s) => {
        const tier = canonicalizeTier(s.sourceTier);
        return (
            tier === SOURCE_TIERS.TIER_1_NEWS
            || tier === SOURCE_TIERS.TIER_2_REPUTABLE
            || tier === SOURCE_TIERS.TIER_1_PRIMARY
        );
    });
    const text = `${cluster.canonicalTopic || ""} ${eligible.map((s) => s.summary || "").join(" ")}`;
    const hasStandard = STANDARD_RE.test(text) || primaries.some((s) => /nist|fda|cdc|noaa|nasa|cisa/i.test(s.sourceId || ""));

    if (primaries.length >= 1 && (reputable.length >= 2 || eligible.length >= 2)) {
        return {
            ok: true,
            path: "A",
            rationale: "Authoritative primary plus supporting authoritative documentation.",
            independentSourceIds: independent.map((s) => s.sourceId),
        };
    }
    if (reputable.length >= 2 || independent.length >= 2) {
        return {
            ok: true,
            path: "B",
            rationale: "Two reputable independent educational/research sources.",
            independentSourceIds: independent.map((s) => s.sourceId),
        };
    }
    if (hasStandard && primaries.length >= 1) {
        return {
            ok: true,
            path: "C",
            rationale: "Authoritative technical standard with explanatory synthesis framing.",
            independentSourceIds: independent.map((s) => s.sourceId),
            synthesisLabelRequired: true,
        };
    }
    if (primaries.length >= 1) {
        return {
            ok: true,
            path: "C",
            rationale: "Single authoritative primary/standard — Blog REVIEW with labeled synthesis; factual claims attributed.",
            independentSourceIds: independent.map((s) => s.sourceId),
            synthesisLabelRequired: true,
            reviewOnly: true,
        };
    }

    return {
        ok: false,
        path: null,
        rationale:
            "Blog evergreen requires primary+support, two reputable sources, or an authoritative standard — discovery-only/SEO farms do not qualify.",
        independentSourceIds: independent.map((s) => s.sourceId),
    };
}

/**
 * Qualify a BLOG-routed cluster without breaking-news freshness.
 */
export function qualifyBlogCluster(cluster = {}, { registry = [] } = {}) {
    const reasons = [];
    const text = `${cluster.canonicalTopic || ""} ${(cluster.sources || [])
        .map((s) => `${s.headline || ""} ${s.summary || ""}`)
        .join(" ")}`;
    if (ICS_PRODUCT_ADVISORY.test(text) && !STANDARD_RE.test(text)) {
        reasons.push("ICS/product advisory is News-desk material, not evergreen Blog");
    }
    const sourceGate = assessBlogSourceStandard(cluster, { registry });
    if (!sourceGate.ok) reasons.push(sourceGate.rationale);

    const relevance = cluster.relevance ?? scoreCinovaRelevance(
        `${cluster.canonicalTopic || ""} ${(cluster.topics || []).join(" ")}`,
    );
    if (!(relevance > 0)) reasons.push("no CinNova relevance topic matched");
    if (cluster.cinovaClassification === "DUPLICATE") {
        reasons.push("duplicates existing CinNova coverage");
    }
    if (cluster.freshness === "UNKNOWN") {
        reasons.push("publication date unknown — cannot verify source currency for evergreen framing");
    }

    const topicValue = scoreCinovaRelevance(
        `${cluster.canonicalTopic || ""} ${(cluster.sources || []).map((s) => s.headline).join(" ")}`,
    );

    return {
        qualified: reasons.length === 0,
        rationale: reasons.length
            ? reasons.join("; ")
            : `Evergreen Blog path ${sourceGate.path}: ${sourceGate.rationale}`,
        sourceStandard: sourceGate,
        evergreen: true,
        topicValue,
        reviewOnly: Boolean(sourceGate.reviewOnly),
        // Explicitly does not require BREAKING/CURRENT freshness.
        freshnessRequired: false,
    };
}
