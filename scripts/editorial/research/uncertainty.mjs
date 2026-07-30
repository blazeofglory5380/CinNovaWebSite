/**
 * Phase 10B.3 — uncertainty classification and evidence-backed resolution.
 * Never silently delete unresolved uncertainties.
 */

export const UNCERTAINTY_CATEGORIES = Object.freeze([
    "DATE",
    "SCOPE",
    "IMPACT",
    "WHO_IS_AFFECTED",
    "PRODUCT_VERSION",
    "REGULATORY_STATUS",
    "QUOTE_ATTRIBUTION",
    "NUMERIC_CLAIM",
    "CAUSAL_CLAIM",
    "OTHER",
]);

const CATEGORY_PATTERNS = [
    ["DATE", /\b(date|when|timeline|deadline|effective|publishedAt|as of)\b/i],
    ["PRODUCT_VERSION", /\b(version|firmware|release|product line|CVE-)\b/i],
    ["REGULATORY_STATUS", /\b(mandate|required|directive|BOD|regulation|enforce|SBOM)\b/i],
    ["NUMERIC_CLAIM", /\b(\d+%|\d{1,3}(?:,\d{3})+|million|billion|count|number of)\b/i],
    ["QUOTE_ATTRIBUTION", /\b(said|according to|quoted|statement|spokesperson)\b/i],
    ["CAUSAL_CLAIM", /\b(because|caused|led to|due to|resulting in)\b/i],
    ["IMPACT", /\b(impact|severity|consequence|disruption|outage)\b/i],
    ["SCOPE", /\b(scope|applies to|coverage|jurisdiction|who must|which systems)\b/i],
    ["WHO_IS_AFFECTED", /\b(who is affected|affected (?:agencies|vendors|operators|customers|organizations)|customers|agencies|vendors|operators)\b/i],
];

export function classifyUncertainty(text = "") {
    const value = String(text || "").trim();
    if (!value) {
        return { category: "OTHER", text: "", classified: false };
    }
    for (const [category, pattern] of CATEGORY_PATTERNS) {
        if (pattern.test(value)) {
            return { category, text: value, classified: true };
        }
    }
    if (/fact-check|contextual review|source-derived/i.test(value)) {
        return { category: "OTHER", text: value, classified: true, boilerplate: true };
    }
    return { category: "OTHER", text: value, classified: true };
}

/**
 * Attempt to resolve uncertainties using claimEvidence + corroboration.
 * Boilerplate "all claims require fact-check" may resolve only when enrichment
 * produced verified claim evidence and no conflicts remain.
 */
export function resolveUncertainties({
    uncertainties = [],
    claimEvidence = [],
    conflicts = [],
    independentCount = 0,
} = {}) {
    const resolved = [];
    const remaining = [];

    const consequentialOpen = claimEvidence.filter(
        (claim) =>
            claim.consequential &&
            !["VERIFIED_PRIMARY", "VERIFIED_MULTI_SOURCE"].includes(claim.status),
    );
    const hasConflict = conflicts.length > 0 || claimEvidence.some((claim) => claim.status === "CONFLICTING");

    for (const raw of uncertainties) {
        const classified = classifyUncertainty(raw);
        const entry = {
            text: classified.text || String(raw),
            category: classified.category,
            boilerplate: Boolean(classified.boilerplate),
        };

        if (entry.boilerplate) {
            if (!hasConflict && consequentialOpen.length === 0 && independentCount >= 2 && claimEvidence.length > 0) {
                resolved.push({
                    ...entry,
                    resolution: "Replaced by claimEvidence map with verified consequential claims and independent corroboration.",
                    evidenceRefs: claimEvidence
                        .filter((claim) => ["VERIFIED_PRIMARY", "VERIFIED_MULTI_SOURCE"].includes(claim.status))
                        .map((claim) => claim.claimId),
                });
                continue;
            }
            remaining.push({
                ...entry,
                reason: hasConflict
                    ? "Conflicts remain"
                    : consequentialOpen.length
                      ? "Consequential claims still unverified"
                      : independentCount < 2
                        ? "Independent corroboration insufficient"
                        : "Claim evidence incomplete",
            });
            continue;
        }

        // Specific uncertainties: resolve only when a matching verified claim exists.
        const related = claimEvidence.find((claim) => {
            if (!["VERIFIED_PRIMARY", "VERIFIED_MULTI_SOURCE"].includes(claim.status)) return false;
            if (entry.category === "DATE" && /\b20\d{2}|deadline|effective/i.test(claim.claimText)) return true;
            if (entry.category === "REGULATORY_STATUS" && /require|mandate|BOD|SBOM|directive/i.test(claim.claimText)) return true;
            if (entry.category === "PRODUCT_VERSION" && /CVE-|version|advisory/i.test(claim.claimText)) return true;
            if (entry.category === "WHO_IS_AFFECTED" && /agency|vendor|operator|organization/i.test(claim.claimText)) return true;
            return claim.claimText.toLowerCase().includes(entry.text.toLowerCase().slice(0, 24));
        });

        if (related && !hasConflict) {
            resolved.push({
                ...entry,
                resolution: `Supported by ${related.status} claim ${related.claimId}`,
                evidenceRefs: [related.claimId],
            });
        } else {
            remaining.push({
                ...entry,
                reason: hasConflict ? "Conflict blocks resolution" : "No verified claim evidence attached",
            });
        }
    }

    return { resolvedUncertainties: resolved, remainingUncertainties: remaining };
}

/** Seed uncertainties for an enriched packet before resolution. */
export function seedUncertaintiesFromClaims(claimEvidence = []) {
    const seeds = [];
    for (const claim of claimEvidence) {
        if (claim.status === "CONFLICTING") {
            seeds.push(`Conflicting evidence for: ${claim.claimText.slice(0, 140)}`);
        } else if (claim.consequential && claim.status !== "VERIFIED_MULTI_SOURCE" && claim.status !== "VERIFIED_PRIMARY") {
            seeds.push(`Unresolved consequential claim (${claim.status}): ${claim.claimText.slice(0, 140)}`);
        }
    }
    // Do not re-insert the old unconditional boilerplate. Empty seeds mean
    // claimEvidence already covers the event or there is nothing specific to hold on.
    return seeds;
}
