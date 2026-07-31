/**
 * Phase 11.3 final indexability review helper.
 * Classifies every sitemap URL and flags structural risks.
 * Run: node scripts/audit-sitemap-indexability.mjs
 */
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { readFileSync, existsSync, readdirSync } from "node:fs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { collectSitemapEntries, siteUrl, EXCLUDED_PAGE_KEYS, ROBOTS_DISALLOW_PATHS } = await import(
    pathToFileURL(join(root, "src/data/seoConfig.js")).href
);
const { PUBLIC_PAGE_ROUTES } = await import(pathToFileURL(join(root, "src/data/publicPageRoutes.js")).href);
const { getPublishedBlogPosts, blogCategories } = await import(
    pathToFileURL(join(root, "src/data/blogPosts.js")).href
);
const { getPublicNewsStories } = await import(pathToFileURL(join(root, "src/data/newsPosts.js")).href);
const { getCatalogBooks } = await import(
    pathToFileURL(join(root, "src/data/booksCatalog.js")).href
);
const { products } = await import(pathToFileURL(join(root, "src/data/products.js")).href);
const { resources } = await import(pathToFileURL(join(root, "src/data/resources.js")).href);

function classify(loc) {
    const path = loc.replace(siteUrl, "") || "/";
    if (path === "/") return "Home";
    if (path === "/products") return "Products";
    if (path.startsWith("/products/")) return "Product details";
    if (path === "/books") return "Books";
    if (path.startsWith("/books/")) return "Book details";
    if (path === "/news") return "News";
    if (path.startsWith("/news/")) return "News stories";
    if (path === "/blog") return "Blog";
    if (path.startsWith("/blog/category/")) return "Blog categories";
    if (path.startsWith("/blog/")) return "Blog posts";
    if (path === "/resources") return "Resources";
    if (path.startsWith("/resources/")) return "Resources";
    if (path.startsWith("/guides/") || path === "/guides") return "Guides";
    if (path.startsWith("/company/")) return "Company";
    if (path.startsWith("/tools/")) return "Tools";
    // Top-level migrated marketing pages
    if (
        [
            "/pricing",
            "/about",
            "/contact",
            "/newsletter",
            "/languages",
            "/privacy",
            "/terms",
        ].includes(path)
    ) {
        return "Migrated pages";
    }
    if (path.includes("?")) return "Other";
    return "Other";
}

const entries = collectSitemapEntries();
const counts = {};
const byFamily = {};
const flags = [];

for (const e of entries) {
    const family = classify(e.loc);
    counts[family] = (counts[family] || 0) + 1;
    (byFamily[family] ||= []).push(e.loc);
    if (e.loc.includes("?")) flags.push({ loc: e.loc, issue: "query URL in sitemap" });
    if (!e.loc.startsWith("https://getcinnova.com")) flags.push({ loc: e.loc, issue: "wrong origin" });
    if (e.loc.includes("www.")) flags.push({ loc: e.loc, issue: "www origin" });
    for (const key of EXCLUDED_PAGE_KEYS) {
        if (e.loc.includes(key)) flags.push({ loc: e.loc, issue: `excluded key ${key}` });
    }
}

console.log("=== SITEMAP TOTAL ===");
console.log(entries.length);
console.log("=== COUNTS BY FAMILY ===");
for (const k of Object.keys(counts).sort()) {
    console.log(`${counts[k]}\t${k}`);
}
console.log("=== FLAGS ===");
if (!flags.length) console.log("(none)");
else for (const f of flags) console.log(`${f.issue}\t${f.loc}`);

// Blog integrity
const posts = getPublishedBlogPosts();
const blogSlugs = posts.map((p) => p.slug);
const slugSet = new Set(blogSlugs);
console.log("\n=== BLOG ===");
console.log(`published=${posts.length} uniqueSlugs=${slugSet.size} categories=${blogCategories.length}`);
if (blogSlugs.length !== slugSet.size) console.log("FAIL duplicate blog slugs");
const shadowed = posts.filter((p) => p.shadowed || p.draft || p.status === "draft" || p.published === false);
if (shadowed.length) console.log("FAIL shadowed/draft in published set", shadowed.map((p) => p.slug));

const sitemapBlogPosts = byFamily["Blog posts"] || [];
const expectedBlog = posts.map((p) => `${siteUrl}/blog/${p.slug}`).sort();
const actualBlog = [...sitemapBlogPosts].sort();
if (JSON.stringify(expectedBlog) !== JSON.stringify(actualBlog)) {
    console.log("FAIL blog sitemap mismatch");
    const missing = expectedBlog.filter((u) => !actualBlog.includes(u));
    const extra = actualBlog.filter((u) => !expectedBlog.includes(u));
    console.log("missing", missing);
    console.log("extra", extra);
} else console.log("blog posts sitemap match OK");

