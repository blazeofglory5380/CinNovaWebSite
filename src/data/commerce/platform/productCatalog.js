/**
 * Phase 12.2 — Centralized commerce product catalog (architecture).
 *
 * Authoritative overlapping facts are adapted from Books + Phase 11 commerceCatalog
 * + marketing products. Placeholders are isolated and never public/purchasable.
 * CinNova-hosted commerceEligible is always false in Phase 12.
 */

import { booksCatalog } from "../../booksCatalog.js";
import {
    getCommerceEntityForBook,
    getProductCommerceEntities,
} from "../../commerceCatalog.js";
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
    RECORD_KINDS,
    RECORD_KIND_LIST,
} from "./constants.js";

/**
 * @typedef {object} CommerceProduct
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string} category
 * @property {string} description
 * @property {string} currentStatus
 * @property {string} availability
 * @property {string} version
 * @property {string|null} heroImage
 * @property {ReadonlyArray<string>} platforms
 * @property {string} ownershipType
 * @property {boolean} subscriptionEligible
 * @property {false} commerceEligible
 * @property {null} futurePricePlaceholder
 * @property {null} futureSkuPlaceholder
 * @property {null} checkoutUrl
 * @property {null} billingProvider
 * @property {null} paymentProductId
 * @property {string} launchStatus
 * @property {string} recordKind
 * @property {boolean} isPublicSurface
 * @property {ReadonlyArray<string>} relationshipIds
 * @property {string|null} legacyBookId
 * @property {string|null} legacyProductPage
 * @property {string|null} legacyCommerceEntityId
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
    const recordKind = input.recordKind ?? RECORD_KINDS.AUTHORITATIVE;
    if (!RECORD_KIND_LIST.includes(recordKind)) {
        throw new Error(`Invalid recordKind: ${recordKind}`);
    }
    if (
        input.futurePricePlaceholder != null ||
        input.futureSkuPlaceholder != null ||
        input.checkoutUrl != null ||
        input.billingProvider != null ||
        input.paymentProductId != null
    ) {
        throw new Error(
            "Phase 12 forbids non-null price, SKU, checkoutUrl, billingProvider, paymentProductId",
        );
    }
    // Fail closed: ignore any attempt to enable hosted commerce.
    if (input.commerceEligible === true) {
        throw new Error(
            "commerceEligible cannot be true until CinNova-hosted checkout ships",
        );
    }
    if (
        recordKind === RECORD_KINDS.ARCHITECTURE_PLACEHOLDER &&
        input.isPublicSurface === true
    ) {
        throw new Error("Architecture placeholders cannot be public surfaces");
    }
    if (
        recordKind === RECORD_KINDS.ARCHITECTURE_PLACEHOLDER &&
        input.availability === PRODUCT_AVAILABILITY.AVAILABLE
    ) {
        throw new Error("Architecture placeholders cannot be AVAILABLE");
    }

    const isPlaceholder = recordKind === RECORD_KINDS.ARCHITECTURE_PLACEHOLDER;

    return Object.freeze({
        id: input.id,
        name: input.name,
        slug: input.slug ?? input.id,
        category: input.category,
        description: input.description ?? "",
        currentStatus: input.currentStatus ?? input.availability,
        availability: input.availability,
        version: input.version ?? "0.0.0-architecture",
        heroImage: input.heroImage ?? null,
        platforms: Object.freeze([...(input.platforms || [PLATFORM_TARGETS.WEB])]),
        ownershipType: input.ownershipType,
        subscriptionEligible: Boolean(input.subscriptionEligible),
        commerceEligible: false,
        futurePricePlaceholder: null,
        futureSkuPlaceholder: null,
        checkoutUrl: null,
        billingProvider: null,
        paymentProductId: null,
        launchStatus: input.launchStatus,
        recordKind,
        isPublicSurface: isPlaceholder ? false : Boolean(input.isPublicSurface ?? true),
        relationshipIds: Object.freeze([...(input.relationshipIds || [])]),
        legacyBookId: input.legacyBookId ?? null,
        legacyProductPage: input.legacyProductPage ?? null,
        legacyCommerceEntityId: input.legacyCommerceEntityId ?? null,
        internalRoute: input.internalRoute ?? null,
    });
}

function bookLaunch(status) {
    if (status === "AVAILABLE") return LAUNCH_STATUSES.LAUNCHED;
    if (status === "COMING_SOON") return LAUNCH_STATUSES.BETA;
    return LAUNCH_STATUSES.IN_DEVELOPMENT;
}

function mapBook(book) {
    const phase11 = getCommerceEntityForBook(book);
    if (phase11 && phase11.availability !== book.releaseStatus) {
        throw new Error(
            `Book/commerce availability mismatch for ${book.id}: ${book.releaseStatus} vs ${phase11.availability}`,
        );
    }
    return createCommerceProduct({
        id: `commerce-${book.id}`,
        name: book.title,
        slug: book.slug,
        category: PRODUCT_CATEGORIES.BOOK,
        description: book.description,
        currentStatus: book.releaseStatus,
        availability: book.releaseStatus,
        version: "1.0.0",
        heroImage: book.cover,
        platforms: [PLATFORM_TARGETS.KINDLE, PLATFORM_TARGETS.WEB],
        ownershipType: OWNERSHIP_TYPES.PURCHASE,
        subscriptionEligible: false,
        commerceEligible: false,
        launchStatus: bookLaunch(book.releaseStatus),
        recordKind: RECORD_KINDS.AUTHORITATIVE,
        isPublicSurface: true,
        relationshipIds: [],
        legacyBookId: book.id,
        legacyCommerceEntityId: phase11?.entityId ?? null,
        internalRoute: book.internalRoute,
    });
}

function marketingByPage(page) {
    return marketingProducts.find((p) => p.page === page) || null;
}

function mapPhase11App(entity) {
    const marketing = marketingByPage(entity.slug);
    return createCommerceProduct({
        id: `commerce-app-${entity.slug}`,
        name: entity.title,
        slug: entity.slug,
        category: PRODUCT_CATEGORIES.APPLICATION,
        description: marketing?.description || `${entity.title} application`,
        currentStatus: marketing?.status || entity.availability,
        availability: entity.availability,
        version: "0.0.0-architecture",
        heroImage: marketing?.image || null,
        platforms: [PLATFORM_TARGETS.WEB, PLATFORM_TARGETS.MULTI],
        ownershipType: OWNERSHIP_TYPES.SUBSCRIPTION,
        subscriptionEligible: entity.subscriptionEligible === true,
        commerceEligible: false,
        launchStatus:
            entity.availability === PRODUCT_AVAILABILITY.IN_DEVELOPMENT
                ? LAUNCH_STATUSES.IN_DEVELOPMENT
                : entity.availability === PRODUCT_AVAILABILITY.UNAVAILABLE
                  ? LAUNCH_STATUSES.CONCEPT
                  : LAUNCH_STATUSES.IN_DEVELOPMENT,
        recordKind: RECORD_KINDS.AUTHORITATIVE,
        // StageScout has no public product page route yet.
        isPublicSurface: Boolean(entity.internalRoute),
        relationshipIds: [],
        legacyProductPage: entity.slug,
        legacyCommerceEntityId: entity.entityId,
        internalRoute: entity.internalRoute
            ? entity.internalRoute.startsWith("/")
                ? `/?page=${entity.slug}`
                : entity.internalRoute
            : null,
    });
}

function mapMarketingOnlyApp(product) {
    const concept = /concept/i.test(product.status);
    return createCommerceProduct({
        id: `commerce-app-${product.page}`,
        name: product.name,
        slug: product.page,
        category: PRODUCT_CATEGORIES.APPLICATION,
        description: product.description,
        currentStatus: product.status,
        availability: concept
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
        recordKind: RECORD_KINDS.AUTHORITATIVE,
        isPublicSurface: true,
        relationshipIds: [],
        legacyProductPage: product.page,
        internalRoute: `/?page=${product.page}`,
    });
}

function placeholder(input) {
    return createCommerceProduct({
        ...input,
        recordKind: RECORD_KINDS.ARCHITECTURE_PLACEHOLDER,
        isPublicSurface: false,
        availability: PRODUCT_AVAILABILITY.UNAVAILABLE,
        launchStatus: LAUNCH_STATUSES.CONCEPT,
        commerceEligible: false,
        currentStatus: "Architecture placeholder — not a launched product",
    });
}

const ARCHITECTURE_PLACEHOLDERS = [
    placeholder({
        id: "commerce-course-ai-foundations",
        name: "AI Foundations Course (placeholder)",
        slug: "ai-foundations-course",
        category: PRODUCT_CATEGORIES.COURSE,
        description: "Future course SKU — architecture only. Not launched.",
        ownershipType: OWNERSHIP_TYPES.PURCHASE,
        subscriptionEligible: false,
        platforms: [PLATFORM_TARGETS.WEB],
    }),
    placeholder({
        id: "commerce-download-prompt-packs",
        name: "Prompt Packs (placeholder)",
        slug: "prompt-packs",
        category: PRODUCT_CATEGORIES.DOWNLOAD,
        description: "Future digital download packs — architecture only. Not launched.",
        ownershipType: OWNERSHIP_TYPES.PURCHASE,
        subscriptionEligible: false,
        platforms: [PLATFORM_TARGETS.WEB],
    }),
    placeholder({
        id: "commerce-resource-writing",
        name: "Writing Resources (placeholder)",
        slug: "writing-resources",
        category: PRODUCT_CATEGORIES.RESOURCE,
        description:
            "Architecture node for future writing resources. Not a public catalog product.",
        ownershipType: OWNERSHIP_TYPES.FREE,
        subscriptionEligible: false,
        platforms: [PLATFORM_TARGETS.WEB],
    }),
    placeholder({
        id: "commerce-membership-cinnova-plus",
        name: "CinNova Membership (placeholder)",
        slug: "cinnova-membership",
        category: PRODUCT_CATEGORIES.MEMBERSHIP,
        description: "Future cross-product membership — architecture only. Not launched.",
        ownershipType: OWNERSHIP_TYPES.SUBSCRIPTION,
        subscriptionEligible: true,
        platforms: [PLATFORM_TARGETS.WEB],
    }),
    placeholder({
        id: "commerce-bundle-safety-family",
        name: "Family Safety Bundle (placeholder)",
        slug: "family-safety-bundle",
        category: PRODUCT_CATEGORIES.BUNDLE,
        description: "Future PoisonGuard-related bundle — architecture only. Not launched.",
        ownershipType: OWNERSHIP_TYPES.BUNDLE,
        subscriptionEligible: false,
        platforms: [PLATFORM_TARGETS.WEB],
    }),
    placeholder({
        id: "commerce-service-enterprise",
        name: "CinNova Enterprise Services (placeholder)",
        slug: "cinnova-enterprise-services",
        category: PRODUCT_CATEGORIES.SERVICE,
        description: "Future enterprise services — architecture only. Not launched.",
        ownershipType: OWNERSHIP_TYPES.ENTERPRISE,
        subscriptionEligible: false,
        platforms: [PLATFORM_TARGETS.API, PLATFORM_TARGETS.WEB],
    }),
];

function buildCatalog() {
    const fromBooks = booksCatalog.map(mapBook);
    const phase11Apps = getProductCommerceEntities().map(mapPhase11App);
    const phase11Slugs = new Set(phase11Apps.map((p) => p.slug));
    const marketingOnly = marketingProducts
        .filter((p) => !phase11Slugs.has(p.page))
        .map(mapMarketingOnlyApp);
    const all = [...fromBooks, ...phase11Apps, ...marketingOnly, ...ARCHITECTURE_PLACEHOLDERS];
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

/** Products safe for future public surfaces — excludes architecture placeholders. */
export function listPublicCommerceProducts() {
    return COMMERCE_PRODUCT_CATALOG.filter(
        (p) =>
            p.isPublicSurface &&
            p.recordKind === RECORD_KINDS.AUTHORITATIVE,
    );
}

