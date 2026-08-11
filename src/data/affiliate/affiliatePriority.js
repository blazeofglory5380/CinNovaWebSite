/**
 * Phase M2 — prioritized affiliate application list.
 * Only companies with a verifiable official program URL from the prospect catalog.
 * Does NOT imply CinNova is partnered.
 */

import { listPartnerCatalog } from "./partnerCatalog.js";
import { ENROLLMENT_PROGRAM_TYPES } from "./enrollmentProgramTypes.js";

export const AFFILIATE_PRIORITY = Object.freeze({
    HIGH: "HIGH_PRIORITY",
    MEDIUM: "MEDIUM_PRIORITY",
    LOW: "LOW_PRIORITY",
    NO_VERIFIED_PROGRAM: "NO_VERIFIED_PROGRAM",
});

/** Content-fit scoring for CinNova (guides, design, video, productivity, hosting). */
const HIGH_IDS = new Set([
    "adobe",
    "notion-catalog",
    "runway",
    "elevenlabs",
    "figma",
]);

const MEDIUM_IDS = new Set([
    "digitalocean",
    "canva-catalog", // verified program but applications currently closed
    "descript",
    "replit",
    "vercel",
    "netlify",
]);

const CREATOR_AFFILIATE = ENROLLMENT_PROGRAM_TYPES.CREATOR_AFFILIATE;

export function buildAffiliatePriorityList() {
    const catalog = listPartnerCatalog();
    return catalog.map((entry) => {
        const hasVerifiedUrl = Boolean(entry.officialProgramUrl || entry.verificationSource);
        let priority = AFFILIATE_PRIORITY.NO_VERIFIED_PROGRAM;
        let rationale = "No verified public affiliate/referral program URL in catalog.";

        if (hasVerifiedUrl) {
            if (HIGH_IDS.has(entry.id)) {
                priority = AFFILIATE_PRIORITY.HIGH;
                rationale =
                    "Verified creator/affiliate program + strong fit for CinNova tutorials/tools content.";
            } else if (MEDIUM_IDS.has(entry.id)) {
                priority = AFFILIATE_PRIORITY.MEDIUM;
                rationale =
                    entry.id === "canva-catalog"
                        ? "Verified Canva affiliate pathway exists but applications currently closed — monitor only."
                        : "Verified program + moderate content fit (hosting/dev/creator tools).";
            } else if (
                entry.enrollmentProgramType === CREATOR_AFFILIATE
                || entry.applicationReady
            ) {
                priority = AFFILIATE_PRIORITY.LOW;
                rationale = "Verified or application-ready program with lower immediate content fit.";
            } else {
                priority = AFFILIATE_PRIORITY.LOW;
                rationale =
                    "Official partner/program URL exists but may be non-commission or enterprise-only — classify carefully before applying.";
            }
        }

        return Object.freeze({
            catalogId: entry.id,
            company: entry.companyName,
            priority,
            officialProgramUrl: entry.officialProgramUrl || null,
            verificationSource: entry.verificationSource || null,
            enrollmentProgramType: entry.enrollmentProgramType,
            applicationReady: Boolean(entry.applicationReady),
            applicationsClosedNote: entry.id === "canva-catalog" ? "Applications currently closed per Canva Help Center." : null,
            partnershipImplied: false,
            rationale,
        });
    });
}

export function groupAffiliatePriorities(list = buildAffiliatePriorityList()) {
    const groups = {
        [AFFILIATE_PRIORITY.HIGH]: [],
        [AFFILIATE_PRIORITY.MEDIUM]: [],
        [AFFILIATE_PRIORITY.LOW]: [],
        [AFFILIATE_PRIORITY.NO_VERIFIED_PROGRAM]: [],
    };
    for (const row of list) {
        groups[row.priority].push(row);
    }
    return groups;
}
