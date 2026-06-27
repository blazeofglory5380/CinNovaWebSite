import { assessRiskLevel } from "./assessRisk.js";
import { runInference } from "./inferenceProviders.js";
import { prepareImage } from "./prepareImage.js";

export const SCANNER_PIPELINE_VERSION = "1.0.0";

/**
 * Run a real image through the PoisonGuard vision pipeline.
 * @param {string} imagePath - Absolute or relative path to an image file
 * @param {object} [options]
 * @returns {Promise<object>} Normalized pipeline result
 */
export async function runScannerPipeline(imagePath, options = {}) {
    const preparedImage = await prepareImage(imagePath);
    const inference = await runInference(preparedImage, options);
    const topMatch = inference.matches[0];
    const risk = assessRiskLevel(topMatch);

    return {
        pipelineVersion: SCANNER_PIPELINE_VERSION,
        provider: inference.provider,
        imagePath: preparedImage.absolutePath,
        imageFileName: preparedImage.fileName,
        aiSpecies: risk.aiSpecies,
        topMatches: inference.matches,
        confidence: risk.confidence,
        riskLevel: risk.riskLevel,
        riskCategory: risk.riskCategory,
        riskMatchedKey: risk.riskMatchedKey,
        riskNotes: risk.riskNotes,
        scannedAt: new Date().toISOString(),
        sidecarPath: inference.sidecarPath || null,
    };
}

export { prepareImage } from "./prepareImage.js";
export { assessRiskLevel } from "./assessRisk.js";
export { runInference } from "./inferenceProviders.js";
