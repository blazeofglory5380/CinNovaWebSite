#!/usr/bin/env node
/**
 * Phase 4 — coverage, Blog Engine, draft modes, draft safety, commercial boundary,
 * hero provenance, translation integrity, multi-day metrics (fixture / no invent).
 */
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { buildCoverageMatrix, classifyReadyPotential } from "./editorial/research/sourceCoverage.mjs";
import { getActiveSources } from "./editorial/research/sourceRegistry.mjs";
import {
    EDITORIAL_MODES,
    mayWriteDraftFile,
    resolveEditorialMode,
    draftVisibilityContract,
} from "./editorial/research/editorialModes.mjs";
import { resolveAutomationExecutionMode } from "./editorial/research/scheduleMode.mjs";
import { buildBlogContentCalendar, BLOG_ENGINE_CATEGORIES } from "./editorial/research/blogEngine.mjs";
import { qualifyBlogCluster } from "./editorial/research/blogEvergreen.mjs";
import {
    assertCommercialBoundary,
    buildCommercialCtas,
} from "./editorial/research/commercialBoundary.mjs";
import {
    assertCatalogExcludesDrafts,
    assertDraftNeverPublic,
    assertHoldNeverWritten,
} from "./editorial/research/draftSafety.mjs";
import {
    buildHeroImageRecord,
    HERO_IMAGE_KINDS,
} from "./editorial/research/heroImagePipeline.mjs";
import {
    canTransitionTranslationStatus,
    createTranslationJobs,
    transitionTranslationStatus,
} from "./editorial/research/translationQueue.mjs";
import { buildDailyOperationsReport } from "./editorial/research/dailyOpsReport.mjs";
import { loadShadowMetrics, recordShadowRun, summarizeShadowMetrics } from "./editorial/research/shadowMetrics.mjs";
import { scoreBlogFactCheck } from "./lib/editorial-factcheck.mjs";

// ── Scheduler remains SHADOW ───────────────────────────────────────────────
{
    const schedule = resolveAutomationExecutionMode({ eventName: "schedule", allowDraftPrInput: "true" });
    assert.equal(schedule.mode, EDITORIAL_MODES.SHADOW);
    assert.equal(schedule.shadow, true);
    assert.equal(schedule.writeDraftFiles, false);
    assert.equal(schedule.autoPublish, false);
    assert.equal(schedule.publish, false);

    const blockedPublish = resolveEditorialMode({
        eventName: "workflow_dispatch",
        modeInput: "PUBLISH",
        allowPublishInput: "true",
    });
    assert.equal(blockedPublish.mode, EDITORIAL_MODES.SHADOW);
    assert.equal(blockedPublish.failClosed, true);

    const blockedAuto = resolveEditorialMode({
        eventName: "workflow_dispatch",
        modeInput: "AUTO_PUBLISH",
        allowAutoPublishInput: "true",
    });
    assert.equal(blockedAuto.mode, EDITORIAL_MODES.SHADOW);
}

// ── DRAFT capability prepared but HOLD never written ───────────────────────
{
    assert.equal(mayWriteDraftFile("READY"), true);
    assert.equal(mayWriteDraftFile("REVIEW"), true);
    assert.equal(mayWriteDraftFile("HOLD"), false);
    assert.equal(mayWriteDraftFile("REJECT"), false);
    assert.equal(assertHoldNeverWritten("HOLD").ok, true);

    const draft = {
        isDraft: true,
        isPublished: false,
        status: "draft",
        title: "Shadow draft",
    };
    assert.equal(assertDraftNeverPublic(draft).ok, true);
    assert.equal(draftVisibilityContract(draft).includeInSitemap, false);
    assert.equal(draftVisibilityContract(draft).includeInRss, false);
    assert.equal(draftVisibilityContract(draft).includeInSearch, false);
}

// ── Catalog / sitemap / search exclude drafts ──────────────────────────────
{
    const catalog = assertCatalogExcludesDrafts();
    assert.equal(catalog.ok, true, catalog.issues.join("; "));
    assert.equal(catalog.surfaces.sitemapUsesPublishedOnly, true);
    assert.equal(catalog.surfaces.rssExcludesDrafts, true);
    assert.equal(catalog.surfaces.searchExcludesDrafts, true);
}

// ── Blog evergreen freshness behavior ──────────────────────────────────────
{
    const cluster = {
        canonicalTopic: "NIST AI Risk Management Framework guidance for businesses",
        sources: [{
            sourceId: "nist-news",
            sourceName: "NIST News",
            sourceTier: "TIER_1_PRIMARY",
            headline: "NIST AI Risk Management Framework guidance",
            summary: "NIST published AI Risk Management Framework guidance for organizations.",
            articleUrl: "https://www.nist.gov/news-events/news/ai-rmf",
            publishedAt: "2026-01-01T00:00:00.000Z",
        }],
        freshness: "BACKGROUND",
        relevance: 3,
        topics: ["ai"],
        cinovaClassification: "NEW",
        route: { route: "BLOG" },
    };
    const qual = qualifyBlogCluster(cluster);
    assert.equal(qual.freshnessRequired, false);
    assert.equal(qual.qualified, true);

    const sourced = scoreBlogFactCheck({
        title: "What NIST AI guidance means for businesses",
        classification: "evergreen",
        seoTitle: "What NIST AI guidance means for businesses",
        seoDescription: "Sourced explainer on NIST AI guidance.",
        sources: [{ publisher: "NIST", url: "https://www.nist.gov/news-events/news/ai-rmf" }],
        content: [
            { heading: "Overview", body: "NIST published AI Risk Management Framework guidance. ".repeat(8) },
            { heading: "Takeaways", body: "Businesses should map controls to the framework. ".repeat(8) },
            { heading: "Sources", body: "Treat NIST as the authoritative anchor. ".repeat(8) },
        ],
    });
    assert.equal(sourced.status, "READY", sourced.reasons.join("; "));
}

