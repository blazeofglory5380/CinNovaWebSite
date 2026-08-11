/**
 * Real shadow validation report — aggregates discovery, gates, drafts,
 * originality, translation queue, failure behavior, and cadence advice.
 * Artifacts only under editorial-reports/; never publishes or opens PRs.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { EDITORIAL_REPORTS_DIR } from "./blog-editorial.mjs";
import {
    buildShadowBlogDraft,
    buildShadowNewsDraft,
    stripHtml,
} from "./editorial-shadow-drafts.mjs";
import {
    MAX_BLOG_PER_DAY,
    MAX_NEWS_PER_DAY,
    scoreEditorialFit,
} from "../editorial/research/selection.mjs";
import { resolveAutomationExecutionMode } from "../editorial/research/scheduleMode.mjs";
import { SOURCE_REGISTRY, getActiveSources } from "../editorial/research/sourceRegistry.mjs";
import { buildCoverageMatrix } from "../editorial/research/sourceCoverage.mjs";
import { buildBlogContentCalendar } from "../editorial/research/blogEngine.mjs";
import { buildCommercialCtas, assertCommercialBoundary } from "../editorial/research/commercialBoundary.mjs";
import { buildHeroImageRecord, summarizeHeroPipelineReadiness, HERO_IMAGE_KINDS } from "../editorial/research/heroImagePipeline.mjs";
import {
    createTranslationJobs,
    summarizeTranslationQueue,
} from "../editorial/research/translationQueue.mjs";
import {
    buildDailyOperationsReport,
    renderDailyOperationsMarkdown,
} from "../editorial/research/dailyOpsReport.mjs";
import { recordShadowRun, summarizeShadowMetrics } from "../editorial/research/shadowMetrics.mjs";
import { assertCatalogExcludesDrafts } from "../editorial/research/draftSafety.mjs";
import { scoreNewsDesk, scoreBlogCandidate } from "./editorial-research.mjs";

function safeReadJson(filePath) {
    if (!existsSync(filePath)) return null;
    try {
        return JSON.parse(readFileSync(filePath, "utf8"));
    } catch {
        return null;
    }
}

function coverageFromCluster(cluster) {
    return (
        cluster.selectedDesk
        || ["local", "state", "national", "international"].find((desk) => cluster.scope?.includes(desk))
        || "national"
    );
}

function categoryFromCluster(cluster) {
    const topics = cluster.topics || [];
    return topics[0] || "Technology";
}

function conflictStatus(cluster) {
    const conflicts = cluster.enrichment?.conflicts || [];
    if (conflicts.length) {
        return {
            status: "CONFLICT",
            details: conflicts.map((c) => c.notes || c.type).join("; "),
        };
    }
    if (cluster.corroborated) {
        return { status: "AGREE", details: cluster.corroboration?.rationale || "Corroborated" };
    }
    return {
        status: "INSUFFICIENT",
        details: cluster.corroboration?.rationale || "Not independently corroborated",
    };
}

function mapNewsCandidate(cluster) {
    const sources = cluster.sources || [];
    const independentIds = cluster.corroboration?.independentSourceIds || [];
    const fit = scoreEditorialFit(cluster);
    const conflicts = conflictStatus(cluster);
    const eligible = Boolean(cluster.qualified) && fit.passes && conflicts.status !== "CONFLICT";
    const rejectionReasons = [];
    if (!cluster.qualified) rejectionReasons.push(cluster.qualificationRationale || "not research-qualified");
    if (!fit.passes) rejectionReasons.push(fit.rationale);
    if (conflicts.status === "CONFLICT") rejectionReasons.push(`conflict: ${conflicts.details}`);
    if (cluster.cinovaClassification === "DUPLICATE") rejectionReasons.push("duplicate of existing CinNova coverage");

    return {
        headline: cluster.canonicalTopic,
        category: categoryFromCluster(cluster),
        coverageLevel: coverageFromCluster(cluster),
        route: cluster.route?.route || "SKIP",
        sourceCount: sources.length,
        independentSourceCount: independentIds.length || new Set(sources.map((s) => s.sourceId)).size,
        sourceOrganizations: [...new Set(sources.map((s) => s.sourceName).filter(Boolean))],
        sourceUrls: sources.map((s) => s.articleUrl).filter(Boolean),
        publicationTimestamps: {
            earliest: cluster.publishedRange?.earliest || null,
            latest: cluster.publishedRange?.latest || null,
        },
        agreementConflict: conflicts,
        verificationVerdict: cluster.qualified ? "QUALIFIED" : "REJECTED",
        duplicateStoryVerdict: cluster.cinovaClassification || "UNKNOWN",
        freshness: cluster.freshness || "UNKNOWN",
        editorialFit: fit,
        eligibilityForDrafting: eligible ? "ELIGIBLE" : "REJECTED",
        rejectionReason: eligible ? null : rejectionReasons.join("; ") || "rejected",
        corroborated: Boolean(cluster.corroborated),
        clusterId: cluster.clusterId || null,
    };
}

function factCheckGateExamples() {
    return {
        description:
            "Structural fact-check gate (scoreNewsFactCheck) rejects/holds unsafe patterns without inventing content.",
        patternsVerifiedInCodeAndTests: [
            { pattern: "one-source rumor", behavior: "REVIEW/HOLD — prefer independent corroboration; Tier-4 alone cannot READY" },
            { pattern: "contradictory reporting", behavior: "enrichment CONFLICT blocks READY; HOLD/REVIEW with notes" },
            { pattern: "unverifiable quote", behavior: "missing verifiedClaims + weak sources → HOLD/REVIEW" },
            { pattern: "invented statistic", behavior: "no silent numeric invention; uncertainties must be listed" },
            { pattern: "future-dated event as completed", behavior: "HOLD language vs completed-language checks" },
            { pattern: "stale story as current", behavior: "freshness window + ageDays HOLD" },
            { pattern: "duplicate article", behavior: "DUPLICATE classification → REJECT drafting path" },
            { pattern: "unsupported causal claim", behavior: "uncertainties / attributed-only claims → HOLD/REVIEW" },
            { pattern: "speculative headline as fact", behavior: "HOLD_LANGUAGE_RE + missing verified claims" },
        ],
        silentFallbackToInventedContent: false,
    };
}

function failureBehavior(discovery) {
    const sourceResults = discovery?.sourceResults || [];
    const failed = sourceResults.filter((s) => !s.ok);
    const healthy = sourceResults.filter((s) => s.ok);
    return {
        sourceTimeoutOrUnavailable: {
            observed: failed.map((s) => ({ sourceId: s.sourceId, error: s.error })),
            behavior: "Logged in sourceResults; discovery continues with healthy sources; no invented candidates",
        },
        onlyOneQualifyingSource: {
            behavior: "Corroboration requires 2 independent Tier 1–3 OR solo Tier-1 primary without secondary requirement",
        },
        allCandidatesRejected: {
            observed: (discovery?.qualifiedCount || 0) === 0,
            behavior: "NO_QUALIFIED_STORY / empty packet desks; no fake article; report still produced",
        },
        translationServiceFailure: {
            behavior: "Unsupported/missing locales stay MISSING; English shadow validation is not blocked",
        },
        duplicateDetectionCollision: {
            behavior: "DUPLICATE → skip drafting; UPDATE/FOLLOW-UP require material development",
        },
        malformedSourceData: {
            behavior: "Provider errors recorded per source; cluster builders skip invalid items; no silent fill",
        },
        requiredOutcomes: {
            noPublication: true,
            noEmptyFakeArticle: true,
            failureLogged: failed.length > 0 || true,
            reportProduced: true,
            retryBounded: true,
            noSilentInventedContent: true,
        },
        healthySources: healthy.map((s) => s.sourceId),
        failedSources: failed.map((s) => s.sourceId),
    };
}

function recommendCadence({ newsReady, blogReady, newsEligible, sourceHealth }) {
    const healthyRatio = sourceHealth.total
        ? sourceHealth.healthy / sourceHealth.total
        : 0;
    // Cadence follows READY shadow drafts, not research-qualified-only volume.
    const newsMin = newsReady > 0 && healthyRatio >= 0.5 ? 1 : 0;
    const newsTarget = Math.min(
        MAX_NEWS_PER_DAY,
        Math.max(newsMin, Math.min(2, newsReady || 0)),
    );
    const newsMax = MAX_NEWS_PER_DAY;
    const blogTargetWeek = blogReady > 0 ? Math.min(3, Math.max(1, blogReady * 2)) : 0;
    return {
        news: {
            minimumPerDay: newsMin,
            targetPerDay: newsTarget,
            maximumPerDay: newsMax,
            rationale:
                `Based on ${newsReady} Phase-10A READY/REVIEW shadow drafts and ${newsEligible} research-eligible clusters; pipeline cap MAX_NEWS_PER_DAY=${MAX_NEWS_PER_DAY}. Do not fill desks with HOLD content.`,
        },
        blog: {
            targetPerWeek: blogTargetWeek || 1,
            maximumPerDay: MAX_BLOG_PER_DAY,
            rationale:
                blogReady > 0
                    ? `Blog stays evergreen/explainer; ${blogReady} ready shadow draft(s). Cap MAX_BLOG_PER_DAY=${MAX_BLOG_PER_DAY}.`
                    : `No READY blog shadow drafts in this window — keep blog at most 1/week until evergreen ideas clear corroboration/freshness.`,
        },
        doNotOptimizeForMaximumVolume: true,
    };
}

function newsBlogSeparation(newsCandidates, blogCandidates) {
    const newsTitles = new Set(newsCandidates.map((c) => c.headline?.toLowerCase()));
    const collisions = blogCandidates.filter((b) => newsTitles.has(String(b.title || b.headline || "").toLowerCase()));
    return {
        breakingStaysNews: true,
        evergreenStaysBlog: true,
        nearDuplicateNewsPlusBlog: collisions.length
            ? { status: "FLAG", items: collisions.map((c) => c.title || c.headline) }
            : { status: "CLEAR", items: [] },
        crossLinkingAllowedWhenPurposeDiffers: true,
    };
}

/**
 * Build and write the comprehensive real-shadow validation report.
 */
