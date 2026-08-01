/**
 * Phase 11.4B/D — centralized AI & Technology Partner Catalog + enrollment fields.
 *
 * IMPORTANT:
 * - Catalog entries are research / prospect records only.
 * - Listing a company here does NOT claim a partnership, affiliate approval,
 *   or commercial relationship exists.
 * - No affiliate/referral IDs, tracked commercial URLs, or payment rails here.
 * - Every record defaults to Not Started + Disabled activation.
 * - Do not invent programs, approval requirements, or review timelines.
 */

import { PARTNER_TYPES, isPartnerType } from "./partnerTypes.js";
import { CATALOG_CATEGORIES, isCatalogCategory } from "./catalogCategories.js";
import {
    ACTIVATION_STATUSES,
    APPLICATION_STATUSES,
    APPROVAL_STATUSES,
    CATALOG_DEFAULT_STATUSES,
    isActivationStatus,
    isApplicationStatus,
    isApprovalStatus,
    isProgramStatus,
    PROGRAM_STATUSES,
} from "./catalogStatuses.js";
import {
    ENROLLMENT_PROGRAM_TYPES,
    PUBLIC_OR_PRIVATE,
    UNKNOWN_VERIFICATION_NOTE,
    isEnrollmentProgramType,
    isPublicOrPrivate,
    verificationBucketForProgramType,
} from "./enrollmentProgramTypes.js";
import { DEFAULT_COMPLIANCE } from "./complianceDefaults.js";
import { validateHttpsUrl } from "./linkValidation.js";

/**
 * @typedef {object} PartnerCatalogRecord
 * @property {string} id
 * @property {string} companyName
 * @property {string} officialWebsite
 * @property {string} category
 * @property {string} partnerType
 * @property {string} programStatus
 * @property {string} applicationStatus
 * @property {string} approvalStatus
 * @property {string} activationStatus
 * @property {ReadonlyArray<string>} allowedDomains
 * @property {boolean} ftcDisclosureRequired
 * @property {string} notes
 * @property {string} lastReviewed
 * @property {string|null} registryPartnerId
 * @property {null} affiliateId
 * @property {null} referralId
 * @property {string} enrollmentProgramType
 * @property {string|null} officialProgramUrl
 * @property {string} eligibility
 * @property {string} countryRestrictions
 * @property {boolean|null} applicationRequired
 * @property {boolean|null} approvalRequired
 * @property {string} estimatedReviewTime
 * @property {string} publicOrPrivateProgram
 * @property {string} programNotes
 * @property {string} lastVerifiedDate
 * @property {string} verificationSource
 * @property {string} verificationBucket
 * @property {string|null} applicationDate
 * @property {string|null} approvalDate
 * @property {string|null} renewalDate
 * @property {string} reviewNotes
 * @property {string} internalNotes
 * @property {string|null} programDocumentationUrl
 * @property {string} programSpecificDisclosureRules
 * @property {string} trademarkUsageRestrictions
 * @property {boolean|string} brandGuidelinesAvailable
 * @property {string} logoUsagePermissions
 */

const REVIEWED = "2026-07-31";
const VERIFIED = "2026-07-31";

/**
 * @param {object} partial
 * @returns {PartnerCatalogRecord}
 */
function catalogEntry(partial) {
    const enrollmentProgramType =
        partial.enrollmentProgramType ?? ENROLLMENT_PROGRAM_TYPES.UNKNOWN;
    const allowedDomains = Object.freeze([...(partial.allowedDomains || [])]);
    return Object.freeze({
        id: partial.id,
        companyName: partial.companyName,
        officialWebsite: partial.officialWebsite,
        category: partial.category,
        partnerType: partial.partnerType,
        programStatus: partial.programStatus ?? CATALOG_DEFAULT_STATUSES.programStatus,
        applicationStatus: CATALOG_DEFAULT_STATUSES.applicationStatus,
        approvalStatus: CATALOG_DEFAULT_STATUSES.approvalStatus,
        activationStatus: CATALOG_DEFAULT_STATUSES.activationStatus,
        allowedDomains,
        ftcDisclosureRequired: Boolean(partial.ftcDisclosureRequired),
        notes: partial.notes || "",
        lastReviewed: partial.lastReviewed || REVIEWED,
        registryPartnerId: partial.registryPartnerId ?? null,
        affiliateId: null,
        referralId: null,

        enrollmentProgramType,
        officialProgramUrl: partial.officialProgramUrl ?? null,
        eligibility: partial.eligibility ?? UNKNOWN_VERIFICATION_NOTE,
        countryRestrictions: partial.countryRestrictions ?? UNKNOWN_VERIFICATION_NOTE,
        applicationRequired:
            partial.applicationRequired === undefined ? null : partial.applicationRequired,
        approvalRequired:
            partial.approvalRequired === undefined ? null : partial.approvalRequired,
        estimatedReviewTime: partial.estimatedReviewTime ?? UNKNOWN_VERIFICATION_NOTE,
        publicOrPrivateProgram: partial.publicOrPrivateProgram ?? PUBLIC_OR_PRIVATE.UNKNOWN,
        programNotes: partial.programNotes || "",
        lastVerifiedDate: partial.lastVerifiedDate || VERIFIED,
        verificationSource: partial.verificationSource || "",
        verificationBucket: verificationBucketForProgramType(enrollmentProgramType),

        applicationDate: null,
        approvalDate: null,
        renewalDate: null,
        reviewNotes: partial.reviewNotes || "",
        internalNotes: partial.internalNotes || "",
        programDocumentationUrl: partial.programDocumentationUrl ?? null,

        programSpecificDisclosureRules:
            partial.programSpecificDisclosureRules ||
            DEFAULT_COMPLIANCE.programSpecificDisclosureRules,
        trademarkUsageRestrictions:
            partial.trademarkUsageRestrictions ||
            DEFAULT_COMPLIANCE.trademarkUsageRestrictions,
        brandGuidelinesAvailable:
            partial.brandGuidelinesAvailable ?? DEFAULT_COMPLIANCE.brandGuidelinesAvailable,
        logoUsagePermissions:
            partial.logoUsagePermissions || DEFAULT_COMPLIANCE.logoUsagePermissions,
    });
}

