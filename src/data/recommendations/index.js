/**
 * Phase 11.4C — public recommendation engine API.
 */

export {
    RECOMMENDATION_TYPES,
    RECOMMENDATION_TYPE_LIST,
    RECOMMENDATION_TYPE_LABELS,
    DEFAULT_PRIORITY_WEIGHTS,
    isRecommendationType,
    isCommercialRecommendationType,
} from "./recommendationTypes.js";

export {
    RECOMMENDATION_CONFIG,
    getRecommendationConfig,
    isRecommendationEngineEnabled,
    isCommercialSlotEnabled,
} from "./recommendationConfig.js";

export {
    CATEGORY_MAPPINGS,
    PAGE_TYPE_DEFAULT_TOPICS,
    PRODUCT_TOPIC_MAP,
    BOOK_TOPIC_MAP,
    FUTURE_COMMERCIAL_PLACEHOLDER,
    detectTopicKeys,
    getMappingForTopic,
    listCategoryMappingKeys,
} from "./categoryMappings.js";

export {
    runRecommendationEngine,
    getRecommendationsForPage,
    rankRecommendations,
    diversifyRecommendations,
} from "./ruleEngine.js";

/**
 * Build a normalized context object for common page surfaces.
 */
export function buildRecommendationContext(partial = {}) {
    return {
        pageType: partial.pageType || "home",
        route: partial.route || "/",
        title: partial.title || "",
        category: partial.category || "",
        tags: partial.tags || [],
        seoKeywords: partial.seoKeywords || [],
        entities: partial.entities || [],
        excerpt: partial.excerpt || "",
        dek: partial.dek || "",
        summary: partial.summary || "",
        topics: partial.topics || [],
        relatedNewsIds: partial.relatedNewsIds || [],
        relatedBlogSlugs: partial.relatedBlogSlugs || [],
        relatedReading: partial.relatedReading || [],
        newsId: partial.newsId || null,
        newsSlug: partial.newsSlug || null,
        blogSlug: partial.blogSlug || null,
        resourceSlug: partial.resourceSlug || null,
        guideKey: partial.guideKey || null,
        productPage: partial.productPage || null,
        bookSlug: partial.bookSlug || null,
    };
}
