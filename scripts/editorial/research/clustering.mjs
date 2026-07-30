import { createHash } from "node:crypto";
import { jaccard, tokenize } from "../../lib/editorial-dedupe.mjs";
import { classifyFreshness } from "./freshness.mjs";

const TIER_RANK = {
    TIER_1_PRIMARY: 4,
    TIER_2_HIGH_AUTHORITY: 3,
    TIER_3_REPUTABLE_SECONDARY: 2,
    TIER_4_DISCOVERY_ONLY: 1,
};

function entities(text = "") {
    const words = String(text).match(/\b[A-Z][A-Za-z0-9&.-]{2,}\b/g) || [];
    return [...new Set(words.filter((word) => !["The", "This", "That", "New"].includes(word)))];
}

function timeNear(a, b) {
    const aTime = Date.parse(a.publishedAt);
    const bTime = Date.parse(b.publishedAt);
    return Number.isFinite(aTime) && Number.isFinite(bTime) && Math.abs(aTime - bTime) <= 48 * 3_600_000;
}

/** Serial catalog/advisory templates that differ only by a count (One/Two/Four…). */
export function isCountVariantTemplate(aHeadline = "", bHeadline = "") {
    const normalize = (headline) => String(headline)
        .toLowerCase()
        .replace(/\b(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\b/g, "#")
        .replace(/\b(vulnerability|vulnerabilities)\b/g, "vuln")
        .replace(/[^a-z0-9#]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    const left = normalize(aHeadline);
    const right = normalize(bHeadline);
    return Boolean(left) && left === right && String(aHeadline).trim() !== String(bHeadline).trim();
}

function sharedEntities(a, b, { headlinesOnly = false } = {}) {
    const leftText = headlinesOnly ? a.headline : `${a.headline} ${a.summary}`;
    const rightText = headlinesOnly ? b.headline : `${b.headline} ${b.summary}`;
    const left = new Set(entities(leftText));
    return entities(rightText).filter((entity) => left.has(entity));
}

function candidateSimilarity(a, b) {
    const headline = jaccard(tokenize(a.headline), tokenize(b.headline));
    const entityList = sharedEntities(a, b);
    const headlineEntities = sharedEntities(a, b, { headlinesOnly: true });
    const entity = jaccard(
        entities(`${a.headline} ${a.summary}`),
        entities(`${b.headline} ${b.summary}`),
    );
    if (!timeNear(a, b) || isCountVariantTemplate(a.headline, b.headline)) {
        return { headline, entity, sharedEntityCount: entityList.length, match: false };
    }
    const sameSource = a.sourceId && a.sourceId === b.sourceId;
    // Same-source weak matches need 3+ shared headline entities so vendor-prefix
    // ICS advisories (Rockwell/Siemens product lines) do not collapse into one event.
    const match = sameSource
        ? headline >= 0.48 || (headline >= 0.3 && headlineEntities.length >= 3)
        : headline >= 0.48 || (headline >= 0.3 && entity >= 0.4);
    return { headline, entity, sharedEntityCount: entityList.length, match };
}

function buildCluster(members, now) {
    const sorted = [...members].sort((a, b) =>
        (TIER_RANK[b.sourceTier] || 0) - (TIER_RANK[a.sourceTier] || 0) ||
        Date.parse(b.publishedAt || 0) - Date.parse(a.publishedAt || 0));
    const dates = members.map((item) => item.publishedAt).filter(Boolean).sort();
    const allEntities = [...new Set(members.flatMap((item) => entities(`${item.headline} ${item.summary}`)))];
    const scopes = [...new Set(members.flatMap((item) => item.scope || []))];
    const topics = [...new Set(members.flatMap((item) => item.topics || []))];
    const primarySources = members.filter((item) => item.sourceTier === "TIER_1_PRIMARY");
    const secondarySources = members.filter((item) => ["TIER_2_HIGH_AUTHORITY", "TIER_3_REPUTABLE_SECONDARY"].includes(item.sourceTier));
    const newest = dates.at(-1) || "";
    const confidence = Math.min(1, 0.35 + primarySources.length * 0.3 + secondarySources.length * 0.15);
    const seed = sorted[0]?.headline || "empty";
    return {
        clusterId: `research-${createHash("sha1").update(seed.toLowerCase()).digest("hex").slice(0, 12)}`,
        canonicalTopic: seed,
        headlineCandidates: [...new Set(members.map((item) => item.headline))],
        sources: sorted,
        primarySources,
        secondarySources,
        publishedRange: { earliest: dates[0] || "", latest: newest },
        entities: allEntities,
        scope: scopes,
        topics,
        confidence: Number(confidence.toFixed(2)),
        freshness: classifyFreshness(newest, now),
        corroborated: false,
    };
}

export function clusterCandidates(candidates, { now = new Date() } = {}) {
    const groups = [];
    for (const candidate of candidates.filter((item) => item?.headline)) {
        const group = groups.find((existing) => existing.some((member) => candidateSimilarity(candidate, member).match));
        if (group) group.push(candidate);
        else groups.push([candidate]);
    }
    return groups.map((members) => buildCluster(members, now));
}
