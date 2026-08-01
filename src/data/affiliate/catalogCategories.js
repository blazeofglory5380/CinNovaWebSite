/**
 * Phase 11.4B — Partner Catalog categories (AI & technology focus).
 * Closed list; update docs/tests when adding a category.
 */

export const CATALOG_CATEGORIES = Object.freeze({
    AI_COMPANIES: "ai_companies",
    CREATIVE_TOOLS: "creative_tools",
    DEVELOPER_PLATFORMS: "developer_platforms",
    CLOUD_PROVIDERS: "cloud_providers",
    HARDWARE_COMPANIES: "hardware_companies",
});

export const CATALOG_CATEGORY_LABELS = Object.freeze({
    [CATALOG_CATEGORIES.AI_COMPANIES]: "AI Companies",
    [CATALOG_CATEGORIES.CREATIVE_TOOLS]: "Creative Tools",
    [CATALOG_CATEGORIES.DEVELOPER_PLATFORMS]: "Developer Platforms",
    [CATALOG_CATEGORIES.CLOUD_PROVIDERS]: "Cloud Providers",
    [CATALOG_CATEGORIES.HARDWARE_COMPANIES]: "Hardware Companies",
});

export const CATALOG_CATEGORY_LIST = Object.freeze(Object.values(CATALOG_CATEGORIES));

export function isCatalogCategory(value) {
    return CATALOG_CATEGORY_LIST.includes(value);
}

export function getCatalogCategoryLabel(value) {
    return CATALOG_CATEGORY_LABELS[value] || value;
}
