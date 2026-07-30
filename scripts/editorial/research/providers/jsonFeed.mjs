import { normalizeCandidate } from "./normalize.mjs";

export function parseJsonFeed(json, source, { retrievedAt = new Date() } = {}) {
    let data = json;
    if (typeof json === "string") {
        try {
            data = JSON.parse(json);
        } catch {
            return [];
        }
    }
    const items = Array.isArray(data) ? data : data?.items || data?.entries || data?.results || [];
    if (!Array.isArray(items)) return [];

    return items
        .map((item) => {
            const articleUrl = item.url || item.external_url || item.link || item.id;
            const headline = item.title || item.headline || item.name;
            if (!articleUrl || !headline) return null;
            const author = typeof item.author === "string"
                ? item.author
                : item.author?.name || item.authors?.map((entry) => entry.name || entry).join(", ");
            return normalizeCandidate({
                sourceId: source.id,
                sourceName: source.name,
                sourceTier: source.authorityTier,
                sourceUrl: source.feedUrl || source.homepage,
                articleUrl,
                headline,
                summary: item.summary || item.content_text || item.description || item.abstract,
                publishedAt: item.date_published || item.published_at || item.published || item.created_at,
                updatedAt: item.date_modified || item.updated_at || item.updated,
                author,
                scope: source.scope,
                topics: source.topics,
                retrievedAt,
                guid: item.id,
            });
        })
        .filter(Boolean);
}
