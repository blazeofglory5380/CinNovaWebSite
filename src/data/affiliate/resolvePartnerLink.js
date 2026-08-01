/**
 * Phase 11.4A — resolve partner destinations without hardcoding affiliate URLs.
 *
 * Dual gate (both required):
 * 1) VITE_AFFILIATES_ENABLED === "true"
 * 2) partner.enabled === true
 *
 * Fail closed on missing/malformed env destinations.
 */

import {
    AFFILIATE_PROGRAM_CONFIG,
    isAffiliateProgramGloballyEnabled,
} from "./affiliateConfig.js";
import { PARTNER_TYPES, partnerTypeRequiresDisclosure } from "./partnerTypes.js";
import { resolvePartnerRef } from "./partnerRegistry.js";
import { validateHttpsUrl, validateResolvedPartnerLink } from "./linkValidation.js";

function readEnv(key) {
    if (!key) return "";
    const value = import.meta.env?.[key];
    return typeof value === "string" ? value.trim() : "";
}

/**
 * Resolve the outbound href for a partner, or null when inactive / incomplete.
 * Never returns unvalidated values to callers for rendering — use resolvePartnerLink.
 * @param {import('./partnerRegistry.js').PartnerRecord} partner
 * @returns {string|null}
 */
export function resolvePartnerHref(partner) {
    if (!partner) return null;

    const fromEnv = readEnv(partner.urlEnvKey);
    if (fromEnv) {
        // Fail closed before allowlist checks in validateResolvedPartnerLink.
        const check = validateHttpsUrl(fromEnv);
        return check.ok ? fromEnv : null;
    }

    const mayUseOfficial =
        AFFILIATE_PROGRAM_CONFIG.allowOfficialLinksWithoutEnv &&
        (partner.type === PARTNER_TYPES.OFFICIAL || partner.type === PARTNER_TYPES.PARTNER);

    if (mayUseOfficial && partner.officialWebsite) {
        const check = validateHttpsUrl(partner.officialWebsite);
        return check.ok ? partner.officialWebsite : null;
    }

    return null;
}

function commercialRel(type) {
    return type === PARTNER_TYPES.AFFILIATE || type === PARTNER_TYPES.REFERRAL
        ? "noopener noreferrer sponsored nofollow"
        : "noopener noreferrer";
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
            isCommercial: false,
            campaignId: "",
            validation: { ok: false, errors: ["Unknown partner"], warnings: [] },
            rel: "noopener noreferrer",
        };
    }

    const globallyEnabled = isAffiliateProgramGloballyEnabled();
    const href = resolvePartnerHref(partner);
    // Campaign IDs stay out of the DOM/analytics payload by default in 11.4A;
    // presence is validated only for activation readiness, never echoed.
    const campaignIdPresent = Boolean(readEnv(partner.campaignIdEnvKey));
    const validation = validateResolvedPartnerLink({
        partner,
        href,
        globallyEnabled,
    });

    const isCommercial = partnerTypeRequiresDisclosure(partner.type);
    const disclosureRequired =
        validation.renderable &&
        (Boolean(partner.disclosureRequired) || isCommercial);

    return {
        partner,
        href: validation.renderable ? href : null,
        renderable: validation.renderable === true,
        disclosureRequired,
        isCommercial,
        campaignId: "",
        campaignIdConfigured: campaignIdPresent,
        validation,
        rel: commercialRel(partner.type),
    };
}

/**
 * Resolve many partner refs; drops non-renderable entries.
 * @param {Array<string|number>} refs
 */
export function resolveRenderablePartnerLinks(refs = []) {
    return refs.map((ref) => resolvePartnerLink(ref)).filter((entry) => entry.renderable);
}
