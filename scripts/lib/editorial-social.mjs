/**
 * Optional social draft preparation for READY editorial items (Phase 10A).
 * Status remains `draft`. No API publishing. No credentials.
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { createSocialDraftSkeleton, SOCIAL_PLATFORMS, validateSocialDraft } from "../../src/data/socialDraftSchema.js";
import { buildBlogSocialUrl, buildNewsSocialUrl } from "../../src/utils/socialUtm.js";
import { ROOT } from "./editorial-cli.mjs";

export const SOCIAL_DRAFTS_DIR = path.join(ROOT, "src", "data", "social-drafts");

const PLATFORM_BODY = {
    facebook: (item) => `${item.summary || item.dek || item.excerpt || ""}\n\nRead more on CinNova:`.trim(),
    instagram: (item) => `${item.summary || item.excerpt || item.dek || ""}\n\nLink in bio.`.trim(),
    x: (item) => {
        const base = item.title || "";
        const hook = item.dek || item.excerpt || "";
        const text = `${base}${hook ? ` — ${hook}` : ""}`;
        return text.length <= 240 ? text : `${text.slice(0, 237)}…`;
    },
    linkedin: (item) =>
        `${item.title || ""}\n\n${item.summary || item.dek || item.excerpt || ""}\n\nFull piece on CinNova:`.trim(),
    tiktok: (item) => `Hook: ${item.title || ""}\nBeat: ${item.summary || item.dek || item.excerpt || ""}\nCTA: Read the full story on CinNova.`,
    youtube: (item) =>
        `YouTube Short concept\nTitle: ${item.title || ""}\nScript angle: ${item.summary || item.dek || item.excerpt || ""}\nEnd card: getcinnova.com`,
};

function ensureSocialDir() {
    mkdirSync(SOCIAL_DRAFTS_DIR, { recursive: true });
}

function destinationFor(kind, slug, platform, dateIso) {
    if (kind === "news") {
        return buildNewsSocialUrl(slug, { source: platform === "youtube" ? "youtube" : platform, date: dateIso, content: platform === "youtube" || platform === "tiktok" ? "short" : "post" });
    }
    return buildBlogSocialUrl(slug, {
        source: platform === "youtube" ? "youtube" : platform,
        date: dateIso,
        content: platform === "youtube" || platform === "tiktok" ? "short" : "post",
    });
}

/**
 * Generate social drafts for a READY news/blog item across platforms.
 * @returns {{ written: object[], skipped: object[] }}
 */
export function prepareSocialDraftsForItem({
    kind = "news",
    item = {},
    dateIso = new Date().toISOString().slice(0, 10),
    dryRun = false,
    platforms = SOCIAL_PLATFORMS,
} = {}) {
    const written = [];
    const skipped = [];
    const slug = item.slug;
    if (!slug || !item.title) {
        skipped.push({ reason: "missing slug/title" });
        return { written, skipped };
    }

    ensureSocialDir();

    for (const platform of platforms) {
        const fileName = `${kind}-${slug}-${platform}.json`;
        const filePath = path.join(SOCIAL_DRAFTS_DIR, fileName);
        if (existsSync(filePath)) {
            skipped.push({ platform, reason: "social draft already exists", path: filePath });
            continue;
        }

        let destinationUrl = "";
        try {
            destinationUrl = destinationFor(kind, slug, platform, dateIso);
        } catch (error) {
            skipped.push({ platform, reason: error.message });
            continue;
        }

        const draft = createSocialDraftSkeleton({
            sourceType: kind,
            sourceSlug: slug,
            platform,
            headline: item.title,
        });
        draft.summary = item.dek || item.excerpt || item.summary || "";
        draft.destinationUrl = destinationUrl;
        draft.body = PLATFORM_BODY[platform]?.(item) || item.title;
        draft.cta = "Read on CinNova";
        draft.hashtags = ["CinNova", "AI"].concat(kind === "news" ? ["TechNews"] : ["Explainers"]);
        draft.mediaAsset = item.heroImage || item.heroImage || null;
        draft.altText = item.heroAlt || item.heroImageAlt || "";
        draft.status = "draft";
        draft.notes =
            "Phase 10A auto-prep. Human review required. Do not auto-post. Do not store credentials here.";

        const validation = validateSocialDraft(draft);
        if (!validation.ok) {
            skipped.push({ platform, reason: validation.errors.join("; ") });
            continue;
        }

        if (dryRun) {
            written.push({ platform, path: filePath, dryRun: true, id: draft.id });
        } else {
            writeFileSync(filePath, `${JSON.stringify(draft, null, 4)}\n`, "utf8");
            written.push({ platform, path: filePath, id: draft.id });
        }
    }

    return { written, skipped };
}
