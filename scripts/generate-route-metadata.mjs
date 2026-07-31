import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
    blogCategories,
    getAuthorProfile,
    getPublishedBlogPosts,
    slugifyCategory,
} from "../src/data/blogPosts.js";
import {
    buildNewsArticleSchema,
    getCoverageLabel,
    getNewsIndexUrl,
    getNewsStoryMetadata,
    getPublicNewsStories,
    getRelatedNewsStories,
} from "../src/data/newsPosts.js";
import {
    getBookUrl,
    getBooksIndexUrl,
    getCatalogBooks,
    statusLabel,
} from "../src/data/booksCatalog.js";
import { defaultOgImage, NOINDEX_PUBLIC_PAGE_KEYS, siteUrl } from "../src/data/seoConfig.js";
import { getOtherProducts, getProductUrl, products } from "../src/data/products.js";
import {
    formatResourceReadTime,
    getRelatedProductsForResource,
    getRelatedResources,
    getResourceUrl,
    resources,
    withLibraryMeta,
} from "../src/data/resources.js";
import { PUBLIC_PAGE_ROUTES, getGuideAlternates } from "../src/data/publicPageRoutes.js";
import {
    buildArticleSchema,
    buildCollectionSchema,
    buildGuideSchema,
    buildProductSchema,
    buildPublicPageSchema,
    buildResourceSchema,
    escapeHtml,
    getArticleMetadata,
    getBlogMetadata,
    getCategoryMetadata,
    getProductMetadata,
    getProductsIndexMetadata,
    getPublicPageMetadata,
    getResourceMetadata,
    getResourcesIndexMetadata,
    publicPageH1,
    renderHeadTags,
} from "./seo-shared.mjs";
import { buildBreadcrumbSchema, withSchemaGraph } from "../src/data/schemaHelpers.js";

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

