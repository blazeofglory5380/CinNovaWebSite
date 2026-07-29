/**
 * Editorial research + candidate scoring (Phase 10A).
 *
 * Does NOT invent current events or sources.
 * Scores human/agent-provided packet candidates and content-gap suggestions.
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { NEWS_COVERAGE_KEYS } from "./news-editorial.mjs";
import { EDITORIAL_REPORTS_DIR, ensureReportsDir, BLOG_CATEGORIES } from "./blog-editorial.mjs";
import { classifyNewsCandidate } from "./editorial-dedupe.mjs";
import { scoreNewsFactCheck, scoreBlogFactCheck } from "./editorial-factcheck.mjs";
import { suggestBlogTopicGaps } from "./editorial-seo.mjs";
import { ROOT } from "./editorial-cli.mjs";

export const RELEVANCE_TOPICS = [
    "ai",
    "artificial intelligence",
    "data center",
    "datacenter",
    "energy",
    "grid",
    "cyber",
    "security",
    "education",
    "edtech",
    "real estate",
    "proptech",
    "robot",
    "infrastructure",
    "semiconductor",
    "chip",
    "policy",
    "regulation",
    "consumer tech",
    "software",
];

function relevanceScore(text = "") {
    const hay = String(text).toLowerCase();
    let hits = 0;
    for (const topic of RELEVANCE_TOPICS) {
        if (hay.includes(topic)) hits += 1;
    }
    return hits;
}

function loadPacket(packetPath) {
    if (!packetPath) return null;
    const absolute = path.isAbsolute(packetPath) ? packetPath : path.join(ROOT, packetPath);
    if (!existsSync(absolute)) {
        throw new Error(`Research packet not found: ${absolute}`);
    }
    return { absolute, data: JSON.parse(readFileSync(absolute, "utf8")) };
}

/**
 * Score one news desk candidate from packet (or mark NO QUALIFIED STORY).
 */
export function scoreNewsDesk(coverage, packetStory, dateIso) {
    if (!packetStory || (!packetStory.title && !packetStory.slug)) {
        return {
            coverage,
            disposition: "NO QUALIFIED STORY",
            factCheck: null,
            duplicate: null,
            relevance: 0,
            qualified: false,
            reason: "No verified candidate provided for this desk. Do not invent a story to fill the desk.",
            candidate: null,
        };
    }

    const duplicate = classifyNewsCandidate(packetStory);
    const factCheck = scoreNewsFactCheck(packetStory, {
        duplicateClassification: duplicate.classification,
    });
    const relevance = relevanceScore(
        `${packetStory.title || ""} ${packetStory.dek || ""} ${packetStory.category || ""} ${packetStory.summary || ""}`,
    );

    let disposition = factCheck.status;
    let qualified = false;
    let reason = factCheck.reasons.join("; ") || duplicate.rationale;

    if (duplicate.classification === "DUPLICATE") {
        disposition = "REJECT";
        qualified = false;
        reason = duplicate.rationale;
    } else if (factCheck.status === "HOLD" || factCheck.status === "REJECT") {
        disposition = factCheck.status;
        qualified = false;
    } else if (relevance === 0) {
        disposition = "REVIEW";
        qualified = false;
        reason = "Low CinNova topic relevance — confirm fit before drafting";
    } else if (factCheck.status === "READY" || factCheck.status === "REVIEW") {
        // Only READY desks auto-qualify for draft creation; REVIEW needs human confirm flag
        qualified = factCheck.status === "READY" || packetStory.forceDraft === true;
        disposition = factCheck.status;
        if (!qualified && factCheck.status === "REVIEW") {
            reason = `${reason}; REVIEW items draft only when packet sets forceDraft=true or after human confirm`;
        }
    }

    return {
        coverage,
        disposition,
        factCheck,
        duplicate,
        relevance,
        qualified,
        reason,
        candidate: {
            ...packetStory,
            coverageLevel: coverage,
            duplicateClassification: duplicate.classification,
            factCheckStatus: disposition,
            researchDate: dateIso,
        },
    };
}

