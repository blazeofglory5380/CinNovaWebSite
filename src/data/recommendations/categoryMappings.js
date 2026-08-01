/**
 * Phase 11.4C — deterministic category / entity mappings.
 * Official resources are public company websites for editorial context —
 * not partnerships, affiliates, or commercial destinations.
 *
 * Keep labels specific. Broad tokens (e.g. bare "infrastructure", "ai",
 * "guide") create misleading cross-topic recommendations.
 */

import { RECOMMENDATION_TYPES } from "./recommendationTypes.js";

/**
 * Topic keys used by the rule engine when scoring context text.
 * Each mapping lists preferred recommendation targets by type.
 */
export const CATEGORY_MAPPINGS = Object.freeze({
    anthropic: Object.freeze({
        labels: Object.freeze(["anthropic", "claude"]),
        officialCatalogIds: Object.freeze(["anthropic"]),
        guideKeys: Object.freeze(["claude-beginner-guide"]),
        blogHints: Object.freeze(["claude", "anthropic", "ai safety", "agent governance"]),
        newsHints: Object.freeze(["anthropic", "claude"]),
        resourceHints: Object.freeze(["ai product launch", "study planning"]),
        productPages: Object.freeze(["studynest"]),
    }),
    openai: Object.freeze({
        labels: Object.freeze(["openai", "chatgpt"]),
        officialCatalogIds: Object.freeze(["openai"]),
        guideKeys: Object.freeze(["chatgpt-beginner-guide"]),
        blogHints: Object.freeze(["openai", "chatgpt", "gpt-"]),
        newsHints: Object.freeze(["openai", "chatgpt"]),
        resourceHints: Object.freeze(["ai product launch", "study planning"]),
        productPages: Object.freeze(["studynest"]),
    }),
    data_center: Object.freeze({
        labels: Object.freeze([
            "data center",
            "data-center",
            "datacenter",
            "power grid",
            "hyperscale",
            "gigawatt",
        ]),
        officialCatalogIds: Object.freeze([
            "nvidia",
            "aws",
            "microsoft-azure",
            "google-cloud",
        ]),
        // Official public sites not yet in partner catalog (editorial reference only).
        officialExtras: Object.freeze([
            Object.freeze({
                id: "amd-official",
                companyName: "AMD",
                officialWebsite: "https://www.amd.com/",
            }),
            Object.freeze({
                id: "intel-official",
                companyName: "Intel",
                officialWebsite: "https://www.intel.com/",
            }),
        ]),
        blogHints: Object.freeze([
            "data center",
            "power grid",
            "gold rush",
            "financed",
            "joint venture",
        ]),
        newsHints: Object.freeze(["data center", "qts", "ferc", "el paso", "camellia"]),
        resourceHints: Object.freeze(["real estate deal", "cash flow"]),
        productPages: Object.freeze(["real-estate"]),
    }),
    cookbook: Object.freeze({
        labels: Object.freeze(["cookbook", "cooking", "recipe", "southeast asian", "cuisine"]),
        bookSlugs: Object.freeze(["the-southeast-asian-table"]),
        blogHints: Object.freeze(["recipe", "cooking", "southeast asian"]),
        resourceHints: Object.freeze([]),
        productPages: Object.freeze([]),
    }),
    fiction_series: Object.freeze({
        labels: Object.freeze([
            "nightmare forest",
            "beyond the last light",
            "illustrated fiction",
        ]),
        bookSlugs: Object.freeze([
            "beyond-the-last-light",
            "nightmare-forest",
            "kiddo-illustrated-collection",
        ]),
        blogHints: Object.freeze([]),
        resourceHints: Object.freeze([]),
        // Kiddo product is related only via the illustrated-collection book path,
        // not as a default fiction recommendation.
        productPages: Object.freeze([]),
    }),
    education_ai: Object.freeze({
        labels: Object.freeze(["education", "study", "learning", "student", "school"]),
        guideKeys: Object.freeze([
            "ai-prompt-writing-guide",
            "chatgpt-beginner-guide",
            "claude-beginner-guide",
        ]),
        blogHints: Object.freeze(["education", "study", "learning", "student"]),
        newsHints: Object.freeze(["education", "school"]),
        resourceHints: Object.freeze(["study planning", "student study"]),
        productPages: Object.freeze(["studynest", "kiddo"]),
        bookSlugs: Object.freeze(["kiddo-illustrated-collection"]),
    }),
    safety: Object.freeze({
        labels: Object.freeze(["safety", "poison", "hazard", "family safety"]),
        blogHints: Object.freeze(["safety", "poison", "family"]),
        resourceHints: Object.freeze(["family safety", "poison"]),
        productPages: Object.freeze(["poisonguard"]),
    }),
    real_estate: Object.freeze({
        labels: Object.freeze(["real estate", "rental", "property", "mortgage"]),
        blogHints: Object.freeze(["real estate", "rental", "property"]),
        resourceHints: Object.freeze(["real estate", "rental", "cash flow"]),
        productPages: Object.freeze(["real-estate"]),
    }),
});

