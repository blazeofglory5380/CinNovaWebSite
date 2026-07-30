#!/usr/bin/env node
/**
 * Phase 10B.3 — corroboration & editorial readiness tests (fixture / no network).
 */
import assert from "node:assert/strict";
import { deriveClaimsFromCluster, mapClaimEvidence } from "./editorial/research/claimEvidence.mjs";
import { detectConflicts } from "./editorial/research/conflict.mjs";
import {
    enrichCluster,
    findCorroboratingCandidates,
    isExactEventMatch,
} from "./editorial/research/enrichment.mjs";
import {
    extractIdentifiers,
    shareStrongIdentifier,
} from "./editorial/research/identifiers.mjs";
import {
    assessPairIndependence,
    filterIndependentSources,
} from "./editorial/research/independence.mjs";
import { buildResearchPacket } from "./editorial/research/packetBuilder.mjs";
import { computeReadinessScore } from "./editorial/research/readiness.mjs";
import { SOURCE_REGISTRY } from "./editorial/research/sourceRegistry.mjs";
import { areLikelySyndicated } from "./editorial/research/syndication.mjs";
import {
    classifyUncertainty,
    resolveUncertainties,
    seedUncertaintiesFromClaims,
} from "./editorial/research/uncertainty.mjs";
import { scoreNewsDesk } from "./lib/editorial-research.mjs";

const now = "2026-07-30T15:00:00.000Z";

function candidate(overrides = {}) {
    return {
        sourceId: "cisa-advisories",
        sourceName: "CISA Cybersecurity Advisories",
        sourceTier: "TIER_1_PRIMARY",
        headline: "CISA Publishes SBOM Minimum Elements Update",
        summary: "CISA published updated SBOM Minimum Elements guidance for federal software suppliers.",
        articleUrl: "https://www.cisa.gov/news-events/news/sbom-minimum-elements",
        publishedAt: now,
        guid: "cisa-sbom-1",
        scope: ["national"],
        topics: ["cybersecurity", "software"],
        ...overrides,
    };
}

function mitCandidate(overrides = {}) {
    return candidate({
        sourceId: "mit-ai-news",
        sourceName: "MIT News AI",
        sourceTier: "TIER_3_REPUTABLE_SECONDARY",
        headline: "CISA updates SBOM Minimum Elements for software teams",
        summary: "MIT News reports CISA published updated SBOM Minimum Elements guidance affecting federal software suppliers.",
        articleUrl: "https://news.mit.edu/2026/cisa-sbom-minimum-elements",
        guid: "mit-sbom-1",
        ...overrides,
    });
}

function clusterFrom(sources) {
    return {
        clusterId: "research-test",
        canonicalTopic: sources[0].headline,
        sources,
        scope: ["national"],
        topics: ["cybersecurity", "software", "ai"],
        freshness: "FRESH",
        relevance: 3,
        editorialFit: { score: 3 },
        publishedRange: { latest: now },
        cinovaClassification: "NEW",
        corroboration: { rationale: "fixture" },
    };
}

// ── Identifiers ────────────────────────────────────────────────────────────
{
    const ids = extractIdentifiers("CISA BOD 26-04 and CVE-2026-12345 plus ICSA-26-209-02");
    assert.ok(ids.some((item) => item.kind === "CVE" && item.id === "CVE-2026-12345"));
    assert.ok(ids.some((item) => item.kind === "CISA_BOD"));
    assert.ok(ids.some((item) => item.kind === "CISA_ICS"));
    assert.equal(
        shareStrongIdentifier(
            extractIdentifiers("CVE-2026-12345 advisory"),
            extractIdentifiers("Vendor notes CVE-2026-12345 exploitation"),
        ),
        true,
    );
}

// ── Independence ───────────────────────────────────────────────────────────
{
    const primary = candidate();
    const mirror = candidate({
        sourceId: "reuters-wire",
        sourceName: "Reuters",
        sourceTier: "TIER_2_HIGH_AUTHORITY",
        headline: primary.headline,
        summary: primary.summary,
        articleUrl: "https://www.reuters.com/technology/cisa-sbom-minimum-elements",
        guid: primary.guid,
    });
    assert.equal(areLikelySyndicated(primary, mirror) || !assessPairIndependence(primary, mirror).independent, true);

    const independent = filterIndependentSources([primary, mitCandidate()], { registry: SOURCE_REGISTRY });
    assert.equal(independent.independent.length, 2);

    const syndicatedPair = filterIndependentSources([
        candidate({ sourceId: "ap-wire", sourceName: "Associated Press", sourceTier: "TIER_2_HIGH_AUTHORITY", guid: "wire-1", articleUrl: "https://apnews.com/article/sbom" }),
        candidate({ sourceId: "reuters-wire", sourceName: "Reuters", sourceTier: "TIER_2_HIGH_AUTHORITY", guid: "wire-1", articleUrl: "https://www.reuters.com/world/sbom", headline: "CISA Publishes SBOM Minimum Elements Update" }),
    ], { registry: SOURCE_REGISTRY });
    assert.ok(syndicatedPair.independent.length < 2, "syndicated copies must not count as two independents");
}

