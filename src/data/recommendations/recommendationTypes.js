/**
 * Phase 11.4C — recommendation item types (closed list).
 * FUTURE_COMMERCIAL exists for forward compatibility but stays disabled.
 */

export const RECOMMENDATION_TYPES = Object.freeze({
    NEWS: "NEWS",
    BLOG: "BLOG",
    RESOURCE: "RESOURCE",
    GUIDE: "GUIDE",
    PRODUCT: "PRODUCT",
    BOOK: "BOOK",
    OFFICIAL_RESOURCE: "OFFICIAL_RESOURCE",
    FUTURE_COMMERCIAL: "FUTURE_COMMERCIAL",
});

export const RECOMMENDATION_TYPE_LIST = Object.freeze(Object.values(RECOMMENDATION_TYPES));

/** Default priority (lower number = higher priority). */
export const DEFAULT_PRIORITY_WEIGHTS = Object.freeze({
    [RECOMMENDATION_TYPES.NEWS]: 1,
    [RECOMMENDATION_TYPES.BLOG]: 2,
    [RECOMMENDATION_TYPES.RESOURCE]: 3,
    [RECOMMENDATION_TYPES.GUIDE]: 4,
    [RECOMMENDATION_TYPES.BOOK]: 5,
    [RECOMMENDATION_TYPES.PRODUCT]: 6,
    [RECOMMENDATION_TYPES.OFFICIAL_RESOURCE]: 7,
    [RECOMMENDATION_TYPES.FUTURE_COMMERCIAL]: 8,
});

export const RECOMMENDATION_TYPE_LABELS = Object.freeze({
    [RECOMMENDATION_TYPES.NEWS]: "Related News",
    [RECOMMENDATION_TYPES.BLOG]: "Related Blog",
    [RECOMMENDATION_TYPES.RESOURCE]: "Resource",
    [RECOMMENDATION_TYPES.GUIDE]: "Guide",
    [RECOMMENDATION_TYPES.PRODUCT]: "Product",
    [RECOMMENDATION_TYPES.BOOK]: "Book",
    [RECOMMENDATION_TYPES.OFFICIAL_RESOURCE]: "Official Resource",
    [RECOMMENDATION_TYPES.FUTURE_COMMERCIAL]: "Commercial (disabled)",
});

export function isRecommendationType(value) {
    return RECOMMENDATION_TYPE_LIST.includes(value);
}

export function isCommercialRecommendationType(type) {
    return type === RECOMMENDATION_TYPES.FUTURE_COMMERCIAL;
}