export function listArchitecturePlaceholders() {
    return COMMERCE_PRODUCT_CATALOG.filter(
        (p) => p.recordKind === RECORD_KINDS.ARCHITECTURE_PLACEHOLDER,
    );
}

export function getCommerceProductById(id) {
    return COMMERCE_PRODUCT_CATALOG.find((p) => p.id === id) || null;
}

export function getCommerceProductBySlug(slug) {
    return COMMERCE_PRODUCT_CATALOG.find((p) => p.slug === slug) || null;
}

export function listCommerceProductsByCategory(category) {
    return COMMERCE_PRODUCT_CATALOG.filter((p) => p.category === category);
}

export function isArchitecturePlaceholder(product) {
    return product?.recordKind === RECORD_KINDS.ARCHITECTURE_PLACEHOLDER;
}

/** Hosted Buy/Subscribe/Checkout must always fail closed in Phase 12. */
export function canOfferHostedCheckout(product) {
    if (!product) return false;
    if (product.commerceEligible) return false;
    if (product.checkoutUrl) return false;
    if (product.futurePricePlaceholder != null) return false;
    if (product.futureSkuPlaceholder != null) return false;
    if (product.billingProvider != null) return false;
    if (product.paymentProductId != null) return false;
    if (isArchitecturePlaceholder(product)) return false;
    return false;
}

