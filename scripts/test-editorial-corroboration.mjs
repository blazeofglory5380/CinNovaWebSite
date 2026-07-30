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

// ── Unconditional boilerplate removed from auto packets ────────────────────
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
    assert.equal(
        packet.news.national.uncertainties.some((item) => /All source-derived claims require Phase 10A/i.test(item)),
        false,
        "old unconditional uncertainty must not be auto-injected",
    );
    assert.ok(Array.isArray(packet.news.national.claimEvidence));
    // Single source without enrichment → cannot be READY (>=2 sources required)
    const desk = scoreNewsDesk("national", packet.news.national, "2026-07-30");
    assert.notEqual(desk.disposition, "READY");
}

// ── Single-source policy (intentional) ─────────────────────────────────────
{
    // Single Tier-1, no uncertainties → REVIEW/not READY (needs >=2 sources)
    const solo = {
        slug: "solo-tier1",
        title: "CISA publishes SBOM Minimum Elements guidance",
        dek: "Official CISA announcement.",
        category: "cybersecurity",
        location: "National",
        publishedAt: now,
        summary: "CISA published SBOM Minimum Elements guidance for software suppliers.",
        whyItMatters: "Software security and infrastructure.",
        sources: [{
            label: "CISA",
            publisher: "CISA",
            url: "https://www.cisa.gov/news-events/news/sbom-minimum-elements",
            type: "official",
        }],
        verifiedClaims: ["CISA published SBOM Minimum Elements guidance for software suppliers."],
        attributedClaims: [],
        uncertainties: [],
        editorialNotes: "solo",
        forceDraft: false,
    };
    const soloDesk = scoreNewsDesk("national", solo, "2026-07-30");
    assert.notEqual(soloDesk.disposition, "READY");
    assert.ok(["REVIEW", "HOLD"].includes(soloDesk.disposition), soloDesk.disposition);

    // Tier-1 + same-org secondary → not independent enough for enrichment READY
    const sameOrg = enrichCluster(clusterFrom([candidate()]), {
        candidates: [candidate({
            sourceId: "cisa-advisories",
            sourceName: "CISA Cybersecurity Advisories",
            headline: "CISA Publishes SBOM Minimum Elements Update — FAQ",
            summary: "CISA published updated SBOM Minimum Elements guidance for federal software suppliers.",
            articleUrl: "https://www.cisa.gov/news-events/news/sbom-minimum-elements-faq",
            guid: "cisa-sbom-faq",
        })],
        registry: SOURCE_REGISTRY,
    });
    assert.ok(sameOrg.enrichment.corroborationSummary.independentSourceCount < 2);

    // Tier-1 + syndicated mirror
    const syndicated = enrichCluster(clusterFrom([candidate()]), {
        candidates: [candidate({
            sourceId: "reuters-wire",
            sourceName: "Reuters",
            sourceTier: "TIER_2_HIGH_AUTHORITY",
            headline: candidate().headline,
            summary: candidate().summary,
            articleUrl: "https://www.reuters.com/technology/cisa-sbom-minimum-elements",
            guid: candidate().guid,
        })],
        registry: SOURCE_REGISTRY,
    });
    assert.ok(syndicated.enrichment.corroborationSummary.independentSourceCount < 2);
}

// ── Claim evidence: non-independent cannot inflate VERIFIED_MULTI_SOURCE ───
{
    const primary = candidate();
    const unrelatedSecondary = mitCandidate({
        headline: "Unrelated MIT robotics seminar next week",
        summary: "Campus seminar about robotics curricula with no SBOM content.",
        articleUrl: "https://news.mit.edu/2026/robotics-seminar",
        guid: "mit-unrelated",
    });
    // Force both into supportingCandidates list but claim text only matches primary
    const claims = deriveClaimsFromCluster(clusterFrom([primary]));
    const mapped = mapClaimEvidence(claims, [primary, unrelatedSecondary], [primary, unrelatedSecondary], []);
    for (const claim of mapped) {
        if (claim.consequential || claim.claimType !== "EVENT_IDENTITY") {
            assert.notEqual(claim.status, "VERIFIED_MULTI_SOURCE");
        }
    }
}

// ── Uncertainty categories: classify + never silently drop ─────────────────
{
    const samples = {
        DATE: "Event date not confirmed for the BOD effective timeline",
        SCOPE: "Scope of which systems must comply remains unclear",
        IMPACT: "Impact severity for operators is not confirmed",
        WHO_IS_AFFECTED: "Who is affected among vendors remains unclear",
        PRODUCT_VERSION: "Affected firmware version is not confirmed",
        REGULATORY_STATUS: "Whether the SBOM directive is required is unclear",
        QUOTE_ATTRIBUTION: "Spokesperson statement attribution is unverified",
        NUMERIC_CLAIM: "The number of affected agencies is unconfirmed",
        CAUSAL_CLAIM: "Whether the outage was caused by the flaw is disputed",
        OTHER: "Additional context still needs human review",
    };
    for (const [category, text] of Object.entries(samples)) {
        assert.equal(classifyUncertainty(text).category, category, text);
    }
    const unresolved = resolveUncertainties({
        uncertainties: Object.values(samples),
        claimEvidence: [],
        conflicts: [],
        independentCount: 0,
    });
    assert.equal(unresolved.remainingUncertainties.length, Object.keys(samples).length);
    assert.equal(unresolved.resolvedUncertainties.length, 0);
}

