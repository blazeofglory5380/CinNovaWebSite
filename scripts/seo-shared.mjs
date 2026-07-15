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
    return {
        title: `${post.title} | CinNova Blog`,
        description: post.seoDescription || post.excerpt,
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

export function renderHeadTags(metadata, schema) {
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
    if (schema) {
        tags.push(`<script id="cinnova-structured-data" type="application/ld+json">${escapeJsonForHtml(schema)}</script>`);
    }
    return tags.join("\n    ");
}
