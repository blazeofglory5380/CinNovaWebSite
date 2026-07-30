/**
 * Phase 10B.3 — transparent readiness helper score.
 * Fact-check remains authoritative; score must not override unresolved consequential claims.
 */

export function computeReadinessScore({
    primaryCount = 0,
    independentCount = 0,
    claimEvidence = [],
    remainingUncertainties = [],
    conflicts = [],
    freshness = "",
    relevance = 0,
    editorialFitScore = 0,
} = {}) {
    const notes = [];
    let score = 40;

    if (primaryCount > 0) {
        score += 18;
        notes.push("primary-source support");
    }
    if (independentCount >= 2) {
        score += 18;
        notes.push("independent corroboration");
    } else if (independentCount === 1) {
        score += 6;
        notes.push("single eligible source only");
    }

    const verified = claimEvidence.filter((claim) =>
        ["VERIFIED_PRIMARY", "VERIFIED_MULTI_SOURCE"].includes(claim.status)).length;
    const unresolvedConsequential = claimEvidence.filter(
        (claim) =>
            claim.consequential &&
            !["VERIFIED_PRIMARY", "VERIFIED_MULTI_SOURCE"].includes(claim.status),
    ).length;

    score += Math.min(12, verified * 4);
    if (verified) notes.push("verified claims present");

    if (freshness === "FRESH" || freshness === "RECENT") {
        score += 6;
        notes.push("freshness");
    }
    if (relevance > 0) {
        score += Math.min(8, Math.round(relevance * 2));
        notes.push("relevance");
    }
    if (editorialFitScore >= 2) {
        score += 4;
        notes.push("editorial fit");
    }

    if (remainingUncertainties.length) {
        score -= Math.min(20, remainingUncertainties.length * 8);
        notes.push("uncertainties remain");
    }
    if (unresolvedConsequential) {
        score -= Math.min(24, unresolvedConsequential * 10);
        notes.push("unresolved consequential claims");
    }
    if (conflicts.length) {
        score -= 30;
        notes.push("conflicts present");
    }

    score = Math.max(0, Math.min(100, score));
    const blocksReady =
        conflicts.length > 0 ||
        remainingUncertainties.length > 0 ||
        unresolvedConsequential > 0 ||
        independentCount < 2;

    return {
        score,
        blocksReady,
        notes,
        inputs: {
            primaryCount,
            independentCount,
            verifiedClaims: verified,
            unresolvedConsequential,
            remainingUncertainties: remainingUncertainties.length,
            conflicts: conflicts.length,
            freshness,
            relevance,
            editorialFitScore,
        },
    };
}
