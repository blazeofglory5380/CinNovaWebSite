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
import { getProductUrl, getProductsUrl, products } from "../src/data/products.js";
import { getRelatedResources, getResourceUrl, getResourcesUrl, resources, withLibraryMeta } from "../src/data/resources.js";
import { LEGACY_PRODUCT_KEYS, LEGACY_RESOURCE_SLUGS, resolveLegacyRouteRedirect } from "../src/data/legacyRouteRedirects.js";
import {
    buildArticleSchema,
    buildProductSchema,
    buildResourceSchema,
    getArticleMetadata,
    getProductMetadata,
    getProductsIndexMetadata,
    getResourceMetadata,
    getResourcesIndexMetadata,
} from "./seo-shared.mjs";

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

// ─────────────────────────────────────────────────────────────────────────
// Product & resource data-level SEO checks (Phase 2A)
// ─────────────────────────────────────────────────────────────────────────
const productMetas = products.map((product) => ({
    scope: `product:${product.page}`,
    product,
    metadata: getProductMetadata(product, { siteUrl, defaultOgImage }),
}));
const resourceLibrary = resources.map((resource) => withLibraryMeta(resource));
const resourceMetas = resourceLibrary.map((resource) => ({
    scope: `resource:${resource.slug}`,
    resource,
    metadata: getResourceMetadata(resource, { siteUrl, defaultOgImage }),
}));
const productsIndexMetadata = getProductsIndexMetadata({ siteUrl, defaultOgImage });
const resourcesIndexMetadata = getResourcesIndexMetadata({ siteUrl, defaultOgImage });

// Global uniqueness of title / description / canonical across every generated
// document (articles, products, resources, and the two new index pages) so a
// duplicate anywhere fails the build.
const allDocs = [
    ...posts.map((post) => ({ scope: `article:${post.slug}`, ...getArticleMetadata(post, { siteUrl, defaultOgImage }) })),
    ...productMetas.map((entry) => ({ scope: entry.scope, ...entry.metadata })),
    ...resourceMetas.map((entry) => ({ scope: entry.scope, ...entry.metadata })),
    { scope: "products-index", ...productsIndexMetadata },
    { scope: "resources-index", ...resourcesIndexMetadata },
];
for (const [label, field] of [
    ["title/H1", (doc) => doc.title],
    ["meta description", (doc) => doc.description],
    ["canonical URL", (doc) => doc.canonical],
]) {
    const seen = new Map();
    for (const doc of allDocs) {
        const value = normalized(field(doc));
        if (!value) {
            error(doc.scope, `missing ${label}`);
        } else if (seen.has(value)) {
            error(doc.scope, `duplicate ${label} also used by ${seen.get(value)}`);
        } else {
            seen.set(value, doc.scope);
        }
    }
}

// Product index + product detail canonicals must be clean, absolute, on-domain.
for (const meta of [
    { scope: "products-index", metadata: productsIndexMetadata, expected: getProductsUrl() },
    { scope: "resources-index", metadata: resourcesIndexMetadata, expected: getResourcesUrl() },
]) {
    if (meta.metadata.canonical !== meta.expected) error(meta.scope, "canonical does not match clean index route");
    if (!meta.metadata.canonical.startsWith("https://getcinnova.com/") || /[?#]/.test(meta.metadata.canonical)) {
        error(meta.scope, "canonical must be absolute production HTTPS without query or fragment");
    }
    if (!meta.metadata.title?.trim()) error(meta.scope, "missing title/H1");
    if (!meta.metadata.description?.trim()) error(meta.scope, "missing meta description");
}

const productPageKeys = new Set();
for (const { scope, product, metadata } of productMetas) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(product.page)) error(scope, "product page key is not clean kebab-case");
    if (productPageKeys.has(product.page)) error(scope, "duplicate product page key");
    productPageKeys.add(product.page);
    if (metadata.canonical !== getProductUrl(product)) error(scope, "canonical does not match clean product route");
    if (!metadata.canonical.startsWith("https://getcinnova.com/") || /[?#]/.test(metadata.canonical)) {
        error(scope, "canonical must be absolute production HTTPS without query or fragment");
    }
    if (!product.name?.trim()) error(scope, "H1/product name is empty");
    if (!metadata.description?.trim()) error(scope, "missing meta description");
    if (product.image && !product.imageAlt?.trim()) error(scope, "product image is missing alt text");
    const types = new Set(buildProductSchema(product, { siteUrl, defaultOgImage })["@graph"].map((node) => node["@type"]));
    if (!types.has("WebPage") || !types.has("SoftwareApplication") || !types.has("BreadcrumbList")) {
        error(scope, "schema must contain WebPage, SoftwareApplication, and BreadcrumbList nodes");
    }
}

