import { parseJsonFeed } from "./jsonFeed.mjs";
import { parseRssXml } from "./rss.mjs";

export function parseOfficialSource(payload, source, options = {}) {
    if (source.type === "json" || (typeof payload === "object" && payload !== null)) {
        return parseJsonFeed(payload, source, options);
    }
    return parseRssXml(String(payload || ""), source, options);
}
