#!/usr/bin/env node
/**
 * Validate CinNova Blog public catalog + local drafts.
 *
 * Usage:
 *   npm run validate:blog
 *   npm run validate:blog -- --publish <slug>   # strict checks for one draft
 */

import {
    collectBlogCatalogIssues,
    formatIssues,
    loadBlogDraftBySlug,
    normalizeBlogForPublish,
    validateBlogPost,
} from "./lib/blog-editorial.mjs";
import { blogPosts, getPublishedBlogPosts } from "../src/data/blogPosts.js";
import { getPublicNewsStories } from "../src/data/newsPosts.js";

const args = process.argv.slice(2);
function readArg(flag) {
    const eq = args.find((arg) => arg.startsWith(`${flag}=`));
    if (eq) return eq.slice(flag.length + 1) || null;
    const index = args.indexOf(flag);
    if (index === -1) return null;
    return args[index + 1] || null;
}

const publishSlug = readArg("--publish");

if (publishSlug) {
    const draft = loadBlogDraftBySlug(publishSlug);
    if (!draft) {
        console.error(`No draft found for slug "${publishSlug}" in src/data/blog-drafts/`);
        process.exit(1);
    }
    const post = normalizeBlogForPublish(draft);
    const published = getPublishedBlogPosts();
    const publicNews = getPublicNewsStories();
    const issues = validateBlogPost(post, {
        mode: "publish",
        knownIds: new Set(blogPosts.map((entry) => entry.id)),
        knownSlugs: new Set(blogPosts.map((entry) => entry.slug)),
        publishedSlugs: new Set(published.map((entry) => entry.slug)),
        newsIds: new Set(publicNews.map((story) => story.id)),
        newsSlugs: new Set(publicNews.map((story) => story.slug)),
    });
    const errors = issues.filter((issue) => issue.severity === "error");
    const warnings = issues.filter((issue) => issue.severity === "warning");
    for (const line of formatIssues(issues)) console.log(line);
    if (errors.length) {
        console.error(`\nvalidate:blog --publish failed with ${errors.length} error(s).`);
        process.exit(1);
    }
    console.log(`\nDraft "${publishSlug}" is publish-ready (${warnings.length} warning(s)).`);
    process.exit(0);
}

const { issues, catalogCount, publishedCount, plannedCount, draftCount } =
    collectBlogCatalogIssues();
const errors = issues.filter((issue) => issue.severity === "error");
const warnings = issues.filter((issue) => issue.severity === "warning");

for (const line of formatIssues(issues)) {
    console.log(line);
}

console.log(
    `\nBlog validation: ${publishedCount} published / ${plannedCount} planned / ${catalogCount} total catalog, ${draftCount} draft(s), ${errors.length} error(s), ${warnings.length} warning(s).`,
);

if (errors.length) {
    console.error("validate:blog failed.");
    process.exit(1);
}

console.log("validate:blog passed.");
