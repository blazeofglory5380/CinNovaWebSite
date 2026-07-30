/**
 * Phase 10B.3 — conflict detection across corroborating sources.
 * Conflicts never force READY; retain HOLD/REVIEW.
 */

import { createHash } from "node:crypto";

const NUMBER_RE = /\b(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)\s*(%|percent|million|billion|agencies|vendors|systems|users)?\b/gi;
const DATE_RE = /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b|\b20\d{2}-\d{2}-\d{2}\b/gi;

function idFor(text = "") {
    return `claim-${createHash("sha1").update(String(text).trim().toLowerCase()).digest("hex").slice(0, 10)}`;
}

function collectSignals(candidate = {}) {
    const text = `${candidate.headline || ""} ${candidate.summary || ""}`;
    const numbers = [...text.matchAll(NUMBER_RE)].map((match) => match[0].toLowerCase());
    const dates = [...text.matchAll(DATE_RE)].map((match) => match[0].toLowerCase());
    return {
        text,
        numbers: [...new Set(numbers)],
        dates: [...new Set(dates)],
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

    const numericBuckets = new Map();
    for (const item of signals) {
        for (const value of item.numbers) {
            const unit = (value.match(/(percent|%|million|billion|agencies|vendors|systems|users)/i) || ["count"])[0].toLowerCase();
            if (!numericBuckets.has(unit)) numericBuckets.set(unit, []);
            numericBuckets.get(unit).push({ sourceId: item.sourceId, url: item.url, value });
        }
    }
    for (const [unit, rows] of numericBuckets.entries()) {
        const unique = [...new Set(rows.map((row) => row.value))];
        if (unique.length >= 2 && rows.length >= 2) {
            conflicts.push({
                type: "NUMERIC_CLAIM",
                claimId:
                    claims.find((claim) => /impact|number|count/i.test(claim.claimText))?.claimId ||
                    idFor(unique.join("|")),
                notes: `Numeric conflict on ${unit}: ${unique.join(" vs ")}`,
                sources: rows,
            });
        }
    }

    return conflicts;
}