// ── Version conflict → not READY ───────────────────────────────────────────
{
    const enriched = enrichCluster(clusterFrom([
        candidate({
            headline: "CISA advisory for Widget Firmware",
            summary: "CISA says Widget firmware version 2.1.0 is affected by CVE-2026-99999.",
            articleUrl: "https://www.cisa.gov/news-events/ics-advisories/icsa-26-210-01",
        }),
    ]), {
        candidates: [mitCandidate({
            headline: "Widget firmware advisory analysis",
            summary: "Independent analysis says only Widget firmware version 3.4.0 is affected by CVE-2026-99999.",
            articleUrl: "https://news.mit.edu/2026/widget-firmware-cve-2026-99999",
        })],
        registry: SOURCE_REGISTRY,
    });
    assert.ok(enriched.enrichment.conflicts.some((item) => item.type === "PRODUCT_VERSION" || item.type === "NUMERIC_CLAIM" || item.type === "DATE")
        || enriched.enrichment.conflicts.length >= 1
        || enriched.enrichment.remainingUncertainties.length > 0);
    const packet = buildResearchPacket({
        dateIso: "2026-07-30",
        selection: {
            news: [{ ...enriched, selectedDesk: "national" }],
            blog: [],
            limits: { news: 4, blog: 1 },
            rejectedWeakFit: [],
        },
    });
    assert.notEqual(scoreNewsDesk("national", packet.news.national, "2026-07-30").disposition, "READY");
}

// ── Readiness score cannot override Phase 10A ──────────────────────────────
{
    const high = computeReadinessScore({
        primaryCount: 1,
        independentCount: 2,
        claimEvidence: [{ consequential: true, status: "PARTIALLY_VERIFIED" }],
        remainingUncertainties: [],
        conflicts: [],
        freshness: "FRESH",
        relevance: 5,
        editorialFitScore: 4,
    });
    assert.equal(high.blocksReady, true);
    const story = {
        slug: "high-score-unresolved",
        title: "CISA SBOM requirements for software teams",
        dek: "Guidance published.",
        category: "cybersecurity",
        location: "National",
        publishedAt: now,
        summary: "CISA published SBOM requirements for software teams.",
        whyItMatters: "Software security.",
        sources: [
            { label: "CISA", publisher: "CISA", url: "https://www.cisa.gov/a", type: "official" },
            { label: "MIT", publisher: "MIT News", url: "https://news.mit.edu/a", type: "verified" },
        ],
        verifiedClaims: [],
        attributedClaims: ["CISA published SBOM requirements."],
        uncertainties: ["Unresolved consequential claim (PARTIALLY_VERIFIED): CISA published SBOM requirements for software teams."],
        editorialNotes: `readiness=${high.score}`,
        readinessScore: high,
        forceDraft: false,
    };
    const desk = scoreNewsDesk("national", story, "2026-07-30");
    assert.equal(desk.disposition, "HOLD");
}

// ── Older Phase 10A packet shape still works ───────────────────────────────
{
    const legacy = {
        slug: "legacy-packet-story",
        title: "NIST announces artificial intelligence cybersecurity standards",
        dek: "NIST published AI cybersecurity standards with CISA corroboration.",
        category: "cybersecurity",
        location: "National",
        publishedAt: "2026-07-29T16:00:00.000Z",
        summary: "NIST announced artificial intelligence cybersecurity software standards for national infrastructure.",
        whyItMatters: "AI cybersecurity software standards affect CinNova product security.",
        sources: [
            { label: "NIST", publisher: "NIST", url: "https://www.nist.gov/news-events/news/2026/07/ai-cyber", type: "official" },
            { label: "CISA", publisher: "CISA", url: "https://www.cisa.gov/news-events/alerts/2026/07/29/ai-cyber", type: "official" },
        ],
        verifiedClaims: [
            "NIST announced artificial intelligence cybersecurity software standards.",
            "CISA corroborated the NIST artificial intelligence cybersecurity announcement.",
        ],
        attributedClaims: [],
        uncertainties: [],
        editorialNotes: "legacy shape",
        forceDraft: false,
    };
    const desk = scoreNewsDesk("national", legacy, "2026-07-30");
    assert.equal(desk.disposition, "READY");
    assert.equal(desk.qualified, true);
}

console.log("test:editorial-corroboration passed");
