/**
 * Phase 10B.2 — editorial selection after research qualification.
 * Research qualification alone does not guarantee packet inclusion.
 */

import { scoreCinovaRelevance } from "./relevance.mjs";

export const MIN_EDITORIAL_FIT = 2;
export const MAX_NEWS_PER_DAY = 4;
export const MAX_BLOG_PER_DAY = 1;
export const MAX_PER_SOURCE = 2;

const FRESHNESS_WEIGHT = Object.freeze({
    BREAKING: 4,
    CURRENT: 3,
    RECENT: 2,
    BACKGROUND: 0,
    UNKNOWN: 0,
});

const DIVERSITY_BUCKETS = Object.freeze([
    { id: "cybersecurity", pattern: /\b(cyber|security|vulnerab|advisory|advisories|exploit|sbom|icsa|cisa)\b/i },
    { id: "ai_technology", pattern: /(artificial intelligence|\bai\b|llm|machine learning|\bmodel\b|openai|anthropic|arxiv|\bchip\b|semiconductor)/i },
    { id: "business_regulation", pattern: /\b(sec\b|ftc|regulation|policy|funding|capital|finance|antitrust|acquisition|charges?)\b/i },
    { id: "infrastructure_energy", pattern: /\b(data center|datacenter|grid|energy|power|infrastructure)\b/i },
    { id: "education", pattern: /\b(education|edtech|school|student|learning|university)\b/i },
]);

