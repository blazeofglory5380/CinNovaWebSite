/**
 * Phase 3 / 10B.3 — post-selection corroboration enrichment.
 *
 * selected candidate → trusted pool search → same-event match → independence →
 * claim matrix → readiness → enriched cluster
 *
 * Cross-desk: does not filter by desk. Bounded: selected clusters only; reuses
 * already-fetched candidates (no paywall/robots bypass; no open-web crawl).
 */

import { deriveClaimsFromCluster, mapClaimEvidence, summarizeClaimEvidence } from "./claimEvidence.mjs";
import {
    assessClaimReadyGate,
    buildClaimMatrix,
    extractPrincipalClaims,
} from "./claimMatrix.mjs";
import { detectConflicts } from "./conflict.mjs";
import {
    isComplementaryPair,
    scoreSameEvent,
} from "./eventFingerprint.mjs";
import { filterIndependentSources } from "./independence.mjs";
import { computeReadinessScore } from "./readiness.mjs";
import { SOURCE_REGISTRY } from "./sourceRegistry.mjs";
import {
    resolveUncertainties,
    seedUncertaintiesFromClaims,
} from "./uncertainty.mjs";

export const ENRICHMENT_LIMITS = Object.freeze({
    maxMatchesPerCluster: 12,
    maxSelectedClusters: 8,
    minHeadlineJaccard: 0.28,
    minEntityOverlap: 2,
});

function candidateKey(candidate = {}) {
    return candidate.articleUrl || `${candidate.sourceId}:${candidate.guid || candidate.headline}`;
}

function alreadyInCluster(cluster, candidate) {
    const key = candidateKey(candidate);
    return (cluster.sources || []).some((source) => candidateKey(source) === key);
}

/**
 * Exact-event matcher (Phase 3): entities, amounts, event type, time window —
 * not title similarity alone.
 */
export function isExactEventMatch(cluster, candidate, { now = new Date() } = {}) {
    void now;
    const scored = scoreSameEvent(cluster, candidate);
    return {
        match: scored.match,
        reason: scored.reason,
        score: scored.score,
        details: scored.details,
    };
}

export function findCorroboratingCandidates(cluster, candidates = [], limits = ENRICHMENT_LIMITS) {
    const lead = cluster.sources?.[0] || {};
    const scored = [];
    for (const candidate of candidates || []) {
        if (alreadyInCluster(cluster, candidate)) continue;
        const verdict = isExactEventMatch(cluster, candidate);
        if (!verdict.match) continue;
        const complementary = isComplementaryPair(lead, candidate) ? 0.15 : 0;
        scored.push({
            ...candidate,
            matchReason: verdict.reason,
            matchScore: (verdict.score || 0) + complementary,
            matchDetails: verdict.details || null,
        });
    }
    scored.sort((a, b) => b.matchScore - a.matchScore);
    return scored.slice(0, limits.maxMatchesPerCluster);
}

/**
 * Deliberate primary↔secondary / newsroom↔newsroom pairing pass over the pool.
 * Cross-desk: ignores route/desk tags on candidates.
 */
export function findPrimarySecondaryPairs(cluster, candidates = [], limits = ENRICHMENT_LIMITS) {
    const lead = cluster.sources?.[0] || {};
    const matches = findCorroboratingCandidates(cluster, candidates, {
        ...limits,
        maxMatchesPerCluster: limits.maxMatchesPerCluster * 2,
    });
    const preferred = matches.filter((candidate) => isComplementaryPair(lead, candidate));
    const rest = matches.filter((candidate) => !isComplementaryPair(lead, candidate));
    return [...preferred, ...rest].slice(0, limits.maxMatchesPerCluster);
}

function toClaimEvidenceFromMatrix(matrix = []) {
    return matrix.map((row) => ({
        claimId: row.claimId,
        claimText: row.claim,
        claimType: row.claimType,
        consequential: row.consequential,
        supportingSources: [row.sourceA, row.sourceB].filter(Boolean),
        primarySupport: [row.sourceA, row.sourceB].filter((s) => s && /PRIMARY/i.test(s.sourceTier || "")),
        independentSupport: [row.sourceA, row.sourceB].filter(Boolean),
        status: row.status,
        notes: row.conflict || `agreement=${row.agreement}; readyImpact=${row.readyImpact}`,
        agreement: row.agreement,
        readyImpact: row.readyImpact,
        conflict: row.conflict,
    }));
}

/**
 * Enrich one selected cluster using the already-fetched trusted candidate pool.
 */
