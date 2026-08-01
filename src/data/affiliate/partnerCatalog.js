/**
 * Phase 11.4B — centralized AI & Technology Partner Catalog.
 *
 * IMPORTANT:
 * - Catalog entries are research / prospect records only.
 * - Listing a company here does NOT claim a partnership, affiliate approval,
 *   or commercial relationship exists.
 * - No affiliate/referral IDs, tracked commercial URLs, or payment rails here.
 * - Every record defaults to Not Applied + Disabled activation.
 */

import { PARTNER_TYPES, isPartnerType } from "./partnerTypes.js";
import { CATALOG_CATEGORIES, isCatalogCategory } from "./catalogCategories.js";
import {
    ACTIVATION_STATUSES,
    APPLICATION_STATUSES,
    APPROVAL_STATUSES,
    CATALOG_DEFAULT_STATUSES,
    isActivationStatus,
    isApplicationStatus,
    isApprovalStatus,
    isProgramStatus,
    PROGRAM_STATUSES,
} from "./catalogStatuses.js";
import { validateHttpsUrl } from "./linkValidation.js";

/**
 * @typedef {object} PartnerCatalogRecord
 * @property {string} id
 * @property {string} companyName
 * @property {string} officialWebsite
 * @property {string} category
 * @property {string} partnerType
 * @property {string} programStatus
 * @property {string} applicationStatus
 * @property {string} approvalStatus
 * @property {string} activationStatus
 * @property {ReadonlyArray<string>} allowedDomains
 * @property {boolean} ftcDisclosureRequired
 * @property {string} notes
 * @property {string} lastReviewed  ISO date YYYY-MM-DD
 * @property {string|null} registryPartnerId  optional link into PARTNER_REGISTRY
 * @property {null} affiliateId  always null in this phase
 * @property {null} referralId   always null in this phase
 */

const REVIEWED = "2026-07-31";

/**
 * @param {object} partial
 * @returns {PartnerCatalogRecord}
 */
function catalogEntry(partial) {
    const allowedDomains = Object.freeze([...(partial.allowedDomains || [])]);
    return Object.freeze({
        id: partial.id,
        companyName: partial.companyName,
        officialWebsite: partial.officialWebsite,
        category: partial.category,
        partnerType: partial.partnerType,
        programStatus: partial.programStatus ?? CATALOG_DEFAULT_STATUSES.programStatus,
        applicationStatus: CATALOG_DEFAULT_STATUSES.applicationStatus,
        approvalStatus: CATALOG_DEFAULT_STATUSES.approvalStatus,
        activationStatus: CATALOG_DEFAULT_STATUSES.activationStatus,
        allowedDomains,
        ftcDisclosureRequired: Boolean(partial.ftcDisclosureRequired),
        notes: partial.notes || "",
        lastReviewed: partial.lastReviewed || REVIEWED,
        registryPartnerId: partial.registryPartnerId ?? null,
        affiliateId: null,
        referralId: null,
    });
}

