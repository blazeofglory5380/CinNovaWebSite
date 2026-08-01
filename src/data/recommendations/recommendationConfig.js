/**
 * Phase 11.4C — recommendation engine configuration (code/config only).
 * No public admin UI. commercialSlotEnabled defaults FALSE.
 */

import {
    DEFAULT_PRIORITY_WEIGHTS,
    RECOMMENDATION_TYPES,
} from "./recommendationTypes.js";

export const RECOMMENDATION_CONFIG = Object.freeze({
    enableRecommendations: true,
    maximumRecommendations: 8,
    commercialSlotEnabled: false,
    bookOrdering: Object.freeze([
        "the-southeast-asian-table",
        "beyond-the-last-light",
        "nightmare-forest",
        "kiddo-illustrated-collection",
    ]),
    priorityWeights: DEFAULT_PRIORITY_WEIGHTS,
    /** Types allowed in the public rail when commercial is off. */
    enabledTypes: Object.freeze([
        RECOMMENDATION_TYPES.NEWS,
        RECOMMENDATION_TYPES.BLOG,
        RECOMMENDATION_TYPES.RESOURCE,
        RECOMMENDATION_TYPES.GUIDE,
        RECOMMENDATION_TYPES.PRODUCT,
        RECOMMENDATION_TYPES.BOOK,
        RECOMMENDATION_TYPES.OFFICIAL_RESOURCE,
    ]),
});

/**
 * @param {Partial<typeof RECOMMENDATION_CONFIG>} [overrides]
 */
export function getRecommendationConfig(overrides = {}) {
    const merged = {
        ...RECOMMENDATION_CONFIG,
        ...overrides,
        priorityWeights: {
            ...RECOMMENDATION_CONFIG.priorityWeights,
            ...(overrides.priorityWeights || {}),
        },
        bookOrdering: overrides.bookOrdering
            ? [...overrides.bookOrdering]
            : [...RECOMMENDATION_CONFIG.bookOrdering],
        enabledTypes: overrides.enabledTypes
            ? [...overrides.enabledTypes]
            : [...RECOMMENDATION_CONFIG.enabledTypes],
    };

    // Hard fail-closed: commercial slot cannot enable FUTURE_COMMERCIAL alone.
    if (!merged.commercialSlotEnabled) {
        merged.enabledTypes = merged.enabledTypes.filter(
            (type) => type !== RECOMMENDATION_TYPES.FUTURE_COMMERCIAL,
        );
    }

    return Object.freeze(merged);
}

export function isRecommendationEngineEnabled(config = RECOMMENDATION_CONFIG) {
    return config.enableRecommendations === true;
}

export function isCommercialSlotEnabled(config = RECOMMENDATION_CONFIG) {
    return config.commercialSlotEnabled === true;
}
