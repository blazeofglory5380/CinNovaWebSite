import { writeFile } from "node:fs/promises";
import {
    blogCategories,
    getArticleUrl,
    getBlogUrl,
    getCategoryUrl,
    getPublishedBlogPosts,
    siteUrl,
} from "../src/data/blogPosts.js";
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
    ...blogCategories.map((category) => ({
        loc: getCategoryUrl(category),
        lastmod: "2026-06-17",
        changefreq: "weekly",
        priority: "0.8",
    })),
    {
        loc: `${siteUrl}/?page=resources`,
        lastmod: "2026-06-17",
        changefreq: "weekly",
        priority: "0.8",
    },
    // Product pages
    { loc: `${siteUrl}/?page=studynest`,    lastmod: "2026-06-18", changefreq: "monthly", priority: "0.8" },
    { loc: `${siteUrl}/?page=poisonguard`,  lastmod: "2026-06-18", changefreq: "monthly", priority: "0.8" },
    { loc: `${siteUrl}/?page=real-estate`,  lastmod: "2026-06-18", changefreq: "monthly", priority: "0.8" },
    { loc: `${siteUrl}/?page=techmate`,     lastmod: "2026-06-18", changefreq: "monthly", priority: "0.8" },
    { loc: `${siteUrl}/?page=kiddo`,        lastmod: "2026-06-18", changefreq: "monthly", priority: "0.8" },
    // Static pages
    { loc: `${siteUrl}/?page=about`,        lastmod: "2026-06-18", changefreq: "monthly", priority: "0.6" },
    { loc: `${siteUrl}/?page=contact`,      lastmod: "2026-06-18", changefreq: "monthly", priority: "0.6" },
    { loc: `${siteUrl}/?page=pricing`,      lastmod: "2026-06-18", changefreq: "monthly", priority: "0.7" },
    { loc: `${siteUrl}/?page=partners`,     lastmod: "2026-06-18", changefreq: "monthly", priority: "0.6" },
    { loc: `${siteUrl}/?page=newsletter`,   lastmod: "2026-06-18", changefreq: "monthly", priority: "0.6" },
    { loc: `${siteUrl}/?page=media-kit`,    lastmod: "2026-06-18", changefreq: "monthly", priority: "0.6" },
    { loc: `${siteUrl}/?page=advertise`,    lastmod: "2026-06-19", changefreq: "monthly", priority: "0.6" },
    { loc: `${siteUrl}/?page=partner-with-us`, lastmod: "2026-06-19", changefreq: "monthly", priority: "0.6" },
    { loc: `${siteUrl}/?page=sponsor-newsletter`, lastmod: "2026-06-19", changefreq: "monthly", priority: "0.6" },
    ...getPublishedBlogPosts().map((post) => ({
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
