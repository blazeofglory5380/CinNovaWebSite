/**
 * Phase 11.4A — resolve partner destinations without hardcoding affiliate URLs.
 */

import {
    AFFILIATE_PROGRAM_CONFIG,
    isAffiliateProgramGloballyEnabled,
} from "./affiliateConfig.js";
import { PARTNER_TYPES, partnerTypeRequiresDisclosure } from "./partnerTypes.js";
import { resolvePartnerRef } from "./partnerRegistry.js";
import { validateResolvedPartnerLink } from "./linkValidation.js";

function readEnv(key) {
    if (!key) return "";
    const value = import.meta.env?.[key];
    return typeof value === "string" ? value.trim() : "";
}

/**
 * Resolve the outbound href for a partner, or null when inactive / incomplete.
 * @param {import('./partnerRegistry.js').PartnerRecord} partner
 * @returns {string|null}
 */
export function resolvePartnerHref(partner) {
    if (!partner) return null;

    const fromEnv = readEnv(partner.urlEnvKey);
    if (fromEnv) return fromEnv;

    const mayUseOfficial =
        AFFILIATE_PROGRAM_CONFIG.allowOfficialLinksWithoutEnv &&
        (partner.type === PARTNER_TYPES.OFFICIAL || partner.type === PARTNER_TYPES.PARTNER);

    if (mayUseOfficial && partner.officialWebsite) {
        return partner.officialWebsite;
    }

    return null;
}

/**
 * Full resolution + validation gate used by UI.
 * @param {string|number} partnerRef
 */
export function resolvePartnerLink(partnerRef) {
    const partner = resolvePartnerRef(partnerRef);
    if (!partner) {
        return {
            partner: null,
            href: null,
            renderable: false,
            disclosureRequired: false,
            campaignId: "",
            validation: { ok: false, errors: ["Unknown partner"], warnings: [] },
        };
    }

    const globallyEnabled = isAffiliateProgramGloballyEnabled();
    const href = resolvePartnerHref(partner);
    const campaignId = readEnv(partner.campaignIdEnvKey);
    const validation = validateResolvedPartnerLink({
        partner,
        href,
        globallyEnabled,
    });

    const disclosureRequired =
        Boolean(partner.disclosureRequired) || partnerTypeRequiresDisclosure(partner.type);

    return {
        partner,
        href: validation.renderable ? href : null,
        renderable: validation.renderable === true,
        disclosureRequired,
        campaignId: validation.renderable ? campaignId : "",
        validation,
        rel:
            partner.type === PARTNER_TYPES.AFFILIATE || partner.type === PARTNER_TYPES.REFERRAL
                ? "noopener noreferrer sponsored nofollow"
                : "noopener noreferrer",
    };
}

/**
 * Resolve many partner refs; drops non-renderable entries.
 * @param {Array<string|number>} refs
 */
export function resolveRenderablePartnerLinks(refs = []) {
    return refs.map((ref) => resolvePartnerLink(ref)).filter((entry) => entry.renderable);
}
