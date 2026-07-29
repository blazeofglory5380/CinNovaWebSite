#!/usr/bin/env node
/**
 * Phase 10A — research + candidate scoring (no invented events).
 *
 * Usage:
 *   npm run editorial:research
 *   npm run editorial:research -- --date=2026-07-29
 *   npm run editorial:research -- --from-packet=editorial-reports/research-packet.example.json
 *   npm run editorial:research -- --dry-run
 */

import { resolveDateIso, isDryRun, readArg } from "./lib/editorial-cli.mjs";
import { runEditorialResearch } from "./lib/editorial-research.mjs";

const dateIso = resolveDateIso();
const dryRun = isDryRun();
const packetPath = readArg("--from-packet");

const result = runEditorialResearch({ dateIso, packetPath, dryRun });

console.log(`\nEditorial research complete for ${dateIso}`);
console.log(`Packet: ${result.packetPath || "(none)"}`);
console.log(`Qualified news desks: ${result.qualifiedNews.join(", ") || "(none)"}`);
console.log(`Qualified blog: ${result.qualifiedBlog ? "yes" : "no"}`);
for (const desk of result.newsDesks) {
    console.log(`  - ${desk.coverage}: ${desk.disposition}${desk.qualified ? " (draft-eligible)" : ""}`);
}
console.log(`  - blog: ${result.blog.disposition}${result.blog.qualified ? " (draft-eligible)" : ""}`);
if (!dryRun) {
    console.log(`Wrote: ${result.paths.mdPath}`);
    console.log(`Wrote: ${result.paths.jsonPath}`);
} else {
    console.log("Dry-run: no research files written.");
}
console.log("No drafts / publish / commit performed.");
process.exit(0);
