/**
 * Reference species metadata for risk assessment after vision inference.
 * Extend this catalog as the PoisonGuard hazard database grows.
 */
export const speciesCatalog = {
    "domestic cat": { riskLevel: "moderate", category: "pet" },
    "domestic dog": { riskLevel: "moderate", category: "pet" },
    "lily": { riskLevel: "severe", category: "plant", notes: "Highly toxic to cats" },
    "sago palm": { riskLevel: "severe", category: "plant", notes: "Toxic to dogs and cats" },
    "oleander": { riskLevel: "severe", category: "plant" },
    "philodendron": { riskLevel: "high", category: "plant" },
    "pothos": { riskLevel: "high", category: "plant" },
    "dieffenbachia": { riskLevel: "high", category: "plant" },
    "azalea": { riskLevel: "high", category: "plant" },
    "rhododendron": { riskLevel: "high", category: "plant" },
    "chocolate": { riskLevel: "high", category: "substance", notes: "Toxic to dogs" },
    "grape": { riskLevel: "high", category: "substance", notes: "Toxic to dogs" },
    "xylitol": { riskLevel: "severe", category: "substance" },
    "unknown plant": { riskLevel: "unknown", category: "plant" },
    "unknown animal": { riskLevel: "unknown", category: "animal" },
};

export function normalizeSpeciesName(name) {
    return String(name || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

export function lookupSpeciesRisk(speciesName) {
    const key = normalizeSpeciesName(speciesName);
    if (speciesCatalog[key]) {
        return { ...speciesCatalog[key], matchedKey: key };
    }

    for (const [catalogKey, meta] of Object.entries(speciesCatalog)) {
        if (key.includes(catalogKey) || catalogKey.includes(key)) {
            return { ...meta, matchedKey: catalogKey };
        }
    }

    return { riskLevel: "unknown", category: "unknown", matchedKey: null };
}
