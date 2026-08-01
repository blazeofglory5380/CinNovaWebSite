/**
 * Phase 11.4A — global affiliate / partner program configuration.
 *
 * Master switch defaults OFF. No production affiliate IDs live here.
 * Per-partner URLs resolve from env keys defined on registry entries.
 */

/**
 * @typedef {object} AffiliateProgramConfig
 * @property {boolean} globallyEnabled
 * @property {boolean} requireDisclosureWhenCommercial
 * @property {boolean} allowOfficialLinksWithoutEnv
 * @property {string} defaultDisclosure
 * @property {string} adminPageKey
 */

/** @type {AffiliateProgramConfig} */
export const AFFILIATE_PROGRAM_CONFIG = Object.freeze({
    /**
     * Build-time master switch. Must be explicitly "true" AND a partner must be
     * enabled with a validated destination before any PartnerOutboundLink href
     * is emitted.
     */
    globallyEnabled: import.meta.env?.VITE_AFFILIATES_ENABLED === "true",
    requireDisclosureWhenCommercial: true,
    /** Official / non-commission partner pages may use registry officialWebsite. */
    allowOfficialLinksWithoutEnv: true,
    defaultDisclosure:
        "CinNova may earn a commission from qualifying purchases made through certain links.",
    adminPageKey: "partner-admin",
});

export function isAffiliateProgramGloballyEnabled() {
    return AFFILIATE_PROGRAM_CONFIG.globallyEnabled === true;
}

export function getDefaultAffiliateDisclosure() {
    return AFFILIATE_PROGRAM_CONFIG.defaultDisclosure;
}

/**
 * Snapshot for admin UI / tests (no secrets).
 */
export function getAffiliateProgramStatus() {
    return {
        globallyEnabled: isAffiliateProgramGloballyEnabled(),
        requireDisclosureWhenCommercial: AFFILIATE_PROGRAM_CONFIG.requireDisclosureWhenCommercial,
        allowOfficialLinksWithoutEnv: AFFILIATE_PROGRAM_CONFIG.allowOfficialLinksWithoutEnv,
        envFlag: "VITE_AFFILIATES_ENABLED",
        activationState: isAffiliateProgramGloballyEnabled() ? "enabled" : "disabled",
    };
}
