#!/usr/bin/env node
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildResearchPacket } from "./editorial/research/packetBuilder.mjs";
import {
    classifyRunStatus,
    compositeRank,
    diversityBucket,
    MAX_BLOG_PER_DAY,
    MAX_NEWS_PER_DAY,
    MIN_EDITORIAL_FIT,
    scoreEditorialFit,
    selectClustersForPacket,
} from "./editorial/research/selection.mjs";
import {
    dailyBranchName,
    dailyRunId,
    describeScheduleWindow,
    resolveAutomationExecutionMode,
    resolveResearchMode,
} from "./editorial/research/scheduleMode.mjs";
import {
    duplicateDailyRunDecision,
    shouldOpenEditorialDraftPr,
} from "./editorial/research/prGate.mjs";
import { writeShadowReport } from "./lib/editorial-shadow-report.mjs";
import { normalizeCandidate } from "./editorial/research/providers/normalize.mjs";
import { clusterCandidates } from "./editorial/research/clustering.mjs";
import { runEditorialDailyPipeline } from "./lib/editorial-pipeline.mjs";
import { scoreNewsDesk } from "./lib/editorial-research.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WORKFLOW = readFileSync(path.join(ROOT, ".github/workflows/editorial-daily.yml"), "utf8");
const NOW = new Date("2026-07-29T18:00:00.000Z");

function clusterFrom(partial) {
    const candidate = normalizeCandidate({
        sourceId: "nist-news",
        sourceName: "NIST News",
        sourceTier: "TIER_1_PRIMARY",
        sourceUrl: "https://www.nist.gov/news-events/news/rss.xml",
        articleUrl: "https://www.nist.gov/news-events/news/fixture",
        headline: "NIST announces artificial intelligence cybersecurity standards",
        summary: "NIST announced artificial intelligence cybersecurity software standards for national infrastructure.",
        publishedAt: "2026-07-29T16:00:00.000Z",
        scope: ["national"],
        topics: ["ai", "cybersecurity"],
        retrievedAt: NOW,
        guid: "fixture-guid",
        ...partial,
    });
    const cluster = clusterCandidates([candidate], { now: NOW })[0];
    return {
        ...cluster,
        qualified: true,
        corroborated: true,
        cinovaClassification: "NEW",
        relevance: scoreEditorialFit(cluster).score,
        route: { route: partial.route || "NEWS", rationale: "fixture" },
        primarySources: cluster.primarySources,
        sources: cluster.sources,
    };
}

