#!/usr/bin/env node
import path from "node:path";
import { auditValidationRecords } from "../src/scanner/validation/auditValidation.js";
import { exportValidationResults } from "../src/scanner/validation/exportValidation.js";
import { loadValidationManifest, runValidationBatch } from "../src/scanner/validation/runValidationBatch.js";
import { loadValidationLedger, resolveLedgerPath, updateValidationReview } from "../src/scanner/validation/validationStore.js";

function parseArgs(argv) {
    const args = {
        manifest: "data/scanner-validation/manifest.example.json",
        ledger: "data/scanner-validation/results/ledger.json",
        provider: process.env.SCANNER_INFERENCE_PROVIDER || "auto",
        sidecarDir: process.env.SCANNER_SIDECAR_DIR || "data/scanner-validation/sidecars",
        exportFormats: [],
        append: false,
        reviewId: null,
        reviewCorrect: null,
        reviewNotes: null,
    };

    for (let i = 2; i < argv.length; i += 1) {
        const token = argv[i];
        if (token === "--manifest") args.manifest = argv[++i];
        else if (token === "--ledger") args.ledger = argv[++i];
        else if (token === "--provider") args.provider = argv[++i];
        else if (token === "--sidecar-dir") args.sidecarDir = argv[++i];
        else if (token === "--append") args.append = true;
        else if (token === "--export") args.exportFormats.push(argv[++i] || "both");
        else if (token === "--review-id") args.reviewId = argv[++i];
        else if (token === "--review-correct") args.reviewCorrect = argv[++i] === "true";
        else if (token === "--review-notes") args.reviewNotes = argv[++i];
        else if (token === "--help") args.help = true;
    }

    if (!args.exportFormats.length) {
        args.exportFormats = ["both"];
    }

    return args;
}

function printHelp() {
    console.log(`PoisonGuard scanner validation workflow

Usage:
  node scripts/scanner-validate.mjs [options]

Options:
  --manifest <path>         Validation manifest JSON (default: manifest.example.json)
  --ledger <path>           Results ledger JSON path
  --provider <name>         auto | api | openai | sidecar
  --sidecar-dir <path>      Shared sidecar directory for fixture inference
  --append                  Append results instead of upserting by image+expected
  --export <json|csv|both>  Export formats after run (default: both)
  --review-id <uuid>        Update reviewer fields on an existing record
  --review-correct <bool>   Set isCorrect during review update
  --review-notes <text>     Set reviewerNotes during review update

Environment:
  SCANNER_API_URL, SCANNER_API_KEY, OPENAI_API_KEY, SCANNER_OPENAI_MODEL
  SCANNER_INFERENCE_PROVIDER, SCANNER_SIDECAR_DIR
`);
}

async function main() {
    const args = parseArgs(process.argv);
    if (args.help) {
        printHelp();
        return;
    }

    const ledgerPath = resolveLedgerPath(args.ledger);

    if (args.reviewId || args.reviewNotes != null || args.reviewCorrect != null) {
        await updateValidationReview(
            {
                id: args.reviewId,
                isCorrect: args.reviewCorrect,
                reviewerNotes: args.reviewNotes,
            },
            ledgerPath,
        );
        const ledger = await loadValidationLedger(ledgerPath);
        console.log(`Updated review for record ${args.reviewId}`);
        console.log(`Ledger now contains ${ledger.records.length} records`);
        return;
    }

    const cases = await loadValidationManifest(args.manifest);
    console.log(`=== Scanner Validation Run ===`);
    console.log(`Manifest: ${path.resolve(args.manifest)}`);
    console.log(`Cases: ${cases.length}`);
    console.log(`Provider: ${args.provider}`);
    console.log(`Ledger: ${ledgerPath}\n`);

    const batch = await runValidationBatch({
        cases,
        ledgerPath,
        provider: args.provider,
        sidecarDir: args.sidecarDir,
        replaceExisting: !args.append,
    });

    const audit = auditValidationRecords(batch.records);
    for (const record of batch.records) {
        const flag = record.isCorrect === true ? "✓" : record.isCorrect === false ? "✗" : "?";
        console.log(
            `${flag} ${record.imageFileName} | expected=${record.expectedSpecies} | ai=${record.aiSpecies} | confidence=${record.confidence.toFixed(2)} | risk=${record.riskLevel}`,
        );
    }

    console.log("\n=== Summary ===");
    console.log(`Reviewed accuracy: ${batch.summary.reviewed}/${batch.summary.total}`);
    if (batch.summary.accuracy != null) {
        console.log(`Accuracy: ${(batch.summary.accuracy * 100).toFixed(1)}%`);
    }

    if (audit.duplicateImageSrcs.length) {
        console.warn("\nWARN duplicate coverImage.src groups in this batch:");
        for (const group of audit.duplicateImageSrcs) {
            console.warn(`  ${group.src} -> ${group.ids.join(", ")}`);
        }
    }

    if (audit.duplicateAiSpecies.length) {
        console.warn("\nWARN duplicate AI species in this batch:");
        for (const group of audit.duplicateAiSpecies) {
            console.warn(`  ${group.species} -> ${group.files.join(", ")}`);
        }
    }

    const formats = args.exportFormats.flatMap((value) =>
        value === "both" ? ["json", "csv"] : [value],
    );

    const exports = await exportValidationResults({
        records: batch.records,
        formats: [...new Set(formats)],
        meta: {
            manifest: path.resolve(args.manifest),
            provider: args.provider,
            summary: batch.summary,
        },
    });

    console.log("\nExported:");
    for (const [format, filePath] of Object.entries(exports)) {
        console.log(`  ${format}: ${filePath}`);
    }
}

main().catch((error) => {
    console.error(error.message || error);
    process.exit(1);
});
