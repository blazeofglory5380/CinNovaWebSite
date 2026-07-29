/**
 * Shared CLI helpers for CinNova editorial automation (Phase 10A).
 */

import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

export function readArg(flag, argv = process.argv.slice(2)) {
    const eq = argv.find((arg) => arg.startsWith(`${flag}=`));
    if (eq) return eq.slice(flag.length + 1) || null;
    const index = argv.indexOf(flag);
    if (index === -1) return null;
    return argv[index + 1] || null;
}

export function readFlag(flag, argv = process.argv.slice(2)) {
    return argv.includes(flag);
}

/** Accepts both --dry-run and --dryRun */
export function isDryRun(argv = process.argv.slice(2)) {
    return argv.includes("--dry-run") || argv.includes("--dryRun");
}

export function isSkipExisting(argv = process.argv.slice(2)) {
    return argv.includes("--skip-existing") || argv.includes("--skipExisting");
}

export function resolveDateIso(argv = process.argv.slice(2)) {
    return readArg("--date", argv) || new Date().toISOString().slice(0, 10);
}

export function slugDateStamp(dateIso) {
    return String(dateIso).replace(/-/g, "");
}

export function todayUtc() {
    return new Date().toISOString().slice(0, 10);
}
