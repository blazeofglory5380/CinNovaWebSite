#!/usr/bin/env node
/**
 * Complete editorial automation in shadow / dry-run mode.
 *
 * Runs the preparation chain without:
 * - writing news/blog/social draft files
 * - opening Draft PRs
 * - publishing to production catalogs
 * - social posting
 * - merge / deploy
 *
 * Usage:
 *   npm run editorial:shadow
 *   npm run editorial:shadow -- --date=2026-08-11
 *   npm run editorial:shadow -- --fixture --date=2026-08-11
 *   npm run editorial:shadow -- --from-packet=editorial-reports/research-packet.example.json
 */

import { existsSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import {
    ROOT,
    resolveDateIso,
    readArg,
    readFlag,
} from "./lib/editorial-cli.mjs";
import { runEditorialDailyPipeline } from "./lib/editorial-pipeline.mjs";
import { writeShadowReport } from "./lib/editorial-shadow-report.mjs";
import {
    resolveAutomationExecutionMode,
    resolveResearchMode,
} from "./editorial/research/scheduleMode.mjs";

const dateIso = resolveDateIso();
const wantLive = readFlag("--live");
const wantFixture = readFlag("--fixture") || !wantLive;
const packetArg = readArg("--from-packet");
const skipDiscover = readFlag("--skip-discover");

const researchMode = resolveResearchMode({
    eventName: "workflow_dispatch",
    researchModeInput: wantLive ? "live" : "fixture",
});
const executionMode = resolveAutomationExecutionMode({
    eventName: "workflow_dispatch",
    dryRunInput: "true",
    shadowInput: "true",
    allowDraftPrInput: "false",
});

function runNpm(script, args = []) {
    const result = spawnSync("npm", ["run", script, "--", ...args], {
        cwd: ROOT,
        encoding: "utf8",
        shell: true,
    });
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    return result.status === 0;
}

console.log(`\nEditorial SHADOW mode — ${dateIso}`);
console.log(`Research: ${researchMode.mode} | Execution: shadow/dry-run`);
console.log("Auto-publish: OFF | Draft PR: OFF | Catalog writes: OFF\n");

if (!skipDiscover) {
    const discoverArgs = [`--date=${dateIso}`, wantLive ? "--live" : "--fixture"];
    console.log(`→ editorial:discover ${discoverArgs.join(" ")}`);
    const ok = runNpm("editorial:discover", discoverArgs);
    if (!ok && wantLive) {
        console.warn("Live discover reported failure; continuing to evaluate packet/status.");
    }

    console.log(`→ editorial:research-live ${discoverArgs.join(" ")}`);
    const okLive = runNpm("editorial:research-live", discoverArgs);
    if (!okLive && wantLive) {
        console.warn("Live packet build reported failure; shadow report will reflect status.");
    }
}

const livePacket = path.join(ROOT, "editorial-reports", `${dateIso}-live-packet.json`);
const examplePacket = path.join(ROOT, "editorial-reports", "research-packet.example.json");
const packetPath =
    packetArg ||
    (existsSync(livePacket) ? livePacket : existsSync(examplePacket) ? examplePacket : null);

if (packetPath) {
    console.log(`→ editorial:research --dry-run --from-packet=${packetPath}`);
    runNpm("editorial:research", [`--date=${dateIso}`, "--dry-run", `--from-packet=${packetPath}`]);
} else {
    console.log("→ editorial:research skipped (no packet available)");
}

console.log("→ editorial:daily --dry-run (shadow)");
const pipelineResult = runEditorialDailyPipeline({
    dateIso,
    dryRun: true,
    skipExisting: true,
    packetPath,
    prepareSocial: false,
    legacySkeletons: false,
});

const { jsonPath, mdPath, report } = writeShadowReport({
    dateIso,
    executionMode,
    researchMode,
    pipelineResult,
    notes: [
        `Packet: ${packetPath || "none"}`,
        `Discover mode: ${wantFixture ? "fixture" : "live"}`,
    ],
});

console.log(`\nShadow complete for ${dateIso}`);
console.log(`Would create: ${report.counts.wouldCreateNews} news, ${report.counts.wouldCreateBlog} blog`);
console.log(`NO QUALIFIED: ${report.counts.noQualified} | IMAGE REQUIRED: ${report.counts.imageRequired}`);
console.log(`Shadow JSON: ${jsonPath}`);
console.log(`Shadow MD:   ${mdPath}`);
console.log("No drafts written. No Draft PR. No publish. No deploy.");
process.exit(0);
