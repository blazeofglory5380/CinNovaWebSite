/**
 * Shared CinNova Blog editorial helpers for Node scripts.
 * Drafts live outside blogPosts and never enter public SEO surfaces.
 */

import {
    existsSync,
    mkdirSync,
    readdirSync,
    readFileSync,
    unlinkSync,
    writeFileSync,
    statSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { blogPosts, getPublishedBlogPosts } from "../../src/data/blogPosts.js";
import { newsPosts, getPublicNewsStories } from "../../src/data/newsPosts.js";

export { blogPosts, getPublishedBlogPosts, newsPosts };

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const DRAFTS_DIR = path.join(ROOT, "src", "data", "blog-drafts");
export const BLOG_POSTS_PATH = path.join(ROOT, "src", "data", "blogPosts.js");
export const PUBLIC_DIR = path.join(ROOT, "public");
export const EDITORIAL_REPORTS_DIR = path.join(ROOT, "editorial-reports");

export const BLOG_CATEGORIES = [
    "Artificial Intelligence",
    "AI News",
    "Real Estate Technology",
    "Education Technology",
    "Healthcare Technology",
    "Construction Technology",
    "Data Centers & Databases",
    "Robotics & Automation",
    "Future Technology",
    "Business & Entrepreneurship",
    "CinNova Updates",
];

export const REQUIRED_BLOG_FIELDS = [
    "id",
    "slug",
    "title",
    "category",
    "excerpt",
    "date",
    "author",
    "status",
    "tags",
    "content",
];

export const REQUIRED_PUBLISH_SEO_FIELDS = [
    "seoTitle",
    "seoDescription",
    "heroImage",
    "heroImageAlt",
];

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PLACEHOLDER_URL_RE = /example\.com|replace-me|TODO|todo\.invalid/i;
const PLACEHOLDER_TEXT_RE = /^(TODO|TBD|\[.?\]|\s*)$/i;
const FULL_ARTICLES_CLOSE_RE = /\r?\n\];\r?\n\r?\nconst cornerstoneRelated\s*=/;

export function ensureDraftsDir() {
    mkdirSync(DRAFTS_DIR, { recursive: true });
}

export function ensureReportsDir() {
    mkdirSync(EDITORIAL_REPORTS_DIR, { recursive: true });
}

export function draftFilePath(slug) {
    return path.join(DRAFTS_DIR, `${slug}.json`);
}

export function loadBlogDrafts() {
    ensureDraftsDir();
    return readdirSync(DRAFTS_DIR)
        .filter((name) => name.endsWith(".json"))
        .map((name) => {
            const filePath = path.join(DRAFTS_DIR, name);
            const post = JSON.parse(readFileSync(filePath, "utf8"));
            return { ...post, __draftFile: filePath };
        })
        .sort((a, b) => String(a.slug).localeCompare(String(b.slug)));
}

export function loadBlogDraftBySlug(slug) {
    const filePath = draftFilePath(slug);
    if (!existsSync(filePath)) return null;
    const post = JSON.parse(readFileSync(filePath, "utf8"));
    return { ...post, __draftFile: filePath };
}

export function writeBlogDraft(post) {
    ensureDraftsDir();
    if (!post?.slug) throw new Error("Draft requires a slug");
    const payload = { ...post };
    delete payload.__draftFile;
    const filePath = draftFilePath(post.slug);
    writeFileSync(filePath, `${JSON.stringify(payload, null, 4)}\n`, "utf8");
    return filePath;
}

