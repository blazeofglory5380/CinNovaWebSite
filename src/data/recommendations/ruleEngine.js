/**
 * Phase 11.4C — deterministic recommendation rule engine (no LLM / no personalization).
 */

import { getPublicNewsStories, getNewsStoryById, getNewsStoryUrl } from "../newsPosts.js";
import { getPublishedBlogPosts, getPostBySlug, getArticleUrl } from "../blogPosts.js";
import { resources, getResourceBySlug, getResourceUrl } from "../resources.js";
import { products, getProductByPage, getProductUrl } from "../products.js";
import {
    getCatalogBooks,
    getBookPath,
    BOOK_RELEASE_STATUSES,
    statusLabel,
} from "../booksCatalog.js";
import {
    getPartnerCatalogEntry,
    listPartnerCatalog,
} from "../affiliate/partnerCatalog.js";
import {
    PUBLIC_PAGE_ROUTES,
    getPublicPagePath,
} from "../publicPageRoutes.js";
import {
    RECOMMENDATION_TYPES,
    isCommercialRecommendationType,
} from "./recommendationTypes.js";
import { getRecommendationConfig, isRecommendationEngineEnabled } from "./recommendationConfig.js";
import {
    BOOK_TOPIC_MAP,
    PAGE_TYPE_DEFAULT_TOPICS,
    PRODUCT_TOPIC_MAP,
    detectTopicKeys,
    getMappingForTopic,
} from "./categoryMappings.js";

function normalizeText(...parts) {
    return parts
        .flat()
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
}

function includesAny(haystack, hints = []) {
    if (!haystack || !hints.length) return false;
    return hints.some((hint) => haystack.includes(String(hint).toLowerCase()));
}

function uniqueByKey(items, keyFn) {
    const seen = new Set();
    const out = [];
    for (const item of items) {
        const key = keyFn(item);
        if (!key || seen.has(key)) continue;
        seen.add(key);
        out.push(item);
    }
    return out;
}

function scoreHintMatch(haystack, hints = [], weight = 10) {
    let score = 0;
    for (const hint of hints) {
        if (haystack.includes(String(hint).toLowerCase())) score += weight;
    }
    return score;
}

function makeItem({
    type,
    id,
    title,
    href,
    external = false,
    category = "",
    description = "",
    meta = {},
    score = 0,
    reason = "",
}) {
    return {
        type,
        id: String(id),
        title,
        href,
        external: Boolean(external),
        category,
        description,
        meta,
        score,
        reason,
    };
}

function resolveTopics(context = {}) {
    const topics = new Set();
    (context.topics || []).forEach((t) => topics.add(t));
    (PAGE_TYPE_DEFAULT_TOPICS[context.pageType] || []).forEach((t) => topics.add(t));

    if (context.productPage && PRODUCT_TOPIC_MAP[context.productPage]) {
        PRODUCT_TOPIC_MAP[context.productPage].forEach((t) => topics.add(t));
    }
    if (context.bookSlug && BOOK_TOPIC_MAP[context.bookSlug]) {
        BOOK_TOPIC_MAP[context.bookSlug].forEach((t) => topics.add(t));
    }

    detectTopicKeys({
        title: context.title,
        category: context.category,
        tags: context.tags,
        seoKeywords: context.seoKeywords,
        excerpt: context.excerpt,
        dek: context.dek,
        summary: context.summary,
    }).forEach((t) => topics.add(t));

    return [...topics];
}

function guideEntries() {
    return PUBLIC_PAGE_ROUTES.filter(
        (route) => route.group === "guide" && route.language === "en",
    );
}

