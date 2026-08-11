/**
 * Phase 4 — multi-day shadow quality metrics accumulator.
 * Only accumulates real executions — never invents historical runs.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { EDITORIAL_REPORTS_DIR } from "../../lib/blog-editorial.mjs";

export const SHADOW_METRICS_FILE = "shadow-quality-metrics.json";

function metricsPath(reportsDir = EDITORIAL_REPORTS_DIR) {
    return path.join(reportsDir, SHADOW_METRICS_FILE);
}

export function loadShadowMetrics(reportsDir = EDITORIAL_REPORTS_DIR) {
    const file = metricsPath(reportsDir);
    if (!existsSync(file)) {
        return {
            schemaVersion: "phase4-shadow-metrics",
            runs: [],
            note: "No accumulated runs yet — only real executions are stored.",
        };
    }
    try {
        return JSON.parse(readFileSync(file, "utf8"));
    } catch {
        return {
            schemaVersion: "phase4-shadow-metrics",
            runs: [],
            note: "Metrics file unreadable; starting empty (no invented history).",
        };
    }
}

/**
 * Append one real daily shadow run. Idempotent per dateIso (replaces same day).
 */
export function recordShadowRun(snapshot = {}, { reportsDir = EDITORIAL_REPORTS_DIR } = {}) {
    const store = loadShadowMetrics(reportsDir);
    const dateIso = snapshot.dateIso || snapshot.date;
    if (!dateIso) {
        return { ok: false, error: "dateIso required", store };
    }
    const entry = {
        dateIso,
        recordedAt: new Date().toISOString(),
        readyNews: Number(snapshot.readyNews || 0),
        reviewNews: Number(snapshot.reviewNews || 0),
        holdNews: Number(snapshot.holdNews || 0),
        rejectedNews: Number(snapshot.rejectedNews || 0),
        blogReady: Number(snapshot.blogReady || 0),
        blogReview: Number(snapshot.blogReview || 0),
        rejectionRate: Number(snapshot.rejectionRate || 0),
        sourceFailures: Number(snapshot.sourceFailures || 0),
        duplicateRate: Number(snapshot.duplicateRate || 0),
        corroborationSuccess: Number(snapshot.corroborationSuccess || 0),
        factualConflicts: Number(snapshot.factualConflicts || 0),
        imageReady: Number(snapshot.imageReady || 0),
        imageMissing: Number(snapshot.imageMissing || 0),
        translationQueued: Number(snapshot.translationQueued || 0),
        translationMissing: Number(snapshot.translationMissing || 0),
        invented: false,
    };
    const runs = (store.runs || []).filter((run) => run.dateIso !== dateIso);
    runs.push(entry);
    runs.sort((a, b) => String(a.dateIso).localeCompare(String(b.dateIso)));
    const next = {
        schemaVersion: "phase4-shadow-metrics",
        updatedAt: new Date().toISOString(),
        runs,
        note: "Accumulates real shadow executions only — no invented historical runs.",
    };
    mkdirSync(reportsDir, { recursive: true });
    writeFileSync(metricsPath(reportsDir), `${JSON.stringify(next, null, 2)}\n`, "utf8");
    return { ok: true, error: null, store: next, entry };
}

export function summarizeShadowMetrics(store = loadShadowMetrics()) {
    const runs = store.runs || [];
    if (!runs.length) {
        return {
            days: 0,
            avgReadyNews: 0,
            avgReviewNews: 0,
            avgBlogReady: 0,
            totalSourceFailures: 0,
            note: "No real runs accumulated yet.",
        };
    }
    const avg = (key) => runs.reduce((sum, r) => sum + (r[key] || 0), 0) / runs.length;
    return {
        days: runs.length,
        avgReadyNews: Number(avg("readyNews").toFixed(2)),
        avgReviewNews: Number(avg("reviewNews").toFixed(2)),
        avgBlogReady: Number(avg("blogReady").toFixed(2)),
        avgBlogReview: Number(avg("blogReview").toFixed(2)),
        totalSourceFailures: runs.reduce((sum, r) => sum + (r.sourceFailures || 0), 0),
        avgCorroborationSuccess: Number(avg("corroborationSuccess").toFixed(2)),
        avgFactualConflicts: Number(avg("factualConflicts").toFixed(2)),
        latestDate: runs.at(-1)?.dateIso || null,
    };
}
