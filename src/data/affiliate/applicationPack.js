/**
 * Phase M3 — affiliate application pack (catalog-only, no guesses).
 */

import { listPartnerCatalog } from "./partnerCatalog.js";
import { ENROLLMENT_PROGRAM_TYPES, UNKNOWN_VERIFICATION_NOTE } from "./enrollmentProgramTypes.js";
import { PROGRAM_STATUSES } from "./catalogStatuses.js";

export const AFFILIATE_APPLY_CLASS = Object.freeze({
    APPLY_NOW: "APPLY_NOW",
    WAITLIST: "WAITLIST",
    NO_PUBLIC_PROGRAM: "NO_PUBLIC_PROGRAM",
    PARTNER_ONLY: "PARTNER_ONLY",
    UNKNOWN: "UNKNOWN",
});

const UNKNOWN = "UNKNOWN";

function verifiedOrUnknown(value) {
    if (value == null || value === "" || value === UNKNOWN || value === UNKNOWN_VERIFICATION_NOTE) {
        return UNKNOWN;
    }
    return value;
}

export function classifyApplyAction(entry) {
    const type = entry.enrollmentProgramType;
    if (type === ENROLLMENT_PROGRAM_TYPES.NO_PUBLIC_PROGRAM) {
        return AFFILIATE_APPLY_CLASS.NO_PUBLIC_PROGRAM;
    }
    if (entry.programStatus === PROGRAM_STATUSES.CLOSED) {
        return AFFILIATE_APPLY_CLASS.WAITLIST;
    }
    if (
        type === ENROLLMENT_PROGRAM_TYPES.CONSULTING_IMPLEMENTATION_PARTNER
        || type === ENROLLMENT_PROGRAM_TYPES.TECHNOLOGY_INTEGRATION_PARTNER
        || type === ENROLLMENT_PROGRAM_TYPES.ENTERPRISE_PARTNER
        || type === ENROLLMENT_PROGRAM_TYPES.CLOUD_MARKETPLACE
    ) {
        return AFFILIATE_APPLY_CLASS.PARTNER_ONLY;
    }
    if (type === ENROLLMENT_PROGRAM_TYPES.INVITE_ONLY_PARTNER) {
        return AFFILIATE_APPLY_CLASS.WAITLIST;
    }
    if (
        entry.applicationReady
        && entry.officialProgramUrl
        && type === ENROLLMENT_PROGRAM_TYPES.CREATOR_AFFILIATE
    ) {
        return AFFILIATE_APPLY_CLASS.APPLY_NOW;
    }
    if (entry.officialProgramUrl && type === ENROLLMENT_PROGRAM_TYPES.CREATOR_AFFILIATE) {
        return AFFILIATE_APPLY_CLASS.APPLY_NOW;
    }
    if (entry.officialProgramUrl) return AFFILIATE_APPLY_CLASS.UNKNOWN;
    return AFFILIATE_APPLY_CLASS.NO_PUBLIC_PROGRAM;
}

function inferNetwork(entry) {
    const blob = `${entry.evidenceSummary || ""} ${entry.programNotes || ""} ${entry.eligibility || ""}`;
    if (/Partnerize/i.test(blob)) return "Partnerize";
    if (/PartnerStack/i.test(blob)) return "PartnerStack";
    if (/Rakuten/i.test(blob)) return "Rakuten Marketing";
    if (/Impact/i.test(blob)) return "UNKNOWN";
    return UNKNOWN;
}

function inferCommission(entry) {
    if (entry.directRevenuePotential !== "verified_commission") return UNKNOWN;
    const summary = entry.evidenceSummary || "";
    if (!summary) return UNKNOWN;
    return summary;
}

function inferCookie(entry) {
    const m = String(entry.evidenceSummary || "").match(/(\d+)\s*-?\s*day cookie/i);
    return m ? `${m[1]}-day cookie` : UNKNOWN;
}

function inferPayout(entry) {
    const summary = entry.evidenceSummary || "";
    if (/paid after license active >90 days/i.test(summary)) {
        return "Commissions paid after license active >90 days (verified in catalog evidence)";
    }
    return UNKNOWN;
}

export function buildAffiliateApplicationPack() {
    return listPartnerCatalog().map((entry) =>
        Object.freeze({
            company: entry.companyName,
            catalogId: entry.id,
            officialProgramUrl: entry.officialProgramUrl || null,
            verificationSource: entry.verificationSource || null,
            programNetwork: inferNetwork(entry),
            eligibility: verifiedOrUnknown(entry.eligibility),
            commissionStructure: inferCommission(entry),
            cookieDuration: inferCookie(entry),
            payoutThreshold: inferPayout(entry),
            allowedPromotionMethods: UNKNOWN,
            prohibitedPromotionMethods: /spam|impersonat|branded paid search/i.test(
                `${entry.evidenceSummary || ""} ${entry.programSpecificDisclosureRules || ""}`,
            )
                ? "See official evidence: spam / impersonation / branded paid search restrictions noted"
                : UNKNOWN,
            applicationStatus: entry.applicationStatus,
            applyClassification: classifyApplyAction(entry),
            requiredBusinessSiteData: UNKNOWN,
            disclosureRequired: Boolean(entry.ftcDisclosureRequired),
            disclosureNotes: entry.programSpecificDisclosureRules || UNKNOWN,
            applicationReady: Boolean(entry.applicationReady),
            partnershipImplied: false,
            inventedFieldsForbidden: true,
        }),
    );
}

export function summarizeApplicationPack(pack = buildAffiliateApplicationPack()) {
    const counts = {
        prospects: pack.length,
        APPLY_NOW: 0,
        WAITLIST: 0,
        NO_PUBLIC_PROGRAM: 0,
        PARTNER_ONLY: 0,
        UNKNOWN: 0,
        disclosureRequired: pack.filter((p) => p.disclosureRequired).length,
        verifiedProgramUrl: pack.filter((p) => Boolean(p.officialProgramUrl)).length,
    };
    for (const row of pack) {
        counts[row.applyClassification] = (counts[row.applyClassification] || 0) + 1;
    }
    return counts;
}

export function classifyHighPriorityApplications(pack = buildAffiliateApplicationPack()) {
    const highIds = new Set(["adobe", "notion-catalog", "runway", "elevenlabs", "figma"]);
    return pack.filter((p) => highIds.has(p.catalogId));
}