function collectNewsCandidates(context, topics, excludeIds) {
    const stories = getPublicNewsStories();
    const byExplicit = (context.relatedNewsIds || [])
        .map((id) => getNewsStoryById(id))
        .filter(Boolean);

    const scored = stories.map((story) => {
        if (excludeIds.has(`news:${story.id}`) || excludeIds.has(`news:${story.slug}`)) {
            return null;
        }
        let score = 0;
        const hay = normalizeText(story.title, story.dek, story.summary, story.category);
        if (context.category && story.category === context.category) score += 8;
        for (const topic of topics) {
            const mapping = getMappingForTopic(topic);
            if (!mapping) continue;
            score += scoreHintMatch(hay, mapping.newsHints, 12);
            score += scoreHintMatch(hay, mapping.labels, 6);
        }
        if (byExplicit.some((s) => s.id === story.id)) score += 40;
        if (score <= 0) return null;
        return makeItem({
            type: RECOMMENDATION_TYPES.NEWS,
            id: story.id,
            title: story.title,
            href: getNewsStoryUrl(story).replace(/^https?:\/\/[^/]+/, "") || `/news/${story.slug}`,
            category: story.coverageLevel || story.category || "News",
            description: story.dek || story.summary || "",
            meta: { slug: story.slug },
            score,
            reason: "related-news",
        });
    }).filter(Boolean);

    return uniqueByKey([...byExplicit.map((story) => makeItem({
        type: RECOMMENDATION_TYPES.NEWS,
        id: story.id,
        title: story.title,
        href: getNewsStoryUrl(story).replace(/^https?:\/\/[^/]+/, "") || `/news/${story.slug}`,
        category: story.coverageLevel || story.category || "News",
        description: story.dek || story.summary || "",
        meta: { slug: story.slug },
        score: 50,
        reason: "explicit-related-news",
    })), ...scored], (item) => item.id);
}

function collectBlogCandidates(context, topics, excludeIds) {
    const posts = getPublishedBlogPosts();
    const explicit = (context.relatedBlogSlugs || context.relatedReading || [])
        .map((slug) => (typeof slug === "string" ? getPostBySlug(slug) : getPostBySlug(slug?.slug)))
        .filter(Boolean);

    const scored = posts.map((post) => {
        if (excludeIds.has(`blog:${post.slug}`) || excludeIds.has(`blog:${post.id}`)) {
            return null;
        }
        let score = 0;
        const hay = normalizeText(post.title, post.excerpt, post.category, post.tags, post.seoKeywords);
        if (context.category && post.category === context.category) score += 10;
        for (const topic of topics) {
            const mapping = getMappingForTopic(topic);
            if (!mapping) continue;
            score += scoreHintMatch(hay, mapping.blogHints, 12);
            score += scoreHintMatch(hay, mapping.labels, 6);
        }
        if (explicit.some((p) => p.slug === post.slug)) score += 40;
        if (score <= 0) return null;
        return makeItem({
            type: RECOMMENDATION_TYPES.BLOG,
            id: post.slug,
            title: post.title,
            href: getArticleUrl(post).replace(/^https?:\/\/[^/]+/, "") || `/blog/${post.slug}`,
            category: post.category || "Blog",
            description: post.excerpt || "",
            meta: { slug: post.slug },
            score,
            reason: "related-blog",
        });
    }).filter(Boolean);

    return uniqueByKey([
        ...explicit.map((post) => makeItem({
            type: RECOMMENDATION_TYPES.BLOG,
            id: post.slug,
            title: post.title,
            href: getArticleUrl(post).replace(/^https?:\/\/[^/]+/, "") || `/blog/${post.slug}`,
            category: post.category || "Blog",
            description: post.excerpt || "",
            meta: { slug: post.slug },
            score: 50,
            reason: "explicit-related-blog",
        })),
        ...scored,
    ], (item) => item.id);
}

function collectResourceCandidates(context, topics, excludeIds) {
    return resources
        .map((resource) => {
            if (excludeIds.has(`resource:${resource.slug}`)) return null;
            let score = 0;
            const hay = normalizeText(
                resource.title,
                resource.description,
                resource.category,
                resource.product,
            );
            if (context.category && resource.category === context.category) score += 8;
            for (const topic of topics) {
                const mapping = getMappingForTopic(topic);
                if (!mapping) continue;
                score += scoreHintMatch(hay, mapping.resourceHints, 10);
                score += scoreHintMatch(hay, mapping.labels, 4);
            }
            if (score <= 0) return null;
            return makeItem({
                type: RECOMMENDATION_TYPES.RESOURCE,
                id: resource.slug,
                title: resource.title,
                href: getResourceUrl(resource.slug).replace(/^https?:\/\/[^/]+/, "") || `/resources/${resource.slug}`,
                category: resource.category || "Resource",
                description: resource.description || "",
                meta: { slug: resource.slug },
                score,
                reason: "related-resource",
            });
        })
        .filter(Boolean);
}

