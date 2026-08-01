/**
 * Phase 11.4A — central partner registry.
 *
 * Rules:
 * - No production affiliate IDs or tracked affiliate URLs in this file.
 * - `enabled: false` for every partner until a verified relationship exists.
 * - Commercial destinations come from env keys at resolve time, never hardcoded.
 * - `officialWebsite` is a public marketing URL for reference / official-type
 *   destinations only — it is not an affiliate deep link.
 */

import { PARTNER_TYPES } from "./partnerTypes.js";

/**
 * @typedef {object} PartnerRecord
 * @property {string} id
 * @property {number|null} legacyNumericId
 * @property {string} name
 * @property {string} type
 * @property {boolean} enabled
 * @property {boolean} disclosureRequired
 * @property {string} category
 * @property {string} tagline
 * @property {string|null} officialWebsite
 * @property {string|null} urlEnvKey
 * @property {string|null} campaignIdEnvKey
 * @property {string[]} surfaces
 * @property {string} notes
 */

/** @type {ReadonlyArray<PartnerRecord>} */
export const PARTNER_REGISTRY = Object.freeze([
    Object.freeze({
        id: "notion",
        legacyNumericId: 1,
        name: "Notion",
        type: PARTNER_TYPES.AFFILIATE,
        enabled: false,
        disclosureRequired: true,
        category: "Productivity",
        tagline: "All-in-one notes, tasks, and planning workspace",
        officialWebsite: "https://www.notion.com/",
        urlEnvKey: "VITE_AFFILIATE_URL_NOTION",
        campaignIdEnvKey: "VITE_AFFILIATE_CAMPAIGN_NOTION",
        surfaces: ["blog", "article"],
        notes: "Inactive placeholder. Do not set env URL until Associates/partner terms are verified.",
    }),
    Object.freeze({
        id: "canva",
        legacyNumericId: 2,
        name: "Canva",
        type: PARTNER_TYPES.AFFILIATE,
        enabled: false,
        disclosureRequired: true,
        category: "Design",
        tagline: "Design graphics, social posts, and presentations in minutes",
        officialWebsite: "https://www.canva.com/",
        urlEnvKey: "VITE_AFFILIATE_URL_CANVA",
        campaignIdEnvKey: "VITE_AFFILIATE_CAMPAIGN_CANVA",
        surfaces: ["blog", "article"],
        notes: "Inactive placeholder.",
    }),
    Object.freeze({
        id: "grammarly",
        legacyNumericId: 3,
        name: "Grammarly",
        type: PARTNER_TYPES.AFFILIATE,
        enabled: false,
        disclosureRequired: true,
        category: "Writing",
        tagline: "AI writing assistant for clear, professional writing",
        officialWebsite: "https://www.grammarly.com/",
        urlEnvKey: "VITE_AFFILIATE_URL_GRAMMARLY",
        campaignIdEnvKey: "VITE_AFFILIATE_CAMPAIGN_GRAMMARLY",
        surfaces: ["blog", "article"],
        notes: "Inactive placeholder.",
    }),
    Object.freeze({
        id: "biggerpockets",
        legacyNumericId: 4,
        name: "BiggerPockets Pro",
        type: PARTNER_TYPES.AFFILIATE,
        enabled: false,
        disclosureRequired: true,
        category: "Real Estate",
        tagline: "Real estate investing education, deal analysis tools, and community",
        officialWebsite: "https://www.biggerpockets.com/",
        urlEnvKey: "VITE_AFFILIATE_URL_BIGGERPOCKETS",
        campaignIdEnvKey: "VITE_AFFILIATE_CAMPAIGN_BIGGERPOCKETS",
        surfaces: ["blog", "article", "real-estate"],
        notes: "Inactive placeholder.",
    }),
    Object.freeze({
        id: "dealcheck",
        legacyNumericId: 5,
        name: "DealCheck",
        type: PARTNER_TYPES.REFERRAL,
        enabled: false,
        disclosureRequired: true,
        category: "Real Estate",
        tagline: "Rental property and flip analyzer",
        officialWebsite: "https://dealcheck.io/",
        urlEnvKey: "VITE_AFFILIATE_URL_DEALCHECK",
        campaignIdEnvKey: "VITE_AFFILIATE_CAMPAIGN_DEALCHECK",
        surfaces: ["blog", "article", "real-estate"],
        notes: "Inactive placeholder (referral-type when activated).",
    }),
    Object.freeze({
        id: "khan-academy",
        legacyNumericId: 6,
        name: "Khan Academy",
        type: PARTNER_TYPES.OFFICIAL,
        enabled: false,
        disclosureRequired: false,
        category: "Education",
        tagline: "Free world-class education for anyone, anywhere",
        officialWebsite: "https://www.khanacademy.org/",
        urlEnvKey: null,
        campaignIdEnvKey: null,
        surfaces: ["blog", "article", "education"],
        notes: "Official non-commission recommendation. Still gated until intentionally enabled.",
    }),
    Object.freeze({
        id: "amazon-associates",
        legacyNumericId: null,
        name: "Amazon Associates",
        type: PARTNER_TYPES.AFFILIATE,
        enabled: false,
        disclosureRequired: true,
        category: "Retail",
        tagline: "Verified Associates destinations for catalog commerce entities",
        officialWebsite: "https://affiliate-program.amazon.com/",
        allowedHosts: Object.freeze([
            "amazon.com",
            "www.amazon.com",
            "affiliate-program.amazon.com",
        ]),
        urlEnvKey: "VITE_AFFILIATE_URL_AMAZON",
        campaignIdEnvKey: "VITE_AFFILIATE_CAMPAIGN_AMAZON",
        surfaces: ["books", "commerce"],
        notes: "Program shell only. SEAT Kindle link stays non-affiliate until Associates is verified.",
    }),
]);

const byId = new Map(PARTNER_REGISTRY.map((p) => [p.id, p]));
const byLegacyId = new Map(
    PARTNER_REGISTRY.filter((p) => p.legacyNumericId != null).map((p) => [p.legacyNumericId, p]),
);

export function listPartners() {
    return PARTNER_REGISTRY.slice();
}

export function getPartnerById(id) {
    if (id == null) return null;
    return byId.get(String(id)) || null;
}

export function getPartnerByLegacyNumericId(numericId) {
    const n = Number(numericId);
    if (!Number.isFinite(n)) return null;
    return byLegacyId.get(n) || null;
}

export function resolvePartnerRef(ref) {
    if (ref == null) return null;
    if (typeof ref === "number") return getPartnerByLegacyNumericId(ref);
    const asNumber = Number(ref);
    if (Number.isFinite(asNumber) && String(ref).trim() === String(asNumber)) {
        return getPartnerByLegacyNumericId(asNumber) || getPartnerById(ref);
    }
    return getPartnerById(ref);
}

export function listPartnersByType(type) {
    return PARTNER_REGISTRY.filter((p) => p.type === type);
}

export function listEnabledPartners() {
    return PARTNER_REGISTRY.filter((p) => p.enabled === true);
}
