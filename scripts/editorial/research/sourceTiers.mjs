/**
 * CinNova editorial source authority tiers (Phase 2).
 *
 * Canonical tiers (preferred in new registry entries):
 *   TIER_1_PRIMARY      — official government / company / research primary
 *   TIER_1_NEWS         — major wire / highly reputable newsroom
 *   TIER_2_REPUTABLE    — established specialty publication
 *   TIER_3_DISCOVERY_ONLY — discovery aid; cannot independently qualify
 *   BLOCKED             — untrusted / cannot ingest
 *
 * Legacy aliases remain accepted for fixtures and older packets:
 *   TIER_2_HIGH_AUTHORITY      → TIER_1_NEWS
 *   TIER_3_REPUTABLE_SECONDARY → TIER_2_REPUTABLE
 *   TIER_4_DISCOVERY_ONLY      → TIER_3_DISCOVERY_ONLY
 */

export const SOURCE_TIERS = Object.freeze({
    TIER_1_PRIMARY: "TIER_1_PRIMARY",
    TIER_1_NEWS: "TIER_1_NEWS",
    TIER_2_REPUTABLE: "TIER_2_REPUTABLE",
    TIER_3_DISCOVERY_ONLY: "TIER_3_DISCOVERY_ONLY",
    BLOCKED: "BLOCKED",
});

const LEGACY_ALIASES = Object.freeze({
    TIER_2_HIGH_AUTHORITY: SOURCE_TIERS.TIER_1_NEWS,
    TIER_3_REPUTABLE_SECONDARY: SOURCE_TIERS.TIER_2_REPUTABLE,
    TIER_4_DISCOVERY_ONLY: SOURCE_TIERS.TIER_3_DISCOVERY_ONLY,
});

export const TIER_RANK = Object.freeze({
    [SOURCE_TIERS.TIER_1_PRIMARY]: 5,
    [SOURCE_TIERS.TIER_1_NEWS]: 4,
    [SOURCE_TIERS.TIER_2_REPUTABLE]: 3,
    [SOURCE_TIERS.TIER_3_DISCOVERY_ONLY]: 1,
    [SOURCE_TIERS.BLOCKED]: 0,
    // legacy keys
    TIER_2_HIGH_AUTHORITY: 4,
    TIER_3_REPUTABLE_SECONDARY: 3,
    TIER_4_DISCOVERY_ONLY: 1,
});

/** Tiers that may participate in corroboration counting. */
export const CORROBORATION_ELIGIBLE_TIERS = Object.freeze([
    SOURCE_TIERS.TIER_1_PRIMARY,
    SOURCE_TIERS.TIER_1_NEWS,
    SOURCE_TIERS.TIER_2_REPUTABLE,
    "TIER_2_HIGH_AUTHORITY",
    "TIER_3_REPUTABLE_SECONDARY",
]);

export function canonicalizeTier(tier = "") {
    const raw = String(tier || "").trim();
    if (!raw) return "";
    if (LEGACY_ALIASES[raw]) return LEGACY_ALIASES[raw];
    return raw;
}

export function isCorroborationEligibleTier(tier = "") {
    const canonical = canonicalizeTier(tier);
    return (
        canonical === SOURCE_TIERS.TIER_1_PRIMARY
        || canonical === SOURCE_TIERS.TIER_1_NEWS
        || canonical === SOURCE_TIERS.TIER_2_REPUTABLE
    );
}

export function isPrimaryTier(tier = "") {
    return canonicalizeTier(tier) === SOURCE_TIERS.TIER_1_PRIMARY;
}

export function isNewsTier(tier = "") {
    return canonicalizeTier(tier) === SOURCE_TIERS.TIER_1_NEWS;
}

export function isDiscoveryOnlyTier(tier = "") {
    const canonical = canonicalizeTier(tier);
    return canonical === SOURCE_TIERS.TIER_3_DISCOVERY_ONLY || canonical === SOURCE_TIERS.BLOCKED;
}

export function isBlockedTier(tier = "") {
    return canonicalizeTier(tier) === SOURCE_TIERS.BLOCKED;
}

/**
 * Publication gate preference (documentation + helpers; does not auto-publish):
 * A. 1 authoritative primary + 1 independent reputable (news or specialty)
 * B. 2 independent Tier-1-news / Tier-2-reputable sources
 * C. Solo allowlisted primary → research qualify / REVIEW path only (never auto-publish)
 */
export function describePublicationGatePolicy() {
    return {
        preferred: [
            "1 authoritative primary + 1 independent reputable source",
            "2 independent Tier-1-news / Tier-2-reputable sources",
        ],
        soloPrimary: "May research-qualify and reach REVIEW when allowlisted; never automatic publication",
        never: [
            "one weak / discovery-only source",
            "syndicated copies counted as independent",
            "press-release mirrors counted as independent",
            "BLOCKED or fabricated sources",
        ],
    };
}