export function deleteBlogDraft(slug) {
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

export function getArticleSeoTitle(post) {
    return (post?.seoTitle || "").trim() || `${post?.title || ""} | CinNova Blog`;
}

export function getArticleSeoDescription(post) {
    return (post?.seoDescription || post?.metaDescription || post?.excerpt || "").trim();
}

export function nextBlogNumericId(existing = blogPosts) {
    const max = existing.reduce((acc, post) => {
        const id = Number(post.id);
        return Number.isFinite(id) ? Math.max(acc, id) : acc;
    }, 0);
    return max + 1;
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

function wordCountFromContent(content = []) {
    if (!Array.isArray(content)) return 0;
    return content.reduce((sum, section) => {
        const heading = section?.heading || "";
        const body = Array.isArray(section?.body)
            ? section.body.join(" ")
            : section?.body || "";
        return sum + `${heading} ${body}`.trim().split(/\s+/).filter(Boolean).length;
    }, 0);
}

function tokenize(text = "") {
    return new Set(
        String(text)
            .toLowerCase()
            .split(/[^a-z0-9]+/)
            .filter((token) => token.length > 3),
    );
}

function jaccard(a, b) {
    if (!a.size || !b.size) return 0;
    let shared = 0;
    for (const token of a) if (b.has(token)) shared += 1;
    return shared / (a.size + b.size - shared);
}

/**
 * Validate one blog post or draft.
 */
export function validateBlogPost(post, options = {}) {
    const mode = options.mode || "catalog";
    const issues = [];
    const scope = post?.slug || String(post?.id ?? "(unknown post)");
    const fail = (message) => pushIssue(issues, "error", scope, message);
    const warn = (message) => pushIssue(issues, "warning", scope, message);
    const softFail = mode === "catalog" ? warn : fail;

    if (!post || typeof post !== "object") {
        fail("post must be an object");
        return issues;
    }

    for (const field of REQUIRED_BLOG_FIELDS) {
        if (field === "tags" || field === "content") {
            if (!Array.isArray(post[field]) || post[field].length === 0) {
                softFail(`missing required field \`${field}\``);
            }
            continue;
        }
        if (field === "id") {
            if (post.id == null || post.id === "") softFail("missing required field `id`");
            continue;
        }
        if (!isNonEmptyString(post[field])) {
            softFail(`missing required field \`${field}\``);
        } else if (mode !== "catalog" && isPlaceholderText(post[field])) {
            softFail(`\`${field}\` still looks like a placeholder`);
        }
    }

    if (isNonEmptyString(post.slug) && !SLUG_RE.test(post.slug)) {
        fail("slug must be lowercase kebab-case");
    }

    if (options.knownSlugs?.has(post.slug) && mode === "publish") {
        fail(`slug already exists in published catalog: ${post.slug}`);
    }
    if (options.knownIds?.has(post.id) && mode === "publish") {
        fail(`id already exists in published catalog: ${post.id}`);
    }

    const status = post.status || "";
    if (mode === "catalog") {
        if (!["published", "planned", "draft"].includes(status)) {
            warn(`unexpected status "${status}"`);
        }
    } else if (mode === "draft") {
        if (status && status !== "draft") warn(`draft status should be "draft" (got "${status}")`);
    } else if (mode === "publish") {
        if (status && !["draft", "published"].includes(status)) {
            fail(`cannot publish status "${status}"`);
        }
    }

    const seoTitle = (post.seoTitle || "").trim();
    const seoDescription = getArticleSeoDescription(post);
    if (!seoTitle) {
        softFail("missing seoTitle (will fall back to title | CinNova Blog)");
    } else {
        if (seoTitle.length < 30) warn("seoTitle is short (< 30 chars)");
        if (seoTitle.length > 70) warn("seoTitle is long (> 70 chars)");
    }
    if (!seoDescription) {
        softFail("missing seoDescription / metaDescription / excerpt");
    } else {
        if (seoDescription.length < 70) warn("SEO description is short (< 70 chars)");
        if (seoDescription.length > 165) warn("SEO description is long (> 165 chars)");
    }

    const expectedCanonical = `https://getcinnova.com/blog/${post.slug}`;
    if (post.canonical && post.canonical !== expectedCanonical) {
        fail(`canonical mismatch: expected ${expectedCanonical}`);
    }

    const hero = post.heroImage || post.ogImage || "";
    if (!hero) {
        softFail("missing heroImage");
    } else if (!heroImageExists(hero)) {
        fail(`hero image path missing on disk: ${hero}`);
    } else {
        const fsPath = resolveHeroFilesystemPath(hero);
        if (fsPath && existsSync(fsPath)) {
            const size = statSync(fsPath).size;
            if (size > 1_500_000) warn(`hero image is large (${Math.round(size / 1024)} KB): ${hero}`);
            if (size < 8_000) warn(`hero image is unusually small (${size} bytes): ${hero}`);
        }
    }
    if (!isNonEmptyString(post.heroImageAlt || post.heroAlt)) {
        softFail("missing heroImageAlt");
    }

    const related = post.relatedReading || [];
    if (Array.isArray(related)) {
        for (const relatedSlug of related) {
            if (!options.publishedSlugs?.has(relatedSlug)) {
                fail(`relatedReading slug does not resolve to a published post: ${relatedSlug}`);
            }
        }
    }

    for (const id of post.relatedNewsIds || []) {
        if (!options.newsIds?.has(id)) {
            fail(`relatedNewsIds entry does not resolve to a public news story: ${id}`);
        }
    }
    for (const newsSlug of post.relatedNewsSlugs || []) {
        if (!options.newsSlugs?.has(newsSlug)) {
            fail(`relatedNewsSlugs entry does not resolve to a public news story: ${newsSlug}`);
        }
    }

    const words = wordCountFromContent(post.content);
    if (mode !== "catalog" || status === "published") {
        if (words > 0 && words < 350) warn(`thin content (~${words} words)`);
        if (words === 0 && status === "published") fail("published post has empty content");
    }

    const headings = (post.content || []).map((section) => section?.heading || "").filter(Boolean);
    if (status === "published" || mode === "publish") {
        if (headings.length < 2) warn("weak heading hierarchy (< 2 section headings)");
        const emptyHeadings = (post.content || []).filter(
            (section) => !isNonEmptyString(section?.heading),
        );
        if (emptyHeadings.length) warn(`${emptyHeadings.length} section(s) missing headings`);
    }

    const sources = post.sources || post.citations || [];
    if (Array.isArray(sources) && sources.length) {
        for (const [index, source] of sources.entries()) {
            const url = source?.url || "";
            if (!url) warn(`source[${index}] missing url`);
            else if (PLACEHOLDER_URL_RE.test(url)) {
                softFail(`source[${index}] still uses a placeholder URL`);
            }
        }
    } else if ((status === "published" || mode === "publish") && words >= 800) {
        warn(
            "research-heavy length without sources/citations array — add attribution if claims are researched",
        );
    }

    if (mode === "publish") {
        for (const field of REQUIRED_PUBLISH_SEO_FIELDS) {
            if (field === "seoDescription") {
                if (!isNonEmptyString(seoDescription) || isPlaceholderText(seoDescription)) {
                    fail("missing publish-ready seoDescription");
                }
                continue;
            }
            const value = post[field];
            if (!isNonEmptyString(value) || isPlaceholderText(value)) {
                fail(`missing publish-ready field \`${field}\``);
            }
        }
        if (words < 500) fail(`publish blocked: content too thin (~${words} words)`);
        if (PLACEHOLDER_URL_RE.test(JSON.stringify(post.sources || []))) {
            fail("publish blocked: placeholder source URLs remain");
        }
    }

    return issues;
}

export function formatIssues(issues = []) {
    return issues.map(
        (issue) => `[${issue.severity.toUpperCase()}] ${issue.scope}: ${issue.message}`,
    );
}

export function collectBlogCatalogIssues() {
    const published = getPublishedBlogPosts();
    const drafts = loadBlogDrafts();
    const publicNews = getPublicNewsStories();
    const newsIds = new Set(publicNews.map((story) => story.id));
    const newsSlugs = new Set(publicNews.map((story) => story.slug));
    const publishedSlugs = new Set(published.map((post) => post.slug));
    const issues = [];

    const idCounts = new Map();
    const slugCounts = new Map();
    const titleCounts = new Map();
    const descCounts = new Map();
    const heroCounts = new Map();
    const inbound = new Map(published.map((post) => [post.slug, 0]));

    for (const post of blogPosts) {
        idCounts.set(post.id, (idCounts.get(post.id) || 0) + 1);
        slugCounts.set(post.slug, (slugCounts.get(post.slug) || 0) + 1);
    }

    for (const [id, count] of idCounts) {
        if (count > 1) pushIssue(issues, "error", String(id), `duplicate id used ${count} times`);
    }
    for (const [slug, count] of slugCounts) {
        if (count > 1) pushIssue(issues, "error", slug, `duplicate slug used ${count} times`);
    }

    for (const post of published) {
        issues.push(
            ...validateBlogPost(post, {
                mode: "catalog",
                newsIds,
                newsSlugs,
                publishedSlugs,
            }),
        );

        const titleKey = String(post.title || "").trim().toLowerCase();
        const descKey = getArticleSeoDescription(post).trim().toLowerCase();
        if (titleKey) titleCounts.set(titleKey, [...(titleCounts.get(titleKey) || []), post.slug]);
        if (descKey) descCounts.set(descKey, [...(descCounts.get(descKey) || []), post.slug]);
        if (post.heroImage) {
            heroCounts.set(post.heroImage, [...(heroCounts.get(post.heroImage) || []), post.slug]);
        }

        for (const relatedSlug of post.relatedReading || []) {
            if (inbound.has(relatedSlug)) {
                inbound.set(relatedSlug, inbound.get(relatedSlug) + 1);
            }
        }
    }

    for (const [title, slugs] of titleCounts) {
        if (slugs.length > 1) {
            pushIssue(issues, "error", slugs.join(", "), `duplicate titles: "${title}"`);
        }
    }
    for (const [, slugs] of descCounts) {
        if (slugs.length > 1) {
            pushIssue(issues, "warning", slugs.join(", "), "duplicate SEO descriptions");
        }
    }
    for (const [hero, slugs] of heroCounts) {
        if (slugs.length > 1) {
            pushIssue(issues, "warning", slugs.join(", "), `shared hero image: ${hero}`);
        }
    }

    for (const [slug, count] of inbound) {
        if (count === 0) {
            pushIssue(issues, "warning", slug, "orphan article (no inbound relatedReading links)");
        } else if (count === 1) {
            pushIssue(
                issues,
                "warning",
                slug,
                "weakly linked article (only 1 inbound relatedReading link)",
            );
        }
    }

    const tokensBySlug = published.map((post) => ({
        slug: post.slug,
        tokens: tokenize(`${post.title} ${post.excerpt} ${(post.seoKeywords || []).join(" ")}`),
        category: post.category,
    }));
    for (let i = 0; i < tokensBySlug.length; i += 1) {
        for (let j = i + 1; j < tokensBySlug.length; j += 1) {
            const left = tokensBySlug[i];
            const right = tokensBySlug[j];
            const score = jaccard(left.tokens, right.tokens);
            if (score >= 0.55 && left.category === right.category) {
                pushIssue(
                    issues,
                    "warning",
                    `${left.slug} ↔ ${right.slug}`,
                    `potential keyword cannibalization / near-duplicate topic (similarity ${score.toFixed(2)})`,
                );
            }
        }
    }

    for (const draft of drafts) {
        issues.push(
            ...validateBlogPost(draft, {
                mode: "draft",
                knownIds: new Set(blogPosts.map((post) => post.id)),
                knownSlugs: new Set(blogPosts.map((post) => post.slug)),
                newsIds,
                newsSlugs,
                publishedSlugs,
            }),
        );
        if (draft.status === "published") {
            pushIssue(issues, "error", draft.slug, "draft JSON must not use status=published");
        }
        if (publishedSlugs.has(draft.slug)) {
            pushIssue(issues, "error", draft.slug, "draft slug collides with a published post");
        }
    }

    return {
        issues,
        catalogCount: blogPosts.length,
        publishedCount: published.length,
        plannedCount: blogPosts.filter((post) => post.status === "planned").length,
        draftCount: drafts.length,
    };
}

function escapeForJsString(value = "") {
    return String(value).replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

function toBlogPostsLiteral(post, indent = 1) {
    const pad = "    ".repeat(indent);
    const inner = "    ".repeat(indent + 1);
    const content = (post.content || [])
        .map((section) => {
            const body =
                typeof section.body === "string"
                    ? `\`${escapeForJsString(section.body)}\``
                    : JSON.stringify(section.body ?? "");
            return `${inner}{\n${inner}    heading: \`${escapeForJsString(section.heading || "")}\`,\n${inner}    body:\n${inner}        ${body},\n${inner}}`;
        })
        .join(",\n");

    const lines = [
        `{`,
        `${inner}id: ${Number(post.id)},`,
        `${inner}title: \`${escapeForJsString(post.title)}\`,`,
        `${inner}slug: "${post.slug}",`,
        `${inner}category: \`${escapeForJsString(post.category)}\`,`,
        `${inner}excerpt:`,
        `${inner}    \`${escapeForJsString(post.excerpt)}\`,`,
        `${inner}date: "${post.date}",`,
        `${inner}readTime: "${post.readTime || "6 min read"}",`,
        `${inner}author,`,
        `${inner}tags: ${JSON.stringify(post.tags || [])},`,
        `${inner}seoKeywords: ${JSON.stringify(post.seoKeywords || [])},`,
        `${inner}seoTitle: \`${escapeForJsString(post.seoTitle || "")}\`,`,
        `${inner}seoDescription:`,
        `${inner}    \`${escapeForJsString(post.seoDescription || post.metaDescription || "")}\`,`,
        `${inner}heroImage: "${post.heroImage || ""}",`,
        `${inner}heroImageAlt: \`${escapeForJsString(post.heroImageAlt || "")}\`,`,
        ...(post.heroImageCaption
            ? [`${inner}heroImageCaption: \`${escapeForJsString(post.heroImageCaption)}\`,`]
            : []),
        ...(post.ogImage ? [`${inner}ogImage: "${post.ogImage}",`] : []),
        ...(post.relatedReading?.length
            ? [`${inner}relatedReading: ${JSON.stringify(post.relatedReading)},`]
            : []),
        ...(post.relatedNewsIds?.length
            ? [`${inner}relatedNewsIds: ${JSON.stringify(post.relatedNewsIds)},`]
            : []),
        `${inner}featured: ${Boolean(post.featured)},`,
        `${inner}trending: ${Boolean(post.trending)},`,
        `${inner}popular: ${Boolean(post.popular)},`,
        `${inner}status: "published",`,
        `${inner}content: [`,
        content,
        `${inner}],`,
        `${pad}}`,
    ];
    return lines.join("\n");
}

export function normalizeBlogForPublish(draft) {
    const now = new Date();
    const date =
        draft.date && !isPlaceholderText(draft.date)
            ? draft.date
            : now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    return {
        ...draft,
        id: draft.id ?? nextBlogNumericId(),
        status: "published",
        date,
        seoTitle: draft.seoTitle || `${draft.title} | CinNova`,
        seoDescription: getArticleSeoDescription(draft),
        heroImageAlt: draft.heroImageAlt || draft.heroAlt || draft.title,
        readTime: draft.readTime || "6 min read",
        featured: Boolean(draft.featured),
        trending: Boolean(draft.trending),
        popular: Boolean(draft.popular),
    };
}

export function promoteDraftIntoBlogPosts(post) {
    const source = readFileSync(BLOG_POSTS_PATH, "utf8");
    const markerMatch = source.match(FULL_ARTICLES_CLOSE_RE);
    if (!markerMatch) {
        throw new Error(
            "Could not locate fullArticles close marker before cornerstoneRelated in blogPosts.js",
        );
    }
    const index = markerMatch.index;

    if (blogPosts.some((entry) => entry.id === post.id || entry.slug === post.slug)) {
        throw new Error(`Post id/slug already exists in blogPosts.js (${post.id} / ${post.slug})`);
    }

    const nl = source.includes("\r\n") ? "\r\n" : "\n";
    const literal = toBlogPostsLiteral(post, 1);
    const insertion = `${nl}    ${literal},`;
    const next = `${source.slice(0, index)}${insertion}${source.slice(index)}`;
    writeFileSync(BLOG_POSTS_PATH, next, "utf8");
}

export function buildBlogDraftSkeleton({
    slug,
    category = "Artificial Intelligence",
    title = "",
    author = "CinNova Editorial Team",
    id = null,
} = {}) {
    if (!slug || !SLUG_RE.test(slug)) {
        throw new Error("Provide a lowercase kebab-case --slug");
    }
    if (!BLOG_CATEGORIES.includes(category)) {
        throw new Error(`--category must be one of: ${BLOG_CATEGORIES.join(", ")}`);
    }

    const now = new Date();
    const stamp = now.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return {
        id: id ?? nextBlogNumericId(),
        slug,
        title: title || "",
        category,
        excerpt: "",
        date: stamp,
        readTime: "6 min read",
        author,
        tags: [],
        seoKeywords: [],
        seoTitle: "",
        seoDescription: "",
        heroImage: `/images/blog/hero/${slug}.webp`,
        heroImageAlt: "",
        heroImageCaption: "",
        ogImage: "",
        relatedReading: [],
        relatedNewsIds: [],
        featured: false,
        trending: false,
        popular: false,
        status: "draft",
        content: [
            { heading: "", body: "" },
            { heading: "", body: "" },
            { heading: "Practical takeaway", body: "" },
        ],
        sources: [
            {
                label: "",
                publisher: "",
                url: "https://example.com/replace-me-source-1",
                note: "",
            },
        ],
        heroImageBrief: {
            concept: "",
            mood: "",
            mustInclude: [],
            avoid: ["fabricated logos", "readable fake UI text", "celebrity likenesses"],
            aspectRatio: "16:9",
            outputPath: `/images/blog/hero/${slug}.webp`,
        },
        editorialNotes: [
            "Do not invent sources, statistics, or current events.",
            "Fill seoTitle (~50–60 chars) and seoDescription (~140–155 chars).",
            "Suggest relatedReading only for published blog slugs that are genuinely relevant.",
            "Add relatedNewsIds only when a public News story is topically relevant.",
            "Replace placeholder source URLs before publish.",
        ],
        researchBrief: {
            primaryKeyword: "",
            secondaryKeywords: [],
            audience: "",
            searchIntent: "",
            competitorNotes: "",
            requiredInputsFromResearchAgent: [
                "Verified working title and angle",
                "2–4 credible source URLs with publisher + access date",
                "Outline of 3–6 H2 sections",
                "Suggested internal blog + news links (only if relevant)",
                "Hero image brief (mood, subject, avoid list)",
            ],
        },
    };
}
