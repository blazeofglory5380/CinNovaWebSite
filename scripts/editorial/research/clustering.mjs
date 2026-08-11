import { createHash } from "node:crypto";
import { jaccard, tokenize } from "../../lib/editorial-dedupe.mjs";
import { classifyFreshness } from "./freshness.mjs";
import { TIER_RANK, isPrimaryTier, canonicalizeTier, SOURCE_TIERS } from "./sourceTiers.mjs";

const COMPANY_ALIASES = Object.freeze([
    { id: "openai", pattern: /\b(openai|chatgpt|gpt-4|gpt-5|sora)\b/i },
    { id: "anthropic", pattern: /\b(anthropic|claude)\b/i },
    { id: "google", pattern: /\b(google|alphabet|deepmind|gemini|bard)\b/i },
    { id: "microsoft", pattern: /\b(microsoft|azure|openai partnership)\b/i },
    { id: "meta", pattern: /\b(meta|facebook|llama|threads)\b/i },
    { id: "apple", pattern: /\b(apple|iphone|ipad|wwdc)\b/i },
    { id: "nvidia", pattern: /\b(nvidia|geforce|cuda|blackwell)\b/i },
    { id: "amazon", pattern: /\b(amazon|aws|alexa)\b/i },
    { id: "nist", pattern: /\b(nist)\b/i },
    { id: "cisa", pattern: /\b(cisa)\b/i },
    { id: "nasa", pattern: /\b(nasa|webb|artemis)\b/i },
    { id: "sec", pattern: /\b(\bsec\b|securities and exchange)\b/i },
    { id: "fda", pattern: /\b(fda)\b/i },
    { id: "ftc", pattern: /\b(ftc)\b/i },
]);

const EVENT_VERBS = /\b(announc\w*|launch\w*|acquir\w*|merg\w*|charg\w*|sue[sd]?|orders?|finaliz\w*|releas\w*|unveil\w*|partners?\w*|fund\w*|invest\w*)\b/i;

function entities(text = "") {
    const words = String(text).match(/\b[A-Z][A-Za-z0-9&.-]{2,}\b/g) || [];
    return [...new Set(words.filter((word) => !["The", "This", "That", "New"].includes(word)))];
}

function companyIds(text = "") {
    return COMPANY_ALIASES.filter((entry) => entry.pattern.test(text)).map((entry) => entry.id);
}

function timeNear(a, b, hours = 72) {
    const aTime = Date.parse(a.publishedAt);
    const bTime = Date.parse(b.publishedAt);
    return Number.isFinite(aTime) && Number.isFinite(bTime) && Math.abs(aTime - bTime) <= hours * 3_600_000;
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

function sharedCompanies(a, b) {
    const left = new Set(companyIds(`${a.headline} ${a.summary || ""}`));
    return companyIds(`${b.headline} ${b.summary || ""}`).filter((id) => left.has(id));
}

function candidateSimilarity(a, b) {
    const headline = jaccard(tokenize(a.headline), tokenize(b.headline));
    const entityList = sharedEntities(a, b);
    const headlineEntities = sharedEntities(a, b, { headlinesOnly: true });
    const entity = jaccard(
        entities(`${a.headline} ${a.summary}`),
        entities(`${b.headline} ${b.summary}`),
    );
    const companies = sharedCompanies(a, b);
    const bothHaveEventVerb = EVENT_VERBS.test(a.headline || "") && EVENT_VERBS.test(b.headline || "");

    if (!timeNear(a, b) || isCountVariantTemplate(a.headline, b.headline)) {
        return {
            headline,
            entity,
            sharedEntityCount: entityList.length,
            sharedCompanies: companies,
            match: false,
        };
    }

    const sameSource = a.sourceId && a.sourceId === b.sourceId;
    // Same-source weak matches need 3+ shared headline entities so vendor-prefix
    // ICS advisories (Rockwell/Siemens product lines) do not collapse into one event.
    let match = sameSource
        ? headline >= 0.48 || (headline >= 0.3 && headlineEntities.length >= 3)
        : headline >= 0.48 || (headline >= 0.3 && entity >= 0.4);

    // Cross-source: company newsroom + newsroom covering same company/event.
    if (!match && !sameSource && companies.length >= 1 && bothHaveEventVerb && headline >= 0.22) {
        match = true;
    }
    if (!match && !sameSource && companies.length >= 1 && headlineEntities.length >= 2 && headline >= 0.28) {
        match = true;
    }
    // Cross-source topical overlap when the same company appears in both headlines.
    if (!match && !sameSource && companies.length >= 1) {
        const companyInBothHeadlines = companies.some((id) => {
            const alias = COMPANY_ALIASES.find((entry) => entry.id === id);
            return alias && alias.pattern.test(a.headline || "") && alias.pattern.test(b.headline || "");
        });
        const topical = jaccard(
            tokenize(a.headline || "").filter((token) => token.length > 3),
            tokenize(b.headline || "").filter((token) => token.length > 3),
        );
        if (companyInBothHeadlines && topical >= 0.24) {
            match = true;
        }
    }

    return {
        headline,
        entity,
        sharedEntityCount: entityList.length,
        sharedCompanies: companies,
        match,
    };
}

function tierRank(tier) {
    return TIER_RANK[tier] || TIER_RANK[canonicalizeTier(tier)] || 0;
}

function buildCluster(members, now) {
    const sorted = [...members].sort((a, b) =>
        tierRank(b.sourceTier) - tierRank(a.sourceTier)
        || Date.parse(b.publishedAt || 0) - Date.parse(a.publishedAt || 0));
    const dates = members.map((item) => item.publishedAt).filter(Boolean).sort();
    const allEntities = [...new Set(members.flatMap((item) => entities(`${item.headline} ${item.summary}`)))];
    const allCompanies = [...new Set(members.flatMap((item) => companyIds(`${item.headline} ${item.summary || ""}`)))];
    const scopes = [...new Set(members.flatMap((item) => item.scope || []))];
    const topics = [...new Set(members.flatMap((item) => item.topics || []))];
    const primarySources = members.filter((item) => isPrimaryTier(item.sourceTier));
    const secondarySources = members.filter((item) => {
        const tier = canonicalizeTier(item.sourceTier);
        return tier === SOURCE_TIERS.TIER_1_NEWS || tier === SOURCE_TIERS.TIER_2_REPUTABLE
            || tier === "TIER_2_HIGH_AUTHORITY" || item.sourceTier === "TIER_3_REPUTABLE_SECONDARY";
    });
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
        companies: allCompanies,
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

export { candidateSimilarity as candidateSimilarityForTests, companyIds as companyIdsForTests };
