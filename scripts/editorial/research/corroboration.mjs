import { areLikelySyndicated } from "./syndication.mjs";

export function assessCorroboration(cluster, registry = []) {
    const sourceDefinition = (candidate) => registry.find((source) => source.id === candidate.sourceId);
    const eligible = (cluster.sources || []).filter((candidate) =>
        ["TIER_1_PRIMARY", "TIER_2_HIGH_AUTHORITY", "TIER_3_REPUTABLE_SECONDARY"].includes(candidate.sourceTier));
    const soloPrimary = eligible.find((candidate) => {
        const definition = sourceDefinition(candidate);
        return candidate.sourceTier === "TIER_1_PRIMARY" && definition?.requiresSecondaryConfirmation === false;
    });

    if (soloPrimary) {
        return {
            corroborated: true,
            rationale: `${soloPrimary.sourceName} is a direct Tier 1 primary source permitted to qualify its own announcement.`,
            independentSourceIds: [soloPrimary.sourceId],
        };
    }

    const independent = [];
    for (const candidate of eligible) {
        if (independent.some((other) => other.sourceId === candidate.sourceId || areLikelySyndicated(other, candidate))) continue;
        independent.push(candidate);
    }
    const corroborated = independent.length >= 2;
    return {
        corroborated,
        rationale: corroborated
            ? `Confirmed by ${independent.length} independent Tier 1–3 sources after syndication filtering.`
            : "Needs two independent Tier 1–3 sources; Tier 4 and syndicated copies do not count.",
        independentSourceIds: independent.map((candidate) => candidate.sourceId),
    };
}
