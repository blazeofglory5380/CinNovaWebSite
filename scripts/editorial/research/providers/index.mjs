import { safeFetch } from "../urlSafety.mjs";
import { parseJsonFeed } from "./jsonFeed.mjs";
import { parseOfficialSource } from "./officialSource.mjs";
import { parseRssXml } from "./rss.mjs";

function parsePayload(payload, source, options) {
    if (source.type === "json") return parseJsonFeed(payload, source, options);
    if (source.type === "official") return parseOfficialSource(payload, source, options);
    if (source.type === "rss") return parseRssXml(String(payload || ""), source, options);
    if (typeof payload === "string") return parseRssXml(payload, source, options);
    return [];
}

export async function fetchSourceCandidates(source, { fixtureText, fixtureJson, retrievedAt } = {}) {
    if (fixtureJson !== undefined) return parsePayload(fixtureJson, { ...source, type: "json" }, { retrievedAt });
    if (fixtureText !== undefined) return parsePayload(fixtureText, source, { retrievedAt });
    if (!source.active || !source.feedUrl) return [];

    const response = await safeFetch(source.feedUrl);
    if (!response.ok) throw new Error(`${source.id}: ${response.error || `HTTP ${response.status}`}`);
    return parsePayload(response.text, source, { retrievedAt });
}
