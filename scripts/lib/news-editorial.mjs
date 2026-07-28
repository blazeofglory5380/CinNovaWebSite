/**
 * Shared CinNova News editorial helpers for Node scripts.
 * Drafts live outside newsPosts and never enter public SEO surfaces.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
    NEWS_COVERAGE_KEYS,
    NEWS_SOURCE_TYPE_KEYS,
    NEWS_STATUSES,
    newsPosts,
} from "../../src/data/newsPosts.js";
import { getPublishedBlogPosts } from "../../src/data/blogPosts.js";

export { NEWS_COVERAGE_KEYS, NEWS_SOURCE_TYPE_KEYS, NEWS_STATUSES, newsPosts };

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const DRAFTS_DIR = path.join(ROOT, "src", "data", "news-drafts");
export const NEWS_POSTS_PATH = path.join(ROOT, "src", "data", "newsPosts.js");
export const PUBLIC_DIR = path.join(ROOT, "public");
export const NEWS_IMAGES_DIR = path.join(PUBLIC_DIR, "images", "news");

export const REQUIRED_STORY_FIELDS = [
    "id",
    "slug",
    "title",
    "dek",
    "coverageLevel",
    "category",
    "location",
    "author",
    "publishedAt",
    "status",
    "heroImage",
    "heroAlt",
    "summary",
    "whyItMatters",
    "seoTitle",
    "seoDescription",
];

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PLACEHOLDER_URL_RE = /example\.com|replace-me|TODO|todo\.invalid/i;
const PLACEHOLDER_TEXT_RE = /^(TODO|TBD|\[.?\]|\s*)$/i;

export function ensureDraftsDir() {
    mkdirSync(DRAFTS_DIR, { recursive: true });
}

export function ensureNewsImageDirs() {
    for (const level of NEWS_COVERAGE_KEYS) {
        mkdirSync(path.join(NEWS_IMAGES_DIR, level), { recursive: true });
    }
}

export function draftFilePath(slug) {
    return path.join(DRAFTS_DIR, `${slug}.json`);
}

export function loadNewsDrafts() {
    ensureDraftsDir();
    return readdirSync(DRAFTS_DIR)
        .filter((name) => name.endsWith(".json"))
        .map((name) => {
            const filePath = path.join(DRAFTS_DIR, name);
            const raw = readFileSync(filePath, "utf8");
            const story = JSON.parse(raw);
            return { ...story, __draftFile: filePath };
        })
        .sort((a, b) => String(a.slug).localeCompare(String(b.slug)));
}

export function loadNewsDraftBySlug(slug) {
    const filePath = draftFilePath(slug);
    if (!existsSync(filePath)) return null;
    const story = JSON.parse(readFileSync(filePath, "utf8"));
    return { ...story, __draftFile: filePath };
}

export function writeNewsDraft(story) {
    ensureDraftsDir();
    if (!story?.slug) throw new Error("Draft requires a slug");
    const payload = { ...story };
    delete payload.__draftFile;
    const filePath = draftFilePath(story.slug);
    writeFileSync(filePath, `${JSON.stringify(payload, null, 4)}\n`, "utf8");
    return filePath;
}

export function deleteNewsDraft(slug) {
    const filePath = draftFilePath(slug);
    if (existsSync(filePath)) unlinkSync(filePath);
    return filePath;
}

export function resolveHeroFilesystemPath(heroImage = "") {
    if (!heroImage || typeof heroImage !== "string") return null;
    if (/^https?:\/\//i.test(heroImage)) return null;
    const relative = heroImage.startsWith("/") ? heroImage.slice(1) : heroImage;
    return path.join(PUBLIC_DIR, relative);
}

export function heroImageExists(heroImage = "") {
    if (/^https?:\/\//i.test(heroImage)) return true;
    const filePath = resolveHeroFilesystemPath(heroImage);
    return Boolean(filePath && existsSync(filePath));
}

function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}

function isPlaceholderText(value) {
    if (!isNonEmptyString(value)) return true;
    return PLACEHOLDER_TEXT_RE.test(value.trim());
}

function pushIssue(bucket, severity, scope, message) {
    bucket.push({ severity, scope, message });
}

/**
 * Validate one story.
 * @param {object} story
 * @param {{ mode?: "draft" | "publish" | "catalog", knownIds?: Set<string>, knownSlugs?: Set<string>, blogSlugs?: Set<string>, newsById?: Map<string, object> }} options
 */