const resourceSlugs = new Set(resources.map((resource) => resource.slug));
const resourceIds = new Set(resources.map((resource) => resource.id));
for (const { scope, resource, metadata } of resourceMetas) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(resource.slug)) error(scope, "resource slug is not clean kebab-case");
    if (metadata.canonical !== getResourceUrl(resource)) error(scope, "canonical does not match clean resource route");
    if (!metadata.canonical.startsWith("https://getcinnova.com/") || /[?#]/.test(metadata.canonical)) {
        error(scope, "canonical must be absolute production HTTPS without query or fragment");
    }
    if (!resource.title?.trim()) error(scope, "H1/resource title is empty");
    if (!resource.description?.trim()) error(scope, "missing meta description");
    if (resource.coverImage?.src && !resource.coverImage.alt?.trim()) error(scope, "resource cover image is missing alt text");
    // Related resources: no self-reference, resolve to a real published slug, no duplicates, not stale.
    for (const id of resource.relatedResourceIds || []) {
        if (!resourceIds.has(id)) error(scope, `stale related resource id: ${id}`);
    }
    const related = getRelatedResources(resource, 3);
    const relatedSlugs = related.map((item) => item.slug);
    if (new Set(relatedSlugs).size !== relatedSlugs.length) error(scope, "related resources contain duplicates");
    for (const item of related) {
        if (item.slug === resource.slug) error(scope, "related resource links to itself");
        if (!resourceSlugs.has(item.slug)) error(scope, `related resource does not resolve: ${item.slug}`);
    }
    const types = new Set(buildResourceSchema(resource, { siteUrl, defaultOgImage })["@graph"].map((node) => node["@type"]));
    if (!types.has("WebPage") || !types.has("CreativeWork") || !types.has("BreadcrumbList")) {
        error(scope, "schema must contain WebPage, CreativeWork, and BreadcrumbList nodes");
    }
}

