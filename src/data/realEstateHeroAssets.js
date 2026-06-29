/**
 * Real Estate AI farmhouse transformation hero assets.
 * Poster is live today; dual-GLB transition wires in when heroVisual becomes "transformation".
 */
export const realEstateHeroAssets = {
    poster: "/images/real-estate-ai/real-estate-ai-farmhouse-transformation-hero.png",
    previews: {
        before: "/images/real-estate-ai/farmhouse-old-decrepit-preview.png",
        after: "/images/real-estate-ai/farmhouse-modern-renovated-preview.png",
    },
    models: {
        before: "/models/real-estate-ai/farmhouse-old-decrepit.glb",
        after: "/models/real-estate-ai/farmhouse-modern-renovated.glb",
        /** Future merged scene (single GLB + Transformation clip), if used instead of dual-model swap */
        combined: "/models/real-estate-ai/farmhouse-transformation.glb",
    },
};

export function getRealEstateTransformationModels() {
    return {
        beforeModelSrc: realEstateHeroAssets.models.before,
        afterModelSrc: realEstateHeroAssets.models.after,
        beforePreviewSrc: realEstateHeroAssets.previews.before,
        afterPreviewSrc: realEstateHeroAssets.previews.after,
        combinedModelSrc: realEstateHeroAssets.models.combined,
    };
}
