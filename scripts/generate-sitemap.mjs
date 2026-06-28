import { writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
    collectSitemapEntries,
    ROBOTS_DISALLOW_PATHS,
    siteUrl,
} from "../src/data/seoConfig.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");

function escapeXml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function buildImageTags(images = []) {
    return images
        .map(
            (image) => `    <image:image>
      <image:loc>${escapeXml(image.loc)}</image:loc>${image.title ? `\n      <image:title>${escapeXml(image.title)}</image:title>` : ""}
    </image:image>`,
        )
        .join("\n");
}

function buildSitemapXml(entries) {
    const hasImages = entries.some((entry) => entry.images?.length);
    const xmlns = hasImages
        ? 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'
        : 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';

    const body = entries
        .map((entry) => {
            const imageBlock = entry.images?.length ? `\n${buildImageTags(entry.images)}` : "";
            return `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${escapeXml(entry.lastmod)}</lastmod>
    <changefreq>${escapeXml(entry.changefreq)}</changefreq>
    <priority>${escapeXml(entry.priority)}</priority>${imageBlock}
  </url>`;
        })
        .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset ${xmlns}>
${body}
</urlset>
`;
}

function buildVideoSitemapXml() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Reserved for future video URLs. Add entries with xmlns:video when hosted video assets ship. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
</urlset>
`;
}

function buildRobotsTxt() {
    const disallowLines = ROBOTS_DISALLOW_PATHS.map((p) => `Disallow: ${p}`).join("\n");
    return `User-agent: *
Allow: /
${disallowLines ? `${disallowLines}\n` : ""}
Sitemap: ${siteUrl}/sitemap.xml
Sitemap: ${siteUrl}/sitemap-video.xml
`;
}

function validateSitemapXml(xml, entries) {
    const errors = [];

    if (!xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
        errors.push("Missing XML declaration");
    }

    if (!xml.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
        errors.push("Missing sitemap namespace");
    }

    const locMatches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    if (locMatches.length !== entries.length) {
        errors.push(`Expected ${entries.length} <loc> entries, found ${locMatches.length}`);
    }

    const uniqueLocs = new Set(locMatches);
    if (uniqueLocs.size !== locMatches.length) {
        errors.push("Duplicate <loc> values in generated XML");
    }

    for (const loc of locMatches) {
        if (!loc.startsWith(siteUrl)) {
            errors.push(`Non-production absolute URL: ${loc}`);
        }
    }

    const excludedPatterns = ["/blog-admin", "page=newsletter-admin", "page=newsletter-success"];
    for (const loc of locMatches) {
        if (excludedPatterns.some((pattern) => loc.includes(pattern))) {
            errors.push(`Excluded route present in sitemap: ${loc}`);
        }
    }

    const imageEntries = entries.filter((entry) => entry.images?.length).length;
    if (imageEntries && !xml.includes("xmlns:image=")) {
        errors.push("Image entries present but image namespace missing");
    }

    return errors;
}

const entries = collectSitemapEntries();
const sitemap = buildSitemapXml(entries);
const videoSitemap = buildVideoSitemapXml();
const robots = buildRobotsTxt();

const validationErrors = validateSitemapXml(sitemap, entries);
if (validationErrors.length) {
    console.error("Sitemap validation failed:");
    validationErrors.forEach((error) => console.error(`  ✗ ${error}`));
    process.exitCode = 1;
} else {
    console.log(`Sitemap validation passed (${entries.length} URLs).`);
}

await writeFile(path.join(publicDir, "sitemap.xml"), sitemap, "utf8");
await writeFile(path.join(publicDir, "sitemap-video.xml"), videoSitemap, "utf8");
await writeFile(path.join(publicDir, "robots.txt"), robots, "utf8");

const imageUrlCount = entries.reduce((count, entry) => count + (entry.images?.length || 0), 0);
console.log(`✓ public/sitemap.xml (${entries.length} URLs, ${imageUrlCount} image entries)`);
console.log("✓ public/sitemap-video.xml (stub for future video URLs)");
console.log("✓ public/robots.txt");

const breakdown = {
    static: entries.filter((e) => e.loc.includes("?page=") || e.loc === `${siteUrl}/`).length,
    blog: entries.filter((e) => e.loc.includes("/blog/")).length,
    resources: entries.filter((e) => e.loc.includes("?resource=")).length,
};
console.log(
    `  Breakdown: ${breakdown.static} static/product pages, ${breakdown.blog} blog URLs, ${breakdown.resources} resources`,
);

if (process.env.CI) {
    const written = await readFile(path.join(publicDir, "sitemap.xml"), "utf8");
    if (written !== sitemap) {
        console.error("Sitemap write verification failed");
        process.exitCode = 1;
    }
}
