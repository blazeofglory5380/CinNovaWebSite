/**
 * Phase 11.4C — Recommendation Engine tests.
 * Run: npm run test:recommendations
 */

import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fail = (msg) => {
    console.error(`FAIL: ${msg}`);
    process.exitCode = 1;
};
const pass = (msg) => console.log(`PASS: ${msg}`);

const engine = await import(
    pathToFileURL(join(root, "src/data/recommendations/index.js")).href
);
const analyticsSource = readFileSync(join(root, "src/utils/analytics.js"), "utf8");
const docs = readFileSync(join(root, "docs/RECOMMENDATION_ENGINE.md"), "utf8");
const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const ruleSource = readFileSync(join(root, "src/data/recommendations/ruleEngine.js"), "utf8");
const configSource = readFileSync(
    join(root, "src/data/recommendations/recommendationConfig.js"),
    "utf8",
);

try {
    assert.deepEqual(engine.RECOMMENDATION_TYPE_LIST.slice().sort(), [
        "BLOG",
        "BOOK",
        "FUTURE_COMMERCIAL",
        "GUIDE",
        "NEWS",
        "OFFICIAL_RESOURCE",
        "PRODUCT",
        "RESOURCE",
    ]);
    pass("all recommendation types are defined");
} catch (error) {
    fail(`types: ${error.message}`);
}

try {
    assert.equal(engine.RECOMMENDATION_CONFIG.commercialSlotEnabled, false);
    assert.equal(engine.isCommercialSlotEnabled(), false);
    assert.ok(!engine.RECOMMENDATION_CONFIG.enabledTypes.includes("FUTURE_COMMERCIAL"));
    pass("commercial slot disabled by default");
} catch (error) {
    fail(`commercial default: ${error.message}`);
}

try {
    const anthropic = engine.getRecommendationsForPage(
        engine.buildRecommendationContext({
            pageType: "news-story",
            title: "Anthropic AI safety update",
            category: "Artificial Intelligence",
            tags: ["anthropic", "claude"],
            newsSlug: "example-anthropic",
        }),
    );
    assert.equal(anthropic.enabled, true);
    assert.ok(anthropic.items.length > 0, "expected anthropic recommendations");
    assert.ok(
        anthropic.items.every((item) => item.type !== "FUTURE_COMMERCIAL"),
        "no commercial items",
    );
    assert.ok(
        anthropic.items.some((item) => item.type === "OFFICIAL_RESOURCE" && item.id === "anthropic"),
        "expected official Anthropic resource",
    );
    assert.ok(
        !anthropic.topics.includes("data_center"),
        "Anthropic security context must not map to data_center via bare infrastructure",
    );
    assert.ok(
        anthropic.items.every((item) => !/[?&](ref|tag|aff)=/i.test(item.href || "")),
        "no affiliate query params",
    );
    assert.ok(
        anthropic.items.every((item) => (item.score || 0) >= engine.MIN_RECOMMENDATION_SCORE),
        "all items meet minimum relevance score",
    );
    pass("anthropic context yields editorial + official recommendations only");
} catch (error) {
    fail(`anthropic scenario: ${error.message}`);
}

try {
    const openai = engine.getRecommendationsForPage(
        engine.buildRecommendationContext({
            pageType: "article",
            title: "How ChatGPT and OpenAI changed the LLM landscape",
            blogSlug: "example-openai",
            tags: ["openai", "chatgpt"],
        }),
    );
    assert.ok(openai.items.some((i) => i.type === "OFFICIAL_RESOURCE"));
    assert.ok(openai.items.every((i) => i.type !== "FUTURE_COMMERCIAL"));
    pass("openai article scenario stays non-commercial");
} catch (error) {
    fail(`openai scenario: ${error.message}`);
}

