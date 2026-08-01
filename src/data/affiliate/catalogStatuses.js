/**
 * Phase 11.4B/D — Partner Catalog / Application Tracker status enums.
 * Defaults for every company: not_started, not_approved, disabled.
 */

export const PROGRAM_STATUSES = Object.freeze({
    UNKNOWN: "unknown",
    RESEARCHING: "researching",
    OPEN: "open",
    INVITE_ONLY: "invite_only",
    CLOSED: "closed",
    NOT_AVAILABLE: "not_available",
});

/**
 * Phase 11.4D application tracker statuses.
 * Replaces the 11.4B not_applied / in_review / accepted / withdrawn set.
 */
export const APPLICATION_STATUSES = Object.freeze({
    NOT_STARTED: "not_started",
    PREPARING: "preparing",
    APPLIED: "applied",
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
    PAUSED: "paused",
    INACTIVE: "inactive",
    ARCHIVED: "archived",
});

export const APPROVAL_STATUSES = Object.freeze({
    NOT_APPROVED: "not_approved",
    PENDING: "pending",
    APPROVED: "approved",
    DENIED: "denied",
});

export const ACTIVATION_STATUSES = Object.freeze({
    DISABLED: "disabled",
    READY: "ready",
    ACTIVE: "active",
});

export const PROGRAM_STATUS_LIST = Object.freeze(Object.values(PROGRAM_STATUSES));
export const APPLICATION_STATUS_LIST = Object.freeze(Object.values(APPLICATION_STATUSES));
export const APPROVAL_STATUS_LIST = Object.freeze(Object.values(APPROVAL_STATUSES));
export const ACTIVATION_STATUS_LIST = Object.freeze(Object.values(ACTIVATION_STATUSES));

/** Safe defaults — every catalog company starts here until intentionally changed. */
export const CATALOG_DEFAULT_STATUSES = Object.freeze({
    programStatus: PROGRAM_STATUSES.RESEARCHING,
    applicationStatus: APPLICATION_STATUSES.NOT_STARTED,
    approvalStatus: APPROVAL_STATUSES.NOT_APPROVED,
    activationStatus: ACTIVATION_STATUSES.DISABLED,
});

export function isProgramStatus(value) {
    return PROGRAM_STATUS_LIST.includes(value);
}

export function isApplicationStatus(value) {
    return APPLICATION_STATUS_LIST.includes(value);
}

export function isApprovalStatus(value) {
    return APPROVAL_STATUS_LIST.includes(value);
}

export function isActivationStatus(value) {
    return ACTIVATION_STATUS_LIST.includes(value);
}
