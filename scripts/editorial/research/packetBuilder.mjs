import { selectClustersForPacket } from "./selection.mjs";
import { isPrimaryTier } from "./sourceTiers.mjs";

const SAFETY = "VERIFIED RESEARCH PACKET — research ingestion only. Empty desks become NO QUALIFIED STORY. Never invent events, claims, or sources; Phase 10A fact-check decides readiness.";

export function slugify(value = "") {
    return String(value)
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 90);
}

function blankNewsStory() {
    return {
        slug: "",
        title: "",
        dek: "",
        category: "",
        location: "",
        publishedAt: "",
        summary: "",
        whyItMatters: "",
        sources: [],
        verifiedClaims: [],
        attributedClaims: [],
        uncertainties: [],
        editorialNotes: "",
        forceDraft: false,
        factCheckStatus: "",
        // Phase 10B.3 optional enrichment fields (backward compatible).
        claimEvidence: [],
        corroborationSummary: null,
        resolvedUncertainties: [],
        remainingUncertainties: [],
        sourceIndependence: null,
        readinessScore: null,
    };
}

function blankBlog() {
    return {
        slug: "",
        title: "",
        category: "Artificial Intelligence",
        excerpt: "",
        seoTitle: "",
        seoDescription: "",
        relatedReading: [],
        relatedNewsIds: [],
        sources: [],
        forceDraft: false,
        researchBrief: { primaryKeyword: "", secondaryKeywords: [], audience: "", searchIntent: "" },
        heroImageBrief: { concept: "", mood: "", avoid: ["fabricated logos", "readable fake UI text"] },
        claimEvidence: [],
        corroborationSummary: null,
        readinessScore: null,
    };
}

function sourceType(candidate) {
    return isPrimaryTier(candidate.sourceTier) ? "official" : "verified";
}

function packetSources(cluster) {
    return (cluster.sources || []).map((candidate) => ({
        label: candidate.headline,
        publisher: candidate.sourceName,
        url: candidate.articleUrl,
        type: sourceType(candidate),
        note: isPrimaryTier(candidate.sourceTier)
            ? "Direct official/company announcement; claims remain attributed until Phase 10A fact-check."
            : candidate.matchReason
              ? `Corroboration match (${candidate.matchReason}).`
              : "Independent research source included for corroboration.",
    }));
}

function bestScope(cluster) {
    return cluster.selectedDesk
        || ["local", "state", "national", "international"].find((desk) => cluster.scope?.includes(desk))
        || "national";
}

function enrichmentFields(cluster) {
    const enrichment = cluster.enrichment || null;
    if (!enrichment) {
        return {
            claimEvidence: [],
            corroborationSummary: null,
            resolvedUncertainties: [],
            remainingUncertainties: [],
            sourceIndependence: null,
            readinessScore: null,
        };
    }
    return {
        claimEvidence: enrichment.claimEvidence || [],
        corroborationSummary: enrichment.corroborationSummary || null,
        resolvedUncertainties: enrichment.resolvedUncertainties || [],
        remainingUncertainties: enrichment.remainingUncertainties || [],
        sourceIndependence: enrichment.sourceIndependence || null,
        readinessScore: enrichment.readinessScore || null,
    };
}