try {
    const dataCenter = engine.getRecommendationsForPage(
        engine.buildRecommendationContext({
            pageType: "article",
            title: "Why data centers are becoming the new gold rush",
            category: "Artificial Intelligence",
            blogSlug: "why-data-centers-are-becoming-the-new-gold-rush",
            tags: ["data center", "infrastructure"],
        }),
    );
    const officialIds = dataCenter.items
        .filter((i) => i.type === "OFFICIAL_RESOURCE")
        .map((i) => i.id);
    assert.ok(
        officialIds.some((id) => ["nvidia", "aws", "microsoft-azure", "google-cloud", "amd-official", "intel-official"].includes(id)),
        `expected infra official resources, got ${officialIds.join(",")}`,
    );
    pass("data center scenario maps to infra official resources");
} catch (error) {
    fail(`data center scenario: ${error.message}`);
}

try {
    const cookbook = engine.getRecommendationsForPage(
        engine.buildRecommendationContext({
            pageType: "book",
            bookSlug: "the-southeast-asian-table",
            title: "The Southeast Asian Table",
            category: "Cookbook",
        }),
    );
    assert.ok(cookbook.items.every((i) => i.type !== "FUTURE_COMMERCIAL"));
    const nightmare = engine.getRecommendationsForPage(
        engine.buildRecommendationContext({
            pageType: "book",
            bookSlug: "nightmare-forest",
            title: "Nightmare Forest",
            category: "Illustrated Fiction",
        }),
    );
    assert.ok(
        nightmare.items.some(
            (i) => i.type === "BOOK" && i.id === "beyond-the-last-light",
        ),
        "nightmare forest should recommend beyond the last light",
    );
    assert.ok(
        nightmare.items
            .filter((i) => i.type === "BOOK")
            .every((i) => i.meta?.releaseStatus),
        "book recommendations expose availability status",
    );
    const seatDetail = engine.getRecommendationsForPage(
        engine.buildRecommendationContext({
            pageType: "book",
            bookSlug: "the-southeast-asian-table",
            title: "The Southeast Asian Table",
            category: "Cookbook",
        }),
    );
    assert.ok(seatDetail.items.some((i) => i.type === "BOOK"), "SEAT detail should recommend sibling books");
    assert.ok(
        seatDetail.items.every((i) => i.id !== "the-southeast-asian-table"),
        "SEAT must not self-recommend",
    );
    pass("cookbook + fiction book scenarios respect series and availability");
} catch (error) {
    fail(`book scenarios: ${error.message}`);
}

try {
    const forcedCommercial = engine.getRecommendationsForPage(
        engine.buildRecommendationContext({ pageType: "home" }),
        { commercialSlotEnabled: true, enabledTypes: [...engine.RECOMMENDATION_TYPE_LIST] },
    );
    assert.ok(
        forcedCommercial.items.every((i) => i.type !== "FUTURE_COMMERCIAL"),
        "even with slot flag, Phase 11.4C emits zero commercial items",
    );
    pass("commercial collector remains empty in 11.4C");
} catch (error) {
    fail(`commercial guard: ${error.message}`);
}

try {
    assert.match(analyticsSource, /recommendation_impression/);
    assert.match(analyticsSource, /recommendation_click/);
    assert.match(analyticsSource, /recommendation_type/);
    assert.match(analyticsSource, /recommendation_position/);
    assert.match(analyticsSource, /recommendation_category/);
    assert.match(analyticsSource, /recommendationImpressionKeys/);
    assert.match(analyticsSource, /is_external/);
    assert.match(analyticsSource, /destination_host/);
    assert.match(analyticsSource, /FUTURE_COMMERCIAL/);
    const recBlock = analyticsSource.slice(
        analyticsSource.indexOf("Phase 11.4C recommendation engine"),
    );
    assert.equal(/begin_checkout|add_payment_info/.test(recBlock), false);
    pass("recommendation analytics events are present and non-purchase");
} catch (error) {
    fail(`analytics: ${error.message}`);
}

