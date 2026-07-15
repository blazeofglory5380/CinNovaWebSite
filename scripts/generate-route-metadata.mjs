import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
    blogCategories,
    getAuthorProfile,
    getPublishedBlogPosts,
    slugifyCategory,
} from "../src/data/blogPosts.js";
import { defaultOgImage, siteUrl } from "../src/data/seoConfig.js";
import {
    buildArticleSchema,
    escapeHtml,
    getArticleMetadata,
    getBlogMetadata,
    getCategoryMetadata,
    renderHeadTags,
} from "./seo-shared.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const baseHtml = await readFile(path.join(distDir, "index.html"), "utf8");
const posts = getPublishedBlogPosts();
const postsBySlug = new Map(posts.map((post) => [post.slug, post]));
const managedMetaKeys = [
    "description", "robots", "og:title", "og:description", "og:type", "og:url",
    "og:site_name", "og:image", "twitter:card", "twitter:title",
    "twitter:description", "twitter:site", "twitter:image",
];

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function withRouteHead(html, metadata, schema) {
    let output = html.replace(/<title>[\s\S]*?<\/title>\s*/i, "");
    for (const key of managedMetaKeys) {
        output = output.replace(
            new RegExp(`<meta\\b(?=[^>]*(?:name|property)=["']${escapeRegExp(key)}["'])[^>]*>\\s*`, "gi"),
            ""
        );
    }
    output = output
        .replace(/<link\b(?=[^>]*rel=["']canonical["'])[^>]*>\s*/gi, "")
        .replace(/<script\b[^>]*id=["']cinnova-structured-data["'][^>]*>[\s\S]*?<\/script>\s*/gi, "");
    return output.replace("</head>", `    ${renderHeadTags(metadata, schema)}\n  </head>`);
}

function articleShell(post, relatedPosts) {
    const image = post.heroImage
        ? `<img src="${escapeHtml(post.heroImage)}" alt="${escapeHtml(post.heroImageAlt || post.title)}" />`
        : "";
    const relatedLinks = relatedPosts
        .map((related) => `<li><a href="/blog/${escapeHtml(related.slug)}">${escapeHtml(related.title)}</a></li>`)
        .join("");
    return `<div id="root"><main class="product-page article-page" data-seo-shell="article"><article><p>${escapeHtml(post.category)}</p><h1>${escapeHtml(post.title)}</h1><p>${escapeHtml(post.excerpt)}</p>${image}<nav aria-label="Related articles"><a href="/blog/category/${escapeHtml(slugifyCategory(post.category))}">More ${escapeHtml(post.category)}</a><ul>${relatedLinks}</ul></nav></article></main></div>`;
}

function listingShell(title, description, articles, type) {
    const links = articles
        .map((post) => `<li><a href="/blog/${escapeHtml(post.slug)}">${escapeHtml(post.title)}</a></li>`)
        .join("");
    return `<div id="root"><main class="product-page blog-page" data-seo-shell="${type}"><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p><ul>${links}</ul></main></div>`;
}

async function writeRoute(relativePath, metadata, schema, shell) {
    const outputPath = path.join(distDir, relativePath);
    await mkdir(path.dirname(outputPath), { recursive: true });
    const html = withRouteHead(baseHtml, metadata, schema).replace('<div id="root"></div>', shell);
    await writeFile(outputPath, html, "utf8");
}

const blogMetadata = getBlogMetadata({ siteUrl, defaultOgImage });
await writeRoute(
    "blog.html",
    blogMetadata,
    {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "CinNova Blog",
        url: blogMetadata.canonical,
        description: blogMetadata.description,
        blogPost: posts.map((post) => ({ "@type": "BlogPosting", headline: post.title, url: `${siteUrl}/blog/${post.slug}` })),
    },
    listingShell("CinNova Blog", blogMetadata.description, posts, "blog")
);

for (const category of blogCategories) {
    const categoryPosts = posts.filter((post) => post.category === category);
    const metadata = getCategoryMetadata(category, { siteUrl, defaultOgImage });
    await writeRoute(
        path.join("blog", "category", `${slugifyCategory(category)}.html`),
        metadata,
        {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${category} Articles`,
            url: metadata.canonical,
            description: metadata.description,
            hasPart: categoryPosts.map((post) => ({ "@type": "BlogPosting", headline: post.title, url: `${siteUrl}/blog/${post.slug}` })),
        },
        listingShell(`${category} Articles`, metadata.description, categoryPosts, "category")
    );
}

for (const post of posts) {
    const relatedPosts = (post.relatedReading || []).map((slug) => postsBySlug.get(slug)).filter(Boolean);
    const metadata = getArticleMetadata(post, { siteUrl, defaultOgImage });
    const schema = buildArticleSchema(post, relatedPosts, {
        siteUrl,
        defaultOgImage,
        author: getAuthorProfile(post.author),
    });
    await writeRoute(
        path.join("blog", `${post.slug}.html`),
        metadata,
        schema,
        articleShell(post, relatedPosts)
    );
}

console.log(`Generated crawlable metadata for ${posts.length} articles, ${blogCategories.length} categories, and the blog index.`);
