/**
 * Phase 11.4A affiliate management foundation tests (hardened).
 * Run: npm run test:affiliate-foundation
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

const affiliate = await import(pathToFileURL(join(root, "src/data/affiliate/index.js")).href);
const { getAffiliateLinksForIds, affiliateLinks } = await import(
    pathToFileURL(join(root, "src/data/affiliateLinks.js")).href
);

const analyticsSource = readFileSync(join(root, "src/utils/analytics.js"), "utf8");
const affiliateLinksSource = readFileSync(join(root, "src/data/affiliateLinks.js"), "utf8");
const registrySource = readFileSync(join(root, "src/data/affiliate/partnerRegistry.js"), "utf8");
const resolveSource = readFileSync(join(root, "src/data/affiliate/resolvePartnerLink.js"), "utf8");
const validationSource = readFileSync(join(root, "src/data/affiliate/linkValidation.js"), "utf8");
const articleSource = readFileSync(join(root, "src/pages/ArticlePage.jsx"), "utf8");
const appSource = readFileSync(join(root, "src/App.jsx"), "utf8");
const disclosureSource = readFileSync(
    join(root, "src/components/commerce/AffiliateDisclosure.jsx"),
    "utf8",
);
const outboundSource = readFileSync(
    join(root, "src/components/commerce/PartnerOutboundLink.jsx"),
    "utf8",
);
const envExample = readFileSync(join(root, ".env.example"), "utf8");
const docs = readFileSync(join(root, "docs/AFFILIATE_MANAGEMENT.md"), "utf8");
const robots = readFileSync(join(root, "public/robots.txt"), "utf8");
const commerceCatalog = readFileSync(join(root, "src/data/commerceCatalog.js"), "utf8");

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
    assert.equal(affiliate.getAffiliateProgramStatus().globallyEnabled, false);
    pass("global affiliate program disabled by default");
} catch (error) {
    fail(`global config: ${error.message}`);
}

try {
    const check = affiliate.validatePartnerRegistry(affiliate.listPartners());
    assert.equal(check.ok, true, JSON.stringify(check));
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
    pass("no renderable destinations while global/partner gates are off");
} catch (error) {
    fail(`resolve gate: ${error.message}`);
}

try {
    // Dual-gate simulation: partner enabled alone is insufficient without global flag.
    const fakePartner = {
        ...affiliate.getPartnerById("notion"),
        enabled: true,
    };
    const onlyPartner = affiliate.validateResolvedPartnerLink({
        partner: fakePartner,
        href: "https://www.notion.com/",
        globallyEnabled: false,
    });
    assert.equal(onlyPartner.renderable, false);

    const onlyGlobal = affiliate.validateResolvedPartnerLink({
        partner: affiliate.getPartnerById("notion"), // enabled false
        href: "https://www.notion.com/",
        globallyEnabled: true,
    });
    assert.equal(onlyGlobal.renderable, false);

    const both = affiliate.validateResolvedPartnerLink({
        partner: fakePartner,
        href: "https://www.notion.com/",
        globallyEnabled: true,
    });
    assert.equal(both.renderable, true);
    pass("both global and partner gates required");
} catch (error) {
    fail(`dual gate: ${error.message}`);
}

try {
    assert.equal(affiliate.validateHttpsUrl("").ok, false);
    assert.equal(affiliate.validateHttpsUrl("/relative/path").ok, false);
    assert.equal(affiliate.validateHttpsUrl("http://www.notion.com/").ok, false);
    assert.equal(affiliate.validateHttpsUrl("javascript:alert(1)").ok, false);
    assert.equal(affiliate.validateHttpsUrl("data:text/html,hi").ok, false);
    assert.equal(affiliate.validateHttpsUrl("file:///etc/passwd").ok, false);
    assert.equal(affiliate.validateHttpsUrl("https://user:pass@www.notion.com/").ok, false);
    assert.equal(affiliate.validateHttpsUrl("https://127.0.0.1/").ok, false);
    assert.equal(affiliate.validateHttpsUrl("https://192.168.1.10/").ok, false);
    assert.equal(affiliate.validateHttpsUrl("https://www.notion.com/").ok, true);
    pass("URL validation rejects unsafe protocols/hosts/credentials");
} catch (error) {
    fail(`url validation: ${error.message}`);
}

try {
    const partner = {
        ...affiliate.getPartnerById("notion"),
        enabled: true,
    };
    const badHost = affiliate.validateResolvedPartnerLink({
        partner,
        href: "https://evil.example.net/offer",
        globallyEnabled: true,
    });
    assert.equal(badHost.renderable, false);
    assert.ok(badHost.errors.some((e) => /allowlist/i.test(e)));
    pass("destination host must match partner allowlist");
} catch (error) {
    fail(`allowlist: ${error.message}`);
}

try {
    const official = affiliate.getPartnerById("khan-academy");
    assert.equal(official.type, "official");
    assert.equal(official.disclosureRequired, false);
    assert.equal(affiliate.partnerTypeRequiresDisclosure("official"), false);
    assert.equal(affiliate.partnerTypeRequiresDisclosure("affiliate"), true);
    assert.equal(affiliate.partnerTypeRequiresDisclosure("referral"), true);
    pass("official vs commercial disclosure semantics");
} catch (error) {
    fail(`type semantics: ${error.message}`);
}

try {
    assert.match(outboundSource, /noopener noreferrer sponsored nofollow|resolvePartnerLink/);
    assert.match(resolveSource, /sponsored nofollow/);
    assert.match(resolveSource, /noopener noreferrer/);
    assert.match(outboundSource, /trackAffiliateOutboundClick/);
    assert.match(outboundSource, /trackOutboundLinkClick/);
    assert.match(outboundSource, /isCommercial/);
    pass("sponsored rel + commercial-only affiliate analytics wiring");
} catch (error) {
    fail(`link rel/analytics wiring: ${error.message}`);
}

try {
    assert.match(disclosureSource, /if \(!visible\) return null/);
    assert.match(disclosureSource, /data-ftc-disclosure/);
    assert.match(disclosureSource, /affiliate-disclosure-copy/);
    pass("FTC disclosure gated and visible-text based");
} catch (error) {
    fail(`disclosure: ${error.message}`);
}

try {
    const helperStart = analyticsSource.indexOf("export function trackAffiliateOutboundClick");
    const helperSlice = analyticsSource.slice(helperStart, helperStart + 1600);
    assert.match(helperSlice, /affiliate_outbound_click/);
    assert.match(helperSlice, /destination_url_host/);
    assert.match(helperSlice, /partnerType !== "affiliate"/);
    assert.doesNotMatch(helperSlice, /begin_checkout/);
    assert.doesNotMatch(helperSlice, /["']purchase["']/);
    assert.doesNotMatch(helperSlice, /subscribe/);
    assert.match(helperSlice, /shouldSkipDuplicateCommerce/);
    assert.match(analyticsSource, /sanitizeCommerceAnalyticsParams/);
    pass("analytics payload safety + no purchase events + dedupe");
} catch (error) {
    fail(`analytics: ${error.message}`);
}

try {
    assert.doesNotMatch(affiliateLinksSource, /\?ref=cinnova/);
    assert.doesNotMatch(registrySource, /\?ref=cinnova/);
    assert.doesNotMatch(registrySource, /tag=|aff_id=/i);
    assert.doesNotMatch(appSource, /PartnerAdmin/);
    assert.equal(existsSync(join(root, "src/pages/PartnerAdmin.jsx")), false);
    assert.match(robots, /Disallow: \/partner-admin/);
    pass("no hardcoded affiliate stubs; PartnerAdmin UI removed; robots disallow retained");
} catch (error) {
    fail(`hardening/admin: ${error.message}`);
}

try {
    assert.match(articleSource, /PartnerOutboundLink/);
    assert.match(articleSource, /AffiliateDisclosure/);
    assert.doesNotMatch(articleSource, /Some links below are affiliate links/);
    assert.match(commerceCatalog, /affiliateEnabled: false/);
    assert.match(envExample, /VITE_AFFILIATES_ENABLED/);
    assert.match(docs, /Rollback procedure/);
    assert.match(docs, /Both required/);
    assert.match(docs, /Production approval checklist/);
    assert.match(validationSource, /Credential-bearing/);
    pass("docs + article + SEAT non-affiliate posture");
} catch (error) {
    fail(`docs/production posture: ${error.message}`);
}

try {
    assert.match(resolveSource, /readEnv/);
    assert.doesNotMatch(outboundSource, /import\.meta\.env/);
    assert.doesNotMatch(articleSource, /VITE_AFFILIATE_URL_/);
    pass("no environment value leakage into link/article UI modules");
} catch (error) {
    fail(`env leakage: ${error.message}`);
}

if (!process.exitCode) {
    console.log("All affiliate foundation checks passed.");
}
