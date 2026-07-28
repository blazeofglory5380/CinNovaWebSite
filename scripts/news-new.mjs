#!/usr/bin/env node
/**
 * Create a new CinNova News draft skeleton (no invented reporting).
 *
 * Usage:
 *   npm run news:new -- --slug=my-story-slug --coverage=local
 *   npm run news:new -- --slug=my-story-slug --coverage=state --title="Working title"
 */

import {
    NEWS_COVERAGE_KEYS,
    buildDraftSkeleton,
    draftFilePath,
    ensureDraftsDir,
    ensureNewsImageDirs,
    loadNewsDraftBySlug,
    writeNewsDraft,
} from "./lib/news-editorial.mjs";
import { newsPosts } from "../src/data/newsPosts.js";

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
const coverage = readArg("--coverage") || "local";
const title = readArg("--title") || "";
const category = readArg("--category") || "";
const location = readArg("--location") || "";
const author = readArg("--author") || "Cin Nova News Desk";

if (!slug || readFlag("--help") || readFlag("-h")) {
    console.log(`Usage:
  npm run news:new -- --slug=<kebab-slug> --coverage=<${NEWS_COVERAGE_KEYS.join("|")}>

Optional:
  --title="Working title"
  --category="Government"
  --location="City, State"
  --author="Cin Nova News Desk"
`);
    process.exit(slug ? 0 : 1);
}

if (newsPosts.some((story) => story.slug === slug)) {
    console.error(`Slug "${slug}" already exists in the public newsPosts catalog.`);
    process.exit(1);
}

ensureDraftsDir();
ensureNewsImageDirs();

if (loadNewsDraftBySlug(slug)) {
    console.error(`Draft already exists: ${draftFilePath(slug)}`);
    process.exit(1);
}

const skeleton = buildDraftSkeleton({
    slug,
    coverageLevel: coverage,
    title,
    category,
    location,
    author,
});

const filePath = writeNewsDraft(skeleton);
const previewPath = `/?page=news-preview&slug=${encodeURIComponent(slug)}`;

console.log(`Created draft: ${filePath}`);
console.log(`Preferred hero path: public${skeleton.heroImage}`);
console.log(`Local preview (Vite DEV): http://localhost:5173${previewPath}`);
console.log("Next: fill sourced reporting, then npm run validate:news");
console.log(`Publish later with: npm run news:publish -- ${slug}`);