function withRouteHead(html, metadata, schema, { alternates, lang } = {}) {
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
    if (lang) {
        // Translated guide pages carry their factual document language.
        output = output.replace(/<html lang="[a-zA-Z-]*"/, `<html lang="${lang}"`);
    }
    return output.replace("</head>", `    ${renderHeadTags(metadata, schema, alternates)}\n  </head>`);
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

async function writeRoute(relativePath, metadata, schema, shell, options = {}) {
    const outputPath = path.join(distDir, relativePath);
    await mkdir(path.dirname(outputPath), { recursive: true });
    const html = withRouteHead(baseHtml, metadata, schema, options).replace('<div id="root"></div>', shell);
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

// ── Migrated public marketing/company/tool/hub pages (Phase 2B, Checkpoint 1) ──
function publicPageShell(route) {
    const links = [
        ["/", "Home"],
        ["/products", "Products"],
        ["/resources", "Resources"],
        ["/blog", "Blog"],
        ["/guides", "Guides"],
        ["/pricing", "Pricing"],
        ["/about", "About"],
        ["/contact", "Contact"],
    ]
        .map(([href, label]) => `<li><a href="${href}">${escapeHtml(label)}</a></li>`)
        .join("");
    return `<div id="root"><main class="product-page public-page" data-seo-shell="public"><h1>${escapeHtml(publicPageH1(route))}</h1><p>${escapeHtml(route.description)}</p><nav aria-label="Site"><ul>${links}</ul></nav></main></div>`;
}

// Crawlable shell for an individual guide: breadcrumb, description, language
// switcher for translated families, and hub/related links. Content mirrors the
// registry (which mirrors the live TutorialSEO props) — nothing is invented.
function guideShell(route, alternates) {
    const langLinks = (alternates || [])
        .filter((alt) => alt.hreflang !== "x-default" && alt.path !== route.path)
        .map((alt) => `<li><a href="${alt.path}" hreflang="${alt.hreflang}" lang="${alt.hreflang}">${escapeHtml(alt.hreflang.toUpperCase())}</a></li>`)
        .join("");
    const languageNav = langLinks ? `<nav aria-label="Guide language"><ul>${langLinks}</ul></nav>` : "";
    return `<div id="root"><main class="product-page ait-page" data-seo-shell="guide"><article><nav aria-label="Breadcrumb"><a href="/">Home</a> › <a href="/guides">AI Tutorials</a></nav><h1>${escapeHtml(publicPageH1(route))}</h1><p>${escapeHtml(route.description)}</p>${languageNav}<nav aria-label="More guides"><ul><li><a href="/guides">All AI Tutorials</a></li><li><a href="/guides/ai-prompt-writing">Prompt Writing Guide</a></li><li><a href="/guides/ai-research">AI Research Guide</a></li><li><a href="/guides/ai-coding">AI Coding Guide</a></li><li><a href="/blog">CinNova Blog</a></li></ul></nav></article></main></div>`;
}

for (const route of PUBLIC_PAGE_ROUTES) {
    const metadata = getPublicPageMetadata(route, { siteUrl, defaultOgImage });
    if (NOINDEX_PUBLIC_PAGE_KEYS.has(route.key)) {
        metadata.robots = "noindex, follow";
    }
    const outputFile = `${route.path.replace(/^\//, "")}.html`;
    if (route.group === "guide") {
        const alternates = getGuideAlternates(route.key);
        const absoluteAlternates = alternates
            ? alternates.map((alt) => ({ hreflang: alt.hreflang, href: `${siteUrl}${alt.path}` }))
            : undefined;
        await writeRoute(outputFile, metadata, buildGuideSchema(route, { siteUrl, defaultOgImage }), guideShell(route, alternates), {
            alternates: absoluteAlternates,
            lang: route.language || "en",
        });
    } else {
        await writeRoute(outputFile, metadata, buildPublicPageSchema(route, { siteUrl, defaultOgImage }), publicPageShell(route));
    }
}

// ── Branded static 404 (Phase 2B, Checkpoint 3) ────────────────────────────
// Served natively by Vercel with HTTP 404 for any path with no filesystem file
// (the SPA catch-all rewrite is gone). Deliberately: NO canonical, NO content
// schema, NO redirect/refresh — robots noindex,follow only. The normal React
// entry script stays in the head, so the app mounts and renders the existing
// NotFound component on the unchanged requested URL.
function notFoundHead() {
    return [
        "<title>Page Not Found | CinNova</title>",
        '<meta name="description" content="The page you requested could not be found on CinNova. It may have moved or never existed. Use the links below to keep exploring." />',
        '<meta name="robots" content="noindex, follow" />',
    ].join("\n    ");
}

function notFoundShell() {
    const links = [
        ["/", "Home"],
        ["/products", "Products"],
        ["/resources", "Resources"],
        ["/blog", "Blog"],
        ["/news", "News"],
        ["/guides", "AI Guides"],
    ]
        .map(([href, label]) => `<li><a href="${href}">${escapeHtml(label)}</a></li>`)
        .join("");
    return `<div id="root"><main class="product-page not-found-page"><section class="section" aria-labelledby="not-found-title"><p class="eyebrow">404</p><h1 id="not-found-title">Page not found</h1><p>The page you are looking for does not exist or may have moved. CinNova builds practical AI products for learning, safety, and smarter decisions — the links below will get you back on track.</p><nav aria-label="Popular destinations"><ul>${links}</ul></nav></section></main></div>`;
}

{
    // Strip the base head exactly like normal routes (title, managed metas, the
    // static homepage canonical, structured data), then add the 404 head — which
    // intentionally re-adds NO canonical and NO schema.
    let html = baseHtml.replace(/<title>[\s\S]*?<\/title>\s*/i, "");
    for (const key of managedMetaKeys) {
        html = html.replace(
            new RegExp(`<meta\\b(?=[^>]*(?:name|property)=["']${escapeRegExp(key)}["'])[^>]*>\\s*`, "gi"),
            ""
        );
    }
    html = html
        .replace(/<link\b(?=[^>]*rel=["']canonical["'])[^>]*>\s*/gi, "")
        .replace(/<script\b[^>]*id=["']cinnova-structured-data["'][^>]*>[\s\S]*?<\/script>\s*/gi, "");
    html = html.replace("</head>", `    ${notFoundHead()}\n  </head>`);
    html = html.replace('<div id="root"></div>', notFoundShell());
    await writeFile(path.join(distDir, "404.html"), html, "utf8");
}

/* News Center index + stories. Demo fixtures are excluded from story prerender. */
const newsStories = getPublicNewsStories();
const newsIndexTitle = "News: Local, State, National & International | Cin Nova";
const newsIndexDescription =
    "Follow Cin Nova News for clear local, state, national, and international coverage, organized so you can quickly find the stories that matter to you.";
const newsIndexMetadata = {
    title: newsIndexTitle,
    description: newsIndexDescription,
    canonical: getNewsIndexUrl(),
    image: defaultOgImage,
    imageAlt: "Cin Nova News",
    type: "website",
};
const newsIndexLinks = newsStories
    .map((story) => `<li><a href="/news/${escapeHtml(story.slug)}">${escapeHtml(story.title)}</a></li>`)
    .join("");
await writeRoute(
    "news.html",
    newsIndexMetadata,
    {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Cin Nova News",
        description: newsIndexDescription,
        url: getNewsIndexUrl(),
        publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
        hasPart: newsStories.map((story) => ({
            "@type": "NewsArticle",
            headline: story.title,
            url: `${siteUrl}/news/${story.slug}`,
        })),
    },
    `<div id="root"><main class="news-page" data-seo-shell="news"><h1>Your world, from the block to the globe.</h1><p>${escapeHtml(newsIndexDescription)}</p><ul>${newsIndexLinks}</ul><nav aria-label="Site"><a href="/">Home</a><a href="/blog">Blog</a><a href="/products">Products</a></nav></main></div>`
);

for (const story of newsStories) {
    const related = getRelatedNewsStories(story);
    const metadata = getNewsStoryMetadata(story);
    const schema = buildNewsArticleSchema(story, related);
    const relatedLinks = related
        .map((item) => `<li><a href="/news/${escapeHtml(item.slug)}">${escapeHtml(item.title)}</a></li>`)
        .join("");
    const shell = `<div id="root"><main class="news-page news-story-page" data-seo-shell="news-story"><article><p>${escapeHtml(getCoverageLabel(story.coverageLevel))} · ${escapeHtml(story.category)}</p><h1>${escapeHtml(story.title)}</h1><p>${escapeHtml(story.dek)}</p><img src="${escapeHtml(story.heroImage)}" alt="${escapeHtml(story.heroAlt || story.title)}" /><p>${escapeHtml(story.summary)}</p><nav aria-label="Related news"><a href="/news">More Cin Nova News</a><ul>${relatedLinks}</ul></nav></article></main></div>`;
    await writeRoute(path.join("news", `${story.slug}.html`), metadata, schema, shell);
}

/* CinNova Books storefront index + detail foundations. */
const booksCatalog = getCatalogBooks();
const booksIndexTitle = "Books | CinNova Publishing";
const booksIndexDescription =
    "Explore CinNova Books — original fiction, illustrated worlds, cookbooks, and companion editions from CinNova Press.";
const booksIndexMetadata = {
    title: booksIndexTitle,
    description: booksIndexDescription,
    canonical: getBooksIndexUrl(),
    image: `${siteUrl}/images/hero/cinnova-books-hero-nightmare-beyond-master.png`,
    imageAlt: "CinNova Books cinematic hero",
    type: "website",
};
const booksIndexLinks = booksCatalog
    .map((book) => `<li><a href="/books/${escapeHtml(book.slug)}">${escapeHtml(book.title)}</a></li>`)
    .join("");
await writeRoute(
    "books.html",
    booksIndexMetadata,
    {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "CinNova Books",
        description: booksIndexDescription,
        url: getBooksIndexUrl(),
        publisher: { "@type": "Organization", name: "CinNova", url: siteUrl },
        hasPart: booksCatalog.map((book) => ({
            "@type": "Book",
            name: book.title,
            url: getBookUrl(book),
        })),
    },
    `<div id="root"><main class="books-page" data-seo-shell="books"><h1>Stories That Open New Worlds</h1><p>${escapeHtml(booksIndexDescription)}</p><ul>${booksIndexLinks}</ul><nav aria-label="Site"><a href="/">Home</a><a href="/products">Products</a><a href="/blog">Blog</a><a href="/news">News</a></nav></main></div>`
);

for (const book of booksCatalog) {
    const metadata = {
        title: `${book.title} | CinNova Books`,
        description: book.description,
        canonical: getBookUrl(book),
        image: book.cover.startsWith("http") ? book.cover : `${siteUrl}${book.cover}`,
        imageAlt: book.coverAlt || book.title,
        type: "website",
    };
    const schema = withSchemaGraph(
        {
            "@type": "Book",
            name: book.title,
            description: book.description,
            url: getBookUrl(book),
            genre: book.category,
            publisher: { "@type": "Organization", name: "CinNova", url: siteUrl },
        },
        buildBreadcrumbSchema([
            { name: "Home", url: `${siteUrl}/` },
            { name: "Books", url: getBooksIndexUrl() },
            { name: book.title, url: getBookUrl(book) },
        ]),
    );
    const shell = `<div id="root"><main class="books-page books-detail-page" data-seo-shell="book-detail"><article><nav aria-label="Breadcrumb"><a href="/books">Books</a> / ${escapeHtml(book.title)}</nav><p>${escapeHtml(statusLabel(book))} · ${escapeHtml(book.category)}</p><h1>${escapeHtml(book.title)}</h1><p>${escapeHtml(book.description)}</p><img src="${escapeHtml(book.cover)}" alt="${escapeHtml(book.coverAlt || book.title)}" /><nav aria-label="Books"><a href="/books">All CinNova Books</a></nav></article></main></div>`;
    await writeRoute(path.join("books", `${book.slug}.html`), metadata, schema, shell);
}

console.log(
    `Generated crawlable metadata for ${posts.length} articles, ${blogCategories.length} categories, the blog index, ` +
        `${products.length} products + product index, ${resources.length} resources + resource index, ` +
        `${PUBLIC_PAGE_ROUTES.length} migrated public pages, the news index, ${newsStories.length} news stories, ` +
        `the books index, ${booksCatalog.length} book pages, and the branded 404 page.`
);
