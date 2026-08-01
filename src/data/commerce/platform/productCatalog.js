/**
 * Phase 12.2 — Centralized commerce product catalog (architecture).
 * Future price / SKU placeholders stay null. No checkout.
 */

import { booksCatalog } from "../../booksCatalog.js";
import { products as marketingProducts } from "../../products.js";
import {
    LAUNCH_STATUSES,
    OWNERSHIP_TYPES,
    PLATFORM_TARGETS,
    PRODUCT_AVAILABILITY,
    PRODUCT_CATEGORIES,
    PRODUCT_CATEGORY_LIST,
    PRODUCT_AVAILABILITY_LIST,
    OWNERSHIP_TYPE_LIST,
    LAUNCH_STATUS_LIST,
} from "./constants.js";

/**
 * @typedef {object} CommerceProduct
 * @property {string} id
 * @property {string} name
 * @property {string} category
 * @property {string} description
 * @property {string} currentStatus
 * @property {string} availability
 * @property {string} version
 * @property {string|null} heroImage
 * @property {ReadonlyArray<string>} platforms
 * @property {string} ownershipType
 * @property {boolean} subscriptionEligible
 * @property {boolean} commerceEligible
 * @property {null} futurePricePlaceholder
 * @property {null} futureSkuPlaceholder
 * @property {string} launchStatus
 * @property {ReadonlyArray<string>} relationshipIds
 * @property {string|null} legacyBookId
 * @property {string|null} legacyProductPage
 * @property {string|null} internalRoute
 */

/**
 * @param {object} input
 * @returns {Readonly<CommerceProduct>}
 */
export function createCommerceProduct(input) {
    if (!input?.id || !input?.name) {
        throw new Error("Commerce product requires id and name");
    }
    if (!PRODUCT_CATEGORY_LIST.includes(input.category)) {
        throw new Error(`Invalid product category: ${input.category}`);
    }
    if (!PRODUCT_AVAILABILITY_LIST.includes(input.availability)) {
        throw new Error(`Invalid availability: ${input.availability}`);
    }
    if (!OWNERSHIP_TYPE_LIST.includes(input.ownershipType)) {
        throw new Error(`Invalid ownershipType: ${input.ownershipType}`);
    }
    if (!LAUNCH_STATUS_LIST.includes(input.launchStatus)) {
        throw new Error(`Invalid launchStatus: ${input.launchStatus}`);
    }
    if (input.futurePricePlaceholder != null) {
        throw new Error("futurePricePlaceholder must remain null in Phase 12");
    }
    if (input.futureSkuPlaceholder != null) {
        throw new Error("futureSkuPlaceholder must remain null in Phase 12");
    }

    return Object.freeze({
        id: input.id,
        name: input.name,
        category: input.category,
        description: input.description ?? "",
        currentStatus: input.currentStatus ?? input.availability,
        availability: input.availability,
        version: input.version ?? "0.0.0-architecture",
        heroImage: input.heroImage ?? null,
        platforms: Object.freeze([...(input.platforms || [PLATFORM_TARGETS.WEB])]),
        ownershipType: input.ownershipType,
        subscriptionEligible: Boolean(input.subscriptionEligible),
        commerceEligible: Boolean(input.commerceEligible),
        futurePricePlaceholder: null,
        futureSkuPlaceholder: null,
        launchStatus: input.launchStatus,
        relationshipIds: Object.freeze([...(input.relationshipIds || [])]),
        legacyBookId: input.legacyBookId ?? null,
        legacyProductPage: input.legacyProductPage ?? null,
        internalRoute: input.internalRoute ?? null,
    });
}

function bookAvailability(status) {
    if (status === "AVAILABLE") return PRODUCT_AVAILABILITY.AVAILABLE;
    if (status === "COMING_SOON") return PRODUCT_AVAILABILITY.COMING_SOON;
    return PRODUCT_AVAILABILITY.IN_DEVELOPMENT;
}

function bookLaunch(status) {
    if (status === "AVAILABLE") return LAUNCH_STATUSES.LAUNCHED;
    if (status === "COMING_SOON") return LAUNCH_STATUSES.BETA;
    return LAUNCH_STATUSES.IN_DEVELOPMENT;
}

