/**
 * Phase 11.4A affiliate management foundation tests.
 * Run: npm run test:affiliate-foundation
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fail = (msg) => {
    console.error(`FAIL: ${msg}`);
    process.exitCode = 1;
};
const pass = (msg) => console.log(`PASS: ${msg}`);

const affiliate = await import(pathToFileURL(join(root, "src/data/affiliate/index.js")).href);
const { getAffiliateLinksForIds, affiliateLinks } = await import(
    pathToFileURL(join(root, "src/data/affiliateLinks.js")).href
);

const analyticsSource = readFileSync(join(root, "src/utils/analytics.js"), "utf8");
const affiliateLinksSource = readFileSync(join(root, "src/data/affiliateLinks.js"), "utf8");
const registrySource = readFileSync(join(root, "src/data/affiliate/partnerRegistry.js"), "utf8");
const articleSource = readFileSync(join(root, "src/pages/ArticlePage.jsx"), "utf8");
const appSource = readFileSync(join(root, "src/App.jsx"), "utf8");
const envExample = readFileSync(join(root, ".env.example"), "utf8");

try {
    assert.deepEqual(affiliate.PARTNER_TYPE_LIST.slice().sort(), [
        "affiliate",
        "official",
        "partner",
        "referral",
    ]);
    pass("partner types include affiliate, referral, partner, official");
} catch (error) {
    fail(`partner types: ${error.message}`);
}

try {
    assert.equal(affiliate.isAffiliateProgramGloballyEnabled(), false);
    const status = affiliate.getAffiliateProgramStatus();
    assert.equal(status.globallyEnabled, false);
    assert.equal(status.envFlag, "VITE_AFFILIATES_ENABLED");
    pass("global affiliate program disabled by default");
} catch (error) {
    fail(`global config: ${error.message}`);
}

try {
    const check = affiliate.validatePartnerRegistry(affiliate.listPartners());
    assert.equal(check.ok, true, JSON.stringify(check));
    assert.equal(check.duplicateIds.length, 0);
    assert.ok(affiliate.listPartners().length >= 6);
    assert.ok(affiliate.listPartners().every((p) => p.enabled === false));
    pass("partner registry validates and all partners disabled");
} catch (error) {
    fail(`registry: ${error.message}`);
}

try {
    const notion = affiliate.resolvePartnerLink("notion");
    assert.equal(notion.renderable, false);
    assert.equal(notion.href, null);
    assert.equal(getAffiliateLinksForIds([1, 2, 3]).length, 0);
    assert.equal(affiliateLinks[1].url, null);
    pass("no renderable affiliate destinations while inactive");
} catch (error) {
    fail(`resolve gate: ${error.message}`);
}

try {
    assert.equal(affiliate.validateHttpsUrl("http://evil.example").ok, false);
    assert.equal(affiliate.validateHttpsUrl("https://www.notion.com/").ok, true);
    assert.equal(affiliate.validateHttpsUrl("").ok, false);
    pass("https link validation");
} catch (error) {
    fail(`url validation: ${error.message}`);
}

try {
    assert.match(analyticsSource, /affiliate_outbound_click/);
    assert.match(analyticsSource, /trackAffiliateOutboundClick/);
    const helperStart = analyticsSource.indexOf("export function trackAffiliateOutboundClick");
    assert.ok(helperStart > 0);
    const helperSlice = analyticsSource.slice(helperStart, helperStart + 900);
    assert.doesNotMatch(helperSlice, /begin_checkout/);
    assert.doesNotMatch(helperSlice, /["']purchase["']/);
    pass("GA4 affiliate outbound helper present without purchase events");
} catch (error) {
    fail(`analytics: ${error.message}`);
}

try {
    assert.doesNotMatch(affiliateLinksSource, /\?ref=cinnova/);
    assert.doesNotMatch(registrySource, /\?ref=cinnova/);
    assert.doesNotMatch(registrySource, /tag=|aff_id=|affiliateId=/i);
    pass("no hardcoded affiliate query stubs in registry/compat layer");
} catch (error) {
    fail(`hardcoded urls: ${error.message}`);
}

try {
    assert.match(articleSource, /PartnerOutboundLink/);
    assert.match(articleSource, /AffiliateDisclosure/);
    assert.doesNotMatch(articleSource, /Some links below are affiliate links/);
    pass("ArticlePage uses PartnerOutboundLink + gated disclosure");
} catch (error) {
    fail(`article page: ${error.message}`);
}

try {
    assert.match(appSource, /PartnerAdmin/);
    assert.match(appSource, /\/partner-admin/);
    assert.match(envExample, /VITE_AFFILIATES_ENABLED/);
    assert.match(envExample, /VITE_AFFILIATE_URL_NOTION/);
    pass("admin route + env placeholders wired");
} catch (error) {
    fail(`admin/env: ${error.message}`);
}

if (!process.exitCode) {
    console.log("All affiliate foundation checks passed.");
}
