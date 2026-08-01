/**
 * Phase 11.4D — Partner verification / classification report.
 */

import { CATALOG_CATEGORY_LIST, getCatalogCategoryLabel } from "./catalogCategories.js";
import {
    CLASSIFICATION_BUCKETS,
    CLASSIFICATION_BUCKET_LABELS,
    DIRECT_REVENUE_POTENTIAL,
    ENROLLMENT_PROGRAM_TYPES,
} from "./enrollmentProgramTypes.js";
import {
    listApplicationReadyPartners,
    listPartnerCatalog,
    listRevenueReadyPartners,
} from "./partnerCatalog.js";
import { APPLICATION_STATUSES, ACTIVATION_STATUSES } from "./catalogStatuses.js";

function emptyBucketCounts() {
    return {
        [CLASSIFICATION_BUCKETS.VERIFIED_COMMISSION]: 0,
        [CLASSIFICATION_BUCKETS.VERIFIED_NON_COMMISSION]: 0,
        [CLASSIFICATION_BUCKETS.INVITE_ONLY]: 0,
        [CLASSIFICATION_BUCKETS.NEEDS_VERIFICATION]: 0,
        [CLASSIFICATION_BUCKETS.NO_PUBLIC_PROGRAM]: 0,
    };
}

export function getPartnerVerificationReport() {
    const entries = listPartnerCatalog();
    const totals = emptyBucketCounts();

    const categories = CATALOG_CATEGORY_LIST.map((category) => {
        const inCategory = entries.filter((e) => e.category === category);
        const buckets = emptyBucketCounts();
        const companies = inCategory.map((entry) => {
            buckets[entry.classificationBucket] =
                (buckets[entry.classificationBucket] || 0) + 1;
            totals[entry.classificationBucket] =
                (totals[entry.classificationBucket] || 0) + 1;
            return Object.freeze({
                id: entry.id,
                companyName: entry.companyName,
                enrollmentProgramType: entry.enrollmentProgramType,
                programTypes: entry.programTypes,
                directRevenuePotential: entry.directRevenuePotential,
                applicationReady: entry.applicationReady,
                revenueReady: entry.revenueReady,
                classificationBucket: entry.classificationBucket,
                classificationBucketLabel:
                    CLASSIFICATION_BUCKET_LABELS[entry.classificationBucket],
                programStatus: entry.programStatus,
                officialProgramUrl: entry.officialProgramUrl,
                sourceTitle: entry.sourceTitle,
                verificationSource: entry.verificationSource,
                lastVerifiedDate: entry.lastVerifiedDate,
            });
        });

        return Object.freeze({
            category,
            categoryLabel: getCatalogCategoryLabel(category),
            total: inCategory.length,
            buckets: Object.freeze({ ...buckets }),
            companies: Object.freeze(companies),
        });
    });

    return Object.freeze({
        generatedAt: "2026-07-31",
        totals: Object.freeze({
            catalogCount: entries.length,
            ...totals,
            creatorAffiliate: entries.filter(
                (e) =>
                    e.enrollmentProgramType === ENROLLMENT_PROGRAM_TYPES.CREATOR_AFFILIATE ||
                    e.programTypes.includes(ENROLLMENT_PROGRAM_TYPES.CREATOR_AFFILIATE),
            ).length,
            verifiedCommission: totals[CLASSIFICATION_BUCKETS.VERIFIED_COMMISSION],
            verifiedNonCommission: totals[CLASSIFICATION_BUCKETS.VERIFIED_NON_COMMISSION],
            inviteOnly: totals[CLASSIFICATION_BUCKETS.INVITE_ONLY],
            needsVerification: totals[CLASSIFICATION_BUCKETS.NEEDS_VERIFICATION],
            noPublicProgram: totals[CLASSIFICATION_BUCKETS.NO_PUBLIC_PROGRAM],
            applicationReady: listApplicationReadyPartners().length,
            revenueReady: listRevenueReadyPartners().length,
            applicationsSubmitted: entries.filter(
                (e) => e.applicationStatus !== APPLICATION_STATUSES.NOT_STARTED,
            ).length,
            approvedPrograms: entries.filter(
                (e) => e.applicationStatus === APPLICATION_STATUSES.APPROVED,
            ).length,
            activeCommercial: entries.filter(
                (e) => e.activationStatus === ACTIVATION_STATUSES.ACTIVE,
            ).length,
        }),
        categories: Object.freeze(categories),
        applicationReady: Object.freeze(
            listApplicationReadyPartners().map((e) =>
                Object.freeze({
                    id: e.id,
                    companyName: e.companyName,
                    enrollmentProgramType: e.enrollmentProgramType,
                    directRevenuePotential: e.directRevenuePotential,
                    revenueReady: e.revenueReady,
                    officialProgramUrl: e.officialProgramUrl,
                }),
            ),
        ),
        revenueReady: Object.freeze(
            listRevenueReadyPartners().map((e) =>
                Object.freeze({
                    id: e.id,
                    companyName: e.companyName,
                    officialProgramUrl: e.officialProgramUrl,
                    note: "Verified commission + application-ready. Not filed. Not activated.",
                }),
            ),
        ),
    });
}

/**
 * Research inventory counts (not revenue telemetry).
 */
export function getEnrollmentInventoryMetrics() {
    const report = getPartnerVerificationReport();
    return Object.freeze({
        verifiedCommissionPrograms: report.totals.verifiedCommission,
        verifiedNonCommissionPrograms: report.totals.verifiedNonCommission,
        inviteOnlyPrograms: report.totals.inviteOnly,
        needsVerification: report.totals.needsVerification,
        noPublicProgram: report.totals.noPublicProgram,
        openApplicationsReady: report.totals.applicationReady,
        revenueReady: report.totals.revenueReady,
        applicationsSubmitted: report.totals.applicationsSubmitted,
        approvedPrograms: report.totals.approvedPrograms,
        activeCommercialPrograms: report.totals.activeCommercial,
        creatorAffiliateMentions: report.totals.creatorAffiliate,
    });
}

export function listHighPriorityZeroCostPrograms() {
    return listRevenueReadyPartners().map((entry) =>
        Object.freeze({
            id: entry.id,
            companyName: entry.companyName,
            category: entry.category,
            categoryLabel: getCatalogCategoryLabel(entry.category),
            enrollmentProgramType: entry.enrollmentProgramType,
            directRevenuePotential: DIRECT_REVENUE_POTENTIAL.VERIFIED_COMMISSION,
            officialProgramUrl: entry.officialProgramUrl,
            prerequisites: entry.eligibility,
            commissionVerified: true,
            applicationFiled: false,
            activated: false,
        }),
    );
}
