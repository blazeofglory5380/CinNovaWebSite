#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { isDryRun, readArg, readFlag, resolveDateIso, ROOT } from "./lib/editorial-cli.mjs";
import { runDiscovery } from "./editorial/research/discover.mjs";

const argv = process.argv.slice(2);
const dateIso = resolveDateIso(argv);
const dryRun = isDryRun(argv);
const fixtureRequested = readFlag("--fixture", argv) ||
    readFlag("--fixtures", argv) ||
    argv.some((arg) => arg.startsWith("--fixture=") || arg.startsWith("--fixtures="));
const mode = fixtureRequested ? "fixture" : "live";
const fixtureValue = readArg("--fixtures", argv) || readArg("--fixture", argv);
const fixtureDir = fixtureValue?.startsWith("--") ? undefined : fixtureValue || undefined;
const requestedOutput = readArg("--out-packet", argv) || `editorial-reports/${dateIso}-live-packet.json`;
const packetPath = path.isAbsolute(requestedOutput) ? requestedOutput : path.join(ROOT, requestedOutput);

try {
    const result = await runDiscovery({ mode, fixtureDir, dateIso, dryRun });
    if (!dryRun) {
        mkdirSync(path.dirname(packetPath), { recursive: true });
        writeFileSync(packetPath, `${JSON.stringify(result.packet, null, 2)}\n`, "utf8");
    }
    console.log(`Live research ingestion complete for ${dateIso}`);
    console.log(`Mode: ${mode}; qualified clusters: ${result.qualifiedCount}`);
    console.log(dryRun ? "Dry-run: packet not written." : `VERIFIED RESEARCH PACKET: ${packetPath}`);
    console.log("No publish, merge, deploy, draft forcing, or social action performed.");
} catch (error) {
    console.error(`Live research ingestion failed: ${error?.stack || error}`);
    process.exitCode = 1;
}
