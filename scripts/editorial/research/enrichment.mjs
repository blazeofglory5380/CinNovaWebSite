/**
 * Phase 10B.3 — post-selection, pre-fact-check corroboration enrichment.
 *
 * selected candidate → reuse fetched candidates → match → independence →
 * claimEvidence → uncertainty resolution → readiness helper → enriched cluster
 *
 * Bounded: only selected clusters; per-candidate match cap; no recursive discovery;
 * reuses candidates already fetched in the same run (no extra live fan-out by default).
 */

import { jaccard, tokenize } from "../../lib/editorial-dedupe.mjs";
import { deriveClaimsFromCluster, mapClaimEvidence, summarizeClaimEvidence } from "./claimEvidence.mjs";
import { detectConflicts } from "./conflict.mjs";
import {
    extractIdentifiersFromCandidate,
    extractIdentifiersFromCluster,
    shareExactIdentifier,
    shareStrongIdentifier,
} from "./identifiers.mjs";
import { filterIndependentSources } from "./independence.mjs";
import { computeReadinessScore } from "./readiness.mjs";
import { SOURCE_REGISTRY } from "./sourceRegistry.mjs";
import {
    resolveUncertainties,
    seedUncertaintiesFromClaims,
} from "./uncertainty.mjs";

export const ENRICHMENT_LIMITS = Object.freeze({
    maxMatchesPerCluster: 8,
    maxSelectedClusters: 8,
    minHeadlineJaccard: 0.34,
    minEntityOverlap: 2,
});

function candidateKey(candidate = {}) {
    return candidate.articleUrl || `${candidate.sourceId}:${candidate.guid || candidate.headline}`;
}

function alreadyInCluster(cluster, candidate) {
    const key = candidateKey(candidate);
    return (cluster.sources || []).some((source) => candidateKey(source) === key);
}

function timeNear(a, b, hours = 72) {
    const aTime = Date.parse(a.publishedAt || "");
    const bTime = Date.parse(b.publishedAt || "");
    return Number.isFinite(aTime) && Number.isFinite(bTime) && Math.abs(aTime - bTime) <= hours * 3_600_000;
}

function entityOverlap(aText, bText) {
    const entities = (text) =>
        [...new Set(String(text).match(/\b[A-Z][A-Za-z0-9&.-]{2,}\b/g) || [])]
            .filter((word) => !["The", "This", "That", "New"].includes(word));
    const left = new Set(entities(aText));
    return entities(bText).filter((entity) => left.has(entity)).length;
}

/**
 * Exact-event matcher: prefer identifiers, then tight headline/entity/date overlap.
 * Rejects same-vendor unrelated advisories (count-variant / weak overlap without IDs).
 */
export function isExactEventMatch(cluster, candidate, { now = new Date() } = {}) {
    void now;
    const clusterIds = extractIdentifiersFromCluster(cluster);
    const candidateIds = extractIdentifiersFromCandidate(candidate);
    if (shareStrongIdentifier(clusterIds, candidateIds)) return { match: true, reason: "strong-identifier" };
    if (shareExactIdentifier(clusterIds, candidateIds) && timeNear(cluster.sources?.[0] || {}, candidate, 96)) {
        return { match: true, reason: "identifier+time" };
    }

    const lead = cluster.sources?.[0] || {};
    const headlineScore = jaccard(tokenize(cluster.canonicalTopic || lead.headline), tokenize(candidate.headline));
    const overlap = entityOverlap(
        `${cluster.canonicalTopic} ${lead.summary || ""}`,
        `${candidate.headline} ${candidate.summary || ""}`,
    );
    if (!timeNear(lead, candidate, 72)) return { match: false, reason: "stale-or-distant" };

    // Same-source weak matches are not corroboration.
    if (lead.sourceId && candidate.sourceId && lead.sourceId === candidate.sourceId) {
        return { match: false, reason: "same-source-not-corroboration" };
    }

    if (headlineScore >= ENRICHMENT_LIMITS.minHeadlineJaccard && overlap >= ENRICHMENT_LIMITS.minEntityOverlap) {
        return { match: true, reason: "headline-entity-time" };
    }
    return { match: false, reason: "insufficient-similarity" };
}

export function findCorroboratingCandidates(cluster, candidates = [], limits = ENRICHMENT_LIMITS) {
    const matches = [];
    for (const candidate of candidates || []) {
        if (alreadyInCluster(cluster, candidate)) continue;
        const verdict = isExactEventMatch(cluster, candidate);
        if (!verdict.match) continue;
        matches.push({ ...candidate, matchReason: verdict.reason });
        if (matches.length >= limits.maxMatchesPerCluster) break;
    }
    return matches;
}

/**
 * Enrich one selected cluster using the already-fetched candidate pool.
 */
