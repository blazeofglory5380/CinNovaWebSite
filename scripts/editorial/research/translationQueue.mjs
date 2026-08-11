/**
 * Phase 4 — translation queue preparation for localization.
 * Does not generate mass translations. Never introduces new factual claims.
 */

export const TRANSLATION_STATUSES = Object.freeze([
    "MISSING",
    "AI_DRAFT",
    "HUMAN_REVIEW",
    "APPROVED",
    "PUBLISHED",
    "STALE",
    "ARCHIVED",
]);

export const DEFAULT_LOCALES = Object.freeze(["en", "es", "fr", "de"]);

const ALLOWED_TRANSITIONS = Object.freeze({
    MISSING: ["AI_DRAFT", "ARCHIVED"],
    AI_DRAFT: ["HUMAN_REVIEW", "STALE", "ARCHIVED", "MISSING"],
    HUMAN_REVIEW: ["APPROVED", "AI_DRAFT", "STALE", "ARCHIVED"],
    APPROVED: ["PUBLISHED", "STALE", "ARCHIVED"],
    PUBLISHED: ["STALE", "ARCHIVED"],
    STALE: ["AI_DRAFT", "HUMAN_REVIEW", "ARCHIVED"],
    ARCHIVED: ["MISSING"],
});

/**
 * Create translation jobs for an approved English article (queue only).
 */
export function createTranslationJobs(article = {}, { locales = DEFAULT_LOCALES } = {}) {
    const slug = article.slug || "";
    return locales.map((locale) => ({
        locale,
        slug,
        status: locale === "en" ? "AI_DRAFT" : "MISSING",
        englishAuthoritative: true,
        mayAddFacts: false,
        preserve: {
            facts: true,
            dates: true,
            names: true,
            quotations: true,
            citations: true,
            organizationNames: true,
            urls: true,
        },
        humanReviewed: false,
        note:
            locale === "en"
                ? "English source remains authoritative."
                : "Translation job queued — do not invent facts; mass generation deferred.",
    }));
}

export function canTransitionTranslationStatus(from, to) {
    const allowed = ALLOWED_TRANSITIONS[from] || [];
    return allowed.includes(to);
}

export function transitionTranslationStatus(job = {}, nextStatus = "") {
    const from = job.status || "MISSING";
    const to = String(nextStatus || "").toUpperCase();
    if (!TRANSLATION_STATUSES.includes(to)) {
        return { ok: false, job, error: `Unknown status ${to}` };
    }
    if (!canTransitionTranslationStatus(from, to)) {
        return { ok: false, job, error: `Illegal transition ${from} → ${to}` };
    }
    return {
        ok: true,
        job: {
            ...job,
            status: to,
            mayAddFacts: false,
            englishAuthoritative: true,
        },
        error: null,
    };
}

export function summarizeTranslationQueue(jobs = []) {
    const counts = Object.fromEntries(TRANSLATION_STATUSES.map((s) => [s, 0]));
    for (const job of jobs || []) {
        if (counts[job.status] != null) counts[job.status] += 1;
    }
    return {
        queued: (jobs || []).length,
        missing: counts.MISSING,
        reviewRequired: counts.HUMAN_REVIEW + counts.AI_DRAFT,
        approved: counts.APPROVED,
        published: counts.PUBLISHED,
        stale: counts.STALE,
        archived: counts.ARCHIVED,
        counts,
    };
}