try {
    assert.ok(existsSync(join(root, "src/components/recommendations/RecommendationRail.jsx")));
    assert.ok(existsSync(join(root, "docs/RECOMMENDATION_ENGINE.md")));
    for (const section of [
        "Architecture",
        "Rule engine",
        "Priority",
        "Category mapping",
        "Adding recommendation types",
        "Future affiliate activation",
        "Future personalization",
        "Rollback",
    ]) {
        assert.match(docs, new RegExp(section, "i"));
    }
    assert.match(docs, /commercialSlotEnabled:\s*false/i);
    assert.match(docs, /No LLM/i);
    pass("docs cover required sections");
} catch (error) {
    fail(`docs: ${error.message}`);
}

try {
    assert.equal(
        packageJson.scripts["test:recommendations"],
        "node scripts/test-recommendations.mjs",
    );
    assert.match(configSource, /commercialSlotEnabled:\s*false/);
    assert.equal(/affiliate_outbound_click/.test(ruleSource), false);
    assert.equal(/\bwe are partners with\b/i.test(ruleSource), false);
    pass("package script + source guardrails");
} catch (error) {
    fail(`meta: ${error.message}`);
}

try {
    const surfaces = [
        ["src/pages/HomePage.jsx", "HomePage"],
        ["src/pages/ArticlePage.jsx", "ArticlePage"],
        ["src/pages/NewsStoryPage.jsx", "NewsStoryPage"],
        ["src/pages/Books.jsx", "Books"],
        ["src/pages/BookDetailPage.jsx", "BookDetailPage"],
        ["src/pages/ProductsPage.jsx", "ProductsPage"],
        ["src/pages/Resources.jsx", "Resources"],
        ["src/pages/ResourcePage.jsx", "ResourcePage"],
        ["src/pages/Blog.jsx", "Blog"],
        ["src/pages/News.jsx", "News"],
        ["src/pages/AiTutorialsPage.jsx", "AiTutorialsPage"],
        ["src/pages/About.jsx", "About"],
        ["src/pages/Partners.jsx", "Partners"],
        ["src/components/ProductEcosystemSection.jsx", "ProductEcosystemSection"],
    ];
    for (const [rel, label] of surfaces) {
        const src = readFileSync(join(root, rel), "utf8");
        assert.match(src, /RecommendationRail/, `${label} missing RecommendationRail`);
    }
    pass("recommendation rail wired across supported surfaces");
} catch (error) {
    fail(`surface wiring: ${error.message}`);
}

try {
    const unpublished = engine.getRecommendationsForPage(
        engine.buildRecommendationContext({
            pageType: "news-story",
            title: "data center campus",
            relatedNewsIds: ["news-state-2026-07-meta-blackrock-el-paso"],
        }),
    );
    assert.ok(
        unpublished.items.every(
            (i) =>
                i.id !== "news-state-2026-07-meta-blackrock-el-paso" &&
                !String(i.href).includes("meta-blackrock-el-paso-data-center-venture"),
        ),
        "unpublished Meta/BlackRock duplicate must not be recommended",
    );
    pass("unpublished duplicate news is excluded");
} catch (error) {
    fail(`unpublished exclusion: ${error.message}`);
}

try {
    const seat = engine.getRecommendationsForPage(
        engine.buildRecommendationContext({
            pageType: "book",
            bookSlug: "the-southeast-asian-table",
            title: "The Southeast Asian Table",
            category: "Cookbook",
        }),
    );
    assert.ok(
        seat.items.every((i) => i.type !== "RESOURCE" || (i.score || 0) >= 16),
        "cookbook must not pull weak unrelated resources",
    );
    assert.ok(
        !seat.items.some((i) => /real estate/i.test(i.title)),
        "cookbook recommendations must not include real-estate fillers",
    );
    pass("cookbook recommendations stay on-topic");
} catch (error) {
    fail(`cookbook relevance: ${error.message}`);
}

if (process.exitCode) {
    console.error("\nRecommendation engine tests failed.");
} else {
    console.log("\nAll recommendation engine tests passed.");
}
