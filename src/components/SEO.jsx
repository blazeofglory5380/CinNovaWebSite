import { useEffect } from "react";
import { defaultOgImage } from "../data/seoConfig.js";

function upsertMeta(attribute, key, content) {
    if (!content) return;

    let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
    if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
    }

    element.setAttribute("content", content);
}

function upsertCanonical(url) {
    if (!url) return;

    let element = document.head.querySelector('link[rel="canonical"]');
    if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", "canonical");
        document.head.appendChild(element);
    }

    element.setAttribute("href", url);
}

// Manage <link rel="alternate" hreflang> tags for multilingual pages.
// Idempotent: clears any previously-managed alternates first, then re-adds.
// Tags are marked with data-cinnova-hreflang so cleanup never touches other links.
function removeManagedAlternates() {
    document.head
        .querySelectorAll('link[rel="alternate"][data-cinnova-hreflang]')
        .forEach((el) => el.remove());
}

function upsertAlternates(alternates) {
    removeManagedAlternates();
    if (!Array.isArray(alternates)) return;
    for (const alt of alternates) {
        if (!alt || !alt.hreflang || !alt.href) continue;
        const link = document.createElement("link");
        link.setAttribute("rel", "alternate");
        link.setAttribute("hreflang", alt.hreflang);
        link.setAttribute("href", alt.href);
        link.setAttribute("data-cinnova-hreflang", "true");
        document.head.appendChild(link);
    }
}

function upsertStructuredData(schema) {
    const existing = document.getElementById("cinnova-structured-data");
    if (existing) existing.remove();
    if (!schema) return;

    const script = document.createElement("script");
    script.id = "cinnova-structured-data";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
}

function SEO({ title, description, url, type = "website", image, schema, noindex = false, alternates }) {
    useEffect(() => {
        document.title = title;

        const previewImage = image || defaultOgImage;

        upsertMeta("name", "description", description);
        upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
        upsertMeta("property", "og:title", title);
        upsertMeta("property", "og:description", description);
        upsertMeta("property", "og:type", type);
        upsertMeta("property", "og:url", url);
        upsertMeta("property", "og:site_name", "Cin Nova");
        upsertMeta("property", "og:image", previewImage);
        upsertMeta("name", "twitter:card", "summary_large_image");
        upsertMeta("name", "twitter:title", title);
        upsertMeta("name", "twitter:description", description);
        upsertMeta("name", "twitter:site", "@CinNova");
        upsertMeta("name", "twitter:image", previewImage);
        upsertCanonical(url);
        upsertAlternates(alternates);
        upsertStructuredData(schema);

        // Clear managed hreflang alternates on unmount / route change so they
        // never leak onto pages that have no language alternates.
        return removeManagedAlternates;
    }, [title, description, url, type, image, schema, noindex, alternates]);

    return null;
}

export default SEO;
