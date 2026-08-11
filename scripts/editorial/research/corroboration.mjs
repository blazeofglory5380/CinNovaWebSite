import { areLikelySyndicated } from "./syndication.mjs";
import { filterIndependentSources } from "./independence.mjs";
import {
    isCorroborationEligibleTier,
    isPrimaryTier,
    canonicalizeTier,
    SOURCE_TIERS,
} from "./sourceTiers.mjs";

/**
 * Corroboration gate (does not publish).
 *
 * Preferred:
 *  A. 1 authoritative primary + 1 independent reputable (news/specialty)
 *  B. 2 independent Tier-1-news / Tier-2-reputable sources
 *
 * Solo allowlisted primary (requiresSecondaryConfirmation === false):
 *  research-qualifies as corroborated for discovery selection, but Phase 10A
 *  fact-check still blocks automatic publication (REVIEW/HOLD as warranted).
 */
export function assessCorroboration(cluster, registry = []) {
    const sourceDefinition = (candidate) => registry.find((source) => source.id === candidate.sourceId);
    const eligible = (cluster.sources || []).filter((candidate) =>
        isCorroborationEligibleTier(candidate.sourceTier));

    const filtered = filterIndependentSources(eligible, { registry });
    const independent = filtered.independent;

    // Path A/B: two+ independent eligible sources.
    if (independent.length >= 2) {
        const hasPrimary = independent.some((item) => isPrimaryTier(item.sourceTier));
        const hasNewsOrSpecialty = independent.some((item) => {
            const tier = canonicalizeTier(item.sourceTier);
            return tier === SOURCE_TIERS.TIER_1_NEWS || tier === SOURCE_TIERS.TIER_2_REPUTABLE;
        });
        const path =
            hasPrimary && hasNewsOrSpecialty
                ? "primary+independent"
                : "two-independent-reputable";
        return {
            corroborated: true,
            path,
            rationale: `Confirmed by ${independent.length} independent corroboration-eligible sources (${path}) after syndication/independence filtering.`,
            independentSourceIds: independent.map((item) => item.sourceId),
            rejectedIndependence: filtered.rejected,
        };
    }

    // Path C: solo allowlisted primary — research qualify only.
    const soloPrimary = independent.find((candidate) => {
        const definition = sourceDefinition(candidate);
        return (
            isPrimaryTier(candidate.sourceTier)
            && definition?.requiresSecondaryConfirmation === false
        );
    });

    if (soloPrimary) {
        return {
            corroborated: true,
            path: "solo-allowlisted-primary",
            rationale: `${soloPrimary.sourceName} is an allowlisted Tier-1 primary that may research-qualify alone; Phase 10A may still HOLD/REVIEW and never auto-publishes.`,
            independentSourceIds: [soloPrimary.sourceId],
            rejectedIndependence: filtered.rejected,
        };
    }

    // Path C-news: solo Tier-1 newsroom may research-qualify so enrichment can seek a secondary.
    // READY still requires ≥2 sources at Phase 10A — this does not weaken publication gates.
    // Do not solo-qualify when the cluster only collapsed to one source via syndication filtering.
    const distinctSourceIds = new Set((cluster.sources || []).map((item) => item.sourceId).filter(Boolean));
    const soloNews = independent.find((candidate) => {
        const tier = canonicalizeTier(candidate.sourceTier);
        return tier === SOURCE_TIERS.TIER_1_NEWS;
    });
    if (soloNews && distinctSourceIds.size === 1) {
        return {
            corroborated: true,
            path: "solo-tier1-news-research",
            rationale: `${soloNews.sourceName} is a Tier-1 newsroom that may research-qualify alone; enrichment should seek an independent secondary before READY.`,
            independentSourceIds: [soloNews.sourceId],
            rejectedIndependence: filtered.rejected,
        };
    }

    // Company primary alone (requires secondary) does not qualify.
    const companyPrimary = eligible.find((candidate) => {
        const definition = sourceDefinition(candidate);
        return (
            isPrimaryTier(candidate.sourceTier)
            && definition?.requiresSecondaryConfirmation === true
        );
    });

    return {
        corroborated: false,
        path: null,
        rationale: companyPrimary
            ? `${companyPrimary.sourceName} is a company/primary source that requires an independent reputable secondary; none found after independence filtering.`
            : "Needs two independent corroboration-eligible sources, or one allowlisted official primary; discovery-only and syndicated copies do not count.",
        independentSourceIds: independent.map((item) => item.sourceId),
        rejectedIndependence: filtered.rejected,
    };
}
