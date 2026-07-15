import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
    blogCategories,
    getArticleUrl,
    getAuthorProfile,
    getPublishedBlogPosts,
    slugifyCategory,
} from "../src/data/blogPosts.js";
import { defaultOgImage, siteUrl } from "../src/data/seoConfig.js";
import { buildArticleSchema, getArticleMetadata } from "./seo-shared.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const validateDist = process.argv.includes("--dist");
const posts = getPublishedBlogPosts();
const postsBySlug = new Map(posts.map((post) => [post.slug, post]));
const errors = [];
const warnings = [];

function error(scope, message) {
    errors.push(`${scope}: ${message}`);
}

function warning(scope, message) {
    warnings.push(`${scope}: ${message}`);
}

function normalized(value) {
    return String(value || "").trim().replace(/\s+/g, " ").toLowerCase();
}

function checkUnique(field, label) {
    const seen = new Map();
    for (const post of posts) {
        const value = normalized(field(post));
        if (!value) {
            error(post.slug, `missing ${label}`);
        } else if (seen.has(value)) {
            error(post.slug, `duplicate ${label} also used by ${seen.get(value)}`);
        } else {
            seen.set(value, post.slug);
        }
    }
}

checkUnique((post) => post.title, "title/H1");
checkUnique((post) => post.seoDescription || post.excerpt, "meta description");
checkUnique((post) => post.slug, "slug");
checkUnique((post) => getArticleUrl(post), "canonical URL");

const articleTemplate = await readFile(path.join(root, "src", "pages", "ArticlePage.jsx"), "utf8");
const templateH1Count = (articleTemplate.match(/<h1>\{post\.title\}<\/h1>/g) || []).length;
if (templateH1Count !== 1) {
    error("ArticlePage.jsx", `expected one article H1 template, found ${templateH1Count}`);
}

for (const post of posts) {
    const scope = post.slug;
    const metadata = getArticleMetadata(post, { siteUrl, defaultOgImage });
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)) error(scope, "slug is not clean kebab-case");
    if (metadata.canonical !== `${siteUrl}/blog/${post.slug}`) error(scope, "canonical does not match clean article route");
    if (!metadata.canonical.startsWith("https://") || /[?#]/.test(metadata.canonical)) error(scope, "canonical must be absolute HTTPS without query or fragment");
    if (!post.title?.trim()) error(scope, "H1 title is empty");
    if (post.title.length < 30 || post.title.length > 70) warning(scope, `title is ${post.title.length} characters (recommended 30-70)`);
    if (metadata.description.length < 70 || metadata.description.length > 180) warning(scope, `description is ${metadata.description.length} characters (recommended 70-180)`);
    if (post.heroImage && !post.heroImageAlt?.trim()) error(scope, "hero image is missing alt text");
    for (const [index, section] of (post.content || []).entries()) {
        if (section.image && !section.imageAlt?.trim()) error(scope, `section ${index + 1} image is missing alt text`);
    }

    const related = post.relatedReading || [];
    if (related.length < 3) error(scope, `only ${related.length} related article links; expected at least 3`);
    if (new Set(related).size !== related.length) error(scope, "related article links contain duplicates");
    for (const slug of related) {
        if (slug === post.slug) error(scope, "related article links to itself");
        if (!postsBySlug.has(slug)) error(scope, `related article does not resolve: ${slug}`);
    }

    const schema = buildArticleSchema(
        post,
        related.map((slug) => postsBySlug.get(slug)).filter(Boolean),
        { siteUrl, defaultOgImage, author: getAuthorProfile(post.author) }
    );
    const graphTypes = new Set(schema["@graph"].map((node) => node["@type"]));
    if (!graphTypes.has("BlogPosting") || !graphTypes.has("BreadcrumbList")) {
        error(scope, "schema must contain BlogPosting and BreadcrumbList nodes");
    }
}

function decodeHtml(value = "") {
    return value
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
}

function extractAttribute(html, element, attribute, key) {
    const pattern = new RegExp(`<${element}[^>]+(?:name|property)=["']${key}["'][^>]+${attribute}=["']([^"']*)["'][^>]*>`, "i");
    return decodeHtml(html.match(pattern)?.[1] || "");
}

if (validateDist) {
    for (const post of posts) {
        const scope = post.slug;
        const metadata = getArticleMetadata(post, { siteUrl, defaultOgImage });
        let html;
        try {
            html = await readFile(path.join(root, "dist", "blog", `${post.slug}.html`), "utf8");
        } catch {
            error(scope, "missing generated route HTML");
            continue;
        }
        const title = decodeHtml(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "");
        const description = extractAttribute(html, "meta", "content", "description");
        const canonical = decodeHtml(html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i)?.[1] || "");
        const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
        const schemaText = html.match(/<script[^>]+id=["']cinnova-structured-data["'][^>]*>([\s\S]*?)<\/script>/i)?.[1];
        const internalLinks = [...html.matchAll(/href=["'](\/blog\/[^"']+)["']/gi)].map((match) => match[1]);
        if (title !== metadata.title) error(scope, "generated title does not match article metadata");
        if (description !== metadata.description) error(scope, "generated description does not match article metadata");
        if (canonical !== metadata.canonical) error(scope, "generated canonical does not match clean route");
        if (h1Matches.length !== 1 || decodeHtml(h1Matches[0]?.[1] || "") !== post.title) error(scope, "generated route must contain exactly one matching H1");
        if (post.heroImage && !/<img[^>]+alt=["'][^"']+["'][^>]*>/i.test(html)) error(scope, "generated hero image is missing non-empty alt text");
        if (new Set(internalLinks).size < 4) error(scope, "generated route has fewer than four crawlable blog links");
        try {
            const schema = JSON.parse(schemaText || "");
            const types = new Set((schema["@graph"] || []).map((node) => node["@type"]));
            if (!types.has("BlogPosting") || !types.has("BreadcrumbList")) error(scope, "generated schema is incomplete");
        } catch {
            error(scope, "generated JSON-LD is missing or invalid");
        }
    }

    const expectedListingFiles = [
        path.join(root, "dist", "blog.html"),
        ...blogCategories.map((category) => path.join(root, "dist", "blog", "category", `${slugifyCategory(category)}.html`)),
    ];
    for (const file of expectedListingFiles) {
        try {
            const html = await readFile(file, "utf8");
            if (!/<link[^>]+rel=["']canonical["']/i.test(html) || !/<h1[^>]*>/i.test(html)) {
                error(path.relative(root, file), "listing route is missing canonical or H1");
            }
        } catch {
            error(path.relative(root, file), "missing generated listing route HTML");
        }
    }
}

for (const message of warnings) console.warn(`SEO warning: ${message}`);
if (errors.length) {
    console.error(`SEO audit failed with ${errors.length} error(s):`);
    for (const message of errors) console.error(`  - ${message}`);
    process.exitCode = 1;
} else {
    console.log(`SEO audit passed for ${posts.length} published articles${validateDist ? " and generated route HTML" : ""}.`);
    console.log(`Checked unique titles, descriptions, slugs, canonicals, H1s, image alt text, schema, and internal links.`);
}