function stripHtml(value = "") {
    return String(value).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function clusterContentText(cluster = {}) {
    const parts = [
        cluster.canonicalTopic || "",
        ...(cluster.headlineCandidates || []),
        ...(cluster.sources || []).flatMap((source) => [source.headline, source.summary]),
    ];
    return stripHtml(parts.filter(Boolean).join(" "));
}

/** Content-only relevance — ignores registry topic tags to avoid weak bleed. */
export function scoreEditorialFit(cluster = {}) {
    const text = clusterContentText(cluster);
    const score = scoreCinovaRelevance(text);
    return {
        score,
        passes: score >= MIN_EDITORIAL_FIT,
        rationale: score >= MIN_EDITORIAL_FIT
            ? `Editorial fit score ${score} meets minimum ${MIN_EDITORIAL_FIT}.`
            : `Editorial fit score ${score} below minimum ${MIN_EDITORIAL_FIT}; deprioritized.`,
    };
}

export function diversityBucket(cluster = {}) {
    const text = clusterContentText(cluster);
    const match = DIVERSITY_BUCKETS.find((bucket) => bucket.pattern.test(text));
    return match?.id || "broader";
}

export function compositeRank(cluster = {}) {
    const fit = scoreEditorialFit(cluster).score;
    const freshness = FRESHNESS_WEIGHT[cluster.freshness] || 0;
    const confidence = Number(cluster.confidence) || 0;
    const primaryBonus = (cluster.primarySources || []).length ? 1.5 : 0;
    const corroborationBonus = cluster.corroborated ? 1 : 0;
    const tierSpread = new Set((cluster.sources || []).map((source) => source.sourceId)).size * 0.35;
    const headline = String(cluster.canonicalTopic || cluster.sources?.[0]?.headline || "").trim();
    const shortText = `${headline} ${String(cluster.sources?.[0]?.summary || "").replace(/<[^>]+>/g, " ").slice(0, 280)}`;
    let publicInterest = 0;
    // Score public-interest from headline/lede only — long ICS HTML bodies are keyword-dense.
    if (/\b(known exploited|sbom|bill of materials|minimum elements|final rule|orders?|announces?|funding|data center|artificial intelligence)\b/i.test(shortText)) {
        publicInterest += 5;
    }
    // Product-name ICS advisories remain eligible but rank below broader alerts.
    if (/^(siemens|abb|mikrotik|rockwell|igloohome)\b/i.test(headline)
        && !/\b(known exploited|sbom|minimum elements|announces?|orders?)\b/i.test(headline)) {
        publicInterest -= 6;
    }
    return Number((fit * 2 + freshness + confidence * 2 + primaryBonus + corroborationBonus + tierSpread + publicInterest).toFixed(3));
}

function primarySourceId(cluster) {
    return cluster.primarySources?.[0]?.sourceId || cluster.sources?.[0]?.sourceId || "unknown";
}

function bestScope(cluster) {
    return ["local", "state", "national", "international"].find((desk) => cluster.scope?.includes(desk)) || "national";
}

/**
 * Select up to MAX_NEWS_PER_DAY / MAX_BLOG_PER_DAY clusters for the VERIFIED RESEARCH PACKET.
 * Prefers diversity of topic buckets and sources; never fills slots with weak-fit items.
 */
export function selectClustersForPacket(qualified = [], {
    maxNews = MAX_NEWS_PER_DAY,
    maxBlog = MAX_BLOG_PER_DAY,
    minFit = MIN_EDITORIAL_FIT,
    maxPerSource = MAX_PER_SOURCE,
} = {}) {
    const withMeta = (qualified || [])
        .filter((cluster) => cluster?.qualified)
        .map((cluster) => {
            const fit = scoreEditorialFit(cluster);
            return {
                cluster,
                fit,
                rank: compositeRank(cluster),
                bucket: diversityBucket(cluster),
                route: cluster.route?.route || "SKIP",
                sourceId: primarySourceId(cluster),
                desk: bestScope(cluster),
            };
        });

    const newsPool = withMeta
        .filter((item) => item.route === "NEWS" && item.fit.score >= minFit)
        .sort((a, b) => b.rank - a.rank || b.fit.score - a.fit.score);

    const blogPool = withMeta
        .filter((item) => item.route === "BLOG" && item.fit.score >= minFit)
        .sort((a, b) => b.rank - a.rank || b.fit.score - a.fit.score);

    const selectedNews = [];
    const usedBuckets = new Set();
    const usedDesks = new Set();
    const sourceCounts = new Map();
    const bucketCounts = new Map();
    const softMaxPerBucket = 2;

    const canTake = (item) => (sourceCounts.get(item.sourceId) || 0) < maxPerSource;
    const bucketOpen = (item) => (bucketCounts.get(item.bucket) || 0) < softMaxPerBucket;
    const deskOpen = (item) => !usedDesks.has(item.desk);

    const take = (item) => {
        selectedNews.push(item);
        usedBuckets.add(item.bucket);
        usedDesks.add(item.desk);
        sourceCounts.set(item.sourceId, (sourceCounts.get(item.sourceId) || 0) + 1);
        bucketCounts.set(item.bucket, (bucketCounts.get(item.bucket) || 0) + 1);
    };

    // Pass 1: unused desks + unused diversity buckets.
    for (const item of newsPool) {
        if (selectedNews.length >= maxNews) break;
        if (!canTake(item) || !deskOpen(item)) continue;
        if (usedBuckets.has(item.bucket) && item.bucket !== "broader") continue;
        take(item);
    }

    // Pass 2: fill remaining open desks with next-best strong items.
    for (const item of newsPool) {
        if (selectedNews.length >= maxNews) break;
        if (selectedNews.includes(item) || !canTake(item) || !deskOpen(item)) continue;
        const otherBucketAvailable = newsPool.some((candidate) =>
            !selectedNews.includes(candidate)
            && canTake(candidate)
            && deskOpen(candidate)
            && candidate.bucket !== item.bucket
            && (bucketCounts.get(candidate.bucket) || 0) < softMaxPerBucket);
        if (!bucketOpen(item) && otherBucketAvailable) continue;
        take(item);
    }

    const selectedBlog = blogPool.slice(0, maxBlog);

    return {
        news: selectedNews.map((item) => ({
            ...item.cluster,
            editorialFit: item.fit,
            selectionRank: item.rank,
            diversityBucket: item.bucket,
            selectedDesk: item.desk,
        })),
        blog: selectedBlog.map((item) => ({
            ...item.cluster,
            editorialFit: item.fit,
            selectionRank: item.rank,
            diversityBucket: item.bucket,
        })),
        rejectedWeakFit: withMeta
            .filter((item) => item.fit.score < minFit)
            .map((item) => ({
                topic: item.cluster.canonicalTopic,
                route: item.route,
                fit: item.fit.score,
                rationale: item.fit.rationale,
            })),
        limits: { maxNews, maxBlog, minFit, maxPerSource },
    };
}

export function classifyRunStatus({ sourceResults = [], qualifiedCount = 0, selectedCount = 0 } = {}) {
    const attempted = sourceResults.length;
    const failed = sourceResults.filter((source) => !source.ok);
    const healthy = sourceResults.filter((source) => source.ok);

    if (attempted > 0 && healthy.length === 0) {
        return {
            status: "FAILED",
            rationale: "All configured sources failed; no usable research candidates.",
        };
    }
    if (qualifiedCount === 0 || selectedCount === 0) {
        return {
            status: "NO_QUALIFIED_STORY",
            rationale: failed.length
                ? "Usable sources responded but nothing survived editorial selection; some sources failed."
                : "Sources responded but nothing survived research qualification / editorial selection.",
        };
    }
    if (failed.length > 0) {
        return {
            status: "PARTIAL_SUCCESS",
            rationale: `${failed.length} of ${attempted} sources failed; selected editorial candidates remain.`,
        };
    }
    return {
        status: "SUCCESS",
        rationale: "All sources healthy and editorial candidates were selected.",
    };
}