function mapBook(book) {
    return createCommerceProduct({
        id: `commerce-${book.id}`,
        name: book.title,
        category: PRODUCT_CATEGORIES.BOOK,
        description: book.description,
        currentStatus: book.releaseStatus,
        availability: bookAvailability(book.releaseStatus),
        version: "1.0.0",
        heroImage: book.cover,
        platforms: [PLATFORM_TARGETS.KINDLE, PLATFORM_TARGETS.WEB],
        ownershipType: OWNERSHIP_TYPES.PURCHASE,
        subscriptionEligible: false,
        // External retail may exist; CinNova-hosted checkout is not eligible yet.
        commerceEligible: false,
        launchStatus: bookLaunch(book.releaseStatus),
        relationshipIds: [],
        legacyBookId: book.id,
        internalRoute: book.internalRoute,
    });
}

function mapMarketingApp(product) {
    const page = product.page;
    const inDev =
        /development|active build/i.test(product.status) ||
        product.status === "In Development";
    const concept = /concept/i.test(product.status);
    return createCommerceProduct({
        id: `commerce-app-${page}`,
        name: product.name,
        category: PRODUCT_CATEGORIES.APPLICATION,
        description: product.description,
        currentStatus: product.status,
        availability: inDev
            ? PRODUCT_AVAILABILITY.IN_DEVELOPMENT
            : concept
              ? PRODUCT_AVAILABILITY.UNAVAILABLE
              : PRODUCT_AVAILABILITY.IN_DEVELOPMENT,
        version: "0.0.0-architecture",
        heroImage: product.image,
        platforms: [PLATFORM_TARGETS.WEB, PLATFORM_TARGETS.MULTI],
        ownershipType: OWNERSHIP_TYPES.SUBSCRIPTION,
        subscriptionEligible: true,
        commerceEligible: false,
        launchStatus: concept
            ? LAUNCH_STATUSES.CONCEPT
            : LAUNCH_STATUSES.IN_DEVELOPMENT,
        relationshipIds: [],
        legacyProductPage: page,
        internalRoute: `/?page=${page}`,
    });
}

