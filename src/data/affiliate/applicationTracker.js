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
import {
    getDirectRevenuePotentialLabel,
    getEnrollmentProgramTypeLabel,
} from "./enrollmentProgramTypes.js";
import { listPartnerCatalog } from "./partnerCatalog.js";

export function toApplicationTrackerRow(entry) {
    return {
        catalogId: entry.id,
        companyName: entry.companyName,
        category: entry.category,
        categoryLabel: getCatalogCategoryLabel(entry.category),
        partnerType: entry.partnerType,
        enrollmentProgramType: entry.enrollmentProgramType,
        enrollmentProgramTypeLabel: getEnrollmentProgramTypeLabel(entry.enrollmentProgramType),
        programTypes: entry.programTypes,
        directRevenuePotential: entry.directRevenuePotential,
        directRevenuePotentialLabel: getDirectRevenuePotentialLabel(entry.directRevenuePotential),
        applicationReady: entry.applicationReady,
        revenueReady: entry.revenueReady,
        classificationBucket: entry.classificationBucket,
        programStatus: entry.programStatus,
        applicationStatus: entry.applicationStatus,
        approvalStatus: entry.approvalStatus,
        activationStatus: entry.activationStatus,
        officialWebsite: entry.officialWebsite,
        officialProgramUrl: entry.officialProgramUrl,
        sourceTitle: entry.sourceTitle,
        verificationSource: entry.verificationSource,
        ftcDisclosureRequired: entry.ftcDisclosureRequired,
        lastReviewed: entry.lastReviewed,
        lastVerifiedDate: entry.lastVerifiedDate,
        applicationDate: entry.applicationDate,
        approvalDate: entry.approvalDate,
        renewalDate: entry.renewalDate,
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
        applicationReady: rows.filter((r) => r.applicationReady).length,
        revenueReady: rows.filter((r) => r.revenueReady).length,
        active: listActivePartners().length,
        disabled: rows.filter(
            (r) => r.activationStatus === ACTIVATION_STATUSES.DISABLED,
        ).length,
    });
}