// ── Commercial / affiliate disclosure boundary ─────────────────────────────
{
    const meta = buildCommercialCtas({
        allowedTypes: ["subscribe_newsletter", "affiliate_recommendation", "explore_product"],
        products: [{ label: "StudyNest", path: "/studynest" }],
        affiliateRecommendations: [{ label: "Inactive affiliate example" }],
    });
    assert.equal(meta.rules.editorialConclusionsIndependentOfMonetization, true);
    assert.equal(meta.affiliateDisclosure.required, true);
    assert.equal(meta.affiliateDisclosure.activated, false);
    assert.equal(assertCommercialBoundary(meta).ok, true);

    const bad = {
        rules: { editorialConclusionsIndependentOfMonetization: false },
        ctas: [{ type: "affiliate_recommendation", influencesFacts: true, disclosureRequired: false }],
        sponsored: true,
        sponsoredLabel: null,
    };
    assert.equal(assertCommercialBoundary(bad).ok, false);
}

// ── Hero image provenance ──────────────────────────────────────────────────
{
    const ok = buildHeroImageRecord({
        kind: HERO_IMAGE_KINDS.AI_GENERATED_ILLUSTRATION,
        articleSlug: "demo",
        aiLabeled: true,
        isDocumentaryPhotography: false,
    });
    assert.equal(ok.ok, true);
    assert.equal(ok.record.provenance.aiLabelRequired, true);

    const bad = buildHeroImageRecord({
        kind: HERO_IMAGE_KINDS.AI_GENERATED_ILLUSTRATION,
        articleSlug: "demo",
        isDocumentaryPhotography: true,
    });
    assert.equal(bad.ok, false);
}

// ── Translation status integrity ───────────────────────────────────────────
{
    const jobs = createTranslationJobs({ slug: "demo-article" });
    assert.equal(jobs.find((j) => j.locale === "en").status, "AI_DRAFT");
    assert.equal(jobs.find((j) => j.locale === "es").status, "MISSING");
    assert.equal(jobs.every((j) => j.mayAddFacts === false), true);
    assert.equal(canTransitionTranslationStatus("MISSING", "AI_DRAFT"), true);
    assert.equal(canTransitionTranslationStatus("MISSING", "PUBLISHED"), false);
    const illegal = transitionTranslationStatus(jobs[1], "PUBLISHED");
    assert.equal(illegal.ok, false);
}

// ── Coverage matrix + Blog calendar ────────────────────────────────────────
{
    assert.ok(getActiveSources().length >= 28);
    const matrix = buildCoverageMatrix();
    assert.ok(matrix.desks.length >= 10);
    assert.equal(classifyReadyPotential({ primary: 2, independentNews: 2 }), "STRONG");
    assert.equal(classifyReadyPotential({ primary: 0, independentNews: 0 }), "INSUFFICIENT");
    const calendar = buildBlogContentCalendar({ startDateIso: "2026-08-11", postsPerWeek: 3, days: 30 });
    assert.ok(calendar.articleCount >= 10);
    assert.ok(calendar.articles.every((a) => a.searchVolume === null));
    assert.ok(calendar.articles.every((a) => a.publishStatus === "PLAN_ONLY"));
    assert.ok(BLOG_ENGINE_CATEGORIES.includes("AI explainers"));
}

// ── Daily ops + multi-day metrics (real only) ──────────────────────────────
{
    const ops = buildDailyOperationsReport({
        dateIso: "2026-08-11",
        news: { ready: 0, review: 2 },
        blog: { ready: 0, review: 1 },
        publication: { draftsThatWouldBeCreated: 3 },
    });
    assert.equal(ops.shadowArticlesAreNotPublished, true);
    assert.equal(ops.publication.articlesEligibleToPublish, 0);

    const tmp = mkdtempSync(path.join(os.tmpdir(), "cinnova-shadow-metrics-"));
    try {
        const empty = loadShadowMetrics(tmp);
        assert.equal(empty.runs.length, 0);
        const first = recordShadowRun({ dateIso: "2026-08-11", readyNews: 0, reviewNews: 2 }, { reportsDir: tmp });
        assert.equal(first.ok, true);
        assert.equal(first.entry.invented, false);
        const again = recordShadowRun({ dateIso: "2026-08-11", readyNews: 0, reviewNews: 3 }, { reportsDir: tmp });
        assert.equal(again.store.runs.length, 1);
        assert.equal(again.store.runs[0].reviewNews, 3);
        const summary = summarizeShadowMetrics(again.store);
        assert.equal(summary.days, 1);
    } finally {
        rmSync(tmp, { recursive: true, force: true });
    }
}

console.log("test:editorial-phase4 passed");
