/**
 * Phase M3 — affiliate application workflow.
 * APPROVED requires evidence. ACTIVE requires dual gate + verified ID + template + disclosure.
 */

import { APPLICATION_STATUSES, ACTIVATION_STATUSES, APPROVAL_STATUSES } from "./catalogStatuses.js";
import { assertAffiliateIdSafeForPublic } from "./affiliateOnboarding.js";
import { isAffiliateProgramGloballyEnabled } from "./affiliateConfig.js";

export const APPLICATION_WORKFLOW_STATES = Object.freeze({
    NOT_APPLIED: "NOT_APPLIED",
    READY_TO_APPLY: "READY_TO_APPLY",
    APPLIED: "APPLIED",
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    ACTIVE: "ACTIVE",
    PAUSED: "PAUSED",
});

export function deriveWorkflowState({
    applicationStatus = APPLICATION_STATUSES.NOT_STARTED,
    approvalStatus = APPROVAL_STATUSES.NOT_APPROVED,
    activationStatus = ACTIVATION_STATUSES.DISABLED,
    applicationReady = false,
    officialProgramUrl = null,
} = {}) {
    if (activationStatus === ACTIVATION_STATUSES.ACTIVE) return APPLICATION_WORKFLOW_STATES.ACTIVE;
    if (applicationStatus === APPLICATION_STATUSES.PAUSED) return APPLICATION_WORKFLOW_STATES.PAUSED;
    if (applicationStatus === APPLICATION_STATUSES.REJECTED || approvalStatus === APPROVAL_STATUSES.DENIED) {
        return APPLICATION_WORKFLOW_STATES.REJECTED;
    }
    if (approvalStatus === APPROVAL_STATUSES.APPROVED || applicationStatus === APPLICATION_STATUSES.APPROVED) {
        return APPLICATION_WORKFLOW_STATES.APPROVED;
    }
    if (applicationStatus === APPLICATION_STATUSES.PENDING) return APPLICATION_WORKFLOW_STATES.PENDING;
    if (applicationStatus === APPLICATION_STATUSES.APPLIED) return APPLICATION_WORKFLOW_STATES.APPLIED;
    if (applicationReady && officialProgramUrl) return APPLICATION_WORKFLOW_STATES.READY_TO_APPLY;
    return APPLICATION_WORKFLOW_STATES.NOT_APPLIED;
}

export function assertApprovedRequiresEvidence({
    nextState,
    evidence = null,
} = {}) {
    if (nextState !== APPLICATION_WORKFLOW_STATES.APPROVED) return { ok: true, error: null };
    if (!evidence || !evidence.approvalDate || !evidence.sourceUrl) {
        return { ok: false, error: "EVIDENCE_REQUIRED_FOR_APPROVED" };
    }
    return { ok: true, error: null };
}

export function assertCanActivateAffiliate({
    workflowState,
    affiliateId = null,
    trackingTemplate = null,
    disclosureReady = false,
    globalEnabled = isAffiliateProgramGloballyEnabled(),
} = {}) {
    if (workflowState !== APPLICATION_WORKFLOW_STATES.APPROVED
        && workflowState !== APPLICATION_WORKFLOW_STATES.ACTIVE) {
        return { ok: false, error: "NOT_APPROVED" };
    }
    const idCheck = assertAffiliateIdSafeForPublic(affiliateId);
    if (!idCheck.ok || !affiliateId) return { ok: false, error: "VERIFIED_ID_REQUIRED" };
    if (!trackingTemplate) return { ok: false, error: "TRACKING_TEMPLATE_REQUIRED" };
    if (!disclosureReady) return { ok: false, error: "DISCLOSURE_REQUIRED" };
    if (!globalEnabled) return { ok: false, error: "GLOBAL_GATE_OFF" };
    return { ok: true, error: null };
}
