/**
 * SEO automation helpers for editorial drafts (Phase 10A).
 * Audits length, duplicates, cannibalization signals — does not keyword-stuff.
 */

import { getPublishedBlogPosts, blogPosts } from "../../src/data/blogPosts.js";
import { newsPosts } from "../../src/data/newsPosts.js";
import { normalizeHeadline, tokenize, jaccard } from "./editorial-dedupe.mjs";

function len(value) {
    return String(value || "").trim().length;
}

function suggestNewsSeo(draft = {}) {
    const title = String(draft.title || "").trim();
    const dek = String(draft.dek || draft.summary || "").trim();
    let seoTitle = String(draft.seoTitle || "").trim();
    let seoDescription = String(draft.seoDescription || "").trim();

    if (!seoTitle && title) {
        seoTitle = title.length <= 60 ? `${title} | Cin Nova News` : `${title.slice(0, 57).trim()}…`;
        if (seoTitle.length > 70) seoTitle = `${title.slice(0, 55).trim()} | CinNova`;
    }
    if (!seoDescription && dek) {
        seoDescription = dek.length <= 155 ? dek : `${dek.slice(0, 152).trim()}…`;
    }

    return {
        seoTitle,
        seoDescription,
        canonicalTarget: draft.slug ? `https://getcinnova.com/news/${draft.slug}` : "",
    };
}

function suggestBlogSeo(draft = {}) {
    const title = String(draft.title || "").trim();
    const excerpt = String(draft.excerpt || "").trim();
    let seoTitle = String(draft.seoTitle || "").trim();
    let seoDescription = String(draft.seoDescription || "").trim();

    if (!seoTitle && title) {
        seoTitle = title.length <= 60 ? title : `${title.slice(0, 57).trim()}…`;
    }
    if (!seoDescription && excerpt) {
        seoDescription = excerpt.length <= 155 ? excerpt : `${excerpt.slice(0, 152).trim()}…`;
    }

    return {
        seoTitle,
        seoDescription,
        canonicalTarget: draft.slug ? `https://getcinnova.com/blog/${draft.slug}` : "",
    };
}

/**
 * Apply SEO suggestions onto a draft (mutates clone).
 */
export function enrichDraftSeo(draft, kind = "news") {
    const next = { ...draft };
    if (kind === "news") {
        const seo = suggestNewsSeo(next);
        if (!next.seoTitle) next.seoTitle = seo.seoTitle;
        if (!next.seoDescription) next.seoDescription = seo.seoDescription;
        next.canonicalTarget = seo.canonicalTarget;
    } else {
        const seo = suggestBlogSeo(next);
        if (!next.seoTitle) next.seoTitle = seo.seoTitle;
        if (!next.seoDescription) next.seoDescription = seo.seoDescription;
        next.canonicalTarget = seo.canonicalTarget;
    }
    return next;
}

