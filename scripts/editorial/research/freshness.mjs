export const FRESHNESS_BUCKETS = ["BREAKING", "CURRENT", "RECENT", "BACKGROUND", "UNKNOWN"];

export function classifyFreshness(publishedAt, now = new Date()) {
    const published = publishedAt instanceof Date ? publishedAt : new Date(publishedAt);
    const current = now instanceof Date ? now : new Date(now);
    if (Number.isNaN(published.getTime()) || Number.isNaN(current.getTime())) return "UNKNOWN";
    const ageHours = (current.getTime() - published.getTime()) / 3_600_000;
    if (ageHours < 0) return ageHours >= -1 ? "BREAKING" : "UNKNOWN";
    if (ageHours <= 6) return "BREAKING";
    if (ageHours <= 24) return "CURRENT";
    if (ageHours <= 72) return "RECENT";
    return "BACKGROUND";
}

export function isFreshEnough(bucket, { requireFresh = true } = {}) {
    if (!requireFresh) return bucket !== "UNKNOWN";
    return ["BREAKING", "CURRENT", "RECENT"].includes(bucket);
}
