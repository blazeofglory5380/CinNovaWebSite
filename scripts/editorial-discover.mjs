#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { isDryRun, readArg, readFlag, resolveDateIso, ROOT } from "./lib/editorial-cli.mjs";
import { runDiscovery } from "./editorial/research/discover.mjs";

const argv = process.argv.slice(2);
const mode = readFlag("--live", argv) ? "live" : "fixture";
const dryRun = isDryRun(argv);
const dateIso = resolveDateIso(argv);
const fixtureValue = readArg("--fixtures", argv) || readArg("--fixture", argv);
const fixtureDir = fixtureValue?.startsWith("--") ? undefined : fixtureValue || undefined;
const outPacket = readArg("--out-packet", argv);

try {
    const result = await runDiscovery({ mode, fixtureDir, dateIso, dryRun });
    let packetPath = null;
    if (outPacket && !dryRun) {
        packetPath = path.isAbsolute(outPacket) ? outPacket : path.join(ROOT, outPacket);
        mkdirSync(path.dirname(packetPath), { recursive: true });
        writeFileSync(packetPath, `${JSON.stringify(result.packet, null, 2)}\n`, "utf8");
    }
    console.log(`Editorial discovery complete for ${dateIso}`);
    console.log(`Mode: ${mode}; candidates: ${result.candidateCount}; qualified: ${result.qualifiedCount}`);
    console.log(dryRun ? "Dry-run: no files written." : `Report: ${result.paths.jsonPath}`);
    if (packetPath) console.log(`Packet: ${packetPath}`);
    console.log("Research ingestion only — no publish, merge, deploy, or social action performed.");
} catch (error) {
    console.error(`Editorial discovery failed: ${error?.stack || error}`);
    process.exitCode = 1;
}
