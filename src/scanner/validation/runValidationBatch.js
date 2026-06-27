import path from "node:path";
import { readFile } from "node:fs/promises";
import { runScannerPipeline } from "../pipeline/runScannerPipeline.js";
import { createValidationRecord, summarizeValidationRecords } from "./validationRecord.js";
import { loadValidationLedger, saveValidationLedger, upsertValidationRecord } from "./validationStore.js";

export async function loadValidationManifest(manifestPath) {
    const raw = await readFile(path.resolve(manifestPath), "utf8");
    const parsed = JSON.parse(raw);
    const cases = Array.isArray(parsed?.cases) ? parsed.cases : [];

    return cases.map((item, index) => {
        if (!item?.imagePath) {
            throw new Error(`Manifest case ${index + 1} is missing imagePath`);
        }
        return {
            imagePath: path.resolve(item.imagePath),
            expectedSpecies: item.expectedSpecies || "",
            reviewerNotes: item.reviewerNotes || "",
            isCorrect: typeof item.isCorrect === "boolean" ? item.isCorrect : null,
        };
    });
}

export async function runValidationBatch({
    cases,
    ledgerPath,
    provider,
    sidecarDir,
    replaceExisting = true,
}) {
    const records = [];

    for (const testCase of cases) {
        const pipelineResult = await runScannerPipeline(testCase.imagePath, {
            provider,
            sidecarDir,
        });

        const record = createValidationRecord({
            imagePath: pipelineResult.imagePath,
            imageFileName: pipelineResult.imageFileName,
            expectedSpecies: testCase.expectedSpecies,
            pipelineResult,
            isCorrect: testCase.isCorrect,
            reviewerNotes: testCase.reviewerNotes,
        });

        if (replaceExisting) {
            await upsertValidationRecord(record, ledgerPath);
        }

        records.push(record);
    }

    if (!replaceExisting) {
        const ledger = await loadValidationLedger(ledgerPath);
        ledger.records.push(...records);
        await saveValidationLedger(ledger, ledgerPath);
    }

    return {
        records,
        summary: summarizeValidationRecords(
            replaceExisting
                ? (await loadValidationLedger(ledgerPath)).records
                : records,
        ),
    };
}