export function validateNewsStory(story, options = {}) {
    const mode = options.mode || "catalog";
    const issues = [];
    const scope = story?.slug || story?.id || "(unknown story)";
    const fail = (message) => pushIssue(issues, "error", scope, message);
    const warn = (message) => pushIssue(issues, "warning", scope, message);
    // Incomplete drafts must fail `npm run validate:news` with actionable errors,
    // not silent warnings. Publish mode uses the same structural failures.
    const softFail = (message) => fail(message);

    if (!story || typeof story !== "object") {
        fail("story must be an object");
        return issues;
    }

    for (const field of REQUIRED_STORY_FIELDS) {
        if (field === "updatedAt") continue;
        if (!isNonEmptyString(story[field])) {
            softFail(`missing required field \`${field}\``);
        } else if (mode !== "catalog" && isPlaceholderText(story[field]) && field !== "updatedAt") {
            softFail(`\`${field}\` still looks like a placeholder`);
        }
    }

    if (story.updatedAt != null && story.updatedAt !== "" && !isNonEmptyString(story.updatedAt)) {
        fail("`updatedAt` must be null, empty, or an ISO timestamp string");
    }

    if (isNonEmptyString(story.id) && !ID_RE.test(story.id)) {
        fail(`invalid id \`${story.id}\` (use lowercase kebab-case)`);
    }
    if (isNonEmptyString(story.slug) && !SLUG_RE.test(story.slug)) {
        fail(`invalid slug \`${story.slug}\` (use lowercase kebab-case)`);
    }

    if (isNonEmptyString(story.coverageLevel) && !NEWS_COVERAGE_KEYS.includes(story.coverageLevel)) {
        fail(`invalid coverageLevel \`${story.coverageLevel}\``);
    }
    if (isNonEmptyString(story.status) && !NEWS_STATUSES.includes(story.status)) {
        fail(`invalid status \`${story.status}\``);
    }

    const publishedAtMs = Date.parse(story.publishedAt || "");
    if (isNonEmptyString(story.publishedAt) && Number.isNaN(publishedAtMs)) {
        fail(`invalid publishedAt timestamp \`${story.publishedAt}\``);
    }
    if (story.updatedAt && isNonEmptyString(story.updatedAt)) {
        const updatedAtMs = Date.parse(story.updatedAt);
        if (Number.isNaN(updatedAtMs)) fail(`invalid updatedAt timestamp \`${story.updatedAt}\``);
    }

    if (!Number.isNaN(publishedAtMs)) {
        const aheadMs = publishedAtMs - Date.now();
        if (aheadMs > 24 * 60 * 60 * 1000) {
            if (mode === "publish") {
                fail(
                    `publishedAt is more than 24h in the future (${story.publishedAt}). Refusing accidental future dating.`,
                );
            } else {
                warn(`publishedAt is in the future (${story.publishedAt})`);
            }
        }
    }

    if (typeof story.isPublished !== "boolean") {
        softFail("`isPublished` must be a boolean");
    }
    if (typeof story.isDemo !== "boolean") {
        softFail("`isDemo` must be a boolean");
    }

    if (mode === "draft") {
        if (story.isPublished === true) {
            fail("drafts must set isPublished: false");
        }
        if (story.isDraft !== true) {
            warn("drafts should set isDraft: true");
        }
    }

    if (mode === "publish") {
        if (story.isPublished !== true) fail("publish requires isPublished: true");
        if (story.isDemo === true) {
            fail("refusing to publish isDemo: true — demos are not sourced reporting");
        }
    }
    if (mode === "catalog" && story.isDemo === true) {
        warn("isDemo: true — excluded from sitemap and prerender (layout fixture only)");
    }
    if (story.isDraft === true && mode === "publish") {
        warn("isDraft will be removed on publish");
    }

    if (isNonEmptyString(story.heroAlt) && story.heroAlt.trim().length < 8) {
        softFail("heroAlt should be descriptive (at least 8 characters)");
    }

    if (isNonEmptyString(story.heroImage)) {
        if (!heroImageExists(story.heroImage)) {
            if (mode === "publish") fail(`hero image missing on disk: ${story.heroImage}`);
            else softFail(`hero image missing on disk: ${story.heroImage}`);
        }
        if (
            mode === "publish" &&
            story.heroImage.startsWith("/images/news/") &&
            isNonEmptyString(story.coverageLevel) &&
            !story.heroImage.startsWith(`/images/news/${story.coverageLevel}/`)
        ) {
            warn(
                `heroImage is under /images/news/ but not in the ${story.coverageLevel}/ subfolder (preferred convention)`,
            );
        }
    }

    if (mode !== "draft" && !isNonEmptyString(story.heroCaption)) {
        softFail("published stories need heroCaption clarifying library vs event photography");
    }

    if (!Array.isArray(story.sections) || story.sections.length === 0) {
        softFail("sections must be a non-empty array");
    } else {
        const sectionIds = new Set();
        for (const [index, section] of story.sections.entries()) {
            const label = `sections[${index}]`;
            if (!isNonEmptyString(section?.id)) softFail(`${label}.id is required`);
            else if (sectionIds.has(section.id)) fail(`${label}.id duplicate \`${section.id}\``);
            else sectionIds.add(section.id);

            if (!isNonEmptyString(section?.heading)) softFail(`${label}.heading is required`);
            if (section?.claimType && !NEWS_SOURCE_TYPE_KEYS.includes(section.claimType)) {
                fail(`${label}.claimType must be one of ${NEWS_SOURCE_TYPE_KEYS.join(", ")}`);
            }
            if (!Array.isArray(section?.body) || section.body.length === 0) {
                softFail(`${label}.body must be a non-empty string array`);
            } else {
                for (const [pIndex, paragraph] of section.body.entries()) {
                    if (!isNonEmptyString(paragraph) || isPlaceholderText(paragraph)) {
                        softFail(`${label}.body[${pIndex}] is empty or placeholder`);
                    }
                }
                if (!section.claimType) {
                    warn(`${label} has no claimType (verified|official|claim)`);
                }
            }
        }
    }

    if (!Array.isArray(story.sources) || story.sources.length < 2) {
        softFail("sources must include at least two labeled entries");
    } else {
        for (const [index, source] of story.sources.entries()) {
            const label = `sources[${index}]`;
            if (!isNonEmptyString(source?.label)) softFail(`${label}.label is required`);
            if (!isNonEmptyString(source?.url)) softFail(`${label}.url is required`);
            else {
                try {
                    const parsed = new URL(source.url);
                    if (!/^https?:$/i.test(parsed.protocol)) fail(`${label}.url must be http(s)`);
                } catch {
                    fail(`${label}.url is not a valid URL`);
                }
                if (PLACEHOLDER_URL_RE.test(source.url)) {
                    softFail(`${label}.url still looks like a placeholder`);
                }
            }
            if (!NEWS_SOURCE_TYPE_KEYS.includes(source?.type)) {
                fail(`${label}.type must be one of ${NEWS_SOURCE_TYPE_KEYS.join(", ")}`);
            }
        }
    }

    const claimSections = (story.sections || []).filter((section) => section?.claimType === "claim");
    if (claimSections.length) {
        const hasClaimSource = (story.sources || []).some((source) => source?.type === "claim");
        if (!hasClaimSource) {
            warn("sections use claimType=claim but no source is labeled type=claim");
        }
    }

    if (isNonEmptyString(story.seoTitle) && story.seoTitle.length > 70) {
        warn(`seoTitle is ${story.seoTitle.length} characters (recommended ≤ 70)`);
    }
    if (isNonEmptyString(story.seoDescription) && story.seoDescription.length > 180) {
        warn(`seoDescription is ${story.seoDescription.length} characters (recommended ≤ 180)`);
    }

    if (options.knownIds instanceof Set && isNonEmptyString(story.id) && options.knownIds.has(story.id)) {
        fail(`duplicate id \`${story.id}\``);
    }
    if (options.knownSlugs instanceof Set && isNonEmptyString(story.slug) && options.knownSlugs.has(story.slug)) {
        fail(`duplicate slug \`${story.slug}\``);
    }

    const newsById = options.newsById || new Map(newsPosts.map((entry) => [entry.id, entry]));
    for (const relatedId of story.relatedNewsIds || []) {
        if (!newsById.has(relatedId)) {
            softFail(`relatedNewsIds references unknown id \`${relatedId}\``);
        } else {
            const related = newsById.get(relatedId);
            if (related?.isPublished === false || related?.isDemo === true) {
                warn(`relatedNewsIds \`${relatedId}\` is not a public story`);
            }
        }
    }

    const blogSlugs =
        options.blogSlugs || new Set(getPublishedBlogPosts().map((post) => post.slug));
    for (const relatedSlug of story.relatedBlogSlugs || []) {
        if (!blogSlugs.has(relatedSlug)) {
            softFail(`relatedBlogSlugs references unpublished/unknown slug \`${relatedSlug}\``);
        }
    }

    if (["breaking", "developing"].includes(story.status) && mode === "publish") {
        warn(
            `status=${story.status} is reserved for live desk use — confirm this story is actively developing before shipping`,
        );
    }

    return issues;
}

