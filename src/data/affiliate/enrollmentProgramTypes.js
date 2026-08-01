/**
 * Phase 11.4D — exact enrollment program classification.
 * Listing a type does not claim CinNova is enrolled, approved, or paid.
 */

export const ENROLLMENT_PROGRAM_TYPES = Object.freeze({
    CREATOR_AFFILIATE: "creator_affiliate",
    CUSTOMER_REFERRAL: "customer_referral",
    RESELLER: "reseller",
    AGENCY_PARTNER: "agency_partner",
    CONSULTING_IMPLEMENTATION_PARTNER: "consulting_implementation_partner",
    TECHNOLOGY_INTEGRATION_PARTNER: "technology_integration_partner",
    CLOUD_MARKETPLACE: "cloud_marketplace",
    STARTUP_PROGRAM: "startup_program",
    EDUCATION_PROGRAM: "education_program",
    VC_PORTFOLIO_PROGRAM: "vc_portfolio_program",
    INVITE_ONLY_PARTNER: "invite_only_partner",
    ENTERPRISE_PARTNER: "enterprise_partner",
    NO_PUBLIC_PROGRAM: "no_public_program",
    UNKNOWN: "unknown",
});

export const ENROLLMENT_PROGRAM_TYPE_LIST = Object.freeze(
    Object.values(ENROLLMENT_PROGRAM_TYPES),
);

export const ENROLLMENT_PROGRAM_TYPE_LABELS = Object.freeze({
    [ENROLLMENT_PROGRAM_TYPES.CREATOR_AFFILIATE]: "Creator Affiliate",
    [ENROLLMENT_PROGRAM_TYPES.CUSTOMER_REFERRAL]: "Customer Referral",
    [ENROLLMENT_PROGRAM_TYPES.RESELLER]: "Reseller",
    [ENROLLMENT_PROGRAM_TYPES.AGENCY_PARTNER]: "Agency Partner",
    [ENROLLMENT_PROGRAM_TYPES.CONSULTING_IMPLEMENTATION_PARTNER]:
        "Consulting / Implementation Partner",
    [ENROLLMENT_PROGRAM_TYPES.TECHNOLOGY_INTEGRATION_PARTNER]:
        "Technology Integration Partner",
    [ENROLLMENT_PROGRAM_TYPES.CLOUD_MARKETPLACE]: "Cloud Marketplace",
    [ENROLLMENT_PROGRAM_TYPES.STARTUP_PROGRAM]: "Startup Program",
    [ENROLLMENT_PROGRAM_TYPES.EDUCATION_PROGRAM]: "Education Program",
    [ENROLLMENT_PROGRAM_TYPES.VC_PORTFOLIO_PROGRAM]: "VC Portfolio Program",
    [ENROLLMENT_PROGRAM_TYPES.INVITE_ONLY_PARTNER]: "Invite-Only Partner",
    [ENROLLMENT_PROGRAM_TYPES.ENTERPRISE_PARTNER]: "Enterprise Partner",
    [ENROLLMENT_PROGRAM_TYPES.NO_PUBLIC_PROGRAM]: "No Public Program",
    [ENROLLMENT_PROGRAM_TYPES.UNKNOWN]: "UNKNOWN – Verification Required",
});

/** Direct referral/affiliate revenue potential (separate from program existence). */
export const DIRECT_REVENUE_POTENTIAL = Object.freeze({
    VERIFIED_COMMISSION: "verified_commission",
    POSSIBLE_REVENUE_NOT_PUBLICLY_SPECIFIED: "possible_revenue_not_publicly_specified",
    NON_COMMISSION_PARTNER_PROGRAM: "non_commission_partner_program",
    NONE: "none",
    UNKNOWN: "unknown",
});

export const DIRECT_REVENUE_POTENTIAL_LIST = Object.freeze(
    Object.values(DIRECT_REVENUE_POTENTIAL),
);

export const DIRECT_REVENUE_POTENTIAL_LABELS = Object.freeze({
    [DIRECT_REVENUE_POTENTIAL.VERIFIED_COMMISSION]: "Verified commission",
    [DIRECT_REVENUE_POTENTIAL.POSSIBLE_REVENUE_NOT_PUBLICLY_SPECIFIED]:
        "Possible revenue (terms not fully public)",
    [DIRECT_REVENUE_POTENTIAL.NON_COMMISSION_PARTNER_PROGRAM]:
        "Non-commission partner program",
    [DIRECT_REVENUE_POTENTIAL.NONE]: "None",
    [DIRECT_REVENUE_POTENTIAL.UNKNOWN]: "Unknown",
});

