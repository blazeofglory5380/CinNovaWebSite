import { selectClustersForPacket } from "./selection.mjs";

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
    };
}

function sourceType(candidate) {
    return candidate.sourceTier === "TIER_1_PRIMARY" ? "official" : "verified";
}

function packetSources(cluster) {
    return (cluster.sources || []).map((candidate) => ({
        label: candidate.headline,
        publisher: candidate.sourceName,
        url: candidate.articleUrl,
        type: sourceType(candidate),
        note: candidate.sourceTier === "TIER_1_PRIMARY"
            ? "Direct official announcement; claims remain attributed until Phase 10A fact-check."
            : "Independent research source included for corroboration.",
    }));
}

function bestScope(cluster) {
    return cluster.selectedDesk
        || ["local", "state", "national", "international"].find((desk) => cluster.scope?.includes(desk))
        || "national";
}

function newsStory(cluster) {
    const lead = cluster.sources?.[0] || {};
    const summaries = [...new Set((cluster.sources || []).map((source) => source.summary).filter(Boolean))];
    const fitNote = cluster.editorialFit
        ? ` Editorial fit ${cluster.editorialFit.score}; bucket ${cluster.diversityBucket || "n/a"}.`
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
        verifiedClaims: [],
        attributedClaims: summaries.length ? summaries : [`${lead.sourceName || "A listed source"} published: ${cluster.canonicalTopic}`],
        uncertainties: ["All source-derived claims require Phase 10A fact-check and contextual review before drafting."],
        editorialNotes: `${cluster.corroboration?.rationale || "Corroboration assessment unavailable"} Dedupe: ${cluster.cinovaClassification || "unclassified"}.${fitNote}`,
        forceDraft: false,
        factCheckStatus: "",
    };
}

function blogStory(cluster) {
    const lead = cluster.sources?.[0] || {};
    const title = cluster.canonicalTopic;
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
    };
}

export function buildResearchPacket({ dateIso, clusters = [], qualified = [] } = {}) {
    const pool = qualified.length ? qualified : clusters.filter((cluster) => cluster.qualified);
    const selection = selectClustersForPacket(pool);
    const news = {
        local: blankNewsStory(),
        state: blankNewsStory(),
        national: blankNewsStory(),
        international: blankNewsStory(),
    };

    for (const cluster of selection.news) {
        const preferred = bestScope(cluster);
        if (!news[preferred].title) {
            news[preferred] = newsStory(cluster);
            continue;
        }
        const alternate = ["national", "international", "state", "local"]
            .find((desk) => !news[desk].title && (cluster.scope || []).includes(desk));
        if (alternate) news[alternate] = newsStory({ ...cluster, selectedDesk: alternate });
    }

    const blogCluster = selection.blog[0] || null;
    return {
        schemaVersion: "10A",
        date: dateIso,
        safety: SAFETY,
        selection: {
            phase: "10B.2",
            limits: selection.limits,
            selectedNewsTopics: selection.news.map((cluster) => cluster.canonicalTopic),
            selectedBlogTopics: selection.blog.map((cluster) => cluster.canonicalTopic),
            rejectedWeakFit: selection.rejectedWeakFit,
        },
        news,
        blog: blogCluster ? blogStory(blogCluster) : blankBlog(),
    };
}