// ─────────────────────────────────────────────────────────────────────────
// Legacy redirect resolver — drift guard + correctness (Phase 2A middleware)
// Fails the build if a product/resource is added or removed without updating
// src/data/legacyRouteRedirects.js, or if the resolver would ever emit a query,
// a duplicate, an invalid route, or a self-referential "/" target.
// ─────────────────────────────────────────────────────────────────────────
{
    const productPageKeySet = new Set(products.map((product) => product.page));
    const resourceSlugSet = new Set(resources.map((resource) => resource.slug));

    for (const key of productPageKeySet) {
        if (!LEGACY_PRODUCT_KEYS.has(key)) error("legacy-redirects", `product "${key}" is missing from LEGACY_PRODUCT_KEYS`);
    }
    for (const key of LEGACY_PRODUCT_KEYS) {
        if (!productPageKeySet.has(key)) error("legacy-redirects", `LEGACY_PRODUCT_KEYS has stale product "${key}"`);
    }
    for (const slug of resourceSlugSet) {
        if (!LEGACY_RESOURCE_SLUGS.has(slug)) error("legacy-redirects", `resource "${slug}" is missing from LEGACY_RESOURCE_SLUGS`);
    }
    for (const slug of LEGACY_RESOURCE_SLUGS) {
        if (!resourceSlugSet.has(slug)) error("legacy-redirects", `LEGACY_RESOURCE_SLUGS has stale resource "${slug}"`);
    }

    // The full set of 19 supported legacy → clean pairs, derived from live data.
    const expected = new Map([
        ["?page=products", "/products"],
        ["?page=resources", "/resources"],
        ...products.map((product) => [`?page=${product.page}`, `/products/${product.page}`]),
        ...resources.map((resource) => [`?resource=${resource.slug}`, `/resources/${resource.slug}`]),
    ]);
    if (expected.size !== 19) error("legacy-redirects", `expected 19 legacy routes, computed ${expected.size}`);

    const validGeneratedRoutes = new Set([
        getProductsUrl().replace(siteUrl, ""),
        getResourcesUrl().replace(siteUrl, ""),
        ...products.map((product) => getProductUrl(product).replace(siteUrl, "")),
        ...resources.map((resource) => getResourceUrl(resource).replace(siteUrl, "")),
    ]);

    const seenTargets = new Set();
    for (const [legacy, want] of expected) {
        const got = resolveLegacyRouteRedirect(legacy);
        if (got !== want) error("legacy-redirects", `resolver("${legacy}") = ${got}; expected ${want}`);
        if (!got) continue;
        if (/[?#]/.test(got)) error("legacy-redirects", `resolver target contains a query or fragment: ${got}`);
        if (/(?:^|[?&])(page|resource)=/.test(got)) error("legacy-redirects", `resolver target carries a legacy parameter: ${got}`);
        if (got === "/") error("legacy-redirects", `resolver target resolves back to "/": ${legacy}`);
        if (!validGeneratedRoutes.has(got)) error("legacy-redirects", `resolver target is not a valid generated route: ${got}`);
        if (seenTargets.has(got)) error("legacy-redirects", `duplicate resolver target: ${got}`);
        seenTargets.add(got);
    }

    // Unrelated and invalid values must NOT redirect (resolver returns null).
    for (const legacy of ["?page=about", "?page=pricing", "?page=contact", "", "?foo=bar", "?page=", "?page=not-a-real-product", "?resource=not-a-real-resource"]) {
        if (resolveLegacyRouteRedirect(legacy) !== null) error("legacy-redirects", `resolver("${legacy}") must be null (unrelated/invalid)`);
    }

    // Root middleware must exist, use the shared resolver, and emit a 308.
    try {
        const mw = await readFile(path.join(root, "middleware.js"), "utf8");
        if (!/status:\s*308/.test(mw)) error("middleware.js", "edge redirect must use HTTP status 308");
        if (!/resolveLegacyRouteRedirect/.test(mw)) error("middleware.js", "must use the shared resolveLegacyRouteRedirect");
    } catch {
        error("middleware.js", "root middleware.js is missing");
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

    // ── Product & resource generated-route validation (Phase 2A) ──
    async function validateGeneratedRoute(scope, relativeFile, metadata, requiredTypes, minLinks) {
        let html;
        try {
            html = await readFile(path.join(root, "dist", relativeFile), "utf8");
        } catch {
            error(scope, `missing generated route HTML (${relativeFile})`);
            return;
        }
        const title = decodeHtml(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "");
        const description = extractAttribute(html, "meta", "content", "description");
        const canonical = decodeHtml(html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i)?.[1] || "");
        const canonicalCount = (html.match(/<link[^>]+rel=["']canonical["']/gi) || []).length;
        const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
        const robots = extractAttribute(html, "meta", "content", "robots");
        const ogTitle = extractAttribute(html, "meta", "content", "og:title");
        const ogDesc = extractAttribute(html, "meta", "content", "og:description");
        const ogUrl = extractAttribute(html, "meta", "content", "og:url");
        const ogImage = extractAttribute(html, "meta", "content", "og:image");
        const twCard = extractAttribute(html, "meta", "content", "twitter:card");
        const twTitle = extractAttribute(html, "meta", "content", "twitter:title");
        const twImage = extractAttribute(html, "meta", "content", "twitter:image");
        const schemaText = html.match(/<script[^>]+id=["']cinnova-structured-data["'][^>]*>([\s\S]*?)<\/script>/i)?.[1];
        const internalLinks = [...html.matchAll(/href=["'](\/(?:products|resources|blog)(?:\/[^"']*)?)["']/gi)].map((m) => m[1]);
        const expectedFromPath = `${siteUrl}/${relativeFile.replace(/\\/g, "/").replace(/\.html$/, "")}`;

        if (title !== metadata.title) error(scope, "generated title does not match metadata");
        if (description !== metadata.description) error(scope, "generated description does not match metadata");
        if (canonicalCount !== 1) error(scope, `expected exactly one canonical tag, found ${canonicalCount}`);
        if (canonical !== metadata.canonical) error(scope, "generated canonical does not match clean route");
        if (!canonical.startsWith("https://getcinnova.com/")) error(scope, "canonical is not on the production domain");
        if (canonical !== expectedFromPath) error(scope, `canonical (${canonical}) does not match generated file path (${relativeFile})`);
        if (h1Matches.length !== 1) error(scope, `generated route must contain exactly one H1, found ${h1Matches.length}`);
        if (robots !== "index, follow") error(scope, `unexpected robots directive: "${robots}"`);
        if (!ogTitle || !ogDesc || !ogUrl || !ogImage) error(scope, "missing Open Graph metadata");
        if (!twCard || !twTitle || !twImage) error(scope, "missing Twitter metadata");
        if (new Set(internalLinks).size < minLinks) error(scope, `generated route has fewer than ${minLinks} crawlable internal links`);
        if (/<img\b/i.test(html) && !/<img[^>]+alt=["'][^"']+["'][^>]*>/i.test(html)) error(scope, "generated image is missing non-empty alt text");
        try {
            const schema = JSON.parse(schemaText || "");
            const types = new Set((schema["@graph"] || [schema]).map((node) => node["@type"]));
            for (const type of requiredTypes) if (!types.has(type)) error(scope, `generated schema is missing ${type}`);
        } catch {
            error(scope, "generated JSON-LD is missing or invalid");
        }
    }

    await validateGeneratedRoute("products-index", "products.html", productsIndexMetadata, ["CollectionPage"], 3);
    for (const { scope, product, metadata } of productMetas) {
        await validateGeneratedRoute(scope, path.join("products", `${product.page}.html`), metadata, ["WebPage", "SoftwareApplication", "BreadcrumbList"], 3);
    }
    await validateGeneratedRoute("resources-index", "resources.html", resourcesIndexMetadata, ["CollectionPage"], 3);
    for (const { scope, resource, metadata } of resourceMetas) {
        await validateGeneratedRoute(scope, path.join("resources", `${resource.slug}.html`), metadata, ["WebPage", "CreativeWork", "BreadcrumbList"], 3);
    }

    // Homepage canonical must be present in the built index.html.
    try {
        const homeHtml = await readFile(path.join(root, "dist", "index.html"), "utf8");
        const homeCanonical = decodeHtml(homeHtml.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i)?.[1] || "");
        if (homeCanonical !== `${siteUrl}/`) error("dist/index.html", `homepage canonical is missing or incorrect (found "${homeCanonical}")`);
    } catch {
        error("dist/index.html", "missing built homepage HTML");
    }

    // Sitemap must carry the clean product/resource routes and no query-form URLs.
    try {
        const sitemap = await readFile(path.join(root, "public", "sitemap.xml"), "utf8");
        const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
        const locSet = new Set(locs);
        const requiredClean = [
            getProductsUrl(),
            getResourcesUrl(),
            ...products.map((product) => getProductUrl(product)),
            ...resources.map((resource) => getResourceUrl(resource)),
        ];
        for (const url of requiredClean) {
            if (!locSet.has(url)) error("sitemap.xml", `missing clean product/resource route: ${url}`);
        }
        for (const loc of locs) {
            if (/[?&]resource=/.test(loc)) error("sitemap.xml", `query-form resource URL present: ${loc}`);
            if (/[?&]page=(products|resources|studynest|poisonguard|kiddo|techmate|real-estate)(?:&|$)/.test(loc)) {
                error("sitemap.xml", `query-form product/resource URL present: ${loc}`);
            }
        }
        if (locSet.size !== locs.length) error("sitemap.xml", "duplicate <loc> entries in sitemap");
    } catch {
        error("sitemap.xml", "missing public/sitemap.xml");
    }
}

for (const message of warnings) console.warn(`SEO warning: ${message}`);
if (errors.length) {
    console.error(`SEO audit failed with ${errors.length} error(s):`);
    for (const message of errors) console.error(`  - ${message}`);
    process.exitCode = 1;
} else {
    console.log(
        `SEO audit passed for ${posts.length} published articles, ${products.length} products, and ${resources.length} resources` +
            `${validateDist ? " (including generated route HTML, homepage canonical, and sitemap)" : ""}.`
    );
    console.log(`Checked unique titles, descriptions, slugs, canonicals, H1s, image alt text, schema, and internal links.`);
}
