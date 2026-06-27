import { lookupSpeciesRisk } from "../speciesCatalog.js";

export function assessRiskLevel(topMatch) {
    const species = topMatch?.species || "Unknown";
    const lookup = lookupSpeciesRisk(species);

    return {
        riskLevel: lookup.riskLevel,
        riskCategory: lookup.category,
        riskMatchedKey: lookup.matchedKey,
        riskNotes: lookup.notes || null,
        aiSpecies: species,
        confidence: topMatch?.confidence ?? 0,
    };
}