export function collectCatalogIssues() {
    const drafts = loadNewsDrafts();
    const blogSlugs = new Set(getPublishedBlogPosts().map((post) => post.slug));
    const newsById = new Map(newsPosts.map((entry) => [entry.id, entry]));
    const issues = [];

    const catalogIds = new Set();
    const catalogSlugs = new Set();
    for (const story of newsPosts) {
        const storyIssues = validateNewsStory(story, {
            mode: "catalog",
            knownIds: catalogIds,
            knownSlugs: catalogSlugs,
            blogSlugs,
            newsById,
        });
        issues.push(...storyIssues);
        if (isNonEmptyString(story.id)) catalogIds.add(story.id);
        if (isNonEmptyString(story.slug)) catalogSlugs.add(story.slug);

        if (story.isDraft === true) {
            issues.push({
                severity: "error",
                scope: story.slug || story.id,
                message: "draft flag found inside newsPosts.js — drafts must live in news-drafts/",
            });
        }
    }

    const draftIds = new Set(catalogIds);
    const draftSlugs = new Set(catalogSlugs);
    for (const draft of drafts) {
        const draftIssues = validateNewsStory(draft, {
            mode: "draft",
            knownIds: draftIds,
            knownSlugs: draftSlugs,
            blogSlugs,
            newsById,
        });
        issues.push(...draftIssues);
        if (isNonEmptyString(draft.id)) draftIds.add(draft.id);
        if (isNonEmptyString(draft.slug)) draftSlugs.add(draft.slug);
    }

    return { issues, catalogCount: newsPosts.length, draftCount: drafts.length };
}

