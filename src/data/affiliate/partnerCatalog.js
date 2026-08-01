/**
 * Phase 11.4B/D — Partner Catalog + enrollment classification.
 *
 * Catalog entries are research / prospect records only.
 * Listing a company does NOT claim partnership, approval, or commercial activation.
 * No affiliate/referral IDs or tracked commercial destinations.
 */

import { isPartnerType } from "./partnerTypes.js";
import { isCatalogCategory } from "./catalogCategories.js";
import {
    ACTIVATION_STATUSES,
    APPLICATION_STATUSES,
    APPROVAL_STATUSES,
    CATALOG_DEFAULT_STATUSES,
    isActivationStatus,
    isApplicationStatus,
    isApprovalStatus,
    isProgramStatus,
} from "./catalogStatuses.js";
import {
    DIRECT_REVENUE_POTENTIAL,
    ENROLLMENT_PROGRAM_TYPES,
    REVIEW_TIME_TOKENS,
    UNKNOWN_VERIFICATION_NOTE,
    classificationBucketForEntry,
    computeRevenueReady,
    isDirectRevenuePotential,
    isEnrollmentProgramType,
    isPublicOrPrivate,
} from "./enrollmentProgramTypes.js";
import { DEFAULT_COMPLIANCE } from "./complianceDefaults.js";
import { ENROLLMENT_CATALOG_SEED } from "./enrollmentCatalogData.js";
import { validateHttpsUrl } from "./linkValidation.js";

const REVIEWED = "2026-07-31";
const VERIFIED = "2026-07-31";

/**
 * @param {object} partial
 */
function catalogEntry(partial) {
    const enrollmentProgramType =
        partial.enrollmentProgramType ?? ENROLLMENT_PROGRAM_TYPES.UNKNOWN;
    const programTypes = Object.freeze(
        [...(partial.programTypes?.length ? partial.programTypes : [enrollmentProgramType])],
    );
    const directRevenuePotential =
        partial.directRevenuePotential ?? DIRECT_REVENUE_POTENTIAL.UNKNOWN;
    const applicationReady = Boolean(partial.applicationReady);
    const revenueReady = computeRevenueReady({
        applicationReady,
        directRevenuePotential,
    });
    const classificationBucket = classificationBucketForEntry({
        enrollmentProgramType,
        programTypes,
        directRevenuePotential,
        programStatus: partial.programStatus,
    });
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

        enrollmentProgramType,
        programTypes,
        directRevenuePotential,
        applicationReady,
        revenueReady,
        classificationBucket,
        officialProgramUrl: partial.officialProgramUrl ?? null,
        eligibility: partial.eligibility ?? UNKNOWN_VERIFICATION_NOTE,
        countryRestrictions: partial.countryRestrictions ?? REVIEW_TIME_TOKENS.UNKNOWN,
        applicationRequired:
            partial.applicationRequired === undefined ? null : partial.applicationRequired,
        approvalRequired:
            partial.approvalRequired === undefined ? null : partial.approvalRequired,
        estimatedReviewTime: partial.estimatedReviewTime ?? REVIEW_TIME_TOKENS.UNKNOWN,
        publicOrPrivateProgram: partial.publicOrPrivateProgram ?? "unknown",
        programNotes: partial.programNotes || "",
        lastVerifiedDate: partial.lastVerifiedDate || VERIFIED,
        verificationSource: partial.verificationSource || "",
        sourceTitle: partial.sourceTitle || "",
        evidenceSummary: partial.evidenceSummary || "",

        applicationDate: null,
        approvalDate: null,
        renewalDate: null,
        reviewNotes: "",
        internalNotes: "",
        programDocumentationUrl: partial.programDocumentationUrl ?? null,

        programSpecificDisclosureRules:
            partial.programSpecificDisclosureRules ||
            DEFAULT_COMPLIANCE.programSpecificDisclosureRules,
        trademarkUsageRestrictions:
            partial.trademarkUsageRestrictions ||
            DEFAULT_COMPLIANCE.trademarkUsageRestrictions,
        brandGuidelinesAvailable:
            partial.brandGuidelinesAvailable ?? DEFAULT_COMPLIANCE.brandGuidelinesAvailable,
        logoUsagePermissions:
            partial.logoUsagePermissions || DEFAULT_COMPLIANCE.logoUsagePermissions,
    });
}

/** @type {ReadonlyArray<object>} */
export const PARTNER_CATALOG = Object.freeze(
    ENROLLMENT_CATALOG_SEED.map((seed) => catalogEntry(seed)),
);

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

export function listPartnerCatalogByClassificationBucket(bucket) {
    return PARTNER_CATALOG.filter((entry) => entry.classificationBucket === bucket);
}

export function listApplicationReadyPartners() {
    return PARTNER_CATALOG.filter((entry) => entry.applicationReady === true);
}

export function listRevenueReadyPartners() {
    return PARTNER_CATALOG.filter((entry) => entry.revenueReady === true);
}

export function listCreatorAffiliatePrograms() {
    return PARTNER_CATALOG.filter(
        (entry) =>
            entry.enrollmentProgramType === ENROLLMENT_PROGRAM_TYPES.CREATOR_AFFILIATE ||
            entry.programTypes.includes(ENROLLMENT_PROGRAM_TYPES.CREATOR_AFFILIATE),
    );
}