function collectGuideCandidates(topics, excludeIds) {
    const guides = guideEntries();
    return guides
        .map((guide) => {
            if (excludeIds.has(`guide:${guide.key}`)) return null;
            let score = 0;
            const hay = normalizeText(guide.title, guide.description, guide.key, guide.path);
            for (const topic of topics) {
                const mapping = getMappingForTopic(topic);
                if (!mapping) continue;
                if ((mapping.guideKeys || []).includes(guide.key)) score += 30;
                score += scoreHintMatch(hay, mapping.labels, 8);
                score += scoreHintMatch(hay, mapping.blogHints, 4);
            }
            if (score <= 0) return null;
            const path = getPublicPagePath(guide.key) || guide.path;
            return makeItem({
                type: RECOMMENDATION_TYPES.GUIDE,
                id: guide.key,
                title: guide.title,
                href: path,
                category: "Guide",
                description: guide.description || "",
                meta: { pageKey: guide.key },
                score,
                reason: "related-guide",
            });
        })
        .filter(Boolean);
}

function collectProductCandidates(topics, excludeIds, context) {
    return products
        .map((product) => {
            if (
                excludeIds.has(`product:${product.page}`) ||
                context.productPage === product.page
            ) {
                return null;
            }
            let score = 0;
            for (const topic of topics) {
                const mapping = getMappingForTopic(topic);
                if (!mapping) continue;
                if ((mapping.productPages || []).includes(product.page)) score += 28;
            }
            if (context.pageType === "home" || context.pageType === "products") score += 4;
            if (score <= 0) return null;
            return makeItem({
                type: RECOMMENDATION_TYPES.PRODUCT,
                id: product.page,
                title: product.name,
                href: getProductUrl(product.page).replace(/^https?:\/\/[^/]+/, "") || `/products/${product.page}`,
                category: product.category || "Product",
                description: product.description || "",
                meta: { page: product.page, status: product.status },
                score,
                reason: "related-product",
            });
        })
        .filter(Boolean);
}

function collectBookCandidates(topics, excludeIds, context, config) {
    const books = getCatalogBooks();
    const preferredOrder = config.bookOrdering || [];

    return books
        .map((book) => {
            if (
                excludeIds.has(`book:${book.slug}`) ||
                context.bookSlug === book.slug
            ) {
                return null;
            }
            let score = 0;
            for (const topic of topics) {
                const mapping = getMappingForTopic(topic);
                if (!mapping) continue;
                if ((mapping.bookSlugs || []).includes(book.slug)) score += 32;
                score += scoreHintMatch(
                    normalizeText(book.title, book.category, book.description),
                    mapping.labels,
                    6,
                );
            }
            // Series affinity: Nightmare Forest ↔ Beyond the Last Light
            if (
                (context.bookSlug === "nightmare-forest" &&
                    book.slug === "beyond-the-last-light") ||
                (context.bookSlug === "beyond-the-last-light" &&
                    book.slug === "nightmare-forest")
            ) {
                score += 40;
            }
            if (context.pageType === "books" || context.pageType === "book") score += 6;

            const orderIndex = preferredOrder.indexOf(book.slug);
            if (orderIndex >= 0) score += Math.max(0, 5 - orderIndex);

            // Never invent preorder — surface availability honestly via meta only.
            if (score <= 0) return null;
            return makeItem({
                type: RECOMMENDATION_TYPES.BOOK,
                id: book.slug,
                title: book.title,
                href: getBookPath(book),
                category: book.category || "Book",
                description: book.description || "",
                meta: {
                    slug: book.slug,
                    releaseStatus: book.releaseStatus,
                    statusLabel: statusLabel(book),
                    purchasable: book.releaseStatus === BOOK_RELEASE_STATUSES.AVAILABLE,
                },
                score,
                reason: "related-book",
            });
        })
        .filter(Boolean);
}

