/**
 * Phase 11.4 — public affiliate / partner catalog API.
 */

export {
    AFFILIATE_PROGRAM_CONFIG,
    getAffiliateProgramStatus,
    getDefaultAffiliateDisclosure,
    isAffiliateProgramGloballyEnabled,
} from "./affiliateConfig.js";

export {
    PARTNER_TYPES,
    PARTNER_TYPE_LIST,
    DISCLOSURE_REQUIRED_TYPES,
    isPartnerType,
    partnerTypeRequiresDisclosure,
} from "./partnerTypes.js";

export {
    PARTNER_REGISTRY,
    listPartners,
    listPartnersByType,
    listEnabledPartners,
    getPartnerById,
    getPartnerByLegacyNumericId,
    resolvePartnerRef,
} from "./partnerRegistry.js";

export {
    validateHttpsUrl,
    validatePartnerRecord,
    validateResolvedPartnerLink,
    validatePartnerRegistry,
    getPartnerAllowedHosts,
    hostMatchesAllowlist,
} from "./linkValidation.js";

export {
    resolvePartnerHref,
    resolvePartnerLink,
    resolveRenderablePartnerLinks,
} from "./resolvePartnerLink.js";

export {
    CATALOG_CATEGORIES,
    CATALOG_CATEGORY_LABELS,
    CATALOG_CATEGORY_LIST,
    isCatalogCategory,
    getCatalogCategoryLabel,
} from "./catalogCategories.js";

export {
    PROGRAM_STATUSES,
    APPLICATION_STATUSES,
    APPROVAL_STATUSES,
    ACTIVATION_STATUSES,
    PROGRAM_STATUS_LIST,
    APPLICATION_STATUS_LIST,
    APPROVAL_STATUS_LIST,
    ACTIVATION_STATUS_LIST,
    CATALOG_DEFAULT_STATUSES,
    isProgramStatus,
    isApplicationStatus,
    isApprovalStatus,
    isActivationStatus,
} from "./catalogStatuses.js";

export {
    ENROLLMENT_PROGRAM_TYPES,
    ENROLLMENT_PROGRAM_TYPE_LIST,
    ENROLLMENT_PROGRAM_TYPE_LABELS,
    DIRECT_REVENUE_POTENTIAL,
    DIRECT_REVENUE_POTENTIAL_LIST,
    DIRECT_REVENUE_POTENTIAL_LABELS,
    PUBLIC_OR_PRIVATE,
    PUBLIC_OR_PRIVATE_LIST,
    REVIEW_TIME_TOKENS,
    CLASSIFICATION_BUCKETS,
    CLASSIFICATION_BUCKET_LIST,
    CLASSIFICATION_BUCKET_LABELS,
    UNKNOWN_VERIFICATION_NOTE,
    isEnrollmentProgramType,
    isDirectRevenuePotential,
    isPublicOrPrivate,
    isClassificationBucket,
    getEnrollmentProgramTypeLabel,
    getDirectRevenuePotentialLabel,
    classificationBucketForEntry,
    computeRevenueReady,
} from "./enrollmentProgramTypes.js";

export { DEFAULT_COMPLIANCE } from "./complianceDefaults.js";

export {
    PARTNER_CATALOG,
    listPartnerCatalog,
    getPartnerCatalogEntry,
    listPartnerCatalogByCategory,
    listPartnerCatalogByApplicationStatus,
    listPartnerCatalogByClassificationBucket,
    listApplicationReadyPartners,
    listRevenueReadyPartners,
    listCreatorAffiliatePrograms,
    validatePartnerCatalogEntry,
    validatePartnerCatalog,
} from "./partnerCatalog.js";

export {
    toApplicationTrackerRow,
    listApplicationTrackerRows,
    listPendingApplications,
    listApprovedApplications,
    listActivePartners,
    getApplicationTrackerSummary,
} from "./applicationTracker.js";

export {
    getPartnerVerificationReport,
    getEnrollmentInventoryMetrics,
    listHighPriorityZeroCostPrograms,
} from "./verificationReport.js";

export {
    PARTNER_LIFECYCLE_STATUSES,
    toPartnerLifecycleStatus,
} from "./partnerLifecycle.js";

export {
    buildAffiliateOnboardingTracker,
    summarizeAffiliateOnboarding,
    mayRenderMonetizedAffiliateUrl,
    assertAffiliateIdSafeForPublic,
} from "./affiliateOnboarding.js";

export {
    buildAffiliatePriorityList,
    groupAffiliatePriorities,
    AFFILIATE_PRIORITY,
} from "./affiliatePriority.js";

export {
    buildAffiliateApplicationPack,
    summarizeApplicationPack,
    classifyHighPriorityApplications,
    AFFILIATE_APPLY_CLASS,
} from "./applicationPack.js";

export {
    APPLICATION_WORKFLOW_STATES,
    deriveWorkflowState,
    assertApprovedRequiresEvidence,
    assertCanActivateAffiliate,
} from "./applicationWorkflow.js";

export {
    REVENUE_METRICS_PLACEHOLDER,
    getRevenueOpportunityMetrics,
    formatRevenueMetric,
    formatConversionRate,
} from "./revenueOpportunities.js";
