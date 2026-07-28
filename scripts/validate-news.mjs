#!/usr/bin/env node
/**
 * Validate CinNova News public catalog + local drafts.
 *
 * Usage:
 *   npm run validate:news
 *   npm run validate:news -- --publish <slug>   # strict checks for one draft
 */

import {
    collectCatalogIssues,
    formatIssues,
    loadNewsDraftBySlug,
    normalizeStoryForPublish,
    validateNewsStory,
} from "./lib/news-editorial.mjs";
import { newsPosts as catalog } from "../src/data/newsPosts.js";
import { getPublishedBlogPosts } from "../src/data/blogPosts.js";

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
    const draft = loadNewsDraftBySlug(publishSlug);
    if (!draft) {
        console.error(`No draft found for slug "${publishSlug}" in src/data/news-drafts/`);
        process.exit(1);
    }
    const story = normalizeStoryForPublish(draft);
    const blogSlugs = new Set(getPublishedBlogPosts().map((post) => post.slug));
    const newsById = new Map(catalog.map((entry) => [entry.id, entry]));
    const knownIds = new Set(catalog.map((entry) => entry.id));
    const knownSlugs = new Set(catalog.map((entry) => entry.slug));
    const issues = validateNewsStory(story, {
        mode: "publish",
        knownIds,
        knownSlugs,
        blogSlugs,
        newsById,
    });
    const errors = issues.filter((issue) => issue.severity === "error");
    const warnings = issues.filter((issue) => issue.severity === "warning");
    for (const line of formatIssues(issues)) console.log(line);
    if (errors.length) {
        console.error(`\nvalidate:news --publish failed with ${errors.length} error(s).`);
        process.exit(1);
    }
    console.log(`\nDraft "${publishSlug}" is publish-ready (${warnings.length} warning(s)).`);
    process.exit(0);
}

const { issues, catalogCount, draftCount } = collectCatalogIssues();
const errors = issues.filter((issue) => issue.severity === "error");
const warnings = issues.filter((issue) => issue.severity === "warning");

for (const line of formatIssues(issues)) {
    console.log(line);
}

console.log(
    `\nNews validation: ${catalogCount} catalog stories, ${draftCount} draft(s), ${errors.length} error(s), ${warnings.length} warning(s).`,
);

if (errors.length) {
    console.error("validate:news failed.");
    process.exit(1);
}

console.log("validate:news passed.");
