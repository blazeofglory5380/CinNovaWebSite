#!/usr/bin/env node
/**
 * Phase 10A — fact-check existing news/blog drafts (deterministic gate).
 *
 * Usage:
 *   npm run editorial:factcheck
 *   npm run editorial:factcheck -- --date=2026-07-29
 *   npm run editorial:factcheck -- --slug=some-story-slug
 */

import { writeFileSync } from "node:fs";
import path from "node:path";
import { resolveDateIso, readArg } from "./lib/editorial-cli.mjs";
import { loadNewsDrafts, loadNewsDraftBySlug } from "./lib/news-editorial.mjs";
import { loadBlogDrafts, loadBlogDraftBySlug, ensureReportsDir, EDITORIAL_REPORTS_DIR } from "./lib/blog-editorial.mjs";
import { classifyNewsCandidate } from "./lib/editorial-dedupe.mjs";
import { scoreNewsFactCheck, scoreBlogFactCheck } from "./lib/editorial-factcheck.mjs";

const dateIso = resolveDateIso();
const slugFilter = readArg("--slug");

const newsDrafts = slugFilter
    ? [loadNewsDraftBySlug(slugFilter)].filter(Boolean)
    : loadNewsDrafts();
const blogDrafts = slugFilter
    ? [loadBlogDraftBySlug(slugFilter)].filter(Boolean)
    : loadBlogDrafts();

const rows = [];

for (const draft of newsDrafts) {
    const duplicate = classifyNewsCandidate(draft, { excludeSlug: draft.slug });
    const fact = scoreNewsFactCheck(draft, { duplicateClassification: duplicate.classification });
    rows.push({
        kind: "news",
        slug: draft.slug,
        coverage: draft.coverageLevel,
        duplicate: duplicate.classification,
        ...fact,
    });
}

for (const draft of blogDrafts) {
    const fact = scoreBlogFactCheck(draft);
    rows.push({
        kind: "blog",
        slug: draft.slug,
        duplicate: "n/a",
        ...fact,
    });
}

ensureReportsDir();
const reportPath = path.join(EDITORIAL_REPORTS_DIR, `${dateIso}-factcheck.md`);
const md = [
    `# CinNova fact-check — ${dateIso}`,
    "",
    "Deterministic readiness gate. HOLD/REJECT must never publish.",
    "",
    "| Kind | Slug | Status | Score | Publish candidate | Notes |",
    "|---|---|---|---|---|---|",
    ...rows.map((row) => {
        const notes = (row.reasons || []).join("; ").replace(/\|/g, "/");
        return `| ${row.kind} | \`${row.slug}\` | **${row.status}** | ${row.score} | ${row.publishCandidate && !row.blockedFromPublish ? "yes" : "no"} | ${notes || "—"} |`;
    }),
    "",
    rows.length ? "" : "_No drafts found._",
    "",
].join("\n");

writeFileSync(reportPath, md, "utf8");

console.log(`\nFact-check complete for ${dateIso}`);
for (const row of rows) {
    console.log(
        `  - ${row.kind} ${row.slug}: ${row.status} (score ${row.score})${row.blockedFromPublish ? " [blocked]" : ""}`,
    );
}
console.log(`Report: ${reportPath}`);
console.log("No publish / commit performed.");
process.exit(0);
