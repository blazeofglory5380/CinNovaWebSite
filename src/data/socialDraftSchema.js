/**
 * Platform-neutral social draft schema for CinNova Phase 9A.
 * No social API publishing — drafts are human-reviewed artifacts only.
 */

export const SOCIAL_PLATFORMS = Object.freeze([
    "facebook",
    "instagram",
    "x",
    "linkedin",
    "youtube",
    "tiktok",
]);

export const SOCIAL_SOURCE_TYPES = Object.freeze(["news", "blog", "product"]);

export const SOCIAL_DRAFT_STATUSES = Object.freeze([
    "draft",
    "approved",
    "scheduled",
    "published",
    "failed",
]);

/**
 * @returns {object} Empty draft skeleton
 */
export function createSocialDraftSkeleton({
    sourceType = "news",
    sourceSlug = "",
    platform = "linkedin",
    headline = "",
} = {}) {
    const now = new Date().toISOString();
    const id = [
        "social",
        sourceType || "news",
        (sourceSlug || "untitled").slice(0, 48),
        platform || "linkedin",
        now.slice(0, 10).replace(/-/g, ""),
    ].join("-");

    return {
        id,
        sourceType,
        sourceSlug,
        headline,
        summary: "",
        destinationUrl: "",
        platform,
        body: "",
        cta: "",
        hashtags: [],
        mediaAsset: null,
        altText: "",
        status: "draft",
        createdAt: now,
        scheduledAt: null,
        publishedAt: null,
        notes: "DRAFT — human review required. Do not auto-post. Do not store credentials here.",
    };
}

/**
 * Lightweight structural validation (no network).
 * @returns {{ ok: boolean, errors: string[], warnings: string[] }}
 */
export function validateSocialDraft(draft = {}) {
    const errors = [];
    const warnings = [];

    if (!draft || typeof draft !== "object") {
        return { ok: false, errors: ["draft must be an object"], warnings };
    }
    if (!draft.id) errors.push("id is required");
    if (!SOCIAL_SOURCE_TYPES.includes(draft.sourceType)) {
        errors.push(`sourceType must be one of: ${SOCIAL_SOURCE_TYPES.join(", ")}`);
    }
    if (!draft.sourceSlug) errors.push("sourceSlug is required");
    if (!draft.headline) errors.push("headline is required");
    if (!SOCIAL_PLATFORMS.includes(draft.platform)) {
        errors.push(`platform must be one of: ${SOCIAL_PLATFORMS.join(", ")}`);
    }
    if (!SOCIAL_DRAFT_STATUSES.includes(draft.status)) {
        errors.push(`status must be one of: ${SOCIAL_DRAFT_STATUSES.join(", ")}`);
    }
    if (!draft.body) warnings.push("body is empty");
    if (!draft.destinationUrl) {
        warnings.push("destinationUrl is empty — generate with socialUtm before approval");
    } else {
        try {
            const url = new URL(draft.destinationUrl);
            if (!url.hostname.endsWith("getcinnova.com")) {
                errors.push("destinationUrl must be a getcinnova.com URL");
            }
            if (url.searchParams.get("utm_medium") !== "organic_social") {
                warnings.push("destinationUrl should include utm_medium=organic_social");
            }
        } catch {
            errors.push("destinationUrl must be a valid absolute URL");
        }
    }
    if (draft.status === "published" && !draft.publishedAt) {
        errors.push("published status requires publishedAt");
    }
    if (draft.status === "scheduled" && !draft.scheduledAt) {
        errors.push("scheduled status requires scheduledAt");
    }
    if (Array.isArray(draft.hashtags) === false) {
        errors.push("hashtags must be an array");
    }

    return { ok: errors.length === 0, errors, warnings };
}
