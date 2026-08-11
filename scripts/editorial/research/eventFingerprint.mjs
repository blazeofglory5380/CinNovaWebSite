/**
 * Phase 3 — event-level fingerprints for same-event / different-title matching.
 * Uses entities, event type, amounts, locations, identifiers — not title alone.
 */

import { extractNormalizedEntities, sharedNormalizedEntities } from "./entities.mjs";
import {
    extractIdentifiersFromCandidate,
    extractIdentifiersFromCluster,
    shareExactIdentifier,
    shareStrongIdentifier,
} from "./identifiers.mjs";
import { sharedCurrencyAgreement, extractNumericClaims } from "./numericClaims.mjs";
import { jaccard, tokenize } from "../../lib/editorial-dedupe.mjs";

export const EVENT_TYPES = Object.freeze({
    BREAKING: "breaking",
    BUSINESS: "business",
    REGULATORY: "regulatory",
    RESEARCH: "research",
    OTHER: "other",
});

/** Corroboration time windows (hours) by event type. */
export const TIME_WINDOWS_HOURS = Object.freeze({
    [EVENT_TYPES.BREAKING]: 24,
    [EVENT_TYPES.BUSINESS]: 48,
    [EVENT_TYPES.REGULATORY]: 72,
    [EVENT_TYPES.RESEARCH]: 24 * 7,
    [EVENT_TYPES.OTHER]: 72,
});

const BREAKING_RE = /\b(breaking|just in|urgent|alert|kev|known exploited|ransomware attack)\b/i;
const BUSINESS_RE =
    /\b(fund\w*|financ\w*|invest\w*|acquir\w*|merg\w*|deal|ipo|lenders?|loan|capital|revenue|layoff|hire|partners?\w*|announc\w*|launch\w*|unveil\w*)\b/i;
const REGULATORY_RE =
    /\b(sec\b|ftc|fda|doj|cisa|nist|bod|order|rule|regulation|advisory|advisories|charges?|fine|ban|mandate|icsa-|cve-)\b/i;
const RESEARCH_RE =
    /\b(study|paper|preprint|arxiv|journal|peer[- ]reviewed|findings|researchers?|nature|science)\b/i;

const ACTION_RE =
    /\b(announc\w*|launch\w*|acquir\w*|merg\w*|fund\w*|invest\w*|approv\w*|order(?:ed|s)?|charg\w*|sue[sd]?|releas\w*|unveil\w*|commit\w*|lend\w*|loan\w*|partner\w*|fine[sd]?|ban(?:ned|s)?)\b/i;

const LOCATION_RE =
    /\b(united states|u\.s\.|uk|united kingdom|eu|europe|china|japan|india|california|washington|new york|london|brussels|international)\b/i;

export function classifyEventType(text = "") {
    const hay = String(text || "");
    if (REGULATORY_RE.test(hay) && !BUSINESS_RE.test(hay)) return EVENT_TYPES.REGULATORY;
    if (RESEARCH_RE.test(hay) && !BUSINESS_RE.test(hay)) return EVENT_TYPES.RESEARCH;
    if (BREAKING_RE.test(hay)) return EVENT_TYPES.BREAKING;
    if (BUSINESS_RE.test(hay)) return EVENT_TYPES.BUSINESS;
    if (REGULATORY_RE.test(hay)) return EVENT_TYPES.REGULATORY;
    if (RESEARCH_RE.test(hay)) return EVENT_TYPES.RESEARCH;
    return EVENT_TYPES.OTHER;
}

export function timeWindowHoursForText(text = "") {
    return TIME_WINDOWS_HOURS[classifyEventType(text)] || TIME_WINDOWS_HOURS[EVENT_TYPES.OTHER];
}

export function timeNearBounded(a = {}, b = {}, hours) {
    const aTime = Date.parse(a.publishedAt || "");
    const bTime = Date.parse(b.publishedAt || "");
    const windowHours = hours ?? 72;
    return Number.isFinite(aTime) && Number.isFinite(bTime) && Math.abs(aTime - bTime) <= windowHours * 3_600_000;
}

function blobOf(item = {}) {
    return `${item.canonicalTopic || ""} ${item.headline || ""} ${item.summary || ""}`;
}

export function buildEventFingerprint(item = {}) {
    const text = blobOf(item);
    const eventType = classifyEventType(text);
    const entities = extractNormalizedEntities(text);
    const amounts = extractNumericClaims(text);
    const actions = [...text.matchAll(new RegExp(ACTION_RE.source, "gi"))].map((m) => m[0].toLowerCase());
    const locations = [...text.matchAll(new RegExp(LOCATION_RE.source, "gi"))].map((m) => m[0].toLowerCase());
    const identifiers = item.sources
        ? extractIdentifiersFromCluster(item)
        : extractIdentifiersFromCandidate(item);
    return {
        eventType,
        entities,
        amounts,
        actions: [...new Set(actions)],
        locations: [...new Set(locations)],
        identifiers,
        text,
        windowHours: TIME_WINDOWS_HOURS[eventType],
    };
}