function collectOfficialCandidates(topics, excludeIds) {
    const items = [];
    const catalog = listPartnerCatalog();

    for (const topic of topics) {
        const mapping = getMappingForTopic(topic);
        if (!mapping) continue;

        for (const catalogId of mapping.officialCatalogIds || []) {
            const entry = getPartnerCatalogEntry(catalogId);
            if (!entry) continue;
            if (excludeIds.has(`official:${entry.id}`)) continue;
            items.push(
                makeItem({
                    type: RECOMMENDATION_TYPES.OFFICIAL_RESOURCE,
                    id: entry.id,
                    title: `${entry.companyName} (official site)`,
                    href: entry.officialWebsite,
                    external: true,
                    category: "Official",
                    description:
                        "Public company website for reference. Not an affiliate or partnership link.",
                    meta: {
                        companyName: entry.companyName,
                        catalogId: entry.id,
                        partnershipClaim: false,
                    },
                    score: 22,
                    reason: `official:${topic}`,
                }),
            );
        }

        for (const extra of mapping.officialExtras || []) {
            if (excludeIds.has(`official:${extra.id}`)) continue;
            items.push(
                makeItem({
                    type: RECOMMENDATION_TYPES.OFFICIAL_RESOURCE,
                    id: extra.id,
                    title: `${extra.companyName} (official site)`,
                    href: extra.officialWebsite,
                    external: true,
                    category: "Official",
                    description:
                        "Public company website for reference. Not an affiliate or partnership link.",
                    meta: {
                        companyName: extra.companyName,
                        catalogId: null,
                        partnershipClaim: false,
                    },
                    score: 20,
                    reason: `official-extra:${topic}`,
                }),
            );
        }
    }

    // Soft boost: if context mentions a catalog company name, include it.
    const hay = normalizeText(
        // topics already drive most matches; scan catalog names against topic labels
        ...topics.flatMap((t) => getMappingForTopic(t)?.labels || []),
    );
    for (const entry of catalog) {
        if (excludeIds.has(`official:${entry.id}`)) continue;
        if (!hay.includes(entry.companyName.toLowerCase())) continue;
        items.push(
            makeItem({
                type: RECOMMENDATION_TYPES.OFFICIAL_RESOURCE,
                id: entry.id,
                title: `${entry.companyName} (official site)`,
                href: entry.officialWebsite,
                external: true,
                category: "Official",
                description:
                    "Public company website for reference. Not an affiliate or partnership link.",
                meta: {
                    companyName: entry.companyName,
                    catalogId: entry.id,
                    partnershipClaim: false,
                },
                score: 18,
                reason: "official-name-match",
            }),
        );
    }

    return uniqueByKey(items, (item) => item.id);
}

/**
 * Build exclude set so we do not recommend the current page to itself.
 */
function buildExcludeSet(context = {}) {
    const exclude = new Set();
    if (context.newsId) exclude.add(`news:${context.newsId}`);
    if (context.newsSlug) {
        exclude.add(`news:${context.newsSlug}`);
    }
    if (context.blogSlug) exclude.add(`blog:${context.blogSlug}`);
    if (context.resourceSlug) exclude.add(`resource:${context.resourceSlug}`);
    if (context.guideKey) exclude.add(`guide:${context.guideKey}`);
    if (context.productPage) exclude.add(`product:${context.productPage}`);
    if (context.bookSlug) exclude.add(`book:${context.bookSlug}`);
    return exclude;
}

/**
 * Rank candidates by configured type priority, then score, then title.
 */
export function rankRecommendations(candidates, config) {
    const weights = config.priorityWeights || {};
    return [...candidates].sort((a, b) => {
        const wa = weights[a.type] ?? 99;
        const wb = weights[b.type] ?? 99;
        if (wa !== wb) return wa - wb;
        if (b.score !== a.score) return b.score - a.score;
        return String(a.title).localeCompare(String(b.title));
    });
}

/**
 * Diversify: first secure one item per type (priority order preserved in
 * `ranked`), then fill remaining slots with a soft per-type cap.
 */