export function normalizeStoryForPublish(draft) {
    const story = { ...draft };
    delete story.__draftFile;
    delete story.isDraft;
    delete story.editorialNotes;
    story.isPublished = true;
    story.isDemo = false;
    if (story.updatedAt === "") story.updatedAt = null;
    return story;
}

/** Pretty-print a JS object literal matching newsPosts style (4-space indent). */
export function toNewsPostsLiteral(value, indent = 1) {
    const pad = "    ".repeat(indent);
    const padIn = "    ".repeat(indent + 1);

    if (value === null) return "null";
    if (typeof value === "boolean" || typeof value === "number") return String(value);
    if (typeof value === "string") return JSON.stringify(value);

    if (Array.isArray(value)) {
        if (value.length === 0) return "[]";
        if (value.every((item) => typeof item === "string")) {
            if (value.length <= 2 && value.join("").length < 60) {
                return `[${value.map((item) => JSON.stringify(item)).join(", ")}]`;
            }
            return `[\n${value.map((item) => `${padIn}${JSON.stringify(item)},`).join("\n")}\n${pad}]`;
        }
        const items = value.map((item) => `${padIn}${toNewsPostsLiteral(item, indent + 1)},`).join("\n");
        return `[\n${items}\n${pad}]`;
    }

    if (typeof value === "object") {
        const keys = Object.keys(value);
        if (keys.length === 0) return "{}";
        const lines = keys.map((key) => {
            const printed = toNewsPostsLiteral(value[key], indent + 1);
            return `${padIn}${key}: ${printed},`;
        });
        return `{\n${lines.join("\n")}\n${pad}}`;
    }

    return JSON.stringify(value);
}

