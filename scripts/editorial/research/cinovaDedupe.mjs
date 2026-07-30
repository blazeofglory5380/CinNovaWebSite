import { blogPosts } from "../../../src/data/blogPosts.js";
import { classifyNewsCandidate, jaccard, normalizeHeadline, tokenize } from "../../lib/editorial-dedupe.mjs";

const UPDATE_SIGNALS = /\b(update|expands?|extends?|new phase|additional|revised|follow-up|second|appeal|final rule)\b/i;

export function classifyAgainstCinova(cluster, options = {}) {
    const title = cluster.canonicalTopic || cluster.headlineCandidates?.[0] || "";
    const sourceSummary = (cluster.sources || []).map((source) => source.summary).join(" ");
    const result = classifyNewsCandidate({
        title,
        slug: "",
        location: cluster.scope?.join(", "),
        dek: sourceSummary,
        summary: sourceSummary,
    }, options);

    if (result.classification === "DUPLICATE") {
        if (UPDATE_SIGNALS.test(`${title} ${sourceSummary}`)) {
            return { classification: "UPDATE", score: result.score, rationale: "Matches prior CinNova coverage and contains an explicit development signal.", matches: result.matches };
        }
        return { classification: "DUPLICATE", score: result.score, rationale: result.rationale, matches: result.matches };
    }
    if (result.classification === "UPDATE") {
        return { classification: "UPDATE", score: result.score, rationale: result.rationale, matches: result.matches };
    }
    if (result.classification === "FOLLOW-UP") {
        return { classification: "RELATED", score: result.score, rationale: result.rationale, matches: result.matches };
    }

    const blogs = options.blogCatalog || blogPosts;
    const blogMatch = blogs
        .map((post) => ({ slug: post.slug, similarity: jaccard(tokenize(title), tokenize(post.title || "")) }))
        .sort((a, b) => b.similarity - a.similarity)[0];
    if (blogMatch?.similarity >= 0.82 || blogs.some((post) => normalizeHeadline(post.title) === normalizeHeadline(title))) {
        return {
            classification: "RELATED",
            score: blogMatch?.similarity || 1,
            rationale: `Closely related to existing CinNova blog coverage \`${blogMatch?.slug || "existing-post"}\`.`,
            matches: blogMatch ? [blogMatch] : [],
        };
    }
    return { classification: "NEW", score: 1, rationale: "No strong match in CinNova news or blog catalogs.", matches: [] };
}