// ── Exact event match / unrelated same-vendor ──────────────────────────────
{
    const base = clusterFrom([candidate({
        headline: "CISA Adds CVE-2026-55555 to KEV Catalog",
        summary: "CISA added CVE-2026-55555 to the Known Exploited Vulnerabilities catalog.",
        articleUrl: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog",
    })]);
    const related = candidate({
        sourceId: "nist-news",
        sourceName: "NIST News",
        sourceTier: "TIER_1_PRIMARY",
        headline: "NIST notes CISA KEV addition for CVE-2026-55555",
        summary: "NIST coverage of CVE-2026-55555 after CISA KEV listing.",
        articleUrl: "https://www.nist.gov/news-events/news/2026/07/kev-cve-2026-55555",
        guid: "nist-kev-1",
    });
    const unrelated = candidate({
        sourceId: "cisa-advisories",
        sourceName: "CISA Cybersecurity Advisories",
        headline: "CISA Releases ICSA-26-200-01 for Rockwell Controllers",
        summary: "CISA published ICSA-26-200-01 affecting Rockwell Automation controllers.",
        articleUrl: "https://www.cisa.gov/news-events/ics-advisories/icsa-26-200-01",
        guid: "icsa-unrelated",
    });
    assert.equal(isExactEventMatch(base, related).match, true);
    assert.equal(isExactEventMatch(base, unrelated).match, false);
    assert.equal(findCorroboratingCandidates(base, [related, unrelated]).length, 1);
}

// ── Claim evidence + conflicts + uncertainty ───────────────────────────────
{
    const claims = deriveClaimsFromCluster(clusterFrom([candidate(), mitCandidate()]));
    assert.ok(claims.length >= 1);
    const mapped = mapClaimEvidence(claims, [candidate(), mitCandidate()], [candidate(), mitCandidate()], []);
    assert.ok(mapped.some((claim) => claim.status === "VERIFIED_MULTI_SOURCE" || claim.status === "PARTIALLY_VERIFIED"));

    const conflicts = detectConflicts([
        candidate({ summary: "CISA said 12 agencies must comply by August 1, 2026." }),
        mitCandidate({ summary: "Reporting says 40 agencies must comply by September 15, 2026." }),
    ], claims);
    assert.ok(conflicts.length >= 1, "conflicting dates/numbers should be detected");

    const classified = classifyUncertainty("Event date not confirmed for BOD effective timeline");
    assert.equal(classified.category, "DATE");

    const seeded = seedUncertaintiesFromClaims(mapped);
    const resolved = resolveUncertainties({
        uncertainties: seeded,
        claimEvidence: mapped.filter((claim) => claim.status === "VERIFIED_MULTI_SOURCE"),
        conflicts: [],
        independentCount: 2,
    });
    // When claimEvidence passed to resolve is only verified ones, consequential open is 0
    assert.ok(Array.isArray(resolved.resolvedUncertainties));
    assert.ok(Array.isArray(resolved.remainingUncertainties));
}

// ── Readiness score helper (does not override fact-check) ──────────────────
{
    const blocked = computeReadinessScore({
        primaryCount: 1,
        independentCount: 1,
        claimEvidence: [{ consequential: true, status: "PARTIALLY_VERIFIED" }],
        remainingUncertainties: [{ text: "still open" }],
        conflicts: [],
        freshness: "FRESH",
        relevance: 3,
        editorialFitScore: 3,
    });
    assert.equal(blocked.blocksReady, true);

    const open = computeReadinessScore({
        primaryCount: 1,
        independentCount: 2,
        claimEvidence: [{ consequential: true, status: "VERIFIED_MULTI_SOURCE" }],
        remainingUncertainties: [],
        conflicts: [],
        freshness: "FRESH",
        relevance: 3,
        editorialFitScore: 3,
    });
    assert.equal(open.blocksReady, false);
    assert.ok(open.score >= 70);
}

