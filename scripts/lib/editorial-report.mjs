/**
 * Daily editorial report renderer (Phase 10A).
 */

function bulletList(items, empty = "- (none)") {
    if (!items || !items.length) return [empty];
    return items;
}

export function renderDailyEditorialReport(ctx = {}) {
    const {
        dateIso,
        dryRun = false,
        created = [],
        skipped = [],
        noQualified = [],
        notes = [],
        newsResults = [],
        blogResult = null,
        imageRequirements = [],
        social = { written: [], skipped: [] },
        validation = {},
        publishReadiness = [],
        sourceAuditLines = [],
        linkLines = [],
    } = ctx;

    const lines = [];
    lines.push(`# CinNova daily editorial report — ${dateIso}`);
    lines.push("");
    lines.push("## DAILY SUMMARY");
    lines.push("- Preparation only. No publish / merge / deploy performed.");
    lines.push(`- Dry-run: ${dryRun ? "yes" : "no"}`);
    lines.push(`- News drafts created: ${created.filter((item) => item.type === "news").length}`);
    lines.push(`- Blog drafts created: ${created.filter((item) => item.type === "blog").length}`);
    lines.push(`- NO QUALIFIED STORY desks: ${noQualified.length}`);
    lines.push(`- Social drafts prepared: ${social.written?.length || 0} (status=draft only)`);
    lines.push("");
    lines.push("## NEWS CANDIDATES");

    if (!newsResults.length) {
        lines.push("- (none evaluated)");
    }
    for (const row of newsResults) {
        lines.push(`### ${row.coverage} — **${row.disposition}**`);
        lines.push(`- Slug: ${row.slug ? `\`${row.slug}\`` : "—"}`);
        lines.push(`- Fact-check: ${row.factCheckStatus || "—"} (score ${row.factCheckScore ?? "—"})`);
        lines.push(`- Duplicate: ${row.duplicateClassification || "—"}`);
        lines.push(`- SEO: ${row.seoOk === true ? "ok" : row.seoOk === false ? "issues" : "—"}`);
        lines.push(`- Hero: ${row.heroStatus || "—"}`);
        lines.push(`- Reason: ${row.reason || "—"}`);
        lines.push("");
    }

    lines.push("## BLOG CANDIDATE");
    if (!blogResult) {
        lines.push("- (none)");
    } else {
        lines.push(`- Disposition: **${blogResult.disposition}**`);
        lines.push(`- Slug: ${blogResult.slug ? `\`${blogResult.slug}\`` : "—"}`);
        lines.push(`- Fact-check: ${blogResult.factCheckStatus || "—"}`);
        lines.push(`- SEO: ${blogResult.seoOk === true ? "ok" : blogResult.seoOk === false ? "issues" : "—"}`);
        lines.push(`- Hero: ${blogResult.heroStatus || "—"}`);
        lines.push(`- Reason: ${blogResult.reason || "—"}`);
    }
    lines.push("");

    lines.push("## SOURCE AUDIT");
    lines.push(...bulletList(sourceAuditLines.length ? sourceAuditLines : ["- See per-item fact-check reasons"]));
    lines.push("");

    lines.push("## FACT-CHECK RESULTS");
    lines.push(
        ...bulletList(
            publishReadiness.map(
                (item) =>
                    `- **${item.status}** ${item.kind} \`${item.slug || "—"}\` — publishCandidate=${item.publishCandidate} blocked=${item.blockedFromPublish}`,
            ),
        ),
    );
    lines.push("");

    lines.push("## DUPLICATE CHECK");
    lines.push(
        ...bulletList(
            newsResults.map(
                (row) =>
                    `- ${row.coverage}: ${row.duplicateClassification || "n/a"}${row.slug ? ` (\`${row.slug}\`)` : ""}`,
            ),
        ),
    );
    lines.push("");

    lines.push("## SEO CHECK");
    const seoRows = [...newsResults, blogResult].filter(Boolean).map((row) => {
        const label = row.coverage || "blog";
        return `- ${label} \`${row.slug || "—"}\`: ${row.seoSummary || (row.seoOk ? "ok" : "see warnings")}`;
    });
    lines.push(...bulletList(seoRows));
    lines.push("");

    lines.push("## INTERNAL LINKS");
    lines.push(...bulletList(linkLines.length ? linkLines : ["- Suggestions applied when drafts were created"]));
    lines.push("");

    lines.push("## IMAGE REQUIREMENTS");
    lines.push(
        ...bulletList(
            imageRequirements.map(
                (req) =>
                    `- **IMAGE REQUIRED** \`${req.filename}\` → \`${req.folder}\` (${req.dimensions}) — ${req.visualConcept}`,
            ),
        ),
    );
    lines.push("");

    lines.push("## SOCIAL DRAFTS");
    if (social.written?.length) {
        for (const item of social.written) {
            lines.push(
                `- prepared \`${item.platform}\` → \`${item.path}\`${item.dryRun ? " (dry-run)" : ""}`,
            );
        }
    } else {
        lines.push("- (none)");
    }
    if (social.skipped?.length) {
        lines.push("Skipped:");
        for (const item of social.skipped) {
            lines.push(`- ${item.platform || ""} ${item.reason}`);
        }
    }
    lines.push("");

    lines.push("## VALIDATION");
    lines.push(`### validate:news (exit ${validation.news?.code ?? "n/a"})`);
    lines.push("```");
    lines.push(String(validation.news?.stdout || validation.news?.stderr || "").trim().slice(-3500));
    lines.push("```");
    lines.push("");
    lines.push(`### validate:blog (exit ${validation.blog?.code ?? "n/a"})`);
    lines.push("```");
    lines.push(String(validation.blog?.stdout || validation.blog?.stderr || "").trim().slice(-3500));
    lines.push("```");
    lines.push("");

    lines.push("## PUBLISH READINESS");
    lines.push(
        ...bulletList(
            publishReadiness.map(
                (item) =>
                    `- **${item.status}** — ${item.kind} \`${item.slug || "—"}\`${item.blockedFromPublish ? " (blocked from publish)" : ""}`,
            ),
        ),
    );
    lines.push("");

    lines.push("## Drafts prepared");
    if (!created.length) {
        lines.push("- (none)");
    } else {
        for (const item of created) {
            lines.push(
                `- **${item.type}** ${item.coverage ? `(${item.coverage}) ` : ""}\`${item.slug}\` → \`${item.path}\`${item.dryRun ? " (dry-run)" : ""}`,
            );
        }
    }
    lines.push("");

    lines.push("## Skipped / NO QUALIFIED");
    const skippedAll = [...skipped, ...noQualified];
    if (!skippedAll.length) {
        lines.push("- (none)");
    } else {
        for (const item of skippedAll) {
            lines.push(
                `- **${item.type || item.coverage || "desk"}** ${item.slug ? `\`${item.slug}\`: ` : ""}${item.reason}`,
            );
        }
    }
    lines.push("");

    lines.push("## Notes");
    for (const line of notes) lines.push(`- ${line}`);
    lines.push("");
    lines.push("## Next (manual)");
    lines.push("1. Review READY/REVIEW drafts in DEV preview.");
    lines.push("2. Resolve IMAGE REQUIRED assets before publish.");
    lines.push("3. HOLD items stay unpublished.");
    lines.push("4. `news:publish` / `blog:publish` only after human approval.");
    lines.push("5. `editorial:prepare-pr` opens a Draft PR — never auto-merge.");
    lines.push("");

    return `${lines.join("\n")}\n`;
}
