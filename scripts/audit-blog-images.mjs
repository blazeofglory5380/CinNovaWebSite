import { getPublishedBlogPosts } from "../src/data/blogPosts.js";
import {
    auditBlogHeroAssignments,
    auditCornerstoneInlineImages,
    blogImageCategories,
    getPoolImagesForCategory,
    blogImagePool,
    articleHeroAssignments,
} from "../src/data/blogImageInventory.js";

const published = getPublishedBlogPosts();
const audit = auditBlogHeroAssignments(published);

console.log("=== Blog Image Audit ===\n");
console.log(`Total published articles: ${audit.totalPublished}`);
console.log(`Articles with hero images: ${audit.withHero}`);
console.log(`Unique hero image paths: ${audit.uniqueHeroImages}`);
console.log(`Missing heroes (post IDs): ${audit.missingPostIds.length ? audit.missingPostIds.join(", ") : "none"}`);

if (audit.duplicates.length) {
    console.log("\nDuplicate hero paths:");
    for (const [img, ids] of audit.duplicates) {
        console.log(`  ${img} → posts ${ids.join(", ")}`);
    }
} else {
    console.log("\nDuplicate hero paths: none");
}

const cornerstoneIds = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 31, 32]);
const cornerstoneDupes = audit.duplicates.filter(([, ids]) => ids.some((id) => cornerstoneIds.has(id)));
console.log(
    `Cornerstone duplicate heroes: ${cornerstoneDupes.length ? cornerstoneDupes.length : "none"}`,
);

const inlineAudit = auditCornerstoneInlineImages(published);
console.log("\n=== Cornerstone inline images ===\n");
console.log(`Cornerstone articles: ${inlineAudit.cornerstoneTotal}`);
console.log(`Cornerstones with inline images: ${inlineAudit.withInlineImages}`);
console.log(`Total inline images placed: ${inlineAudit.totalInlineImages}`);
console.log(
    `Cornerstones missing inline images: ${
        inlineAudit.withoutInlinePostIds.length
            ? inlineAudit.withoutInlinePostIds.join(", ")
            : "none"
    }`,
);

console.log("\n=== Category reserve pools ===\n");
for (const category of Object.keys(blogImageCategories)) {
    const pool = getPoolImagesForCategory(category);
    const assigned = Object.entries(articleHeroAssignments).filter(([, assetId]) => {
        const asset = blogImagePool.find((a) => a.id === assetId);
        return asset?.category === category;
    }).length;
    console.log(`${category}: ${assigned} assigned, ${pool.length} in reserve pool`);
}

console.log("\n=== Per-article assignments ===\n");
published
    .sort((a, b) => a.id - b.id)
    .forEach((post) => {
        console.log(`${String(post.id).padStart(2)} | ${post.heroImage || "MISSING"} | ${post.title}`);
    });

if (audit.missingPostIds.length || audit.duplicates.length || inlineAudit.withoutInlinePostIds.length) {
    process.exitCode = 1;
}
