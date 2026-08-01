/**
 * Phase 11.4A — supported partner relationship types.
 * Keep this list closed; do not invent new types in UI without updating docs/tests.
 */

export const PARTNER_TYPES = Object.freeze({
    AFFILIATE: "affiliate",
    REFERRAL: "referral",
    PARTNER: "partner",
    OFFICIAL: "official",
});

export const PARTNER_TYPE_LIST = Object.freeze(Object.values(PARTNER_TYPES));

/** Types that require FTC-style disclosure when a resolved commercial link is shown. */
export const DISCLOSURE_REQUIRED_TYPES = Object.freeze(
    new Set([PARTNER_TYPES.AFFILIATE, PARTNER_TYPES.REFERRAL]),
);

export function isPartnerType(value) {
    return PARTNER_TYPE_LIST.includes(value);
}

export function partnerTypeRequiresDisclosure(type) {
    return DISCLOSURE_REQUIRED_TYPES.has(type);
}
