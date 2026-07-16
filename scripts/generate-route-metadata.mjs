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
import { getOtherProducts, getProductUrl, products } from "../src/data/products.js";
import {
    formatResourceReadTime,
    getRelatedProductsForResource,
    getRelatedResources,
    getResourceUrl,
    resources,
    withLibraryMeta,
} from "../src/data/resources.js";
import {
    buildArticleSchema,
    buildCollectionSchema,
    buildProductSchema,
    buildResourceSchema,
    escapeHtml,
    getArticleMetadata,
    getBlogMetadata,
    getCategoryMetadata,
    getProductMetadata,
    getProductsIndexMetadata,
    getResourceMetadata,
    getResourcesIndexMetadata,
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

function productsIndexShell() {
    const links = products
        .map(
            (product) =>
                `<li><a href="/products/${escapeHtml(product.page)}">${escapeHtml(product.name)}</a> — ${escapeHtml(product.category)}</li>`
        )
        .join("");
    return `<div id="root"><main class="product-page products-index-page" data-seo-shell="products"><h1>CinNova Products</h1><p>Explore the CinNova product ecosystem — five practical AI platforms for learning, safety, tech support, early learning, and real estate.</p><ul>${links}</ul><nav aria-label="Site"><a href="/">Home</a><a href="/resources">Resources</a><a href="/blog">Blog</a></nav></main></div>`;
}

function productDetailShell(product) {
    const image = product.image
        ? `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.imageAlt || product.name)}" />`
        : "";
    const others = getOtherProducts(product.page)
        .map((other) => `<li><a href="/products/${escapeHtml(other.page)}">${escapeHtml(other.name)}</a></li>`)
        .join("");
    return `<div id="root"><main class="product-page product-landing" data-seo-shell="product"><article><p>${escapeHtml(product.category)} · ${escapeHtml(product.status)}</p><h1>${escapeHtml(product.name)}</h1><p>${escapeHtml(product.description)}</p>${image}<nav aria-label="More products"><a href="/products">All products</a><ul>${others}</ul></nav></article></main></div>`;
}

function resourcesIndexShell() {
    const links = resources
        .map(
            (resource) =>
                `<li><a href="/resources/${escapeHtml(resource.slug)}">${escapeHtml(resource.title)}</a> — ${escapeHtml(resource.category)}</li>`
        )
        .join("");
    return `<div id="root"><main class="product-page resources-index-page" data-seo-shell="resources"><h1>CinNova Resources</h1><p>Free guides, checklists, templates, white papers, product brochures, and case studies from CinNova.</p><ul>${links}</ul><nav aria-label="Site"><a href="/">Home</a><a href="/products">Products</a><a href="/blog">Blog</a></nav></main></div>`;
}

function resourceDetailShell(libraryResource) {
    const cover = libraryResource.coverImage?.src
        ? `<img src="${escapeHtml(libraryResource.coverImage.src)}" alt="${escapeHtml(libraryResource.coverImage.alt || libraryResource.title)}" />`
        : "";
    const sections = (libraryResource.sections || [])
        .map((section) => `<section><h2>${escapeHtml(section.heading)}</h2><p>${escapeHtml(section.body)}</p></section>`)
        .join("");
    const relatedResourceLinks = getRelatedResources(libraryResource, 3)
        .map((related) => `<li><a href="/resources/${escapeHtml(related.slug)}">${escapeHtml(related.title)}</a></li>`)
        .join("");
    const relatedProductLinks = getRelatedProductsForResource(libraryResource)
        .map((product) => `<a href="/products/${escapeHtml(product.page)}">${escapeHtml(product.name)}</a>`)
        .join(" ");
    const meta = `${escapeHtml(libraryResource.category)} · ${escapeHtml(libraryResource.product)} · ${escapeHtml(libraryResource.format)} · ${escapeHtml(formatResourceReadTime(libraryResource.readTime))}`;
    return `<div id="root"><main class="product-page resource-detail" data-seo-shell="resource"><article><p>${meta}</p><h1>${escapeHtml(libraryResource.title)}</h1><p>${escapeHtml(libraryResource.description)}</p>${cover}${sections}<nav aria-label="Related resources"><a href="/resources">All resources</a><ul>${relatedResourceLinks}</ul><p>Related products: ${relatedProductLinks}</p></nav></article></main></div>`;
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

// ── Product index + product detail routes ──────────────────────────────────
const productsIndexMetadata = getProductsIndexMetadata({ siteUrl, defaultOgImage });
await writeRoute(
    "products.html",
    productsIndexMetadata,
    buildCollectionSchema(
        productsIndexMetadata,
        products.map((product) => ({ type: "SoftwareApplication", name: product.name, url: getProductUrl(product) }))
    ),
    productsIndexShell()
);

for (const product of products) {
    const metadata = getProductMetadata(product, { siteUrl, defaultOgImage });
    const schema = buildProductSchema(product, { siteUrl, defaultOgImage });
    await writeRoute(
        path.join("products", `${product.page}.html`),
        metadata,
        schema,
        productDetailShell(product)
    );
}

// ── Resource index + resource detail routes ─────────────────────────────────
const resourcesIndexMetadata = getResourcesIndexMetadata({ siteUrl, defaultOgImage });
await writeRoute(
    "resources.html",
    resourcesIndexMetadata,
    buildCollectionSchema(
        resourcesIndexMetadata,
        resources.map((resource) => ({ type: "CreativeWork", name: resource.title, url: getResourceUrl(resource) }))
    ),
    resourcesIndexShell()
);

for (const resource of resources) {
    const libraryResource = withLibraryMeta(resource);
    const metadata = getResourceMetadata(libraryResource, { siteUrl, defaultOgImage });
    const schema = buildResourceSchema(libraryResource, { siteUrl, defaultOgImage });
    await writeRoute(
        path.join("resources", `${resource.slug}.html`),
        metadata,
        schema,
        resourceDetailShell(libraryResource)
    );
}

console.log(
    `Generated crawlable metadata for ${posts.length} articles, ${blogCategories.length} categories, the blog index, ` +
        `${products.length} products + product index, and ${resources.length} resources + resource index.`
);
