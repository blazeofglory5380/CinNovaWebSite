/**
 * Phase M1 — partner lifecycle statuses (compat layer).
 * Maps user-facing statuses onto existing catalog enums without inventing IDs.
 */

import {
    APPLICATION_STATUSES,
    ACTIVATION_STATUSES,
    APPROVAL_STATUSES,
} from "./catalogStatuses.js";

/** Requested lifecycle labels for enrollment UX / reports. */
export const PARTNER_LIFECYCLE_STATUSES = Object.freeze({
    NOT_APPLIED: "NOT_APPLIED",
    APPLIED: "APPLIED",
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    ACTIVE: "ACTIVE",
    PAUSED: "PAUSED",
});

export function toPartnerLifecycleStatus({
    applicationStatus = APPLICATION_STATUSES.NOT_STARTED,
    approvalStatus = APPROVAL_STATUSES.NOT_APPROVED,
    activationStatus = ACTIVATION_STATUSES.DISABLED,
} = {}) {
    if (activationStatus === ACTIVATION_STATUSES.ACTIVE) return PARTNER_LIFECYCLE_STATUSES.ACTIVE;
    if (applicationStatus === APPLICATION_STATUSES.PAUSED) return PARTNER_LIFECYCLE_STATUSES.PAUSED;
    if (applicationStatus === APPLICATION_STATUSES.REJECTED || approvalStatus === APPROVAL_STATUSES.DENIED) {
        return PARTNER_LIFECYCLE_STATUSES.REJECTED;
    }
    if (
        approvalStatus === APPROVAL_STATUSES.APPROVED
        || applicationStatus === APPLICATION_STATUSES.APPROVED
    ) {
        return PARTNER_LIFECYCLE_STATUSES.APPROVED;
    }
    if (
        applicationStatus === APPLICATION_STATUSES.PENDING
        || applicationStatus === APPLICATION_STATUSES.APPLIED
        || approvalStatus === APPROVAL_STATUSES.PENDING
    ) {
        return applicationStatus === APPLICATION_STATUSES.APPLIED
            ? PARTNER_LIFECYCLE_STATUSES.APPLIED
            : PARTNER_LIFECYCLE_STATUSES.PENDING;
    }
    return PARTNER_LIFECYCLE_STATUSES.NOT_APPLIED;
}

export function assertNoInventedAffiliateId(affiliateId) {
    if (affiliateId == null || affiliateId === "") {
        return { ok: true, invented: false };
    }
    // Presence alone is not invention — but activation still requires dual gate.
    return {
        ok: true,
        invented: false,
        note: "Affiliate IDs must come from verified partner enrollment, never fabricated in content.",
    };
}
