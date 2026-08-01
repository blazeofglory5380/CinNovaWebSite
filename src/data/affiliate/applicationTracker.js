/**
 * Phase 11.4B/D — Partner Application Tracker.
 * Derived views over the Partner Catalog. Does not mutate catalog records.
 */

import {
    APPLICATION_STATUSES,
    APPROVAL_STATUSES,
    ACTIVATION_STATUSES,
} from "./catalogStatuses.js";
import { getCatalogCategoryLabel } from "./catalogCategories.js";
import { getEnrollmentProgramTypeLabel } from "./enrollmentProgramTypes.js";
import { listPartnerCatalog } from "./partnerCatalog.js";

/**
 * @typedef {object} ApplicationTrackerRow
 * @property {string} catalogId
 * @property {string} companyName
 * @property {string} category
 * @property {string} categoryLabel
 * @property {string} partnerType
 * @property {string} enrollmentProgramType
 * @property {string} enrollmentProgramTypeLabel
 * @property {string} programStatus
 * @property {string} applicationStatus
 * @property {string} approvalStatus
 * @property {string} activationStatus
 * @property {string} officialWebsite
 * @property {string|null} officialProgramUrl
 * @property {boolean} ftcDisclosureRequired
 * @property {string} lastReviewed
 * @property {string} lastVerifiedDate
 * @property {string} verificationBucket
 * @property {string|null} applicationDate
 * @property {string|null} approvalDate
 * @property {string|null} renewalDate
 * @property {string} reviewNotes
 * @property {string} internalNotes
 * @property {string|null} programDocumentationUrl
 * @property {string} notes
 */

/**
 * @param {import('./partnerCatalog.js').PartnerCatalogRecord} entry
 * @returns {ApplicationTrackerRow}
 */
export function toApplicationTrackerRow(entry) {
    return {
        catalogId: entry.id,
        companyName: entry.companyName,
        category: entry.category,
        categoryLabel: getCatalogCategoryLabel(entry.category),
        partnerType: entry.partnerType,
        enrollmentProgramType: entry.enrollmentProgramType,
        enrollmentProgramTypeLabel: getEnrollmentProgramTypeLabel(entry.enrollmentProgramType),
        programStatus: entry.programStatus,
        applicationStatus: entry.applicationStatus,
        approvalStatus: entry.approvalStatus,
        activationStatus: entry.activationStatus,
        officialWebsite: entry.officialWebsite,
        officialProgramUrl: entry.officialProgramUrl,
        ftcDisclosureRequired: entry.ftcDisclosureRequired,
        lastReviewed: entry.lastReviewed,
        lastVerifiedDate: entry.lastVerifiedDate,
        verificationBucket: entry.verificationBucket,
        applicationDate: entry.applicationDate,
        approvalDate: entry.approvalDate,
        renewalDate: entry.renewalDate,
        reviewNotes: entry.reviewNotes,
        internalNotes: entry.internalNotes,
        programDocumentationUrl: entry.programDocumentationUrl,
        notes: entry.notes,
    };
}

export function listApplicationTrackerRows() {
    return listPartnerCatalog().map(toApplicationTrackerRow);
}

export function listPendingApplications() {
    return listApplicationTrackerRows().filter((row) =>
        [
            APPLICATION_STATUSES.APPLIED,
            APPLICATION_STATUSES.PENDING,
            APPLICATION_STATUSES.PREPARING,
        ].includes(row.applicationStatus),
    );
}

export function listApprovedApplications() {
    return listApplicationTrackerRows().filter(
        (row) =>
            row.applicationStatus === APPLICATION_STATUSES.APPROVED ||
            row.approvalStatus === APPROVAL_STATUSES.APPROVED,
    );
}

export function listActivePartners() {
    return listApplicationTrackerRows().filter(
        (row) => row.activationStatus === ACTIVATION_STATUSES.ACTIVE,
    );
}

/**
 * Application pipeline summary derived from catalog statuses.
 * Distinct from Revenue Opportunities placeholder KPIs (which stay at 0
 * until real click/revenue telemetry exists).
 */
export function getApplicationTrackerSummary() {
    const rows = listApplicationTrackerRows();
    return Object.freeze({
        catalogCount: rows.length,
        notStarted: rows.filter(
            (r) => r.applicationStatus === APPLICATION_STATUSES.NOT_STARTED,
        ).length,
        preparing: rows.filter((r) => r.applicationStatus === APPLICATION_STATUSES.PREPARING)
            .length,
        applied: rows.filter((r) => r.applicationStatus === APPLICATION_STATUSES.APPLIED)
            .length,
        pending: rows.filter((r) => r.applicationStatus === APPLICATION_STATUSES.PENDING)
            .length,
        approved: listApprovedApplications().length,
        rejected: rows.filter((r) => r.applicationStatus === APPLICATION_STATUSES.REJECTED)
            .length,
        paused: rows.filter((r) => r.applicationStatus === APPLICATION_STATUSES.PAUSED)
            .length,
        inactive: rows.filter((r) => r.applicationStatus === APPLICATION_STATUSES.INACTIVE)
            .length,
        archived: rows.filter((r) => r.applicationStatus === APPLICATION_STATUSES.ARCHIVED)
            .length,
        active: listActivePartners().length,
        disabled: rows.filter(
            (r) => r.activationStatus === ACTIVATION_STATUSES.DISABLED,
        ).length,
    });
}