export const PAGE_TYPE_DEFAULT_TOPICS = Object.freeze({
    home: Object.freeze(["education_ai"]),
    products: Object.freeze(["education_ai", "safety", "real_estate"]),
    product: Object.freeze([]),
    books: Object.freeze(["cookbook", "fiction_series"]),
    book: Object.freeze([]),
    news: Object.freeze([]),
    "news-story": Object.freeze([]),
    blog: Object.freeze(["education_ai"]),
    article: Object.freeze([]),
    resources: Object.freeze(["education_ai", "safety", "real_estate"]),
    resource: Object.freeze([]),
    guides: Object.freeze(["education_ai", "openai", "anthropic"]),
    guide: Object.freeze([]),
    company: Object.freeze(["education_ai"]),
});

/** Product page key → default topic keys. */
export const PRODUCT_TOPIC_MAP = Object.freeze({
    studynest: Object.freeze(["education_ai"]),
    kiddo: Object.freeze(["education_ai"]),
    poisonguard: Object.freeze(["safety"]),
    techmate: Object.freeze(["openai", "anthropic"]),
    "real-estate": Object.freeze(["real_estate", "data_center"]),
});

/** Book slug → default topic keys. */
export const BOOK_TOPIC_MAP = Object.freeze({
    "the-southeast-asian-table": Object.freeze(["cookbook"]),
    "beyond-the-last-light": Object.freeze(["fiction_series"]),
    "nightmare-forest": Object.freeze(["fiction_series"]),
    "kiddo-illustrated-collection": Object.freeze(["fiction_series", "education_ai"]),
});

/** Minimum score for a candidate to enter the ranked pool. */
export const MIN_RECOMMENDATION_SCORE = 16;

/**
 * Detect topic keys from free text + structured fields.
 * @param {{ title?: string, category?: string, tags?: string[], excerpt?: string, dek?: string, summary?: string }} input
 * @returns {string[]}
 */
export function detectTopicKeys(input = {}) {
    const haystack = [
        input.title,
        input.category,
        input.excerpt,
        input.dek,
        input.summary,
        ...(input.tags || []),
        ...(input.seoKeywords || []),
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    const matched = [];
    for (const [topicKey, mapping] of Object.entries(CATEGORY_MAPPINGS)) {
        if (mapping.labels.some((label) => haystack.includes(label.toLowerCase()))) {
            matched.push(topicKey);
        }
    }
    return matched;
}

export function getMappingForTopic(topicKey) {
    return CATEGORY_MAPPINGS[topicKey] || null;
}

export function listCategoryMappingKeys() {
    return Object.keys(CATEGORY_MAPPINGS);
}

/** Type used only for documentation / future enablement checks. */
export const FUTURE_COMMERCIAL_PLACEHOLDER = Object.freeze({
    type: RECOMMENDATION_TYPES.FUTURE_COMMERCIAL,
    enabled: false,
    note: "Reserved. Never emitted while commercialSlotEnabled is false.",
});