/**
 * Score whether candidate covers the same event as the cluster lead.
 * Returns { match, score, reason, details }.
 */
export function scoreSameEvent(cluster = {}, candidate = {}) {
    const lead = cluster.sources?.[0] || {};
    const clusterFp = buildEventFingerprint({
        canonicalTopic: cluster.canonicalTopic,
        headline: lead.headline,
        summary: [lead.summary, ...(cluster.sources || []).map((s) => s.summary)].filter(Boolean).join(" "),
        sources: cluster.sources,
    });
    const candFp = buildEventFingerprint(candidate);
    const windowHours = Math.max(clusterFp.windowHours, candFp.windowHours);
    const details = {
        eventType: clusterFp.eventType,
        windowHours,
        sharedEntities: sharedNormalizedEntities(clusterFp.text, candFp.text),
        currencyAgree: sharedCurrencyAgreement(clusterFp.text, candFp.text),
        sharedActions: clusterFp.actions.filter((a) => candFp.actions.includes(a)),
        sharedLocations: clusterFp.locations.filter((l) => candFp.locations.includes(l)),
    };

    if (shareStrongIdentifier(clusterFp.identifiers, candFp.identifiers)) {
        return { match: true, score: 1, reason: "strong-identifier", details };
    }
    if (
        shareExactIdentifier(clusterFp.identifiers, candFp.identifiers)
        && timeNearBounded(lead, candidate, Math.max(windowHours, 96))
    ) {
        return { match: true, score: 0.95, reason: "identifier+time", details };
    }

    if (!timeNearBounded(lead, candidate, windowHours)) {
        return { match: false, score: 0, reason: "outside-time-window", details };
    }

    if (lead.sourceId && candidate.sourceId && lead.sourceId === candidate.sourceId) {
        return { match: false, score: 0, reason: "same-source-not-corroboration", details };
    }

    const headlineScore = jaccard(
        tokenize(cluster.canonicalTopic || lead.headline || ""),
        tokenize(candidate.headline || ""),
    );
    details.headlineScore = headlineScore;

    // Distinctive funding/deal amount + shared company → same event even with different titles.
    if (details.sharedEntities.length >= 1 && details.currencyAgree.length >= 1) {
        return { match: true, score: 0.92, reason: "entity-currency-time", details };
    }

    // Shared company + shared action verb + topical overlap.
    const topical = jaccard(
        tokenize(clusterFp.text).filter((t) => t.length > 3),
        tokenize(candFp.text).filter((t) => t.length > 3),
    );
    details.topical = topical;
    if (
        details.sharedEntities.length >= 1
        && details.sharedActions.length >= 1
        && (topical >= 0.12 || headlineScore >= 0.12)
    ) {
        return { match: true, score: 0.8, reason: "entity-action-topic-time", details };
    }

    // Two+ shared entities + moderate headline/topic overlap.
    if (details.sharedEntities.length >= 2 && (headlineScore >= 0.18 || topical >= 0.18)) {
        return { match: true, score: 0.75, reason: "multi-entity-topic-time", details };
    }

    // Classic headline + entity overlap (kept for advisory-style stories).
    const entityTokens = (text) =>
        [...new Set(String(text).match(/\b[A-Z][A-Za-z0-9&.-]{2,}\b/g) || [])]
            .filter((word) => !["The", "This", "That", "New"].includes(word));
    const overlap = entityTokens(`${cluster.canonicalTopic} ${lead.summary || ""}`).filter((e) =>
        entityTokens(`${candidate.headline} ${candidate.summary || ""}`).includes(e)).length;
    details.entityOverlap = overlap;
    if (headlineScore >= 0.28 && overlap >= 2) {
        return { match: true, score: 0.7, reason: "headline-entity-time", details };
    }

    // Company-shared topical (newsroom ↔ company primary).
    if (details.sharedEntities.length >= 1 && topical >= 0.22 && headlineScore >= 0.1) {
        return { match: true, score: 0.65, reason: "shared-company-topic-time", details };
    }

    return { match: false, score: headlineScore, reason: "insufficient-similarity", details };
}

/**
 * Prefer complementary primary↔secondary pairs when ranking matches.
 */
export function isComplementaryPair(a = {}, b = {}) {
    const tierOf = (item) => String(item.sourceTier || "");
    const primaryish = (tier) => /TIER_1_PRIMARY/.test(tier);
    const secondaryish = (tier) =>
        /TIER_1_NEWS|TIER_2_REPUTABLE|TIER_2_HIGH_AUTHORITY|TIER_3_REPUTABLE/.test(tier);
    return (
        (primaryish(tierOf(a)) && secondaryish(tierOf(b)))
        || (secondaryish(tierOf(a)) && primaryish(tierOf(b)))
        || (secondaryish(tierOf(a)) && secondaryish(tierOf(b)) && a.sourceId !== b.sourceId)
    );
}