/** @type {ReadonlyArray<PartnerCatalogRecord>} */
export const PARTNER_CATALOG = Object.freeze([
    // —— AI Companies ——
    catalogEntry({
        id: "openai",
        companyName: "OpenAI",
        officialWebsite: "https://openai.com/",
        category: CATALOG_CATEGORIES.AI_COMPANIES,
        partnerType: PARTNER_TYPES.PARTNER,
        programStatus: PROGRAM_STATUSES.RESEARCHING,
        allowedDomains: ["openai.com", "www.openai.com", "platform.openai.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. No application filed. No commercial links.",
    }),
    catalogEntry({
        id: "anthropic",
        companyName: "Anthropic",
        officialWebsite: "https://www.anthropic.com/",
        category: CATALOG_CATEGORIES.AI_COMPANIES,
        partnerType: PARTNER_TYPES.PARTNER,
        programStatus: PROGRAM_STATUSES.RESEARCHING,
        allowedDomains: ["anthropic.com", "www.anthropic.com", "claude.ai"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. No application filed. No commercial links.",
    }),
    catalogEntry({
        id: "google-ai",
        companyName: "Google AI",
        officialWebsite: "https://ai.google/",
        category: CATALOG_CATEGORIES.AI_COMPANIES,
        partnerType: PARTNER_TYPES.PARTNER,
        programStatus: PROGRAM_STATUSES.RESEARCHING,
        allowedDomains: ["ai.google", "google.com", "www.google.com", "deepmind.google"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. Covers Google AI / Gemini public surfaces for research.",
    }),
    catalogEntry({
        id: "hugging-face",
        companyName: "Hugging Face",
        officialWebsite: "https://huggingface.co/",
        category: CATALOG_CATEGORIES.AI_COMPANIES,
        partnerType: PARTNER_TYPES.AFFILIATE,
        programStatus: PROGRAM_STATUSES.RESEARCHING,
        allowedDomains: ["huggingface.co", "www.huggingface.co"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. Evaluate Hub / Pro affiliate options before applying.",
    }),
    catalogEntry({
        id: "perplexity",
        companyName: "Perplexity",
        officialWebsite: "https://www.perplexity.ai/",
        category: CATALOG_CATEGORIES.AI_COMPANIES,
        partnerType: PARTNER_TYPES.AFFILIATE,
        programStatus: PROGRAM_STATUSES.RESEARCHING,
        allowedDomains: ["perplexity.ai", "www.perplexity.ai"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. No application filed.",
    }),
    catalogEntry({
        id: "runway",
        companyName: "Runway",
        officialWebsite: "https://runwayml.com/",
        category: CATALOG_CATEGORIES.AI_COMPANIES,
        partnerType: PARTNER_TYPES.AFFILIATE,
        programStatus: PROGRAM_STATUSES.RESEARCHING,
        allowedDomains: ["runwayml.com", "www.runwayml.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. Creative AI video tooling.",
    }),
    catalogEntry({
        id: "elevenlabs",
        companyName: "ElevenLabs",
        officialWebsite: "https://elevenlabs.io/",
        category: CATALOG_CATEGORIES.AI_COMPANIES,
        partnerType: PARTNER_TYPES.AFFILIATE,
        programStatus: PROGRAM_STATUSES.RESEARCHING,
        allowedDomains: ["elevenlabs.io", "www.elevenlabs.io"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. No application filed.",
    }),

    // —— Creative Tools ——
    catalogEntry({
        id: "adobe",
        companyName: "Adobe",
        officialWebsite: "https://www.adobe.com/",
        category: CATALOG_CATEGORIES.CREATIVE_TOOLS,
        partnerType: PARTNER_TYPES.AFFILIATE,
        programStatus: PROGRAM_STATUSES.RESEARCHING,
        allowedDomains: ["adobe.com", "www.adobe.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. Creative Cloud / Firefly programs under research.",
    }),
    catalogEntry({
        id: "canva-catalog",
        companyName: "Canva",
        officialWebsite: "https://www.canva.com/",
        category: CATALOG_CATEGORIES.CREATIVE_TOOLS,
        partnerType: PARTNER_TYPES.AFFILIATE,
        programStatus: PROGRAM_STATUSES.RESEARCHING,
        allowedDomains: ["canva.com", "www.canva.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect catalog entry. Runtime registry id `canva` remains disabled.",
        registryPartnerId: "canva",
    }),
    catalogEntry({
        id: "figma",
        companyName: "Figma",
        officialWebsite: "https://www.figma.com/",
        category: CATALOG_CATEGORIES.CREATIVE_TOOLS,
        partnerType: PARTNER_TYPES.AFFILIATE,
        programStatus: PROGRAM_STATUSES.RESEARCHING,
        allowedDomains: ["figma.com", "www.figma.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. No application filed.",
    }),
    catalogEntry({
        id: "notion-catalog",
        companyName: "Notion",
        officialWebsite: "https://www.notion.com/",
        category: CATALOG_CATEGORIES.CREATIVE_TOOLS,
        partnerType: PARTNER_TYPES.AFFILIATE,
        programStatus: PROGRAM_STATUSES.RESEARCHING,
        allowedDomains: ["notion.com", "www.notion.com", "notion.so", "www.notion.so"],
        ftcDisclosureRequired: true,
        notes: "Prospect catalog entry. Runtime registry id `notion` remains disabled.",
        registryPartnerId: "notion",
    }),
    catalogEntry({
        id: "midjourney",
        companyName: "Midjourney",
        officialWebsite: "https://www.midjourney.com/",
        category: CATALOG_CATEGORIES.CREATIVE_TOOLS,
        partnerType: PARTNER_TYPES.AFFILIATE,
        programStatus: PROGRAM_STATUSES.RESEARCHING,
        allowedDomains: ["midjourney.com", "www.midjourney.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. Program availability may be invite/community gated.",
    }),
    catalogEntry({
        id: "descript",
        companyName: "Descript",
        officialWebsite: "https://www.descript.com/",
        category: CATALOG_CATEGORIES.CREATIVE_TOOLS,
        partnerType: PARTNER_TYPES.AFFILIATE,
        programStatus: PROGRAM_STATUSES.RESEARCHING,
        allowedDomains: ["descript.com", "www.descript.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. No application filed.",
    }),

    // —— Developer Platforms ——
    catalogEntry({
        id: "github",
        companyName: "GitHub",
        officialWebsite: "https://github.com/",
        category: CATALOG_CATEGORIES.DEVELOPER_PLATFORMS,
        partnerType: PARTNER_TYPES.PARTNER,
        programStatus: PROGRAM_STATUSES.RESEARCHING,
        allowedDomains: ["github.com", "www.github.com", "github.blog"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. Evaluate partner / sponsorship options separately from ads.",
    }),
    catalogEntry({
        id: "vercel",
        companyName: "Vercel",
        officialWebsite: "https://vercel.com/",
        category: CATALOG_CATEGORIES.DEVELOPER_PLATFORMS,
        partnerType: PARTNER_TYPES.AFFILIATE,
        programStatus: PROGRAM_STATUSES.RESEARCHING,
        allowedDomains: ["vercel.com", "www.vercel.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. No application filed. No commercial links.",
    }),
    catalogEntry({
        id: "netlify",
        companyName: "Netlify",
        officialWebsite: "https://www.netlify.com/",
        category: CATALOG_CATEGORIES.DEVELOPER_PLATFORMS,
        partnerType: PARTNER_TYPES.AFFILIATE,
        programStatus: PROGRAM_STATUSES.RESEARCHING,
        allowedDomains: ["netlify.com", "www.netlify.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. No application filed.",
    }),
    catalogEntry({
        id: "replit",
        companyName: "Replit",
        officialWebsite: "https://replit.com/",
        category: CATALOG_CATEGORIES.DEVELOPER_PLATFORMS,
        partnerType: PARTNER_TYPES.AFFILIATE,
        programStatus: PROGRAM_STATUSES.RESEARCHING,
        allowedDomains: ["replit.com", "www.replit.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. No application filed.",
    }),
    catalogEntry({
        id: "docker",
        companyName: "Docker",
        officialWebsite: "https://www.docker.com/",
        category: CATALOG_CATEGORIES.DEVELOPER_PLATFORMS,
        partnerType: PARTNER_TYPES.PARTNER,
        programStatus: PROGRAM_STATUSES.RESEARCHING,
        allowedDomains: ["docker.com", "www.docker.com", "hub.docker.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. No application filed.",
    }),
    catalogEntry({
        id: "cloudflare-workers",
        companyName: "Cloudflare Developers",
        officialWebsite: "https://developers.cloudflare.com/",
        category: CATALOG_CATEGORIES.DEVELOPER_PLATFORMS,
        partnerType: PARTNER_TYPES.PARTNER,
        programStatus: PROGRAM_STATUSES.RESEARCHING,
        allowedDomains: [
            "developers.cloudflare.com",
            "cloudflare.com",
            "www.cloudflare.com",
        ],
        ftcDisclosureRequired: true,
        notes: "Prospect only. Developer platform surface (Workers / Pages).",
    }),

    // —— Cloud Providers ——
    catalogEntry({
        id: "aws",
        companyName: "Amazon Web Services",
        officialWebsite: "https://aws.amazon.com/",
        category: CATALOG_CATEGORIES.CLOUD_PROVIDERS,
        partnerType: PARTNER_TYPES.PARTNER,
        programStatus: PROGRAM_STATUSES.RESEARCHING,
        allowedDomains: ["aws.amazon.com", "amazon.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. Distinct from Amazon Associates retail shell.",
    }),
    catalogEntry({
        id: "google-cloud",
        companyName: "Google Cloud",
        officialWebsite: "https://cloud.google.com/",
        category: CATALOG_CATEGORIES.CLOUD_PROVIDERS,
        partnerType: PARTNER_TYPES.PARTNER,
        programStatus: PROGRAM_STATUSES.RESEARCHING,
        allowedDomains: ["cloud.google.com", "google.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. No application filed.",
    }),
    catalogEntry({
        id: "microsoft-azure",
        companyName: "Microsoft Azure",
        officialWebsite: "https://azure.microsoft.com/",
        category: CATALOG_CATEGORIES.CLOUD_PROVIDERS,
        partnerType: PARTNER_TYPES.PARTNER,
        programStatus: PROGRAM_STATUSES.RESEARCHING,
        allowedDomains: ["azure.microsoft.com", "microsoft.com", "www.microsoft.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. No application filed.",
    }),
    catalogEntry({
        id: "digitalocean",
        companyName: "DigitalOcean",
        officialWebsite: "https://www.digitalocean.com/",
        category: CATALOG_CATEGORIES.CLOUD_PROVIDERS,
        partnerType: PARTNER_TYPES.REFERRAL,
        programStatus: PROGRAM_STATUSES.RESEARCHING,
        allowedDomains: ["digitalocean.com", "www.digitalocean.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. Referral programs common; none activated here.",
    }),
    catalogEntry({
        id: "cloudflare",
        companyName: "Cloudflare",
        officialWebsite: "https://www.cloudflare.com/",
        category: CATALOG_CATEGORIES.CLOUD_PROVIDERS,
        partnerType: PARTNER_TYPES.PARTNER,
        programStatus: PROGRAM_STATUSES.RESEARCHING,
        allowedDomains: ["cloudflare.com", "www.cloudflare.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. Cloud / edge network surface.",
    }),

    // —— Hardware Companies ——
    catalogEntry({
        id: "nvidia",
        companyName: "NVIDIA",
        officialWebsite: "https://www.nvidia.com/",
        category: CATALOG_CATEGORIES.HARDWARE_COMPANIES,
        partnerType: PARTNER_TYPES.PARTNER,
        programStatus: PROGRAM_STATUSES.RESEARCHING,
        allowedDomains: ["nvidia.com", "www.nvidia.com", "developer.nvidia.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. No application filed. No commercial links.",
    }),
    catalogEntry({
        id: "apple",
        companyName: "Apple",
        officialWebsite: "https://www.apple.com/",
        category: CATALOG_CATEGORIES.HARDWARE_COMPANIES,
        partnerType: PARTNER_TYPES.AFFILIATE,
        programStatus: PROGRAM_STATUSES.RESEARCHING,
        allowedDomains: ["apple.com", "www.apple.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. No application filed.",
    }),
    catalogEntry({
        id: "framework",
        companyName: "Framework",
        officialWebsite: "https://frame.work/",
        category: CATALOG_CATEGORIES.HARDWARE_COMPANIES,
        partnerType: PARTNER_TYPES.AFFILIATE,
        programStatus: PROGRAM_STATUSES.RESEARCHING,
        allowedDomains: ["frame.work", "www.frame.work"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. No application filed.",
    }),
    catalogEntry({
        id: "raspberry-pi",
        companyName: "Raspberry Pi",
        officialWebsite: "https://www.raspberrypi.com/",
        category: CATALOG_CATEGORIES.HARDWARE_COMPANIES,
        partnerType: PARTNER_TYPES.AFFILIATE,
        programStatus: PROGRAM_STATUSES.RESEARCHING,
        allowedDomains: ["raspberrypi.com", "www.raspberrypi.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. No application filed.",
    }),
    catalogEntry({
        id: "logitech",
        companyName: "Logitech",
        officialWebsite: "https://www.logitech.com/",
        category: CATALOG_CATEGORIES.HARDWARE_COMPANIES,
        partnerType: PARTNER_TYPES.AFFILIATE,
        programStatus: PROGRAM_STATUSES.RESEARCHING,
        allowedDomains: ["logitech.com", "www.logitech.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. No application filed.",
    }),
]);

const byId = new Map(PARTNER_CATALOG.map((entry) => [entry.id, entry]));

export function listPartnerCatalog() {
    return PARTNER_CATALOG.slice();
}

export function getPartnerCatalogEntry(id) {
    if (id == null) return null;
    return byId.get(String(id)) || null;
}

export function listPartnerCatalogByCategory(category) {
    return PARTNER_CATALOG.filter((entry) => entry.category === category);
}

export function listPartnerCatalogByApplicationStatus(status) {
    return PARTNER_CATALOG.filter((entry) => entry.applicationStatus === status);
}

/**
 * Validate a single catalog record (structure only; no network I/O).
 * @param {PartnerCatalogRecord} entry
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validatePartnerCatalogEntry(entry) {
    const errors = [];
    if (!entry || typeof entry !== "object") {
        return { ok: false, errors: ["Catalog entry is missing"] };
    }
    if (!entry.id || typeof entry.id !== "string") errors.push("id is required");
    if (!entry.companyName || typeof entry.companyName !== "string") {
        errors.push("companyName is required");
    }
    if (!isCatalogCategory(entry.category)) errors.push("category is invalid");
    if (!isPartnerType(entry.partnerType)) errors.push("partnerType is invalid");
    if (!isProgramStatus(entry.programStatus)) errors.push("programStatus is invalid");
    if (!isApplicationStatus(entry.applicationStatus)) {
        errors.push("applicationStatus is invalid");
    }
    if (!isApprovalStatus(entry.approvalStatus)) errors.push("approvalStatus is invalid");
    if (!isActivationStatus(entry.activationStatus)) {
        errors.push("activationStatus is invalid");
    }
    if (!Array.isArray(entry.allowedDomains) || entry.allowedDomains.length === 0) {
        errors.push("allowedDomains must be a non-empty array");
    }
    if (typeof entry.ftcDisclosureRequired !== "boolean") {
        errors.push("ftcDisclosureRequired must be boolean");
    }
    if (typeof entry.notes !== "string") errors.push("notes must be a string");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(entry.lastReviewed || ""))) {
        errors.push("lastReviewed must be YYYY-MM-DD");
    }
    if (entry.affiliateId != null) errors.push("affiliateId must be null (no IDs in catalog)");
    if (entry.referralId != null) errors.push("referralId must be null (no IDs in catalog)");

    const website = validateHttpsUrl(entry.officialWebsite);
    if (!website.ok) {
        errors.push(`officialWebsite invalid: ${website.errors.join("; ")}`);
    } else if (website.url) {
        const host = website.url.hostname.toLowerCase();
        const allowed = (entry.allowedDomains || []).map((d) => String(d).toLowerCase());
        const hostOk = allowed.some(
            (domain) => host === domain || host.endsWith(`.${domain}`),
        );
        if (!hostOk) {
            errors.push("officialWebsite host must match allowedDomains");
        }
    }

    // Phase 11.4B safety: catalog must not silently activate anyone.
    if (entry.activationStatus === ACTIVATION_STATUSES.ACTIVE) {
        errors.push("activationStatus must not be active in Phase 11.4B catalog");
    }
    if (entry.applicationStatus !== APPLICATION_STATUSES.NOT_APPLIED) {
        errors.push("applicationStatus must remain not_applied until a real application");
    }
    if (entry.approvalStatus === APPROVAL_STATUSES.APPROVED) {
        errors.push("approvalStatus must not be approved without a verified program");
    }

    return { ok: errors.length === 0, errors };
}

/**
 * @param {ReadonlyArray<PartnerCatalogRecord>} [entries]
 * @returns {{ ok: boolean, errors: string[], byId: Record<string, string[]> }}
 */
export function validatePartnerCatalog(entries = PARTNER_CATALOG) {
    const byIdErrors = {};
    const errors = [];
    const seen = new Set();

    for (const entry of entries) {
        if (seen.has(entry.id)) {
            errors.push(`Duplicate catalog id: ${entry.id}`);
        }
        seen.add(entry.id);
        const result = validatePartnerCatalogEntry(entry);
        if (!result.ok) {
            byIdErrors[entry.id] = result.errors;
            errors.push(...result.errors.map((e) => `${entry.id}: ${e}`));
        }
    }

    return { ok: errors.length === 0, errors, byId: byIdErrors };
}
