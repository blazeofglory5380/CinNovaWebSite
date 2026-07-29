#!/usr/bin/env node
/**
 * Phase 10A — human review summary for the daily batch.
 *
 * Usage:
 *   npm run editorial:review
 *   npm run editorial:review -- --date=2026-07-29
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { resolveDateIso } from "./lib/editorial-cli.mjs";
import { loadNewsDrafts } from "./lib/news-editorial.mjs";
import { loadBlogDrafts, ensureReportsDir, EDITORIAL_REPORTS_DIR } from "./lib/blog-editorial.mjs";
import { classifyNewsCandidate } from "./lib/editorial-dedupe.mjs";
import { scoreNewsFactCheck, scoreBlogFactCheck } from "./lib/editorial-factcheck.mjs";
import { auditDraftSeo } from "./lib/editorial-seo.mjs";
import { resolveNewsHero, resolveBlogHero } from "./lib/editorial-heroes.mjs";

const dateIso = resolveDateIso();
const dailyReport = path.join(EDITORIAL_REPORTS_DIR, `${dateIso}.md`);
const researchPath = path.join(EDITORIAL_REPORTS_DIR, `${dateIso}-research.md`);

const news = loadNewsDrafts();
const blogs = loadBlogDrafts();

const items = [];
for (const draft of news) {
    const duplicate = classifyNewsCandidate(draft, { excludeSlug: draft.slug });
    const fact = scoreNewsFactCheck(draft, { duplicateClassification: duplicate.classification });
    const seo = auditDraftSeo(draft, "news");
    const hero = resolveNewsHero(draft);
    items.push({
        kind: "news",
        slug: draft.slug,
        status: fact.status,
        blocked: fact.blockedFromPublish,
        seoOk: seo.ok,
        hero: hero.status,
        title: draft.title,
    });
}
for (const draft of blogs) {
    const fact = scoreBlogFactCheck(draft);
    const seo = auditDraftSeo(draft, "blog");
    const hero = resolveBlogHero(draft);
    items.push({
        kind: "blog",
        slug: draft.slug,
        status: fact.status,
        blocked: fact.blockedFromPublish,
        seoOk: seo.ok,
        hero: hero.status,
        title: draft.title,
    });
}

const ready = items.filter((item) => item.status === "READY");
const review = items.filter((item) => item.status === "REVIEW");
const hold = items.filter((item) => item.status === "HOLD");
const reject = items.filter((item) => item.status === "REJECT");

ensureReportsDir();
const outPath = path.join(EDITORIAL_REPORTS_DIR, `${dateIso}-review.md`);
const md = `# CinNova editorial review — ${dateIso}

## Readiness counts
- READY: ${ready.length}
- REVIEW: ${review.length}
- HOLD: ${hold.length}
- REJECT: ${reject.length}

## Items
${items
    .map(
        (item) =>
            `- **${item.status}** ${item.kind} \`${item.slug}\` — ${item.title || "(untitled)"} · SEO=${item.seoOk ? "ok" : "issues"} · hero=${item.hero}${item.blocked ? " · blocked from publish" : ""}`,
    )
    .join("\n") || "- (no drafts)"}

## Linked artifacts
- Daily report: ${existsSync(dailyReport) ? `\`${dailyReport}\`` : "(missing)"}
- Research: ${existsSync(researchPath) ? `\`${researchPath}\`` : "(missing)"}

## Reviewer checklist
1. Confirm every READY claim against primary sources.
2. Do not publish HOLD items.
3. Replace IMAGE REQUIRED heroes before publish.
4. Preview DEV routes; run publish dry-runs.
5. Open Draft PR via \`editorial:prepare-pr\` only when material is ready.
`;

writeFileSync(outPath, md, "utf8");

console.log(`\nEditorial review summary for ${dateIso}`);
console.log(`READY=${ready.length} REVIEW=${review.length} HOLD=${hold.length} REJECT=${reject.length}`);
console.log(`Report: ${outPath}`);
if (existsSync(dailyReport)) {
    console.log(`Daily report present (${readFileSync(dailyReport, "utf8").split("\n").length} lines)`);
}
process.exit(0);