export function promoteDraftIntoNewsPosts(story) {
    const source = readFileSync(NEWS_POSTS_PATH, "utf8");
    const marker = "\n];\n\n/* ── URLs";
    const index = source.indexOf(marker);
    if (index === -1) {
        throw new Error("Could not locate newsPosts array closing marker in newsPosts.js");
    }

    if (newsPosts.some((entry) => entry.id === story.id || entry.slug === story.slug)) {
        throw new Error(`Story id/slug already exists in newsPosts.js (${story.id} / ${story.slug})`);
    }

    const literal = toNewsPostsLiteral(story, 1);
    const insertion = `\n    ${literal},`;
    const next = `${source.slice(0, index)}${insertion}${source.slice(index)}`;
    writeFileSync(NEWS_POSTS_PATH, next, "utf8");
}

export function buildDraftSkeleton({
    slug,
    coverageLevel = "local",
    title = "",
    category = "",
    location = "",
    author = "Cin Nova News Desk",
} = {}) {
    if (!slug || !SLUG_RE.test(slug)) {
        throw new Error("Provide a lowercase kebab-case --slug");
    }
    if (!NEWS_COVERAGE_KEYS.includes(coverageLevel)) {
        throw new Error(`--coverage must be one of: ${NEWS_COVERAGE_KEYS.join(", ")}`);
    }

    const now = new Date();
    const stamp = now.toISOString();
    const yyyy = String(now.getUTCFullYear());
    const mm = String(now.getUTCMonth() + 1).padStart(2, "0");

    return {
        id: `news-${coverageLevel}-${yyyy}-${mm}-${slug}`.replace(/[^a-z0-9-]/g, "-"),
        slug,
        title: title || "",
        dek: "",
        coverageLevel,
        category: category || "",
        location: location || "",
        author,
        publishedAt: stamp,
        updatedAt: null,
        status: "standard",
        isPublished: false,
        isDemo: false,
        isDraft: true,
        heroImage: `/images/news/${coverageLevel}/${slug}.jpg`,
        heroAlt: "",
        heroCaption:
            "Library image used for illustration. It is not a photograph of the event, place, or people described in this story.",
        summary: "",
        whyItMatters: "",
        sections: [
            {
                id: "what-happened",
                heading: "",
                claimType: "verified",
                body: [""],
            },
            {
                id: "why-it-matters-detail",
                heading: "",
                claimType: "verified",
                body: [""],
            },
        ],
        sources: [
            {
                label: "",
                publisher: "",
                url: "https://example.com/replace-me-source-1",
                type: "verified",
                note: "",
            },
            {
                label: "",
                publisher: "",
                url: "https://example.com/replace-me-source-2",
                type: "official",
                note: "",
            },
        ],
        relatedNewsIds: [],
        relatedBlogSlugs: [],
        seoTitle: "",
        seoDescription: "",
        editorialNotes:
            "DRAFT — fill every field from sourced reporting. Do not invent events, quotes, or statistics. Run npm run validate:news and preview locally before publish.",
    };
}

export function formatIssues(issues) {
    return issues.map((issue) => `[${issue.severity}] ${issue.scope}: ${issue.message}`);
}
