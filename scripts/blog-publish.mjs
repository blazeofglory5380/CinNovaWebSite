#!/usr/bin/env node
/**
 * Promote a CinNova Blog draft into the public catalog (blogPosts.js).
 *
 * Does NOT commit, push, or deploy.
 *
 * Usage:
 *   npm run blog:publish -- <slug>
 *   npm run blog:publish -- <slug> --dry-run
 */

import {
    deleteBlogDraft,
    draftFilePath,
    formatIssues,
    loadBlogDraftBySlug,
    normalizeBlogForPublish,
    promoteDraftIntoBlogPosts,
    validateBlogPost,
} from "./lib/blog-editorial.mjs";
import { blogPosts, getPublishedBlogPosts } from "../src/data/blogPosts.js";
import { getPublicNewsStories } from "../src/data/newsPosts.js";

const args = process.argv.slice(2).filter((arg) => arg !== "--");
const dryRun = args.includes("--dry-run") || args.includes("--dryRun");
const slug = args.find((arg) => !arg.startsWith("-"));

if (!slug) {
    console.log(`Usage:
  npm run blog:publish -- <slug>
  npm run blog:publish -- <slug> --dry-run

Promotes src/data/blog-drafts/<slug>.json into src/data/blogPosts.js after
strict validation. Does not git commit, push, or deploy.

--dry-run validates and reports the promote plan without writing files.
`);
    process.exit(1);
}

const draft = loadBlogDraftBySlug(slug);
if (!draft) {
    console.error(`No draft found at ${draftFilePath(slug)}`);
    process.exit(1);
}

const post = normalizeBlogForPublish(draft);
const published = getPublishedBlogPosts();
const publicNews = getPublicNewsStories();
const knownIds = new Set(blogPosts.map((entry) => entry.id));
const knownSlugs = new Set(blogPosts.map((entry) => entry.slug));
const publishedSlugs = new Set(published.map((entry) => entry.slug));
const newsIds = new Set(publicNews.map((story) => story.id));
const newsSlugs = new Set(publicNews.map((story) => story.slug));

const issues = validateBlogPost(post, {
    mode: "publish",
    knownIds,
    knownSlugs,
    publishedSlugs,
    newsIds,
    newsSlugs,
});

for (const line of formatIssues(issues)) console.log(line);

const errors = issues.filter((issue) => issue.severity === "error");
if (errors.length) {
    console.error(`\nRefusing to publish "${slug}" — ${errors.length} error(s).`);
    process.exit(1);
}

if (dryRun) {
    console.log(`\nDry-run OK for "${slug}".`);
    console.log(`Would promote into src/data/blogPosts.js as id=${post.id}`);
    console.log(`Would delete draft file ${draftFilePath(slug)}`);
    console.log("No files were written.");
    process.exit(0);
}

try {
    const clean = { ...post };
    delete clean.__draftFile;
    delete clean.isDraft;
    delete clean.editorialNotes;
    delete clean.researchBrief;
    delete clean.heroImageBrief;
    promoteDraftIntoBlogPosts(clean);
    deleteBlogDraft(slug);
} catch (error) {
    console.error(`Publish failed: ${error.message}`);
    process.exit(1);
}

console.log(`\nPublished "${slug}" into src/data/blogPosts.js`);
console.log(`Removed draft file ${draftFilePath(slug)}`);
console.log("Next steps (manual):");
console.log("  1. Review the diff in blogPosts.js");
console.log("  2. npm run validate:blog && npm run build && npm run lint");
console.log("  3. Commit and open a PR — do not force-push or manual-deploy");
