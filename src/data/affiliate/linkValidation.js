/**
 * Phase 11.4A — partner link validation (no network I/O).
 */

import { isPartnerType, partnerTypeRequiresDisclosure } from "./partnerTypes.js";
import { AFFILIATE_PROGRAM_CONFIG } from "./affiliateConfig.js";

const BLOCKED_HOST_HINTS = Object.freeze([
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
    "example.com",
    "example.org",
]);

/**
 * @param {string} value
 * @returns {{ ok: boolean, url: URL|null, errors: string[] }}
 */
export function validateHttpsUrl(value) {
    const errors = [];
    if (!value || typeof value !== "string" || !value.trim()) {
        return { ok: false, url: null, errors: ["URL is empty"] };
    }
    let url;
    try {
        url = new URL(value.trim());
    } catch {
        return { ok: false, url: null, errors: ["URL is not parseable"] };
    }
    if (url.protocol !== "https:") {
        errors.push("URL must use https");
    }
    if (BLOCKED_HOST_HINTS.some((h) => url.hostname === h || url.hostname.endsWith(`.${h}`))) {
        errors.push("URL host is not allowed for partner destinations");
    }
    if (/[<>"']/.test(value)) {
        errors.push("URL contains unsafe characters");
    }
    return { ok: errors.length === 0, url, errors };
}

/**
 * Validate a registry partner record shape (static).
 * @param {import('./partnerRegistry.js').PartnerRecord} partner
 */
export function validatePartnerRecord(partner) {
    const errors = [];
    const warnings = [];

    if (!partner || typeof partner !== "object") {
        return { ok: false, errors: ["Partner record missing"], warnings };
    }
    if (!partner.id || typeof partner.id !== "string") errors.push("id is required");
    if (!partner.name) errors.push("name is required");
    if (!isPartnerType(partner.type)) errors.push(`invalid type: ${partner.type}`);
    if (typeof partner.enabled !== "boolean") errors.push("enabled must be boolean");

    if (partner.officialWebsite) {
        const site = validateHttpsUrl(partner.officialWebsite);
        if (!site.ok) errors.push(...site.errors.map((e) => `officialWebsite: ${e}`));
    }

    const commercial = partnerTypeRequiresDisclosure(partner.type);
    if (commercial && !partner.urlEnvKey) {
        errors.push("affiliate/referral partners require urlEnvKey");
    }
    if (commercial && partner.disclosureRequired !== true && AFFILIATE_PROGRAM_CONFIG.requireDisclosureWhenCommercial) {
        warnings.push("commercial partner should set disclosureRequired: true");
    }
    if (partner.enabled === true && commercial && !partner.urlEnvKey) {
        errors.push("enabled commercial partner missing urlEnvKey");
    }

    return { ok: errors.length === 0, errors, warnings };
}

/**
 * Validate a resolved destination before rendering.
 * @param {object} options
 * @param {import('./partnerRegistry.js').PartnerRecord} options.partner
 * @param {string|null} options.href
 * @param {boolean} options.globallyEnabled
 */
export function validateResolvedPartnerLink({ partner, href, globallyEnabled }) {
    const errors = [];
    const warnings = [];

    const record = validatePartnerRecord(partner);
    errors.push(...record.errors);
    warnings.push(...record.warnings);

    if (!globallyEnabled) {
        return {
            ok: false,
            renderable: false,
            errors: [...errors, "Affiliate program globally disabled"],
            warnings,
        };
    }
    if (!partner?.enabled) {
        return {
            ok: false,
            renderable: false,
            errors: [...errors, "Partner is not enabled"],
            warnings,
        };
    }
    if (!href) {
        return {
            ok: false,
            renderable: false,
            errors: [...errors, "No resolved destination URL"],
            warnings,
        };
    }

    const urlCheck = validateHttpsUrl(href);
    if (!urlCheck.ok) errors.push(...urlCheck.errors);

    return {
        ok: errors.length === 0,
        renderable: errors.length === 0,
        errors,
        warnings,
        host: urlCheck.url?.hostname || "",
    };
}

/**
 * Validate entire registry.
 * @param {ReadonlyArray<import('./partnerRegistry.js').PartnerRecord>} partners
 */
export function validatePartnerRegistry(partners) {
    const results = partners.map((partner) => ({
        id: partner.id,
        ...validatePartnerRecord(partner),
    }));
    const ids = partners.map((p) => p.id);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    const legacyIds = partners.map((p) => p.legacyNumericId).filter((n) => n != null);
    const legacyDupes = legacyIds.filter((id, i) => legacyIds.indexOf(id) !== i);

    return {
        ok: results.every((r) => r.ok) && dupes.length === 0 && legacyDupes.length === 0,
        results,
        duplicateIds: [...new Set(dupes)],
        duplicateLegacyIds: [...new Set(legacyDupes)],
    };
}
