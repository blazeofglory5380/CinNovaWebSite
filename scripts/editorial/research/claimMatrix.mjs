/**
 * Phase 3 — claim corroboration matrix for READY/REVIEW decisions.
 * READY requires agreement on principal consequential claims, not mere topic overlap.
 */

import { createHash } from "node:crypto";
import { extractNormalizedEntities } from "./entities.mjs";
import { extractNumericClaims, numericValuesAgree, compareNumericClaims } from "./numericClaims.mjs";
import { isPrimaryTier } from "./sourceTiers.mjs";

function claimIdFor(text = "") {
    return `claim-${createHash("sha1").update(String(text).trim().toLowerCase()).digest("hex").slice(0, 10)}`;
}

function stripHtml(value = "") {
    return String(value)
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

const CONSEQUENTIAL_RE =
    /\b(rais(?:e|ed|ing)|fund\w*|financ\w*|\$[\d.]+|\d+\s*(?:billion|bn|million|mn)|CVE-|BOD|ICSA-|order(?:ed|s)?|fine[sd]?|ban(?:ned)?|acquir\w*|merg\w*|layoff|mandate|approv\w*|charg\w*)\b/i;

/**
 * Extract principal consequential claims from a cluster (attributed, not invented).
 */
export function extractPrincipalClaims(cluster = {}) {
    const claims = [];
    const seen = new Set();
    const sources = cluster.sources || [];
    const lead = sources[0] || {};
    const leadText = stripHtml(`${lead.headline || ""} ${lead.summary || ""}`);
    const entities = extractNormalizedEntities(
        `${cluster.canonicalTopic || ""} ${sources.map((s) => `${s.headline} ${s.summary}`).join(" ")}`,
    );
    const amounts = extractNumericClaims(leadText);

    // Event identity claim.
    const eventText = stripHtml(cluster.canonicalTopic || lead.headline || "").slice(0, 240);
    if (eventText) {
        const id = claimIdFor(`event:${eventText}`);
        if (!seen.has(id)) {
            seen.add(id);
            claims.push({
                claimId: id,
                claimText: eventText,
                claimType: "EVENT_IDENTITY",
                consequential: true,
                entities,
                amounts,
                originSourceId: lead.sourceId || "",
            });
        }
    }

    // Distinctive currency/financing claims.
    for (const amount of amounts.filter((a) => a.kind === "currency")) {
        const company = entities[0] || "named organization";
        const text = `${company} financing/value claim ${amount.raw}`;
        const id = claimIdFor(text);
        if (seen.has(id)) continue;
        seen.add(id);
        claims.push({
            claimId: id,
            claimText: text,
            claimType: "NUMERIC_CLAIM",
            consequential: true,
            entities,
            amounts: [amount],
            originSourceId: lead.sourceId || "",
        });
    }

    // Regulatory / advisory excerpts — attributed context, not READY-blocking principals.
    for (const source of sources) {
        const text = stripHtml(source.summary || source.headline || "");
        if (text.length < 24) continue;
        if (!CONSEQUENTIAL_RE.test(text)) continue;
        const snippet = text.slice(0, 280);
        const id = claimIdFor(snippet);
        if (seen.has(id)) continue;
        seen.add(id);
        claims.push({
            claimId: id,
            claimText: snippet,
            claimType: "CONTEXT",
            consequential: false,
            entities: extractNormalizedEntities(text),
            amounts: extractNumericClaims(text),
            originSourceId: source.sourceId || "",
        });
        if (claims.length >= 6) break;
    }

    return claims;
}

function sourceSupportsPrincipalClaim(candidate = {}, claim = {}) {
    const blob = stripHtml(`${candidate.headline || ""} ${candidate.summary || ""}`);
    if (!blob) return false;

    if (claim.claimType === "EVENT_IDENTITY") {
        const shared = extractNormalizedEntities(blob).filter((id) =>
            (claim.entities || []).includes(id));
        if (shared.length >= 1 && (claim.amounts || []).length === 0) {
            // Soft support: same entities + some topical overlap with claim text.
            const claimTokens = new Set(
                claim.claimText.toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 3),
            );
            const blobTokens = blob.toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 3);
            const hit = blobTokens.filter((t) => claimTokens.has(t)).length;
            return hit >= 2 || shared.length >= 2;
        }
        if (shared.length >= 1 && (claim.amounts || []).length) {
            const { agree } = compareNumericClaims(claim.claimText, blob);
            // Prefer currency agreement when the event claim carried amounts from lead.
            return agree.some((row) => row.kind === "currency") || shared.length >= 2;
        }
        return shared.length >= 2;
    }

    if (claim.claimType === "NUMERIC_CLAIM" && (claim.amounts || []).length) {
        const shared = extractNormalizedEntities(blob).filter((id) =>
            (claim.entities || []).includes(id));
        const candAmounts = extractNumericClaims(blob);
        const amountOk = (claim.amounts || []).some((need) =>
            candAmounts.some(
                (have) => have.kind === need.kind && numericValuesAgree(need.value, have.value),
            ));
        // Financing claim requires both entity and amount — topic-only is insufficient.
        return shared.length >= 1 && amountOk;
    }

    // Generic consequential: entity overlap + keyword/jaccard.
    const shared = extractNormalizedEntities(blob).filter((id) =>
        (claim.entities || []).includes(id));
    const needle = claim.claimText.toLowerCase().slice(0, 40);
    if (shared.length >= 1 && blob.toLowerCase().includes(needle.slice(0, 20))) return true;
    if (shared.length >= 1) {
        const claimTokens = new Set(
            claim.claimText.toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 3),
        );
        const hit = blob
            .toLowerCase()
            .split(/[^a-z0-9]+/)
            .filter((t) => t.length > 3 && claimTokens.has(t)).length;
        return hit >= 3;
    }
    return false;
}

