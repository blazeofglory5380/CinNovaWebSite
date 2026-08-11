/**
 * CinNova editorial daily pipeline core (Phase 10A).
 *
 * Sequence:
 *   research → candidate scoring → dedupe → drafts → fact-check →
 *   SEO / internal links → heroes → optional social drafts → validation → report
 *
 * Never publishes, merges, or deploys. Dry-run mutates no catalog files.
 */

import { spawnSync } from "node:child_process";
import { writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import {
    buildDraftSkeleton as buildNewsSkeleton,
    draftFilePath as newsDraftPath,
    loadNewsDraftBySlug,
    writeNewsDraft,
    NEWS_COVERAGE_KEYS,
} from "./news-editorial.mjs";
import {
    buildBlogDraftSkeleton,
    draftFilePath as blogDraftPath,
    loadBlogDraftBySlug,
    writeBlogDraft,
    ensureReportsDir,
    EDITORIAL_REPORTS_DIR,
} from "./blog-editorial.mjs";
import { newsPosts } from "../../src/data/newsPosts.js";
import { blogPosts } from "../../src/data/blogPosts.js";
import { ROOT } from "./editorial-cli.mjs";
import { runEditorialResearch, loadResearchSummary } from "./editorial-research.mjs";
import { classifyNewsCandidate } from "./editorial-dedupe.mjs";
import { scoreNewsFactCheck, scoreBlogFactCheck } from "./editorial-factcheck.mjs";
import { enrichDraftSeo, auditDraftSeo } from "./editorial-seo.mjs";
import { applyInternalLinks } from "./editorial-links.mjs";
import { applyHeroResolution } from "./editorial-heroes.mjs";
import { prepareSocialDraftsForItem } from "./editorial-social.mjs";
import { renderDailyEditorialReport } from "./editorial-report.mjs";

function runNpm(script) {
    const result = spawnSync("npm", ["run", script], {
        cwd: ROOT,
        encoding: "utf8",
        shell: true,
    });
    return {
        code: result.status ?? 1,
        stdout: result.stdout || "",
        stderr: result.stderr || "",
    };
}

function stripPrivate(draft) {
    const next = { ...draft };
    delete next.__hero;
    delete next.__linkSuggestions;
    delete next.__productCtas;
    delete next.__draftFile;
    return next;
}

/**
 * Full daily pipeline.
 */
export function runEditorialDailyPipeline({
    dateIso,
    dryRun = false,
    skipExisting = false,
    packetPath = null,
    prepareSocial = true,
    legacySkeletons = false,
} = {}) {
    const notes = [
        "Phase 10A daily automation — preparation only.",
        "Does NOT publish, commit, push, merge, or deploy.",
        "Does NOT invent current events or sources.",
        "HOLD/REJECT never enter publish candidates.",
    ];

    const research = runEditorialResearch({ dateIso, packetPath, dryRun });
    notes.push(
        research.packetPath
            ? `Research packet: ${research.packetPath}`
            : "No research packet — desks without verified candidates are NO QUALIFIED STORY.",
    );

    if (legacySkeletons) {
        notes.push("WARNING: --legacy-skeletons enabled (empty desk skeletons). Prefer packet-driven runs.");
    }

    const created = [];
    const shadowDrafts = [];
    const skipped = [];
    const noQualified = [];
    const newsResults = [];
    const imageRequirements = [];
    const publishReadiness = [];
    const linkLines = [];
    const sourceAuditLines = [];
    const socialAgg = { written: [], skipped: [] };

    for (const desk of research.newsDesks) {
        const coverage = desk.coverage;

        if (!desk.qualified) {
            if (legacySkeletons && desk.disposition === "NO QUALIFIED STORY") {
                // fall through to legacy empty skeleton below
            } else {
                noQualified.push({
                    type: "news",
                    coverage,
                    reason: desk.reason || "NO QUALIFIED STORY",
                });
                newsResults.push({
                    coverage,
                    disposition: desk.disposition || "NO QUALIFIED STORY",
                    slug: desk.candidate?.slug || null,
                    factCheckStatus: desk.factCheck?.status || desk.disposition,
                    factCheckScore: desk.factCheck?.score,
                    duplicateClassification: desk.duplicate?.classification,
                    reason: desk.reason,
                    seoOk: null,
                    heroStatus: null,
                });
                if (!legacySkeletons || desk.disposition !== "NO QUALIFIED STORY") {
                    continue;
                }
            }
        }

        const packetStory = desk.candidate;
        const slug =
            packetStory?.slug ||
            (legacySkeletons ? `daily-${coverage}-${dateIso.replace(/-/g, "")}` : null);

        if (!slug) {
            noQualified.push({ type: "news", coverage, reason: "Qualified desk missing slug" });
            continue;
        }

        if (newsPosts.some((story) => story.slug === slug)) {
            skipped.push({ type: "news", coverage, slug, reason: "slug already published" });
            newsResults.push({
                coverage,
                disposition: "REJECT",
                slug,
                reason: "slug already published",
                duplicateClassification: "DUPLICATE",
            });
            continue;
        }

        if (loadNewsDraftBySlug(slug)) {
            skipped.push({
                type: "news",
                coverage,
                slug,
                reason: skipExisting ? "draft already exists" : "draft already exists (use --skip-existing)",
            });
            newsResults.push({
                coverage,
                disposition: "REVIEW",
                slug,
                reason: "draft already exists",
            });
            continue;
        }

        let draft = buildNewsSkeleton({
            slug,
            coverageLevel: coverage,
            title: packetStory?.title || "",
            category: packetStory?.category || "",
            location: packetStory?.location || "",
            author: packetStory?.author || "Cin Nova News Desk",
        });

        if (packetStory) {
            draft = Object.assign(draft, packetStory, {
                slug,
                coverageLevel: coverage,
                isDraft: true,
                isPublished: false,
                status: packetStory.status || draft.status,
            });
        }

        // Claim honesty fields
        if (!Array.isArray(draft.verifiedClaims)) draft.verifiedClaims = packetStory?.verifiedClaims || [];
        if (!Array.isArray(draft.attributedClaims)) draft.attributedClaims = packetStory?.attributedClaims || [];
        if (!Array.isArray(draft.uncertainties)) draft.uncertainties = packetStory?.uncertainties || [];

        const duplicate = classifyNewsCandidate(draft, { excludeSlug: draft.slug });
        draft.duplicateClassification = duplicate.classification;
        const fact = scoreNewsFactCheck(draft, { duplicateClassification: duplicate.classification });
        draft.factCheckStatus = fact.status;
        draft.factCheckScore = fact.score;
        draft.factCheckReasons = fact.reasons;

        draft = enrichDraftSeo(draft, "news");
        draft = applyInternalLinks(draft, "news");
        draft = applyHeroResolution(draft, "news");

        const seo = auditDraftSeo(draft, "news");
        if (draft.__hero?.status === "IMAGE_REQUIRED" && draft.__hero.requirement) {
            imageRequirements.push(draft.__hero.requirement);
        }
        if (draft.__linkSuggestions) {
            linkLines.push(
                `- news \`${slug}\`: relatedNews=${(draft.relatedNewsIds || []).join(", ") || "—"}; relatedBlog=${(draft.relatedBlogSlugs || []).join(", ") || "—"}`,
            );
        }
        sourceAuditLines.push(
            `- news \`${slug}\`: ${(draft.sources || []).filter((s) => s?.url && !/example\.com|replace-me/i.test(s.url)).length} real source URL(s)`,
        );

        publishReadiness.push({
            kind: "news",
            slug,
            status: fact.status,
            publishCandidate: fact.publishCandidate && !fact.blockedFromPublish,
            blockedFromPublish: fact.blockedFromPublish,
        });

        newsResults.push({
            coverage,
            disposition: fact.status,
            slug,
            factCheckStatus: fact.status,
            factCheckScore: fact.score,
            duplicateClassification: duplicate.classification,
            reason: fact.reasons.join("; ") || desk.reason,
            seoOk: seo.ok,
            seoSummary: [...seo.issues, ...seo.warnings].join("; ") || "ok",
            heroStatus: draft.__hero?.status,
        });

        const outbound = stripPrivate(draft);
        if (dryRun) {
            created.push({ type: "news", coverage, slug, path: newsDraftPath(slug), dryRun: true });
            shadowDrafts.push({ type: "news", coverage, slug, draft: outbound });
        } else {
            const filePath = writeNewsDraft(outbound);
            created.push({ type: "news", coverage, slug, path: filePath });
        }

        if (prepareSocial && (fact.status === "READY" || fact.status === "REVIEW") && !fact.blockedFromPublish) {
            const social = prepareSocialDraftsForItem({
                kind: "news",
                item: outbound,
                dateIso,
                dryRun,
            });
            socialAgg.written.push(...social.written);
            socialAgg.skipped.push(...social.skipped);
        }
    }

    // Blog
    let blogResult = null;
    const blogDesk = research.blog;
    if (!blogDesk.qualified && !legacySkeletons) {
        noQualified.push({ type: "blog", reason: blogDesk.reason || "NO QUALIFIED STORY" });
        blogResult = {
            disposition: blogDesk.disposition || "NO QUALIFIED STORY",
            slug: blogDesk.candidate?.slug || null,
            reason: blogDesk.reason,
        };
    } else if (blogDesk.qualified || legacySkeletons) {
        const packetBlog = blogDesk.candidate;
        const slug =
            packetBlog?.slug ||
            (legacySkeletons ? `daily-blog-${dateIso.replace(/-/g, "")}` : null);

        if (!slug) {
            noQualified.push({ type: "blog", reason: "Qualified blog missing slug" });
        } else if (blogPosts.some((post) => post.slug === slug)) {
            skipped.push({ type: "blog", slug, reason: "slug already published" });
            blogResult = { disposition: "REJECT", slug, reason: "slug already published" };
        } else if (loadBlogDraftBySlug(slug)) {
            skipped.push({
                type: "blog",
                slug,
                reason: skipExisting ? "draft already exists" : "draft already exists (use --skip-existing)",
            });
            blogResult = { disposition: "REVIEW", slug, reason: "draft already exists" };
        } else {
            let draft = buildBlogDraftSkeleton({
                slug,
                category: packetBlog?.category || "Artificial Intelligence",
                title: packetBlog?.title || "",
                author: packetBlog?.author || "CinNova Editorial Team",
            });
            if (packetBlog) {
                draft = Object.assign(draft, packetBlog, { slug, status: "draft" });
            }

            draft = enrichDraftSeo(draft, "blog");
            draft = applyInternalLinks(draft, "blog");
            draft = applyHeroResolution(draft, "blog");
            const fact = scoreBlogFactCheck(draft);
            draft.factCheckStatus = fact.status;
            draft.factCheckScore = fact.score;
            const seo = auditDraftSeo(draft, "blog");

            if (draft.__hero?.status === "IMAGE_REQUIRED" && draft.__hero.requirement) {
                imageRequirements.push(draft.__hero.requirement);
            }
            linkLines.push(
                `- blog \`${slug}\`: relatedReading=${(draft.relatedReading || []).join(", ") || "—"}; relatedNews=${(draft.relatedNewsIds || []).join(", ") || "—"}`,
            );
            if (draft.__productCtas?.length) {
                linkLines.push(
                    `- blog \`${slug}\` product CTAs: ${draft.__productCtas.map((p) => p.label).join(", ")}`,
                );
            }
            sourceAuditLines.push(
                `- blog \`${slug}\`: ${(draft.sources || []).filter((s) => s?.url && !/example\.com|replace-me/i.test(s.url)).length} real source URL(s)`,
            );

            publishReadiness.push({
                kind: "blog",
                slug,
                status: fact.status,
                publishCandidate: fact.publishCandidate && !fact.blockedFromPublish,
                blockedFromPublish: fact.blockedFromPublish,
            });

            blogResult = {
                disposition: fact.status,
                slug,
                factCheckStatus: fact.status,
                factCheckScore: fact.score,
                reason: fact.reasons.join("; ") || blogDesk.reason,
                seoOk: seo.ok,
                seoSummary: [...seo.issues, ...seo.warnings].join("; ") || "ok",
                heroStatus: draft.__hero?.status,
            };

            const outbound = stripPrivate(draft);
            if (dryRun) {
                created.push({ type: "blog", slug, path: blogDraftPath(slug), dryRun: true });
                shadowDrafts.push({ type: "blog", slug, draft: outbound });
            } else {
                const filePath = writeBlogDraft(outbound);
                created.push({ type: "blog", slug, path: filePath });
            }

            if (prepareSocial && (fact.status === "READY" || fact.status === "REVIEW") && !fact.blockedFromPublish) {
                const social = prepareSocialDraftsForItem({
                    kind: "blog",
                    item: outbound,
                    dateIso,
                    dryRun,
                });
                socialAgg.written.push(...social.written);
                socialAgg.skipped.push(...social.skipped);
            }
        }
    }

    const newsValidation = runNpm("validate:news");
    const blogValidation = runNpm("validate:blog");

    ensureReportsDir();
    const reportPath = path.join(EDITORIAL_REPORTS_DIR, `${dateIso}.md`);
    const report = renderDailyEditorialReport({
        dateIso,
        dryRun,
        created,
        skipped,
        noQualified,
        notes,
        newsResults,
        blogResult,
        imageRequirements,
        social: socialAgg,
        validation: { news: newsValidation, blog: blogValidation },
        publishReadiness,
        linkLines,
        sourceAuditLines,
    });

    if (!dryRun) {
        writeFileSync(reportPath, report, "utf8");
    }

    const hasReviewMaterial = created.some((item) => !item.dryRun) || (dryRun && created.length > 0);

    return {
        dateIso,
        dryRun,
        created,
        shadowDrafts,
        skipped,
        noQualified,
        newsResults,
        blogResult,
        imageRequirements,
        social: socialAgg,
        publishReadiness,
        validation: { news: newsValidation, blog: blogValidation },
        reportPath,
        report,
        hasReviewMaterial,
        research,
    };
}

export function hasQualifiedReviewOutput(result) {
    if (!result) return false;
    const ready = (result.publishReadiness || []).some(
        (item) => (item.status === "READY" || item.status === "REVIEW") && !item.blockedFromPublish,
    );
    return ready && (result.created?.length || 0) > 0;
}

export { NEWS_COVERAGE_KEYS, existsSync, loadResearchSummary };
