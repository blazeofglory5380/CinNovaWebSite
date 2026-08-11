/**
 * Phase 10B.3 — claim-level evidence map.
 * Do not invent claims or sources; only map evidence present on candidates.
 */

import { createHash } from "node:crypto";
import { isPrimaryTier } from "./sourceTiers.mjs";

export const CLAIM_EVIDENCE_STATUSES = Object.freeze([
    "VERIFIED_PRIMARY",
    "VERIFIED_MULTI_SOURCE",
    "PARTIALLY_VERIFIED",
    "UNRESOLVED",
    "CONFLICTING",
]);

function claimIdFor(text = "") {
    return `claim-${createHash("sha1").update(String(text).trim().toLowerCase()).digest("hex").slice(0, 10)}`;
}

function stripHtml(value = "") {
    return String(value)
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, '"')
        .replace(/\s+/g, " ")
        .trim();
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
 * Derive consequential claim stubs from cluster sources (attributed, not invented).
 */
export function deriveClaimsFromCluster(cluster = {}) {
    const claims = [];
    const seen = new Set();
    for (const source of cluster.sources || []) {
        const text = stripHtml(source.summary || source.headline || "");
        if (text.length < 24) continue;
        const key = text.toLowerCase().slice(0, 160);
        if (seen.has(key)) continue;
        seen.add(key);
        const consequential = /require|mandate|must|CVE-|BOD|vulnerability|enact|fine|ban|order|directive|SBOM|KEV/i.test(text);
        claims.push({
            claimId: claimIdFor(text),
            claimText: text.slice(0, 400),
            claimType: consequential ? "CONSEQUENTIAL_FACT" : "CONTEXT",
            consequential,
            originSourceId: source.sourceId || "",
        });
    }
    if (!claims.length && cluster.canonicalTopic) {
        const text = stripHtml(cluster.canonicalTopic);
        claims.push({
            claimId: claimIdFor(text),
            claimText: text,
            claimType: "EVENT_IDENTITY",
            consequential: true,
            originSourceId: cluster.sources?.[0]?.sourceId || "",
        });
    }
    return claims;
}

/**
 * Attach supporting/independent sources to each claim.
 * @param {object[]} claims
 * @param {object[]} supportingCandidates - independence-filtered preferred
 * @param {object[]} allCandidates - full matching set (may include mirrors)
 */
function sourceKey(ref = {}) {
    return ref.url || `${ref.sourceId}:${ref.headline || ""}`;
}

function dedupeSourceRefs(refs = []) {
    const seen = new Set();
    const out = [];
    for (const ref of refs) {
        const key = sourceKey(ref);
        if (!key || seen.has(key)) continue;
        seen.add(key);
        out.push(ref);
    }
    return out;
}

function candidateSupportsClaim(candidate = {}, claim = {}) {
    // Event-identity claims are supported by any corroborating candidate on the cluster.
    if (claim.claimType === "EVENT_IDENTITY") return true;
    const blob = `${candidate.headline || ""} ${candidate.summary || ""}`.toLowerCase();
    const needle = String(claim.claimText || "").toLowerCase();
    if (!needle) return false;
    return blob.includes(needle.slice(0, 24)) || jaccardLite(blob, needle) >= 0.22;
}

export function mapClaimEvidence(claims = [], supportingCandidates = [], allCandidates = [], conflicts = []) {
    return claims.map((claim) => {
        const supportingSources = dedupeSourceRefs(
            (allCandidates || [])
                .filter((candidate) => candidateSupportsClaim(candidate, claim))
                .map(sourceRef),
        );
        const supportingKeys = new Set(supportingSources.map(sourceKey));

        // Primary/independent support must both be independence-filtered AND claim-relevant.
        // Non-independent mirrors may appear in supportingSources but never in independentSupport.
        const primarySupport = dedupeSourceRefs(
            (supportingCandidates || [])
                .filter((candidate) => isPrimaryTier(candidate.sourceTier))
                .filter((candidate) => candidateSupportsClaim(candidate, claim))
                .map(sourceRef)
                .filter((ref) => supportingKeys.has(sourceKey(ref))),
        );
        const independentSupport = dedupeSourceRefs(
            (supportingCandidates || [])
                .filter((candidate) => !isPrimaryTier(candidate.sourceTier))
                .filter((candidate) => candidateSupportsClaim(candidate, claim))
                .map(sourceRef)
                .filter((ref) => supportingKeys.has(sourceKey(ref))),
        );

        const conflict = (conflicts || []).find((item) => item.claimId === claim.claimId);
        let status = "UNRESOLVED";
        let notes = "Awaiting corroboration.";
        if (conflict) {
            status = "CONFLICTING";
            notes = conflict.notes || "Sources disagree on this claim.";
        } else if (primarySupport.length && independentSupport.length) {
            status = "VERIFIED_MULTI_SOURCE";
            notes = "Tier-1 primary plus independent secondary support.";
        } else if (independentSupport.length >= 2) {
            // Path B: two independent Tier-1/2 reputable sources agree on the claim.
            status = "VERIFIED_MULTI_SOURCE";
            notes = "Two or more independent reputable sources agree on this claim.";
        } else if (
            primarySupport.length >= 2
            || (primarySupport.length >= 1
                && supportingCandidates.filter((c) => candidateSupportsClaim(c, claim)).length >= 2)
        ) {
            status = "VERIFIED_MULTI_SOURCE";
            notes = "Multiple independent qualifying sources support this claim.";
        } else if (primarySupport.length && !claim.consequential) {
            status = "VERIFIED_PRIMARY";
            notes = "Non-consequential claim supported by Tier-1 primary.";
        } else if (primarySupport.length && claim.consequential && independentSupport.length === 0) {
            status = "PARTIALLY_VERIFIED";
            notes = "Consequential claim has Tier-1 primary only — independent secondary still required for READY.";
        } else if (supportingSources.length) {
            status = "PARTIALLY_VERIFIED";
            notes = "Some overlapping wording found; independence not established.";
        }

        return {
            claimId: claim.claimId,
            claimText: claim.claimText,
            claimType: claim.claimType,
            consequential: Boolean(claim.consequential),
            supportingSources,
            primarySupport,
            independentSupport,
            status,
            notes,
        };
    });
}

function jaccardLite(a, b) {
    const ta = new Set(String(a).toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 2));
    const tb = new Set(String(b).toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 2));
    if (!ta.size || !tb.size) return 0;
    let inter = 0;
    for (const token of ta) if (tb.has(token)) inter += 1;
    return inter / (ta.size + tb.size - inter);
}

export function summarizeClaimEvidence(claimEvidence = []) {
    const counts = Object.fromEntries(CLAIM_EVIDENCE_STATUSES.map((status) => [status, 0]));
    for (const claim of claimEvidence) {
        if (counts[claim.status] != null) counts[claim.status] += 1;
    }
    return {
        total: claimEvidence.length,
        consequential: claimEvidence.filter((claim) => claim.consequential).length,
        ...counts,
    };
}
