/**
 * Phase 11.4D — Partner verification report by catalog category.
 */

import { CATALOG_CATEGORY_LIST, getCatalogCategoryLabel } from "./catalogCategories.js";
import {
    VERIFICATION_BUCKETS,
    VERIFICATION_BUCKET_LABELS,
    ENROLLMENT_PROGRAM_TYPES,
} from "./enrollmentProgramTypes.js";
import { listPartnerCatalog } from "./partnerCatalog.js";
import { PROGRAM_STATUSES } from "./catalogStatuses.js";

function emptyBucketCounts() {
    return {
        [VERIFICATION_BUCKETS.VERIFIED]: 0,
        [VERIFICATION_BUCKETS.NEEDS_VERIFICATION]: 0,
        [VERIFICATION_BUCKETS.NO_PUBLIC_PROGRAM]: 0,
    };
}

/**
 * @returns {{
 *   generatedAt: string,
 *   totals: Record<string, number>,
 *   categories: Array<object>,
 *   applicationsReady: Array<object>,
 * }}
 */
export function getPartnerVerificationReport() {
    const entries = listPartnerCatalog();
    const totals = emptyBucketCounts();

    const categories = CATALOG_CATEGORY_LIST.map((category) => {
        const inCategory = entries.filter((e) => e.category === category);
        const buckets = emptyBucketCounts();
        const companies = inCategory.map((entry) => {
            buckets[entry.verificationBucket] =
                (buckets[entry.verificationBucket] || 0) + 1;
            totals[entry.verificationBucket] = (totals[entry.verificationBucket] || 0) + 1;
            return Object.freeze({
                id: entry.id,
                companyName: entry.companyName,
                enrollmentProgramType: entry.enrollmentProgramType,
                verificationBucket: entry.verificationBucket,
                verificationBucketLabel:
                    VERIFICATION_BUCKET_LABELS[entry.verificationBucket],
                programStatus: entry.programStatus,
                officialProgramUrl: entry.officialProgramUrl,
                lastVerifiedDate: entry.lastVerifiedDate,
                verificationSource: entry.verificationSource,
            });
        });

        return Object.freeze({
            category,
            categoryLabel: getCatalogCategoryLabel(category),
            total: inCategory.length,
            buckets: Object.freeze({ ...buckets }),
            verified: companies.filter(
                (c) => c.verificationBucket === VERIFICATION_BUCKETS.VERIFIED,
            ),
            needsVerification: companies.filter(
                (c) => c.verificationBucket === VERIFICATION_BUCKETS.NEEDS_VERIFICATION,
            ),
            noPublicProgram: companies.filter(
                (c) => c.verificationBucket === VERIFICATION_BUCKETS.NO_PUBLIC_PROGRAM,
            ),
            companies: Object.freeze(companies),
        });
    });

    const applicationsReady = entries
        .filter(
            (entry) =>
                entry.verificationBucket === VERIFICATION_BUCKETS.VERIFIED &&
                entry.enrollmentProgramType !== ENROLLMENT_PROGRAM_TYPES.NONE &&
                entry.programStatus === PROGRAM_STATUSES.OPEN &&
                entry.officialProgramUrl &&
                entry.applicationRequired === true,
        )
        .map((entry) =>
            Object.freeze({
                id: entry.id,
                companyName: entry.companyName,
                category: entry.category,
                categoryLabel: getCatalogCategoryLabel(entry.category),
                enrollmentProgramType: entry.enrollmentProgramType,
                officialProgramUrl: entry.officialProgramUrl,
                note: "Research-complete open program with apply URL. Application status remains not_started — not filed.",
            }),
        );

    return Object.freeze({
        generatedAt: "2026-07-31",
        totals: Object.freeze({
            catalogCount: entries.length,
            ...totals,
            applicationsReadyCount: applicationsReady.length,
        }),
        categories: Object.freeze(categories),
        applicationsReady: Object.freeze(applicationsReady),
    });
}

/**
 * Enrollment inventory KPIs derived from verification (not revenue telemetry).
 */
export function getEnrollmentInventoryMetrics() {
    const report = getPartnerVerificationReport();
    const entries = listPartnerCatalog();
    const programsAvailable = entries.filter(
        (e) =>
            e.enrollmentProgramType !== ENROLLMENT_PROGRAM_TYPES.NONE &&
            e.enrollmentProgramType !== ENROLLMENT_PROGRAM_TYPES.UNKNOWN,
    ).length;

    return Object.freeze({
        programsAvailable,
        programsVerified: report.totals[VERIFICATION_BUCKETS.VERIFIED] || 0,
        needsVerification: report.totals[VERIFICATION_BUCKETS.NEEDS_VERIFICATION] || 0,
        noPublicProgram: report.totals[VERIFICATION_BUCKETS.NO_PUBLIC_PROGRAM] || 0,
        applicationsReady: report.totals.applicationsReadyCount || 0,
    });
}