export function scoreBlogCandidate(packetBlog, dateIso) {
    const gaps = suggestBlogTopicGaps({ limit: 6 });

    if (!packetBlog || !packetBlog.title) {
        return {
            disposition: "NO QUALIFIED STORY",
            qualified: false,
            factCheck: null,
            reason: "No verified Blog topic provided. Gap hints listed for humans/agents — do not invent a post.",
            gaps,
            candidate: null,
        };
    }

    if (packetBlog.category && !BLOG_CATEGORIES.includes(packetBlog.category)) {
        return {
            disposition: "REJECT",
            qualified: false,
            factCheck: null,
            reason: `Invalid blog category “${packetBlog.category}”`,
            gaps,
            candidate: packetBlog,
        };
    }

    const factCheck = scoreBlogFactCheck(packetBlog);
    const relevance = relevanceScore(
        `${packetBlog.title} ${packetBlog.excerpt || ""} ${packetBlog.researchBrief?.primaryKeyword || ""}`,
    );

    let qualified = factCheck.status === "READY" || packetBlog.forceDraft === true;
    // Allow REVIEW blog topics with solid title + SEO intent to enter draft prep
    if (!qualified && factCheck.status === "REVIEW" && packetBlog.seoTitle && packetBlog.researchBrief?.primaryKeyword) {
        qualified = true;
    }

    return {
        disposition: factCheck.status,
        qualified,
        factCheck,
        relevance,
        reason: factCheck.reasons.join("; ") || "Blog candidate scored",
        gaps,
        candidate: {
            ...packetBlog,
            factCheckStatus: factCheck.status,
            researchDate: dateIso,
        },
    };
}

/**
 * Run research stage and optionally write research artifacts.
 */
export function runEditorialResearch({
    dateIso,
    packetPath = null,
    dryRun = false,
} = {}) {
    ensureReportsDir();
    const loaded = packetPath ? loadPacket(packetPath) : null;
    const packet = loaded?.data || null;

    const newsDesks = NEWS_COVERAGE_KEYS.map((coverage) =>
        scoreNewsDesk(coverage, packet?.news?.[coverage] || null, dateIso),
    );
    const blog = scoreBlogCandidate(packet?.blog || null, dateIso);

    const summary = {
        date: dateIso,
        packetPath: loaded?.absolute || null,
        safety: [
            "Research scoring only — does not invent events or sources.",
            "NO QUALIFIED STORY desks produce no drafts.",
            "HOLD/REJECT never become publish candidates.",
        ],
        newsDesks,
        blog,
        qualifiedNews: newsDesks.filter((desk) => desk.qualified).map((desk) => desk.coverage),
        qualifiedBlog: Boolean(blog.qualified),
    };

    const jsonPath = path.join(EDITORIAL_REPORTS_DIR, `${dateIso}-research.json`);
    const mdPath = path.join(EDITORIAL_REPORTS_DIR, `${dateIso}-research.md`);
    const markdown = renderResearchMarkdown(summary);

    if (!dryRun) {
        mkdirSync(EDITORIAL_REPORTS_DIR, { recursive: true });
        writeFileSync(jsonPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
        writeFileSync(mdPath, markdown, "utf8");
    }

    return {
        ...summary,
        paths: { jsonPath, mdPath },
        dryRun,
        markdown,
    };
}

function renderResearchMarkdown(summary) {
    const lines = [
        `# CinNova editorial research — ${summary.date}`,
        "",
        "## Safety",
        ...summary.safety.map((line) => `- ${line}`),
        "",
        `Packet: ${summary.packetPath || "(none — all desks NO QUALIFIED STORY unless packet provided)"}`,
        "",
        "## News desks",
    ];

    for (const desk of summary.newsDesks) {
        lines.push(
            `### ${desk.coverage}`,
            `- Disposition: **${desk.disposition}**`,
            `- Qualified for draft: ${desk.qualified ? "yes" : "no"}`,
            `- Relevance hits: ${desk.relevance}`,
            desk.duplicate ? `- Duplicate class: ${desk.duplicate.classification}` : "- Duplicate class: n/a",
            desk.factCheck ? `- Fact-check: ${desk.factCheck.status} (score ${desk.factCheck.score})` : "- Fact-check: n/a",
            `- Reason: ${desk.reason}`,
            desk.candidate?.slug ? `- Slug: \`${desk.candidate.slug}\`` : "- Slug: —",
            "",
        );
    }

    lines.push(
        "## Blog",
        `- Disposition: **${summary.blog.disposition}**`,
        `- Qualified for draft: ${summary.blog.qualified ? "yes" : "no"}`,
        `- Reason: ${summary.blog.reason}`,
        summary.blog.candidate?.slug ? `- Slug: \`${summary.blog.candidate.slug}\`` : "- Slug: —",
        "",
        "### Content-gap hints (not drafts)",
        ...(summary.blog.gaps || []).map(
            (gap) => `- [${gap.type}] ${gap.reason}${gap.relatedNewsSlug ? ` (news: \`${gap.relatedNewsSlug}\`)` : ""}`,
        ),
        "",
    );

    return `${lines.join("\n")}\n`;
}

export function loadResearchSummary(dateIso) {
    const jsonPath = path.join(EDITORIAL_REPORTS_DIR, `${dateIso}-research.json`);
    if (!existsSync(jsonPath)) return null;
    return JSON.parse(readFileSync(jsonPath, "utf8"));
}
