#!/usr/bin/env node
/**
 * Detect near-duplicate News/Blog body content for paired major-news batches.
 *
 * Usage:
 *   node scripts/test-news-blog-differentiation.mjs
 *   node scripts/test-news-blog-differentiation.mjs --threshold=0.35
 */

import { getPublishedBlogPosts } from "../src/data/blogPosts.js";
import { getPublicNewsStories } from "../src/data/newsPosts.js";

const threshold = Number(
    (process.argv.find((a) => a.startsWith("--threshold=")) || "--threshold=0.35").split("=")[1],
);

/** @type {Array<[string, string]>} */
const PAIRS = [
    [
        "anthropic-claude-models-breached-three-organizations-security-tests",
        "what-claude-security-test-breaches-mean-for-ai-agent-governance",
    ],
    [
        "kentucky-paducah-100-billion-ai-data-center-energy-complex",
        "why-ai-data-centers-are-moving-to-former-industrial-sites",
    ],
    [
        "mediatek-five-billion-financing-ai-data-center-chips",
        "custom-ai-chips-next-major-semiconductor-market",
    ],
    [
        "nvidia-sk-group-500-billion-ai-data-center-memory-initiative",
        "ai-race-memory-power-data-center-campuses",
    ],
    [
        "meta-blackrock-14-billion-el-paso-ai-data-center-venture",
        "how-big-tech-is-financing-the-ai-infrastructure-boom",
    ],
];

function normalize(text = "") {
    return String(text)
        .toLowerCase()
        .replace(/https?:\/\/\S+/g, " ")
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function sentences(text = "") {
    return normalize(text)
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter((s) => s.split(" ").length >= 8);
}

function newsBody(story) {
    const parts = [story.summary, story.whyItMatters, story.dek];
    for (const section of story.sections || []) {
        parts.push(section.heading || "");
        for (const para of section.body || []) parts.push(para);
    }
    return parts.filter(Boolean).join("\n");
}

function blogBody(post) {
    const parts = [post.excerpt];
    for (const section of post.content || []) {
        parts.push(section.heading || "");
        parts.push(section.body || "");
    }
    return parts.filter(Boolean).join("\n");
}

function jaccardSentences(aText, bText) {
    const a = new Set(sentences(aText));
    const b = new Set(sentences(bText));
    if (!a.size || !b.size) return 1;
    let inter = 0;
    for (const s of a) if (b.has(s)) inter += 1;
    const union = a.size + b.size - inter;
    return inter / union;
}

function tokenOverlap(aText, bText) {
    const aTokens = normalize(aText).split(" ").filter(Boolean);
    const bSet = new Set(normalize(bText).split(" ").filter(Boolean));
    if (!aTokens.length) return 1;
    let hit = 0;
    for (const t of aTokens) if (bSet.has(t)) hit += 1;
    return hit / aTokens.length;
}

const newsBySlug = new Map(getPublicNewsStories().map((s) => [s.slug, s]));
const blogBySlug = new Map(getPublishedBlogPosts().map((p) => [p.slug, p]));

let failed = 0;
const rows = [];

for (const [newsSlug, blogSlug] of PAIRS) {
    const news = newsBySlug.get(newsSlug);
    const blog = blogBySlug.get(blogSlug);
    if (!news || !blog) {
        failed += 1;
        rows.push({ newsSlug, blogSlug, error: !news ? "missing news" : "missing blog" });
        continue;
    }

    const nBody = newsBody(news);
    const bBody = blogBody(blog);
    const identical = normalize(nBody) === normalize(bBody);
    const sentenceSim = jaccardSentences(nBody, bBody);
    const overlap = tokenOverlap(nBody, bBody);
    const headlineSame = normalize(news.title) === normalize(blog.title);
    const ok =
        !identical &&
        !headlineSame &&
        sentenceSim < threshold &&
        overlap < 0.85;

    if (!ok) failed += 1;
    rows.push({
        newsSlug,
        blogSlug,
        identical,
        headlineSame,
        sentenceSim: Number(sentenceSim.toFixed(3)),
        tokenOverlap: Number(overlap.toFixed(3)),
        ok,
    });
}

console.log(`News/Blog differentiation check (sentence Jaccard < ${threshold})`);
for (const row of rows) {
    if (row.error) {
        console.log(`FAIL  ${row.newsSlug} <-> ${row.blogSlug}: ${row.error}`);
        continue;
    }
    const mark = row.ok ? "PASS" : "FAIL";
    console.log(
        `${mark}  ${row.newsSlug}\n      blog=${row.blogSlug}\n      sentenceJaccard=${row.sentenceSim} tokenOverlap=${row.tokenOverlap} identical=${row.identical} sameHeadline=${row.headlineSame}`,
    );
}

if (failed) {
    console.error(`\n${failed} pair(s) failed differentiation checks.`);
    process.exit(1);
}

console.log(`\nAll ${rows.length} pairs passed differentiation checks.`);
