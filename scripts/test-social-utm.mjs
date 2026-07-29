#!/usr/bin/env node
/**
 * Lightweight assertions for CinNova social UTM helpers.
 * Run: npm run test:social-utm
 */

import assert from "node:assert/strict";
import {
    SOCIAL_UTM_MEDIUM,
    buildBlogSocialUrl,
    buildNewsSocialUrl,
    buildSocialCampaign,
    buildSocialUrl,
    parseSocialUtm,
    stripSocialUtm,
} from "../src/utils/socialUtm.js";
import {
    createSocialDraftSkeleton,
    validateSocialDraft,
} from "../src/data/socialDraftSchema.js";

function run() {
    const campaign = buildSocialCampaign({
        date: "2026-07-28",
        contentType: "news",
        slug: "meta-blackrock-el-paso-data-center-venture",
    });
    // Default maxSlugChars=40 truncates long slugs safely (no trailing hyphen).
    assert.equal(campaign, "2026-07-28_news_meta-blackrock-el-paso-data-center-ventu");

    const shortCampaign = buildSocialCampaign({
        date: "2026-07-28",
        contentType: "blog",
        slug: "how-ai-changes-property-search",
    });
    assert.equal(shortCampaign, "2026-07-28_blog_how-ai-changes-property-search");

    const newsUrl = buildNewsSocialUrl("meta-blackrock-el-paso-data-center-venture", {
        source: "linkedin",
        date: "2026-07-28",
    });
    assert.match(newsUrl, /^https:\/\/getcinnova\.com\/news\/meta-blackrock-el-paso-data-center-venture\?/);
    const newsUtm = parseSocialUtm(newsUrl);
    assert.equal(newsUtm.source, "linkedin");
    assert.equal(newsUtm.medium, SOCIAL_UTM_MEDIUM);
    assert.equal(newsUtm.isOrganicSocial, true);
    assert.equal(newsUtm.content, "post");

    const blogUrl = buildBlogSocialUrl("how-ai-data-centers-get-financed-joint-ventures", {
        source: "facebook",
        date: "2026-07-28",
        content: "reel",
    });
    assert.match(blogUrl, /utm_source=facebook/);
    assert.match(blogUrl, /utm_content=reel/);

    const cleaned = stripSocialUtm(newsUrl);
    assert.equal(cleaned, "https://getcinnova.com/news/meta-blackrock-el-paso-data-center-venture");

    assert.throws(() => buildSocialUrl("/news/demo", { source: "myspace", campaign: "x" }), /utm_source/);
    assert.throws(
        () => buildSocialUrl("/news/demo", { source: "x", medium: "cpc", campaign: "x" }),
        /utm_medium/,
    );
    assert.throws(() => buildSocialUrl("https://example.com/x", { source: "x", campaign: "ok" }), /getcinnova/);

    const draft = createSocialDraftSkeleton({
        sourceType: "blog",
        sourceSlug: "how-ai-data-centers-get-financed-joint-ventures",
        platform: "linkedin",
        headline: "Test",
    });
    draft.destinationUrl = blogUrl;
    draft.body = "Body";
    const result = validateSocialDraft(draft);
    assert.equal(result.ok, true, result.errors.join("; "));

    console.log("test:social-utm passed");
}

run();
