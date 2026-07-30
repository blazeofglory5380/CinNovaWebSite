import { normalizeCandidate } from "./normalize.mjs";

function decodeXml(value = "") {
    return value
        .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
        .replace(/<[^>]+>/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;|&apos;/g, "'")
        .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
        .replace(/\s+/g, " ")
        .trim();
}

function tag(block, names) {
    for (const name of names) {
        const match = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, "i"));
        if (match) return decodeXml(match[1]);
    }
    return "";
}

function linkFrom(block) {
    const atom = block.match(/<link\b[^>]*\bhref=["']([^"']+)["'][^>]*\/?>/i);
    return atom?.[1] || tag(block, ["link"]);
}

export function parseRssXml(xml, source, { retrievedAt = new Date() } = {}) {
    if (typeof xml !== "string" || !xml.trim()) return [];
    const blocks = [
        ...(xml.match(/<item\b[\s\S]*?<\/item>/gi) || []),
        ...(xml.match(/<entry\b[\s\S]*?<\/entry>/gi) || []),
    ];

    return blocks
        .map((block) => {
            const headline = tag(block, ["title"]);
            const guid = tag(block, ["guid", "id"]);
            const articleUrl = linkFrom(block) || (/^https:\/\//i.test(guid) ? guid : "");
            if (!headline || !articleUrl) return null;
            return normalizeCandidate({
                sourceId: source.id,
                sourceName: source.name,
                sourceTier: source.authorityTier,
                sourceUrl: source.feedUrl || source.homepage,
                articleUrl,
                headline,
                summary: tag(block, ["description", "summary", "content:encoded", "content"]),
                publishedAt: tag(block, ["pubDate", "published", "dc:date"]),
                updatedAt: tag(block, ["updated", "lastBuildDate"]),
                author: tag(block, ["author", "dc:creator"]),
                scope: source.scope,
                topics: source.topics,
                retrievedAt,
                guid,
            });
        })
        .filter(Boolean);
}
