import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
    blogCategories,
    getArticleUrl,
    getAuthorProfile,
    getPublishedBlogPosts,
    slugifyCategory,
} from "../src/data/blogPosts.js";
import {
    NEWS_COVERAGE_KEYS,
    NEWS_SOURCE_TYPE_KEYS,
    NEWS_STATUSES,
    buildNewsArticleSchema,
    getNewsStoryMetadata,
    getPublicNewsStories,
    getPublishedNewsStories,
    getRelatedNewsStories,
} from "../src/data/newsPosts.js";
import { STATIC_PUBLIC_PAGES, collectSitemapEntries, defaultOgImage, siteUrl } from "../src/data/seoConfig.js";
import { getProductUrl, getProductsUrl, products } from "../src/data/products.js";
import { getRelatedResources, getResourceUrl, getResourcesUrl, resources, withLibraryMeta } from "../src/data/resources.js";
import { getResourceHeroImage } from "../src/data/marketingImages.js";
import { LEGACY_PRODUCT_KEYS, LEGACY_RESOURCE_SLUGS, resolveLegacyRouteRedirect } from "../src/data/legacyRouteRedirects.js";
import {
    GUIDE_PAGE_ROUTES,
    PUBLIC_PAGE_ROUTES,
    PUBLIC_SITE_URL,
    MIGRATED_PUBLIC_PAGE_KEYS,
    getGuideAlternates,
    getPublicPagePath,
} from "../src/data/publicPageRoutes.js";
import {
    buildArticleSchema,
    buildGuideSchema,
    buildProductSchema,
    buildPublicPageSchema,
    buildResourceSchema,
    getArticleMetadata,
    getProductMetadata,
    getProductsIndexMetadata,
    getPublicPageMetadata,
    getResourceMetadata,
    getResourcesIndexMetadata,
    publicPageH1,
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

/* ── News Center ─────────────────────────────────────────────────────────────
   Structural validation for every published story (demo fixtures included), so
   the data model stays sound before real reporting lands. Demo fixtures are
   held to the same rules except indexing: they are expected to be noindex and
   absent from the sitemap. */
const newsStories = getPublishedNewsStories();
const newsBySlug = new Map(newsStories.map((story) => [story.slug, story]));
const newsSeen = { title: new Map(), slug: new Map(), description: new Map() };

for (const story of newsStories) {
    const scope = `news:${story.slug}`;
    const metadata = getNewsStoryMetadata(story);

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(story.slug)) error(scope, "slug is not clean kebab-case");
    if (metadata.canonical !== `${siteUrl}/news/${story.slug}`) error(scope, "canonical does not match the /news/<slug> route");
    if (!NEWS_COVERAGE_KEYS.includes(story.coverageLevel)) error(scope, `invalid coverageLevel: ${story.coverageLevel}`);
    if (!NEWS_STATUSES.includes(story.status)) error(scope, `invalid status: ${story.status}`);
    if (!story.category?.trim()) error(scope, "missing category");
    if (!story.title?.trim()) error(scope, "missing title/H1");
    if (!story.dek?.trim()) error(scope, "missing dek");
    if (!story.summary?.trim()) error(scope, "missing summary");
    if (!story.whyItMatters?.trim()) error(scope, "missing 'why it matters'");
    if (!story.publishedAt || Number.isNaN(Date.parse(story.publishedAt))) error(scope, "publishedAt is missing or unparseable");
    if (story.updatedAt && Number.isNaN(Date.parse(story.updatedAt))) error(scope, "updatedAt is unparseable");
    if (story.heroImage && !story.heroAlt?.trim()) error(scope, "hero image is missing alt text");
    if (!story.sections?.length) error(scope, "story has no sections");
    if (!story.sources?.length) error(scope, "story has no sources — every reported story must support source links");
    if (metadata.description.length < 70 || metadata.description.length > 200) {
        warning(scope, `meta description is ${metadata.description.length} characters (recommended 70-200)`);
    }

    for (const [index, section] of (story.sections || []).entries()) {
        if (!section.id) error(scope, `section ${index + 1} is missing an id`);
        if (!section.heading?.trim()) error(scope, `section ${index + 1} is missing a heading`);
        if (!section.body?.length) error(scope, `section ${index + 1} has no body copy`);
        if (section.claimType && !NEWS_SOURCE_TYPE_KEYS.includes(section.claimType)) {
            error(scope, `section ${index + 1} has an unknown claimType: ${section.claimType}`);
        }
    }

    for (const source of story.sources || []) {
        if (!NEWS_SOURCE_TYPE_KEYS.includes(source.type)) {
            error(scope, `source "${source.label}" must declare a type (${NEWS_SOURCE_TYPE_KEYS.join(", ")})`);
        }
        if (!/^https?:\/\//i.test(source.url || "")) error(scope, `source "${source.label}" needs an absolute URL`);
    }

    for (const id of story.relatedNewsIds || []) {
        if (id === story.id) error(scope, "related news links to itself");
        if (!newsStories.some((item) => item.id === id)) error(scope, `related news does not resolve: ${id}`);
    }
    for (const slug of story.relatedBlogSlugs || []) {
        if (!postsBySlug.has(slug)) error(scope, `related blog article does not resolve: ${slug}`);
    }

    for (const [field, value] of [
        ["title", story.title],
        ["slug", story.slug],
        ["description", metadata.description],
    ]) {
        const key = normalized(value);
        if (newsSeen[field].has(key)) error(scope, `duplicate ${field} also used by ${newsSeen[field].get(key)}`);
        else newsSeen[field].set(key, story.slug);
    }

    const graphTypes = new Set(buildNewsArticleSchema(story, getRelatedNewsStories(story))["@graph"].map((node) => node["@type"]));
    if (!graphTypes.has("NewsArticle") || !graphTypes.has("BreadcrumbList")) {
        error(scope, "schema must contain NewsArticle and BreadcrumbList nodes");
    }

    if (story.isDemo && !metadata.noindex) error(scope, "demo fixture must be noindex");
    if (!story.isDemo && metadata.noindex) error(scope, "published story must not be noindex");

    /* Published reporting is held to a higher bar than fixtures. */
    if (!story.isDemo) {
        if ((story.sources || []).length < 2) error(scope, "published story needs at least two sources");
        if (!story.heroCaption?.trim()) error(scope, "published story must disclose its hero image origin via heroCaption");
        if (story.status === "breaking" || story.status === "developing") {
            warning(scope, `status "${story.status}" is reserved for live desk use — confirm it is justified`);
        }
        // Curly or straight quote marks in body copy usually mean a direct
        // quotation slipped in. Published Cin Nova stories paraphrase instead.
        const bodyText = (story.sections || []).flatMap((section) => section.body || []).join(" ");
        if (/[“”"]/.test(bodyText)) {
            warning(scope, "body copy contains quotation marks — confirm every quote is real and sourced");
        }
    }
}

const newsTemplate = await readFile(path.join(root, "src", "pages", "NewsStoryPage.jsx"), "utf8");
const newsH1Count = (newsTemplate.match(/<h1>\{story\.title\}<\/h1>/g) || []).length;
if (newsH1Count !== 1) {
    error("NewsStoryPage.jsx", `expected one story H1 template, found ${newsH1Count}`);
}

const publicNews = getPublicNewsStories();
const sitemapNewsUrls = collectSitemapEntries().filter((entry) => entry.loc.includes("/news/"));
if (sitemapNewsUrls.length !== publicNews.length) {
    error("news sitemap", `expected ${publicNews.length} news URLs in the sitemap, found ${sitemapNewsUrls.length}`);
}
for (const story of newsStories) {
    if (story.isDemo && sitemapNewsUrls.some((entry) => entry.loc === `${siteUrl}/news/${story.slug}`)) {
        error(`news:${story.slug}`, "demo fixture must not appear in the sitemap");
    }
}
if (newsBySlug.size !== newsStories.length) error("news", "duplicate news slugs detected");

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

    // Unrelated / admin / unmigrated / invalid values must NOT redirect (resolver
    // returns null). NOTE: about/pricing/contact are migrated public pages as of
    // Phase 2B and are asserted to redirect in the public-pages block below.
    for (const legacy of ["?page=newsletter-admin", "?page=blog-manager", "?page=newsletter-success", "", "?foo=bar", "?page=", "?page=not-a-real-product", "?resource=not-a-real-resource"]) {
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

// ─────────────────────────────────────────────────────────────────────────
// Phase 2B Checkpoint 1 — migrated public pages + resource sitemap images.
// ─────────────────────────────────────────────────────────────────────────
const RESERVED_PREFIXES = ["/blog", "/products", "/resources", "/news"];
{
    // Registry integrity.
    if (PUBLIC_SITE_URL !== siteUrl) error("public-pages", `PUBLIC_SITE_URL (${PUBLIC_SITE_URL}) must equal siteUrl (${siteUrl})`);
    if (PUBLIC_PAGE_ROUTES.length !== 50) error("public-pages", `expected exactly 50 migrated public pages, found ${PUBLIC_PAGE_ROUTES.length}`);
    if (MIGRATED_PUBLIC_PAGE_KEYS.size !== 50) error("public-pages", `expected 50 unique migrated keys, found ${MIGRATED_PUBLIC_PAGE_KEYS.size}`);

    // The 404 error page must never be a real route: no registry entry for /404
    // and the NotFound component must suppress its canonical (no /404 canonical).
    if (PUBLIC_PAGE_ROUTES.some((r) => r.path === "/404") || MIGRATED_PUBLIC_PAGE_KEYS.has("404")) {
        error("404", "the registry must not contain a /404 route");
    }
    try {
        const notFoundSrc = await readFile(path.join(root, "src", "pages", "NotFound.jsx"), "utf8");
        if (/url\s*=\s*\{[^}]*\/404/.test(notFoundSrc) || /["'`][^"'`]*\/404["'`]/.test(notFoundSrc)) {
            error("404", "NotFound.jsx must not set /404 as a canonical/url");
        }
        if (!/\bnoCanonical\b/.test(notFoundSrc)) {
            error("404", "NotFound.jsx must use the SEO noCanonical prop to suppress its canonical");
        }
    } catch {
        error("404", "could not read src/pages/NotFound.jsx");
    }

    const seenKeys = new Set();
    const seenPaths = new Set();
    const staticKeys = new Set(STATIC_PUBLIC_PAGES.map((p) => p.key));
    for (const route of PUBLIC_PAGE_ROUTES) {
        const scope = `public:${route.key}`;
        if (seenKeys.has(route.key)) error(scope, "duplicate page key");
        seenKeys.add(route.key);
        if (seenPaths.has(route.path)) error(scope, `duplicate clean path ${route.path}`);
        seenPaths.add(route.path);
        if (!/^\/[a-z0-9/-]*$/.test(route.path)) error(scope, `clean path is not lowercase/simple: ${route.path}`);
        if (/[?#]/.test(route.path)) error(scope, `clean path contains a query or fragment: ${route.path}`);
        if (route.path !== route.path.toLowerCase()) error(scope, "clean path is not lowercase");
        for (const reserved of RESERVED_PREFIXES) {
            if (route.path === reserved || route.path.startsWith(`${reserved}/`)) error(scope, `clean path collides with reserved namespace ${reserved}`);
        }
        if (!staticKeys.has(route.key)) error(scope, "migrated key is not present in STATIC_PUBLIC_PAGES");

        // Metadata + schema.
        const metadata = getPublicPageMetadata(route, { siteUrl, defaultOgImage });
        if (metadata.canonical !== `${siteUrl}${route.path}`) error(scope, "canonical does not match clean route");
        if (!metadata.canonical.startsWith("https://getcinnova.com/") || /[?#]/.test(metadata.canonical)) error(scope, "canonical must be absolute production HTTPS without query/fragment");
        if (!route.title?.trim()) error(scope, "missing title");
        if (!route.description?.trim()) error(scope, "missing meta description");
        const schemaBuilder = route.group === "guide" ? buildGuideSchema : buildPublicPageSchema;
        const schemaGraph = schemaBuilder(route, { siteUrl, defaultOgImage })["@graph"];
        const types = new Set(schemaGraph.map((n) => n["@type"]));
        if (!types.has(route.schemaType) || !types.has("BreadcrumbList")) error(scope, `schema must contain ${route.schemaType} and BreadcrumbList`);
        if (route.group === "guide") {
            const article = schemaGraph.find((n) => n["@type"] === "TechArticle");
            if (article?.inLanguage !== (route.language || "en")) error(scope, `schema inLanguage (${article?.inLanguage}) does not match route language (${route.language})`);
        }

        // Resolver must 308 this legacy key to the clean path (query-free).
        const resolved = resolveLegacyRouteRedirect(`?page=${route.key}`);
        if (resolved !== route.path) error(scope, `resolver("?page=${route.key}") = ${resolved}; expected ${route.path}`);
        if (resolved && /[?#]/.test(resolved)) error(scope, `resolver target contains query/fragment: ${resolved}`);
        if (getPublicPagePath(route.key) !== route.path) error(scope, "getPublicPagePath disagrees with registry path");
    }
    // Unique titles/descriptions among the 16.
    for (const [label, pick] of [["title", (r) => r.title], ["description", (r) => r.description]]) {
        const seen = new Map();
        for (const route of PUBLIC_PAGE_ROUTES) {
            const v = normalized(pick(route));
            if (seen.has(v)) error(`public:${route.key}`, `duplicate ${label} also used by ${seen.get(v)}`);
            else seen.set(v, route.key);
        }
    }
    // Admin + excluded + invalid keys must NOT redirect.
    for (const key of ["newsletter-admin", "blog-manager", "newsletter-success", "not-a-real-page"]) {
        if (resolveLegacyRouteRedirect(`?page=${key}`) !== null) error("public-pages", `?page=${key} must not redirect (admin/excluded/invalid)`);
    }

    // ── Guide registry checks (Phase 2B, Checkpoint 2) ──
    if (GUIDE_PAGE_ROUTES.length !== 34) error("guides", `expected exactly 34 guide entries, found ${GUIDE_PAGE_ROUTES.length}`);
    const VALID_LANGS = new Set(["en", "es", "fr", "de"]);
    for (const route of GUIDE_PAGE_ROUTES) {
        const scope = `guide:${route.key}`;
        if (!route.path.startsWith("/guides/")) error(scope, `guide path must live under /guides/: ${route.path}`);
        if (!VALID_LANGS.has(route.language)) error(scope, `invalid language "${route.language}"`);
        if (route.schemaType !== "TechArticle") error(scope, `guide schemaType must be TechArticle, found ${route.schemaType}`);
    }
    // Translated families: en/es/fr/de all present, one x-default → English, no
    // duplicates, every alternate resolves to a real registry path, and each
    // member's own path is inside its family.
    const families = new Map();
    for (const route of GUIDE_PAGE_ROUTES) {
        if (!route.alternateGroup) continue;
        if (!families.has(route.alternateGroup)) families.set(route.alternateGroup, []);
        families.get(route.alternateGroup).push(route);
    }
    if (families.size !== 3) error("guides", `expected 3 translated families, found ${families.size}`);
    const registryPaths = new Set(PUBLIC_PAGE_ROUTES.map((r) => r.path));
    for (const [group, members] of families) {
        const langs = members.map((m) => m.language).sort().join(",");
        if (langs !== "de,en,es,fr") error(`guides:${group}`, `family languages incomplete/duplicated: ${langs}`);
        for (const member of members) {
            const alternates = getGuideAlternates(member.key);
            if (!alternates) { error(`guides:${group}`, `${member.key} has no alternates`); continue; }
            const hreflangs = alternates.map((a) => a.hreflang).sort().join(",");
            if (hreflangs !== "de,en,es,fr,x-default") error(`guides:${group}`, `${member.key} hreflang set wrong: ${hreflangs}`);
            const xDefault = alternates.find((a) => a.hreflang === "x-default");
            const english = members.find((m) => m.language === "en");
            if (xDefault?.path !== english?.path) error(`guides:${group}`, `${member.key} x-default must point at the English route`);
            for (const alt of alternates) {
                if (/[?#]/.test(alt.path)) error(`guides:${group}`, `alternate contains query/fragment: ${alt.path}`);
                if (!registryPaths.has(alt.path)) error(`guides:${group}`, `alternate does not resolve to a registry route: ${alt.path}`);
            }
            if (!alternates.some((a) => a.hreflang === member.language && a.path === member.path)) {
                error(`guides:${group}`, `${member.key} is missing its own language/path pairing in the family`);
            }
        }
    }
    // English-only guides must not receive invented translations.
    for (const route of GUIDE_PAGE_ROUTES) {
        if (!route.alternateGroup && getGuideAlternates(route.key) !== null) {
            error(`guide:${route.key}`, "English-only guide must not have hreflang alternates");
        }
    }

    // ── Internal navigation scan: no query-form links for ANY migrated key ──
    {
        const { readdir } = await import("node:fs/promises");
        async function* walk(dir) {
            for (const entry of await readdir(dir, { withFileTypes: true })) {
                const full = path.join(dir, entry.name);
                if (entry.isDirectory()) yield* walk(full);
                else if (/\.(js|jsx)$/.test(entry.name)) yield full;
            }
        }
        const skip = new Set(["legacyRouteRedirects.js", "publicPageRoutes.js"]);
        for await (const file of walk(path.join(root, "src"))) {
            if (skip.has(path.basename(file))) continue;
            const content = await readFile(file, "utf8");
            for (const match of content.matchAll(/\?page=([a-z0-9-]+)/g)) {
                if (MIGRATED_PUBLIC_PAGE_KEYS.has(match[1])) {
                    error("internal-links", `${path.relative(root, file)} still references ?page=${match[1]}`);
                }
            }
        }
    }

    // Resource sitemap-image registry: every resource has an existing, correctly-mapped cover.
    const seenCovers = new Set();
    for (const resource of resources) {
        const scope = `resource-image:${resource.slug}`;
        const cover = getResourceHeroImage(resource.id);
        if (!cover?.src) { error(scope, "missing cover image in the resource hero registry"); continue; }
        if (withLibraryMeta(resource).coverImage?.src !== cover.src) error(scope, "cover image is assigned to the wrong resource");
        if (seenCovers.has(cover.src)) warning(scope, `cover image ${cover.src} is shared with another resource`);
        seenCovers.add(cover.src);
        try { await stat(path.join(root, "public", cover.src)); } catch { error(scope, `cover file does not exist: public${cover.src}`); }
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
        const internalLinks = [...html.matchAll(/href=["'](\/(?:products|resources|blog|guides|company|tools)(?:\/[^"']*)?)["']/gi)].map((m) => m[1]);
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

    // ── Phase 2B: generated public-page + guide HTML, sitemap, and guards ──
    for (const route of PUBLIC_PAGE_ROUTES) {
        const metadata = getPublicPageMetadata(route, { siteUrl, defaultOgImage });
        const relativeFile = `${route.path.replace(/^\//, "")}.html`;
        await validateGeneratedRoute(
            `public:${route.key}`,
            relativeFile,
            metadata,
            [route.schemaType, "BreadcrumbList"],
            3
        );
        if (route.group !== "guide") continue;
        // Guide-specific raw-HTML checks: document language + hreflang family.
        let html;
        try { html = await readFile(path.join(root, "dist", relativeFile), "utf8"); } catch { continue; }
        const scope = `guide:${route.key}`;
        const langAttr = html.match(/<html lang="([^"]*)"/)?.[1];
        if (langAttr !== (route.language || "en")) error(scope, `generated <html lang> is "${langAttr}"; expected "${route.language}"`);
        const hreflangTags = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)]
            .map((m) => ({ hreflang: m[1], href: m[2] }));
        const expectedAlternates = getGuideAlternates(route.key);
        if (expectedAlternates) {
            const got = hreflangTags.map((t) => t.hreflang).sort().join(",");
            if (got !== "de,en,es,fr,x-default") error(scope, `generated hreflang set wrong: ${got}`);
            for (const tag of hreflangTags) {
                if (/[?#]/.test(tag.href)) error(scope, `hreflang href contains query/fragment: ${tag.href}`);
                if (!tag.href.startsWith(`${siteUrl}/guides/`)) error(scope, `hreflang href not a clean guide URL: ${tag.href}`);
                const expected = expectedAlternates.find((a) => a.hreflang === tag.hreflang);
                if (!expected || `${siteUrl}${expected.path}` !== tag.href) error(scope, `hreflang ${tag.hreflang} points at ${tag.href}; expected ${siteUrl}${expected?.path}`);
            }
            // Every alternate must resolve to a real generated file.
            for (const alt of expectedAlternates) {
                try { await stat(path.join(root, "dist", `${alt.path.replace(/^\//, "")}.html`)); }
                catch { error(scope, `hreflang alternate has no generated file: ${alt.path}`); }
            }
        } else if (hreflangTags.length) {
            error(scope, "English-only guide must not emit hreflang alternates");
        }
    }

    try {
        const sitemap = await readFile(path.join(root, "public", "sitemap.xml"), "utf8");
        const locSet = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
        for (const route of PUBLIC_PAGE_ROUTES) {
            if (!locSet.has(`${siteUrl}${route.path}`)) error("sitemap.xml", `missing migrated clean URL ${siteUrl}${route.path}`);
            if (locSet.has(`${siteUrl}/?page=${route.key}`)) error("sitemap.xml", `migrated page still present as legacy ?page=${route.key}`);
        }
        // Every resource detail URL must carry its correct <image:image> entry.
        for (const resource of resources) {
            const locTag = `<loc>${getResourceUrl(resource)}</loc>`;
            const i = sitemap.indexOf(locTag);
            if (i < 0) { error("sitemap.xml", `resource ${resource.slug} <loc> missing`); continue; }
            const block = sitemap.slice(i, sitemap.indexOf("</url>", i));
            if (!/<image:image>/.test(block)) { error("sitemap.xml", `resource ${resource.slug} is missing an <image:image> entry`); continue; }
            const cover = getResourceHeroImage(resource.id);
            if (cover?.src && !block.includes(`${siteUrl}${cover.src}`)) error("sitemap.xml", `resource ${resource.slug} sitemap image does not match its registry cover`);
        }
    } catch {
        error("sitemap.xml", "missing public/sitemap.xml for Phase 2B checks");
    }

    // Checkpoint invariants: all 50 non-home Phase 2B public pages migrated
    // (16 core + 34 guides). News Center intentionally stays on ?page=news
    // until its own clean-route checkpoint; it is the only allowed holdout.
    for (const route of PUBLIC_PAGE_ROUTES) {
        try { await stat(path.join(root, "dist", `${route.path.replace(/^\//, "")}.html`)); }
        catch { error("checkpoint", `missing generated HTML for ${route.path}`); }
    }
    const INTENTIONAL_QUERY_PAGE_KEYS = new Set(["news"]);
    const unmigrated = STATIC_PUBLIC_PAGES.map((p) => p.key).filter(
        (k) => k !== "home" && !MIGRATED_PUBLIC_PAGE_KEYS.has(k) && !INTENTIONAL_QUERY_PAGE_KEYS.has(k),
    );
    if (PUBLIC_PAGE_ROUTES.length !== 50) error("checkpoint", `expected 50 migrated public page keys, found ${PUBLIC_PAGE_ROUTES.length}`);
    if (GUIDE_PAGE_ROUTES.length !== 34) error("checkpoint", `expected 34 migrated guide pages, found ${GUIDE_PAGE_ROUTES.length}`);
    if (!STATIC_PUBLIC_PAGES.some((page) => page.key === "news")) error("checkpoint", "news must remain in STATIC_PUBLIC_PAGES as ?page=news");
    if (unmigrated.length !== 0) error("checkpoint", `expected 0 unmigrated public pages, found ${unmigrated.length}: ${unmigrated.join(", ")}`);

    // ── Checkpoint 3: true HTTP 404 architecture ──
    // The broad SPA catch-all rewrite must be GONE (filesystem-first + native
    // 404.html now own routing), while cleanUrls and security headers remain.
    try {
        const vercel = JSON.parse(await readFile(path.join(root, "vercel.json"), "utf8"));
        for (const rewrite of vercel.rewrites || []) {
            if (rewrite.destination === "/index" || rewrite.destination === "/index.html") {
                error("checkpoint-3", `catch-all rewrite to ${rewrite.destination} must be removed`);
            }
        }
        if (vercel.cleanUrls !== true) error("checkpoint-3", "cleanUrls must remain enabled");
        const headerKeys = new Set((vercel.headers?.[0]?.headers || []).map((h) => h.key));
        for (const required of ["Strict-Transport-Security", "X-Content-Type-Options", "X-Frame-Options", "Referrer-Policy", "Permissions-Policy", "Content-Security-Policy"]) {
            if (!headerKeys.has(required)) error("checkpoint-3", `security header missing from vercel.json: ${required}`);
        }
    } catch (err) {
        error("checkpoint-3", `could not read/parse vercel.json (${err.message})`);
    }

    // Branded static 404: present, noindex, one H1, recovery links, no
    // canonical, no content schema, no auto-redirect, absent from the sitemap.
    try {
        const notFound = await readFile(path.join(root, "dist", "404.html"), "utf8");
        const title = notFound.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "";
        if (title !== "Page Not Found | CinNova") error("404.html", `unexpected title "${title}"`);
        if (!/name="description" content="[^"]*could not be found/i.test(notFound)) error("404.html", "missing not-found meta description");
        if (!/name="robots" content="noindex, follow"/.test(notFound)) error("404.html", "robots must be noindex, follow");
        if (/rel=["']canonical["']/i.test(notFound)) error("404.html", "must not contain a canonical tag");
        const h1Count = (notFound.match(/<h1[ >]/gi) || []).length;
        if (h1Count !== 1) error("404.html", `expected exactly one H1, found ${h1Count}`);
        for (const link of ["/", "/products", "/resources", "/blog", "/guides"]) {
            if (!notFound.includes(`href="${link}"`)) error("404.html", `missing recovery link to ${link}`);
        }
        if (/application\/ld\+json/i.test(notFound)) error("404.html", "must not contain structured-data schema");
        if (/http-equiv=["']refresh["']/i.test(notFound)) error("404.html", "must not auto-refresh/redirect");
        if (!/<script type="module"[^>]*src="\/assets\//.test(notFound)) error("404.html", "React entry script missing (app cannot mount)");
    } catch {
        error("404.html", "dist/404.html is missing");
    }
    try {
        const sitemap = await readFile(path.join(root, "public", "sitemap.xml"), "utf8");
        if (/\/404/.test(sitemap)) error("sitemap.xml", "404 page must not appear in the sitemap");
    } catch { /* reported elsewhere */ }

    // Route-manifest completeness: every valid clean pathname ↔ generated file.
    {
        const publicNews = getPublicNewsStories();
        const manifest = {
            blog: ["/blog", ...blogCategories.map((c) => `/blog/category/${slugifyCategory(c)}`), ...posts.map((p) => `/blog/${p.slug}`)],
            products: ["/products", ...products.map((p) => `/products/${p.page}`)],
            resources: ["/resources", ...resources.map((r) => `/resources/${r.slug}`)],
            public: PUBLIC_PAGE_ROUTES.map((r) => r.path),
            news: publicNews.map((story) => `/news/${story.slug}`),
        };
        const counts = [];
        let routeTotal = 0;
        for (const [group, paths] of Object.entries(manifest)) {
            let present = 0;
            for (const cleanPath of paths) {
                routeTotal++;
                try { await stat(path.join(root, "dist", `${cleanPath.replace(/^\//, "")}.html`)); present++; }
                catch { error("route-manifest", `${group}: missing generated file for ${cleanPath}`); }
            }
            counts.push(`${group}=${present}/${paths.length}`);
        }
        const expectedRouteTotal = Object.values(manifest).reduce((sum, paths) => sum + paths.length, 0);
        if (routeTotal !== expectedRouteTotal) error("route-manifest", `expected ${expectedRouteTotal} route-specific files, manifest lists ${routeTotal}`);
        try { await stat(path.join(root, "dist", "index.html")); } catch { error("route-manifest", "dist/index.html missing"); }
        console.log(`Route manifest: ${counts.join(", ")} (+ index.html + 404.html)`);

        // Every sitemap URL must resolve to a generated file (home → index.html).
        try {
            const sitemap = await readFile(path.join(root, "public", "sitemap.xml"), "utf8");
            for (const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
                const loc = match[1];
                const pathname = loc.replace(siteUrl, "") || "/";
                if (pathname.includes("?")) continue; // legacy query URLs live on index.html
                const file = pathname === "/" ? "index.html" : `${pathname.replace(/^\//, "")}.html`;
                try { await stat(path.join(root, "dist", file)); }
                catch { error("route-manifest", `sitemap URL has no generated file: ${loc}`); }
            }
        } catch { /* reported elsewhere */ }
    }
}

for (const message of warnings) console.warn(`SEO warning: ${message}`);
if (errors.length) {
    console.error(`SEO audit failed with ${errors.length} error(s):`);
    for (const message of errors) console.error(`  - ${message}`);
    process.exitCode = 1;
} else {
    console.log(
        `SEO audit passed for ${posts.length} published articles, ${products.length} products, ${resources.length} resources, and ${newsStories.length} news stories` +
            ` (${publicNews.length} public, ${newsStories.length - publicNews.length} demo fixtures)` +
            `${validateDist ? " (including generated route HTML, homepage canonical, and sitemap)" : ""}.`
    );
    console.log(`Checked unique titles, descriptions, slugs, canonicals, H1s, image alt text, schema, and internal links.`);
}
