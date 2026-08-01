/**
 * Phase 11.4B — Partner Catalog / Application Tracker / Revenue Opportunities.
 * Run: npm run test:partner-catalog
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

const catalogSource = readFileSync(join(root, "src/data/affiliate/partnerCatalog.js"), "utf8");
const revenueSource = readFileSync(
    join(root, "src/data/affiliate/revenueOpportunities.js"),
    "utf8",
);
const docs = readFileSync(join(root, "docs/PARTNER_CATALOG.md"), "utf8");
const appSource = readFileSync(join(root, "src/App.jsx"), "utf8");
const seoSource = readFileSync(join(root, "src/data/seoConfig.js"), "utf8");
const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

try {
    assert.deepEqual(affiliate.CATALOG_CATEGORY_LIST.slice().sort(), [
        "ai_companies",
        "cloud_providers",
        "creative_tools",
        "developer_platforms",
        "hardware_companies",
    ]);
    pass("catalog categories cover AI, creative, developer, cloud, hardware");
} catch (error) {
    fail(`categories: ${error.message}`);
}

try {
    const check = affiliate.validatePartnerCatalog();
    assert.equal(check.ok, true, JSON.stringify(check.errors, null, 2));
    pass("partner catalog validates");
} catch (error) {
    fail(`catalog validation: ${error.message}`);
}

try {
    const entries = affiliate.listPartnerCatalog();
    assert.ok(entries.length >= 20, `expected >= 20 catalog entries, got ${entries.length}`);

    for (const category of affiliate.CATALOG_CATEGORY_LIST) {
        const count = entries.filter((e) => e.category === category).length;
        assert.ok(count >= 4, `${category} should have at least 4 companies, got ${count}`);
    }

    assert.ok(
        entries.every(
            (e) =>
                e.applicationStatus === "not_applied" &&
                e.approvalStatus === "not_approved" &&
                e.activationStatus === "disabled" &&
                e.affiliateId === null &&
                e.referralId === null,
        ),
    );
    pass("every catalog company defaults to Not Applied / Disabled / no IDs");
} catch (error) {
    fail(`catalog defaults: ${error.message}`);
}

try {
    assert.equal(catalogSource.includes("ref="), false);
    assert.equal(catalogSource.includes("tag="), false);
    assert.match(catalogSource, /affiliateId:\s*null/);
    assert.match(catalogSource, /referralId:\s*null/);
    assert.equal(
        /https?:\/\/[^\s"'`]*[?&](ref|tag|affiliate|aff)=/i.test(catalogSource),
        false,
    );
    pass("catalog source has no affiliate/referral query IDs or commercial tracked URLs");
} catch (error) {
    fail(`no commercial ids: ${error.message}`);
}

try {
    const metrics = affiliate.getRevenueOpportunityMetrics();
    assert.equal(metrics.placeholder, true);
    assert.equal(metrics.totalPartners, 0);
    assert.equal(metrics.applications, 0);
    assert.equal(metrics.approved, 0);
    assert.equal(metrics.active, 0);
    assert.equal(metrics.affiliateClicks, 0);
    assert.equal(metrics.revenue, 0);
    assert.equal(metrics.conversionRate, 0);
    assert.deepEqual(affiliate.REVENUE_METRICS_PLACEHOLDER, {
        totalPartners: 0,
        applications: 0,
        approved: 0,
        active: 0,
        affiliateClicks: 0,
        revenue: 0,
        conversionRate: 0,
    });
    pass("revenue opportunity metrics are placeholders at 0");
} catch (error) {
    fail(`revenue metrics: ${error.message}`);
}

try {
    const summary = affiliate.getApplicationTrackerSummary();
    assert.equal(summary.catalogCount, affiliate.listPartnerCatalog().length);
    assert.equal(summary.notApplied, summary.catalogCount);
    assert.equal(summary.approved, 0);
    assert.equal(summary.active, 0);
    assert.equal(summary.disabled, summary.catalogCount);
    assert.equal(affiliate.listPendingApplications().length, 0);
    assert.equal(affiliate.listActivePartners().length, 0);
    pass("application tracker shows no pending/approved/active partners");
} catch (error) {
    fail(`application tracker: ${error.message}`);
}

try {
    assert.ok(existsSync(join(root, "src/pages/RevenueOpportunities.jsx")));
    assert.match(appSource, /RevenueOpportunities/);
    assert.match(appSource, /revenue-opportunities/);
    assert.match(seoSource, /"revenue-opportunities"/);
    assert.match(seoSource, /\/\?page=revenue-opportunities/);
    assert.match(seoSource, /ADMIN_PAGE_KEYS[\s\S]*revenue-opportunities/);
    pass("revenue opportunities dashboard is admin-gated and robots-disallowed");
} catch (error) {
    fail(`dashboard wiring: ${error.message}`);
}

try {
    for (const section of [
        "Adding a company",
        "Applying to a program",
        "Activating a partner",
        "Removing a partner",
        "FTC compliance",
        "Link validation",
    ]) {
        assert.match(docs, new RegExp(section, "i"));
    }
    assert.match(docs, /does \*\*not\*\* claim a partnership/i);
    assert.match(docs, /No affiliate IDs/i);
    pass("PARTNER_CATALOG.md covers required procedures");
} catch (error) {
    fail(`docs: ${error.message}`);
}

try {
    assert.equal(packageJson.scripts["test:partner-catalog"], "node scripts/test-partner-catalog.mjs");
    assert.match(revenueSource, /placeholder/i);
    // Ensure we did not claim active partnerships in catalog notes boilerplate.
    assert.equal(/\b(we are partners with|official partner of)\b/i.test(catalogSource), false);
    pass("package script registered and no partnership claims in catalog source");
} catch (error) {
    fail(`meta: ${error.message}`);
}

if (process.exitCode) {
    console.error("\nPartner catalog tests failed.");
} else {
    console.log("\nAll partner catalog tests passed.");
}
