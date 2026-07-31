/**
 * Advertising readiness config (Phase 11.1).
 * No ad network installed. No fake ad creatives. Architecture only.
 */

export const AD_NETWORK_STATUS = Object.freeze({
    NOT_INSTALLED: "NOT_INSTALLED",
    READY_TO_ACTIVATE: "READY_TO_ACTIVATE",
    ACTIVE: "ACTIVE",
});

export const advertisingConfig = Object.freeze({
    networkStatus: AD_NETWORK_STATUS.NOT_INSTALLED,
    networksBlockedInPhase111: [
        "Google AdSense",
        "Google Ad Manager",
        "Mediavine",
        "Raptive",
    ],
    placements: [
        {
            id: "blog-article-body",
            surface: "blog",
            location: "article_body",
            status: "FUTURE",
            allowed: true,
        },
        {
            id: "blog-sidebar",
            surface: "blog",
            location: "sidebar",
            status: "FUTURE",
            allowed: true,
        },
        {
            id: "news-article-body",
            surface: "news",
            location: "article_body",
            status: "FUTURE",
            allowed: true,
        },
        {
            id: "news-sidebar",
            surface: "news",
            location: "sidebar",
            status: "FUTURE",
            allowed: true,
        },
        {
            id: "selected-landing",
            surface: "landing",
            location: "selected_pages",
            status: "FUTURE",
            allowed: true,
        },
    ],
    /** Hard exclusions — never place ads in these contexts. */
    forbiddenContexts: [
        "product_purchase_cta",
        "checkout",
        "poisonguard_emergency_guidance",
        "critical_safety_content",
    ],
});

export function shouldRenderAdPlacement() {
    // Phase 11.1: never render ads.
    return false;
}
