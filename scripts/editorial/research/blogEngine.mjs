/**
 * Phase 4 — Blog Engine 2.0 (evergreen pipeline + 30-day plan).
 * Operationally separate from breaking News freshness/corroboration.
 */

import { getPublishedBlogPosts } from "../../../src/data/blogPosts.js";
import { getPublicNewsStories } from "../../../src/data/newsPosts.js";
import { jaccard, tokenize } from "../../lib/editorial-dedupe.mjs";
import { qualifyBlogCluster } from "./blogEvergreen.mjs";
import { SOURCE_REGISTRY } from "./sourceRegistry.mjs";

export const BLOG_ENGINE_CATEGORIES = Object.freeze([
    "AI explainers",
    "AI tutorials",
    "technology guides",
    "cybersecurity",
    "productivity",
    "software",
    "business",
    "startups",
    "design",
    "education",
    "app guides",
    "CinNova ecosystem content",
]);

/** Seed topic library — titles are working titles only; not published. */
const EVERGREEN_TOPIC_SEEDS = Object.freeze([
    {
        workingTitle: "What NIST’s AI Risk Management Framework means for businesses",
        category: "AI explainers",
        searchIntent: "Informational",
        audience: "Business and product leaders evaluating AI risk controls",
        primaryKeyword: "NIST AI Risk Management Framework",
        sourceBasis: ["nist-news"],
        classification: "evergreen",
        ctaHints: ["newsletter", "techmate"],
    },
    {
        workingTitle: "How harmful AI hallucinations are evaluated in practice",
        category: "AI explainers",
        searchIntent: "Informational",
        audience: "Builders shipping LLM features",
        primaryKeyword: "AI hallucination evaluation",
        sourceBasis: ["nist-news", "mit-ai", "arxiv-cs-ai"],
        classification: "evergreen",
        ctaHints: ["newsletter"],
    },
    {
        workingTitle: "A practical guide to securing small-business cloud accounts",
        category: "cybersecurity",
        searchIntent: "Informational / How-to",
        audience: "SMB operators",
        primaryKeyword: "small business cloud security",
        sourceBasis: ["cisa-advisories", "nist-news"],
        classification: "evergreen",
        ctaHints: ["techmate", "newsletter"],
    },
    {
        workingTitle: "How satellite weather data is used in forecasting",
        category: "technology guides",
        searchIntent: "Informational",
        audience: "Curious readers and STEM educators",
        primaryKeyword: "satellite weather data forecasting",
        sourceBasis: ["noaa-news", "nasa-press"],
        classification: "evergreen",
        ctaHints: ["newsletter"],
    },
    {
        workingTitle: "Understanding AI inference chips",
        category: "AI explainers",
        searchIntent: "Informational",
        audience: "Developers and investors following AI infrastructure",
        primaryKeyword: "AI inference chips",
        sourceBasis: ["nvidia-blog", "ieee-spectrum", "mit-technology-review"],
        classification: "evergreen",
        ctaHints: ["newsletter"],
    },
    {
        workingTitle: "How FDA digital health notices affect consumer apps",
        category: "app guides",
        searchIntent: "Informational",
        audience: "Health-tech founders and compliance readers",
        primaryKeyword: "FDA digital health consumer apps",
        sourceBasis: ["fda-press", "cdc-mmwr"],
        classification: "evergreen",
        ctaHints: ["poisonguard", "newsletter"],
    },
    {
        workingTitle: "Reading a Federal Reserve press release without the jargon",
        category: "business",
        searchIntent: "Informational",
        audience: "Non-specialist business readers",
        primaryKeyword: "Federal Reserve press release explained",
        sourceBasis: ["federal-reserve-press"],
        classification: "evergreen",
        ctaHints: ["newsletter", "book"],
    },
    {
        workingTitle: "What CISA Known Exploited Vulnerabilities mean for IT teams",
        category: "cybersecurity",
        searchIntent: "Informational",
        audience: "IT and security practitioners",
        primaryKeyword: "CISA KEV catalog explained",
        sourceBasis: ["cisa-advisories", "nist-news"],
        classification: "evergreen",
        ctaHints: ["techmate"],
    },
    {
        workingTitle: "A beginner’s guide to AI model cards and documentation",
        category: "AI tutorials",
        searchIntent: "How-to",
        audience: "Early-career ML engineers and PMs",
        primaryKeyword: "AI model cards guide",
        sourceBasis: ["google-ai-blog", "huggingface-blog", "nist-news"],
        classification: "evergreen",
        ctaHints: ["studynest", "newsletter"],
    },
    {
        workingTitle: "How EPA and NOAA data support climate-aware product decisions",
        category: "technology guides",
        searchIntent: "Informational",
        audience: "Product and sustainability teams",
        primaryKeyword: "EPA NOAA climate data products",
        sourceBasis: ["epa-news", "noaa-news"],
        classification: "evergreen",
        ctaHints: ["newsletter"],
    },
    {
        workingTitle: "Startup due diligence: reading an SEC press release",
        category: "startups",
        searchIntent: "Informational",
        audience: "Founders and early investors",
        primaryKeyword: "SEC press release startup diligence",
        sourceBasis: ["sec-press"],
        classification: "evergreen",
        ctaHints: ["book", "newsletter"],
    },
    {
        workingTitle: "Designing trustworthy AI UX without invented claims",
        category: "design",
        searchIntent: "Informational",
        audience: "Product designers and content designers",
        primaryKeyword: "trustworthy AI UX design",
        sourceBasis: ["nist-news", "ftc-press"],
        classification: "evergreen",
        ctaHints: ["newsletter"],
    },
    {
        workingTitle: "StudyNest study habits that actually stick",
        category: "education",
        searchIntent: "How-to",
        audience: "Students and parents",
        primaryKeyword: "effective study habits AI tutor",
        sourceBasis: ["nsf-news", "nist-news"],
        classification: "evergreen",
        ctaHints: ["studynest"],
    },
    {
        workingTitle: "CinNova ecosystem: when to use News vs Blog vs Apps",
        category: "CinNova ecosystem content",
        searchIntent: "Navigational / Informational",
        audience: "CinNova readers discovering the product suite",
        primaryKeyword: "CinNova News Blog Apps guide",
        sourceBasis: ["nist-news"],
        classification: "evergreen",
        ctaHints: ["newsletter", "studynest", "techmate", "book"],
    },
    {
        workingTitle: "Productivity workflows for researching with primary sources",
        category: "productivity",
        searchIntent: "How-to",
        audience: "Knowledge workers",
        primaryKeyword: "research productivity primary sources",
        sourceBasis: ["nist-news", "mit-ai"],
        classification: "evergreen",
        ctaHints: ["newsletter", "book"],
    },
]);

