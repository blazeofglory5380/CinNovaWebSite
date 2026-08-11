/**
 * Phase 4 — desk corroboration coverage matrix.
 * Optimizes for independent corroboration capability, not feed count.
 */

import { SOURCE_REGISTRY, getActiveSources } from "./sourceRegistry.mjs";
import {
    canonicalizeTier,
    isDiscoveryOnlyTier,
    isPrimaryTier,
    SOURCE_TIERS,
} from "./sourceTiers.mjs";

export const COVERAGE_DESKS = Object.freeze([
    { id: "ai", label: "AI", topics: ["ai"] },
    { id: "technology", label: "Technology", topics: ["technology", "software", "semiconductors", "cloud", "hardware"] },
    { id: "business", label: "Business", topics: ["business", "startups"] },
    { id: "finance", label: "Finance", topics: ["finance", "economy"] },
    { id: "science", label: "Science", topics: ["science", "research"] },
    { id: "health", label: "Health", topics: ["health"] },
    { id: "environment", label: "Environment", topics: ["environment", "climate"] },
    { id: "cybersecurity", label: "Cybersecurity", topics: ["cybersecurity"] },
    { id: "space", label: "Space", topics: ["space"] },
    { id: "national", label: "U.S. National", scopes: ["national"] },
    { id: "international", label: "International", scopes: ["international"] },
]);

function matchesDesk(source, desk) {
    if (desk.scopes?.length) {
        return (source.scope || []).some((s) => desk.scopes.includes(s));
    }
    const topics = (source.topics || []).map((t) => t.toLowerCase());
    return (desk.topics || []).some((need) => topics.some((t) => t.includes(need) || need.includes(t)));
}

function isIndependentNews(source) {
    const tier = canonicalizeTier(source.authorityTier);
    return (
        source.role === "secondary"
        || tier === SOURCE_TIERS.TIER_1_NEWS
        || tier === SOURCE_TIERS.TIER_2_REPUTABLE
    ) && source.supportsCorroboration;
}

function isSpecialty(source) {
    return isIndependentNews(source) && /science|health|environment|cyber|space|engineering|research/i.test(
        `${(source.topics || []).join(" ")} ${source.coverageType || ""}`,
    );
}

/**
 * Classify READY potential for a desk.
 * STRONG: ≥1 primary + ≥2 independent secondaries
 * ADEQUATE: ≥1 primary + ≥1 independent secondary OR ≥2 independents
 * WEAK: primary-heavy or secondary-thin
 * INSUFFICIENT: cannot reasonably form two-source packets
 */
export function classifyReadyPotential({ primary = 0, independentNews = 0, specialty = 0 } = {}) {
    const secondaryPool = independentNews + specialty;
    if (primary >= 1 && independentNews >= 2) return "STRONG";
    if ((primary >= 1 && secondaryPool >= 1) || independentNews >= 2) return "ADEQUATE";
    if (primary >= 1 || independentNews >= 1) return "WEAK";
    return "INSUFFICIENT";
}

export function buildDeskCoverageRow(desk, sources = getActiveSources()) {
    const matching = sources.filter((s) => matchesDesk(s, desk));
    const primary = matching.filter((s) => isPrimaryTier(s.authorityTier) && s.role === "primary");
    const independentNews = matching.filter((s) => isIndependentNews(s) && !isDiscoveryOnlyTier(s.authorityTier));
    const specialty = matching.filter(isSpecialty);
    const discovery = matching.filter((s) => isDiscoveryOnlyTier(s.authorityTier) || s.role === "discovery");
    const potential = classifyReadyPotential({
        primary: primary.length,
        independentNews: independentNews.length,
        specialty: specialty.length,
    });

    let expectedFrequency = "low";
    if (matching.some((s) => /daily|several/.test(s.updateFrequency || ""))) expectedFrequency = "moderate";
    if (independentNews.length >= 2 && primary.length >= 1) expectedFrequency = "regular";

    let weakness = "None material";
    if (potential === "INSUFFICIENT") weakness = "No independent corroboration path";
    else if (potential === "WEAK") weakness = "Thin secondary/newsroom coverage for claim agreement";
    else if (independentNews.length < 2) weakness = "Often depends on one newsroom + primary pairing";
    else if (desk.id === "health" || desk.id === "environment") {
        weakness = "Secondary health/environment newsrooms limited vs official notices";
    } else if (desk.id === "finance" || desk.id === "business") {
        weakness = "Licensed wires (Reuters/AP/Bloomberg/FT) unavailable — corroboration fragile";
    }

    return {
        desk: desk.id,
        label: desk.label,
        primaryCount: primary.length,
        primarySources: primary.map((s) => s.id),
        independentNewsCount: independentNews.length,
        independentNewsSources: independentNews.map((s) => s.id),
        specialtyCount: specialty.length,
        specialtySources: specialty.map((s) => s.id),
        discoveryCount: discovery.length,
        discoverySources: discovery.map((s) => s.id),
        corroborationCapability: potential !== "INSUFFICIENT" && potential !== "WEAK",
        readyPotential: potential,
        expectedStoryFrequency: expectedFrequency,
        coverageWeakness: weakness,
    };
}

export function buildCoverageMatrix({ registry = SOURCE_REGISTRY } = {}) {
    const active = registry.filter(
        (s) => s.active && s.feedUrl && s.authorityTier !== SOURCE_TIERS.BLOCKED,
    );
    const inactive = registry.filter((s) => !s.active);
    const desks = COVERAGE_DESKS.map((desk) => buildDeskCoverageRow(desk, active));
    const summary = {
        activeSourceCount: active.length,
        inactiveDocumented: inactive.length,
        strongDesks: desks.filter((d) => d.readyPotential === "STRONG").map((d) => d.desk),
        adequateDesks: desks.filter((d) => d.readyPotential === "ADEQUATE").map((d) => d.desk),
        weakDesks: desks.filter((d) => d.readyPotential === "WEAK").map((d) => d.desk),
        insufficientDesks: desks.filter((d) => d.readyPotential === "INSUFFICIENT").map((d) => d.desk),
        overall:
            desks.every((d) => ["STRONG", "ADEQUATE"].includes(d.readyPotential))
                ? "ADEQUATE"
                : desks.some((d) => d.readyPotential === "INSUFFICIENT")
                  ? "GAPPED"
                  : "MIXED",
    };
    return { generatedAt: new Date().toISOString(), summary, desks, inactiveSources: inactive.map((s) => ({
        id: s.id,
        reason: s.notes || "inactive",
        licensingNotes: s.licensingNotes,
    })) };
}