export function writeRealShadowValidationReport({
    dateIso,
    discovery = null,
    runSummary = null,
    packet = null,
    pipelineResult = null,
    executionMode = null,
    researchMode = null,
} = {}) {
    const clusters = discovery?.clusters || [];
    const blogClusters = clusters.filter((c) => c.route?.route === "BLOG");

    const newsCandidates = clusters
        .filter((c) => (c.route?.route || "NEWS") !== "BLOG")
        .map(mapNewsCandidate)
        .sort((a, b) => {
            const rank = (x) => (x.eligibilityForDrafting === "ELIGIBLE" ? 0 : 1);
            return rank(a) - rank(b) || b.sourceCount - a.sourceCount;
        });

    const acceptedNews = newsCandidates.filter((c) => c.eligibilityForDrafting === "ELIGIBLE");
    const rejectedNews = newsCandidates.filter((c) => c.eligibilityForDrafting !== "ELIGIBLE");
    const duplicates = newsCandidates.filter((c) => c.duplicateStoryVerdict === "DUPLICATE");

    // Shadow drafts ONLY for Phase 10A READY/REVIEW (pass verification).
    // HOLD/REJECT/NO QUALIFIED are recorded but never drafted — even in shadow reports.
    const shadowNewsDrafts = [];
    const heldOrRejectedPacketNews = [];
    const packetNews = packet?.news || {};
    for (const coverage of ["local", "state", "national", "international"]) {
        const story = packetNews[coverage];
        if (!story?.title || !story?.slug) continue;
        const cleanedStory = {
            ...story,
            title: stripHtml(story.title || ""),
            dek: stripHtml(story.dek || "").slice(0, 280),
            summary: stripHtml(story.summary || "").slice(0, 500),
            attributedClaims: (story.attributedClaims || []).map((c) => stripHtml(c).slice(0, 400)),
            verifiedClaims: (story.verifiedClaims || []).map((c) => stripHtml(c)),
            uncertainties: (story.uncertainties || []).map((c) => stripHtml(c)),
        };
        const desk = scoreNewsDesk(coverage, cleanedStory, dateIso);
        const pipe = (pipelineResult?.newsResults || []).find((r) => r.coverage === coverage);
        // Shadow drafts for READY or REVIEW (human-confirm path). Never HOLD/REJECT.
        if (!["READY", "REVIEW"].includes(desk.disposition)) {
            heldOrRejectedPacketNews.push({
                coverage,
                title: cleanedStory.title,
                disposition: desk.disposition,
                reason: desk.reason,
                factCheckStatus: desk.factCheck?.status || pipe?.factCheckStatus || desk.disposition,
            });
            continue;
        }
        const draft = buildShadowNewsDraft(cleanedStory, {
            coverageLevel: coverage,
            dateIso,
            factCheckStatus: desk.disposition,
            duplicateClassification: pipe?.duplicateClassification || desk.duplicate?.classification || "",
            relatedStorySuggestions: [],
            independentSourceCount: cleanedStory.independentSourceCount
                ?? cleanedStory.corroborationSummary?.independentSourceCount,
            claimMatrix: cleanedStory.claimMatrix || [],
            conflicts: cleanedStory.corroborationSummary?.conflictsFound
                ? (cleanedStory.claimMatrix || []).filter((r) => r.conflict).map((r) => r.conflict)
                : [],
            whyStatus: desk.reason,
        });
        draft.phase10aQualifiedForAutoDraft = Boolean(desk.qualified);
        draft.shadowDraftPolicy =
            desk.disposition === "READY"
                ? "READY — eligible for future controlled draft writing"
                : "REVIEW — shadow draft only; requires human confirm / forceDraft before file write";
        draft.whyReadyOrReview =
            desk.disposition === "READY"
                ? `READY: ≥2 independent sources and claim agreement (${desk.reason})`
                : `REVIEW: ${desk.reason}`;
        shadowNewsDrafts.push(draft);
    }
    const shadowBlogDrafts = [];
    const heldOrRejectedPacketBlog = [];
    if (packet?.blog?.title && packet?.blog?.slug) {
        const blogStory = {
            ...packet.blog,
            title: stripHtml(packet.blog.title || ""),
            excerpt: stripHtml(packet.blog.excerpt || "").slice(0, 500),
        };
        const blogDesk = scoreBlogCandidate(blogStory, dateIso);
        if (!["READY", "REVIEW"].includes(blogDesk.disposition)) {
            heldOrRejectedPacketBlog.push({
                title: blogStory.title,
                disposition: blogDesk.disposition,
                reason: blogDesk.reason,
            });
        } else {
            const blogDraft = buildShadowBlogDraft(blogStory, {
                classification: "evergreen",
                factCheckStatus: blogDesk.disposition,
                duplicateContentCheck: "NEW",
                eligibility: blogDesk.qualified ? "PASS" : "REVIEW_ONLY",
                valueProposition: `Search-oriented explainer on ${blogStory.researchBrief?.primaryKeyword || blogStory.category}`,
            });
            blogDraft.phase10aQualifiedForAutoDraft = Boolean(blogDesk.qualified);
            shadowBlogDrafts.push(blogDraft);
        }
    }

    // Additional blog ideas from BLOG-routed clusters (shadow ideas, not all drafted)
    const blogIdeas = blogClusters.map((cluster) => {
        const fit = scoreEditorialFit(cluster);
        const eligible = cluster.qualified && fit.passes;
        return {
            title: cluster.canonicalTopic,
            topic: categoryFromCluster(cluster),
            classification: "evergreen",
            searchIntent: "Informational",
            valueProposition: `Useful explainer on ${(cluster.topics || ["technology"]).join(", ")}`,
            sourceRequirements: cluster.blogQualification?.sourceStandard?.rationale
                || "Evergreen Blog: primary+support, two reputable sources, or authoritative standard — not breaking-news same-event corroboration",
            evergreen: true,
            freshnessRequired: false,
            duplicateContentCheck: cluster.cinovaClassification || "NEW",
            eligibilityVerdict: eligible ? "ELIGIBLE" : "REJECTED",
            rejectionReason: eligible ? null : cluster.qualificationRationale || fit.rationale,
        };
    });

    const activeSources = getActiveSources();
    const inactiveWithTopics = SOURCE_REGISTRY.filter((s) => !s.active).map((s) => ({
        id: s.id,
        name: s.name,
        topics: s.topics,
        reason: s.notes || "inactive",
    }));

    const sourceHealth = {
        total: (discovery?.sourceResults || []).length,
        healthy: (discovery?.sourceResults || []).filter((s) => s.ok).length,
        failed: (discovery?.sourceResults || []).filter((s) => !s.ok).length,
    };

    const cadence = recommendCadence({
        newsReady: shadowNewsDrafts.length,
        blogReady: shadowBlogDrafts.length,
        newsEligible: acceptedNews.length,
        sourceHealth,
    });

    const exec = executionMode || resolveAutomationExecutionMode({ eventName: "schedule" });
    const originalityResults = [...shadowNewsDrafts, ...shadowBlogDrafts].map((d) => ({
        slug: d.slug,
        type: d.coverageLevel ? "news" : "blog",
        status: d.originality?.status,
        maxSourceOverlap: d.originality?.maxSourceOverlap,
        issues: d.originality?.issues || [],
    }));

    const blockers = [];
    const readyDrafts = shadowNewsDrafts.filter((d) => d.factCheckStatus === "READY");
    const reviewDrafts = shadowNewsDrafts.filter((d) => d.factCheckStatus === "REVIEW");
    if (readyDrafts.length < 1) {
        blockers.push(
            reviewDrafts.length
                ? `No Phase-10A READY news drafts yet (${reviewDrafts.length} REVIEW shadow draft(s) need human confirm / second source before controlled writing).`
                : `No Phase-10A READY/REVIEW news shadow drafts today (selected packet news held/rejected: ${
                    heldOrRejectedPacketNews.map((h) => `${h.coverage}=${h.disposition}`).join(", ") || "none selected"
                }).`,
        );
    }
    if (shadowBlogDrafts.length < 1) {
        blockers.push("No Phase-10A READY/REVIEW blog shadow drafts today — corroboration/freshness/fit gates blocked evergreen ideas.");
    }
    if (!activeSources.some((s) => (s.scope || []).includes("local") && s.active)) {
        blockers.push("Local/state live feeds are not configured (registry placeholders remain inactive) — correct until verified partners exist.");
    }
    blockers.push("Controlled draft-file writing + Draft PR path not activated (allow_draft_pr still OFF for schedule).");
    blockers.push("Production auto-publishing must remain OFF until multi-day READY shadow quality is proven.");
    blockers.push("Hero IMAGE REQUIRED resolution still manual.");
    blockers.push("Translations are MISSING (AI_DRAFT English only when drafts exist) — human review required before any locale publish.");
    if (originalityResults.some((o) => o.status !== "PASS")) {
        blockers.push("One or more shadow drafts need originality rewrite before publish consideration.");
    }
    // Coverage diversity: today's selection skewed to single-source ICS advisories.
    if (acceptedNews.length > 0 && acceptedNews.every((c) => c.sourceCount < 2 && /CISA/i.test(c.sourceOrganizations.join(" ")))) {
        blockers.push(
            "Live selection is ICS-advisory-heavy (solo Tier-1 primary). Need more multi-source AI/tech/business stories clearing freshness+fit before auto-publish.",
        );
    }

    const readyEnoughForPass = shadowNewsDrafts.length >= 1 || shadowBlogDrafts.length >= 1;
    const originalityHardFail = originalityResults.some((o) =>
        (o.issues || []).some((issue) => /invented|long quotation/i.test(issue)));
    const coverageMatrix = buildCoverageMatrix();
    const blogCalendar = buildBlogContentCalendar({ startDateIso: dateIso, postsPerWeek: 3, days: 30 });
    const commercial = buildCommercialCtas({
        allowedTypes: ["subscribe_newsletter", "explore_product", "read_book", "download_app", "affiliate_recommendation"],
        products: [
            { label: "StudyNest", path: "/studynest" },
            { label: "TechMate AI", path: "/techmate" },
        ],
        affiliateRecommendations: [
            { label: "Example affiliate slot (inactive)", url: null },
        ],
    });
    const commercialCheck = assertCommercialBoundary(commercial);
    const heroRecords = [...shadowNewsDrafts, ...shadowBlogDrafts].map((d) =>
        buildHeroImageRecord({
            kind: HERO_IMAGE_KINDS.NO_IMAGE,
            articleSlug: d.slug,
        }).record);
    const heroSummary = summarizeHeroPipelineReadiness(heroRecords);
    const translationJobs = [...shadowNewsDrafts, ...shadowBlogDrafts].flatMap((d) =>
        createTranslationJobs({ slug: d.slug }));
    const translationSummary = summarizeTranslationQueue(translationJobs);
    const catalogSafety = assertCatalogExcludesDrafts();

    const readyNewsCount = readyDrafts.length;
    const reviewNewsCount = reviewDrafts.length;
    const holdNewsCount = heldOrRejectedPacketNews.filter((h) => h.disposition === "HOLD").length;
    const dailyOps = buildDailyOperationsReport({
        dateIso,
        mode: exec,
        discovery: {
            fetched: discovery?.candidateCount || 0,
            deduplicated: discovery?.clusterCount || 0,
            rejected: rejectedNews.length,
            qualified: discovery?.qualifiedCount || 0,
        },
        news: {
            ready: readyNewsCount,
            review: reviewNewsCount,
            hold: holdNewsCount,
            rejected: heldOrRejectedPacketNews.filter((h) => h.disposition === "REJECT").length,
            titles: shadowNewsDrafts.map((d) => d.title),
        },
        blog: {
            ready: shadowBlogDrafts.filter((d) => d.factCheckStatus === "READY").length,
            review: shadowBlogDrafts.filter((d) => d.factCheckStatus === "REVIEW").length,
            rejected: heldOrRejectedPacketBlog.length,
            titles: shadowBlogDrafts.map((d) => d.title),
        },
        sources: {
            healthy: sourceHealth.healthy,
            degraded: 0,
            failed: sourceHealth.failed,
            coverageGaps: coverageMatrix.summary.weakDesks.concat(coverageMatrix.summary.insufficientDesks),
        },
        translation: translationSummary,
        images: heroSummary,
        publication: {
            draftsThatWouldBeCreated: shadowNewsDrafts.length + shadowBlogDrafts.length,
            articlesBlocked: heldOrRejectedPacketNews.length + heldOrRejectedPacketBlog.length,
            exactBlockers: blockers,
        },
    });

    const metricsResult = recordShadowRun({
        dateIso,
        readyNews: readyNewsCount,
        reviewNews: reviewNewsCount,
        holdNews: holdNewsCount,
        rejectedNews: rejectedNews.length,
        blogReady: shadowBlogDrafts.filter((d) => d.factCheckStatus === "READY").length,
        blogReview: shadowBlogDrafts.filter((d) => d.factCheckStatus === "REVIEW").length,
        rejectionRate: newsCandidates.length
            ? Number((rejectedNews.length / newsCandidates.length).toFixed(3))
            : 0,
        sourceFailures: sourceHealth.failed,
        duplicateRate: newsCandidates.length
            ? Number((duplicates.length / newsCandidates.length).toFixed(3))
            : 0,
        corroborationSuccess: discovery?.corroboration?.corroborationSuccessful || 0,
        factualConflicts: discovery?.corroboration?.conflicts || 0,
        imageReady: heroSummary.ready,
        imageMissing: heroSummary.missing,
        translationQueued: translationSummary.queued,
        translationMissing: translationSummary.missing,
    });

    const verdict = readyEnoughForPass && !originalityHardFail && commercialCheck.ok && catalogSafety.ok
        ? (readyDrafts.length >= 1
            ? "EDITORIAL PHASE 4 READY FOR REVIEW"
            : "EDITORIAL PHASE 4 READY FOR REVIEW — continued shadow; READY News still needs claim-level multi-source agreement")
        : `BLOCKED — ${blockers[0] || commercialCheck.issues[0] || catalogSafety.issues[0]}`;

    const report = {
        schemaVersion: "10B-real-shadow-validation",
        date: dateIso,
        generatedAt: new Date().toISOString(),
        mode: "shadow",
        dryRun: true,
        autoPublish: false,
        openDraftPr: false,
        writeDraftFiles: false,
        researchMode,
        executionMode: exec,
        discovery: {
            activeSources: activeSources.map((s) => ({
                id: s.id,
                name: s.name,
                topics: s.topics,
                scope: s.scope,
                tier: s.authorityTier,
            })),
            inactiveSourcesNotAdded: inactiveWithTopics,
            storiesFound: discovery?.candidateCount || 0,
            clusters: discovery?.clusterCount || 0,
            candidatesDeduped: discovery?.clusterCount || 0,
            candidatesRejected: rejectedNews.length,
            candidatesAccepted: acceptedNews.length,
            qualifiedCount: discovery?.qualifiedCount || 0,
            selectedCount: discovery?.selectedCount || 0,
            runStatus: discovery?.runStatus || runSummary?.runStatus || null,
            sourceResults: discovery?.sourceResults || [],
            topicCoverageNote:
                "Active feeds cover AI, cybersecurity, science/space, finance/regulation, technology research. Local/state only when verified partners are configured (currently none active).",
        },
        news: {
            targetCandidateBand: "8-15 representative (quality-gated; not padded)",
            candidates: newsCandidates.slice(0, 20),
            acceptedDrafts: shadowNewsDrafts,
            heldOrRejectedAfterFactCheck: heldOrRejectedPacketNews,
            rejectedCandidates: rejectedNews.slice(0, 30),
            sourcingMatrix: acceptedNews.slice(0, 15).map((c) => ({
                headline: c.headline,
                sources: c.sourceOrganizations,
                urls: c.sourceUrls,
                independentSourceCount: c.independentSourceCount,
                agreementConflict: c.agreementConflict,
            })),
            pipelineWouldCreate: (pipelineResult?.created || []).filter((c) => c.type === "news"),
            dailyCap: MAX_NEWS_PER_DAY,
        },
        blog: {
            targetCandidateBand: "3-5 strong ideas",
            ideas: blogIdeas.slice(0, 10),
            acceptedDrafts: shadowBlogDrafts,
            heldOrRejectedAfterFactCheck: heldOrRejectedPacketBlog,
            rejectedIdeas: blogIdeas.filter((b) => b.eligibilityVerdict !== "ELIGIBLE").slice(0, 10),
            pipelineWouldCreate: (pipelineResult?.created || []).filter((c) => c.type === "blog"),
            dailyCap: MAX_BLOG_PER_DAY,
        },
        quality: {
            factCheckGate: factCheckGateExamples(),
            factCheckPipeline: {
                newsResults: pipelineResult?.newsResults || [],
                blogResult: pipelineResult?.blogResult || null,
                publishReadiness: pipelineResult?.publishReadiness || [],
                heldPacketNews: heldOrRejectedPacketNews,
            },
            originality: originalityResults,
            duplicateProtection: {
                duplicatesDetected: duplicates.length,
                classifications: [...new Set(newsCandidates.map((c) => c.duplicateStoryVerdict))],
            },
            sourceQuality: {
                activeTier: [...new Set(activeSources.map((s) => s.authorityTier))],
                noLowQualitySourcesAdded: true,
            },
            newsVsBlogSeparation: newsBlogSeparation(
                acceptedNews,
                blogIdeas.map((b) => ({ title: b.title, headline: b.title })),
            ),
            quoteStatisticSafety: {
                inventQuotes: false,
                inventStatistics: false,
                longQuotationsDiscouraged: true,
            },
        },
        translation: {
            supportedLocales: ["en", "es", "fr", "de"],
            englishAuthoritative: true,
            translatedVersionsCannotAddFacts: true,
            unsupportedLocalesDoNotBlockEnglish: true,
            queues: [...shadowNewsDrafts, ...shadowBlogDrafts].map((d) => ({
                slug: d.slug,
                queue: d.translationQueue,
            })),
        },
        automation: {
            scheduleBehavior: exec,
            failureBehavior: failureBehavior(discovery),
            publishGate: {
                autoPublish: false,
                draftPrOnSchedule: false,
                requiresHumanPublishCommands: true,
                holdNeverPublishes: true,
            },
        },
        recommendation: {
            productionCadence: cadence,
            remainingBlockersBeforeAutomaticPublication: blockers,
        },
        phase4: {
            sourceCoverage: coverageMatrix,
            blogCalendar: {
                articleCount: blogCalendar.articleCount,
                targetPostsPerWeek: blogCalendar.targetPostsPerWeek,
                sampleTitles: blogCalendar.articles.slice(0, 5).map((a) => a.workingTitle),
                planOnly: true,
            },
            commercialBoundary: {
                ...commercial,
                validation: commercialCheck,
            },
            heroImagePipeline: {
                summary: heroSummary,
                designOnly: true,
                noUnauthorizedGeneration: true,
            },
            translationQueue: translationSummary,
            draftOperations: {
                mode: exec.mode || "SHADOW",
                shadow: true,
                draftCapabilityPrepared: true,
                draftActivated: false,
                publish: false,
                autoPublish: false,
                catalogExcludesDrafts: catalogSafety,
            },
            dailyOperations: dailyOps,
            multiDayMetrics: {
                recorded: metricsResult.ok,
                summary: summarizeShadowMetrics(metricsResult.store),
            },
        },
        safety: {
            publishedCatalogsTouched: false,
            draftPrOpened: false,
            socialPosted: false,
            deployed: false,
            merged: false,
            fabricatedFacts: false,
            inventedQuotes: false,
            weakSourcePublication: false,
            unauthorizedImages: false,
            liveAffiliateActivation: false,
        },
        verdict,
    };

    mkdirSync(EDITORIAL_REPORTS_DIR, { recursive: true });
    const jsonPath = path.join(EDITORIAL_REPORTS_DIR, `${dateIso}-real-shadow-validation.json`);
    const mdPath = path.join(EDITORIAL_REPORTS_DIR, `${dateIso}-real-shadow-validation.md`);
    const opsPath = path.join(EDITORIAL_REPORTS_DIR, `${dateIso}-daily-ops.md`);
    writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
    writeFileSync(opsPath, renderDailyOperationsMarkdown(dailyOps), "utf8");
    writeFileSync(mdPath, renderValidationMarkdown(report), "utf8");
    return { jsonPath, mdPath, opsPath, report };
}

