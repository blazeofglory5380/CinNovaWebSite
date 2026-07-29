const htmlEntities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
};

export function escapeHtml(value = "") {
    return String(value).replace(/[&<>"']/g, (character) => htmlEntities[character]);
}

export function escapeJsonForHtml(value) {
    return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function toAbsoluteUrl(siteUrl, value = "") {
    if (!value) return siteUrl;
    if (/^https?:\/\//i.test(value)) return value;
    return `${siteUrl}${value.startsWith("/") ? "" : "/"}${value}`;
}

export function getArticleMetadata(post, { siteUrl, defaultOgImage }) {
    const canonical = `${siteUrl}/blog/${post.slug}`;
    const title =
        (post.seoTitle && String(post.seoTitle).trim()) ||
        `${post.title} | CinNova Blog`;
    const description =
        (post.seoDescription && String(post.seoDescription).trim()) ||
        (post.metaDescription && String(post.metaDescription).trim()) ||
        post.excerpt ||
        "";
    return {
        title,
        description,
        canonical,
        type: "article",
        image: toAbsoluteUrl(siteUrl, post.ogImage || post.heroImage || defaultOgImage),
    };
}

export function getBlogMetadata({ siteUrl, defaultOgImage }) {
    return {
        title: "CinNova Blog | AI, Apps, Education, Safety, and Real Estate",
        description: "Read CinNova research and practical guides about AI software, education, real estate, safety, infrastructure, and building useful technology products.",
        canonical: `${siteUrl}/blog`,
        type: "website",
        image: toAbsoluteUrl(siteUrl, defaultOgImage),
    };
}

export function getCategoryMetadata(category, { siteUrl, defaultOgImage }) {
    const slug = String(category)
        .trim()
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    return {
        title: `${category} Articles | CinNova Blog`,
        description: `Read CinNova ${category} articles, practical guides, and research from the CinNova product ecosystem.`,
        canonical: `${siteUrl}/blog/category/${slug}`,
        type: "website",
        image: toAbsoluteUrl(siteUrl, defaultOgImage),
    };
}

function toIsoDate(value) {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? undefined : new Date(parsed).toISOString();
}

export function buildArticleSchema(post, relatedPosts, { siteUrl, defaultOgImage, author }) {
    const metadata = getArticleMetadata(post, { siteUrl, defaultOgImage });
    const imageUrl = toAbsoluteUrl(siteUrl, post.heroImage || post.ogImage || defaultOgImage);
    const imageAlt = post.heroImageAlt || post.title;
    const datePublished = toIsoDate(post.date);
    const dateModified = toIsoDate(post.updatedDate || post.date);
    const categoryUrl = `${siteUrl}/blog/category/${String(post.category)
        .trim()
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")}`;

    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BlogPosting",
                headline: post.title,
                description: metadata.description,
                url: metadata.canonical,
                mainEntityOfPage: metadata.canonical,
                ...(datePublished ? { datePublished } : {}),
                ...(dateModified ? { dateModified } : {}),
                articleSection: post.category,
                keywords: [...new Set([...(post.tags || []), ...(post.seoKeywords || [])])].join(", "),
                image: {
                    "@type": "ImageObject",
                    url: imageUrl,
                    name: imageAlt,
                    ...(post.heroImageWidth ? { width: post.heroImageWidth } : {}),
                    ...(post.heroImageHeight ? { height: post.heroImageHeight } : {}),
                    ...(post.heroImageCaption ? { caption: post.heroImageCaption } : {}),
                },
                author: {
                    "@type": "Person",
                    name: author?.name || post.author || "CinNova Team",
                    ...(author?.role ? { jobTitle: author.role } : {}),
                    url: siteUrl,
                },
                publisher: {
                    "@type": "Organization",
                    name: "CinNova",
                    url: siteUrl,
                    logo: {
                        "@type": "ImageObject",
                        url: toAbsoluteUrl(siteUrl, defaultOgImage),
                        name: "CinNova",
                    },
                },
                isPartOf: {
                    "@type": "Blog",
                    name: "CinNova Blog",
                    url: `${siteUrl}/blog`,
                },
                relatedLink: relatedPosts.map((related) => `${siteUrl}/blog/${related.slug}`),
            },
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
                    { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
                    { "@type": "ListItem", position: 3, name: post.category, item: categoryUrl },
                    { "@type": "ListItem", position: 4, name: post.title, item: metadata.canonical },
                ],
            },
        ],
    };
}