export function enrichCluster(cluster, {
    candidates = [],
    registry = SOURCE_REGISTRY,
    limits = ENRICHMENT_LIMITS,
} = {}) {
    const matches = findPrimarySecondaryPairs(cluster, candidates, limits);
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

    const principalClaims = extractPrincipalClaims(working);
    const legacyClaims = deriveClaimsFromCluster(working);
    const conflicts = detectConflicts(independence.independent, principalClaims);
    const claimMatrix = buildClaimMatrix(
        principalClaims,
        independence.independent,
        mergedSources,
        conflicts,
    );
    // Prefer matrix-backed evidence; keep legacy map for observability.
    const claimEvidence = claimMatrix.length
        ? toClaimEvidenceFromMatrix(claimMatrix)
        : mapClaimEvidence(legacyClaims, independence.independent, mergedSources, conflicts);

    const claimGate = assessClaimReadyGate({
        independentCount: independence.independent.length,
        claimMatrix,
        conflicts,
    });

    const seeded = seedUncertaintiesFromClaims(claimEvidence, {
        independentCount: independence.independent.length,
    });
    const { resolvedUncertainties, remainingUncertainties } = resolveUncertainties({
        uncertainties: seeded,
        claimEvidence,
        conflicts,
        independentCount: independence.independent.length,
    });

    // Conflicts or claim-gate failures keep remaining uncertainties non-empty —
    // but only when ≥2 independents already exist (otherwise stay REVIEW via source count).
    const gatedRemaining = [...remainingUncertainties];
    if (
        claimGate.blocksReady
        && independence.independent.length >= 2
        && !gatedRemaining.length
    ) {
        gatedRemaining.push({
            text: claimGate.rationale,
            category: "OTHER",
            reason: claimGate.rationale,
        });
    }
    if (conflicts.length && !gatedRemaining.some((u) => /conflict/i.test(u.text || ""))) {
        gatedRemaining.push({
            text: conflicts.map((c) => c.notes).join("; "),
            category: "NUMERIC_CLAIM",
            reason: "numeric/date conflict",
        });
    }

    const readiness = computeReadinessScore({
        primaryCount: independence.primarySupport.length,
        independentCount: independence.independent.length,
        claimEvidence,
        remainingUncertainties: gatedRemaining,
        conflicts,
        freshness: cluster.freshness || "",
        relevance: cluster.relevance || 0,
        editorialFitScore: cluster.editorialFit?.score || 0,
    });

    // READY helper never overrides missing independence or claim disagreement.
    if (claimGate.blocksReady) readiness.blocksReady = true;

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
        claimGate,
        conflictsFound: conflicts.length,
        uncertaintiesResolved: resolvedUncertainties.length,
        uncertaintiesRemaining: gatedRemaining.length,
        readinessScore: readiness.score,
        blocksReady: readiness.blocksReady || claimGate.blocksReady,
        phase: "3",
    };

    return {
        ...working,
        sources: mergedSources,
        enrichment: {
            phase: "3",
            claimEvidence,
            claimMatrix,
            principalClaims,
            corroborationSummary,
            resolvedUncertainties,
            remainingUncertainties: gatedRemaining,
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
                score: item.matchScore,
            })),
        },
        corroborated:
            independence.independent.length >= 2
            || independence.primarySupport.some((item) => {
                const definition = registry.find((source) => source.id === item.sourceId);
                return definition?.requiresSecondaryConfirmation === false;
            }),
    };
}

/**
 * Enrich only selected news/blog clusters (bounded). Cross-desk pool search.
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
        phase: "3",
        corroborationAttempted: selected.length,
        corroborationSuccessful: summaries.filter((item) => item?.independentSourceCount >= 2).length,
        secondSourcesFound: summaries.reduce(
            (sum, item) => sum + Math.max(0, (item?.enrichedSourceCount || 0) - (item?.originalSourceCount || 0)),
            0,
        ),
        claimsVerified: summaries.reduce(
            (sum, item) =>
                sum
                + (item?.claimSummary?.VERIFIED_MULTI_SOURCE || 0)
                + (item?.claimSummary?.VERIFIED_PRIMARY || 0),
            0,
        ),
        claimsUnresolved: summaries.reduce(
            (sum, item) =>
                sum + (item?.claimSummary?.UNRESOLVED || 0) + (item?.claimSummary?.PARTIALLY_VERIFIED || 0),
            0,
        ),
        conflicts: summaries.reduce((sum, item) => sum + (item?.conflictsFound || 0), 0),
        candidatesPromoted: summaries.filter(
            (item) => item && !item.blocksReady && item.uncertaintiesRemaining === 0 && item.independentSourceCount >= 2,
        ).length,
        candidatesStillHeld: summaries.filter((item) => item?.blocksReady || item?.uncertaintiesRemaining > 0).length,
    };

    return {
        news: enrichedNews,
        blog: enrichedBlog,
        observability,
        limits,
    };
}
