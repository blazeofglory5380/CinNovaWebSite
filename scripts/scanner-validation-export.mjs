#!/usr/bin/env node
import path from "node:path";
import { auditValidationLedger } from "../src/scanner/validation/auditValidation.js";
import { exportValidationResults, validationRecordsToCsv, validationRecordsToJson } from "../src/scanner/validation/exportValidation.js";
import { loadValidationLedger, resolveLedgerPath } from "../src/scanner/validation/validationStore.js";
import { summarizeValidationRecords } from "../src/scanner/validation/validationRecord.js";

function parseArgs(argv) {
    const args = {
        ledger: "data/scanner-validation/results/ledger.json",
        outputDir: "data/scanner-validation/exports",
        formats: ["both"],
        stdout: false,
    };

    for (let i = 2; i < argv.length; i += 1) {
        const token = argv[i];
        if (token === "--ledger") args.ledger = argv[++i];
        else if (token === "--output-dir") args.outputDir = argv[++i];
        else if (token === "--format") args.formats = [argv[++i] || "both"];
        else if (token === "--stdout") args.stdout = true;
        else if (token === "--help") args.help = true;
    }

    return args;
}

async function main() {
    const args = parseArgs(process.argv);
    if (args.help) {
        console.log(`Export scanner validation ledger to CSV/JSON

Usage:
  node scripts/scanner-validation-export.mjs [options]

Options:
  --ledger <path>       Ledger JSON path
  --output-dir <path>   Export directory
  --format <json|csv|both>
  --stdout              Print JSON to stdout instead of writing files
`);
        return;
    }

    const ledgerPath = resolveLedgerPath(args.ledger);
    const ledger = await loadValidationLedger(ledgerPath);
    const summary = summarizeValidationRecords(ledger.records);
    const audit = auditValidationLedger(ledger.records);

    console.log("=== Scanner Validation Export ===");
    console.log(`Ledger: ${ledgerPath}`);
    console.log(`Records: ${ledger.records.length}`);
    console.log(`Summary: ${summary.correct}/${summary.reviewed} correct (${summary.reviewed} reviewed)`);

    if (audit.duplicateCoverSrc.length) {
        console.warn("\nWARN conflicting AI species for the same image path:");
        for (const item of audit.duplicateCoverSrc) {
            console.warn(`  ${item.imagePath} -> ${item.aiSpecies.join(" | ")}`);
        }
    }

    if (args.stdout) {
        process.stdout.write(`${JSON.stringify(validationRecordsToJson(ledger.records, { summary }), null, 2)}\n`);
        return;
    }

    const formats = args.formats.flatMap((value) => (value === "both" ? ["json", "csv"] : [value]));
    const outputs = await exportValidationResults({
        records: ledger.records,
        outputDir: args.outputDir,
        formats: [...new Set(formats)],
        meta: { ledgerPath, summary },
    });

    console.log("\nExported:");
    for (const [format, filePath] of Object.entries(outputs)) {
        console.log(`  ${format}: ${path.resolve(filePath)}`);
    }

    if (args.formats.includes("csv") || args.formats.includes("both")) {
        console.log("\nCSV preview (first row):");
        const csv = validationRecordsToCsv(ledger.records).trim().split("\n");
        console.log(csv[0]);
        if (csv[1]) console.log(csv[1]);
    }
}

main().catch((error) => {
    console.error(error.message || error);
    process.exit(1);
});
