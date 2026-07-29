/**
 * Hero image pipeline for editorial automation (Phase 10A).
 * Never fabricates image files. Assigns existing inventory or emits IMAGE REQUIRED.
 */

import { existsSync } from "node:fs";
import path from "node:path";
import { blogImagePool, articleHeroAssignments, getPoolImagesForCategory } from "../../src/data/blogImageInventory.js";
import { heroImageExists as newsHeroExists } from "./news-editorial.mjs";
import {
    heroImageExists as blogHeroExists,
    PUBLIC_DIR,
    ROOT,
} from "./blog-editorial.mjs";
import { tokenize, jaccard } from "./editorial-dedupe.mjs";

const PREFERRED = { width: 1600, height: 900, aspect: "16:9" };

function usedHeroPaths() {
    const paths = new Set();
    for (const asset of blogImagePool) {
        if (asset?.localPath) paths.add(asset.localPath);
    }
    return paths;
}

function scoreAsset(asset, textTokens) {
    const blob = `${asset.title || ""} ${asset.alt || ""} ${asset.category || ""} ${(asset.tags || []).join(" ")}`;
    return jaccard(textTokens, tokenize(blob));
}

/**
 * @returns {{ status: "ASSIGNED"|"IMAGE_REQUIRED"|"MISSING_PREFERRED", heroImage?: string, heroAlt?: string, requirement?: object, warnings: string[] }}
 */
export function resolveNewsHero(draft = {}) {
    const warnings = [];
    const preferred = draft.heroImage || `/images/news/${draft.coverageLevel || "local"}/${draft.slug}.jpg`;
    const alt = draft.heroAlt || "";

    if (newsHeroExists(preferred)) {
        const usedOften = false;
        return {
            status: "ASSIGNED",
            heroImage: preferred,
            heroAlt: alt || `Editorial illustration for ${draft.title || draft.slug}`,
            warnings: usedOften ? ["Hero may be reused — confirm uniqueness"] : [],
            duplicateHero: false,
        };
    }

    // Search loose inventory under public/images for topical stills (path keywords only).
    const textTokens = tokenize(`${draft.title || ""} ${draft.category || ""} ${draft.location || ""}`);
    const poolHits = blogImagePool
        .map((asset) => ({ asset, score: scoreAsset(asset, textTokens) }))
        .filter((row) => row.score >= 0.22)
        .sort((a, b) => b.score - a.score);

    if (poolHits[0]) {
        const asset = poolHits[0].asset;
        warnings.push(`Assigned library still \`${asset.localPath}\` — confirm it is not unrelated art`);
        return {
            status: "ASSIGNED",
            heroImage: asset.localPath,
            heroAlt: alt || asset.alt || `Library illustration related to ${draft.title || "this story"}`,
            warnings,
            duplicateHero: Boolean(asset.localPath && usedHeroPaths().has(asset.localPath)),
            libraryAssetId: asset.id,
        };
    }

    const requirement = {
        filename: `${draft.slug}.jpg`,
        folder: `public/images/news/${draft.coverageLevel || "local"}/`,
        dimensions: `${PREFERRED.width}×${PREFERRED.height}`,
        aspectRatio: PREFERRED.aspect,
        alt: alt || `Editorial landscape illustration for: ${draft.title || draft.slug}`,
        visualConcept:
            draft.heroImageBrief?.concept ||
            `Documentary-style 16:9 scene suggesting ${draft.category || "technology"} in ${draft.location || "context"}, no readable fake logos or fabricated UI.`,
        generationPrompt:
            draft.heroImageBrief?.prompt ||
            `Create a premium editorial 16:9 photograph-like still about ${draft.title || draft.slug}. Natural lighting, no text, no logos, no celebrity likenesses, suitable as a news hero.`,
    };

    return {
        status: "IMAGE_REQUIRED",
        heroImage: preferred,
        heroAlt: requirement.alt,
        requirement,
        warnings: ["Preferred hero file missing on disk"],
        duplicateHero: false,
    };
}

export function resolveBlogHero(draft = {}) {
    const warnings = [];
    const preferred = draft.heroImage || `/images/blog/hero/${draft.slug}.webp`;
    const alt = draft.heroImageAlt || draft.heroAlt || "";

    if (blogHeroExists(preferred)) {
        return {
            status: "ASSIGNED",
            heroImage: preferred,
            heroAlt: alt || `Hero image for ${draft.title || draft.slug}`,
            warnings,
            duplicateHero: false,
        };
    }

    const category = draft.category || "Artificial Intelligence";
    const pool = getPoolImagesForCategory(category);
    const textTokens = tokenize(`${draft.title || ""} ${draft.excerpt || ""} ${draft.researchBrief?.primaryKeyword || ""}`);
    const ranked = (pool.length ? pool : blogImagePool)
        .map((asset) => ({ asset, score: scoreAsset(asset, textTokens) }))
        .filter((row) => row.score >= 0.2)
        .sort((a, b) => b.score - a.score);

    if (ranked[0]) {
        const asset = ranked[0].asset;
        warnings.push(`Assigned inventory asset \`${asset.localPath}\` — verify topical fit before publish`);
        return {
            status: "ASSIGNED",
            heroImage: asset.localPath,
            heroAlt: alt || asset.alt || `Illustration for ${draft.title || draft.slug}`,
            warnings,
            duplicateHero: Object.values(articleHeroAssignments).includes(asset.id),
            libraryAssetId: asset.id,
        };
    }

    const requirement = {
        filename: `${draft.slug}.webp`,
        folder: "public/images/blog/hero/",
        dimensions: `${PREFERRED.width}×${PREFERRED.height}`,
        aspectRatio: PREFERRED.aspect,
        alt: alt || draft.heroImageBrief?.alt || `Editorial hero for ${draft.title || draft.slug}`,
        visualConcept:
            draft.heroImageBrief?.concept ||
            `Clean 16:9 editorial visual for “${draft.title || draft.slug}” — practical, non-hype, no fake UI text.`,
        generationPrompt:
            draft.heroImageBrief?.prompt ||
            `Premium website blog hero, 16:9, subject: ${draft.title || draft.slug}. Cinematic but grounded, no text overlays, no logos.`,
    };

    return {
        status: "IMAGE_REQUIRED",
        heroImage: preferred,
        heroAlt: requirement.alt,
        requirement,
        warnings: ["Preferred blog hero missing on disk"],
        duplicateHero: false,
    };
}

export function applyHeroResolution(draft, kind = "news") {
    const next = { ...draft };
    if (kind === "news") {
        const result = resolveNewsHero(next);
        next.heroImage = result.heroImage;
        if (!next.heroAlt) next.heroAlt = result.heroAlt;
        next.__hero = result;
        return next;
    }
    const result = resolveBlogHero(next);
    next.heroImage = result.heroImage;
    if (!next.heroImageAlt) next.heroImageAlt = result.heroAlt;
    next.__hero = result;
    return next;
}

export function heroFileExists(publicPath) {
    if (!publicPath) return false;
    if (newsHeroExists(publicPath) || blogHeroExists(publicPath)) return true;
    const relative = publicPath.startsWith("/") ? publicPath.slice(1) : publicPath;
    return existsSync(path.join(PUBLIC_DIR || path.join(ROOT, "public"), relative));
}