function sourceRef(candidate = {}) {
    return {
        sourceId: candidate.sourceId || "",
        sourceName: candidate.sourceName || "",
        sourceTier: candidate.sourceTier || "",
        url: candidate.articleUrl || "",
        headline: candidate.headline || "",
    };
}

/**
 * Build claim corroboration matrix rows.
 */
export function buildClaimMatrix(claims = [], independentSources = [], allSources = [], conflicts = []) {
    return (claims || []).map((claim) => {
        const supporters = (allSources || []).filter((s) => sourceSupportsPrincipalClaim(s, claim));
        const independentSupporters = (independentSources || []).filter((s) =>
            sourceSupportsPrincipalClaim(s, claim));
        const primary = independentSupporters.filter((s) => isPrimaryTier(s.sourceTier));
        const secondary = independentSupporters.filter((s) => !isPrimaryTier(s.sourceTier));

        const conflict = (conflicts || []).find(
            (c) => c.claimId === claim.claimId || (c.type === "NUMERIC_CLAIM" && claim.claimType === "NUMERIC_CLAIM"),
        );

        let agreement = "none";
        let status = "UNRESOLVED";
        let readyImpact = "blocks-ready-if-consequential";

        if (conflict) {
            agreement = "conflict";
            status = "CONFLICTING";
            readyImpact = "HOLD";
        } else if (
            (primary.length && secondary.length)
            || independentSupporters.length >= 2
        ) {
            agreement = "agree";
            status = "VERIFIED_MULTI_SOURCE";
            readyImpact = claim.consequential ? "supports-READY" : "neutral";
        } else if (primary.length && !claim.consequential) {
            agreement = "partial";
            status = "VERIFIED_PRIMARY";
            readyImpact = "neutral";
        } else if (independentSupporters.length === 1) {
            agreement = "partial";
            status = "PARTIALLY_VERIFIED";
            readyImpact = claim.consequential ? "REVIEW" : "neutral";
        } else if (supporters.length) {
            agreement = "partial";
            status = "PARTIALLY_VERIFIED";
            readyImpact = "REVIEW";
        }

        return {
            claim: claim.claimText,
            claimId: claim.claimId,
            claimType: claim.claimType,
            consequential: Boolean(claim.consequential),
            sourceA: independentSupporters[0] ? sourceRef(independentSupporters[0]) : null,
            sourceB: independentSupporters[1] ? sourceRef(independentSupporters[1]) : null,
            supportingSourceIds: independentSupporters.map((s) => s.sourceId),
            agreement,
            conflict: conflict ? conflict.notes || conflict.type : null,
            status,
            readyImpact,
        };
    });
}

/**
 * READY promotion gate from claim matrix + independence (does not weaken 2-source rule).
 */
export function assessClaimReadyGate({
    independentCount = 0,
    claimMatrix = [],
    conflicts = [],
} = {}) {
    // READY hinges on principal event/numeric claims — not every attributed context sentence.
    const consequential = claimMatrix.filter(
        (row) =>
            row.consequential
            && (row.claimType === "EVENT_IDENTITY" || row.claimType === "NUMERIC_CLAIM" || row.claimType === "CONSEQUENTIAL_FACT"),
    );
    const conflicting = consequential.filter((row) => row.agreement === "conflict" || row.status === "CONFLICTING");
    const agreed = consequential.filter((row) => row.status === "VERIFIED_MULTI_SOURCE");
    const unresolved = consequential.filter(
        (row) => !["VERIFIED_MULTI_SOURCE", "VERIFIED_PRIMARY"].includes(row.status),
    );

    const blocksReady =
        independentCount < 2
        || conflicts.length > 0
        || conflicting.length > 0
        || (consequential.length > 0 && agreed.length === 0)
        || unresolved.some((row) => row.claimType === "NUMERIC_CLAIM" || row.claimType === "EVENT_IDENTITY");

    return {
        blocksReady,
        independentCount,
        consequentialCount: consequential.length,
        agreedCount: agreed.length,
        unresolvedCount: unresolved.length,
        conflictCount: conflicting.length + conflicts.length,
        rationale: blocksReady
            ? independentCount < 2
                ? "Needs ≥2 independent sources"
                : conflicting.length || conflicts.length
                  ? "Unresolved numeric/date conflicts — HOLD"
                  : "Principal consequential claims lack multi-source agreement — REVIEW"
            : "Independent sources agree on principal consequential claims",
    };
}

export { sourceSupportsPrincipalClaim as sourceSupportsPrincipalClaimForTests };
