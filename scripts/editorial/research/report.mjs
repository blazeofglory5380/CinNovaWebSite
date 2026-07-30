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
        `- Sources attempted: ${report.sourceResults.length}`,
        `- Candidates: ${report.candidateCount}`,
        `- Clusters: ${report.clusters.length}`,
        `- Qualified: ${report.qualifiedCount}`,
        "",
        "## Source results",
        ...report.sourceResults.map((source) =>
            `- ${source.sourceId}: ${source.ok ? `${source.count} candidate(s)` : `ERROR — ${source.error}`}`),
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

export function writeDiscoveryReport(report, { dateIso = report.date, dryRun = false } = {}) {
    const jsonPath = path.join(EDITORIAL_REPORTS_DIR, `${dateIso}-discovery.json`);
    const mdPath = path.join(EDITORIAL_REPORTS_DIR, `${dateIso}-discovery.md`);
    const rendered = markdown(report);
    if (!dryRun) {
        mkdirSync(EDITORIAL_REPORTS_DIR, { recursive: true });
        writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
        writeFileSync(mdPath, rendered, "utf8");
    }
    return { jsonPath, mdPath, markdown: rendered };
}