export function auditDraftSeo(draft = {}, kind = "news") {
    const issues = [];
    const warnings = [];
    const seoTitle = draft.seoTitle || "";
    const seoDescription = draft.seoDescription || draft.metaDescription || "";
    const titleLen = len(seoTitle);
    const descLen = len(seoDescription);

    if (!seoTitle) issues.push("Missing seoTitle");
    else if (titleLen > 70) warnings.push(`seoTitle is ${titleLen} chars (recommended ≤ 70)`);
    else if (titleLen < 30) warnings.push(`seoTitle is ${titleLen} chars (recommended ≥ 30)`);

    if (!seoDescription) issues.push("Missing seoDescription");
    else if (descLen > 160) warnings.push(`seoDescription is ${descLen} chars (recommended ≤ 160)`);
    else if (descLen < 110) warnings.push(`seoDescription is ${descLen} chars (recommended ≥ 110)`);

    if (kind === "news") {
        const dupTitle = newsPosts.find(
            (story) => story.slug !== draft.slug && normalizeHeadline(story.seoTitle || story.title) === normalizeHeadline(seoTitle || draft.title),
        );
        if (dupTitle) issues.push(`Duplicate SEO/title signal vs published news \`${dupTitle.slug}\``);
    } else {
        const published = getPublishedBlogPosts();
        const dupTitle = published.find(
            (post) => post.slug !== draft.slug && normalizeHeadline(post.seoTitle || post.title) === normalizeHeadline(seoTitle || draft.title),
        );
        if (dupTitle) issues.push(`Duplicate SEO/title signal vs published blog \`${dupTitle.slug}\``);

        const tokens = tokenize(`${draft.title || ""} ${draft.researchBrief?.primaryKeyword || ""}`);
        for (const post of published) {
            if (post.slug === draft.slug) continue;
            if (post.category !== draft.category) continue;
            const sim = jaccard(tokens, tokenize(`${post.title || ""} ${(post.seoKeywords || []).join(" ")}`));
            if (sim >= 0.55) {
                warnings.push(`Possible keyword cannibalization vs \`${post.slug}\` (similarity ${sim.toFixed(2)})`);
            }
        }
    }

    if (/\b(best best|ai ai|click here|keyword)\b/i.test(`${seoTitle} ${seoDescription}`)) {
        warnings.push("Possible keyword stuffing / low-quality SEO phrasing");
    }

    return {
        ok: issues.length === 0,
        issues,
        warnings,
        titleLen,
        descLen,
        canonicalTarget:
            draft.canonicalTarget ||
            (kind === "news"
                ? draft.slug
                    ? `https://getcinnova.com/news/${draft.slug}`
                    : ""
                : draft.slug
                  ? `https://getcinnova.com/blog/${draft.slug}`
                  : ""),
    };
}

/**
 * Lightweight content-gap hints for blog topic selection (no invented events).
 */
export function suggestBlogTopicGaps({ limit = 8 } = {}) {
    const published = getPublishedBlogPosts();
    const byCategory = new Map();
    for (const post of published) {
        byCategory.set(post.category, (byCategory.get(post.category) || 0) + 1);
    }

    const recentNews = [...newsPosts]
        .filter((story) => story.isPublished && !story.isDemo)
        .sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)))
        .slice(0, 12);

    const gaps = [];
    for (const story of recentNews) {
        const tokens = tokenize(story.title);
        const covered = published.some((post) => jaccard(tokens, tokenize(post.title)) >= 0.35);
        if (!covered) {
            gaps.push({
                type: "news-cluster",
                reason: `Recent news \`${story.slug}\` lacks a close evergreen Blog explainer`,
                seedTitle: "",
                relatedNewsId: story.id,
                relatedNewsSlug: story.slug,
                categoryHint: mapNewsCategoryToBlog(story.category),
            });
        }
    }

    const thinCategories = [...byCategory.entries()]
        .sort((a, b) => a[1] - b[1])
        .slice(0, 3)
        .map(([category, count]) => ({
            type: "category-gap",
            reason: `Category “${category}” has only ${count} published articles`,
            seedTitle: "",
            categoryHint: category,
        }));

    return [...gaps, ...thinCategories].slice(0, limit);
}

function mapNewsCategoryToBlog(category = "") {
    const value = String(category).toLowerCase();
    if (value.includes("education")) return "Education Technology";
    if (value.includes("real estate") || value.includes("housing")) return "Real Estate Technology";
    if (value.includes("robot")) return "Robotics & Automation";
    if (value.includes("data center") || value.includes("energy") || value.includes("grid")) {
        return "Data Centers & Databases";
    }
    if (value.includes("cyber") || value.includes("security")) return "Future Technology";
    return "Artificial Intelligence";
}

export function listPublishedBlogSlugs() {
    return getPublishedBlogPosts().map((post) => post.slug);
}

export function listAllBlogSlugs() {
    return blogPosts.map((post) => post.slug);
}
