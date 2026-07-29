#!/usr/bin/env node
/**
 * Daily editorial preparation orchestrator (Phase 10A).
 *
 * Pipeline:
 *   research → scoring/dedupe → drafts (qualified only) → fact-check →
 *   SEO/links/heroes → optional social drafts → validation → report
 *
 * Does NOT publish / commit / push / merge / deploy.
 *
 * Usage:
 *   npm run editorial:daily
 *   npm run editorial:daily -- --date=2026-07-29
 *   npm run editorial:daily -- --skip-existing
 *   npm run editorial:daily -- --dry-run
 *   npm run editorial:daily -- --from-packet=path/to/research-packet.json
 *   npm run editorial:daily -- --no-social
 *   npm run editorial:daily -- --legacy-skeletons   # old empty-desk behavior (discouraged)
 */

import { resolveDateIso, isDryRun, isSkipExisting, readArg, readFlag } from "./lib/editorial-cli.mjs";
import { runEditorialDailyPipeline } from "./lib/editorial-pipeline.mjs";

const dateIso = resolveDateIso();
const dryRun = isDryRun();
const skipExisting = isSkipExisting();
const packetPath = readArg("--from-packet");
const prepareSocial = !(readFlag("--no-social") || readFlag("--noSocial"));
const legacySkeletons = readFlag("--legacy-skeletons") || readFlag("--legacySkeletons");

const result = runEditorialDailyPipeline({
    dateIso,
    dryRun,
    skipExisting,
    packetPath,
    prepareSocial,
    legacySkeletons,
});

console.log(`\nDaily editorial prep complete for ${dateIso}`);
console.log(`Created: ${result.created.length} | Skipped: ${result.skipped.length} | NO QUALIFIED: ${result.noQualified.length}`);
if (!dryRun) console.log(`Report: ${result.reportPath}`);
else console.log("Dry-run: report not written; no draft files written.");
console.log(
    `validate:news exit=${result.validation.news.code} | validate:blog exit=${result.validation.blog.code}`,
);
console.log("No publish / commit / push / merge / deploy was performed.");

if (result.noQualified.length) {
    console.log("\nNO QUALIFIED STORY:");
    for (const item of result.noQualified) {
        console.log(`  - ${item.coverage || item.type}: ${item.reason}`);
    }
}

if (result.imageRequirements.length) {
    console.log(`\nIMAGE REQUIRED: ${result.imageRequirements.length} asset(s) — see report.`);
}

if (result.validation.news.code !== 0 || result.validation.blog.code !== 0) {
    console.log(
        "Validation reported issues (common for incomplete drafts). See report. Prep exit code remains 0.",
    );
}

process.exit(0);