/** Additional architecture products not yet on the marketing product grid. */
const ARCHITECTURE_PRODUCTS = [
    createCommerceProduct({
        id: "commerce-app-stagescout",
        name: "StageScout",
        category: PRODUCT_CATEGORIES.APPLICATION,
        description:
            "Travel and stage discovery planning — architecture placeholder for future premium access.",
        currentStatus: "Architecture",
        availability: PRODUCT_AVAILABILITY.IN_DEVELOPMENT,
        version: "0.0.0-architecture",
        heroImage: null,
        platforms: [PLATFORM_TARGETS.WEB],
        ownershipType: OWNERSHIP_TYPES.SUBSCRIPTION,
        subscriptionEligible: true,
        commerceEligible: false,
        launchStatus: LAUNCH_STATUSES.CONCEPT,
        relationshipIds: [],
        legacyProductPage: "stagescout",
        internalRoute: null,
    }),
    createCommerceProduct({
        id: "commerce-course-ai-foundations",
        name: "AI Foundations Course (placeholder)",
        category: PRODUCT_CATEGORIES.COURSE,
        description: "Future course SKU — architecture only.",
        currentStatus: "Architecture",
        availability: PRODUCT_AVAILABILITY.UNAVAILABLE,
        ownershipType: OWNERSHIP_TYPES.PURCHASE,
        subscriptionEligible: false,
        commerceEligible: false,
        launchStatus: LAUNCH_STATUSES.CONCEPT,
        platforms: [PLATFORM_TARGETS.WEB],
    }),
    createCommerceProduct({
        id: "commerce-download-prompt-packs",
        name: "Prompt Packs (placeholder)",
        category: PRODUCT_CATEGORIES.DOWNLOAD,
        description: "Future digital download packs — architecture only.",
        currentStatus: "Architecture",
        availability: PRODUCT_AVAILABILITY.UNAVAILABLE,
        ownershipType: OWNERSHIP_TYPES.PURCHASE,
        subscriptionEligible: false,
        commerceEligible: false,
        launchStatus: LAUNCH_STATUSES.CONCEPT,
        platforms: [PLATFORM_TARGETS.WEB],
    }),
    createCommerceProduct({
        id: "commerce-resource-writing",
        name: "Writing Resources (placeholder)",
        category: PRODUCT_CATEGORIES.RESOURCE,
        description: "Cross-linked writing resources for CinNova books.",
        currentStatus: "Architecture",
        availability: PRODUCT_AVAILABILITY.UNAVAILABLE,
        ownershipType: OWNERSHIP_TYPES.FREE,
        subscriptionEligible: false,
        commerceEligible: false,
        launchStatus: LAUNCH_STATUSES.CONCEPT,
        platforms: [PLATFORM_TARGETS.WEB],
    }),
    createCommerceProduct({
        id: "commerce-membership-cinnova-plus",
        name: "CinNova Membership (placeholder)",
        category: PRODUCT_CATEGORIES.MEMBERSHIP,
        description: "Future cross-product membership — architecture only.",
        currentStatus: "Architecture",
        availability: PRODUCT_AVAILABILITY.UNAVAILABLE,
        ownershipType: OWNERSHIP_TYPES.SUBSCRIPTION,
        subscriptionEligible: true,
        commerceEligible: false,
        launchStatus: LAUNCH_STATUSES.CONCEPT,
        platforms: [PLATFORM_TARGETS.WEB],
    }),
    createCommerceProduct({
        id: "commerce-bundle-safety-family",
        name: "Family Safety Bundle (placeholder)",
        category: PRODUCT_CATEGORIES.BUNDLE,
        description: "Future PoisonGuard + related safety bundle.",
        currentStatus: "Architecture",
        availability: PRODUCT_AVAILABILITY.UNAVAILABLE,
        ownershipType: OWNERSHIP_TYPES.BUNDLE,
        subscriptionEligible: false,
        commerceEligible: false,
        launchStatus: LAUNCH_STATUSES.CONCEPT,
        platforms: [PLATFORM_TARGETS.WEB],
    }),
    createCommerceProduct({
        id: "commerce-service-enterprise",
        name: "CinNova Enterprise Services (placeholder)",
        category: PRODUCT_CATEGORIES.SERVICE,
        description: "Future enterprise implementation services.",
        currentStatus: "Architecture",
        availability: PRODUCT_AVAILABILITY.UNAVAILABLE,
        ownershipType: OWNERSHIP_TYPES.ENTERPRISE,
        subscriptionEligible: false,
        commerceEligible: false,
        launchStatus: LAUNCH_STATUSES.CONCEPT,
        platforms: [PLATFORM_TARGETS.API, PLATFORM_TARGETS.WEB],
    }),
];

function buildCatalog() {
    const fromBooks = booksCatalog.map(mapBook);
    const fromApps = marketingProducts.map(mapMarketingApp);
    const all = [...fromBooks, ...fromApps, ...ARCHITECTURE_PRODUCTS];
    const ids = new Set();
    for (const product of all) {
        if (ids.has(product.id)) {
            throw new Error(`Duplicate commerce product id: ${product.id}`);
        }
        ids.add(product.id);
    }
    return Object.freeze(all);
}

export const COMMERCE_PRODUCT_CATALOG = buildCatalog();

export function listCommerceProducts() {
    return COMMERCE_PRODUCT_CATALOG.slice();
}

export function getCommerceProductById(id) {
    return COMMERCE_PRODUCT_CATALOG.find((p) => p.id === id) || null;
}

export function listCommerceProductsByCategory(category) {
    return COMMERCE_PRODUCT_CATALOG.filter((p) => p.category === category);
}

export function validateCommerceProductCatalog(catalog = COMMERCE_PRODUCT_CATALOG) {
    const errors = [];
    const ids = new Set();
    for (const product of catalog) {
        if (ids.has(product.id)) errors.push(`duplicate id ${product.id}`);
        ids.add(product.id);
        if (product.futurePricePlaceholder != null) {
            errors.push(`${product.id}: price must be null`);
        }
        if (product.futureSkuPlaceholder != null) {
            errors.push(`${product.id}: sku must be null`);
        }
        if (product.commerceEligible === true) {
            errors.push(
                `${product.id}: commerceEligible must stay false until checkout exists`,
            );
        }
    }
    return { ok: errors.length === 0, errors };
}
