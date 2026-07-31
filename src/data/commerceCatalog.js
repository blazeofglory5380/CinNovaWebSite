/**
 * CinNova Phase 11.1 — centralized commerce catalog.
 *
 * Reusable monetization metadata for books, products, and content surfaces.
 * Unknown commercial values stay null / omitted. Never invent prices,
 * affiliate tags, retailers, sponsors, or subscription rates.
 *
 * Keep free of seoConfig imports (same cycle rule as booksCatalog).
 */

import { booksCatalog, isPurchasable } from "./booksCatalog.js";
import {
    REVENUE_MODELS,
    COMMERCE_AVAILABILITY,
    DESTINATION_TYPES,
    CTA_TYPES,
    canShowPurchaseCta,
    destinationHostFromUrl,
} from "./commerceModels.js";

/**
 * @typedef {object} CommerceEntity
 * @property {string} entityId
 * @property {"book"|"product"|"content_surface"} entityType
 * @property {string} title
 * @property {string} slug
 * @property {string} availability
 * @property {string[]} revenueModels
 * @property {string[]} futureRevenueModels
 * @property {string|null} primaryCtaLabel
 * @property {string|null} primaryCtaType
 * @property {string|null} secondaryCtaLabel
 * @property {string|null} secondaryCtaType
 * @property {string} destinationType
 * @property {string|null} destinationUrl
 * @property {string|null} retailer
 * @property {null} price
 * @property {null} currency
 * @property {boolean} affiliateEnabled
 * @property {string|null} affiliatePartner
 * @property {string|null} affiliateCampaignId
 * @property {boolean} affiliateDisclosureRequired
 * @property {boolean} subscriptionEligible
 * @property {boolean} leadCaptureEligible
 * @property {string} analyticsContext
 * @property {string|null} internalRoute
 */

function bookToCommerce(book) {
    const purchasable = isPurchasable(book);
    const availability = book.releaseStatus;
    const destinationUrl = purchasable ? book.externalUrl : null;

    /** @type {CommerceEntity} */
    const entity = {
        entityId: book.id,
        entityType: "book",
        title: book.title,
        slug: book.slug,
        availability,
        revenueModels: purchasable
            ? [REVENUE_MODELS.EXTERNAL_RETAIL]
            : [REVENUE_MODELS.COMING_SOON],
        futureRevenueModels: [],
        primaryCtaLabel: purchasable ? "View on Amazon" : book.ctaLabel,
        primaryCtaType: purchasable
            ? CTA_TYPES.VIEW_EXTERNAL
            : availability === COMMERCE_AVAILABILITY.COMING_SOON
              ? CTA_TYPES.LEARN_MORE
              : CTA_TYPES.FOLLOW_DEVELOPMENT,
        secondaryCtaLabel: "Details",
        secondaryCtaType: CTA_TYPES.EXPLORE,
        destinationType: purchasable
            ? DESTINATION_TYPES.EXTERNAL_RETAILER
            : DESTINATION_TYPES.INTERNAL,
        destinationUrl,
        retailer: purchasable ? "Amazon Kindle" : null,
        // Price unknown on CinNova — never invent Amazon Store prices.
        price: null,
        currency: null,
        // Amazon Associates is NOT verified. Keep retailer link non-affiliate.
        affiliateEnabled: false,
        affiliatePartner: null,
        affiliateCampaignId: null,
        affiliateDisclosureRequired: false,
        subscriptionEligible: false,
        leadCaptureEligible: true,
        analyticsContext: "books",
        internalRoute: book.internalRoute,
    };

    if (book.slug === "beyond-the-last-light") {
        entity.futureRevenueModels = [
            REVENUE_MODELS.EXTERNAL_RETAIL,
            REVENUE_MODELS.DIRECT_SALE,
        ];
    }
    if (book.slug === "nightmare-forest") {
        entity.futureRevenueModels = [
            REVENUE_MODELS.EXTERNAL_RETAIL,
            REVENUE_MODELS.DIRECT_SALE,
        ];
    }
    if (book.slug === "kiddo-illustrated-collection") {
        entity.futureRevenueModels = [
            REVENUE_MODELS.FREE_TO_PAID,
            REVENUE_MODELS.SUBSCRIPTION,
            REVENUE_MODELS.DIRECT_SALE,
        ];
    }

    return entity;
}

