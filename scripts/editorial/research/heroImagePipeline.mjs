/**
 * Phase 4 — hero image pipeline design (no unauthorized generation/download).
 */

export const HERO_IMAGE_KINDS = Object.freeze({
    APPROVED_SOURCE_IMAGE: "APPROVED_SOURCE_IMAGE",
    LICENSED_STOCK: "LICENSED_STOCK",
    CINNOVA_ORIGINAL: "CINNOVA_ORIGINAL",
    AI_GENERATED_ILLUSTRATION: "AI_GENERATED_ILLUSTRATION",
    NO_IMAGE: "NO_IMAGE",
});

/**
 * Build a provenance record for an article hero candidate.
 * Does not download or generate images.
 */
export function buildHeroImageRecord({
    kind = HERO_IMAGE_KINDS.NO_IMAGE,
    articleSlug = "",
    path = null,
    altText = "",
    caption = "",
    license = "",
    attribution = "",
    isDocumentaryPhotography = false,
    aiLabeled = false,
} = {}) {
    const normalized = HERO_IMAGE_KINDS[kind] ? kind : HERO_IMAGE_KINDS.NO_IMAGE;
    const requiresAiLabel =
        normalized === HERO_IMAGE_KINDS.AI_GENERATED_ILLUSTRATION || aiLabeled;
    if (requiresAiLabel && isDocumentaryPhotography) {
        return {
            ok: false,
            error: "AI illustration must not be labeled as documentary photography.",
            record: null,
        };
    }

    const record = {
        kind: normalized,
        articleSlug,
        path,
        altText: altText || (normalized === HERO_IMAGE_KINDS.NO_IMAGE ? "" : `Illustration for ${articleSlug}`),
        caption: caption || null,
        license: license || (normalized === HERO_IMAGE_KINDS.NO_IMAGE ? "n/a" : "unspecified"),
        attribution: attribution || null,
        provenance: {
            kind: normalized,
            scrapedNewsPhotography: false,
            documentaryPhotography: Boolean(isDocumentaryPhotography),
            aiGenerated: normalized === HERO_IMAGE_KINDS.AI_GENERATED_ILLUSTRATION,
            aiLabelRequired: requiresAiLabel,
            aiLabelText: requiresAiLabel
                ? "AI-generated illustration — not documentary photography."
                : null,
        },
        status: normalized === HERO_IMAGE_KINDS.NO_IMAGE ? "MISSING" : "READY_FOR_REVIEW",
        notes: [
            "Do not scrape arbitrary news photography.",
            "Do not generate or download images unless explicitly authorized.",
            "AI imagery must be labeled where appropriate.",
        ],
    };

    return { ok: true, error: null, record };
}

export function summarizeHeroPipelineReadiness(records = []) {
    const list = records || [];
    return {
        ready: list.filter((r) => r.status === "READY_FOR_REVIEW" || r.status === "APPROVED").length,
        missing: list.filter((r) => r.status === "MISSING" || r.kind === HERO_IMAGE_KINDS.NO_IMAGE).length,
        attributionRequired: list.filter((r) => r.attribution).length,
        aiLabeled: list.filter((r) => r.provenance?.aiLabelRequired).length,
    };
}