export function enrichCluster(cluster, {
    candidates = [],
    registry = SOURCE_REGISTRY,
    limits = ENRICHMENT_LIMITS,
} = {}) {
    const matches = findCorroboratingCandidates(cluster, candidates, limits);
    const mergedSources = [...(cluster.sources || [])];
    for (const match of matches) {
        if (!alreadyInCluster({ sources: mergedSources }, match)) mergedSources.push(match);
    }

    const independence = filterIndependentSources(mergedSources, { registry });
    const working = {
        ...cluster,
        sources: mergedSources,
        enrichmentMatches: matches,
    };
    const claims = deriveClaimsFromCluster(working);
    const conflicts = detectConflicts(independence.independent, claims);
    const claimEvidence = mapClaimEvidence(claims, independence.independent, mergedSources, conflicts);
    const seeded = seedUncertaintiesFromClaims(claimEvidence);
    const { resolvedUncertainties, remainingUncertainties } = resolveUncertainties({
        uncertainties: seeded,
        claimEvidence,
        conflicts,
        independentCount: independence.independent.length,
    });

    const readiness = computeReadinessScore({
        primaryCount: independence.primarySupport.length,
        independentCount: independence.independent.length,
        claimEvidence,
        remainingUncertainties,
        conflicts,
        freshness: cluster.freshness || "",
        relevance: cluster.relevance || 0,
        editorialFitScore: cluster.editorialFit?.score || 0,
    });

    const corroborationSummary = {
        attempted: true,
        matchCount: matches.length,
        originalSourceCount: (cluster.sources || []).length,
        enrichedSourceCount: mergedSources.length,
        independentSourceCount: independence.independent.length,
        primarySourceCount: independence.primarySupport.length,
        discoveryOnlyCount: independence.discoveryOnly.length,
        rejectedIndependence: independence.rejected.length,
        claimsChecked: claimEvidence.length,
        claimSummary: summarizeClaimEvidence(claimEvidence),
        conflictsFound: conflicts.length,
        uncertaintiesResolved: resolvedUncertainties.length,
        uncertaintiesRemaining: remainingUncertainties.length,
        readinessScore: readiness.score,
        blocksReady: readiness.blocksReady,
    };

    return {
        ...working,
        sources: mergedSources,
        enrichment: {
            phase: "10B.3",
            claimEvidence,
            corroborationSummary,
            resolvedUncertainties,
            remainingUncertainties,
            sourceIndependence: {
                independentSourceIds: independence.independentSourceIds,
                primarySupport: independence.primarySupport.map((item) => item.sourceId),
                secondarySupport: independence.secondarySupport.map((item) => item.sourceId),
                rejected: independence.rejected.map((item) => ({
                    sourceId: item.candidate.sourceId,
                    against: item.against,
                    reasons: item.reasons,
                })),
            },
            conflicts,
            readinessScore: readiness,
            matchReasons: matches.map((item) => ({
                sourceId: item.sourceId,
                url: item.articleUrl,
                reason: item.matchReason,
            })),
        },
        // Re-assess classic corroboration flag for downstream consumers.
        corroborated: independence.independent.length >= 2 || independence.primarySupport.some((item) => {
            const definition = registry.find((source) => source.id === item.sourceId);
            return definition?.requiresSecondaryConfirmation === false;
        }),
    };
}

/**
 * Enrich only selected news/blog clusters (bounded).
 */
export function enrichSelection({
    selection,
    candidates = [],
    registry = SOURCE_REGISTRY,
    limits = ENRICHMENT_LIMITS,
} = {}) {
    const selected = [...(selection?.news || []), ...(selection?.blog || [])].slice(0, limits.maxSelectedClusters);
    const enrichedNews = (selection?.news || []).map((cluster) =>
        enrichCluster(cluster, { candidates, registry, limits }));
    const enrichedBlog = (selection?.blog || []).map((cluster) =>
        enrichCluster(cluster, { candidates, registry, limits }));

    const summaries = [...enrichedNews, ...enrichedBlog].map((cluster) => cluster.enrichment?.corroborationSummary);
    const observability = {
        phase: "10B.3",
        corroborationAttempted: selected.length,
        corroborationSuccessful: summaries.filter((item) => item?.independentSourceCount >= 2).length,
        claimsVerified: summaries.reduce((sum, item) => sum + (item?.claimSummary?.VERIFIED_MULTI_SOURCE || 0) + (item?.claimSummary?.VERIFIED_PRIMARY || 0), 0),
        claimsUnresolved: summaries.reduce((sum, item) => sum + (item?.claimSummary?.UNRESOLVED || 0) + (item?.claimSummary?.PARTIALLY_VERIFIED || 0), 0),
        conflicts: summaries.reduce((sum, item) => sum + (item?.conflictsFound || 0), 0),
        candidatesPromoted: summaries.filter((item) => item && !item.blocksReady && item.uncertaintiesRemaining === 0).length,
        candidatesStillHeld: summaries.filter((item) => item?.blocksReady || item?.uncertaintiesRemaining > 0).length,
    };

    return {
        news: enrichedNews,
        blog: enrichedBlog,
        observability,
        limits,
    };
}