export function diversifyRecommendations(ranked, maximum) {
    const selected = [];
    const typeCounts = new Map();
    const pool = [...ranked];

    // Pass 1 — one of each type already present in ranked priority order.
    for (let i = 0; i < pool.length && selected.length < maximum; i += 1) {
        const item = pool[i];
        if ((typeCounts.get(item.type) || 0) > 0) continue;
        selected.push(item);
        typeCounts.set(item.type, 1);
        pool.splice(i, 1);
        i -= 1;
    }

    // Pass 2 — fill remaining slots; soft-cap additional copies per type.
    while (selected.length < maximum && pool.length) {
        let pickedIndex = -1;
        for (let i = 0; i < pool.length; i += 1) {
            const item = pool[i];
            const count = typeCounts.get(item.type) || 0;
            if (
                count >= 2 &&
                pool.some((other, j) => j !== i && (typeCounts.get(other.type) || 0) < 2)
            ) {
                continue;
            }
            pickedIndex = i;
            break;
        }
        if (pickedIndex < 0) pickedIndex = 0;
        const [picked] = pool.splice(pickedIndex, 1);
        selected.push(picked);
        typeCounts.set(picked.type, (typeCounts.get(picked.type) || 0) + 1);
    }

    return selected.map((item, index) => ({
        ...item,
        position: index + 1,
    }));
}

/**
 * @param {object} context
 * @param {object} [overrides]
 * @returns {{ enabled: boolean, topics: string[], items: object[], config: object }}
 */
export function runRecommendationEngine(context = {}, overrides = {}) {
    const config = getRecommendationConfig(overrides);

    if (!isRecommendationEngineEnabled(config)) {
        return { enabled: false, topics: [], items: [], config };
    }

    const topics = resolveTopics(context);
    const excludeIds = buildExcludeSet(context);
    const enabledTypes = new Set(config.enabledTypes);

    /** @type {object[]} */
    let candidates = [];

    if (enabledTypes.has(RECOMMENDATION_TYPES.NEWS)) {
        candidates = candidates.concat(collectNewsCandidates(context, topics, excludeIds));
    }
    if (enabledTypes.has(RECOMMENDATION_TYPES.BLOG)) {
        candidates = candidates.concat(collectBlogCandidates(context, topics, excludeIds));
    }
    if (enabledTypes.has(RECOMMENDATION_TYPES.RESOURCE)) {
        candidates = candidates.concat(collectResourceCandidates(context, topics, excludeIds));
    }
    if (enabledTypes.has(RECOMMENDATION_TYPES.GUIDE)) {
        candidates = candidates.concat(collectGuideCandidates(topics, excludeIds));
    }
    if (enabledTypes.has(RECOMMENDATION_TYPES.BOOK)) {
        candidates = candidates.concat(
            collectBookCandidates(topics, excludeIds, context, config),
        );
    }
    if (enabledTypes.has(RECOMMENDATION_TYPES.PRODUCT)) {
        candidates = candidates.concat(
            collectProductCandidates(topics, excludeIds, context),
        );
    }
    if (enabledTypes.has(RECOMMENDATION_TYPES.OFFICIAL_RESOURCE)) {
        candidates = candidates.concat(collectOfficialCandidates(topics, excludeIds));
    }

    // FUTURE_COMMERCIAL is intentionally never collected unless slot enabled
    // AND type is in enabledTypes — still emit zero commercial items by policy
    // in Phase 11.4C even if misconfigured.
    if (
        config.commercialSlotEnabled &&
        enabledTypes.has(RECOMMENDATION_TYPES.FUTURE_COMMERCIAL)
    ) {
        // Phase 11.4C: keep empty. Do not invent commercial recommendations.
    }

    candidates = uniqueByKey(candidates, (item) => `${item.type}:${item.id}`);

    // Absolute guard: strip any commercial types and any affiliate-looking hrefs.
    candidates = candidates.filter((item) => {
        if (isCommercialRecommendationType(item.type)) return false;
        if (!config.commercialSlotEnabled && item.type === RECOMMENDATION_TYPES.FUTURE_COMMERCIAL) {
            return false;
        }
        const href = String(item.href || "");
        if (/[?&](ref|tag|aff|affiliate)=/i.test(href)) return false;
        return true;
    });

    const ranked = rankRecommendations(candidates, config);
    const items = diversifyRecommendations(ranked, config.maximumRecommendations);

    return {
        enabled: true,
        topics,
        items,
        config,
    };
}

export function getRecommendationsForPage(context = {}, overrides = {}) {
    return runRecommendationEngine(context, overrides);
}

/** Helpers exported for tests / debugging. */
export const __recommendationInternals = {
    resolveTopics,
    collectOfficialCandidates,
    getProductByPage,
    getResourceBySlug,
    includesAny,
};
