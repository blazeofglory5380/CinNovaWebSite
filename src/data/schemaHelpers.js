import { siteUrl } from "./seoConfig.js";

export function toAbsoluteUrl(path = "") {
    if (!path) return siteUrl;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${siteUrl}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function buildImageObject({ src, alt = "", width, height, caption }) {
    const image = {
        "@type": "ImageObject",
        url: toAbsoluteUrl(src),
    };
    if (alt) image.name = alt;
    if (caption) image.caption = caption;
    if (width) image.width = width;
    if (height) image.height = height;
    return image;
}

export function buildBreadcrumbSchema(items = []) {
    return {
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

export function buildFaqSchema(items = []) {
    return {
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.question || item.q,
            acceptedAnswer: {
                "@type": "Answer",
                text: item.answer || item.a,
            },
        })),
    };
}

export function buildPersonAuthor(authorProfile = {}) {
    return {
        "@type": "Person",
        name: authorProfile.name || "Cin Nova Team",
        jobTitle: authorProfile.role,
        url: siteUrl,
        description: authorProfile.bio,
    };
}

export function withSchemaGraph(...nodes) {
    return {
        "@context": "https://schema.org",
        "@graph": nodes.filter(Boolean),
    };
}
