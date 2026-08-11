import { isDiscoveryOnlyTier, isPrimaryTier } from "./sourceTiers.mjs";

const BLOG_SIGNALS =
    /\b(study|research|paper|analysis|guide|explainer|how to|framework|benchmark|understanding|what .+ means|practical|overview|faq)\b/i;
const STANDARD_SIGNALS =
    /\b(nist|guidance|guideline|standard|best practice|sbom minimum|sp\s*\d|framework)\b/i;
const NEWS_SIGNALS =
    /\b(announces?|advisory|advisories|orders?|approves?|launches?|releases?|rule|policy|regulation|funding|acquires?|files?|charges?|vulnerabilit(?:y|ies)|cve-\d|icsa-|known exploited|breaking)\b/i;
const BREAKING_NEWS =
    /\b(breaking|just in|orders?|charges?|acquires?|funding|layoffs?|cve-\d|icsa-|known exploited|ransomware)\b/i;
const ICS_PRODUCT_ADVISORY =
    /\b(icsa-\d|c-cure|stimulator|hormone monitor|igss|victor application|rockwell|johnson controls|pulsetto|mira )\b/i;

export function routeCluster(cluster) {
    const headline = cluster.canonicalTopic || "";
    const summary = (cluster.sources || []).map((source) => source.summary || "").join(" ");
    const urls = (cluster.sources || []).map((source) => source.articleUrl || "").join(" ");
    const text = `${headline} ${summary} ${urls}`;
    if ((cluster.sources || []).every((source) => isDiscoveryOnlyTier(source.sourceTier))) {
        return { route: "SKIP", rationale: "Discovery-only sources cannot route directly to editorial desks." };
    }

    if (ICS_PRODUCT_ADVISORY.test(text) || /\b(icsa-|cve-\d|known exploited|ransomware)\b/i.test(text)) {
        return { route: "NEWS", rationale: "Security advisory / incident is time-bound News desk material." };
    }

    const evergreenPrimary =
        (cluster.freshness === "BACKGROUND" || cluster.freshness === "RECENT")
        && (cluster.sources || []).some((s) => isPrimaryTier(s.sourceTier))
        && (STANDARD_SIGNALS.test(text) || BLOG_SIGNALS.test(text))
        && !BREAKING_NEWS.test(headline);

    // Prefer Blog for evergreen explainers / standards; keep hard news on News desks.
    if (
        evergreenPrimary
        || (BLOG_SIGNALS.test(text) && !BREAKING_NEWS.test(text) && !/\b(advisory|advisories|icsa-|cve-)\b/i.test(text))
    ) {
        return {
            route: "BLOG",
            rationale:
                "Evergreen explainer, research, or authoritative standard fits sourced Blog — not breaking-news freshness.",
        };
    }
    if (NEWS_SIGNALS.test(text)) {
        return { route: "NEWS", rationale: "Time-bound announcement or public-interest development fits a news desk." };
    }
    if (BLOG_SIGNALS.test(text) || STANDARD_SIGNALS.test(text)) {
        return { route: "BLOG", rationale: "Research or explanatory material is better suited to a sourced blog brief." };
    }
    return { route: "NEWS", rationale: "Time-bound announcement or public-interest development fits a news desk." };
}
