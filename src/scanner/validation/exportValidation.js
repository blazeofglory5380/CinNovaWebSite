import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { summarizeValidationRecords } from "./validationRecord.js";

function escapeCsv(value) {
    const text = value == null ? "" : String(value);
    if (/[",\n\r]/.test(text)) {
        return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
}

export function validationRecordsToJson(records, meta = {}) {
    return {
        exportedAt: new Date().toISOString(),
        summary: summarizeValidationRecords(records),
        ...meta,
        records,
    };
}

export function validationRecordsToCsv(records) {
    const headers = [
        "id",
        "imageFileName",
        "imagePath",
        "expectedSpecies",
        "aiSpecies",
        "confidence",
        "riskLevel",
        "isCorrect",
        "reviewerNotes",
        "topMatches",
        "pipelineProvider",
        "pipelineVersion",
        "scannedAt",
    ];

    const rows = records.map((record) =>
        [
            record.id,
            record.imageFileName,
            record.imagePath,
            record.expectedSpecies,
            record.aiSpecies,
            record.confidence,
            record.riskLevel,
            record.isCorrect,
            record.reviewerNotes,
            JSON.stringify(record.topMatches || []),
            record.pipelineProvider,
            record.pipelineVersion,
            record.scannedAt,
        ]
            .map(escapeCsv)
            .join(","),
    );

    return `${headers.join(",")}\n${rows.join("\n")}\n`;
}

export async function exportValidationResults({
    records,
    outputDir = "data/scanner-validation/exports",
    basename = "scanner-validation",
    formats = ["json", "csv"],
    meta = {},
}) {
    const resolvedDir = path.resolve(outputDir);
    await mkdir(resolvedDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const outputs = {};

    if (formats.includes("json")) {
        const jsonPath = path.join(resolvedDir, `${basename}-${timestamp}.json`);
        await writeFile(jsonPath, `${JSON.stringify(validationRecordsToJson(records, meta), null, 2)}\n`, "utf8");
        outputs.json = jsonPath;
    }

    if (formats.includes("csv")) {
        const csvPath = path.join(resolvedDir, `${basename}-${timestamp}.csv`);
        await writeFile(csvPath, validationRecordsToCsv(records), "utf8");
        outputs.csv = csvPath;
    }

    return outputs;
}
