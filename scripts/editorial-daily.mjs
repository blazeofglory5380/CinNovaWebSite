#!/usr/bin/env node
/**
 * Daily editorial preparation orchestrator.
 *
 * Prepares (does NOT publish / commit / push / deploy):
 *   - 1 Local + 1 State + 1 National + 1 International News draft skeletons
 *   - 1 SEO-driven Blog draft skeleton
 *   - validation summaries
 *   - a daily editorial report under editorial-reports/
 *
 * Safe for Windows Task Scheduler or GitHub Actions as a preparation step only.
 *
 * Usage:
 *   npm run editorial:daily
 *   npm run editorial:daily -- --date=2026-07-28
 *   npm run editorial:daily -- --skip-existing
 *   npm run editorial:daily -- --dry-run
 *
 * Optional research packet (does not invent facts; only applies provided fields):
 *   npm run editorial:daily -- --from-packet=path/to/research-packet.json
 */

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
    EDITORIAL_REPORTS_DIR,
    ensureReportsDir,
    loadBlogDraftBySlug,
    writeBlogDraft,
    buildBlogDraftSkeleton,
    draftFilePath as blogDraftPath,
    ROOT,
} from "./lib/blog-editorial.mjs";
import {
    buildDraftSkeleton as buildNewsSkeleton,
    draftFilePath as newsDraftPath,
    loadNewsDraftBySlug,
    writeNewsDraft,
    NEWS_COVERAGE_KEYS,
} from "./lib/news-editorial.mjs";
import { newsPosts } from "../src/data/newsPosts.js";
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

function runNpm(script) {
    const result = spawnSync("npm", ["run", script], {
        cwd: ROOT,
        encoding: "utf8",
        shell: true,
    });
    return {
        code: result.status ?? 1,
        stdout: result.stdout || "",
        stderr: result.stderr || "",
    };
}

function slugDateStamp(dateIso) {
    return dateIso.replace(/-/g, "");
}

function defaultNewsSlug(coverage, dateIso) {
    return `daily-${coverage}-${slugDateStamp(dateIso)}`;
}

function defaultBlogSlug(dateIso) {
    return `daily-blog-${slugDateStamp(dateIso)}`;
}

const dateIso = readArg("--date") || new Date().toISOString().slice(0, 10);
const dryRun = readFlag("--dry-run") || readFlag("--dryRun");
const skipExisting = readFlag("--skip-existing") || readFlag("--skipExisting");
const packetPath = readArg("--from-packet");

let packet = null;
if (packetPath) {
    const absolute = path.isAbsolute(packetPath) ? packetPath : path.join(ROOT, packetPath);
    if (!existsSync(absolute)) {
        console.error(`Research packet not found: ${absolute}`);
        process.exit(1);
    }
    packet = JSON.parse(readFileSync(absolute, "utf8"));
}

const created = [];
const skipped = [];
const notes = [];

notes.push(
    "This run prepares draft skeletons and validation reports only.",
    "It does NOT publish, commit, push, open PRs, or deploy.",
    "Do not invent sources or current events. Fill drafts from verified research.",
);

if (!packet) {
    notes.push(
        "No --from-packet provided. Skeletons include researchBrief placeholders for an AI research agent.",
        "Required agent inputs: verified titles, 2–4 source URLs with publishers, outlines, internal-link suggestions, hero briefs.",
    );
}

for (const coverage of NEWS_COVERAGE_KEYS) {
    const packetStory = packet?.news?.[coverage] || null;
    const slug = packetStory?.slug || defaultNewsSlug(coverage, dateIso);

    if (newsPosts.some((story) => story.slug === slug)) {
        skipped.push({ type: "news", coverage, slug, reason: "slug already published" });
        continue;
    }
    if (loadNewsDraftBySlug(slug)) {
        if (skipExisting) {
            skipped.push({ type: "news", coverage, slug, reason: "draft already exists" });
            continue;
        }
        skipped.push({ type: "news", coverage, slug, reason: "draft already exists (use --skip-existing to silence)" });
        continue;
    }

    const skeleton = buildNewsSkeleton({
        slug,
        coverageLevel: coverage,
        title: packetStory?.title || "",
        category: packetStory?.category || "",
        location: packetStory?.location || "",
        author: packetStory?.author || "Cin Nova News Desk",
    });

    if (packetStory) {
        Object.assign(skeleton, packetStory, {
            slug,
            coverageLevel: coverage,
            isDraft: true,
            isPublished: false,
            status: packetStory.status || skeleton.status,
        });
        notes.push(`Applied research packet fields to news/${coverage} (${slug}). Review before publish.`);
    } else {
        skeleton.editorialNotes = [
            ...(skeleton.editorialNotes || []),
            `Daily prep skeleton for ${dateIso} (${coverage}). Replace placeholders with sourced reporting only.`,
        ];
    }

    if (dryRun) {
        created.push({ type: "news", coverage, slug, path: newsDraftPath(slug), dryRun: true });
    } else {
        const filePath = writeNewsDraft(skeleton);
        created.push({ type: "news", coverage, slug, path: filePath });
    }
}

