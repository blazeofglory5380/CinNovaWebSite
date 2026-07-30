#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildResearchPacket } from "./editorial/research/packetBuilder.mjs";
import {
    classifyRunStatus,
    compositeRank,
    diversityBucket,
    MAX_NEWS_PER_DAY,
    MIN_EDITORIAL_FIT,
    scoreEditorialFit,
    selectClustersForPacket,
} from "./editorial/research/selection.mjs";
import {
    dailyBranchName,
    dailyRunId,
    describeScheduleWindow,
    resolveResearchMode,
} from "./editorial/research/scheduleMode.mjs";
import { normalizeCandidate } from "./editorial/research/providers/normalize.mjs";
import { clusterCandidates } from "./editorial/research/clustering.mjs";

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
    assert.equal(resolveResearchMode({ eventName: "schedule" }).mode, "live");
    assert.equal(resolveResearchMode({ eventName: "workflow_dispatch" }).mode, "fixture");
    assert.equal(resolveResearchMode({
        eventName: "workflow_dispatch",
        researchModeInput: "fixture",
    }).mode, "fixture");
    assert.equal(resolveResearchMode({
        eventName: "workflow_dispatch",
        researchModeInput: "live",
    }).mode, "live");
    assert.equal(resolveResearchMode({
        eventName: "workflow_dispatch",
        useLiveResearchInput: "true",
    }).mode, "live");

    assert.equal(dailyRunId("2026-07-30"), "editorial-daily-2026-07-30");
    assert.equal(dailyBranchName("2026-07-30"), "editorial/daily-2026-07-30");
    const schedule = describeScheduleWindow();
    assert.match(schedule.pacificStandard, /05:00 PST/);
    assert.match(schedule.pacificDaylight, /06:00 PDT/);

    assert.match(WORKFLOW, /cron:\s*"0 13 \* \* \*"/);
    assert.match(WORKFLOW, /group:\s*cinnova-editorial-daily/);
    assert.match(WORKFLOW, /cancel-in-progress:\s*false/);
    assert.match(WORKFLOW, /contents:\s*write/);
    assert.match(WORKFLOW, /pull-requests:\s*write/);
    assert.doesNotMatch(WORKFLOW, /permissions:[\s\S]*admin/);
    assert.match(WORKFLOW, /default:\s*fixture/);
    assert.match(WORKFLOW, /Scheduled run uses live verified feeds/);
    assert.match(WORKFLOW, /Duplicate daily-run protection/);
    assert.match(WORKFLOW, /upload-artifact@v4/);
    assert.match(WORKFLOW, /--no-social/);
    assert.match(WORKFLOW, /test:editorial-live-schedule/);

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
    assert.equal(diversityBucket(strongCyber), "cybersecurity");
    assert.ok(compositeRank(strongCyber) > compositeRank(weakNasa));

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
    assert.ok(selected.news.some((item) => /semiconductor|artificial intelligence|regulation|finance/i.test(item.canonicalTopic)));

    const packet = buildResearchPacket({
        dateIso: "2026-07-30",
        qualified: [strongCyber, strongAiNews, secReg, weakNasa],
    });
    const filledNews = ["local", "state", "national", "international"]
        .filter((desk) => packet.news[desk].title)
        .length;
    assert.ok(filledNews <= MAX_NEWS_PER_DAY);
    assert.equal(packet.news.national.title.includes("Eclipse"), false);
    assert.ok(packet.selection.rejectedWeakFit.length >= 1);

    const emptyPacket = buildResearchPacket({ dateIso: "2026-07-30", qualified: [weakNasa] });
    assert.equal(emptyPacket.news.national.title, "");
    assert.equal(emptyPacket.blog.title, "");

    assert.equal(classifyRunStatus({
        sourceResults: [
            { sourceId: "a", ok: false },
            { sourceId: "b", ok: false },
        ],
        qualifiedCount: 0,
        selectedCount: 0,
    }).status, "FAILED");

    assert.equal(classifyRunStatus({
        sourceResults: [
            { sourceId: "a", ok: true },
            { sourceId: "b", ok: false },
        ],
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

    // Zero-output ⇒ no PR: prepare-pr already skips when no editorial files.
    const preparePr = readFileSync(path.join(ROOT, "scripts/editorial-prepare-pr.mjs"), "utf8");
    assert.match(preparePr, /Skipping PR \(no junk PR\)/);
    assert.match(WORKFLOW, /has_changes == 'true'/);
    assert.match(WORKFLOW, /Open Draft PR/);
    assert.doesNotMatch(WORKFLOW, /gh pr ready/);
    assert.doesNotMatch(WORKFLOW, /gh pr merge/);

    console.log("test:editorial-live-schedule passed");
}

run();
