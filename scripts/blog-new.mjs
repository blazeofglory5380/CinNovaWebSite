#!/usr/bin/env node
/**
 * Create a new CinNova Blog draft skeleton (no invented reporting).
 *
 * Usage:
 *   npm run blog:new -- --slug=my-post-slug --category="Artificial Intelligence"
 *   npm run blog:new -- --slug=my-post-slug --title="Working title"
 */

import {
    BLOG_CATEGORIES,
    buildBlogDraftSkeleton,
    draftFilePath,
    ensureDraftsDir,
    loadBlogDraftBySlug,
    writeBlogDraft,
} from "./lib/blog-editorial.mjs";
import { blogPosts } from "../src/data/blogPosts.js";

function readArg(flag) {
    const argv = process.argv.slice(2);
    const eq = argv.find((arg) => arg.startsWith(`${flag}=`));
    if (eq) return eq.slice(flag.length + 1) || null;
    const index = argv.indexOf(flag);
    if (index === -1) return null;
    return argv[index + 1] || null;
}

function readFlag(flag) {
    return process.argv.slice(2).includes(flag);
}

const slug = readArg("--slug");
const category = readArg("--category") || "Artificial Intelligence";
const title = readArg("--title") || "";
const author = readArg("--author") || "CinNova Editorial Team";

if (!slug || readFlag("--help") || readFlag("-h")) {
    console.log(`Usage:
  npm run blog:new -- --slug=<kebab-slug> --category="<category>"

Categories:
  ${BLOG_CATEGORIES.join("\n  ")}

Optional:
  --title="Working title"
  --author="CinNova Editorial Team"
`);
    process.exit(slug ? 0 : 1);
}

if (blogPosts.some((post) => post.slug === slug)) {
    console.error(`Slug "${slug}" already exists in the public blogPosts catalog.`);
    process.exit(1);
}

ensureDraftsDir();

if (loadBlogDraftBySlug(slug)) {
    console.error(`Draft already exists: ${draftFilePath(slug)}`);
    process.exit(1);
}

const skeleton = buildBlogDraftSkeleton({ slug, category, title, author });
const filePath = writeBlogDraft(skeleton);
const previewPath = `/?page=blog-preview&slug=${encodeURIComponent(slug)}`;

console.log(`Created draft: ${filePath}`);
console.log(`Preferred hero path: public${skeleton.heroImage}`);
console.log(`Local preview (Vite DEV): http://localhost:5173${previewPath}`);
console.log("Next: fill sourced content + SEO fields, then npm run validate:blog");
console.log(`Publish later with: npm run blog:publish -- ${slug}`);