function duplicateCheck(title = "") {
    const tokens = tokenize(title);
    const blogs = getPublishedBlogPosts().map((post) => ({
        slug: post.slug,
        score: jaccard(tokens, tokenize(`${post.title} ${post.excerpt || ""}`)),
    }));
    const news = getPublicNewsStories().map((story) => ({
        slug: story.slug,
        score: jaccard(tokens, tokenize(`${story.title} ${story.dek || ""}`)),
    }));
    const hit = [...blogs, ...news].filter((row) => row.score >= 0.45).sort((a, b) => b.score - a.score)[0];
    return hit
        ? { status: "NEAR_DUPLICATE", against: hit.slug, score: hit.score }
        : { status: "NEW", against: null, score: 0 };
}

function relatedCinova(title = "", keyword = "") {
    const text = `${title} ${keyword}`;
    const blogs = getPublishedBlogPosts()
        .map((post) => ({
            slug: post.slug,
            score: jaccard(tokenize(text), tokenize(`${post.title} ${post.excerpt || ""}`)),
        }))
        .filter((row) => row.score >= 0.18)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((row) => row.slug);
    return blogs;
}

/**
 * Build a rolling 30-day Blog plan (report-only; never publishes).
 * Target ~3 strong posts/week ≈ 12–13 slots in 30 days.
 * Does not invent search volume.
 */
export function buildBlogContentCalendar({
    startDateIso = new Date().toISOString().slice(0, 10),
    postsPerWeek = 3,
    days = 30,
} = {}) {
    const start = new Date(`${startDateIso}T12:00:00.000Z`);
    const slots = Math.min(
        EVERGREEN_TOPIC_SEEDS.length,
        Math.ceil((days / 7) * postsPerWeek),
    );
    const articles = [];
    for (let i = 0; i < slots; i += 1) {
        const seed = EVERGREEN_TOPIC_SEEDS[i % EVERGREEN_TOPIC_SEEDS.length];
        const dayOffset = Math.floor((i * 7) / postsPerWeek);
        const date = new Date(start.getTime() + dayOffset * 86_400_000);
        const dateIso = date.toISOString().slice(0, 10);
        const sources = seed.sourceBasis
            .map((id) => SOURCE_REGISTRY.find((s) => s.id === id))
            .filter(Boolean);
        const dup = duplicateCheck(seed.workingTitle);
        articles.push({
            dateIso,
            workingTitle: seed.workingTitle,
            category: seed.category,
            searchIntent: seed.searchIntent,
            targetAudience: seed.audience,
            primaryKeyword: seed.primaryKeyword,
            authoritativeSourceBasis: sources.map((s) => ({
                id: s.id,
                organization: s.organization,
                tier: s.authorityTier,
                url: s.homepage || s.feedUrl,
            })),
            evergreenOrCurrent: seed.classification,
            relatedCinovaContent: relatedCinova(seed.workingTitle, seed.primaryKeyword),
            potentialCtas: seed.ctaHints,
            duplicateContentResult: dup,
            searchVolume: null,
            searchVolumeNote: "Search volume not invented — keyword is editorial intent only.",
            publishStatus: "PLAN_ONLY",
        });
    }

    return {
        schemaVersion: "phase4-blog-calendar",
        startDateIso,
        days,
        targetPostsPerWeek: postsPerWeek,
        articleCount: articles.length,
        categories: BLOG_ENGINE_CATEGORIES,
        articles,
        safety: [
            "Plan is report-only — not published.",
            "No invented search volume.",
            "Factual support still required at draft time.",
            "Commercial CTAs must follow commercialBoundary rules.",
        ],
    };
}

/**
 * Score live BLOG-routed clusters for Blog Engine 2.0 selection.
 */
export function scoreBlogEngineCandidates(clusters = [], { registry = SOURCE_REGISTRY } = {}) {
    return (clusters || [])
        .filter((c) => c.route?.route === "BLOG")
        .map((cluster) => {
            const qual = qualifyBlogCluster(cluster, { registry });
            const dup = duplicateCheck(cluster.canonicalTopic || "");
            return {
                title: cluster.canonicalTopic,
                qualified: qual.qualified && dup.status === "NEW",
                qualification: qual,
                duplicateContentResult: dup,
                freshnessRequired: false,
                classification: "evergreen",
            };
        });
}