/**
 * @param {object} entry
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
    if (!isEnrollmentProgramType(entry.enrollmentProgramType)) {
        errors.push("enrollmentProgramType is invalid");
    }
    if (!Array.isArray(entry.programTypes) || entry.programTypes.length === 0) {
        errors.push("programTypes must be a non-empty array");
    } else if (!entry.programTypes.every(isEnrollmentProgramType)) {
        errors.push("programTypes contains invalid values");
    }
    if (!isDirectRevenuePotential(entry.directRevenuePotential)) {
        errors.push("directRevenuePotential is invalid");
    }
    if (typeof entry.applicationReady !== "boolean") {
        errors.push("applicationReady must be boolean");
    }
    if (typeof entry.revenueReady !== "boolean") {
        errors.push("revenueReady must be boolean");
    }
    if (
        entry.revenueReady &&
        entry.directRevenuePotential !== DIRECT_REVENUE_POTENTIAL.VERIFIED_COMMISSION
    ) {
        errors.push("revenueReady requires verified_commission");
    }
    if (entry.revenueReady && !entry.applicationReady) {
        errors.push("revenueReady requires applicationReady");
    }
    if (!isPublicOrPrivate(entry.publicOrPrivateProgram)) {
        errors.push("publicOrPrivateProgram is invalid");
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(entry.lastVerifiedDate || ""))) {
        errors.push("lastVerifiedDate must be YYYY-MM-DD");
    }
    if (!entry.verificationSource) errors.push("verificationSource is required");
    if (!entry.sourceTitle) errors.push("sourceTitle is required");
    if (!entry.evidenceSummary) errors.push("evidenceSummary is required");
    if (typeof entry.eligibility !== "string") errors.push("eligibility must be a string");
    if (typeof entry.countryRestrictions !== "string") {
        errors.push("countryRestrictions must be a string");
    }
    if (typeof entry.estimatedReviewTime !== "string") {
        errors.push("estimatedReviewTime must be a string");
    }
    if (
        entry.applicationRequired !== null &&
        typeof entry.applicationRequired !== "boolean"
    ) {
        errors.push("applicationRequired must be boolean or null");
    }
    if (entry.approvalRequired !== null && typeof entry.approvalRequired !== "boolean") {
        errors.push("approvalRequired must be boolean or null");
    }
    if (entry.applicationDate != null) {
        errors.push("applicationDate must remain null until a real application is filed");
    }
    if (entry.approvalDate != null) {
        errors.push("approvalDate must remain null until a real approval is recorded");
    }
    if (entry.affiliateId != null) errors.push("affiliateId must be null");
    if (entry.referralId != null) errors.push("referralId must be null");
    if (entry.internalNotes) {
        errors.push("internalNotes must remain empty in public catalog seed (no sensitive admin data)");
    }

    if (entry.officialProgramUrl) {
        const programUrl = validateHttpsUrl(entry.officialProgramUrl);
        if (!programUrl.ok) {
            errors.push(`officialProgramUrl invalid: ${programUrl.errors.join("; ")}`);
        }
    } else if (
        ![
            ENROLLMENT_PROGRAM_TYPES.NO_PUBLIC_PROGRAM,
            ENROLLMENT_PROGRAM_TYPES.UNKNOWN,
        ].includes(entry.enrollmentProgramType)
    ) {
        errors.push("officialProgramUrl required when a program type is classified");
    }

    if (entry.programDocumentationUrl) {
        const docsUrl = validateHttpsUrl(entry.programDocumentationUrl);
        if (!docsUrl.ok) {
            errors.push(`programDocumentationUrl invalid: ${docsUrl.errors.join("; ")}`);
        }
    }

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

    if (entry.activationStatus === ACTIVATION_STATUSES.ACTIVE) {
        errors.push("activationStatus must not be active in Phase 11.4D catalog");
    }
    if (entry.applicationStatus !== APPLICATION_STATUSES.NOT_STARTED) {
        errors.push("applicationStatus must remain not_started until evidence of filing");
    }
    if (
        [APPLICATION_STATUSES.APPLIED, APPLICATION_STATUSES.PENDING, APPLICATION_STATUSES.APPROVED]
            .includes(entry.applicationStatus)
    ) {
        errors.push("Applied/Pending/Approved require submission evidence (not allowed in seed)");
    }
    if (entry.approvalStatus === APPROVAL_STATUSES.APPROVED) {
        errors.push("approvalStatus must not be approved without verified enrollment evidence");
    }

    // Do not invent numeric day SLAs.
    if (/^\d+\s*(day|days|business\s*days)\b/i.test(String(entry.estimatedReviewTime || ""))) {
        errors.push("estimatedReviewTime must not invent numeric vendor SLAs");
    }

    if (
        entry.applicationReady &&
        (entry.programStatus === "invite_only" ||
            entry.enrollmentProgramType === ENROLLMENT_PROGRAM_TYPES.INVITE_ONLY_PARTNER ||
            entry.programStatus === "closed" ||
            entry.enrollmentProgramType === ENROLLMENT_PROGRAM_TYPES.NO_PUBLIC_PROGRAM ||
            entry.enrollmentProgramType === ENROLLMENT_PROGRAM_TYPES.UNKNOWN)
    ) {
        errors.push("applicationReady cannot be true for invite-only/closed/none/unknown programs");
    }

    if (
        entry.directRevenuePotential === DIRECT_REVENUE_POTENTIAL.VERIFIED_COMMISSION &&
        !entry.evidenceSummary
    ) {
        errors.push("verified_commission requires evidenceSummary");
    }

    return { ok: errors.length === 0, errors };
}

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