// News
const stories = getPublicNewsStories();
console.log("\n=== NEWS ===");
console.log(`public=${stories.length}`);
const newsSlugs = stories.map((s) => s.slug);
if (newsSlugs.length !== new Set(newsSlugs).size) console.log("FAIL duplicate news slugs");
const demos = stories.filter((s) => s.isDemo || s.status === "draft" || s.visibility === "preview");
if (demos.length) console.log("FAIL demo/draft in public set", demos.map((s) => s.slug));

// Books
console.log("\n=== BOOKS ===");
for (const b of getCatalogBooks()) {
    console.log(`${b.slug}\t${b.releaseStatus || b.status}\tpurchasable=${Boolean(b.commerce?.amazonUrl || b.amazonUrl)}`);
}

// Products
console.log("\n=== PRODUCTS ===");
for (const p of products) console.log(`${p.page}\t${p.name}`);

// Resources — length of description / body signals
console.log("\n=== RESOURCES ===");
for (const r of resources) {
    const descLen = (r.description || "").length;
    const bodyLen = (r.body || r.content || r.summary || "").length;
    const sections = Array.isArray(r.sections) ? r.sections.length : 0;
    console.log(`${r.slug}\tdesc=${descLen}\tbodyish=${bodyLen}\tsections=${sections}\tfeatured=${!!r.featured}`);
}

// Migrated pages — locate page components / content size
console.log("\n=== MIGRATED PAGE CONTENT PROBES ===");
const pagesDir = join(root, "src/pages");
const pageFiles = existsSync(pagesDir) ? readdirSync(pagesDir) : [];

function findPageSourceHints(key, _path) {
    const candidates = [
        join(root, "src/pages", `${key}.jsx`),
        join(root, "src/pages", `${key.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join("")}.jsx`),
    ];
    // Heuristic filename map
    const map = {
        pricing: "Pricing.jsx",
        about: "About.jsx",
        contact: "Contact.jsx",
        newsletter: "Newsletter.jsx",
        languages: "Languages.jsx",
        privacy: "Privacy.jsx",
        terms: "Terms.jsx",
        partners: "Partners.jsx",
        partnerships: "Partnerships.jsx",
        "press-center": "PressCenter.jsx",
        "media-kit": "MediaKit.jsx",
        advertise: "Advertise.jsx",
        "partner-with-us": "PartnerWithUs.jsx",
        "sponsor-newsletter": "SponsorNewsletter.jsx",
        "free-rental-property-calculator": "FreeRentalCalculator.jsx",
        "ai-tutorials": "AiTutorials.jsx",
    };
    if (map[key]) candidates.unshift(join(pagesDir, map[key]));
    for (const c of candidates) {
        if (existsSync(c)) return c;
    }
    // Guides often live under tutorials folder
    const guideHits = pageFiles.filter((f) => f.toLowerCase().includes(key.replace(/-guide$/, "").slice(0, 12)));
    return guideHits[0] ? join(pagesDir, guideHits[0]) : null;
}

const thinCandidates = [];
for (const route of PUBLIC_PAGE_ROUTES) {
    const src = findPageSourceHints(route.key, route.path);
    let size = 0;
    let note = "source-not-found";
    if (src) {
        const text = readFileSync(src, "utf8");
        size = text.length;
        note = src.replace(root + "\\", "").replace(root + "/", "");
        // Flag very small page modules
        if (size < 2500 && route.group !== "guide") {
            thinCandidates.push({ key: route.key, path: route.path, size, note });
        }
    } else if (route.group === "guide") {
        // Guides may be data-driven
        note = "guide-data-driven?";
    } else {
        thinCandidates.push({ key: route.key, path: route.path, size: 0, note });
    }
    if (route.path.startsWith("/company/") || ["pricing", "languages", "partners", "partnerships"].includes(route.key)) {
        console.log(`${route.key}\t${route.path}\tsize=${size}\t${note}`);
    }
}

console.log("\n=== THIN / MISSING SOURCE CANDIDATES (non-guide or missing) ===");
for (const t of thinCandidates) console.log(`${t.key}\t${t.path}\tsize=${t.size}\t${t.note}`);

console.log("\n=== ROBOTS DISALLOW ===");
console.log(ROBOTS_DISALLOW_PATHS.join("\n"));

console.log("\n=== CATEGORY COUNT CHECK ===");
console.log(`blogCategories=${blogCategories.length} sitemap categories=${(byFamily["Blog categories"] || []).length}`);
console.log(JSON.stringify(blogCategories, null, 2));
