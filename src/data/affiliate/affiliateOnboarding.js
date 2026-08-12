/**
 * Phase M2 — operational affiliate onboarding tracker.
 * Built from prospect catalog. Does NOT invent IDs or mark APPROVED without evidence.
 */

import { listPartnerCatalog } from "./partnerCatalog.js";
import { toPartnerLifecycleStatus, PARTNER_LIFECYCLE_STATUSES } from "./partnerLifecycle.js";
import { APPLICATION_STATUSES, ACTIVATION_STATUSES } from "./catalogStatuses.js";

/**
 * @typedef {object} AffiliateOnboardingRow
 */

export function buildAffiliateOnboardingTracker() {
    const catalog = listPartnerCatalog();
    return catalog.map((entry) => {
        const lifecycle = toPartnerLifecycleStatus({
            applicationStatus: entry.applicationStatus,
            approvalStatus: entry.approvalStatus,
            activationStatus: entry.activationStatus,
        });
        return Object.freeze({
            company: entry.companyName,
            catalogId: entry.id,
            category: entry.category,
            officialProgramUrl: entry.officialProgramUrl || null,
            officialWebsite: entry.officialWebsite || null,
            enrollmentProgramType: entry.enrollmentProgramType,
            applicationRequirements: entry.eligibility || null,
            networkIfKnown: entry.network || null,
            applicationDate: entry.applicationDate || null,
            approvalDate: entry.approvalDate || null,
            // Never invent — only surface if already present on catalog evidence.
            affiliateId: entry.affiliateId || entry.trackingId || null,
            trackingTemplate: entry.trackingTemplate || null,
            disclosureRequirement: Boolean(entry.ftcDisclosureRequired),
            notes: entry.notes || entry.programNotes || "",
            lifecycleStatus: lifecycle,
            applicationStatus: entry.applicationStatus,
            activationStatus: entry.activationStatus,
            applicationReady: Boolean(entry.applicationReady),
            inventedIdsForbidden: true,
        });
    });
}

export function summarizeAffiliateOnboarding(rows = buildAffiliateOnboardingTracker()) {
    const counts = {
        total: rows.length,
        NOT_APPLIED: 0,
        APPLIED: 0,
        PENDING: 0,
        APPROVED: 0,
        REJECTED: 0,
        ACTIVE: 0,
        PAUSED: 0,
        withAffiliateId: 0,
    };
    for (const row of rows) {
        counts[row.lifecycleStatus] = (counts[row.lifecycleStatus] || 0) + 1;
        if (row.affiliateId) counts.withAffiliateId += 1;
    }
    return counts;
}

/**
 * Hard safety: placeholder / invented affiliate IDs must never render publicly.
 */
export function assertAffiliateIdSafeForPublic(affiliateId) {
    if (affiliateId == null || affiliateId === "") {
        return { ok: true, publicSafe: true };
    }
    const raw = String(affiliateId);
    const banned = [
        /placeholder/i,
        /fake/i,
        /todo/i,
        /example/i,
        /your[_-]?id/i,
        /xxx+/i,
        /insert/i,
        /tbd/i,
    ];
    if (banned.some((re) => re.test(raw))) {
        return { ok: false, publicSafe: false, error: "PLACEHOLDER_AFFILIATE_ID" };
    }
    return { ok: true, publicSafe: true };
}

/**
 * Monetized URL may render only when global flag + partner ACTIVE + safe ID.
 */
export function mayRenderMonetizedAffiliateUrl({
    globalAffiliatesEnabled = false,
    lifecycleStatus = PARTNER_LIFECYCLE_STATUSES.NOT_APPLIED,
    activationStatus = ACTIVATION_STATUSES.DISABLED,
    affiliateId = null,
} = {}) {
    if (!globalAffiliatesEnabled) return { ok: false, reason: "GLOBAL_OFF" };
    if (lifecycleStatus !== PARTNER_LIFECYCLE_STATUSES.ACTIVE) return { ok: false, reason: "NOT_ACTIVE" };
    if (activationStatus !== ACTIVATION_STATUSES.ACTIVE) return { ok: false, reason: "ACTIVATION_DISABLED" };
    const idCheck = assertAffiliateIdSafeForPublic(affiliateId);
    if (!idCheck.ok) return { ok: false, reason: idCheck.error };
    if (!affiliateId) return { ok: false, reason: "MISSING_VERIFIED_ID" };
    return { ok: true, reason: null };
}

export function assertNoApprovedWithoutEvidence(rows = buildAffiliateOnboardingTracker()) {
    const violations = rows.filter(
        (r) =>
            (r.lifecycleStatus === PARTNER_LIFECYCLE_STATUSES.APPROVED
                || r.lifecycleStatus === PARTNER_LIFECYCLE_STATUSES.ACTIVE)
            && r.applicationStatus === APPLICATION_STATUSES.NOT_STARTED,
    );
    return { ok: violations.length === 0, violations };
}
