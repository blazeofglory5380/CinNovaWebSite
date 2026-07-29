/**
 * Cin Nova Blog — editorial drafts (never public).
 *
 * Draft JSON files live in `./blog-drafts/*.json` and load only for local
 * preview (`?page=blog-preview&slug=...` in Vite DEV). They are NOT merged into
 * `blogPosts`, NOT sitemapped, NOT prerendered, and NOT offered as related-
 * reading targets for public articles.
 *
 * Production builds force an empty list even if draft files exist in the repo.
 */

const draftModules = import.meta.env.DEV
    ? import.meta.glob("./blog-drafts/*.json", { eager: true, import: "default" })
    : {};

function normalizeDraft(post, filePath = "") {
    if (!post || typeof post !== "object") return null;
    return {
        ...post,
        status: "draft",
        isDraft: true,
        __draftFile: filePath,
    };
}

/** All local drafts. Empty outside DEV. */
export function getBlogDrafts() {
    if (!import.meta.env.DEV) return [];
    return Object.entries(draftModules)
        .map(([filePath, post]) => normalizeDraft(post, filePath))
        .filter(Boolean)
        .sort((a, b) => String(b.slug || "").localeCompare(String(a.slug || "")));
}

export function getBlogDraftBySlug(slug = "") {
    if (!import.meta.env.DEV || !slug) return null;
    return getBlogDrafts().find((post) => post.slug === slug) || null;
}

export function getBlogDraftById(id) {
    if (!import.meta.env.DEV || id == null || id === "") return null;
    return getBlogDrafts().find((post) => post.id === id) || null;
}

/** DEV-only preview URL for a draft slug. */
export function getBlogDraftPreviewPath(slug = "") {
    return `/?page=blog-preview&slug=${encodeURIComponent(slug)}`;
}
