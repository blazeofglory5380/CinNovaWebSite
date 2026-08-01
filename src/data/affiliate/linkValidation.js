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
    "::1",
]);

const PRIVATE_HOST_PATTERNS = Object.freeze([
    /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
    /^192\.168\.\d{1,3}\.\d{1,3}$/,
    /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/,
    /^169\.254\.\d{1,3}\.\d{1,3}$/,
    /^100\.(6[4-9]|[7-9]\d|1[0-2]\d)\.\d{1,3}\.\d{1,3}$/,
]);

/**
 * @param {string} value
 * @returns {{ ok: boolean, url: URL|null, errors: string[] }}
 */
export function validateHttpsUrl(value) {
    const errors = [];
    if (value == null || typeof value !== "string" || !value.trim()) {
        return { ok: false, url: null, errors: ["URL is empty"] };
    }
    const trimmed = value.trim();
    if (/^\s*[.#/?]/.test(trimmed) || !/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
        return { ok: false, url: null, errors: ["Relative or scheme-less URLs are not allowed"] };
    }

    let url;
    try {
        url = new URL(trimmed);
    } catch {
        return { ok: false, url: null, errors: ["URL is not parseable"] };
    }

    if (url.protocol !== "https:") {
        errors.push("URL must use https");
    }
    if (url.username || url.password) {
        errors.push("Credential-bearing URLs are not allowed");
    }
    if (!url.hostname) {
        errors.push("URL host is required");
    }
    if (BLOCKED_HOST_HINTS.some((h) => url.hostname === h || url.hostname.endsWith(`.${h}`))) {
        errors.push("URL host is not allowed for partner destinations");
    }
    if (PRIVATE_HOST_PATTERNS.some((re) => re.test(url.hostname))) {
        errors.push("Private-network destinations are not allowed");
    }
    if (/[<>"']/.test(trimmed)) {
        errors.push("URL contains unsafe characters");
    }

    return { ok: errors.length === 0, url: errors.length === 0 ? url : url, errors };
}

/**
 * Hostnames allowed for a partner destination (official site + optional allowlist).
 * @param {import('./partnerRegistry.js').PartnerRecord} partner
 * @returns {string[]}
 */
export function getPartnerAllowedHosts(partner) {
    const hosts = new Set();
    if (Array.isArray(partner?.allowedHosts)) {
        partner.allowedHosts.forEach((h) => {
            if (typeof h === "string" && h.trim()) hosts.add(h.trim().toLowerCase());
        });
    }
    if (partner?.officialWebsite) {
        try {
            const site = new URL(partner.officialWebsite);
            if (site.hostname) hosts.add(site.hostname.toLowerCase());
            // Allow common www / apex pairing when official site uses one of them.
            if (site.hostname.startsWith("www.")) {
                hosts.add(site.hostname.slice(4));
            } else {
                hosts.add(`www.${site.hostname}`);
            }
        } catch {
            /* ignore */
        }
    }
    return [...hosts];
}

/**
 * @param {string} hostname
 * @param {string[]} allowedHosts
 */
export function hostMatchesAllowlist(hostname, allowedHosts = []) {
    if (!hostname || !allowedHosts.length) return false;
    const host = hostname.toLowerCase();
    return allowedHosts.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
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
    if (
        commercial &&
        partner.disclosureRequired !== true &&
        AFFILIATE_PROGRAM_CONFIG.requireDisclosureWhenCommercial
    ) {
        warnings.push("commercial partner should set disclosureRequired: true");
    }
    if (partner.enabled === true && commercial && !partner.urlEnvKey) {
        errors.push("enabled commercial partner missing urlEnvKey");
    }

    return { ok: errors.length === 0, errors, warnings };
}

/**
 * Validate a resolved destination before rendering.
 * Requires BOTH global program enablement and partner.enabled.
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
    if (!urlCheck.ok) {
        errors.push(...urlCheck.errors);
    } else {
        const allowed = getPartnerAllowedHosts(partner);
        if (allowed.length > 0 && !hostMatchesAllowlist(urlCheck.url.hostname, allowed)) {
            errors.push("Destination host is not on the partner allowlist");
        }
    }

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
