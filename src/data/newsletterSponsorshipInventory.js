/**
 * Phase M2 — newsletter sponsorship inventory architecture.
 * Never invent subscriber/open/click/price metrics.
 */

export const NEWSLETTER_SPONSOR_SLOTS = Object.freeze([
    {
        id: "weekly_digest_primary",
        label: "Weekly digest — primary sponsor",
        status: "available_on_request",
        price: null,
        priceDisplay: "Available on request",
    },
    {
        id: "weekly_digest_secondary",
        label: "Weekly digest — secondary mention",
        status: "available_on_request",
        price: null,
        priceDisplay: "Available on request",
    },
]);

export function getNewsletterMonetizationReadiness() {
    return {
        signup: true,
        preferences: true,
        unsubscribe: true,
        archive: "partial",
        digest: "supported_architecture",
        sponsorSlots: NEWSLETTER_SPONSOR_SLOTS.length,
        sponsorDisclosure: true,
        premiumNewsletter: false,
        inventedMetricsForbidden: true,
        metrics: {
            subscribers: "Available on request",
            openRate: "Available on request",
            clickRate: "Available on request",
            sponsorshipPrice: "Available on request",
        },
    };
}

export function listSponsorSlots() {
    return NEWSLETTER_SPONSOR_SLOTS.map((s) => ({ ...s }));
}