// ── A: Tier-1 + independent secondary → READY eligible ─────────────────────
{
    const enriched = enrichCluster(clusterFrom([candidate()]), {
        candidates: [mitCandidate()],
        registry: SOURCE_REGISTRY,
    });
    assert.ok(enriched.enrichment.corroborationSummary.independentSourceCount >= 2);
    assert.equal(enriched.enrichment.remainingUncertainties.length, 0);
    const packet = buildResearchPacket({
        dateIso: "2026-07-30",
        selection: {
            news: [{ ...enriched, selectedDesk: "national" }],
            blog: [],
            limits: { news: 4, blog: 1 },
            rejectedWeakFit: [],
            observability: enriched.enrichment.corroborationSummary,
        },
    });
    assert.ok(packet.news.national.sources.length >= 2);
    assert.equal(packet.news.national.uncertainties.length, 0);
    assert.ok(packet.news.national.claimEvidence.length >= 1);
    assert.equal(packet.selection.phase, "10B.3");
    const desk = scoreNewsDesk("national", packet.news.national, "2026-07-30");
    assert.equal(desk.disposition, "READY", desk.reason);
    assert.equal(desk.qualified, true);
}

// ── B: Tier-1 only + consequential uncertainty → HOLD ──────────────────────
{
    const enriched = enrichCluster(clusterFrom([candidate()]), {
        candidates: [],
        registry: SOURCE_REGISTRY,
    });
    assert.ok(enriched.enrichment.remainingUncertainties.length > 0);
    const packet = buildResearchPacket({
        dateIso: "2026-07-30",
        selection: {
            news: [{ ...enriched, selectedDesk: "national" }],
            blog: [],
            limits: { news: 4, blog: 1 },
            rejectedWeakFit: [],
        },
    });
    const desk = scoreNewsDesk("national", packet.news.national, "2026-07-30");
    assert.equal(desk.disposition, "HOLD");
    assert.equal(desk.qualified, false);
}

// ── C: two syndicated sources → still effectively single ───────────────────
{
    const ap = candidate({
        sourceId: "ap-wire",
        sourceName: "Associated Press",
        sourceTier: "TIER_2_HIGH_AUTHORITY",
        articleUrl: "https://apnews.com/article/sbom-min",
        guid: "syndicate-sbom",
    });
    const reuters = candidate({
        sourceId: "reuters-wire",
        sourceName: "Reuters",
        sourceTier: "TIER_2_HIGH_AUTHORITY",
        articleUrl: "https://www.reuters.com/technology/sbom-min",
        guid: "syndicate-sbom",
        headline: ap.headline,
        summary: ap.summary,
    });
    const enriched = enrichCluster(clusterFrom([ap]), {
        candidates: [reuters],
        registry: SOURCE_REGISTRY,
    });
    assert.ok(enriched.enrichment.corroborationSummary.independentSourceCount < 2);
}

// ── E: conflicting sources → HOLD ──────────────────────────────────────────
{
    const enriched = enrichCluster(clusterFrom([
        candidate({ summary: "CISA said compliance starts August 1, 2026 for 12 agencies." }),
    ]), {
        candidates: [
            mitCandidate({ summary: "Reporting says compliance starts September 15, 2026 for 40 agencies." }),
        ],
        registry: SOURCE_REGISTRY,
    });
    assert.ok(enriched.enrichment.conflicts.length >= 1);
    const packet = buildResearchPacket({
        dateIso: "2026-07-30",
        selection: {
            news: [{ ...enriched, selectedDesk: "national" }],
            blog: [],
            limits: { news: 4, blog: 1 },
            rejectedWeakFit: [],
        },
    });
    // Conflicts keep uncertainties / HOLD language path
    const desk = scoreNewsDesk("national", packet.news.national, "2026-07-30");
    assert.ok(["HOLD", "REVIEW"].includes(desk.disposition), desk.disposition);
    assert.notEqual(desk.disposition, "READY");
}

// ── Stale corroboration rejected ───────────────────────────────────────────
{
    const base = clusterFrom([candidate()]);
    const stale = mitCandidate({ publishedAt: "2026-01-01T00:00:00.000Z" });
    assert.equal(isExactEventMatch(base, stale).match, false);
}

// ── Backward-compatible packet without enrichment ──────────────────────────
{
    const packet = buildResearchPacket({
        dateIso: "2026-07-30",
        selection: {
            news: [{ ...clusterFrom([candidate()]), selectedDesk: "national" }],
            blog: [],
            limits: { news: 4, blog: 1 },
            rejectedWeakFit: [],
        },
    });
    assert.ok(packet.news.national.uncertainties.length >= 1);
    assert.ok(Array.isArray(packet.news.national.claimEvidence));
    const desk = scoreNewsDesk("national", packet.news.national, "2026-07-30");
    assert.equal(desk.disposition, "HOLD");
}

console.log("test:editorial-corroboration passed");