/** @type {ReadonlyArray<PartnerCatalogRecord>} */
export const PARTNER_CATALOG = Object.freeze([
    // —— AI Companies ——
    catalogEntry({
        id: "openai",
        companyName: "OpenAI",
        officialWebsite: "https://openai.com/",
        category: CATALOG_CATEGORIES.AI_COMPANIES,
        partnerType: PARTNER_TYPES.PARTNER,
        programStatus: PROGRAM_STATUSES.OPEN,
        allowedDomains: ["openai.com", "www.openai.com", "platform.openai.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. No application filed. No commercial links.",
        enrollmentProgramType: ENROLLMENT_PROGRAM_TYPES.TECHNOLOGY_PARTNER,
        officialProgramUrl: "https://openai.com/form/partnerintake/",
        eligibility:
            "Business/organization partner interest via OpenAI partner intake. No public ChatGPT/API commission affiliate program published on official OpenAI domains.",
        countryRestrictions: "Not published on partner intake page — verify during application.",
        applicationRequired: true,
        approvalRequired: true,
        estimatedReviewTime: "Not published by vendor",
        publicOrPrivateProgram: PUBLIC_OR_PRIVATE.PUBLIC,
        programNotes:
            "Official partner intake form confirmed. Help Center documents occasional ChatGPT promotional/referral invites for eligible users — not a public commission affiliate program. Do not treat third-party 'OpenAI affiliate' pages as official.",
        verificationSource: "https://openai.com/form/partnerintake/",
        programDocumentationUrl: "https://help.openai.com/en/articles/8381046-chatgpt-promotional-subscriptions-free-trial-invites-faq",
        internalNotes: "Primary path = technology/enterprise partner intake. No public affiliate ID path.",
    }),
    catalogEntry({
        id: "anthropic",
        companyName: "Anthropic",
        officialWebsite: "https://www.anthropic.com/",
        category: CATALOG_CATEGORIES.AI_COMPANIES,
        partnerType: PARTNER_TYPES.PARTNER,
        programStatus: PROGRAM_STATUSES.OPEN,
        allowedDomains: ["anthropic.com", "www.anthropic.com", "claude.ai", "claude.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. No application filed. No commercial links.",
        enrollmentProgramType: ENROLLMENT_PROGRAM_TYPES.TECHNOLOGY_PARTNER,
        officialProgramUrl: "https://claude.com/partners",
        eligibility:
            "Organizations bringing Claude to market (Claude Partner Network). Membership described as free to join with application; not a consumer commission affiliate program.",
        countryRestrictions: "Not fully enumerated on public partners page — verify in application.",
        applicationRequired: true,
        approvalRequired: true,
        estimatedReviewTime: "Not published by vendor",
        publicOrPrivateProgram: PUBLIC_OR_PRIVATE.PUBLIC,
        programNotes:
            "Claude Partner Network / Partner Hub documented on Anthropic/Claude official pages. No separate public Claude commission affiliate program identified on official domains.",
        verificationSource: "https://claude.com/partners",
        programDocumentationUrl: "https://www.anthropic.com/news/claude-partner-network",
        internalNotes: "Services/technology partner track. Do not claim CinNova is a Claude Partner.",
    }),
    catalogEntry({
        id: "google-ai",
        companyName: "Google AI",
        officialWebsite: "https://ai.google/",
        category: CATALOG_CATEGORIES.AI_COMPANIES,
        partnerType: PARTNER_TYPES.PARTNER,
        programStatus: PROGRAM_STATUSES.NOT_AVAILABLE,
        allowedDomains: ["ai.google", "google.com", "www.google.com", "deepmind.google"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. Covers Google AI / Gemini public surfaces for research.",
        enrollmentProgramType: ENROLLMENT_PROGRAM_TYPES.NONE,
        officialProgramUrl: null,
        eligibility:
            "No public Gemini / Google AI consumer affiliate or referral-commission program identified on official Google AI surfaces.",
        countryRestrictions: "n/a — no public Gemini affiliate program verified",
        applicationRequired: false,
        approvalRequired: false,
        estimatedReviewTime: "n/a",
        publicOrPrivateProgram: PUBLIC_OR_PRIVATE.UNKNOWN,
        programNotes:
            "Google Cloud Affiliate and Google Cloud Partner Network are separate programs tracked under the Google Cloud catalog row. Do not invent a Gemini affiliate program.",
        verificationSource: "https://ai.google/",
        programDocumentationUrl: "https://cloud.google.com/affiliate-program",
        internalNotes: "Cross-reference google-cloud for publisher affiliate options.",
    }),
    catalogEntry({
        id: "hugging-face",
        companyName: "Hugging Face",
        officialWebsite: "https://huggingface.co/",
        category: CATALOG_CATEGORIES.AI_COMPANIES,
        partnerType: PARTNER_TYPES.AFFILIATE,
        programStatus: PROGRAM_STATUSES.UNKNOWN,
        allowedDomains: ["huggingface.co", "www.huggingface.co"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. Evaluate Hub / Pro affiliate options before applying.",
        enrollmentProgramType: ENROLLMENT_PROGRAM_TYPES.UNKNOWN,
        officialProgramUrl: null,
        eligibility: UNKNOWN_VERIFICATION_NOTE,
        countryRestrictions: UNKNOWN_VERIFICATION_NOTE,
        applicationRequired: null,
        approvalRequired: null,
        estimatedReviewTime: UNKNOWN_VERIFICATION_NOTE,
        publicOrPrivateProgram: PUBLIC_OR_PRIVATE.UNKNOWN,
        programNotes:
            "Official Hub docs describe Pro / Team / Enterprise subscriptions. No clear public affiliate signup page found on huggingface.co during verification. Third-party claims are insufficient — keep UNKNOWN until an official HF program page is confirmed.",
        verificationSource: "https://huggingface.co/pro",
        programDocumentationUrl: "https://huggingface.co/docs/hub/en/billing",
        internalNotes: "Needs primary-source confirmation before any application prep.",
    }),
    catalogEntry({
        id: "perplexity",
        companyName: "Perplexity",
        officialWebsite: "https://www.perplexity.ai/",
        category: CATALOG_CATEGORIES.AI_COMPANIES,
        partnerType: PARTNER_TYPES.AFFILIATE,
        programStatus: PROGRAM_STATUSES.OPEN,
        allowedDomains: ["perplexity.ai", "www.perplexity.ai", "partners.dub.co"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. No application filed.",
        enrollmentProgramType: ENROLLMENT_PROGRAM_TYPES.AFFILIATE,
        officialProgramUrl: "https://partners.dub.co/perplexity",
        eligibility:
            "Creator/publisher affiliate portal hosted on Dub Partners. Separate Pro subscriber referral discounts and student/campus programs also documented on Perplexity Help Center / legal pages.",
        countryRestrictions: "Affiliate portal availability — verify in Dub application flow.",
        applicationRequired: true,
        approvalRequired: true,
        estimatedReviewTime: "Not published by vendor",
        publicOrPrivateProgram: PUBLIC_OR_PRIVATE.PUBLIC,
        programNotes:
            "Primary enrollment path: Dub-hosted Perplexity Affiliate Program. Also note Pro referral discounts (subscriber) and Campus Partners terms (students) — distinct from publisher affiliate.",
        verificationSource: "https://partners.dub.co/perplexity",
        programDocumentationUrl: "https://www.perplexity.ai/hub/legal/campus-partners-program-terms",
        programSpecificDisclosureRules:
            "Campus Partners terms explicitly require FTC-compliant disclosures (e.g. #ad / #affiliate) when posting. Apply the same clear disclosure standard to any future publisher affiliate activation.",
    }),
    catalogEntry({
        id: "runway",
        companyName: "Runway",
        officialWebsite: "https://runwayml.com/",
        category: CATALOG_CATEGORIES.AI_COMPANIES,
        partnerType: PARTNER_TYPES.AFFILIATE,
        programStatus: PROGRAM_STATUSES.OPEN,
        allowedDomains: ["runwayml.com", "www.runwayml.com", "runway.com", "affiliates.runwayml.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. Creative AI video tooling.",
        enrollmentProgramType: ENROLLMENT_PROGRAM_TYPES.AFFILIATE,
        officialProgramUrl: "https://runway.com/affiliate-program",
        eligibility:
            "Creators applying to Runway Affiliate Program (application form). Separate Creative Partners Program is curated/select and is not the affiliate track.",
        countryRestrictions: "Application asks for country of bank account — payout eligibility verified by Runway.",
        applicationRequired: true,
        approvalRequired: true,
        estimatedReviewTime: "Not published by vendor",
        publicOrPrivateProgram: PUBLIC_OR_PRIVATE.PUBLIC,
        programNotes:
            "Official apply page and affiliates.runwayml.com portal confirmed. Help Center links to affiliate program. Do not confuse with Creative Partners Program.",
        verificationSource: "https://runway.com/affiliate-program",
        programDocumentationUrl: "https://help.runwayml.com/hc/en-us/articles/21778637276179-How-can-I-share-my-Runway-made-work-with-the-team-or-have-it-featured-to-the-community",
    }),
    catalogEntry({
        id: "elevenlabs",
        companyName: "ElevenLabs",
        officialWebsite: "https://elevenlabs.io/",
        category: CATALOG_CATEGORIES.AI_COMPANIES,
        partnerType: PARTNER_TYPES.AFFILIATE,
        programStatus: PROGRAM_STATUSES.OPEN,
        allowedDomains: ["elevenlabs.io", "www.elevenlabs.io"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. No application filed.",
        enrollmentProgramType: ENROLLMENT_PROGRAM_TYPES.AFFILIATE,
        officialProgramUrl: "https://elevenlabs.io/affiliates",
        eligibility: "Creator Affiliate Program via PartnerStack onboarding from official affiliates page.",
        countryRestrictions: "Not fully enumerated on public affiliates page — verify in PartnerStack onboarding.",
        applicationRequired: true,
        approvalRequired: true,
        estimatedReviewTime: "Not published by vendor",
        publicOrPrivateProgram: PUBLIC_OR_PRIVATE.PUBLIC,
        programNotes:
            "Official Creator Affiliate Program page and Affiliate Partner Guide published. Managed via PartnerStack. Commission figures appear on official pages but no IDs or links are stored here.",
        verificationSource: "https://elevenlabs.io/affiliates",
        programDocumentationUrl: "https://elevenlabs.io/affiliate-partner-guide",
    }),

    // —— Creative Tools ——
    catalogEntry({
        id: "adobe",
        companyName: "Adobe",
        officialWebsite: "https://www.adobe.com/",
        category: CATALOG_CATEGORIES.CREATIVE_TOOLS,
        partnerType: PARTNER_TYPES.AFFILIATE,
        programStatus: PROGRAM_STATUSES.OPEN,
        allowedDomains: ["adobe.com", "www.adobe.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. Creative Cloud / Firefly programs under research.",
        enrollmentProgramType: ENROLLMENT_PROGRAM_TYPES.AFFILIATE,
        officialProgramUrl: "https://www.adobe.com/affiliates.html",
        eligibility: "Publishers/creators joining Adobe Affiliate Marketing via Partnerize.",
        countryRestrictions: "Managed via Partnerize — confirm regional eligibility in Partnerize signup.",
        applicationRequired: true,
        approvalRequired: true,
        estimatedReviewTime: "Not published by vendor",
        publicOrPrivateProgram: PUBLIC_OR_PRIVATE.PUBLIC,
        programNotes: "Official Adobe Affiliate Marketing page confirms Partnerize management.",
        verificationSource: "https://www.adobe.com/affiliates.html",
        brandGuidelinesAvailable: "unknown",
    }),
    catalogEntry({
        id: "canva-catalog",
        companyName: "Canva",
        officialWebsite: "https://www.canva.com/",
        category: CATALOG_CATEGORIES.CREATIVE_TOOLS,
        partnerType: PARTNER_TYPES.AFFILIATE,
        programStatus: PROGRAM_STATUSES.CLOSED,
        allowedDomains: ["canva.com", "www.canva.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect catalog entry. Runtime registry id `canva` remains disabled.",
        registryPartnerId: "canva",
        enrollmentProgramType: ENROLLMENT_PROGRAM_TYPES.AFFILIATE,
        officialProgramUrl: "https://www.canva.com/help/canva-affiliate-marketing-program/",
        eligibility:
            "Affiliate benefits only via Canvassador Program pathway per Canva Help Center. Help Center states Canvassador applications are currently closed.",
        countryRestrictions: "Verify on Canva Community application forms when reopen.",
        applicationRequired: true,
        approvalRequired: true,
        estimatedReviewTime: "Not published by vendor",
        publicOrPrivateProgram: PUBLIC_OR_PRIVATE.PUBLIC,
        programNotes:
            "Program exists but affiliate pathway is gated by Canvassador membership and Help Center reports applications currently closed. Do not apply until Canva reopens / confirms pathway.",
        verificationSource: "https://www.canva.com/help/canva-affiliate-marketing-program/",
        internalNotes: "Status CLOSED for new applications as of verification date.",
    }),
    catalogEntry({
        id: "figma",
        companyName: "Figma",
        officialWebsite: "https://www.figma.com/",
        category: CATALOG_CATEGORIES.CREATIVE_TOOLS,
        partnerType: PARTNER_TYPES.AFFILIATE,
        programStatus: PROGRAM_STATUSES.OPEN,
        allowedDomains: ["figma.com", "www.figma.com", "weave.figma.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. No application filed.",
        enrollmentProgramType: ENROLLMENT_PROGRAM_TYPES.AFFILIATE,
        officialProgramUrl: "https://weave.figma.com/affiliate",
        eligibility:
            "Figma Weave Affiliate Program (content creators, educators, community leaders) via weave.figma.com. This is Weave-specific — not a general Figma Design product affiliate page.",
        countryRestrictions: "Not fully enumerated on Weave affiliate page — verify in application.",
        applicationRequired: true,
        approvalRequired: true,
        estimatedReviewTime: "Not published by vendor",
        publicOrPrivateProgram: PUBLIC_OR_PRIVATE.PUBLIC,
        programNotes:
            "Verified Weave affiliate page only. Do not assume Figma Design / FigJam general affiliate coverage without additional official confirmation.",
        verificationSource: "https://weave.figma.com/affiliate",
    }),
    catalogEntry({
        id: "notion-catalog",
        companyName: "Notion",
        officialWebsite: "https://www.notion.com/",
        category: CATALOG_CATEGORIES.CREATIVE_TOOLS,
        partnerType: PARTNER_TYPES.AFFILIATE,
        programStatus: PROGRAM_STATUSES.OPEN,
        allowedDomains: ["notion.com", "www.notion.com", "notion.so", "www.notion.so"],
        ftcDisclosureRequired: true,
        notes: "Prospect catalog entry. Runtime registry id `notion` remains disabled.",
        registryPartnerId: "notion",
        enrollmentProgramType: ENROLLMENT_PROGRAM_TYPES.AFFILIATE,
        officialProgramUrl: "https://www.notion.com/affiliates",
        eligibility:
            "Bloggers, educators, creators, community leaders, and similar publishers per Notion Affiliates page. Managed via PartnerStack.",
        countryRestrictions: "Not fully enumerated on affiliates page — verify in PartnerStack application.",
        applicationRequired: true,
        approvalRequired: true,
        estimatedReviewTime: "Not published by vendor",
        publicOrPrivateProgram: PUBLIC_OR_PRIVATE.PUBLIC,
        programNotes:
            "Official Notion Affiliates page requires FTC-compliant promotions. Runtime registry remains disabled; no affiliate IDs stored.",
        verificationSource: "https://www.notion.com/affiliates",
        programSpecificDisclosureRules:
            "Notion Affiliates FAQ requires FTC-compliant promotions for all affiliate relationships.",
    }),
    catalogEntry({
        id: "midjourney",
        companyName: "Midjourney",
        officialWebsite: "https://www.midjourney.com/",
        category: CATALOG_CATEGORIES.CREATIVE_TOOLS,
        partnerType: PARTNER_TYPES.AFFILIATE,
        programStatus: PROGRAM_STATUSES.NOT_AVAILABLE,
        allowedDomains: ["midjourney.com", "www.midjourney.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. Program availability may be invite/community gated.",
        enrollmentProgramType: ENROLLMENT_PROGRAM_TYPES.NONE,
        officialProgramUrl: null,
        eligibility: "No public Midjourney affiliate or referral-commission program page identified on official domains.",
        countryRestrictions: "n/a",
        applicationRequired: false,
        approvalRequired: false,
        estimatedReviewTime: "n/a",
        publicOrPrivateProgram: PUBLIC_OR_PRIVATE.UNKNOWN,
        programNotes:
            "No official Midjourney affiliate signup located during verification. Do not invent community Discord invites as an affiliate program.",
        verificationSource: "https://www.midjourney.com/",
    }),
    catalogEntry({
        id: "descript",
        companyName: "Descript",
        officialWebsite: "https://www.descript.com/",
        category: CATALOG_CATEGORIES.CREATIVE_TOOLS,
        partnerType: PARTNER_TYPES.AFFILIATE,
        programStatus: PROGRAM_STATUSES.OPEN,
        allowedDomains: ["descript.com", "www.descript.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. No application filed.",
        enrollmentProgramType: ENROLLMENT_PROGRAM_TYPES.AFFILIATE,
        officialProgramUrl: "https://www.descript.com/affiliate-terms",
        eligibility:
            "Applicants 18+ not in OFAC-sanctioned countries per Descript Affiliate Program Terms. Approval at Descript discretion; PartnerStack required for payment.",
        countryRestrictions: "OFAC-sanctioned countries excluded per affiliate terms.",
        applicationRequired: true,
        approvalRequired: true,
        estimatedReviewTime: "Not published by vendor",
        publicOrPrivateProgram: PUBLIC_OR_PRIVATE.PUBLIC,
        programNotes: "Official affiliate terms page confirms application + PartnerStack payment path.",
        verificationSource: "https://www.descript.com/affiliate-terms",
        programDocumentationUrl: "https://www.descript.com/affiliate-terms",
    }),

    // —— Developer Platforms ——
    catalogEntry({
        id: "github",
        companyName: "GitHub",
        officialWebsite: "https://github.com/",
        category: CATALOG_CATEGORIES.DEVELOPER_PLATFORMS,
        partnerType: PARTNER_TYPES.PARTNER,
        programStatus: PROGRAM_STATUSES.UNKNOWN,
        allowedDomains: ["github.com", "www.github.com", "github.blog"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. Evaluate partner / sponsorship options separately from ads.",
        enrollmentProgramType: ENROLLMENT_PROGRAM_TYPES.UNKNOWN,
        officialProgramUrl: null,
        eligibility: UNKNOWN_VERIFICATION_NOTE,
        countryRestrictions: UNKNOWN_VERIFICATION_NOTE,
        applicationRequired: null,
        approvalRequired: null,
        estimatedReviewTime: UNKNOWN_VERIFICATION_NOTE,
        publicOrPrivateProgram: PUBLIC_OR_PRIVATE.UNKNOWN,
        programNotes:
            "No single clear public creator-affiliate program confirmed on github.com during this pass. Enterprise/technology partner pathways may exist — keep UNKNOWN until an official apply URL is verified.",
        verificationSource: "https://github.com/",
        internalNotes: "Needs verification of partner.github.com / marketplace paths before applying.",
    }),
    catalogEntry({
        id: "vercel",
        companyName: "Vercel",
        officialWebsite: "https://vercel.com/",
        category: CATALOG_CATEGORIES.DEVELOPER_PLATFORMS,
        partnerType: PARTNER_TYPES.AFFILIATE,
        programStatus: PROGRAM_STATUSES.OPEN,
        allowedDomains: ["vercel.com", "www.vercel.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. No application filed. No commercial links.",
        enrollmentProgramType: ENROLLMENT_PROGRAM_TYPES.TECHNOLOGY_PARTNER,
        officialProgramUrl: "https://vercel.com/partners",
        eligibility:
            "Solution Partner, Technology Partner, or Marketplace Provider organizations via Vercel Partners apply flow. Not positioned as a consumer creator affiliate program.",
        countryRestrictions: "Not fully enumerated on partners page — verify in application.",
        applicationRequired: true,
        approvalRequired: true,
        estimatedReviewTime: "Not published by vendor",
        publicOrPrivateProgram: PUBLIC_OR_PRIVATE.PUBLIC,
        programNotes:
            "Official Partner Program (solution/technology/marketplace). Catalog partnerType remains affiliate historically but enrollment classification is technology partner until a separate public affiliate page is verified.",
        verificationSource: "https://vercel.com/partners",
    }),
    catalogEntry({
        id: "netlify",
        companyName: "Netlify",
        officialWebsite: "https://www.netlify.com/",
        category: CATALOG_CATEGORIES.DEVELOPER_PLATFORMS,
        partnerType: PARTNER_TYPES.AFFILIATE,
        programStatus: PROGRAM_STATUSES.OPEN,
        allowedDomains: ["netlify.com", "www.netlify.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. No application filed.",
        enrollmentProgramType: ENROLLMENT_PROGRAM_TYPES.AFFILIATE,
        officialProgramUrl: "https://www.netlify.com/partners/",
        eligibility:
            "Netlify Partners (Ecosystem / Certified) including creators, publishers, agencies, and technology partners. Application via PartnerStack form linked from partners page.",
        countryRestrictions: "Not fully enumerated — verify in PartnerStack application.",
        applicationRequired: true,
        approvalRequired: true,
        estimatedReviewTime: "Not published by vendor",
        publicOrPrivateProgram: PUBLIC_OR_PRIVATE.PUBLIC,
        programNotes:
            "Partners page describes revenue share for referring/building on Netlify. Also Technology Partner Program for integrations. No activation / IDs stored here.",
        verificationSource: "https://www.netlify.com/partners/",
        programDocumentationUrl: "https://www.netlify.com/partners/program-agreement/",
    }),
    catalogEntry({
        id: "replit",
        companyName: "Replit",
        officialWebsite: "https://replit.com/",
        category: CATALOG_CATEGORIES.DEVELOPER_PLATFORMS,
        partnerType: PARTNER_TYPES.AFFILIATE,
        programStatus: PROGRAM_STATUSES.UNKNOWN,
        allowedDomains: ["replit.com", "www.replit.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. No application filed.",
        enrollmentProgramType: ENROLLMENT_PROGRAM_TYPES.UNKNOWN,
        officialProgramUrl: null,
        eligibility: UNKNOWN_VERIFICATION_NOTE,
        countryRestrictions: UNKNOWN_VERIFICATION_NOTE,
        applicationRequired: null,
        approvalRequired: null,
        estimatedReviewTime: UNKNOWN_VERIFICATION_NOTE,
        publicOrPrivateProgram: PUBLIC_OR_PRIVATE.UNKNOWN,
        programNotes:
            "Partner-track mentions appear in secondary coverage; no single authoritative public Replit affiliate/partner apply URL confirmed in this verification pass.",
        verificationSource: "https://replit.com/",
    }),
    catalogEntry({
        id: "docker",
        companyName: "Docker",
        officialWebsite: "https://www.docker.com/",
        category: CATALOG_CATEGORIES.DEVELOPER_PLATFORMS,
        partnerType: PARTNER_TYPES.PARTNER,
        programStatus: PROGRAM_STATUSES.UNKNOWN,
        allowedDomains: ["docker.com", "www.docker.com", "hub.docker.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. No application filed.",
        enrollmentProgramType: ENROLLMENT_PROGRAM_TYPES.UNKNOWN,
        officialProgramUrl: null,
        eligibility: UNKNOWN_VERIFICATION_NOTE,
        countryRestrictions: UNKNOWN_VERIFICATION_NOTE,
        applicationRequired: null,
        approvalRequired: null,
        estimatedReviewTime: UNKNOWN_VERIFICATION_NOTE,
        publicOrPrivateProgram: PUBLIC_OR_PRIVATE.UNKNOWN,
        programNotes:
            "Technology/partner ecosystem likely; official public enrollment URL not confirmed in this pass — keep UNKNOWN.",
        verificationSource: "https://www.docker.com/",
    }),
    catalogEntry({
        id: "cloudflare-workers",
        companyName: "Cloudflare Developers",
        officialWebsite: "https://developers.cloudflare.com/",
        category: CATALOG_CATEGORIES.DEVELOPER_PLATFORMS,
        partnerType: PARTNER_TYPES.PARTNER,
        programStatus: PROGRAM_STATUSES.OPEN,
        allowedDomains: [
            "developers.cloudflare.com",
            "cloudflare.com",
            "www.cloudflare.com",
        ],
        ftcDisclosureRequired: true,
        notes: "Prospect only. Developer platform surface (Workers / Pages).",
        enrollmentProgramType: ENROLLMENT_PROGRAM_TYPES.TECHNOLOGY_PARTNER,
        officialProgramUrl: "https://www.cloudflare.com/partners/",
        eligibility:
            "Cloudflare partner ecosystem (agency/technology). Developer docs surface is research context; enrollment uses corporate partners program.",
        countryRestrictions: "Not fully enumerated on partners page — verify in application.",
        applicationRequired: true,
        approvalRequired: true,
        estimatedReviewTime: "Not published by vendor",
        publicOrPrivateProgram: PUBLIC_OR_PRIVATE.PUBLIC,
        programNotes:
            "Aligned with Cloudflare Partners page (same company as cloudflare catalog row). No separate Workers-only affiliate program verified.",
        verificationSource: "https://www.cloudflare.com/partners/",
    }),

    // —— Cloud Providers ——
    catalogEntry({
        id: "aws",
        companyName: "Amazon Web Services",
        officialWebsite: "https://aws.amazon.com/",
        category: CATALOG_CATEGORIES.CLOUD_PROVIDERS,
        partnerType: PARTNER_TYPES.PARTNER,
        programStatus: PROGRAM_STATUSES.OPEN,
        allowedDomains: ["aws.amazon.com", "amazon.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. Distinct from Amazon Associates retail shell.",
        enrollmentProgramType: ENROLLMENT_PROGRAM_TYPES.TECHNOLOGY_PARTNER,
        officialProgramUrl: "https://aws.amazon.com/partners/",
        eligibility:
            "Organizations joining AWS Partner Network via Partner Central. Marketplace sell/resell paths also documented. Distinct from Amazon Associates retail affiliate.",
        countryRestrictions: "Global APN with country-specific schedules — verify in Partner Central.",
        applicationRequired: true,
        approvalRequired: true,
        estimatedReviewTime: "Not published by vendor",
        publicOrPrivateProgram: PUBLIC_OR_PRIVATE.PUBLIC,
        programNotes:
            "APN + Marketplace confirmed on aws.amazon.com/partners. Do not conflate with Amazon Associates. No IDs stored.",
        verificationSource: "https://aws.amazon.com/partners/",
        programDocumentationUrl: "https://aws.amazon.com/marketplace/",
    }),
    catalogEntry({
        id: "google-cloud",
        companyName: "Google Cloud",
        officialWebsite: "https://cloud.google.com/",
        category: CATALOG_CATEGORIES.CLOUD_PROVIDERS,
        partnerType: PARTNER_TYPES.PARTNER,
        programStatus: PROGRAM_STATUSES.OPEN,
        allowedDomains: ["cloud.google.com", "google.com", "partners.cloud.google.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. No application filed.",
        enrollmentProgramType: ENROLLMENT_PROGRAM_TYPES.AFFILIATE,
        officialProgramUrl: "https://cloud.google.com/affiliate-program",
        eligibility:
            "Publisher affiliate program via CJ Affiliate for Google Cloud (official page states currently available for affiliates operating in the US and Canada). Separate Google Cloud Partner Network for services/technology partners.",
        countryRestrictions: "Affiliate program: US and Canada per official affiliate page.",
        applicationRequired: true,
        approvalRequired: true,
        estimatedReviewTime: "Not published by vendor",
        publicOrPrivateProgram: PUBLIC_OR_PRIVATE.PUBLIC,
        programNotes:
            "Primary publisher path: Google Cloud Affiliate Program. Partner Network remains available for org partnerships (partners.cloud.google.com). No activation.",
        verificationSource: "https://cloud.google.com/affiliate-program",
        programDocumentationUrl: "https://cloud.google.com/partners",
    }),
    catalogEntry({
        id: "microsoft-azure",
        companyName: "Microsoft Azure",
        officialWebsite: "https://azure.microsoft.com/",
        category: CATALOG_CATEGORIES.CLOUD_PROVIDERS,
        partnerType: PARTNER_TYPES.PARTNER,
        programStatus: PROGRAM_STATUSES.OPEN,
        allowedDomains: ["azure.microsoft.com", "microsoft.com", "www.microsoft.com", "partner.microsoft.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. No application filed.",
        enrollmentProgramType: ENROLLMENT_PROGRAM_TYPES.TECHNOLOGY_PARTNER,
        officialProgramUrl: "https://partner.microsoft.com/",
        eligibility:
            "Microsoft partner / marketplace ecosystem for organizations building or selling with Azure. Not verified as a consumer creator affiliate program in this pass.",
        countryRestrictions: "Partner Center regional rules — verify during enrollment.",
        applicationRequired: true,
        approvalRequired: true,
        estimatedReviewTime: "Not published by vendor",
        publicOrPrivateProgram: PUBLIC_OR_PRIVATE.PUBLIC,
        programNotes:
            "Classified as technology/enterprise partner pathway via Microsoft Partner Center. Marketplace may apply for ISVs. No affiliate IDs.",
        verificationSource: "https://partner.microsoft.com/",
    }),
    catalogEntry({
        id: "digitalocean",
        companyName: "DigitalOcean",
        officialWebsite: "https://www.digitalocean.com/",
        category: CATALOG_CATEGORIES.CLOUD_PROVIDERS,
        partnerType: PARTNER_TYPES.REFERRAL,
        programStatus: PROGRAM_STATUSES.OPEN,
        allowedDomains: ["digitalocean.com", "www.digitalocean.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. Referral programs common; none activated here.",
        enrollmentProgramType: ENROLLMENT_PROGRAM_TYPES.REFERRAL,
        officialProgramUrl: "https://www.digitalocean.com/partners/pod",
        eligibility:
            "DigitalOcean Partner Pod / Services partners (agencies, services, technology). Official services page documents referral fees for qualified partners after joining partner program.",
        countryRestrictions: "Not fully enumerated — verify in partner application portal.",
        applicationRequired: true,
        approvalRequired: true,
        estimatedReviewTime: "Not published by vendor",
        publicOrPrivateProgram: PUBLIC_OR_PRIVATE.PUBLIC,
        programNotes:
            "Partner Pod + Partner Services Program pages confirm referral/reseller economics for partners. No CinNova application filed; no referral IDs stored.",
        verificationSource: "https://www.digitalocean.com/partners/pod",
        programDocumentationUrl: "https://www.digitalocean.com/partners/services",
    }),
    catalogEntry({
        id: "cloudflare",
        companyName: "Cloudflare",
        officialWebsite: "https://www.cloudflare.com/",
        category: CATALOG_CATEGORIES.CLOUD_PROVIDERS,
        partnerType: PARTNER_TYPES.PARTNER,
        programStatus: PROGRAM_STATUSES.OPEN,
        allowedDomains: ["cloudflare.com", "www.cloudflare.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. Cloud / edge network surface.",
        enrollmentProgramType: ENROLLMENT_PROGRAM_TYPES.TECHNOLOGY_PARTNER,
        officialProgramUrl: "https://www.cloudflare.com/partners/",
        eligibility: "Cloudflare Partners program for agencies/technology partners.",
        countryRestrictions: "Not fully enumerated — verify in application.",
        applicationRequired: true,
        approvalRequired: true,
        estimatedReviewTime: "Not published by vendor",
        publicOrPrivateProgram: PUBLIC_OR_PRIVATE.PUBLIC,
        programNotes: "Official partners page confirmed. No consumer affiliate program verified in this pass.",
        verificationSource: "https://www.cloudflare.com/partners/",
    }),

    // —— Hardware Companies ——
    catalogEntry({
        id: "nvidia",
        companyName: "NVIDIA",
        officialWebsite: "https://www.nvidia.com/",
        category: CATALOG_CATEGORIES.HARDWARE_COMPANIES,
        partnerType: PARTNER_TYPES.PARTNER,
        programStatus: PROGRAM_STATUSES.OPEN,
        allowedDomains: ["nvidia.com", "www.nvidia.com", "developer.nvidia.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. No application filed. No commercial links.",
        enrollmentProgramType: ENROLLMENT_PROGRAM_TYPES.AFFILIATE,
        officialProgramUrl: "https://www.nvidia.com/en-us/affiliates/",
        eligibility:
            "NVIDIA Affiliate Program for publishers promoting nvidia.com products (Rakuten Marketing referenced on official affiliates page). Separate NVIDIA Partner Network is invitation-oriented for channel/technology partners.",
        countryRestrictions: "Affiliate network regional rules — verify in Rakuten/NVIDIA affiliate signup.",
        applicationRequired: true,
        approvalRequired: true,
        estimatedReviewTime: "Not published by vendor",
        publicOrPrivateProgram: PUBLIC_OR_PRIVATE.PUBLIC,
        programNotes:
            "Publisher affiliate page confirmed. NPN (https://www.nvidia.com/en-us/about-nvidia/partners/) is a distinct enterprise/channel program. No IDs stored.",
        verificationSource: "https://www.nvidia.com/en-us/affiliates/",
        programDocumentationUrl: "https://www.nvidia.com/en-us/about-nvidia/partners/",
    }),
    catalogEntry({
        id: "apple",
        companyName: "Apple",
        officialWebsite: "https://www.apple.com/",
        category: CATALOG_CATEGORIES.HARDWARE_COMPANIES,
        partnerType: PARTNER_TYPES.AFFILIATE,
        programStatus: PROGRAM_STATUSES.INVITE_ONLY,
        allowedDomains: [
            "apple.com",
            "www.apple.com",
            "performance-partners.apple.com",
            "partners.marketingtools.apple.com",
        ],
        ftcDisclosureRequired: true,
        notes: "Prospect only. No application filed.",
        enrollmentProgramType: ENROLLMENT_PROGRAM_TYPES.AFFILIATE,
        officialProgramUrl: "https://performance-partners.apple.com/home",
        eligibility:
            "Apple Services Performance Partner Program for websites/apps linking to Apple Services content. Official pages state limited acceptance / invitation or media-store content partners.",
        countryRestrictions: "Program terms via Partnerize — verify during application if invited.",
        applicationRequired: true,
        approvalRequired: true,
        estimatedReviewTime: "Not published by vendor",
        publicOrPrivateProgram: PUBLIC_OR_PRIVATE.PRIVATE,
        programNotes:
            "Official Performance Partners site confirms limited partner acceptance. Not an open self-serve hardware Associates clone. No tokens/IDs stored.",
        verificationSource: "https://performance-partners.apple.com/home",
        programDocumentationUrl: "https://partners.marketingtools.apple.com/",
    }),
    catalogEntry({
        id: "framework",
        companyName: "Framework",
        officialWebsite: "https://frame.work/",
        category: CATALOG_CATEGORIES.HARDWARE_COMPANIES,
        partnerType: PARTNER_TYPES.AFFILIATE,
        programStatus: PROGRAM_STATUSES.NOT_AVAILABLE,
        allowedDomains: ["frame.work", "www.frame.work"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. No application filed.",
        enrollmentProgramType: ENROLLMENT_PROGRAM_TYPES.NONE,
        officialProgramUrl: null,
        eligibility:
            "Framework staff stated on the official community forum that an affiliate program is not available. Sponsorships / ambassador pilots are not commission affiliate programs.",
        countryRestrictions: "n/a",
        applicationRequired: false,
        approvalRequired: false,
        estimatedReviewTime: "n/a",
        publicOrPrivateProgram: PUBLIC_OR_PRIVATE.UNKNOWN,
        programNotes:
            "No public affiliate URL (frame.work/affiliate 404). Community staff response: no affiliate program available. Do not invent one.",
        verificationSource: "https://community.frame.work/t/responded-affiliate-program/27910",
        programDocumentationUrl: "https://frame.work/ch/en/blog/framework-sponsorships",
    }),
    catalogEntry({
        id: "raspberry-pi",
        companyName: "Raspberry Pi",
        officialWebsite: "https://www.raspberrypi.com/",
        category: CATALOG_CATEGORIES.HARDWARE_COMPANIES,
        partnerType: PARTNER_TYPES.AFFILIATE,
        programStatus: PROGRAM_STATUSES.UNKNOWN,
        allowedDomains: ["raspberrypi.com", "www.raspberrypi.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. No application filed.",
        enrollmentProgramType: ENROLLMENT_PROGRAM_TYPES.UNKNOWN,
        officialProgramUrl: null,
        eligibility: UNKNOWN_VERIFICATION_NOTE,
        countryRestrictions: UNKNOWN_VERIFICATION_NOTE,
        applicationRequired: null,
        approvalRequired: null,
        estimatedReviewTime: UNKNOWN_VERIFICATION_NOTE,
        publicOrPrivateProgram: PUBLIC_OR_PRIVATE.UNKNOWN,
        programNotes:
            "Approved reseller networks are common for Raspberry Pi, but a public creator affiliate program was not confirmed on raspberrypi.com in this pass. Keep UNKNOWN rather than inventing reseller enrollment rules.",
        verificationSource: "https://www.raspberrypi.com/",
    }),
    catalogEntry({
        id: "logitech",
        companyName: "Logitech",
        officialWebsite: "https://www.logitech.com/",
        category: CATALOG_CATEGORIES.HARDWARE_COMPANIES,
        partnerType: PARTNER_TYPES.AFFILIATE,
        programStatus: PROGRAM_STATUSES.OPEN,
        allowedDomains: ["logitech.com", "www.logitech.com", "info.logitech.com"],
        ftcDisclosureRequired: true,
        notes: "Prospect only. No application filed.",
        enrollmentProgramType: ENROLLMENT_PROGRAM_TYPES.RESELLER,
        officialProgramUrl: "https://info.logitech.com/globalpartnerconnect",
        eligibility:
            "Logitech Partner Connect Program for B2B resellers (Premier/Elite/Principal tracks). Not verified as a consumer creator affiliate program on official pages in this pass.",
        countryRestrictions: "Partner Connect regional rules — verify with Logitech channel materials.",
        applicationRequired: true,
        approvalRequired: true,
        estimatedReviewTime: "Not published by vendor",
        publicOrPrivateProgram: PUBLIC_OR_PRIVATE.PUBLIC,
        programNotes:
            "Official Partner Connect materials confirm reseller/channel program. Do not invent a consumer Impact affiliate enrollment without an official Logitech consumer-affiliate page.",
        verificationSource: "https://info.logitech.com/globalpartnerconnect",
        programDocumentationUrl:
            "https://www.logitech.com/content/dam/logitech/en_us/business/pdf/logitech-partner-connect-program-guide.pdf",
    }),
]);

const byId = new Map(PARTNER_CATALOG.map((entry) => [entry.id, entry]));

export function listPartnerCatalog() {
    return PARTNER_CATALOG.slice();
}

export function getPartnerCatalogEntry(id) {
    if (id == null) return null;
    return byId.get(String(id)) || null;
}

export function listPartnerCatalogByCategory(category) {
    return PARTNER_CATALOG.filter((entry) => entry.category === category);
}

export function listPartnerCatalogByApplicationStatus(status) {
    return PARTNER_CATALOG.filter((entry) => entry.applicationStatus === status);
}

export function listPartnerCatalogByVerificationBucket(bucket) {
    return PARTNER_CATALOG.filter((entry) => entry.verificationBucket === bucket);
}

export function listPartnerCatalogByEnrollmentProgramType(type) {
    return PARTNER_CATALOG.filter((entry) => entry.enrollmentProgramType === type);
}

/**
 * Validate a single catalog record (structure only; no network I/O).
 * @param {PartnerCatalogRecord} entry
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function validatePartnerCatalogEntry(entry) {
    const errors = [];
    if (!entry || typeof entry !== "object") {
        return { ok: false, errors: ["Catalog entry is missing"] };
    }
    if (!entry.id || typeof entry.id !== "string") errors.push("id is required");
    if (!entry.companyName || typeof entry.companyName !== "string") {
        errors.push("companyName is required");
    }
    if (!isCatalogCategory(entry.category)) errors.push("category is invalid");
    if (!isPartnerType(entry.partnerType)) errors.push("partnerType is invalid");
    if (!isProgramStatus(entry.programStatus)) errors.push("programStatus is invalid");
    if (!isApplicationStatus(entry.applicationStatus)) {
        errors.push("applicationStatus is invalid");
    }
    if (!isApprovalStatus(entry.approvalStatus)) errors.push("approvalStatus is invalid");
    if (!isActivationStatus(entry.activationStatus)) {
        errors.push("activationStatus is invalid");
    }
    if (!Array.isArray(entry.allowedDomains) || entry.allowedDomains.length === 0) {
        errors.push("allowedDomains must be a non-empty array");
    }
    if (typeof entry.ftcDisclosureRequired !== "boolean") {
        errors.push("ftcDisclosureRequired must be boolean");
    }
    if (typeof entry.notes !== "string") errors.push("notes must be a string");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(entry.lastReviewed || ""))) {
        errors.push("lastReviewed must be YYYY-MM-DD");
    }
    if (entry.affiliateId != null) errors.push("affiliateId must be null (no IDs in catalog)");
    if (entry.referralId != null) errors.push("referralId must be null (no IDs in catalog)");

    if (!isEnrollmentProgramType(entry.enrollmentProgramType)) {
        errors.push("enrollmentProgramType is invalid");
    }
    if (!isPublicOrPrivate(entry.publicOrPrivateProgram)) {
        errors.push("publicOrPrivateProgram is invalid");
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(entry.lastVerifiedDate || ""))) {
        errors.push("lastVerifiedDate must be YYYY-MM-DD");
    }
    if (typeof entry.verificationSource !== "string" || !entry.verificationSource) {
        errors.push("verificationSource is required");
    }
    if (typeof entry.eligibility !== "string") errors.push("eligibility must be a string");
    if (typeof entry.countryRestrictions !== "string") {
        errors.push("countryRestrictions must be a string");
    }
    if (typeof entry.estimatedReviewTime !== "string") {
        errors.push("estimatedReviewTime must be a string");
    }
    if (
        entry.applicationRequired !== null &&
        typeof entry.applicationRequired !== "boolean"
    ) {
        errors.push("applicationRequired must be boolean or null");
    }
    if (entry.approvalRequired !== null && typeof entry.approvalRequired !== "boolean") {
        errors.push("approvalRequired must be boolean or null");
    }
    if (entry.applicationDate != null) {
        errors.push("applicationDate must remain null until a real application is filed");
    }
    if (entry.approvalDate != null) {
        errors.push("approvalDate must remain null until a real approval is recorded");
    }
    if (entry.affiliateId != null || entry.referralId != null) {
        errors.push("commercial IDs must remain null");
    }

    if (entry.enrollmentProgramType === ENROLLMENT_PROGRAM_TYPES.UNKNOWN) {
        if (
            entry.eligibility !== UNKNOWN_VERIFICATION_NOTE &&
            !String(entry.eligibility).includes("UNKNOWN")
        ) {
            // Allow longer notes that still mark unknown; soft check via program type only.
        }
    }

    if (entry.officialProgramUrl) {
        const programUrl = validateHttpsUrl(entry.officialProgramUrl);
        if (!programUrl.ok) {
            errors.push(`officialProgramUrl invalid: ${programUrl.errors.join("; ")}`);
        }
    } else if (
        ![ENROLLMENT_PROGRAM_TYPES.NONE, ENROLLMENT_PROGRAM_TYPES.UNKNOWN].includes(
            entry.enrollmentProgramType,
        )
    ) {
        errors.push("officialProgramUrl required when a public program type is classified");
    }

    if (entry.programDocumentationUrl) {
        const docsUrl = validateHttpsUrl(entry.programDocumentationUrl);
        if (!docsUrl.ok) {
            errors.push(`programDocumentationUrl invalid: ${docsUrl.errors.join("; ")}`);
        }
    }

    const website = validateHttpsUrl(entry.officialWebsite);
    if (!website.ok) {
        errors.push(`officialWebsite invalid: ${website.errors.join("; ")}`);
    } else if (website.url) {
        const host = website.url.hostname.toLowerCase();
        const allowed = (entry.allowedDomains || []).map((d) => String(d).toLowerCase());
        const hostOk = allowed.some(
            (domain) => host === domain || host.endsWith(`.${domain}`),
        );
        if (!hostOk) {
            errors.push("officialWebsite host must match allowedDomains");
        }
    }

    // Safety: catalog must not silently activate anyone.
    if (entry.activationStatus === ACTIVATION_STATUSES.ACTIVE) {
        errors.push("activationStatus must not be active in Phase 11.4D catalog");
    }
    if (entry.applicationStatus !== APPLICATION_STATUSES.NOT_STARTED) {
        errors.push("applicationStatus must remain not_started until a real application");
    }
    if (entry.approvalStatus === APPROVAL_STATUSES.APPROVED) {
        errors.push("approvalStatus must not be approved without a verified enrollment");
    }

    // Do not invent review timelines.
    if (/^\d+\s*(day|days|week|weeks|business)/i.test(String(entry.estimatedReviewTime || ""))) {
        errors.push("estimatedReviewTime must not invent numeric vendor SLAs");
    }

    return { ok: errors.length === 0, errors };
}

/**
 * @param {ReadonlyArray<PartnerCatalogRecord>} [entries]
 * @returns {{ ok: boolean, errors: string[], byId: Record<string, string[]> }}
 */
export function validatePartnerCatalog(entries = PARTNER_CATALOG) {
    const byIdErrors = {};
    const errors = [];
    const seen = new Set();

    for (const entry of entries) {
        if (seen.has(entry.id)) {
            errors.push(`Duplicate catalog id: ${entry.id}`);
        }
        seen.add(entry.id);
        const result = validatePartnerCatalogEntry(entry);
        if (!result.ok) {
            byIdErrors[entry.id] = result.errors;
            errors.push(...result.errors.map((e) => `${entry.id}: ${e}`));
        }
    }

    return { ok: errors.length === 0, errors, byId: byIdErrors };
}
