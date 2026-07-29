/**
 * Deterministic fact-check readiness scoring for CinNova News drafts (Phase 10A).
 *
 * Statuses: READY | REVIEW | HOLD | REJECT
 * HOLD stories must never enter publish candidates.
 *
 * This gate does NOT fetch the live web. It scores structural/source honesty
 * signals present on the draft (and optional research packet annotations).
 */

const PLACEHOLDER_URL_RE = /example\.com|replace-me|TODO|todo\.invalid/i;
const HOLD_LANGUAGE_RE =
    /\b(pending|proposed|proposal|request|would|could|may|might|reportedly|unconfirmed|awaiting|expected to)\b/i;
const COMPLETED_LANGUAGE_RE =
    /\b(signed into law|enacted|closed the deal|completed the acquisition|has taken effect|is now law)\b/i;

export const FACTCHECK_STATUSES = Object.freeze(["READY", "REVIEW", "HOLD", "REJECT"]);

function isNonEmpty(value) {
    return typeof value === "string" && value.trim().length > 0;
}

function validHttpUrl(url) {
    try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
}

function daysSince(iso) {
    const ms = Date.parse(iso || "");
    if (Number.isNaN(ms)) return null;
    return (Date.now() - ms) / (24 * 60 * 60 * 1000);
}

/**
 * @param {object} draft News draft or packet story
 * @param {{ duplicateClassification?: string }} options
 */
export function scoreNewsFactCheck(draft = {}, options = {}) {
    const holds = [];
    const rejects = [];
    const reviews = [];
    let score = 100;

    if (!draft || typeof draft !== "object") {
        return {
            status: "REJECT",
            score: 0,
            reasons: ["Draft is missing"],
            publishCandidate: false,
        };
    }

    const title = draft.title || "";
    const dek = draft.dek || "";
    const location = draft.location || "";
    const publishedAt = draft.publishedAt || draft.eventDate || "";
    const sources = Array.isArray(draft.sources) ? draft.sources : [];
    const verifiedClaims = Array.isArray(draft.verifiedClaims) ? draft.verifiedClaims : [];
    const attributedClaims = Array.isArray(draft.attributedClaims) ? draft.attributedClaims : [];
    const uncertainties = Array.isArray(draft.uncertainties) ? draft.uncertainties : [];
    const duplicate = options.duplicateClassification || draft.duplicateClassification || "";

    if (!isNonEmpty(title)) {
        rejects.push("Missing headline");
        score -= 40;
    }
    if (!isNonEmpty(location)) {
        reviews.push("Location not confirmed");
        score -= 10;
    }
    if (!isNonEmpty(publishedAt) || Number.isNaN(Date.parse(publishedAt))) {
        holds.push("Event/publication date not confirmed");
        score -= 20;
    }

    const ageDays = daysSince(publishedAt);
    if (ageDays != null && ageDays > 21) {
        reviews.push(`Editorial recency weak (${Math.floor(ageDays)} days old) — confirm still newsworthy`);
        score -= 8;
    }
    if (ageDays != null && ageDays < -1) {
        reviews.push("publishedAt is in the future");
        score -= 5;
    }

    const realSources = sources.filter(
        (source) =>
            source &&
            isNonEmpty(source.url) &&
            validHttpUrl(source.url) &&
            !PLACEHOLDER_URL_RE.test(source.url),
    );
    if (realSources.length === 0) {
        rejects.push("No valid source URLs");
        score -= 35;
    } else if (realSources.length === 1) {
        reviews.push("Only one source — prefer independent corroboration for consequential claims");
        score -= 8;
    }

    const primaryish = realSources.filter((source) => {
        const blob = `${source.publisher || ""} ${source.label || ""} ${source.note || ""} ${source.type || ""}`.toLowerCase();
        return (
            source.type === "official" ||
            /gov|commission|court|sec\.|ir\.|newsroom|university|ferc|cisa|legislature|county|city of/.test(blob)
        );
    });
    if (realSources.length && primaryish.length === 0) {
        reviews.push("No clear primary/official source flagged — treat company/media wording carefully");
        score -= 6;
    }

    if (!isNonEmpty(draft.whyItMatters)) {
        reviews.push("whyItMatters missing");
        score -= 5;
    }
    if (!isNonEmpty(draft.summary) && !isNonEmpty(dek)) {
        reviews.push("summary/dek thin");
        score -= 5;
    }

    if (duplicate === "DUPLICATE") {
        rejects.push("Duplicate/near-duplicate of existing coverage");
        score -= 50;
    } else if (duplicate === "UPDATE") {
        holds.push("Possible same-event UPDATE — confirm material new development before drafting as new");
        score -= 15;
    }

    // Claim honesty annotations (preferred when present).
    if (verifiedClaims.length === 0 && attributedClaims.length === 0) {
        reviews.push("verifiedClaims[] / attributedClaims[] not populated — human must classify FACT vs CLAIM");
        score -= 6;
    }
    if (uncertainties.length > 0) {
        holds.push(`Unresolved uncertainties listed (${uncertainties.length})`);
        score -= 12;
    }

    const claimBlob = `${title}. ${dek}. ${draft.summary || ""}`;
    if (COMPLETED_LANGUAGE_RE.test(claimBlob) && HOLD_LANGUAGE_RE.test(claimBlob)) {
        holds.push("Headline/dek mixes completed-event language with pending/proposal language");
        score -= 18;
    }

    // Packet/editorial explicit disposition wins when provided.
    const explicit = String(draft.factCheckStatus || draft.disposition || "").toUpperCase();
    const notes = String(draft.editorialNotes || "");
    if (/^\s*HOLD\b/i.test(notes) || /\bHOLD\s*[—-]/i.test(notes)) {
        holds.push("editorialNotes mark this item HOLD");
        score -= 20;
    }
    if (FACTCHECK_STATUSES.includes(explicit)) {
        const publishCandidate = explicit === "READY" || explicit === "REVIEW";
        return {
            status: explicit,
            score: Math.max(0, Math.min(100, score)),
            reasons: [
                `Explicit factCheckStatus=${explicit} on draft/packet`,
                ...rejects,
                ...holds,
                ...reviews,
            ],
            publishCandidate: explicit === "READY" ? true : publishCandidate && explicit !== "HOLD" && explicit !== "REJECT",
            rejects,
            holds,
            reviews,
        };
    }

    let status = "REVIEW";
    if (rejects.length) status = "REJECT";
    else if (holds.length) status = "HOLD";
    else if (score >= 85 && realSources.length >= 2 && isNonEmpty(location) && isNonEmpty(publishedAt)) {
        status = "READY";
    } else if (score < 55) {
        status = "HOLD";
        holds.push("Score below HOLD threshold");
    }

    // Explicit HOLD language in notes forces HOLD even if score was high.
    if (holds.some((h) => /editorialNotes mark this item HOLD/i.test(h))) {
        status = "HOLD";
    }

    // READY requires no unresolved contradiction notes affecting headline.
    if (status === "READY" && /contradict|conflict|inconsist/i.test(String(draft.editorialNotes || ""))) {
        status = "HOLD";
        holds.push("Editorial notes mention contradiction/conflict");
    }

    // HOLD/REJECT never publish candidates.
    const finalPublish = status === "READY" || (status === "REVIEW" && !holds.length && !rejects.length);
    const publishCandidate = status === "READY" ? true : finalPublish && status === "REVIEW";

    return {
        status,
        score: Math.max(0, Math.min(100, score)),
        reasons: [...rejects, ...holds, ...reviews],
        rejects,
        holds,
        reviews,
        publishCandidate,
        // Explicit rule: HOLD never enters publish candidates
        blockedFromPublish: status === "HOLD" || status === "REJECT",
    };
}

