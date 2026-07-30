import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { classifyAgainstCinova } from "./cinovaDedupe.mjs";
import { clusterCandidates } from "./clustering.mjs";
import { assessCorroboration } from "./corroboration.mjs";
import { isFreshEnough } from "./freshness.mjs";
import { buildResearchPacket } from "./packetBuilder.mjs";
import { fetchSourceCandidates } from "./providers/index.mjs";
import { scoreCinovaRelevance } from "./relevance.mjs";
import { routeCluster } from "./routing.mjs";
import { classifyRunStatus, selectClustersForPacket } from "./selection.mjs";
import { getActiveSources, getSourceById, SOURCE_REGISTRY } from "./sourceRegistry.mjs";
import { writeDiscoveryReport } from "./report.mjs";

const DEFAULT_FIXTURE_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "fixtures");

function replaceTimeTokens(text, now) {
    return String(text).replace(/PLACEHOLDER_NOW_MINUS_(\d+)(H|D)/g, (_, amount, unit) => {
        const multiplier = unit === "D" ? 86_400_000 : 3_600_000;
        return new Date(now.getTime() - Number(amount) * multiplier).toUTCString();
    });
}

function fixtureSources(fixtureDir, now, selectedCases) {
    const manifest = JSON.parse(readFileSync(path.join(fixtureDir, "manifest.json"), "utf8"));
    const cases = manifest.cases.filter((entry) => !selectedCases || selectedCases.includes(entry.id));
    return cases.flatMap((entry) => (entry.feeds || []).map((feed) => {
        const registrySource = getSourceById(feed.sourceId);
        if (!registrySource) throw new Error(`Fixture references unknown source: ${feed.sourceId}`);
        return {
            caseId: entry.id,
            source: { ...registrySource, active: true },
            fixtureText: replaceTimeTokens(readFileSync(path.join(fixtureDir, feed.file), "utf8"), now),
        };
    }));
}

export function qualifyCluster(cluster) {
    const reasons = [];
    const supported = cluster.corroborated || cluster.primarySources?.some((source) => source.sourceTier === "TIER_1_PRIMARY");
    if (!supported) reasons.push("insufficient independent corroboration");
    if (!isFreshEnough(cluster.freshness, { requireFresh: true }) &&
        !(cluster.freshness === "BACKGROUND" && cluster.cinovaClassification === "UPDATE")) {
        reasons.push("outside current freshness window");
    }
    if (!(cluster.relevance > 0)) reasons.push("no CinNova relevance topic matched");
    if (cluster.cinovaClassification === "DUPLICATE") reasons.push("duplicates existing CinNova coverage");
    if (!["NEWS", "BLOG"].includes(cluster.route?.route)) reasons.push("route is SKIP");
    return {
        qualified: reasons.length === 0,
        rationale: reasons.length ? reasons.join("; ") : "Meets source, freshness, relevance, dedupe, and routing requirements.",
    };
}

export async function runDiscovery({
    mode = "fixture",
    fixtureDir = DEFAULT_FIXTURE_DIR,
    fixtureCases = null,
    dateIso = new Date().toISOString().slice(0, 10),
    dryRun = false,
    now = new Date(),
    dedupeOptions,
} = {}) {
    const current = now instanceof Date ? now : new Date(now);
    if (!["fixture", "live"].includes(mode)) throw new Error(`Unsupported discovery mode: ${mode}`);
    const inputs = mode === "fixture"
        ? fixtureSources(fixtureDir, current, fixtureCases)
        : getActiveSources().map((source) => ({ source }));
    const sourceResults = [];
    const candidates = [];

    for (const input of inputs) {
        try {
            const found = await fetchSourceCandidates(input.source, {
                fixtureText: input.fixtureText,
                retrievedAt: current,
            });
            candidates.push(...found);
            sourceResults.push({ sourceId: input.source.id, caseId: input.caseId || null, ok: true, count: found.length, error: null });
        } catch (error) {
            sourceResults.push({ sourceId: input.source.id, caseId: input.caseId || null, ok: false, count: 0, error: String(error?.message || error) });
        }
    }

    const clusters = clusterCandidates(candidates, { now: current }).map((cluster) => {
        const corroboration = assessCorroboration(cluster, SOURCE_REGISTRY);
        const enriched = { ...cluster, ...corroboration, corroboration };
        const dedupe = classifyAgainstCinova(enriched, dedupeOptions);
        const route = routeCluster(enriched);
        const relevance = scoreCinovaRelevance(
            `${enriched.canonicalTopic} ${enriched.topics.join(" ")} ${enriched.sources.map((source) => source.summary).join(" ")}`,
        );
        const classified = {
            ...enriched,
            route,
            relevance,
            cinovaClassification: dedupe.classification,
            dedupe,
        };
        const qualification = qualifyCluster(classified);
        return { ...classified, ...qualification, qualificationRationale: qualification.rationale };
    });
    const qualified = clusters.filter((cluster) => cluster.qualified);
    const selection = selectClustersForPacket(qualified);
    const selectedCount = selection.news.length + selection.blog.length;
    const packet = buildResearchPacket({ dateIso, clusters, qualified });
    const runStatus = classifyRunStatus({
        sourceResults,
        qualifiedCount: qualified.length,
        selectedCount,
    });
    const report = {
        schemaVersion: "10B.2",
        date: dateIso,
        mode,
        safety: "Research ingestion only; no publishing, merging, deployment, or social posting.",
        sourceResults,
        candidateCount: candidates.length,
        clusterCount: clusters.length,
        clusters,
        qualifiedCount: qualified.length,
        selectedCount,
        selection: {
            newsTopics: selection.news.map((cluster) => cluster.canonicalTopic),
            blogTopics: selection.blog.map((cluster) => cluster.canonicalTopic),
            rejectedWeakFit: selection.rejectedWeakFit,
            limits: selection.limits,
        },
        runStatus,
        packet,
    };
    const paths = writeDiscoveryReport(report, { dateIso, dryRun });
    return { ...report, qualified, paths, dryRun };
}