function newsStory(cluster) {
    const lead = cluster.sources?.[0] || {};
    const summaries = [...new Set((cluster.sources || []).map((source) => source.summary).filter(Boolean))];
    const fitNote = cluster.editorialFit
        ? ` Editorial fit ${cluster.editorialFit.score}; bucket ${cluster.diversityBucket || "n/a"}.`
        : "";
    const enrich = enrichmentFields(cluster);
    const verifiedClaims = (enrich.claimEvidence || [])
        .filter((claim) => ["VERIFIED_PRIMARY", "VERIFIED_MULTI_SOURCE"].includes(claim.status))
        .map((claim) => claim.claimText);
    const attributedClaims = (enrich.claimEvidence || [])
        .filter((claim) => !["VERIFIED_PRIMARY", "VERIFIED_MULTI_SOURCE"].includes(claim.status))
        .map((claim) => claim.claimText);
    // Phase 10B.3: never inject the old unconditional boilerplate uncertainty.
    // Only pass through remainingUncertainties produced by enrichment (real gaps).
    const uncertainties = (enrich.remainingUncertainties || [])
        .map((item) => (typeof item === "string" ? item : item?.text))
        .filter(Boolean);

    const conflictNote = (cluster.enrichment?.conflicts || []).length
        ? ` CONFLICTS: ${cluster.enrichment.conflicts.map((item) => item.notes).join(" | ")}`
        : "";

    return {
        slug: slugify(cluster.canonicalTopic),
        title: cluster.canonicalTopic,
        dek: lead.summary || `Source material attributes this development to ${lead.sourceName || "the listed publishers"}.`,
        category: cluster.topics?.[0] || "Technology",
        location: bestScope(cluster) === "international" ? "International" : bestScope(cluster)[0].toUpperCase() + bestScope(cluster).slice(1),
        publishedAt: cluster.publishedRange?.latest || "",
        summary: lead.summary || cluster.canonicalTopic,
        whyItMatters: `The development intersects with CinNova coverage of ${(cluster.topics || ["technology"]).slice(0, 3).join(", ")}.`,
        sources: packetSources(cluster),
        verifiedClaims: verifiedClaims.length ? verifiedClaims : [],
        attributedClaims: attributedClaims.length
            ? attributedClaims
            : (summaries.length ? summaries : [`${lead.sourceName || "A listed source"} published: ${cluster.canonicalTopic}`]),
        uncertainties,
        editorialNotes: `${cluster.corroboration?.rationale || "Corroboration assessment unavailable"} Dedupe: ${cluster.cinovaClassification || "unclassified"}.${fitNote}${
            enrich.corroborationSummary
                ? ` Enrichment: independent=${enrich.corroborationSummary.independentSourceCount}, readiness=${enrich.corroborationSummary.readinessScore}.`
                : ""
        }${conflictNote}`,
        forceDraft: false,
        factCheckStatus: "",
        ...enrich,
    };
}

function blogStory(cluster) {
    const lead = cluster.sources?.[0] || {};
    const title = cluster.canonicalTopic;
    const enrich = enrichmentFields(cluster);
    return {
        slug: slugify(title),
        title,
        category: "Artificial Intelligence",
        excerpt: lead.summary || title,
        seoTitle: title.slice(0, 60),
        seoDescription: (lead.summary || `A sourced CinNova analysis of ${title}`).slice(0, 155),
        relatedReading: [],
        relatedNewsIds: [],
        sources: packetSources(cluster),
        forceDraft: false,
        researchBrief: {
            primaryKeyword: cluster.topics?.[0] || "artificial intelligence",
            secondaryKeywords: (cluster.topics || []).slice(1, 5),
            audience: "CinNova readers evaluating technology, policy, and infrastructure",
            searchIntent: "Informational",
        },
        heroImageBrief: {
            concept: `Editorial illustration grounded in the reported topic: ${title}`,
            mood: "Cinematic, credible, restrained",
            avoid: ["fabricated logos", "readable fake UI text"],
        },
        claimEvidence: enrich.claimEvidence,
        corroborationSummary: enrich.corroborationSummary,
        readinessScore: enrich.readinessScore,
    };
}

/**
 * @param {{ dateIso: string, clusters?: object[], qualified?: object[], selection?: { news: object[], blog: object[], limits?: object, rejectedWeakFit?: object[] } }} args
 * When `selection` is provided (Phase 10B.3 enriched selection), it is used as-is.
 */
export function buildResearchPacket({ dateIso, clusters = [], qualified = [], selection = null } = {}) {
    const pool = qualified.length ? qualified : clusters.filter((cluster) => cluster.qualified);
    const chosen = selection || selectClustersForPacket(pool);
    const news = {
        local: blankNewsStory(),
        state: blankNewsStory(),
        national: blankNewsStory(),
        international: blankNewsStory(),
    };

    for (const cluster of chosen.news || []) {
        const preferred = bestScope(cluster);
        if (!news[preferred].title) {
            news[preferred] = newsStory(cluster);
            continue;
        }
        const alternate = ["national", "international", "state", "local"]
            .find((desk) => !news[desk].title && (cluster.scope || []).includes(desk));
        if (alternate) news[alternate] = newsStory({ ...cluster, selectedDesk: alternate });
    }

    const blogCluster = chosen.blog?.[0] || null;
    return {
        schemaVersion: "10A",
        date: dateIso,
        safety: SAFETY,
        selection: {
            phase: selection ? "10B.3" : "10B.2",
            limits: chosen.limits,
            selectedNewsTopics: (chosen.news || []).map((cluster) => cluster.canonicalTopic),
            selectedBlogTopics: (chosen.blog || []).map((cluster) => cluster.canonicalTopic),
            rejectedWeakFit: chosen.rejectedWeakFit,
            corroboration: chosen.observability || null,
        },
        news,
        blog: blogCluster ? blogStory(blogCluster) : blankBlog(),
    };
}