/** Product / surface architecture — no active purchase destinations. */
const PRODUCT_COMMERCE = [
    {
        entityId: "product-poisonguard",
        entityType: "product",
        title: "PoisonGuard",
        slug: "poisonguard",
        availability: COMMERCE_AVAILABILITY.IN_DEVELOPMENT,
        revenueModels: [REVENUE_MODELS.COMING_SOON],
        futureRevenueModels: [REVENUE_MODELS.FREE_TO_PAID, REVENUE_MODELS.SUBSCRIPTION],
        primaryCtaLabel: "Explore PoisonGuard",
        primaryCtaType: CTA_TYPES.EXPLORE,
        secondaryCtaLabel: "Join Updates",
        secondaryCtaType: CTA_TYPES.JOIN_UPDATES,
        destinationType: DESTINATION_TYPES.INTERNAL,
        destinationUrl: null,
        retailer: null,
        price: null,
        currency: null,
        affiliateEnabled: false,
        affiliatePartner: null,
        affiliateCampaignId: null,
        affiliateDisclosureRequired: false,
        subscriptionEligible: true,
        leadCaptureEligible: true,
        analyticsContext: "products",
        internalRoute: "/poisonguard",
    },
    {
        entityId: "product-studynest",
        entityType: "product",
        title: "StudyNest",
        slug: "studynest",
        availability: COMMERCE_AVAILABILITY.IN_DEVELOPMENT,
        revenueModels: [REVENUE_MODELS.COMING_SOON],
        futureRevenueModels: [REVENUE_MODELS.FREE_TO_PAID, REVENUE_MODELS.SUBSCRIPTION],
        primaryCtaLabel: "Explore StudyNest",
        primaryCtaType: CTA_TYPES.EXPLORE,
        secondaryCtaLabel: "Join Updates",
        secondaryCtaType: CTA_TYPES.JOIN_UPDATES,
        destinationType: DESTINATION_TYPES.INTERNAL,
        destinationUrl: null,
        retailer: null,
        price: null,
        currency: null,
        affiliateEnabled: false,
        affiliatePartner: null,
        affiliateCampaignId: null,
        affiliateDisclosureRequired: false,
        subscriptionEligible: true,
        leadCaptureEligible: true,
        analyticsContext: "products",
        internalRoute: "/studynest",
    },
    {
        entityId: "product-real-estate-ai",
        entityType: "product",
        title: "CinNova Real Estate AI",
        slug: "real-estate",
        availability: COMMERCE_AVAILABILITY.IN_DEVELOPMENT,
        revenueModels: [REVENUE_MODELS.COMING_SOON],
        futureRevenueModels: [REVENUE_MODELS.SUBSCRIPTION],
        primaryCtaLabel: "Explore Real Estate AI",
        primaryCtaType: CTA_TYPES.EXPLORE,
        secondaryCtaLabel: "Join Updates",
        secondaryCtaType: CTA_TYPES.JOIN_UPDATES,
        destinationType: DESTINATION_TYPES.INTERNAL,
        destinationUrl: null,
        retailer: null,
        price: null,
        currency: null,
        affiliateEnabled: false,
        affiliatePartner: null,
        affiliateCampaignId: null,
        affiliateDisclosureRequired: false,
        subscriptionEligible: true,
        leadCaptureEligible: true,
        analyticsContext: "products",
        internalRoute: "/real-estate",
    },
    {
        entityId: "product-stagescout",
        entityType: "product",
        title: "StageScout",
        slug: "stagescout",
        availability: COMMERCE_AVAILABILITY.IN_DEVELOPMENT,
        revenueModels: [REVENUE_MODELS.COMING_SOON],
        futureRevenueModels: [
            REVENUE_MODELS.AFFILIATE,
            REVENUE_MODELS.LEAD_GENERATION,
            REVENUE_MODELS.SUBSCRIPTION,
        ],
        primaryCtaLabel: "Learn More",
        primaryCtaType: CTA_TYPES.LEARN_MORE,
        secondaryCtaLabel: null,
        secondaryCtaType: null,
        destinationType: DESTINATION_TYPES.NONE,
        destinationUrl: null,
        retailer: null,
        price: null,
        currency: null,
        affiliateEnabled: false,
        affiliatePartner: null,
        affiliateCampaignId: null,
        affiliateDisclosureRequired: false,
        subscriptionEligible: true,
        leadCaptureEligible: true,
        analyticsContext: "products",
        internalRoute: null,
    },
    {
        entityId: "product-kiddo",
        entityType: "product",
        title: "Kiddo",
        slug: "kiddo",
        availability: COMMERCE_AVAILABILITY.IN_DEVELOPMENT,
        revenueModels: [REVENUE_MODELS.COMING_SOON],
        futureRevenueModels: [
            REVENUE_MODELS.FREE_TO_PAID,
            REVENUE_MODELS.SUBSCRIPTION,
            REVENUE_MODELS.DIRECT_SALE,
        ],
        primaryCtaLabel: "Explore Kiddo",
        primaryCtaType: CTA_TYPES.EXPLORE,
        secondaryCtaLabel: "Join Updates",
        secondaryCtaType: CTA_TYPES.JOIN_UPDATES,
        destinationType: DESTINATION_TYPES.INTERNAL,
        destinationUrl: null,
        retailer: null,
        price: null,
        currency: null,
        affiliateEnabled: false,
        affiliatePartner: null,
        affiliateCampaignId: null,
        affiliateDisclosureRequired: false,
        subscriptionEligible: true,
        leadCaptureEligible: true,
        analyticsContext: "products",
        internalRoute: "/kiddo",
    },
];

