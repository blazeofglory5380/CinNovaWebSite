#!/usr/bin/env node
/**
 * Phase 10A unit checks for editorial helpers (no network, no catalog mutation).
 * Run: npm run test:editorial
 */

import assert from "node:assert/strict";
import { classifyNewsCandidate, normalizeHeadline, jaccard, tokenize } from "../scripts/lib/editorial-dedupe.mjs";
import { scoreNewsFactCheck, scoreBlogFactCheck } from "../scripts/lib/editorial-factcheck.mjs";
import { enrichDraftSeo, auditDraftSeo } from "../scripts/lib/editorial-seo.mjs";
import { suggestNewsInternalLinks } from "../scripts/lib/editorial-links.mjs";
import { runEditorialResearch } from "../scripts/lib/editorial-research.mjs";

function run() {
    assert.equal(normalizeHeadline("Meta & BlackRock!"), "meta blackrock");
    assert.ok(jaccard(tokenize("data center moratorium"), tokenize("data center pause")) > 0.3);

    const dup = classifyNewsCandidate(
        {
            slug: "meta-blackrock-el-paso-data-center-venture",
            title: "Meta and BlackRock form El Paso AI data center venture",
            location: "El Paso, Texas",
        },
        { drafts: [], reports: [] },
    );
    assert.equal(dup.classification, "DUPLICATE");

    const fresh = classifyNewsCandidate(
        {
            slug: "totally-unique-phase10a-test-slug-xyz",
            title: "Unique Phase10A Test Event About Quantum Tea Kettles In Nome",
            location: "Nome, Alaska",
            dek: "A fictional uniqueness probe for unit tests only.",
        },
        { drafts: [], reports: [] },
    );
    assert.equal(fresh.classification, "NEW STORY");

    const hold = scoreNewsFactCheck({
        title: "State proposes data center tax that may take effect next year",
        dek: "Lawmakers advanced a proposal; enactment is pending.",
        location: "Virginia",
        publishedAt: new Date().toISOString(),
        sources: [
            { label: "Bill text", publisher: "Virginia Legislature", url: "https://lis.virginia.gov/example-bill", type: "official" },
            { label: "Coverage", publisher: "Local Paper", url: "https://example-news.org/story", type: "verified" },
        ],
        whyItMatters: "Rate design affects households.",
        summary: "A proposal advanced in committee.",
        uncertainties: ["Effective date not confirmed in official record"],
        verifiedClaims: ["Committee advanced the proposal"],
        attributedClaims: ["Supporters estimate revenue impact"],
    });
    assert.equal(hold.status, "HOLD");
    assert.equal(hold.blockedFromPublish, true);

    const reject = scoreNewsFactCheck({
        title: "",
        sources: [{ url: "https://example.com/replace-me" }],
    });
    assert.equal(reject.status, "REJECT");

    const blog = scoreBlogFactCheck({
        title: "How communities should read AI campus financing headlines",
        seoTitle: "How to read AI campus financing headlines",
        seoDescription: "A practical guide to joint ventures, leases, offtake, and what local officials should ask before celebrating a press-release megawatt number.",
        content: [
            {
                heading: "Start with ownership",
                body: `${"word ".repeat(200)}`,
            },
            {
                heading: "Then contracted revenue",
                body: `${"word ".repeat(200)}`,
            },
        ],
        sources: [{ url: "https://www.sec.gov/example", label: "SEC", publisher: "SEC" }],
    });
    assert.ok(["READY", "REVIEW"].includes(blog.status));

    const enriched = enrichDraftSeo(
        {
            slug: "sample-story",
            title: "Sample AI infrastructure story for communities",
            dek: "Officials weighed power, water, and land-use tradeoffs as a large campus moved through permitting.",
        },
        "news",
    );
    assert.ok(enriched.seoTitle);
    assert.ok(enriched.seoDescription);
    const seo = auditDraftSeo(enriched, "news");
    assert.equal(seo.ok, true);

    const links = suggestNewsInternalLinks({
        title: "Data center electricity rates and household bills",
        dek: "Regulators examined how large loads affect residential customers.",
        summary: "Grid planning and rate design are central.",
        whyItMatters: "Communities need clear cost allocation.",
    });
    assert.ok(Array.isArray(links.relatedBlogSlugs));

    const research = runEditorialResearch({
        dateIso: "2099-01-01",
        packetPath: null,
        dryRun: true,
    });
    assert.equal(research.qualifiedNews.length, 0);
    assert.equal(research.qualifiedBlog, false);
    assert.ok(research.newsDesks.every((desk) => desk.disposition === "NO QUALIFIED STORY"));

    console.log("test:editorial passed");
}

run();