export function countActiveCommercialInventory(catalog = COMMERCE_PRODUCT_CATALOG) {
    return catalog.filter(
        (p) =>
            p.commerceEligible === true ||
            canOfferHostedCheckout(p) ||
            (p.recordKind === RECORD_KINDS.AUTHORITATIVE &&
                p.availability === PRODUCT_AVAILABILITY.AVAILABLE &&
                p.commerceEligible === true),
    ).length;
}

export function validateCommerceProductCatalog(catalog = COMMERCE_PRODUCT_CATALOG) {
    const errors = [];
    const ids = new Set();
    const slugs = new Set();

    for (const product of catalog) {
        if (ids.has(product.id)) errors.push(`duplicate id ${product.id}`);
        ids.add(product.id);
        if (slugs.has(product.slug)) errors.push(`duplicate slug ${product.slug}`);
        slugs.add(product.slug);

        if (product.commerceEligible === true) {
            errors.push(`${product.id}: commerceEligible must be false`);
        }
        if (product.futurePricePlaceholder != null) {
            errors.push(`${product.id}: price must be null`);
        }
        if (product.futureSkuPlaceholder != null) {
            errors.push(`${product.id}: sku must be null`);
        }
        if (product.checkoutUrl != null) {
            errors.push(`${product.id}: checkoutUrl must be null`);
        }
        if (canOfferHostedCheckout(product)) {
            errors.push(`${product.id}: hosted checkout unexpectedly allowed`);
        }
        if (
            product.recordKind === RECORD_KINDS.ARCHITECTURE_PLACEHOLDER &&
            product.isPublicSurface
        ) {
            errors.push(`${product.id}: placeholder marked public`);
        }
        if (
            product.recordKind === RECORD_KINDS.ARCHITECTURE_PLACEHOLDER &&
            product.availability === PRODUCT_AVAILABILITY.AVAILABLE
        ) {
            errors.push(`${product.id}: placeholder AVAILABLE`);
        }
    }

    // Consistency: every book must match Books + Phase 11 commerce availability.
    for (const book of booksCatalog) {
        const product = catalog.find((p) => p.legacyBookId === book.id);
        if (!product) {
            errors.push(`missing commerce product for book ${book.id}`);
            continue;
        }
        if (product.name !== book.title) {
            errors.push(`${product.id}: title drift from booksCatalog`);
        }
        if (product.slug !== book.slug) {
            errors.push(`${product.id}: slug drift from booksCatalog`);
        }
        if (product.availability !== book.releaseStatus) {
            errors.push(`${product.id}: availability drift from booksCatalog`);
        }
        const phase11 = getCommerceEntityForBook(book);
        if (phase11 && product.availability !== phase11.availability) {
            errors.push(`${product.id}: availability drift from commerceCatalog`);
        }
    }

    // Consistency: Phase 11 product entities must be represented with same availability.
    for (const entity of getProductCommerceEntities()) {
        const product = catalog.find((p) => p.slug === entity.slug);
        if (!product) {
            errors.push(`missing commerce product for Phase 11 entity ${entity.entityId}`);
            continue;
        }
        if (product.availability !== entity.availability) {
            errors.push(
                `${product.id}: availability ${product.availability} != Phase 11 ${entity.availability}`,
            );
        }
        if (product.name !== entity.title) {
            errors.push(`${product.id}: title drift from Phase 11 commerceCatalog`);
        }
    }

    if (countActiveCommercialInventory(catalog) !== 0) {
        errors.push("active commercial inventory must be zero in Phase 12");
    }

    return { ok: errors.length === 0, errors };
}
