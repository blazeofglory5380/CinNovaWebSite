/**
 * Phase 10B.3 / Phase 3 — conflict detection across corroborating sources.
 * Uses numeric normalization so $500bn ≡ $500 billion; material conflicts → HOLD.
 */

import { createHash } from "node:crypto";
import {
    compareNumericClaims,
    extractCurrencyClaims,
    extractPercentClaims,
    numericValuesAgree,
} from "./numericClaims.mjs";

const DATE_RE =
    /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b|\b20\d{2}-\d{2}-\d{2}\b/gi;
const VERSION_RE =
    /\b(?:version|v\.?|firmware)\s*([A-Za-z0-9]+(?:\.[A-Za-z0-9]+)+)\b|\b(v?\d+\.\d+(?:\.\d+)?)\b/gi;
const COUNT_UNIT_RE =
    /\b(\d{1,3}(?:,\d{3})+|\d+)\s*(agencies|vendors|systems|users)\b/gi;

function idFor(text = "") {
    return `claim-${createHash("sha1").update(String(text).trim().toLowerCase()).digest("hex").slice(0, 10)}`;
}

function collectSignals(candidate = {}) {
    const text = `${candidate.headline || ""} ${candidate.summary || ""}`;
    const dates = [...text.matchAll(DATE_RE)].map((match) => match[0].toLowerCase());
    const versions = [...text.matchAll(VERSION_RE)]
        .map((match) => (match[1] || match[2] || match[0]).toLowerCase())
        .filter((value) => /\d+\.\d+/.test(value));
    const counts = [...text.matchAll(COUNT_UNIT_RE)].map((match) => ({
        raw: match[0].toLowerCase(),
        value: Number(String(match[1]).replace(/,/g, "")),
        unit: match[2].toLowerCase(),
    }));
    return {
        text,
        dates: [...new Set(dates)],
        versions: [...new Set(versions)],
        counts,
        currencies: extractCurrencyClaims(text),
        percents: extractPercentClaims(text),
        sourceId: candidate.sourceId,
        url: candidate.articleUrl,
    };
}

/**
 * Detect conflicting numeric/date claims across sources for the same event.
 */
export function detectConflicts(candidates = [], claims = []) {
    const conflicts = [];
    const signals = (candidates || []).map(collectSignals).filter((item) => item.text.trim());
    if (signals.length < 2) return conflicts;

    const calendarDates = signals.filter((item) => item.dates.length);
    if (calendarDates.length >= 2) {
        const first = calendarDates[0].dates[0];
        const disagree = calendarDates.filter((item) => !item.dates.includes(first));
        if (disagree.length) {
            conflicts.push({
                type: "DATE",
                claimId: claims[0]?.claimId || idFor(first),
                notes: `Date mismatch: ${calendarDates[0].sourceId} has "${first}" vs ${disagree
                    .map((item) => `${item.sourceId}:${item.dates[0]}`)
                    .join("; ")}`,
                sources: calendarDates.map((item) => ({
                    sourceId: item.sourceId,
                    url: item.url,
                    values: item.dates,
                })),
            });
        }
    }

    // Currency: normalized comparison ($5B ≡ $5 billion).
    for (let i = 0; i < signals.length; i += 1) {
        for (let j = i + 1; j < signals.length; j += 1) {
            const { conflict } = compareNumericClaims(signals[i].text, signals[j].text);
            for (const row of conflict) {
                conflicts.push({
                    type: "NUMERIC_CLAIM",
                    claimId:
                        claims.find((claim) => claim.claimType === "NUMERIC_CLAIM")?.claimId
                        || idFor(`${row.a.raw}|${row.b.raw}`),
                    notes: row.notes,
                    sources: [
                        { sourceId: signals[i].sourceId, url: signals[i].url, values: [row.a.raw] },
                        { sourceId: signals[j].sourceId, url: signals[j].url, values: [row.b.raw] },
                    ],
                });
            }
        }
    }

    // Unit-tagged counts (agencies/vendors/…) — conflict when same unit disagrees.
    const byUnit = new Map();
    for (const item of signals) {
        for (const count of item.counts) {
            if (!byUnit.has(count.unit)) byUnit.set(count.unit, []);
            byUnit.get(count.unit).push({ ...count, sourceId: item.sourceId, url: item.url });
        }
    }
    for (const [unit, rows] of byUnit.entries()) {
        if (rows.length < 2) continue;
        const first = rows[0];
        const disagree = rows.filter((row) => !numericValuesAgree(first.value, row.value, { relativeTolerance: 0 }));
        if (disagree.length) {
            conflicts.push({
                type: "NUMERIC_CLAIM",
                claimId:
                    claims.find((claim) => /impact|number|count|agenc/i.test(claim.claimText))?.claimId
                    || idFor(`${unit}:${rows.map((r) => r.value).join("|")}`),
                notes: `Numeric conflict on ${unit}: ${rows.map((r) => r.raw).join(" vs ")}`,
                sources: rows,
            });
        }
    }

    const versionRows = signals.filter((item) => item.versions.length);
    if (versionRows.length >= 2) {
        const first = versionRows[0].versions[0];
        const disagree = versionRows.filter((item) => !item.versions.includes(first));
        if (disagree.length) {
            conflicts.push({
                type: "PRODUCT_VERSION",
                claimId:
                    claims.find((claim) => /version|firmware|affected/i.test(claim.claimText))?.claimId
                    || idFor(first),
                notes: `Version mismatch: ${versionRows[0].sourceId} has "${first}" vs ${disagree
                    .map((item) => `${item.sourceId}:${item.versions[0]}`)
                    .join("; ")}`,
                sources: versionRows.map((item) => ({
                    sourceId: item.sourceId,
                    url: item.url,
                    values: item.versions,
                })),
            });
        }
    }

    // Deduplicate identical notes.
    const seen = new Set();
    return conflicts.filter((item) => {
        const key = `${item.type}:${item.notes}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}
