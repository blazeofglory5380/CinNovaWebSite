import { randomUUID } from "node:crypto";
import { normalizeSpeciesName } from "../speciesCatalog.js";

export function speciesMatchScore(expectedSpecies, aiSpecies) {
    const expected = normalizeSpeciesName(expectedSpecies);
    const actual = normalizeSpeciesName(aiSpecies);

    if (!expected || !actual) {
        return false;
    }
    if (expected === actual) {
        return true;
    }
    return expected.includes(actual) || actual.includes(expected);
}

export function createValidationRecord({
    imagePath,
    imageFileName,
    expectedSpecies,
    pipelineResult,
    isCorrect = null,
    reviewerNotes = "",
}) {
    const autoCorrect = expectedSpecies
        ? speciesMatchScore(expectedSpecies, pipelineResult.aiSpecies)
        : null;

    return {
        id: randomUUID(),
        imagePath,
        imageFileName,
        expectedSpecies: expectedSpecies || "",
        aiSpecies: pipelineResult.aiSpecies,
        topMatches: pipelineResult.topMatches,
        confidence: pipelineResult.confidence,
        riskLevel: pipelineResult.riskLevel,
        isCorrect: isCorrect ?? autoCorrect,
        reviewerNotes,
        scannedAt: pipelineResult.scannedAt,
        pipelineProvider: pipelineResult.provider,
        pipelineVersion: pipelineResult.pipelineVersion,
        riskCategory: pipelineResult.riskCategory,
        riskMatchedKey: pipelineResult.riskMatchedKey,
        riskNotes: pipelineResult.riskNotes || "",
    };
}

export function summarizeValidationRecords(records) {
    const reviewed = records.filter((record) => record.isCorrect !== null);
    const correct = reviewed.filter((record) => record.isCorrect === true);
    const incorrect = reviewed.filter((record) => record.isCorrect === false);

    return {
        total: records.length,
        reviewed: reviewed.length,
        correct: correct.length,
        incorrect: incorrect.length,
        accuracy: reviewed.length ? correct.length / reviewed.length : null,
    };
}
