/**
 * Compatibility layer for article surfaces that previously imported affiliateLinks.js.
 *
 * Phase 11.4A: no hardcoded affiliate URLs. Destinations resolve only when:
 * - VITE_AFFILIATES_ENABLED=true
 * - partner.enabled === true
 * - validated https destination from env (or officialWebsite for official/partner)
 *
 * Until activation, getAffiliateLinksForIds always returns [].
 */

import {
    listPartners,
    resolvePartnerLink,
    resolvePartnerRef,
} from "./affiliate/index.js";

/**
 * Catalog view of inactive partner shells (no live affiliate hrefs).
 * Kept for admin / docs introspection — not for clickable article cards.
 */
export const affiliateLinks = Object.freeze(
    Object.fromEntries(
        listPartners()
            .filter((p) => p.legacyNumericId != null)
            .map((p) => [
                p.legacyNumericId,
                Object.freeze({
                    id: p.legacyNumericId,
                    partnerId: p.id,
                    name: p.name,
                    category: p.category,
                    tagline: p.tagline,
                    type: p.type,
                    enabled: p.enabled,
                    // Intentionally null — never ship hardcoded affiliate URLs.
                    url: null,
                    disclosure: p.disclosureRequired
                        ? "Affiliate or referral relationship — disclosure required when activated."
                        : "Official / partner recommendation — no commission disclosure required.",
                }),
            ]),
    ),
);

export function getAffiliateLink(id) {
    const partner = resolvePartnerRef(id);
    if (!partner) return null;
    const resolved = resolvePartnerLink(partner.id);
    if (!resolved.renderable) return null;
    return {
        id: partner.legacyNumericId ?? partner.id,
        partnerId: partner.id,
        name: partner.name,
        category: partner.category,
        tagline: partner.tagline,
        type: partner.type,
        url: resolved.href,
        rel: resolved.rel,
        disclosureRequired: resolved.disclosureRequired,
        campaignId: resolved.campaignId,
    };
}

export function getAffiliateLinksForIds(ids = []) {
    return ids.map((id) => getAffiliateLink(id)).filter(Boolean);
}