const CONTENT_SURFACE_COMMERCE = [
    {
        entityId: "surface-news",
        entityType: "content_surface",
        title: "News Center",
        slug: "news",
        availability: COMMERCE_AVAILABILITY.AVAILABLE,
        revenueModels: [REVENUE_MODELS.LEAD_GENERATION],
        futureRevenueModels: [
            REVENUE_MODELS.ADVERTISING,
            REVENUE_MODELS.SPONSORSHIP,
            REVENUE_MODELS.AFFILIATE,
        ],
        primaryCtaLabel: "Read News",
        primaryCtaType: CTA_TYPES.EXPLORE,
        secondaryCtaLabel: "Join Updates",
        secondaryCtaType: CTA_TYPES.JOIN_UPDATES,
        destinationType: DESTINATION_TYPES.INTERNAL,
        destinationUrl: null,
        retailer: null,
        price: null,
        currency: null,
        affiliateEnabled: false,
        affiliatePartner: null,
        affiliateCampaignId: null,
        affiliateDisclosureRequired: false,
        subscriptionEligible: false,
        leadCaptureEligible: true,
        analyticsContext: "news",
        internalRoute: "/news",
    },
    {
        entityId: "surface-blog",
        entityType: "content_surface",
        title: "Blog",
        slug: "blog",
        availability: COMMERCE_AVAILABILITY.AVAILABLE,
        revenueModels: [REVENUE_MODELS.LEAD_GENERATION],
        futureRevenueModels: [
            REVENUE_MODELS.ADVERTISING,
            REVENUE_MODELS.SPONSORSHIP,
            REVENUE_MODELS.AFFILIATE,
        ],
        primaryCtaLabel: "Read Blog",
        primaryCtaType: CTA_TYPES.EXPLORE,
        secondaryCtaLabel: "Join Updates",
        secondaryCtaType: CTA_TYPES.JOIN_UPDATES,
        destinationType: DESTINATION_TYPES.INTERNAL,
        destinationUrl: null,
        retailer: null,
        price: null,
        currency: null,
        affiliateEnabled: false,
        affiliatePartner: null,
        affiliateCampaignId: null,
        affiliateDisclosureRequired: false,
        subscriptionEligible: false,
        leadCaptureEligible: true,
        analyticsContext: "blog",
        internalRoute: "/blog",
    },
];

export function getBookCommerceEntities() {
    return booksCatalog.map(bookToCommerce);
}

export function getProductCommerceEntities() {
    return PRODUCT_COMMERCE.slice();
}

export function getContentSurfaceCommerceEntities() {
    return CONTENT_SURFACE_COMMERCE.slice();
}

export function getAllCommerceEntities() {
    return [
        ...getBookCommerceEntities(),
        ...getProductCommerceEntities(),
        ...getContentSurfaceCommerceEntities(),
    ];
}

export function getCommerceEntityBySlug(slug) {
    return getAllCommerceEntities().find((entity) => entity.slug === slug) || null;
}

export function getCommerceEntityForBook(book) {
    if (!book) return null;
    return bookToCommerce(book);
}

export function getActiveCommercialDestinations() {
    return getAllCommerceEntities().filter((entity) =>
        canShowPurchaseCta({
            availability: entity.availability,
            destinationUrl: entity.destinationUrl,
        }),
    );
}

export function buildCommerceAnalyticsContext(entity, { placement = "", ctaType = "" } = {}) {
    if (!entity) return {};
    return {
        entity_id: entity.entityId,
        entity_type: entity.entityType,
        entity_slug: entity.slug,
        entity_title: entity.title,
        revenue_model: entity.revenueModels[0] || "",
        availability: entity.availability,
        destination_type: entity.destinationType,
        destination_host: destinationHostFromUrl(entity.destinationUrl) || "",
        placement,
        cta_type: ctaType || entity.primaryCtaType || "",
        affiliate_enabled: Boolean(entity.affiliateEnabled),
    };
}

export function getMonetizationChannelSummary() {
    const entities = getAllCommerceEntities();
    const active = getActiveCommercialDestinations();
    return {
        totalEntities: entities.length,
        activePurchasePaths: active.length,
        activeDestinations: active.map((e) => ({
            entityId: e.entityId,
            title: e.title,
            retailer: e.retailer,
            destinationHost: destinationHostFromUrl(e.destinationUrl),
            affiliateEnabled: e.affiliateEnabled,
        })),
        leadEligible: entities.filter((e) => e.leadCaptureEligible).length,
        subscriptionEligibleFuture: entities.filter((e) => e.subscriptionEligible).length,
        affiliateEnabledNow: entities.filter((e) => e.affiliateEnabled).length,
    };
}
