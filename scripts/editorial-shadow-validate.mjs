#!/usr/bin/env node
/**
 * Real Editorial Shadow Validation against live public sources.
 *
 * - Discovers from trusted active registry feeds
 * - Runs dry-run research + daily pipeline
 * - Writes comprehensive validation report artifacts only
 * - Never publishes, merges, deploys, or opens Draft PRs
 *
 * Usage:
 *   npm run editorial:shadow:validate
 *   npm run editorial:shadow:validate -- --date=2026-08-11
 */

import path from "node:path";
import { spawnSync } from "node:child_process";
import { ROOT, resolveDateIso, readFlag } from "./lib/editorial-cli.mjs";
import { runEditorialDailyPipeline } from "./lib/editorial-pipeline.mjs";
import { writeShadowReport } from "./lib/editorial-shadow-report.mjs";
import {
    loadDiscoveryArtifacts,
    writeRealShadowValidationReport,
} from "./lib/editorial-real-shadow-validation.mjs";
import {
    resolveAutomationExecutionMode,
    resolveResearchMode,
} from "./editorial/research/scheduleMode.mjs";

const dateIso = resolveDateIso();
const skipDiscover = readFlag("--skip-discover");

const researchMode = resolveResearchMode({
    eventName: "workflow_dispatch",
    researchModeInput: "live",
});
const executionMode = resolveAutomationExecutionMode({
    eventName: "schedule",
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

console.log(`\n=== CinNova Editorial REAL SHADOW VALIDATION — ${dateIso} ===`);
console.log("Live sources · dry-run only · auto-publish OFF · no Draft PR · no catalog writes\n");

if (!skipDiscover) {
    console.log("→ editorial:discover --live");
    runNpm("editorial:discover", [`--date=${dateIso}`, "--live"]);
    console.log("→ editorial:research-live --live");
    runNpm("editorial:research-live", [`--date=${dateIso}`, "--live"]);
}

const artifacts = loadDiscoveryArtifacts(dateIso, ROOT);
const packetPath = path.join(ROOT, "editorial-reports", `${dateIso}-live-packet.json`);

if (artifacts.packet) {
    console.log("→ editorial:research --dry-run (live packet)");
    runNpm("editorial:research", [
        `--date=${dateIso}`,
        "--dry-run",
        `--from-packet=${packetPath}`,
    ]);
}

console.log("→ editorial:daily --dry-run (shadow)");
const pipelineResult = runEditorialDailyPipeline({
    dateIso,
    dryRun: true,
    skipExisting: true,
    packetPath: artifacts.packet ? packetPath : null,
    prepareSocial: false,
    legacySkeletons: false,
});

const shadow = writeShadowReport({
    dateIso,
    executionMode,
    researchMode,
    pipelineResult,
    researchStatus: artifacts.runSummary?.runStatus || artifacts.discovery?.runStatus || null,
    notes: ["Real shadow validation run", `Packet: ${artifacts.packet ? packetPath : "none"}`],
});

const validation = writeRealShadowValidationReport({
    dateIso,
    discovery: artifacts.discovery,
    runSummary: artifacts.runSummary,
    packet: artifacts.packet,
    pipelineResult,
    executionMode,
    researchMode,
});

console.log("\n=== VALIDATION COMPLETE (shadow only) ===");
console.log(`Verdict: ${validation.report.verdict}`);
console.log(`Discovery: ${validation.report.discovery.storiesFound} stories → ${validation.report.discovery.candidatesAccepted} eligible`);
console.log(`News shadow drafts: ${validation.report.news.acceptedDrafts.length}`);
console.log(`Blog shadow drafts: ${validation.report.blog.acceptedDrafts.length}`);
console.log(`Shadow report: ${shadow.jsonPath}`);
console.log(`Validation JSON: ${validation.jsonPath}`);
console.log(`Validation MD:   ${validation.mdPath}`);
console.log("No drafts on disk. No Draft PR. No publish. No deploy. No merge.");
process.exit(0);