{
    const packetBlog = packet?.blog || null;
    const slug = packetBlog?.slug || defaultBlogSlug(dateIso);
    if (blogPosts.some((post) => post.slug === slug)) {
        skipped.push({ type: "blog", slug, reason: "slug already published" });
    } else if (loadBlogDraftBySlug(slug)) {
        skipped.push({
            type: "blog",
            slug,
            reason: skipExisting ? "draft already exists" : "draft already exists (use --skip-existing)",
        });
    } else {
        const skeleton = buildBlogDraftSkeleton({
            slug,
            category: packetBlog?.category || "Artificial Intelligence",
            title: packetBlog?.title || "",
            author: packetBlog?.author || "CinNova Editorial Team",
        });
        if (packetBlog) {
            Object.assign(skeleton, packetBlog, {
                slug,
                status: "draft",
            });
            notes.push(`Applied research packet fields to blog draft (${slug}). Review before publish.`);
        } else {
            skeleton.researchBrief.primaryKeyword = "";
            skeleton.editorialNotes.push(
                `Daily SEO blog prep skeleton for ${dateIso}. Fill from research agent packet before drafting body copy.`,
            );
        }
        if (dryRun) {
            created.push({ type: "blog", slug, path: blogDraftPath(slug), dryRun: true });
        } else {
            const filePath = writeBlogDraft(skeleton);
            created.push({ type: "blog", slug, path: filePath });
        }
    }
}

const newsValidation = runNpm("validate:news");
const blogValidation = runNpm("validate:blog");

ensureReportsDir();
const reportPath = path.join(EDITORIAL_REPORTS_DIR, `${dateIso}.md`);
const report = `# CinNova daily editorial report — ${dateIso}

## Safety
- Preparation only. No publish / commit / push / PR / deploy performed.
- Dry-run: ${dryRun ? "yes" : "no"}

## Drafts prepared
${created.length ? created.map((item) => `- **${item.type}** ${item.coverage ? `(${item.coverage}) ` : ""}\`${item.slug}\` → \`${item.path}\`${item.dryRun ? " (dry-run)" : ""}`).join("\n") : "- (none)"}

## Skipped
${skipped.length ? skipped.map((item) => `- **${item.type}** ${item.coverage ? `(${item.coverage}) ` : ""}\`${item.slug}\`: ${item.reason}`).join("\n") : "- (none)"}

## Notes
${notes.map((line) => `- ${line}`).join("\n")}

## Validation
### validate:news (exit ${newsValidation.code})
\`\`\`
${(newsValidation.stdout + newsValidation.stderr).trim().slice(-4000)}
\`\`\`

### validate:blog (exit ${blogValidation.code})
\`\`\`
${(blogValidation.stdout + blogValidation.stderr).trim().slice(-4000)}
\`\`\`

## Next (manual)
1. Complete research + sourced copy in each draft JSON.
2. Preview News: \`/?page=news-preview&slug=...\`
3. Preview Blog: \`/?page=blog-preview&slug=...\`
4. \`npm run validate:news\` / \`npm run validate:blog\`
5. Publish individually with \`news:publish\` / \`blog:publish\` (or \`--dry-run\`) when ready.
6. Open a focused PR — never auto-merge from this workflow.

## Research agent packet shape (optional \`--from-packet\`)
\`\`\`json
{
  "news": {
    "local": { "slug": "...", "title": "...", "sources": [] },
    "state": { "slug": "...", "title": "...", "sources": [] },
    "national": { "slug": "...", "title": "...", "sources": [] },
    "international": { "slug": "...", "title": "...", "sources": [] }
  },
  "blog": {
    "slug": "...",
    "title": "...",
    "category": "Artificial Intelligence",
    "seoTitle": "...",
    "seoDescription": "...",
    "relatedReading": [],
    "relatedNewsIds": [],
    "sources": []
  }
}
\`\`\`
`;

if (!dryRun) {
    writeFileSync(reportPath, report, "utf8");
}

console.log(`\nDaily editorial prep complete for ${dateIso}`);
console.log(`Created: ${created.length} | Skipped: ${skipped.length}`);
if (!dryRun) console.log(`Report: ${reportPath}`);
console.log(`validate:news exit=${newsValidation.code} | validate:blog exit=${blogValidation.code}`);
console.log("No publish / commit / push / deploy was performed.");

if (newsValidation.code !== 0 || blogValidation.code !== 0) {
    // Incomplete daily skeletons are expected to fail draft field checks.
    // The report still lands; exit 0 so schedulers treat prep as successful.
    console.log(
        "Validation reported issues (expected for empty skeletons). See report. Prep exit code remains 0.",
    );
}

process.exit(0);