function run() {
    // --- Schedule / mode ---
    assert.equal(resolveResearchMode({ eventName: "schedule" }).mode, "live");
    assert.equal(resolveResearchMode({ eventName: "workflow_dispatch" }).mode, "fixture");
    assert.equal(resolveResearchMode({
        eventName: "workflow_dispatch",
        researchModeInput: "fixture",
        useLiveResearchInput: "false",
    }).mode, "fixture");
    assert.equal(resolveResearchMode({
        eventName: "workflow_dispatch",
        researchModeInput: "fixture",
        useLiveResearchInput: "",
    }).mode, "fixture");
    assert.equal(resolveResearchMode({
        eventName: "workflow_dispatch",
        researchModeInput: "live",
    }).mode, "live");
    assert.equal(resolveResearchMode({
        eventName: "workflow_dispatch",
        useLiveResearchInput: "true",
    }).mode, "live");
    // Legacy alone can enable live, but ordinary fixture defaults cannot.
    assert.notEqual(resolveResearchMode({
        eventName: "workflow_dispatch",
        researchModeInput: "fixture",
    }).mode, "live");

    assert.equal(dailyRunId("2026-07-30"), "editorial-daily-2026-07-30");
    assert.equal(dailyBranchName("2026-07-30"), "editorial/daily-2026-07-30");
    const schedule = describeScheduleWindow();
    assert.match(schedule.pacificStandard, /05:00 PST/);
    assert.match(schedule.pacificDaylight, /06:00 PDT/);

    // --- Shadow / execution mode (auto-publish never on) ---
    const scheduleExec = resolveAutomationExecutionMode({ eventName: "schedule" });
    assert.equal(scheduleExec.shadow, true);
    assert.equal(scheduleExec.dryRun, true);
    assert.equal(scheduleExec.openDraftPr, false);
    assert.equal(scheduleExec.writeDraftFiles, false);
    assert.equal(scheduleExec.autoPublish, false);

    const defaultManual = resolveAutomationExecutionMode({ eventName: "workflow_dispatch" });
    assert.equal(defaultManual.shadow, true);
    assert.equal(defaultManual.dryRun, true);
    assert.equal(defaultManual.openDraftPr, false);
    assert.equal(defaultManual.autoPublish, false);

    const dryRunManual = resolveAutomationExecutionMode({
        eventName: "workflow_dispatch",
        dryRunInput: "true",
        allowDraftPrInput: "true",
    });
    assert.equal(dryRunManual.shadow, true);
    assert.equal(dryRunManual.openDraftPr, false);

    const draftPrep = resolveAutomationExecutionMode({
        eventName: "workflow_dispatch",
        dryRunInput: "false",
        shadowInput: "false",
        allowDraftPrInput: "true",
    });
    assert.equal(draftPrep.shadow, false);
    assert.equal(draftPrep.dryRun, false);
    assert.equal(draftPrep.openDraftPr, true);
    assert.equal(draftPrep.writeDraftFiles, true);
    assert.equal(draftPrep.autoPublish, false);

    // Schedule ignores allow_draft_pr — stays shadow.
    const scheduleIgnoresActivation = resolveAutomationExecutionMode({
        eventName: "schedule",
        allowDraftPrInput: "true",
        dryRunInput: "false",
        shadowInput: "false",
    });
    assert.equal(scheduleIgnoresActivation.shadow, true);
    assert.equal(scheduleIgnoresActivation.openDraftPr, false);
    assert.equal(scheduleIgnoresActivation.autoPublish, false);

    assert.match(WORKFLOW, /cron:\s*"0 13 \* \* \*"/);
    assert.match(WORKFLOW, /group:\s*cinnova-editorial-daily/);
    assert.match(WORKFLOW, /cancel-in-progress:\s*false/);
    assert.match(WORKFLOW, /contents:\s*write/);
    assert.match(WORKFLOW, /pull-requests:\s*write/);
    assert.doesNotMatch(WORKFLOW, /permissions:[\s\S]*(actions|administration|deployments|issues|packages):\s*write/);
    assert.match(WORKFLOW, /default:\s*fixture/);
    assert.match(WORKFLOW, /Scheduled run uses live verified feeds/);
    assert.match(WORKFLOW, /Scheduled runs stay in shadow\/dry-run mode/);
    assert.match(WORKFLOW, /allow_draft_pr/);
    assert.match(WORKFLOW, /editorial:shadow/);
    assert.match(WORKFLOW, /Shadow\/dry-run: forced ON/);
    assert.match(WORKFLOW, /Duplicate daily-run protection/);
    assert.match(WORKFLOW, /upload-artifact@v4/);
    assert.match(WORKFLOW, /--no-social/);
    assert.match(WORKFLOW, /test:editorial-live-schedule/);
    assert.match(WORKFLOW, /No editorial draft files survived Phase 10A gates/);
    assert.match(WORKFLOW, /open_draft_pr == 'true'/);
    assert.doesNotMatch(WORKFLOW, /discovery\.md/);
    assert.doesNotMatch(WORKFLOW, /gh pr ready/);
    assert.doesNotMatch(WORKFLOW, /gh pr merge/);
    assert.doesNotMatch(WORKFLOW, /facebook|instagram|tiktok|linkedin|youtube/i);
    assert.match(WORKFLOW, /READY: \*\*/);

    // dry_run / shadow defaults must be true (shadow-first activation).
    assert.match(WORKFLOW, /dry_run:[\s\S]*?default:\s*true/);
    assert.match(WORKFLOW, /shadow:[\s\S]*?default:\s*true/);
    assert.match(WORKFLOW, /allow_draft_pr:[\s\S]*?default:\s*false/);

    // Local npm discover defaults stay fixture-safe (requires --live).
    const discoverCli = readFileSync(path.join(ROOT, "scripts/editorial-discover.mjs"), "utf8");
    assert.match(discoverCli, /readFlag\("--live"/);
    assert.match(discoverCli, /"live" : "fixture"/);

    const shadowCli = readFileSync(path.join(ROOT, "scripts/editorial-shadow.mjs"), "utf8");
    assert.match(shadowCli, /writeShadowReport/);
    assert.match(shadowCli, /Auto-publish: OFF/);
    assert.match(shadowCli, /dryRun:\s*true/);

    const pkg = readFileSync(path.join(ROOT, "package.json"), "utf8");
    assert.match(pkg, /"editorial:shadow"/);

    const strongCyber = clusterFrom({
        sourceId: "cisa-advisories",
        sourceName: "CISA",
        headline: "CISA issues cybersecurity advisory on software infrastructure",
        summary: "CISA published a cybersecurity advisory affecting national software infrastructure security.",
        articleUrl: "https://www.cisa.gov/news-events/alerts/2026/07/29/cyber",
        guid: "cyber-1",
    });
    const strongAi = clusterFrom({
        sourceId: "mit-ai",
        sourceName: "MIT News",
        sourceTier: "TIER_3_REPUTABLE_SECONDARY",
        headline: "MIT researchers publish artificial intelligence education study",
        summary: "An artificial intelligence education study examines learning software for students.",
        articleUrl: "https://news.mit.edu/2026/ai-education",
        guid: "ai-1",
        route: "BLOG",
    });
    const strongAiNews = clusterFrom({
        sourceId: "nist-news",
        headline: "NIST advances semiconductor chip artificial intelligence policy",
        summary: "NIST announced semiconductor chip policy supporting artificial intelligence infrastructure.",
        articleUrl: "https://www.nist.gov/news/ai-chip",
        guid: "ai-news-1",
    });
    const secReg = clusterFrom({
        sourceId: "sec-press",
        sourceName: "SEC",
        headline: "SEC proposes regulation on technology finance disclosures",
        summary: "The SEC proposed regulation affecting technology finance and capital markets policy.",
        articleUrl: "https://www.sec.gov/news/press-release/tech-finance",
        guid: "sec-1",
    });
    const weakNasa = clusterFrom({
        sourceId: "nasa-press",
        sourceName: "NASA",
        headline: "NASA Sets Coverage for August Northern Hemisphere Total Solar Eclipse",
        summary: "NASA will provide telescope coverage of the eclipse for public viewing.",
        articleUrl: "https://www.nasa.gov/news-release/eclipse",
        guid: "nasa-1",
        scope: ["national", "international"],
    });
    const significantScience = clusterFrom({
        sourceId: "nasa-press",
        sourceName: "NASA",
        headline: "NASA and partners advance semiconductor chip artificial intelligence for deep-space systems",
        summary: "NASA announced artificial intelligence semiconductor chip software for space infrastructure security.",
        articleUrl: "https://www.nasa.gov/news-release/ai-chip-space",
        guid: "nasa-ai-1",
        scope: ["international"],
    });
    const icsA = clusterFrom({
        sourceId: "cisa-advisories",
        headline: "Siemens Mendix Runtime cybersecurity advisory",
        summary: "CISA republished a cybersecurity advisory for Siemens Mendix Runtime software security.",
        articleUrl: "https://www.cisa.gov/icsa-a",
        guid: "ics-a",
    });
    const icsB = clusterFrom({
        sourceId: "cisa-advisories",
        headline: "Siemens Desigo CC cybersecurity advisory",
        summary: "CISA republished a cybersecurity advisory for Siemens Desigo CC software security.",
        articleUrl: "https://www.cisa.gov/icsa-b",
        guid: "ics-b",
    });
    const icsC = clusterFrom({
        sourceId: "cisa-advisories",
        headline: "ABB KNX Update Tool cybersecurity advisory",
        summary: "CISA republished a cybersecurity advisory for ABB KNX software security.",
        articleUrl: "https://www.cisa.gov/icsa-c",
        guid: "ics-c",
    });

    assert.ok(scoreEditorialFit(strongCyber).score >= MIN_EDITORIAL_FIT);
    assert.ok(scoreEditorialFit(weakNasa).score < MIN_EDITORIAL_FIT);
    assert.ok(scoreEditorialFit(significantScience).score >= MIN_EDITORIAL_FIT,
        "significant tech/science developments with CinNova keywords must not be rejected as weak-fit");
    assert.equal(diversityBucket(strongCyber), "cybersecurity");
    assert.ok(compositeRank(strongCyber) > compositeRank(weakNasa));

    // --- Caps / no quota filling ---
    const tenNews = Array.from({ length: 10 }, (_, index) => clusterFrom({
        sourceId: ["nist-news", "cisa-advisories", "sec-press", "nasa-press"][index % 4],
        headline: `National artificial intelligence cybersecurity infrastructure update ${index}`,
        summary: "Artificial intelligence cybersecurity software infrastructure regulation and policy update.",
        articleUrl: `https://www.nist.gov/news/cap-${index}`,
        guid: `cap-${index}`,
        scope: [["local", "state", "national", "international"][index % 4]],
    }));
    const capped = selectClustersForPacket([
        ...tenNews,
        { ...strongAi, route: { route: "BLOG", rationale: "fixture" } },
        clusterFrom({
            sourceId: "mit-ai",
            headline: "Second artificial intelligence education research paper analysis",
            summary: "Study research paper analyzes artificial intelligence education software frameworks.",
            articleUrl: "https://news.mit.edu/2026/ai-education-2",
            guid: "blog-2",
            route: "BLOG",
        }),
    ]);
    assert.ok(capped.news.length <= MAX_NEWS_PER_DAY);
    assert.ok(capped.blog.length <= MAX_BLOG_PER_DAY);
    assert.equal(capped.blog.length, 1);

    const allWeak = selectClustersForPacket([weakNasa, clusterFrom({
        sourceId: "nasa-press",
        headline: "Martian auroras photographed by orbiting camera",
        summary: "A pretty photograph of lights above Mars.",
        articleUrl: "https://www.nasa.gov/aurora-photo",
        guid: "weak-2",
    })]);
    assert.equal(allWeak.news.length, 0);
    assert.equal(allWeak.blog.length, 0);

    const selected = selectClustersForPacket([
        strongCyber,
        strongAiNews,
        secReg,
        weakNasa,
        icsA,
        icsB,
        icsC,
        { ...strongAi, route: { route: "BLOG", rationale: "fixture" } },
    ]);
    assert.ok(selected.news.length <= MAX_NEWS_PER_DAY);
    assert.ok(selected.blog.length <= 1);
    assert.ok(selected.news.every((item) => scoreEditorialFit(item).passes));
    assert.ok(selected.rejectedWeakFit.some((item) => /Eclipse/i.test(item.topic)));
    const cyberSelected = selected.news.filter((item) => diversityBucket(item) === "cybersecurity");
    assert.ok(cyberSelected.length <= 2, "diversity should limit identical cyber-only overload when alternatives exist");

    // Soft-cap must not suppress the best remaining major story for an open desk.
    const sameSourceMajor = selectClustersForPacket([
        clusterFrom({
            sourceId: "cisa-advisories",
            headline: "CISA cybersecurity advisory on local water software",
            summary: "CISA cybersecurity advisory for local software infrastructure security.",
            articleUrl: "https://www.cisa.gov/local",
            guid: "cisa-local",
            scope: ["local"],
        }),
        clusterFrom({
            sourceId: "cisa-advisories",
            headline: "CISA cybersecurity advisory on state grid software",
            summary: "CISA cybersecurity advisory for state software infrastructure security.",
            articleUrl: "https://www.cisa.gov/state",
            guid: "cisa-state",
            scope: ["state"],
        }),
        clusterFrom({
            sourceId: "cisa-advisories",
            headline: "CISA Adds Known Exploited Vulnerability to Catalog for national software",
            summary: "CISA added a known exploited vulnerability affecting national cybersecurity software infrastructure.",
            articleUrl: "https://www.cisa.gov/kev-major",
            guid: "cisa-kev-major",
            scope: ["national"],
        }),
    ], { maxPerSource: 2 });
    assert.ok(sameSourceMajor.news.some((item) => /Known Exploited/i.test(item.canonicalTopic)),
        "major same-source story should still be selectable for an open desk");

    const packet = buildResearchPacket({
        dateIso: "2026-07-30",
        qualified: [strongCyber, strongAiNews, secReg, weakNasa],
    });
    const filledNews = ["local", "state", "national", "international"]
        .filter((desk) => packet.news[desk].title)
        .length;
    assert.ok(filledNews <= MAX_NEWS_PER_DAY);
    assert.equal(packet.news.national.title.includes("Eclipse"), false);

    const emptyPacket = buildResearchPacket({ dateIso: "2026-07-30", qualified: [weakNasa] });
    assert.equal(emptyPacket.news.national.title, "");
    assert.equal(emptyPacket.blog.title, "");

    // --- Failure states ---
    assert.equal(classifyRunStatus({
        sourceResults: [{ sourceId: "a", ok: false }, { sourceId: "b", ok: false }],
        qualifiedCount: 0,
        selectedCount: 0,
    }).status, "FAILED");
    assert.equal(classifyRunStatus({
        sourceResults: [{ sourceId: "a", ok: true }, { sourceId: "b", ok: false }],
        qualifiedCount: 3,
        selectedCount: 2,
    }).status, "PARTIAL_SUCCESS");
    assert.equal(classifyRunStatus({
        sourceResults: [{ sourceId: "a", ok: true }],
        qualifiedCount: 0,
        selectedCount: 0,
    }).status, "NO_QUALIFIED_STORY");
    assert.equal(classifyRunStatus({
        sourceResults: [{ sourceId: "a", ok: true }],
        qualifiedCount: 2,
        selectedCount: 1,
    }).status, "SUCCESS");

    // --- PR gates / zero-output ---
    assert.equal(shouldOpenEditorialDraftPr({
        newsDraftCount: 0,
        blogDraftCount: 0,
    }), false);
    assert.equal(shouldOpenEditorialDraftPr({
        newsDraftPaths: [],
        blogDraftPaths: ["editorial-reports/only-report.md"],
    }), false);
    assert.equal(shouldOpenEditorialDraftPr({
        newsDraftPaths: ["src/data/news-drafts/ready-story.js"],
        blogDraftPaths: [],
    }), true);
    assert.equal(shouldOpenEditorialDraftPr({
        newsDraftCount: 0,
        blogDraftCount: 1,
    }), true);

    // Shadow / dry-run / autoPublish must never open a Draft PR.
    assert.equal(shouldOpenEditorialDraftPr({
        newsDraftCount: 2,
        blogDraftCount: 1,
        shadow: true,
    }), false);
    assert.equal(shouldOpenEditorialDraftPr({
        newsDraftCount: 2,
        blogDraftCount: 1,
        dryRun: true,
    }), false);
    assert.equal(shouldOpenEditorialDraftPr({
        newsDraftCount: 2,
        blogDraftCount: 1,
        autoPublish: true,
    }), false);

    // HOLD / research-selected alone must not open a PR.
    assert.equal(shouldOpenEditorialDraftPr({ newsDraftCount: 0, blogDraftCount: 0 }), false);

    assert.equal(duplicateDailyRunDecision({
        openPr: { number: 12, url: "https://example.com/12", isDraft: true },
    }).action, "skip");
    assert.equal(duplicateDailyRunDecision({
        closedOrMergedPr: { number: 9, state: "MERGED" },
        branchExists: true,
    }).action, "proceed");
    assert.equal(duplicateDailyRunDecision({
        branchExists: true,
    }).action, "proceed");
    assert.equal(duplicateDailyRunDecision({}).action, "proceed");

    const preparePr = readFileSync(path.join(ROOT, "scripts/editorial-prepare-pr.mjs"), "utf8");
    assert.match(preparePr, /Skipping PR \(no junk PR\)/);
    assert.match(WORKFLOW, /has_changes == 'true'/);

    // --- LIVE-like HOLD path (SBOM-shaped packet) stays non-drafting ---
    const holdStory = {
        slug: "2026-minimum-elements-sbom",
        title: "2026 Minimum Elements for a Software Bill of Materials (SBOM)",
        dek: "CISA published minimum SBOM elements.",
        category: "cybersecurity",
        location: "National",
        publishedAt: "2026-07-29T12:00:00.000Z",
        summary: "CISA published minimum SBOM elements for software security.",
        whyItMatters: "Software security and infrastructure.",
        sources: [{
            label: "CISA SBOM",
            publisher: "CISA",
            url: "https://www.cisa.gov/resources-tools/resources/2026-minimum-elements-software-bill-materials-sbom",
            type: "official",
        }],
        verifiedClaims: [],
        attributedClaims: ["CISA published the SBOM minimum elements."],
        uncertainties: ["All source-derived claims require Phase 10A fact-check and contextual review before drafting."],
        editorialNotes: "Tier 1 primary. Dedupe: NEW.",
        forceDraft: false,
        factCheckStatus: "",
    };
    const holdDesk = scoreNewsDesk("national", holdStory, "2026-07-30");
    assert.equal(holdDesk.disposition, "HOLD");
    assert.equal(holdDesk.qualified, false);
    assert.match(holdDesk.reason, /uncertainties|one source/i);

    // --- READY fixture path → drafts in dry-run; mocked PR gate true ---
    const tmp = mkdtempSync(path.join(os.tmpdir(), "cinnova-10b2-ready-"));
    const packetPath = path.join(tmp, "ready-packet.json");
    const readyPacket = {
        schemaVersion: "10A",
        date: "2026-07-30",
        safety: "fixture",
        news: {
            local: { title: "" },
            state: { title: "" },
            national: {
                slug: `ready-nist-ai-cyber-${Date.now()}`,
                title: "NIST announces artificial intelligence cybersecurity standards",
                dek: "NIST published AI cybersecurity standards with CISA corroboration.",
                category: "cybersecurity",
                location: "National",
                publishedAt: "2026-07-29T16:00:00.000Z",
                summary: "NIST announced artificial intelligence cybersecurity software standards for national infrastructure.",
                whyItMatters: "AI cybersecurity software standards affect CinNova product security.",
                sources: [
                    {
                        label: "NIST announcement",
                        publisher: "NIST",
                        url: "https://www.nist.gov/news-events/news/2026/07/ai-cyber-standards",
                        type: "official",
                    },
                    {
                        label: "CISA advisory",
                        publisher: "CISA",
                        url: "https://www.cisa.gov/news-events/alerts/2026/07/29/ai-cyber-standards",
                        type: "official",
                    },
                ],
                verifiedClaims: [
                    "NIST published artificial intelligence cybersecurity standards on the stated date.",
                    "CISA issued a related cybersecurity advisory covering the same standards.",
                ],
                attributedClaims: [],
                uncertainties: [],
                editorialNotes: "Fixture READY candidate for Phase 10B.2 review.",
                forceDraft: false,
                factCheckStatus: "",
            },
            international: { title: "" },
        },
        blog: { title: "" },
    };
    writeFileSync(packetPath, `${JSON.stringify(readyPacket, null, 2)}\n`);
    const readyDesk = scoreNewsDesk("national", readyPacket.news.national, "2026-07-30");
    assert.equal(readyDesk.disposition, "READY");
    assert.equal(readyDesk.qualified, true);

    const daily = runEditorialDailyPipeline({
        dateIso: "2026-07-30",
        dryRun: true,
        skipExisting: true,
        packetPath,
        prepareSocial: false,
    });
    assert.ok(daily.created.some((item) => item.type === "news"), "READY fixture must generate a news draft in dry-run");
    const newsPaths = daily.created
        .filter((item) => item.type === "news")
        .map((item) => `src/data/news-drafts/${item.slug}.js`);
    assert.equal(shouldOpenEditorialDraftPr({
        newsDraftPaths: newsPaths,
        blogDraftPaths: [],
    }), true);
    assert.equal(shouldOpenEditorialDraftPr({
        newsDraftPaths: newsPaths,
        blogDraftPaths: [],
        dryRun: true,
        shadow: true,
    }), false);

    const shadowOut = writeShadowReport({
        dateIso: "2026-07-30",
        executionMode: scheduleExec,
        researchMode: { mode: "fixture" },
        pipelineResult: daily,
        notes: ["fixture test"],
    });
    assert.ok(existsSync(shadowOut.jsonPath));
    assert.ok(existsSync(shadowOut.mdPath));
    const shadowJson = JSON.parse(readFileSync(shadowOut.jsonPath, "utf8"));
    assert.equal(shadowJson.mode, "shadow");
    assert.equal(shadowJson.autoPublish, false);
    assert.equal(shadowJson.openDraftPr, false);
    assert.equal(shadowJson.safety.draftPrOpened, false);
    assert.ok(shadowJson.counts.wouldCreateNews >= 1);

    rmSync(tmp, { recursive: true, force: true });
    // Clean shadow report written into the real editorial-reports dir during the test.
    try {
        rmSync(shadowOut.jsonPath, { force: true });
        rmSync(shadowOut.mdPath, { force: true });
    } catch {
        /* ignore */
    }

    console.log("test:editorial-live-schedule passed");
}

run();
