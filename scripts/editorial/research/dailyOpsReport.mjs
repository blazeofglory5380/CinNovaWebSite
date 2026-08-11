/**
 * Phase 4 — daily operations report (shadow-aware).
 * Never represents shadow articles as published.
 */

export function buildDailyOperationsReport({
    dateIso,
    discovery = null,
    news = null,
    blog = null,
    sources = null,
    translation = null,
    images = null,
    publication = null,
    mode = null,
} = {}) {
    const fetched = discovery?.fetched ?? discovery?.storiesFound ?? discovery?.candidateCount ?? 0;
    const deduplicated = discovery?.deduplicated ?? discovery?.clusters ?? discovery?.clusterCount ?? 0;
    const rejected = discovery?.rejected ?? discovery?.candidatesRejected ?? 0;
    const qualified = discovery?.qualified ?? discovery?.qualifiedCount ?? 0;

    return {
        schemaVersion: "phase4-daily-ops",
        date: dateIso,
        generatedAt: new Date().toISOString(),
        mode: mode?.mode || "SHADOW",
        shadowArticlesAreNotPublished: true,
        discovery: {
            fetched,
            deduplicated,
            rejected,
            qualified,
        },
        news: {
            READY: news?.ready ?? 0,
            REVIEW: news?.review ?? 0,
            HOLD: news?.hold ?? 0,
            REJECTED: news?.rejected ?? 0,
            titles: news?.titles || [],
        },
        blog: {
            READY: blog?.ready ?? 0,
            REVIEW: blog?.review ?? 0,
            rejected: blog?.rejected ?? 0,
            titles: blog?.titles || [],
        },
        sources: {
            healthy: sources?.healthy ?? 0,
            degraded: sources?.degraded ?? 0,
            failed: sources?.failed ?? 0,
            coverageGaps: sources?.coverageGaps || [],
        },
        translation: {
            queued: translation?.queued ?? 0,
            missing: translation?.missing ?? 0,
            reviewRequired: translation?.reviewRequired ?? 0,
        },
        images: {
            ready: images?.ready ?? 0,
            missing: images?.missing ?? 0,
            attributionRequired: images?.attributionRequired ?? 0,
        },
        publication: {
            draftsThatWouldBeCreated: publication?.draftsThatWouldBeCreated ?? 0,
            articlesEligibleToPublish: 0,
            articlesBlocked: publication?.articlesBlocked ?? 0,
            exactBlockers: publication?.exactBlockers || [
                "Production scheduler is SHADOW",
                "Auto-publish OFF",
                "Catalog writes OFF unless controlled DRAFT is explicitly authorized",
            ],
            shadowNotPublished: true,
        },
    };
}

export function renderDailyOperationsMarkdown(report = {}) {
    const lines = [
        `# CinNova Editorial Daily Operations — ${report.date}`,
        "",
        `Mode: **${report.mode || "SHADOW"}** · Shadow articles are **not** published.`,
        "",
        "## DISCOVERY",
        `- Fetched: ${report.discovery?.fetched ?? 0}`,
        `- Deduplicated: ${report.discovery?.deduplicated ?? 0}`,
        `- Rejected: ${report.discovery?.rejected ?? 0}`,
        `- Qualified: ${report.discovery?.qualified ?? 0}`,
        "",
        "## NEWS",
        `- READY: ${report.news?.READY ?? 0}`,
        `- REVIEW: ${report.news?.REVIEW ?? 0}`,
        `- HOLD: ${report.news?.HOLD ?? 0}`,
        `- REJECTED: ${report.news?.REJECTED ?? 0}`,
        "",
        "## BLOG",
        `- READY: ${report.blog?.READY ?? 0}`,
        `- REVIEW: ${report.blog?.REVIEW ?? 0}`,
        `- Rejected: ${report.blog?.rejected ?? 0}`,
        "",
        "## SOURCES",
        `- Healthy: ${report.sources?.healthy ?? 0}`,
        `- Degraded: ${report.sources?.degraded ?? 0}`,
        `- Failed: ${report.sources?.failed ?? 0}`,
        `- Coverage gaps: ${(report.sources?.coverageGaps || []).join(", ") || "none listed"}`,
        "",
        "## TRANSLATION",
        `- Queued: ${report.translation?.queued ?? 0}`,
        `- Missing: ${report.translation?.missing ?? 0}`,
        `- Review required: ${report.translation?.reviewRequired ?? 0}`,
        "",
        "## IMAGES",
        `- Ready: ${report.images?.ready ?? 0}`,
        `- Missing: ${report.images?.missing ?? 0}`,
        `- Attribution required: ${report.images?.attributionRequired ?? 0}`,
        "",
        "## PUBLICATION",
        `- Drafts that would be created: ${report.publication?.draftsThatWouldBeCreated ?? 0}`,
        `- Articles eligible to publish: ${report.publication?.articlesEligibleToPublish ?? 0}`,
        `- Articles blocked: ${report.publication?.articlesBlocked ?? 0}`,
        `- Blockers:`,
        ...(report.publication?.exactBlockers || []).map((b) => `  - ${b}`),
        "",
    ];
    return `${lines.join("\n")}\n`;
}
