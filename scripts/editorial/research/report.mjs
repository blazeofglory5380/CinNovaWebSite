import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { EDITORIAL_REPORTS_DIR } from "../../lib/blog-editorial.mjs";

function markdown(report) {
    const lines = [
        `# CinNova discovery report — ${report.date}`,
        "",
        "Research ingestion only. No publish, merge, deploy, or social action was performed.",
        "",
        `- Mode: ${report.mode}`,
        `- Run status: ${report.runStatus?.status || "UNKNOWN"}`,
        `- Sources attempted: ${report.sourceResults.length}`,
        `- Candidates: ${report.candidateCount}`,
        `- Clusters: ${report.clusterCount ?? report.clusters.length}`,
        `- Research-qualified: ${report.qualifiedCount}`,
        `- Editorial-selected: ${report.selectedCount ?? 0}`,
        "",
        "## Source results",
        ...report.sourceResults.map((source) =>
            `- ${source.sourceId}: ${source.ok ? `${source.count} candidate(s)` : `ERROR — ${source.error}`}`),
        "",
        "## Editorial selection",
        `- News: ${(report.selection?.newsTopics || []).join("; ") || "(none)"}`,
        `- Blog: ${(report.selection?.blogTopics || []).join("; ") || "(none)"}`,
        `- Weak-fit rejected: ${(report.selection?.rejectedWeakFit || []).length}`,
        "",
        "## Clusters",
    ];
    if (!report.clusters.length) lines.push("- No candidates discovered.");
    for (const cluster of report.clusters) {
        lines.push(
            `### ${cluster.canonicalTopic}`,
            `- Route: ${cluster.route?.route || "SKIP"}`,
            `- Freshness: ${cluster.freshness}`,
            `- Corroborated: ${cluster.corroborated ? "yes" : "no"}`,
            `- CinNova classification: ${cluster.cinovaClassification}`,
            `- Relevance: ${cluster.relevance}`,
            `- Qualified: ${cluster.qualified ? "yes" : "no"}`,
            `- Reason: ${cluster.qualificationRationale}`,
            "",
        );
    }
    return `${lines.join("\n")}\n`;
}

export function buildRunSummary(report) {
    return {
        schemaVersion: report.schemaVersion || "10B.2",
        date: report.date,
        mode: report.mode,
        runStatus: report.runStatus || null,
        sourceResults: (report.sourceResults || []).map((source) => ({
            sourceId: source.sourceId,
            ok: source.ok,
            count: source.count,
            error: source.error,
        })),
        candidateCount: report.candidateCount || 0,
        clusterCount: report.clusterCount ?? report.clusters?.length ?? 0,
        qualifiedCount: report.qualifiedCount || 0,
        selectedCount: report.selectedCount || 0,
        selection: report.selection || null,
        packetDesks: {
            local: Boolean(report.packet?.news?.local?.title),
            state: Boolean(report.packet?.news?.state?.title),
            national: Boolean(report.packet?.news?.national?.title),
            international: Boolean(report.packet?.news?.international?.title),
            blog: Boolean(report.packet?.blog?.title),
        },
        safety: report.safety,
    };
}

export function writeDiscoveryReport(report, { dateIso = report.date, dryRun = false } = {}) {
    const jsonPath = path.join(EDITORIAL_REPORTS_DIR, `${dateIso}-discovery.json`);
    const mdPath = path.join(EDITORIAL_REPORTS_DIR, `${dateIso}-discovery.md`);
    const summaryPath = path.join(EDITORIAL_REPORTS_DIR, `${dateIso}-run-summary.json`);
    const rendered = markdown(report);
    const summary = buildRunSummary(report);
    if (!dryRun) {
        mkdirSync(EDITORIAL_REPORTS_DIR, { recursive: true });
        writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
        writeFileSync(mdPath, rendered, "utf8");
        writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
    }
    return { jsonPath, mdPath, summaryPath, summary, markdown: rendered };
}
