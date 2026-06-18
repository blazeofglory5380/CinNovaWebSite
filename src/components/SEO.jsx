import { useEffect } from "react";

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

function SEO({ title, description, url, type = "website", image, schema }) {
    useEffect(() => {
        document.title = title;

        upsertMeta("name", "description", description);
        upsertMeta("property", "og:title", title);
        upsertMeta("property", "og:description", description);
        upsertMeta("property", "og:type", type);
        upsertMeta("property", "og:url", url);
        upsertMeta("property", "og:site_name", "Cin Nova");
        if (image) upsertMeta("property", "og:image", image);
        upsertMeta("name", "twitter:card", image ? "summary_large_image" : "summary");
        upsertMeta("name", "twitter:title", title);
        upsertMeta("name", "twitter:description", description);
        upsertMeta("name", "twitter:site", "@CinNova");
        if (image) upsertMeta("name", "twitter:image", image);
        upsertCanonical(url);
        upsertStructuredData(schema);
    }, [title, description, url, type, image, schema]);

    return null;
}

export default SEO;
