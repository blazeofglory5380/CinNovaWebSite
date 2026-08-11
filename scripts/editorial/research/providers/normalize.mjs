import { createHash } from "node:crypto";

function clean(value) {
    return String(value || "")
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, '"')
        .replace(/\s+/g, " ")
        .trim();
}

function isoDate(value) {
    if (!value) return "";
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

export function normalizeCandidate(partial = {}) {
    const headline = clean(partial.headline || partial.title);
    const articleUrl = clean(partial.articleUrl || partial.url || partial.guid);
    const fingerprintInput = [
        partial.sourceId,
        partial.guid,
        articleUrl,
        headline.toLowerCase(),
        partial.publishedAt,
    ].filter(Boolean).join("|");

    return {
        sourceId: clean(partial.sourceId),
        sourceName: clean(partial.sourceName),
        sourceTier: clean(partial.sourceTier),
        sourceUrl: clean(partial.sourceUrl),
        articleUrl,
        headline,
        summary: clean(partial.summary || partial.description),
        publishedAt: isoDate(partial.publishedAt || partial.datePublished),
        updatedAt: isoDate(partial.updatedAt || partial.dateModified),
        author: clean(partial.author),
        scope: [...new Set(Array.isArray(partial.scope) ? partial.scope.filter(Boolean) : [])],
        topics: [...new Set(Array.isArray(partial.topics) ? partial.topics.filter(Boolean) : [])],
        retrievedAt: isoDate(partial.retrievedAt || new Date()),
        rawFingerprint: createHash("sha256").update(fingerprintInput).digest("hex"),
        guid: clean(partial.guid),
    };
}