/**
 * Blog fact-check is lighter: sources + non-empty body + SEO fields.
 */
export function scoreBlogFactCheck(draft = {}) {
    const reviews = [];
    const rejects = [];
    let score = 100;

    if (!isNonEmpty(draft.title)) {
        rejects.push("Missing title");
        score -= 30;
    }
    if (!isNonEmpty(draft.seoTitle) || !isNonEmpty(draft.seoDescription)) {
        reviews.push("SEO title/description incomplete");
        score -= 10;
    }

    const sources = Array.isArray(draft.sources) ? draft.sources : [];
    const realSources = sources.filter(
        (source) => source?.url && validHttpUrl(source.url) && !PLACEHOLDER_URL_RE.test(source.url),
    );
    if (realSources.length === 0) {
        reviews.push("No authoritative sources yet (ok for pure product explainers; required for research-heavy pieces)");
        score -= 8;
    }

    const content = Array.isArray(draft.content) ? draft.content : [];
    const words = content
        .flatMap((block) => String(block.body || "").split(/\s+/))
        .filter(Boolean).length;
    if (words < 350) {
        reviews.push(`Thin draft body (~${words} words)`);
        score -= 15;
    } else if (words < 900) {
        reviews.push(`Below target length (~${words} words; target 900–1800)`);
        score -= 5;
    }

    let status = "REVIEW";
    if (rejects.length) status = "REJECT";
    else if (score >= 80 && words >= 500 && isNonEmpty(draft.seoTitle)) status = "READY";
    else if (score < 50) status = "HOLD";

    return {
        status,
        score: Math.max(0, Math.min(100, score)),
        reasons: [...rejects, ...reviews],
        wordCount: words,
        publishCandidate: status === "READY" || status === "REVIEW",
        blockedFromPublish: status === "HOLD" || status === "REJECT",
    };
}