export const PUBLIC_OR_PRIVATE = Object.freeze({
    PUBLIC: "public",
    PRIVATE: "private",
    UNKNOWN: "unknown",
});

export const PUBLIC_OR_PRIVATE_LIST = Object.freeze(Object.values(PUBLIC_OR_PRIVATE));

export const REVIEW_TIME_TOKENS = Object.freeze({
    NOT_PUBLISHED: "NOT_PUBLISHED",
    UNKNOWN: "UNKNOWN",
});

export const UNKNOWN_VERIFICATION_NOTE = "UNKNOWN – Verification Required";

/** Report / dashboard classification buckets (not a single generic “Verified”). */
export const CLASSIFICATION_BUCKETS = Object.freeze({
    VERIFIED_COMMISSION: "verified_commission",
    VERIFIED_NON_COMMISSION: "verified_non_commission",
    INVITE_ONLY: "invite_only",
    NEEDS_VERIFICATION: "needs_verification",
    NO_PUBLIC_PROGRAM: "no_public_program",
});

export const CLASSIFICATION_BUCKET_LIST = Object.freeze(Object.values(CLASSIFICATION_BUCKETS));

export const CLASSIFICATION_BUCKET_LABELS = Object.freeze({
    [CLASSIFICATION_BUCKETS.VERIFIED_COMMISSION]: "Verified commission programs",
    [CLASSIFICATION_BUCKETS.VERIFIED_NON_COMMISSION]: "Verified non-commission partner programs",
    [CLASSIFICATION_BUCKETS.INVITE_ONLY]: "Invite-only programs",
    [CLASSIFICATION_BUCKETS.NEEDS_VERIFICATION]: "Programs needing verification",
    [CLASSIFICATION_BUCKETS.NO_PUBLIC_PROGRAM]: "No public program",
});

export function isEnrollmentProgramType(value) {
    return ENROLLMENT_PROGRAM_TYPE_LIST.includes(value);
}

export function isDirectRevenuePotential(value) {
    return DIRECT_REVENUE_POTENTIAL_LIST.includes(value);
}

export function isPublicOrPrivate(value) {
    return PUBLIC_OR_PRIVATE_LIST.includes(value);
}

export function isClassificationBucket(value) {
    return CLASSIFICATION_BUCKET_LIST.includes(value);
}

export function getEnrollmentProgramTypeLabel(type) {
    return ENROLLMENT_PROGRAM_TYPE_LABELS[type] || String(type || "");
}

export function getDirectRevenuePotentialLabel(value) {
    return DIRECT_REVENUE_POTENTIAL_LABELS[value] || String(value || "");
}

/**
 * Derive dashboard classification bucket from primary type + revenue + invite flags.
 */
export function classificationBucketForEntry({
    enrollmentProgramType,
    programTypes = [],
    directRevenuePotential,
    programStatus,
}) {
    const types = new Set([enrollmentProgramType, ...(programTypes || [])]);
    if (
        types.has(ENROLLMENT_PROGRAM_TYPES.UNKNOWN) ||
        enrollmentProgramType === ENROLLMENT_PROGRAM_TYPES.UNKNOWN
    ) {
        return CLASSIFICATION_BUCKETS.NEEDS_VERIFICATION;
    }
    if (
        types.has(ENROLLMENT_PROGRAM_TYPES.NO_PUBLIC_PROGRAM) ||
        enrollmentProgramType === ENROLLMENT_PROGRAM_TYPES.NO_PUBLIC_PROGRAM
    ) {
        return CLASSIFICATION_BUCKETS.NO_PUBLIC_PROGRAM;
    }
    if (
        types.has(ENROLLMENT_PROGRAM_TYPES.INVITE_ONLY_PARTNER) ||
        programStatus === "invite_only"
    ) {
        return CLASSIFICATION_BUCKETS.INVITE_ONLY;
    }
    if (directRevenuePotential === DIRECT_REVENUE_POTENTIAL.VERIFIED_COMMISSION) {
        return CLASSIFICATION_BUCKETS.VERIFIED_COMMISSION;
    }
    return CLASSIFICATION_BUCKETS.VERIFIED_NON_COMMISSION;
}

/**
 * revenueReady requires verified commission + applicationReady.
 * applicationReady is supplied by catalogEntry after eligibility checks.
 */
export function computeRevenueReady({ applicationReady, directRevenuePotential }) {
    return Boolean(
        applicationReady &&
            directRevenuePotential === DIRECT_REVENUE_POTENTIAL.VERIFIED_COMMISSION,
    );
}
