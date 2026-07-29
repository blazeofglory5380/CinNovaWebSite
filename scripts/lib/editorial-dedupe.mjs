/**
 * Duplicate / story-evolution detection for CinNova News (Phase 10A).
 *
 * Classifications:
 *   NEW STORY | FOLLOW-UP | UPDATE | DUPLICATE
 *
 * Never invents events — only compares candidate text against catalog + drafts + reports.
 */

import { readdirSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { newsPosts } from "../../src/data/newsPosts.js";
import { loadNewsDrafts } from "./news-editorial.mjs";
import { EDITORIAL_REPORTS_DIR } from "./blog-editorial.mjs";

const STOP = new Set([
    "a", "an", "the", "and", "or", "of", "to", "in", "on", "for", "with", "by", "at",
    "from", "as", "is", "are", "was", "were", "be", "been", "its", "their", "new",
    "says", "said", "after", "over", "into", "about", "will", "can", "may",
]);

export function normalizeHeadline(value = "") {
    return String(value)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

export function tokenize(value = "") {
    return normalizeHeadline(value)
        .split(" ")
        .filter((token) => token.length > 2 && !STOP.has(token));
}

export function jaccard(aTokens, bTokens) {
    const a = new Set(aTokens);
    const b = new Set(bTokens);
    if (!a.size || !b.size) return 0;
    let inter = 0;
    for (const token of a) if (b.has(token)) inter += 1;
    return inter / (a.size + b.size - inter);
}

function extractEntities(text = "") {
    const tokens = tokenize(text);
    // Prefer longer tokens as weak entity proxies (companies, places, topics).
    return tokens.filter((t) => t.length >= 5);
}

/**
 * Load recent editorial report text for soft duplicate signals.
 */
export function loadRecentReportText(limit = 14) {
    if (!existsSync(EDITORIAL_REPORTS_DIR)) return [];
    return readdirSync(EDITORIAL_REPORTS_DIR)
        .filter((name) => /^\d{4}-\d{2}-\d{2}\.md$/.test(name))
        .sort()
        .reverse()
        .slice(0, limit)
        .map((name) => ({
            name,
            text: readFileSync(path.join(EDITORIAL_REPORTS_DIR, name), "utf8"),
        }));
}

/**
 * Compare a news candidate against published + draft inventory.
 * @returns {{ classification: string, score: number, matches: object[], rationale: string }}
 */
export function classifyNewsCandidate(candidate = {}, options = {}) {
    const slug = String(candidate.slug || "").trim();
    const title = String(candidate.title || "").trim();
    const location = String(candidate.location || "").trim();
    const titleNorm = normalizeHeadline(title);
    const titleTokens = tokenize(title);
    const entityTokens = extractEntities(`${title} ${location} ${candidate.dek || ""} ${candidate.summary || ""}`);

    const catalog = options.catalog || newsPosts;
    const drafts = options.drafts || loadNewsDrafts();
    const corpus = [
        ...catalog.map((story) => ({ ...story, __surface: "published" })),
        ...drafts.map((story) => ({ ...story, __surface: "draft" })),
    ];

    const matches = [];

    for (const story of corpus) {
        if (options.excludeSlug && story.slug === options.excludeSlug) continue;
        if (slug && story.slug === slug) {
            matches.push({
                slug: story.slug,
                surface: story.__surface,
                kind: "exact-slug",
                similarity: 1,
            });
            continue;
        }

        const otherTitle = normalizeHeadline(story.title || "");
        if (titleNorm && otherTitle && titleNorm === otherTitle) {
            matches.push({
                slug: story.slug,
                surface: story.__surface,
                kind: "exact-headline",
                similarity: 1,
            });
            continue;
        }

        const sim = jaccard(titleTokens, tokenize(story.title || ""));
        const entitySim = jaccard(
            entityTokens,
            extractEntities(`${story.title || ""} ${story.location || ""} ${story.dek || ""}`),
        );
        const sameLocation =
            location &&
            story.location &&
            normalizeHeadline(location) === normalizeHeadline(story.location);

        if (sim >= 0.72 || (sim >= 0.45 && entitySim >= 0.5 && sameLocation)) {
            matches.push({
                slug: story.slug,
                surface: story.__surface,
                kind: sim >= 0.72 ? "near-duplicate-headline" : "same-event-signal",
                similarity: Number(Math.max(sim, entitySim).toFixed(3)),
            });
        } else if (sim >= 0.4 && entitySim >= 0.35) {
            matches.push({
                slug: story.slug,
                surface: story.__surface,
                kind: "possible-follow-up",
                similarity: Number(Math.max(sim, entitySim).toFixed(3)),
            });
        }
    }

    // Soft check against recent reports (titles appearing in prior prep).
    const reports = options.reports || loadRecentReportText();
    for (const report of reports) {
        if (!titleNorm || titleNorm.length < 12) continue;
        if (report.text.toLowerCase().includes(titleNorm.slice(0, 48))) {
            matches.push({
                slug: report.name,
                surface: "report",
                kind: "seen-in-recent-report",
                similarity: 0.5,
            });
        }
    }

    matches.sort((a, b) => b.similarity - a.similarity);
    const top = matches[0];

    if (!title) {
        return {
            classification: "REJECT",
            score: 0,
            matches,
            rationale: "Missing headline — cannot classify.",
        };
    }

    if (top?.kind === "exact-slug" || top?.kind === "exact-headline" || top?.kind === "near-duplicate-headline") {
        return {
            classification: "DUPLICATE",
            score: top.similarity,
            matches,
            rationale: `Matches existing ${top.surface} item \`${top.slug}\` (${top.kind}). Do not republish the same event.`,
        };
    }

    if (top?.kind === "same-event-signal") {
        return {
            classification: "UPDATE",
            score: top.similarity,
            matches,
            rationale: `Likely same underlying event as \`${top.slug}\`. Prefer an UPDATE/FOLLOW-UP only if there is a material new development.`,
        };
    }

    if (top?.kind === "possible-follow-up" || top?.kind === "seen-in-recent-report") {
        return {
            classification: "FOLLOW-UP",
            score: top.similarity,
            matches,
            rationale: `Related to prior coverage (\`${top.slug}\`). Allow only if the candidate adds a verified new development.`,
        };
    }

    return {
        classification: "NEW STORY",
        score: 1,
        matches,
        rationale: "No strong duplicate/near-duplicate signals against catalog, drafts, or recent reports.",
    };
}
