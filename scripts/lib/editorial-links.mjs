/**
 * Internal link suggestion helpers (Phase 10A).
 * Favor contextual relevance over quantity. Never invent broken slugs.
 */

import { getPublishedBlogPosts } from "../../src/data/blogPosts.js";
import { getPublicNewsStories } from "../../src/data/newsPosts.js";
import { tokenize, jaccard } from "./editorial-dedupe.mjs";

const PRODUCT_CTAS = [
    { slug: "studynest", path: "/studynest", label: "StudyNest", keywords: ["student", "study", "education", "learning", "tutor"] },
    { slug: "poisonguard", path: "/poisonguard", label: "PoisonGuard", keywords: ["safety", "poison", "family", "household", "pet"] },
    { slug: "techmate", path: "/techmate", label: "TechMate AI", keywords: ["support", "device", "repair", "technician", "troubleshoot"] },
    { slug: "kiddo", path: "/kiddo", label: "Kiddo", keywords: ["kids", "child", "early learning", "parent"] },
    { slug: "real-estate", path: "/real-estate", label: "CinNova Real Estate AI", keywords: ["real estate", "property", "rental", "investor", "housing"] },
];

function scoreAgainstText(text, keywords) {
    const hay = String(text).toLowerCase();
    return keywords.reduce((sum, key) => (hay.includes(key) ? sum + 1 : sum), 0);
}

export function suggestNewsInternalLinks(draft = {}, { newsLimit = 3, blogLimit = 3 } = {}) {
    const text = `${draft.title || ""} ${draft.dek || ""} ${draft.summary || ""} ${draft.whyItMatters || ""}`;
    const tokens = tokenize(text);
    const news = getPublicNewsStories()
        .filter((story) => story.slug !== draft.slug)
        .map((story) => ({
            id: story.id,
            slug: story.slug,
            score: jaccard(tokens, tokenize(`${story.title} ${story.dek || ""} ${story.category || ""}`)),
        }))
        .filter((row) => row.score >= 0.18)
        .sort((a, b) => b.score - a.score)
        .slice(0, newsLimit);

    const blogs = getPublishedBlogPosts()
        .map((post) => ({
            slug: post.slug,
            score: jaccard(tokens, tokenize(`${post.title} ${post.excerpt || ""} ${(post.tags || []).join(" ")}`)),
        }))
        .filter((row) => row.score >= 0.16)
        .sort((a, b) => b.score - a.score)
        .slice(0, blogLimit);

    return {
        relatedNewsIds: news.map((row) => row.id),
        relatedBlogSlugs: blogs.map((row) => row.slug),
        details: { news, blogs },
    };
}

export function suggestBlogInternalLinks(draft = {}, { blogLimit = 5, newsLimit = 3 } = {}) {
    const text = `${draft.title || ""} ${draft.excerpt || ""} ${(draft.tags || []).join(" ")} ${draft.researchBrief?.primaryKeyword || ""}`;
    const tokens = tokenize(text);

    const relatedReading = getPublishedBlogPosts()
        .filter((post) => post.slug !== draft.slug)
        .map((post) => ({
            slug: post.slug,
            score: jaccard(tokens, tokenize(`${post.title} ${post.excerpt || ""} ${(post.tags || []).join(" ")}`)),
        }))
        .filter((row) => row.score >= 0.16)
        .sort((a, b) => b.score - a.score)
        .slice(0, blogLimit);

    const relatedNews = getPublicNewsStories()
        .map((story) => ({
            id: story.id,
            slug: story.slug,
            score: jaccard(tokens, tokenize(`${story.title} ${story.dek || ""}`)),
        }))
        .filter((row) => row.score >= 0.16)
        .sort((a, b) => b.score - a.score)
        .slice(0, newsLimit);

    const products = PRODUCT_CTAS
        .map((product) => ({
            ...product,
            score: scoreAgainstText(text, product.keywords),
        }))
        .filter((product) => product.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 2);

    return {
        relatedReading: relatedReading.map((row) => row.slug),
        relatedNewsIds: relatedNews.map((row) => row.id),
        productCtas: products,
        details: { relatedReading, relatedNews, products },
    };
}

/**
 * Wire suggestions onto draft when fields are empty.
 */
export function applyInternalLinks(draft, kind = "news") {
    const next = { ...draft };
    if (kind === "news") {
        const links = suggestNewsInternalLinks(next);
        if (!Array.isArray(next.relatedNewsIds) || next.relatedNewsIds.length === 0) {
            next.relatedNewsIds = links.relatedNewsIds;
        }
        if (!Array.isArray(next.relatedBlogSlugs) || next.relatedBlogSlugs.length === 0) {
            next.relatedBlogSlugs = links.relatedBlogSlugs;
        }
        next.__linkSuggestions = links.details;
        return next;
    }

    const links = suggestBlogInternalLinks(next);
    if (!Array.isArray(next.relatedReading) || next.relatedReading.length === 0) {
        next.relatedReading = links.relatedReading;
    }
    if (!Array.isArray(next.relatedNewsIds) || next.relatedNewsIds.length === 0) {
        next.relatedNewsIds = links.relatedNewsIds;
    }
    next.__productCtas = links.productCtas;
    next.__linkSuggestions = links.details;
    return next;
}
