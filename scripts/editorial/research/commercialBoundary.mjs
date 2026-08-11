/**
 * Phase 4 — commercial / editorial boundary.
 * Monetization CTAs are allowed; they must not corrupt facts or invent experience.
 */

export const CTA_TYPES = Object.freeze([
    "read_book",
    "download_app",
    "subscribe_newsletter",
    "explore_product",
    "affiliate_recommendation",
]);

export const COMMERCIAL_RULES = Object.freeze({
    editorialConclusionsIndependentOfMonetization: true,
    affiliateDisclosureRequired: true,
    sponsoredContentMustBeLabeled: true,
    noFakeReviews: true,
    noFakeProductTesting: true,
    noInventedPersonalExperience: true,
    affiliateMustNotInfluenceFactualRanking: true,
    monetizationActivationDeferred: true,
});

/**
 * Build CTA metadata for a draft without changing factual claims.
 */
export function buildCommercialCtas({
    allowedTypes = ["subscribe_newsletter", "explore_product", "read_book", "download_app"],
    products = [],
    affiliateRecommendations = [],
    sponsored = false,
} = {}) {
    const ctas = [];
    for (const type of allowedTypes) {
        if (!CTA_TYPES.includes(type)) continue;
        if (type === "explore_product" || type === "download_app") {
            for (const product of products) {
                ctas.push({
                    type,
                    label: product.label,
                    path: product.path,
                    influencesFacts: false,
                    disclosureRequired: false,
                });
            }
        } else if (type === "affiliate_recommendation") {
            for (const item of affiliateRecommendations) {
                ctas.push({
                    type,
                    label: item.label,
                    url: item.url || null,
                    influencesFacts: false,
                    disclosureRequired: true,
                    disclosureText:
                        item.disclosureText
                        || "This recommendation may include an affiliate relationship. Editorial conclusions are independent of affiliate compensation.",
                    activated: false,
                });
            }
        } else if (type === "subscribe_newsletter") {
            ctas.push({
                type,
                label: "Subscribe to CinNova newsletter",
                path: "/newsletter",
                influencesFacts: false,
                disclosureRequired: false,
            });
        } else if (type === "read_book") {
            ctas.push({
                type,
                label: "Explore CinNova books",
                path: "/books",
                influencesFacts: false,
                disclosureRequired: false,
            });
        }
    }

    return {
        rules: { ...COMMERCIAL_RULES },
        sponsored: Boolean(sponsored),
        sponsoredLabel: sponsored ? "Sponsored" : null,
        ctas,
        affiliateDisclosure:
            ctas.some((c) => c.disclosureRequired)
                ? {
                      required: true,
                      text: "Affiliate relationships, when present, are disclosed. They do not change factual ranking or editorial conclusions.",
                      activated: false,
                  }
                : { required: false, text: null, activated: false },
        safety: [
            "Editorial conclusions cannot be changed because of monetization.",
            "No fake reviews, fake testing, or invented personal experience.",
            "Affiliate/payment activation remains OFF in Phase 4.",
        ],
    };
}

/**
 * Validate that commercial metadata does not claim to alter facts.
 */
export function assertCommercialBoundary(meta = {}) {
    const issues = [];
    if (meta.rules && meta.rules.editorialConclusionsIndependentOfMonetization !== true) {
        issues.push("Editorial independence flag missing");
    }
    for (const cta of meta.ctas || []) {
        if (cta.influencesFacts) issues.push(`CTA ${cta.type} incorrectly marks influencesFacts=true`);
        if (cta.type === "affiliate_recommendation" && !cta.disclosureRequired) {
            issues.push("Affiliate CTA missing disclosureRequired");
        }
    }
    if (meta.sponsored && !meta.sponsoredLabel) {
        issues.push("Sponsored content missing label");
    }
    return { ok: issues.length === 0, issues };
}
