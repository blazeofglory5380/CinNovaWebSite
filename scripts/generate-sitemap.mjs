import { writeFile } from "node:fs/promises";
import { blogPosts, getArticleUrl, getBlogUrl, siteUrl } from "../src/data/blogPosts.js";
import { resources, getResourceUrl } from "../src/data/resources.js";

function toIsoDate(date) {
    return new Date(date).toISOString().slice(0, 10);
}

const urls = [
    {
        loc: `${siteUrl}/`,
        lastmod: "2026-06-17",
        changefreq: "weekly",
        priority: "1.0",
    },
    {
        loc: getBlogUrl(),
        lastmod: "2026-06-17",
        changefreq: "daily",
        priority: "0.9",
    },
    {
        loc: `${siteUrl}/?page=resources`,
        lastmod: "2026-06-17",
        changefreq: "weekly",
        priority: "0.8",
    },
    ...blogPosts.map((post) => ({
        loc: getArticleUrl(post),
        lastmod: toIsoDate(post.date),
        changefreq: "monthly",
        priority: "0.8",
    })),
    ...resources.map((resource) => ({
        loc: getResourceUrl(resource),
        lastmod: "2026-06-17",
        changefreq: "monthly",
        priority: "0.7",
    })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
    .map(
        (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
    )
    .join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

await writeFile(new URL("../public/sitemap.xml", import.meta.url), sitemap);
await writeFile(new URL("../public/robots.txt", import.meta.url), robots);
