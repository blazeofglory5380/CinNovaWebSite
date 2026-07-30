const BLOG_SIGNALS = /\b(study|research|paper|analysis|guide|explainer|how to|framework|benchmark)\b/i;
const NEWS_SIGNALS = /\b(announces?|advisory|advisories|orders?|approves?|launches?|releases?|rule|policy|regulation|funding|acquires?|files?|charges?|vulnerabilit(?:y|ies)|cve-\d|icsa-|known exploited)\b/i;

export function routeCluster(cluster) {
    const headline = cluster.canonicalTopic || "";
    const summary = (cluster.sources || []).map((source) => source.summary || "").join(" ");
    const urls = (cluster.sources || []).map((source) => source.articleUrl || "").join(" ");
    const text = `${headline} ${summary} ${urls}`;
    if ((cluster.sources || []).every((source) => source.sourceTier === "TIER_4_DISCOVERY_ONLY")) {
        return { route: "SKIP", rationale: "Discovery-only sources cannot route directly to editorial desks." };
    }
    // Prefer NEWS when the full cluster (not just the short product headline) is an advisory/announcement.
    if (NEWS_SIGNALS.test(text)) {
        return { route: "NEWS", rationale: "Time-bound announcement or public-interest development fits a news desk." };
    }
    if (BLOG_SIGNALS.test(text)) {
        return { route: "BLOG", rationale: "Research or explanatory material is better suited to a sourced blog brief." };
    }
    return { route: "NEWS", rationale: "Time-bound announcement or public-interest development fits a news desk." };
}
