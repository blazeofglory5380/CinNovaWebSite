/**
 * Shadow / dry-run report writer for editorial automation.
 * Records what the pipeline would do without writing drafts, opening PRs,
 * publishing catalogs, posting socially, or deploying.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { EDITORIAL_REPORTS_DIR } from "./blog-editorial.mjs";

/**
 * @param {object} input
 * @returns {{ jsonPath: string, mdPath: string, report: object }}
 */
export function writeShadowReport({
    dateIso,
    executionMode,
    researchMode,
    pipelineResult = null,
    researchStatus = null,
    notes = [],
} = {}) {
    const created = pipelineResult?.created || [];
    const skipped = pipelineResult?.skipped || [];
    const noQualified = pipelineResult?.noQualified || [];
    const imageRequirements = pipelineResult?.imageRequirements || [];

    const report = {
        schemaVersion: "10B-shadow",
        date: dateIso,
        generatedAt: new Date().toISOString(),
        mode: "shadow",
        dryRun: true,
        autoPublish: false,
        openDraftPr: false,
        writeDraftFiles: false,
        researchMode: researchMode || null,
        executionMode: executionMode || null,
        researchStatus: researchStatus || null,
        wouldCreate: created.map((item) => ({
            type: item.type,
            coverage: item.coverage || null,
            slug: item.slug,
            path: item.path,
        })),
        wouldSkip: skipped,
        noQualified,
        imageRequirements,
        counts: {
            wouldCreateNews: created.filter((i) => i.type === "news").length,
            wouldCreateBlog: created.filter((i) => i.type === "blog").length,
            wouldCreateSocial: created.filter((i) => i.type === "social").length,
            skipped: skipped.length,
            noQualified: noQualified.length,
            imageRequired: imageRequirements.length,
        },
        safety: {
            publishedCatalogsTouched: false,
            draftPrOpened: false,
            socialPosted: false,
            deployed: false,
            merged: false,
        },
        notes: [
            "Shadow mode simulates the complete editorial automation.",
            "No news/blog drafts were written to disk.",
            "No Draft PR was opened.",
            "No production catalog publish occurred.",
            ...notes,
        ],
    };

    mkdirSync(EDITORIAL_REPORTS_DIR, { recursive: true });
    const jsonPath = path.join(EDITORIAL_REPORTS_DIR, `${dateIso}-shadow.json`);
    const mdPath = path.join(EDITORIAL_REPORTS_DIR, `${dateIso}-shadow.md`);

    writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
    writeFileSync(mdPath, renderShadowMarkdown(report), "utf8");

    return { jsonPath, mdPath, report };
}

function renderShadowMarkdown(report) {
    const lines = [];
    lines.push(`# Editorial Shadow Report — ${report.date}`);
    lines.push("");
    lines.push(`Generated: \`${report.generatedAt}\``);
    lines.push("");
    lines.push("## Mode");
    lines.push("");
    lines.push("- **Shadow / dry-run:** yes");
    lines.push("- **Auto-publish:** disabled");
    lines.push("- **Draft PR:** not opened");
    lines.push("- **Draft files written:** no");
    if (report.researchMode) {
        lines.push(`- **Research mode:** ${report.researchMode.mode || report.researchMode}`);
    }
    if (report.executionMode?.rationale) {
        lines.push(`- **Execution rationale:** ${report.executionMode.rationale}`);
    }
    lines.push("");
    lines.push("## Would create");
    lines.push("");
    if (!report.wouldCreate.length) {
        lines.push("_Nothing would be created._");
    } else {
        for (const item of report.wouldCreate) {
            lines.push(
                `- **${item.type}** ${item.coverage ? `(${item.coverage}) ` : ""}\`${item.slug}\` → \`${item.path}\``,
            );
        }
    }
    lines.push("");
    lines.push("## Counts");
    lines.push("");
    lines.push(`- News: **${report.counts.wouldCreateNews}**`);
    lines.push(`- Blog: **${report.counts.wouldCreateBlog}**`);
    lines.push(`- Social drafts: **${report.counts.wouldCreateSocial}**`);
    lines.push(`- Skipped: **${report.counts.skipped}**`);
    lines.push(`- NO QUALIFIED: **${report.counts.noQualified}**`);
    lines.push(`- IMAGE REQUIRED: **${report.counts.imageRequired}**`);
    lines.push("");
    lines.push("## Safety");
    lines.push("");
    lines.push("- Published catalogs untouched");
    lines.push("- No merge / deploy / social posting");
    lines.push("- Production auto-publishing remains OFF");
    lines.push("");
    return `${lines.join("\n")}\n`;
}
