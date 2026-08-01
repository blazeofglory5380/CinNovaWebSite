/**
 * Phase 11.4A — public affiliate management API.
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
