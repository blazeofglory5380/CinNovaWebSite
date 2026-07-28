/**
 * Cin Nova News — editorial drafts (never public).
 *
 * Draft JSON files live in `./news-drafts/*.json` and are loaded only for local
 * preview (`?page=news-preview&slug=...` in Vite DEV). They are NOT merged into
 * `newsPosts`, NOT sitemapped, NOT prerendered, and NOT offered as related-news
 * targets for public stories.
 *
 * Production builds force an empty list even if draft files exist in the repo.
 */

const draftModules = import.meta.env.DEV
    ? import.meta.glob("./news-drafts/*.json", { eager: true, import: "default" })
    : {};

function normalizeDraft(story, filePath = "") {
    if (!story || typeof story !== "object") return null;
    return {
        ...story,
        isDraft: true,
        isPublished: false,
        isDemo: false,
        __draftFile: filePath,
    };
}

/** All local drafts, newest publishedAt first. Empty outside DEV. */
export function getNewsDrafts() {
    if (!import.meta.env.DEV) return [];
    return Object.entries(draftModules)
        .map(([filePath, story]) => normalizeDraft(story, filePath))
        .filter(Boolean)
        .sort((a, b) => Date.parse(b.publishedAt || 0) - Date.parse(a.publishedAt || 0));
}

export function getNewsDraftBySlug(slug = "") {
    if (!import.meta.env.DEV || !slug) return null;
    return getNewsDrafts().find((story) => story.slug === slug) || null;
}

export function getNewsDraftById(id = "") {
    if (!import.meta.env.DEV || !id) return null;
    return getNewsDrafts().find((story) => story.id === id) || null;
}

/** DEV-only preview URL for a draft slug. */
export function getNewsDraftPreviewPath(slug = "") {
    return `/?page=news-preview&slug=${encodeURIComponent(slug)}`;
}
