/**
 * Phase 11.4B — Partner Application Tracker.
 * Derived views over the Partner Catalog. Does not mutate catalog records.
 */

import {
    APPLICATION_STATUSES,
    APPROVAL_STATUSES,
    ACTIVATION_STATUSES,
} from "./catalogStatuses.js";
import { getCatalogCategoryLabel } from "./catalogCategories.js";
import { listPartnerCatalog } from "./partnerCatalog.js";

/**
 * @typedef {object} ApplicationTrackerRow
 * @property {string} catalogId
 * @property {string} companyName
 * @property {string} category
 * @property {string} categoryLabel
 * @property {string} partnerType
 * @property {string} programStatus
 * @property {string} applicationStatus
 * @property {string} approvalStatus
 * @property {string} activationStatus
 * @property {string} officialWebsite
 * @property {boolean} ftcDisclosureRequired
 * @property {string} lastReviewed
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
        programStatus: entry.programStatus,
        applicationStatus: entry.applicationStatus,
        approvalStatus: entry.approvalStatus,
        activationStatus: entry.activationStatus,
        officialWebsite: entry.officialWebsite,
        ftcDisclosureRequired: entry.ftcDisclosureRequired,
        lastReviewed: entry.lastReviewed,
        notes: entry.notes,
    };
}

export function listApplicationTrackerRows() {
    return listPartnerCatalog().map(toApplicationTrackerRow);
}

export function listPendingApplications() {
    return listApplicationTrackerRows().filter((row) =>
        [APPLICATION_STATUSES.APPLIED, APPLICATION_STATUSES.IN_REVIEW].includes(
            row.applicationStatus,
        ),
    );
}

export function listApprovedApplications() {
    return listApplicationTrackerRows().filter(
        (row) => row.approvalStatus === APPROVAL_STATUSES.APPROVED,
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
        notApplied: rows.filter(
            (r) => r.applicationStatus === APPLICATION_STATUSES.NOT_APPLIED,
        ).length,
        applied: rows.filter((r) => r.applicationStatus === APPLICATION_STATUSES.APPLIED)
            .length,
        inReview: rows.filter(
            (r) => r.applicationStatus === APPLICATION_STATUSES.IN_REVIEW,
        ).length,
        accepted: rows.filter(
            (r) => r.applicationStatus === APPLICATION_STATUSES.ACCEPTED,
        ).length,
        rejected: rows.filter(
            (r) => r.applicationStatus === APPLICATION_STATUSES.REJECTED,
        ).length,
        approved: listApprovedApplications().length,
        active: listActivePartners().length,
        disabled: rows.filter(
            (r) => r.activationStatus === ACTIVATION_STATUSES.DISABLED,
        ).length,
    });
}
