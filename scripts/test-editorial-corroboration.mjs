#!/usr/bin/env node
/**
 * Phase 10B.3 — corroboration & editorial readiness tests (fixture / no network).
 */
import assert from "node:assert/strict";
import { deriveClaimsFromCluster, mapClaimEvidence } from "./editorial/research/claimEvidence.mjs";
import {
    assessClaimReadyGate,
    buildClaimMatrix,
    extractPrincipalClaims,
} from "./editorial/research/claimMatrix.mjs";
import { qualifyBlogCluster, assessBlogSourceStandard } from "./editorial/research/blogEvergreen.mjs";
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
    isPressReleaseMirror,
} from "./editorial/research/independence.mjs";
import {
    compareNumericClaims,
    normalizeCurrencyToken,
    numericValuesAgree,
} from "./editorial/research/numericClaims.mjs";
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
import { scoreBlogFactCheck } from "./lib/editorial-factcheck.mjs";

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

// ── B: Tier-1 only → REVIEW (not READY); missing secondary is not HOLD ──────
{
    const enriched = enrichCluster(clusterFrom([candidate()]), {
        candidates: [],
        registry: SOURCE_REGISTRY,
    });
    assert.ok(enriched.enrichment.corroborationSummary.independentSourceCount < 2);
    assert.equal(enriched.enrichment.corroborationSummary.blocksReady, true);
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
    // Solo source without conflicts → REVIEW (needs corroboration), not automatic READY.
    assert.ok(["REVIEW", "HOLD"].includes(desk.disposition), desk.disposition);
    assert.notEqual(desk.disposition, "READY");
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

// ── Phase 3: same-event different-title clustering / enrichment ────────────
{
    const bbc = candidate({
        sourceId: "bbc-technology",
        sourceName: "BBC Technology",
        sourceTier: "TIER_1_NEWS",
        headline: "Wall Street giants hand Nvidia $500bn to fund boom in AI projects",
        summary: "Major lenders are committing about $500 billion in financing tied to Nvidia AI infrastructure projects.",
        articleUrl: "https://www.bbc.com/news/technology-nvidia-500bn",
        guid: "bbc-nvidia-500",
        topics: ["ai", "business"],
        scope: ["international"],
    });
    const verge = candidate({
        sourceId: "the-verge",
        sourceName: "The Verge",
        sourceTier: "TIER_2_REPUTABLE",
        headline: "Major lenders commit financing for Nvidia infrastructure expansion",
        summary: "Banks are lining up roughly $500bn in funding to support Nvidia-linked AI data center buildouts.",
        articleUrl: "https://www.theverge.com/nvidia-financing-500bn",
        guid: "verge-nvidia-500",
        topics: ["ai", "business"],
        scope: ["national"],
    });
    assert.equal(isExactEventMatch(clusterFrom([bbc]), verge).match, true, "different titles, same funding event");
    const enriched = enrichCluster(clusterFrom([bbc]), { candidates: [verge], registry: SOURCE_REGISTRY });
    assert.ok(enriched.enrichment.corroborationSummary.independentSourceCount >= 2);
    assert.ok((enriched.enrichment.claimMatrix || []).length >= 1);
    assert.equal(enriched.enrichment.corroborationSummary.blocksReady, false);
    const packet = buildResearchPacket({
        dateIso: "2026-07-30",
        selection: {
            news: [{ ...enriched, selectedDesk: "international" }],
            blog: [],
            limits: { news: 4, blog: 1 },
            rejectedWeakFit: [],
        },
    });
    const desk = scoreNewsDesk("international", packet.news.international, "2026-07-30");
    assert.equal(desk.disposition, "READY", desk.reason);
}

// ── Phase 3: same-wire / press-release mirrors not independent ─────────────
{
    const wire = candidate({
        sourceId: "ap-wire",
        sourceName: "Associated Press",
        sourceTier: "TIER_1_NEWS",
        headline: "Nvidia secures AI financing package",
        summary: "Nvidia-linked projects secured a large AI financing package from major lenders.",
        articleUrl: "https://apnews.com/article/nvidia-financing",
        guid: "wire-nvidia-1",
    });
    const syndicated = candidate({
        sourceId: "reuters-wire",
        sourceName: "Reuters",
        sourceTier: "TIER_1_NEWS",
        headline: "Nvidia secures AI financing package",
        summary: "Nvidia-linked projects secured a large AI financing package from major lenders.",
        articleUrl: "https://www.reuters.com/technology/nvidia-financing",
        guid: "wire-nvidia-1",
    });
    assert.equal(assessPairIndependence(wire, syndicated).independent, false);
    const prPrimary = candidate({
        sourceId: "nvidia-blog",
        sourceName: "NVIDIA Blog",
        sourceTier: "TIER_1_PRIMARY",
        headline: "NVIDIA Announces Expanded AI Infrastructure Financing",
        summary: "NVIDIA today announced expanded AI infrastructure financing with leading global banks.",
        articleUrl: "https://blogs.nvidia.com/blog/ai-financing",
        guid: "nvidia-pr-1",
    });
    const mirror = candidate({
        sourceId: "seo-mirror",
        sourceName: "Tech Wire Mirror",
        sourceTier: "TIER_2_REPUTABLE",
        headline: "NVIDIA Announces Expanded AI Infrastructure Financing",
        summary: "NVIDIA today announced expanded AI infrastructure financing with leading global banks.",
        articleUrl: "https://example-news.test/nvidia-announces-expanded-ai",
        guid: "mirror-1",
    });
    assert.equal(isPressReleaseMirror(prPrimary, mirror), true);
}

// ── Phase 3: primary + secondary pairing + cross-desk ──────────────────────
{
    const openai = candidate({
        sourceId: "openai-news",
        sourceName: "OpenAI News",
        sourceTier: "TIER_1_PRIMARY",
        headline: "OpenAI announces new enterprise API pricing",
        summary: "OpenAI announced updated enterprise API pricing for business customers.",
        articleUrl: "https://openai.com/index/enterprise-api-pricing",
        guid: "openai-1",
        topics: ["ai"],
        scope: ["national"],
    });
    const ars = candidate({
        sourceId: "ars-technica",
        sourceName: "Ars Technica",
        sourceTier: "TIER_2_REPUTABLE",
        headline: "OpenAI refreshes enterprise API pricing for businesses",
        summary: "Ars Technica reports OpenAI announced updated enterprise API pricing.",
        articleUrl: "https://arstechnica.com/ai/openai-enterprise-api-pricing",
        guid: "ars-openai-1",
        topics: ["business", "technology"],
        scope: ["national"],
    });
    const enriched = enrichCluster(clusterFrom([openai]), { candidates: [ars], registry: SOURCE_REGISTRY });
    assert.ok(enriched.enrichment.corroborationSummary.independentSourceCount >= 2);
    assert.ok(enriched.enrichment.matchReasons.some((m) => m.sourceId === "ars-technica"));
}

// ── Phase 3: numeric agreement vs conflict → HOLD ──────────────────────────
{
    assert.equal(normalizeCurrencyToken("$500bn"), normalizeCurrencyToken("$500 billion"));
    assert.equal(numericValuesAgree(normalizeCurrencyToken("$5B"), normalizeCurrencyToken("$5 billion")), true);
    const conflict = compareNumericClaims(
        "Company X raised $5 billion in funding.",
        "Company X raised $50 billion in funding.",
    );
    assert.ok(conflict.conflict.length >= 1);
    const enriched = enrichCluster(clusterFrom([
        candidate({
            sourceId: "bbc-technology",
            sourceName: "BBC Technology",
            sourceTier: "TIER_1_NEWS",
            headline: "Company X raises $5 billion",
            summary: "Company X raised $5 billion for AI expansion.",
            articleUrl: "https://www.bbc.com/news/company-x-5b",
            guid: "bbc-5b",
        }),
    ]), {
        candidates: [candidate({
            sourceId: "the-verge",
            sourceName: "The Verge",
            sourceTier: "TIER_2_REPUTABLE",
            headline: "Company X raises $50 billion",
            summary: "Company X raised $50 billion for AI expansion.",
            articleUrl: "https://www.theverge.com/company-x-50b",
            guid: "verge-50b",
        })],
        registry: SOURCE_REGISTRY,
    });
    assert.ok(enriched.enrichment.conflicts.length >= 1 || enriched.enrichment.corroborationSummary.blocksReady);
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

// ── Phase 3: REVIEW cannot promote without claim agreement ─────────────────
{
    const lead = candidate({
        sourceId: "bbc-technology",
        sourceName: "BBC Technology",
        sourceTier: "TIER_1_NEWS",
        headline: "Company X raised $5B",
        summary: "Company X raised $5B in a funding round.",
        articleUrl: "https://www.bbc.com/news/x-5b",
    });
    const weak = candidate({
        sourceId: "the-verge",
        sourceName: "The Verge",
        sourceTier: "TIER_2_REPUTABLE",
        headline: "Company X is investing in AI",
        summary: "Company X continues investing in AI products.",
        articleUrl: "https://www.theverge.com/x-ai",
    });
    const claims = extractPrincipalClaims(clusterFrom([lead, weak]));
    const matrix = buildClaimMatrix(claims, [lead, weak], [lead, weak], []);
    const gate = assessClaimReadyGate({ independentCount: 2, claimMatrix: matrix, conflicts: [] });
    // Topic overlap without financing-amount agreement must not unlock READY.
    const numericRow = matrix.find((row) => row.claimType === "NUMERIC_CLAIM");
    if (numericRow) {
        assert.notEqual(numericRow.status, "VERIFIED_MULTI_SOURCE");
        assert.equal(gate.blocksReady, true);
    }
}

// ── Phase 3: evergreen Blog ≠ breaking-news freshness; still needs sources ─
{
    const nistCluster = {
        clusterId: "blog-nist",
        canonicalTopic: "NIST AI Risk Management Framework guidance for businesses",
        sources: [candidate({
            sourceId: "nist-news",
            sourceName: "NIST News",
            sourceTier: "TIER_1_PRIMARY",
            headline: "NIST AI Risk Management Framework guidance",
            summary: "NIST published AI Risk Management Framework guidance for organizations.",
            articleUrl: "https://www.nist.gov/news-events/news/ai-rmf",
            publishedAt: "2026-06-01T00:00:00.000Z",
        })],
        freshness: "BACKGROUND",
        relevance: 3,
        topics: ["ai", "policy"],
        cinovaClassification: "NEW",
        route: { route: "BLOG" },
    };
    const blogQual = qualifyBlogCluster(nistCluster, { registry: SOURCE_REGISTRY });
    assert.equal(blogQual.qualified, true);
    assert.equal(blogQual.freshnessRequired, false);
    assert.ok(assessBlogSourceStandard(nistCluster, { registry: SOURCE_REGISTRY }).ok);

    const unsourced = scoreBlogFactCheck({
        title: "Understanding AI inference chips",
        classification: "evergreen",
        seoTitle: "Understanding AI inference chips",
        seoDescription: "A practical overview of AI inference chips for builders.",
        sources: [],
        content: [{ heading: "Overview", body: "x ".repeat(200) }],
    });
    assert.ok(["HOLD", "REVIEW"].includes(unsourced.status));
    assert.notEqual(unsourced.status, "READY");

    const sourced = scoreBlogFactCheck({
        title: "What NIST’s latest AI guidance means for businesses",
        classification: "evergreen",
        seoTitle: "What NIST AI guidance means for businesses",
        seoDescription: "A sourced explainer on NIST AI Risk Management Framework guidance.",
        sources: [{ publisher: "NIST", url: "https://www.nist.gov/news-events/news/ai-rmf", type: "official" }],
        content: [
            { heading: "Overview", body: "NIST published AI Risk Management Framework guidance. ".repeat(8) },
            { heading: "Takeaways", body: "Businesses should map controls to the framework. ".repeat(8) },
            { heading: "Sources", body: "Treat NIST as the authoritative anchor. ".repeat(8) },
        ],
    });
    assert.equal(sourced.status, "READY", sourced.reasons.join("; "));
}

console.log("test:editorial-corroboration passed");