// ─────────────────────────────────────────────────────────────────────────
// Product / resource / index metadata + schema (Phase 2A)
// All values are derived strictly from repository data. No prices, ratings,
// reviews, launch dates, download counts, or availability claims are invented.
// ─────────────────────────────────────────────────────────────────────────

export function getProductsIndexMetadata({ siteUrl, defaultOgImage }) {
    return {
        title: "CinNova Products | AI Tools for Learning, Safety, Support & Real Estate",
        description:
            "Explore the CinNova product ecosystem: StudyNest, PoisonGuard, Kiddo, TechMate AI, and CinNova Real Estate AI — five practical AI platforms built for real everyday problems.",
        canonical: `${siteUrl}/products`,
        type: "website",
        image: toAbsoluteUrl(siteUrl, defaultOgImage),
    };
}

export function getProductMetadata(product, { siteUrl, defaultOgImage }) {
    return {
        title: `${product.name} | ${product.category} — CinNova`,
        description: product.description,
        canonical: `${siteUrl}/products/${product.page}`,
        type: "website",
        image: toAbsoluteUrl(siteUrl, product.image || defaultOgImage),
    };
}

export function getResourcesIndexMetadata({ siteUrl, defaultOgImage }) {
    return {
        title: "CinNova Resources | Free Guides, Templates, Checklists & White Papers",
        description:
            "Browse free CinNova resources: starter guides, checklists, templates, white papers, product brochures, and case studies for learning, safety, real estate, and building AI products.",
        canonical: `${siteUrl}/resources`,
        type: "website",
        image: toAbsoluteUrl(siteUrl, defaultOgImage),
    };
}

export function getResourceMetadata(resource, { siteUrl, defaultOgImage }) {
    return {
        title: `${resource.title} | CinNova Resources`,
        description: resource.description,
        canonical: `${siteUrl}/resources/${resource.slug}`,
        type: "article",
        image: toAbsoluteUrl(siteUrl, resource.coverImage?.src || defaultOgImage),
    };
}

export function buildProductSchema(product, { siteUrl, defaultOgImage }) {
    const metadata = getProductMetadata(product, { siteUrl, defaultOgImage });
    const image = toAbsoluteUrl(siteUrl, product.image || defaultOgImage);
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                name: metadata.title,
                description: metadata.description,
                url: metadata.canonical,
                isPartOf: { "@type": "WebSite", name: "CinNova", url: siteUrl },
            },
            {
                "@type": "SoftwareApplication",
                name: product.name,
                applicationCategory: product.category,
                operatingSystem: "Web",
                description: product.description,
                url: metadata.canonical,
                image: {
                    "@type": "ImageObject",
                    url: image,
                    ...(product.imageAlt ? { name: product.imageAlt } : {}),
                },
                publisher: { "@type": "Organization", name: "CinNova", url: siteUrl },
            },
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
                    { "@type": "ListItem", position: 2, name: "Products", item: `${siteUrl}/products` },
                    { "@type": "ListItem", position: 3, name: product.name, item: metadata.canonical },
                ],
            },
        ],
    };
}

export function buildResourceSchema(resource, { siteUrl, defaultOgImage }) {
    const metadata = getResourceMetadata(resource, { siteUrl, defaultOgImage });
    const cover = resource.coverImage?.src ? toAbsoluteUrl(siteUrl, resource.coverImage.src) : null;
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                name: metadata.title,
                description: metadata.description,
                url: metadata.canonical,
                isPartOf: { "@type": "WebSite", name: "CinNova", url: siteUrl },
            },
            {
                "@type": "CreativeWork",
                name: resource.title,
                headline: resource.title,
                description: resource.description,
                url: metadata.canonical,
                genre: resource.category,
                about: resource.product,
                learningResourceType: resource.format,
                ...(cover
                    ? {
                          image: {
                              "@type": "ImageObject",
                              url: cover,
                              ...(resource.coverImage.alt ? { name: resource.coverImage.alt } : {}),
                          },
                      }
                    : {}),
                publisher: { "@type": "Organization", name: "CinNova", url: siteUrl },
            },
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
                    { "@type": "ListItem", position: 2, name: "Resources", item: `${siteUrl}/resources` },
                    { "@type": "ListItem", position: 3, name: resource.title, item: metadata.canonical },
                ],
            },
        ],
    };
}

// ─────────────────────────────────────────────────────────────────────────
// Migrated public marketing/company/tool/hub pages (Phase 2B, Checkpoint 1).
// Metadata comes from the shared publicPageRoutes.js registry; no invented
// prices, ratings, reviews, counts, dates, or contact details.
// ─────────────────────────────────────────────────────────────────────────

