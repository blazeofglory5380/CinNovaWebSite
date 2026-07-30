import { RELEVANCE_TOPICS } from "../../lib/editorial-research.mjs";

export function scoreCinovaRelevance(text = "") {
    const haystack = String(text).toLowerCase();
    return RELEVANCE_TOPICS.reduce((score, topic) => score + (haystack.includes(topic) ? 1 : 0), 0);
}
