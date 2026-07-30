#!/usr/bin/env node
/**
 * News Center route regression: canonical /news, legacy /?page=news, story paths.
 */
import assert from "node:assert/strict";
import { resolveLegacyRouteRedirect } from "../src/data/legacyRouteRedirects.js";
import { getNewsIndexPath, getNewsIndexUrl, getNewsStoryPath, getPublicNewsStories } from "../src/data/newsPosts.js";
import { collectSitemapEntries, getStaticPageUrl, siteUrl } from "../src/data/seoConfig.js";

assert.equal(getNewsIndexPath(), "/news");
assert.equal(getNewsIndexUrl(), `${siteUrl}/news`);
assert.equal(getStaticPageUrl("news"), `${siteUrl}/news`);

assert.equal(resolveLegacyRouteRedirect("?page=news"), "/news");
assert.equal(resolveLegacyRouteRedirect("/?page=news"), "/news");
assert.equal(resolveLegacyRouteRedirect("?page=news&story=demo-slug"), "/news/demo-slug");
assert.equal(resolveLegacyRouteRedirect("?page=news-preview"), null);

const stories = getPublicNewsStories();
assert.ok(stories.length > 0, "expected at least one public news story");
const sample = stories[0];
assert.equal(getNewsStoryPath(sample), `/news/${sample.slug}`);

const sitemap = collectSitemapEntries();
const newsCenter = sitemap.filter((entry) => entry.loc === `${siteUrl}/news`);
assert.equal(newsCenter.length, 1, "sitemap must contain /news exactly once");
assert.equal(
    sitemap.filter((entry) => entry.loc.includes("?page=news")).length,
    0,
    "sitemap must not include legacy ?page=news",
);
for (const story of stories) {
    assert.ok(
        sitemap.some((entry) => entry.loc === `${siteUrl}/news/${story.slug}`),
        `sitemap missing story ${story.slug}`,
    );
}

console.log("test:news-route passed");
