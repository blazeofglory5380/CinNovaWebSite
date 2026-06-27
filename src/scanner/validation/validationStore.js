import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_LEDGER_PATH = path.resolve("data/scanner-validation/results/ledger.json");

function defaultLedger() {
    return {
        version: 1,
        updatedAt: null,
        records: [],
    };
}

export function resolveLedgerPath(customPath) {
    return customPath ? path.resolve(customPath) : DEFAULT_LEDGER_PATH;
}

export async function loadValidationLedger(ledgerPath = DEFAULT_LEDGER_PATH) {
    try {
        const raw = await readFile(ledgerPath, "utf8");
        const parsed = JSON.parse(raw);
        return {
            version: parsed.version || 1,
            updatedAt: parsed.updatedAt || null,
            records: Array.isArray(parsed.records) ? parsed.records : [],
        };
    } catch (error) {
        if (error.code === "ENOENT") {
            return defaultLedger();
        }
        throw error;
    }
}

export async function saveValidationLedger(ledger, ledgerPath = DEFAULT_LEDGER_PATH) {
    const targetPath = resolveLedgerPath(ledgerPath);
    await mkdir(path.dirname(targetPath), { recursive: true });
    const payload = {
        ...ledger,
        updatedAt: new Date().toISOString(),
    };
    await writeFile(targetPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
    return payload;
}

export async function appendValidationRecord(record, ledgerPath = DEFAULT_LEDGER_PATH) {
    const ledger = await loadValidationLedger(ledgerPath);
    ledger.records.push(record);
    return saveValidationLedger(ledger, ledgerPath);
}

export async function upsertValidationRecord(record, ledgerPath = DEFAULT_LEDGER_PATH) {
    const ledger = await loadValidationLedger(ledgerPath);
    const index = ledger.records.findIndex(
        (item) => item.imagePath === record.imagePath && item.expectedSpecies === record.expectedSpecies,
    );

    if (index >= 0) {
        ledger.records[index] = { ...ledger.records[index], ...record, id: ledger.records[index].id };
    } else {
        ledger.records.push(record);
    }

    return saveValidationLedger(ledger, ledgerPath);
}

export async function updateValidationReview(
    { id, imagePath, isCorrect, reviewerNotes },
    ledgerPath = DEFAULT_LEDGER_PATH,
) {
    const ledger = await loadValidationLedger(ledgerPath);
    const record = ledger.records.find(
        (item) => item.id === id || (imagePath && item.imagePath === path.resolve(imagePath)),
    );

    if (!record) {
        throw new Error(`Validation record not found for id=${id || "n/a"} imagePath=${imagePath || "n/a"}`);
    }

    if (typeof isCorrect === "boolean") {
        record.isCorrect = isCorrect;
    }
    if (typeof reviewerNotes === "string") {
        record.reviewerNotes = reviewerNotes;
    }

    return saveValidationLedger(ledger, ledgerPath);
}
