#!/usr/bin/env node
/**
 * Promote a CinNova News draft into the public catalog (newsPosts.js).
 *
 * Does NOT commit, push, or deploy.
 *
 * Usage:
 *   npm run news:publish -- <slug>
 *   npm run news:publish -- <slug> --dry-run
 */

import {
    deleteNewsDraft,
    draftFilePath,
    formatIssues,
    loadNewsDraftBySlug,
    normalizeStoryForPublish,
    promoteDraftIntoNewsPosts,
    validateNewsStory,
} from "./lib/news-editorial.mjs";
import { newsPosts } from "../src/data/newsPosts.js";
import { getPublishedBlogPosts } from "../src/data/blogPosts.js";

const args = process.argv.slice(2).filter((arg) => arg !== "--");
const dryRun = args.includes("--dry-run") || args.includes("--dryRun");
const slug = args.find((arg) => !arg.startsWith("-"));

if (!slug) {
    console.log(`Usage:
  npm run news:publish -- <slug>
  npm run news:publish -- <slug> --dry-run

Promotes src/data/news-drafts/<slug>.json into src/data/newsPosts.js after
strict validation. Does not git commit, push, or deploy.

--dry-run validates and reports the promote plan without writing files.
`);
    process.exit(1);
}

const draft = loadNewsDraftBySlug(slug);
if (!draft) {
    console.error(`No draft found at ${draftFilePath(slug)}`);
    process.exit(1);
}

const story = normalizeStoryForPublish(draft);
const blogSlugs = new Set(getPublishedBlogPosts().map((post) => post.slug));
const newsById = new Map(newsPosts.map((entry) => [entry.id, entry]));
const knownIds = new Set(newsPosts.map((entry) => entry.id));
const knownSlugs = new Set(newsPosts.map((entry) => entry.slug));

const issues = validateNewsStory(story, {
    mode: "publish",
    knownIds,
    knownSlugs,
    blogSlugs,
    newsById,
});

for (const line of formatIssues(issues)) console.log(line);

const errors = issues.filter((issue) => issue.severity === "error");
if (errors.length) {
    console.error(`\nRefusing to publish "${slug}" — ${errors.length} error(s).`);
    process.exit(1);
}

if (dryRun) {
    console.log(`\nDry-run OK for "${slug}".`);
    console.log(`Would promote into src/data/newsPosts.js as id=${story.id}`);
    console.log(`Would delete draft file ${draftFilePath(slug)}`);
    console.log("No files were written.");
    process.exit(0);
}

try {
    promoteDraftIntoNewsPosts(story);
    deleteNewsDraft(slug);
} catch (error) {
    console.error(`Publish failed: ${error.message}`);
    process.exit(1);
}

console.log(`\nPublished "${slug}" into src/data/newsPosts.js`);
console.log(`Removed draft file ${draftFilePath(slug)}`);
console.log("Next steps (manual):");
console.log("  1. Review the diff in newsPosts.js");
console.log("  2. npm run validate:news && npm run build && npm run lint");
console.log("  3. Commit and open a PR — do not force-push or manual-deploy");
