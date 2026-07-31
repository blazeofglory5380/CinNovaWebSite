/**
 * Sponsored-content metadata helpers (Phase 11.1).
 * Editorial automation must never invent sponsors. Disclosure only when real.
 */

/**
 * @typedef {object} SponsorMeta
 * @property {boolean} sponsored
 * @property {string|null} sponsorName
 * @property {string|null} sponsorUrl
 * @property {string|null} campaignId
 * @property {string|null} disclosure
 */

/** @returns {SponsorMeta} */
export function emptySponsorMeta() {
    return {
        sponsored: false,
        sponsorName: null,
        sponsorUrl: null,
        campaignId: null,
        disclosure: null,
    };
}

/**
 * Normalize optional sponsor fields. Returns null when not actually sponsored.
 * Does not invent sponsor names/URLs/campaigns.
 */
export function normalizeSponsorMeta(input) {
    if (!input || input.sponsored !== true) return null;
    const sponsorName = typeof input.sponsorName === "string" ? input.sponsorName.trim() : "";
    const sponsorUrl = typeof input.sponsorUrl === "string" ? input.sponsorUrl.trim() : "";
    if (!sponsorName || !/^https?:\/\//i.test(sponsorUrl)) return null;
    return {
        sponsored: true,
        sponsorName,
        sponsorUrl,
        campaignId: input.campaignId || null,
        disclosure:
            input.disclosure ||
            "This content is sponsored. Sponsorship does not change CinNova’s editorial standards.",
    };
}

export function shouldShowSponsoredDisclosure(meta) {
    return Boolean(normalizeSponsorMeta(meta));
}
