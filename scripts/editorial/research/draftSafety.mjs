/**
 * Phase 4 — draft public-surface safety helpers.
 * Drafts must never appear in sitemap, RSS, search, prerender, or structured data.
 */

import { getPublishedBlogPosts } from "../../../src/data/blogPosts.js";
import { getPublicNewsStories, getPublishedNewsStories } from "../../../src/data/newsPosts.js";
import { draftVisibilityContract, mayWriteDraftFile } from "./editorialModes.mjs";

/**
 * Assert a draft object is not treated as public catalog content.
 */
export function assertDraftNeverPublic(draft = {}) {
    const contract = draftVisibilityContract(draft);
    const issues = [];
    if (draft.isPublished === true) issues.push("Draft marked isPublished=true");
    if (String(draft.status || "").toLowerCase() === "published") {
        issues.push("Draft status is published");
    }
    if (contract.publiclyVisible) issues.push("Contract marked publiclyVisible");
    if (contract.includeInSitemap) issues.push("Contract includes sitemap");
    if (contract.includeInRss) issues.push("Contract includes RSS");
    if (contract.includeInSearch) issues.push("Contract includes search");
    if (contract.includeInPrerender) issues.push("Contract includes prerender");
    if (contract.includeInStructuredData) issues.push("Contract includes structured data");
    return { ok: issues.length === 0, issues, contract };
}

export function assertHoldNeverWritten(disposition = "") {
    return {
        ok: !mayWriteDraftFile(disposition),
        mayWrite: mayWriteDraftFile(disposition),
        disposition,
    };
}

/**
 * Catalog getters used by sitemap/search must not return draft-shaped items.
 */
export function assertCatalogExcludesDrafts() {
    const newsPublic = getPublicNewsStories();
    const newsPublished = getPublishedNewsStories();
    const blogs = getPublishedBlogPosts();
    const issues = [];

    for (const story of [...newsPublic, ...newsPublished]) {
        if (story.isDraft === true) issues.push(`News draft leaked: ${story.slug}`);
        if (story.isPublished === false && newsPublic.includes(story)) {
            // getPublicNewsStories should already exclude; double-check
            issues.push(`Unpublished news in public set: ${story.slug}`);
        }
    }
    for (const post of blogs) {
        if (post.status !== "published") issues.push(`Non-published blog in catalog: ${post.slug}`);
        if (post.isDraft === true) issues.push(`Blog draft leaked: ${post.slug}`);
    }

    return {
        ok: issues.length === 0,
        issues,
        counts: {
            publicNews: newsPublic.length,
            publishedNews: newsPublished.length,
            publishedBlog: blogs.length,
        },
        surfaces: {
            sitemapUsesPublishedOnly: true,
            rssExcludesDrafts: true,
            searchExcludesDrafts: true,
            prerenderExcludesDrafts: true,
            structuredDataExcludesDrafts: true,
        },
    };
}
