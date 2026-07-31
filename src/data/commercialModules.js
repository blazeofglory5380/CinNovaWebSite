/**
 * Manually enabled commercial modules for editorial surfaces.
 * Never auto-insert random promotions. Never treat these as sponsored content
 * unless sponsor metadata is separately verified and disclosed.
 */

/**
 * @typedef {object} CommercialModuleConfig
 * @property {boolean} enabled
 * @property {"book"|"product"|"newsletter"} type
 * @property {string} [bookSlug]
 * @property {string} [productPage]
 * @property {string} [title]
 * @property {string} [copy]
 * @property {string} [ctaLabel]
 * @property {string} [campaignId]
 */

const PRODUCT_DEFAULTS = Object.freeze({
    studynest: {
        title: "StudyNest",
        copy: "Explore CinNova’s AI study companion for structured learning.",
        ctaLabel: "Explore StudyNest",
    },
    poisonguard: {
        title: "PoisonGuard",
        copy: "Explore CinNova’s household safety tools and guidance.",
        ctaLabel: "Explore PoisonGuard",
    },
    kiddo: {
        title: "Kiddo",
        copy: "Explore CinNova’s early-learning world for families.",
        ctaLabel: "Explore Kiddo",
    },
    "real-estate": {
        title: "CinNova Real Estate AI",
        copy: "Explore deal analysis tools for investors and agents.",
        ctaLabel: "Explore Real Estate AI",
    },
    techmate: {
        title: "TechMate AI",
        copy: "Explore guided tech troubleshooting from CinNova.",
        ctaLabel: "Explore TechMate AI",
    },
});

/**
 * Resolve and validate a commercial module config.
 * Returns null when disabled, incomplete, or unsafe.
 * @param {CommercialModuleConfig|null|undefined} raw
 */
export function resolveCommercialModule(raw) {
    if (!raw || raw.enabled !== true) return null;
    const type = String(raw.type || "").toLowerCase();

    if (type === "newsletter") {
        return {
            type: "newsletter",
            title: raw.title || "Join the CinNova newsletter",
            copy:
                raw.copy ||
                "Get product launches, publishing updates, and editorial highlights — no spam.",
            campaignId: raw.campaignId || "blog-article-newsletter",
        };
    }

    if (type === "book") {
        const bookSlug = String(raw.bookSlug || "").trim();
        if (!bookSlug) return null;
        return {
            type: "book",
            bookSlug,
            campaignId: raw.campaignId || `blog-book-${bookSlug}`,
        };
    }

    if (type === "product") {
        const productPage = String(raw.productPage || "").trim();
        const defaults = PRODUCT_DEFAULTS[productPage];
        if (!defaults) return null;
        return {
            type: "product",
            productPage,
            title: raw.title || defaults.title,
            copy: raw.copy || defaults.copy,
            ctaLabel: raw.ctaLabel || defaults.ctaLabel,
            campaignId: raw.campaignId || `blog-product-${productPage}`,
        };
    }

    return null;
}

export function isCommercialModuleEnabled(raw) {
    return Boolean(resolveCommercialModule(raw));
}
