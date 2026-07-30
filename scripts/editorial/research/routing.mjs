const BLOG_SIGNALS = /\b(study|research|paper|analysis|guide|explainer|how to|framework|benchmark)\b/i;
const NEWS_SIGNALS = /\b(announces?|advisory|orders?|approves?|launches?|releases?|rule|policy|regulation|funding|acquires?|files?|charges?)\b/i;

export function routeCluster(cluster) {
    const text = `${cluster.canonicalTopic || ""} ${(cluster.sources || []).map((source) => source.summary).join(" ")}`;
    if ((cluster.sources || []).every((source) => source.sourceTier === "TIER_4_DISCOVERY_ONLY")) {
        return { route: "SKIP", rationale: "Discovery-only sources cannot route directly to editorial desks." };
    }
    if (BLOG_SIGNALS.test(text) && !NEWS_SIGNALS.test(cluster.canonicalTopic || "")) {
        return { route: "BLOG", rationale: "Research or explanatory material is better suited to a sourced blog brief." };
    }
    return { route: "NEWS", rationale: "Time-bound announcement or public-interest development fits a news desk." };
}
