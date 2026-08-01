/**
 * Phase 11.4D — enrollment program classification.
 * Separate from PARTNER_TYPES (affiliate/referral/partner/official runtime types).
 * Listing a type does not claim CinNova is enrolled or approved.
 */

export const ENROLLMENT_PROGRAM_TYPES = Object.freeze({
    AFFILIATE: "affiliate",
    REFERRAL: "referral",
    TECHNOLOGY_PARTNER: "technology_partner",
    MARKETPLACE: "marketplace",
    RESELLER: "reseller",
    ENTERPRISE: "enterprise",
    NONE: "none",
    UNKNOWN: "unknown",
});

export const ENROLLMENT_PROGRAM_TYPE_LIST = Object.freeze(
    Object.values(ENROLLMENT_PROGRAM_TYPES),
);

export const ENROLLMENT_PROGRAM_TYPE_LABELS = Object.freeze({
    [ENROLLMENT_PROGRAM_TYPES.AFFILIATE]: "Affiliate",
    [ENROLLMENT_PROGRAM_TYPES.REFERRAL]: "Referral",
    [ENROLLMENT_PROGRAM_TYPES.TECHNOLOGY_PARTNER]: "Technology Partner",
    [ENROLLMENT_PROGRAM_TYPES.MARKETPLACE]: "Marketplace",
    [ENROLLMENT_PROGRAM_TYPES.RESELLER]: "Reseller",
    [ENROLLMENT_PROGRAM_TYPES.ENTERPRISE]: "Enterprise",
    [ENROLLMENT_PROGRAM_TYPES.NONE]: "No Public Program",
    [ENROLLMENT_PROGRAM_TYPES.UNKNOWN]: "UNKNOWN – Verification Required",
});

export const PUBLIC_OR_PRIVATE = Object.freeze({
    PUBLIC: "public",
    PRIVATE: "private",
    UNKNOWN: "unknown",
});

export const PUBLIC_OR_PRIVATE_LIST = Object.freeze(Object.values(PUBLIC_OR_PRIVATE));

/** Report buckets for verification summaries. */
export const VERIFICATION_BUCKETS = Object.freeze({
    VERIFIED: "verified",
    NEEDS_VERIFICATION: "needs_verification",
    NO_PUBLIC_PROGRAM: "no_public_program",
});

export const VERIFICATION_BUCKET_LIST = Object.freeze(Object.values(VERIFICATION_BUCKETS));

export const VERIFICATION_BUCKET_LABELS = Object.freeze({
    [VERIFICATION_BUCKETS.VERIFIED]: "Verified",
    [VERIFICATION_BUCKETS.NEEDS_VERIFICATION]: "Needs Verification",
    [VERIFICATION_BUCKETS.NO_PUBLIC_PROGRAM]: "No Public Program",
});

export const UNKNOWN_VERIFICATION_NOTE = "UNKNOWN – Verification Required";

export function isEnrollmentProgramType(value) {
    return ENROLLMENT_PROGRAM_TYPE_LIST.includes(value);
}

export function isPublicOrPrivate(value) {
    return PUBLIC_OR_PRIVATE_LIST.includes(value);
}

export function isVerificationBucket(value) {
    return VERIFICATION_BUCKET_LIST.includes(value);
}

export function getEnrollmentProgramTypeLabel(type) {
    return ENROLLMENT_PROGRAM_TYPE_LABELS[type] || String(type || "");
}

/**
 * Map enrollment program type → verification report bucket.
 * UNKNOWN stays needs_verification. NONE is no_public_program.
 * All other classified types count as verified (program existence assessed).
 */
export function verificationBucketForProgramType(programType) {
    if (programType === ENROLLMENT_PROGRAM_TYPES.UNKNOWN) {
        return VERIFICATION_BUCKETS.NEEDS_VERIFICATION;
    }
    if (programType === ENROLLMENT_PROGRAM_TYPES.NONE) {
        return VERIFICATION_BUCKETS.NO_PUBLIC_PROGRAM;
    }
    return VERIFICATION_BUCKETS.VERIFIED;
}
