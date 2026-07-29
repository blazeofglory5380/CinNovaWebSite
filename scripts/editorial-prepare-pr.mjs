#!/usr/bin/env node
/**
 * Phase 10A — prepare a Draft PR for editorial automation output.
 *
 * Creates/updates branch + Draft PR. Never merges. Never deploys.
 * Does not modify unrelated worktree files.
 *
 * Usage:
 *   npm run editorial:prepare-pr
 *   npm run editorial:prepare-pr -- --date=2026-07-29
 *   npm run editorial:prepare-pr -- --dry-run
 */

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { ROOT, resolveDateIso, isDryRun, readFlag } from "./lib/editorial-cli.mjs";
import { EDITORIAL_REPORTS_DIR } from "./lib/blog-editorial.mjs";

const dateIso = resolveDateIso();
const dryRun = isDryRun();
const force = readFlag("--force");

const ALLOWED_PATH_PREFIXES = [
    "src/data/news-drafts/",
    "src/data/blog-drafts/",
    "src/data/social-drafts/",
    "editorial-reports/",
];

function run(cmd, args, opts = {}) {
    return spawnSync(cmd, args, {
        cwd: ROOT,
        encoding: "utf8",
        shell: true,
        ...opts,
    });
}

function listChangedFiles() {
    const status = run("git", ["status", "--porcelain"]);
    if (status.status !== 0) {
        throw new Error(status.stderr || "git status failed");
    }
    return String(status.stdout || "")
        .split("\n")
        .map((line) => line.trimEnd())
        .filter(Boolean)
        .map((line) => {
            // porcelain: XY PATH or XY ORIG -> PATH
            const raw = line.slice(3).trim();
            const renamed = raw.includes(" -> ") ? raw.split(" -> ").pop() : raw;
            return renamed.replace(/^"|"$/g, "");
        });
}

function isAllowed(filePath) {
    const normalized = filePath.replace(/\\/g, "/");
    return ALLOWED_PATH_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}

const changed = listChangedFiles();
const editorialFiles = changed.filter(isAllowed);
const otherFiles = changed.filter((file) => !isAllowed(file));

const reviewPath = path.join(EDITORIAL_REPORTS_DIR, `${dateIso}-review.md`);
const dailyPath = path.join(EDITORIAL_REPORTS_DIR, `${dateIso}.md`);
const readiness = existsSync(reviewPath)
    ? readFileSync(reviewPath, "utf8")
    : existsSync(dailyPath)
      ? readFileSync(dailyPath, "utf8").slice(0, 4000)
      : "No review/daily report found for this date.";

if (!editorialFiles.length && !force) {
    console.log(`No editorial automation files changed for ${dateIso}.`);
    console.log("Skipping PR (no junk PR). Use --force to open anyway.");
    if (otherFiles.length) {
        console.log(`Note: ${otherFiles.length} unrelated dirty files were left untouched.`);
    }
    process.exit(0);
}

const branch = `editorial/daily-${dateIso}`;
const title = `Editorial Daily — ${dateIso}`;
const body = `## Summary
- Automated editorial preparation for **${dateIso}**
- Drafts only — **no publish, no merge, no deploy**
- HOLD items must not be published

## Readiness
\`\`\`
${readiness.slice(0, 3500)}
\`\`\`

## Test plan
- [ ] Review READY/REVIEW drafts in DEV preview
- [ ] Confirm sources + fact-check dispositions
- [ ] Resolve IMAGE REQUIRED heroes
- [ ] Run \`npm run validate:news\` / \`validate:blog\`
- [ ] Human publishes selectively; do not merge HOLD content
`;

console.log(`\nPrepare PR for ${dateIso}`);
console.log(`Branch: ${branch}`);
console.log(`Editorial files (${editorialFiles.length}):`);
editorialFiles.forEach((file) => console.log(`  - ${file}`));
if (otherFiles.length) {
    console.log(`Unrelated dirty files left untouched (${otherFiles.length}).`);
}

if (dryRun) {
    console.log("\nDry-run: would create/update Draft PR with the files above.");
    console.log("No git mutations performed.");
    process.exit(0);
}

const checkout = run("git", ["checkout", "-B", branch]);
if (checkout.status !== 0) {
    console.error(checkout.stderr || checkout.stdout);
    process.exit(1);
}

if (editorialFiles.length) {
    const add = run("git", ["add", "--", ...editorialFiles]);
    if (add.status !== 0) {
        console.error(add.stderr || add.stdout);
        process.exit(1);
    }
    const commit = run("git", [
        "commit",
        "-m",
        `editorial: daily preparation ${dateIso}`,
    ]);
    if (commit.status !== 0) {
        // possibly nothing staged
        console.log(commit.stdout || commit.stderr || "commit skipped/failed");
    }
}

const push = run("git", ["push", "-u", "origin", `HEAD:${branch}`]);
if (push.status !== 0) {
    console.error(push.stderr || push.stdout);
    console.error("Push failed — PR not opened. Fix remote auth and retry.");
    process.exit(1);
}

const existing = run("gh", ["pr", "list", "--head", branch, "--json", "number,url,isDraft"]);
let prUrl = null;
try {
    const list = JSON.parse(existing.stdout || "[]");
    if (list[0]?.url) {
        prUrl = list[0].url;
        run("gh", ["pr", "edit", String(list[0].number), "--title", title, "--body", body]);
        if (!list[0].isDraft) {
            console.log("Existing PR is not draft; left as-is (will not auto-merge).");
        }
    }
} catch {
    // create new
}

if (!prUrl) {
    const created = run("gh", [
        "pr",
        "create",
        "--draft",
        "--title",
        title,
        "--body",
        body,
        "--head",
        branch,
    ]);
    if (created.status !== 0) {
        console.error(created.stderr || created.stdout);
        process.exit(1);
    }
    prUrl = (created.stdout || "").trim();
}

console.log(`Draft PR ready: ${prUrl}`);
console.log("No merge / deploy performed.");
process.exit(0);