/** Meaningful H1 derived from a page title (text before the " | " / " — " suffix). */
export function publicPageH1(route) {
    return route.title.split(/\s[|—]\s/)[0].trim();
}

export function getPublicPageMetadata(route, { siteUrl, defaultOgImage }) {
    return {
        title: route.title,
        description: route.description,
        canonical: `${siteUrl}${route.path}`,
        // Individual guides are long-form articles; other public pages are plain pages.
        type: route.group === "guide" ? "article" : "website",
        image: toAbsoluteUrl(siteUrl, defaultOgImage),
    };
}

/**
 * JSON-LD for an individual guide page: TechArticle (mirroring the client-side
 * TutorialSEO schema: headline/description/url/publisher, plus factual
 * inLanguage) and a Home → AI Tutorials → Guide BreadcrumbList.
 * No dates, authors, ratings, reviews, or reading statistics are invented.
 */
export function buildGuideSchema(route, { siteUrl, defaultOgImage }) {
    const metadata = getPublicPageMetadata(route, { siteUrl, defaultOgImage });
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "TechArticle",
                headline: route.title,
                description: route.description,
                url: metadata.canonical,
                inLanguage: route.language || "en",
                publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
                isPartOf: { "@type": "WebSite", name: "CinNova", url: siteUrl },
            },
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
                    { "@type": "ListItem", position: 2, name: "AI Tutorials", item: `${siteUrl}/guides` },
                    { "@type": "ListItem", position: 3, name: publicPageH1(route), item: metadata.canonical },
                ],
            },
        ],
    };
}

export function buildPublicPageSchema(route, { siteUrl, defaultOgImage }) {
    const metadata = getPublicPageMetadata(route, { siteUrl, defaultOgImage });
    const primary = {
        "@type": route.schemaType,
        name: metadata.title,
        description: metadata.description,
        url: metadata.canonical,
        isPartOf: { "@type": "WebSite", name: "CinNova", url: siteUrl },
    };
    if (route.schemaType === "AboutPage") {
        primary.about = { "@type": "Organization", name: "CinNova", url: siteUrl };
    }
    if (route.schemaType === "WebApplication") {
        primary.applicationCategory = "FinanceApplication";
        primary.operatingSystem = "Web";
    }
    return {
        "@context": "https://schema.org",
        "@graph": [
            primary,
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
                    { "@type": "ListItem", position: 2, name: publicPageH1(route), item: metadata.canonical },
                ],
            },
        ],
    };
}

export function buildCollectionSchema(metadata, items) {
    return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: metadata.title,
        url: metadata.canonical,
        description: metadata.description,
        hasPart: items.map((item) => ({ "@type": item.type, name: item.name, url: item.url })),
    };
}

export function renderHeadTags(metadata, schema, alternates) {
    const tags = [
        `<title>${escapeHtml(metadata.title)}</title>`,
        `<meta name="description" content="${escapeHtml(metadata.description)}" />`,
        '<meta name="robots" content="index, follow" />',
        `<link rel="canonical" href="${escapeHtml(metadata.canonical)}" />`,
        `<meta property="og:title" content="${escapeHtml(metadata.title)}" />`,
        `<meta property="og:description" content="${escapeHtml(metadata.description)}" />`,
        `<meta property="og:type" content="${escapeHtml(metadata.type)}" />`,
        `<meta property="og:url" content="${escapeHtml(metadata.canonical)}" />`,
        '<meta property="og:site_name" content="CinNova" />',
        `<meta property="og:image" content="${escapeHtml(metadata.image)}" />`,
        '<meta name="twitter:card" content="summary_large_image" />',
        `<meta name="twitter:title" content="${escapeHtml(metadata.title)}" />`,
        `<meta name="twitter:description" content="${escapeHtml(metadata.description)}" />`,
        '<meta name="twitter:site" content="@CinNova" />',
        `<meta name="twitter:image" content="${escapeHtml(metadata.image)}" />`,
    ];
    for (const alt of alternates || []) {
        tags.push(`<link rel="alternate" hreflang="${escapeHtml(alt.hreflang)}" href="${escapeHtml(alt.href)}" />`);
    }
    if (schema) {
        tags.push(`<script id="cinnova-structured-data" type="application/ld+json">${escapeJsonForHtml(schema)}</script>`);
    }
    return tags.join("\n    ");
}