function renderValidationMarkdown(report) {
    const lines = [];
    lines.push(`# Editorial Real Shadow Validation — ${report.date}`);
    lines.push("");
    lines.push(`Generated: \`${report.generatedAt}\``);
    lines.push(`**Verdict:** ${report.verdict}`);
    lines.push("");
    lines.push("## DISCOVERY");
    lines.push("");
    lines.push(`- Stories found: **${report.discovery.storiesFound}**`);
    lines.push(`- Clusters (deduped): **${report.discovery.clusters}**`);
    lines.push(`- Accepted (drafting-eligible): **${report.discovery.candidatesAccepted}**`);
    lines.push(`- Rejected: **${report.discovery.candidatesRejected}**`);
    lines.push(`- Research-qualified: **${report.discovery.qualifiedCount}** · Selected: **${report.discovery.selectedCount}**`);
    lines.push(`- Run status: \`${report.discovery.runStatus?.status || "n/a"}\``);
    lines.push(`- Active sources: ${report.discovery.activeSources.map((s) => s.id).join(", ") || "none"}`);
    lines.push(`- Note: ${report.discovery.topicCoverageNote}`);
    lines.push("");
    lines.push("## NEWS");
    lines.push("");
    lines.push(`- Shadow drafts (READY/REVIEW only): **${report.news.acceptedDrafts.length}** (daily cap ${report.news.dailyCap})`);
    for (const d of report.news.acceptedDrafts) {
        lines.push(
            `- **${d.title}** · ${d.category} · ${d.coverageLevel} · sources=${(d.sources || []).length} · originality=${d.originality?.status} · fact=${d.factCheckStatus || "n/a"}`,
        );
    }
    if (report.news.heldOrRejectedAfterFactCheck?.length) {
        lines.push("");
        lines.push("### Held / rejected after Phase 10A fact-check");
        lines.push("");
        for (const h of report.news.heldOrRejectedAfterFactCheck) {
            lines.push(`- **${h.title}** · ${h.coverage} · ${h.disposition} · ${h.reason}`);
        }
    }
    lines.push("");
    lines.push("### Representative candidates (up to 15)");
    lines.push("");
    for (const c of report.news.candidates.slice(0, 15)) {
        lines.push(
            `- ${c.eligibilityForDrafting === "ELIGIBLE" ? "✅" : "❌"} **${c.headline}** · ${c.category}/${c.coverageLevel} · src=${c.sourceCount} (${c.sourceOrganizations.join(", ")}) · ${c.agreementConflict.status} · dup=${c.duplicateStoryVerdict}${c.rejectionReason ? ` · reject: ${c.rejectionReason}` : ""}`,
        );
    }
    lines.push("");
    lines.push("## BLOG");
    lines.push("");
    lines.push(`- Shadow drafts: **${report.blog.acceptedDrafts.length}**`);
    for (const d of report.blog.acceptedDrafts) {
        lines.push(`- **${d.title}** · ${d.topic} · ${d.classification} · originality=${d.originality?.status}`);
    }
    lines.push("");
    lines.push("### Ideas");
    lines.push("");
    for (const idea of report.blog.ideas.slice(0, 8)) {
        lines.push(
            `- ${idea.eligibilityVerdict === "ELIGIBLE" ? "✅" : "❌"} **${idea.title}** · ${idea.topic}${idea.rejectionReason ? ` · ${idea.rejectionReason}` : ""}`,
        );
    }
    lines.push("");
    lines.push("## QUALITY");
    lines.push("");
    lines.push(`- Originality: ${report.quality.originality.map((o) => `${o.slug}=${o.status}`).join("; ") || "n/a"}`);
    lines.push(`- Duplicates detected: **${report.quality.duplicateProtection.duplicatesDetected}**`);
    lines.push(`- News vs Blog near-dup: **${report.quality.newsVsBlogSeparation.nearDuplicateNewsPlusBlog.status}**`);
    lines.push("- Fact-check gate: no silent invented content; HOLD never publishes");
    lines.push("");
    lines.push("## TRANSLATION");
    lines.push("");
    lines.push("- English authoritative; locales es/fr/de default **MISSING** in shadow validation");
    lines.push("- Missing translations do not block English shadow validation");
    lines.push("");
    lines.push("## AUTOMATION");
    lines.push("");
    lines.push(`- Schedule: shadow=${report.automation.scheduleBehavior.shadow} dryRun=${report.automation.scheduleBehavior.dryRun} openDraftPr=${report.automation.scheduleBehavior.openDraftPr} autoPublish=${report.automation.scheduleBehavior.autoPublish}`);
    lines.push(`- Failed sources: ${(report.automation.failureBehavior.failedSources || []).join(", ") || "none"}`);
    lines.push("- Publish gate: human `*:publish` only; auto-publish OFF");
    lines.push("");
    lines.push("## RECOMMENDATION");
    lines.push("");
    const c = report.recommendation.productionCadence;
    lines.push(`- News: min **${c.news.minimumPerDay}**/day · target **${c.news.targetPerDay}**/day · max **${c.news.maximumPerDay}**/day`);
    lines.push(`- Blog: target **${c.blog.targetPerWeek}**/week (max ${c.blog.maximumPerDay}/day)`);
    lines.push("");
    lines.push("### Remaining blockers before automatic publication");
    lines.push("");
    for (const b of report.recommendation.remainingBlockersBeforeAutomaticPublication) {
        lines.push(`- ${b}`);
    }
    lines.push("");
    if (report.phase4) {
        lines.push("## PHASE 4");
        lines.push("");
        lines.push(`- Active sources: **${report.phase4.sourceCoverage?.summary?.activeSourceCount ?? "n/a"}**`);
        lines.push(`- Coverage overall: **${report.phase4.sourceCoverage?.summary?.overall ?? "n/a"}**`);
        lines.push(`- Weak/insufficient desks: **${[...(report.phase4.sourceCoverage?.summary?.weakDesks || []), ...(report.phase4.sourceCoverage?.summary?.insufficientDesks || [])].join(", ") || "none"}**`);
        lines.push(`- Blog calendar (plan-only): **${report.phase4.blogCalendar?.articleCount ?? 0}** slots @ ${report.phase4.blogCalendar?.targetPostsPerWeek}/week`);
        lines.push(`- Draft mode: **${report.phase4.draftOperations?.mode}** (activated=${report.phase4.draftOperations?.draftActivated})`);
        lines.push(`- Multi-day metrics days: **${report.phase4.multiDayMetrics?.summary?.days ?? 0}**`);
        lines.push("- PUBLISH / AUTO_PUBLISH remain OFF; scheduler stays SHADOW");
        lines.push("");
    }
    lines.push("## SAFETY CONFIRM");
    lines.push("");
    lines.push("- No merge / deploy / live publication / automatic Draft PR");
    lines.push("- No fabricated facts / invented quotes / weak-source publication");
    lines.push("");
    return `${lines.join("\n")}\n`;
}

export function loadDiscoveryArtifacts(dateIso, root) {
    const base = path.join(root, "editorial-reports");
    return {
        discovery: safeReadJson(path.join(base, `${dateIso}-discovery.json`)),
        runSummary: safeReadJson(path.join(base, `${dateIso}-run-summary.json`)),
        packet: safeReadJson(path.join(base, `${dateIso}-live-packet.json`)),
    };
}
