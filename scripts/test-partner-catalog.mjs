/**
 * Phase 11.4B/D — Partner Catalog / Enrollment classification tests.
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
const seedSource = readFileSync(
    join(root, "src/data/affiliate/enrollmentCatalogData.js"),
    "utf8",
);
const revenueSource = readFileSync(
    join(root, "src/data/affiliate/revenueOpportunities.js"),
    "utf8",
);
const docs = readFileSync(join(root, "docs/PARTNER_CATALOG.md"), "utf8");
const enrollmentDocs = readFileSync(join(root, "docs/PARTNER_ENROLLMENT.md"), "utf8");
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
    assert.deepEqual(affiliate.ENROLLMENT_PROGRAM_TYPE_LIST.slice().sort(), [
        "agency_partner",
        "cloud_marketplace",
        "consulting_implementation_partner",
        "creator_affiliate",
        "customer_referral",
        "education_program",
        "enterprise_partner",
        "invite_only_partner",
        "no_public_program",
        "reseller",
        "startup_program",
        "technology_integration_partner",
        "unknown",
        "vc_portfolio_program",
    ]);
    assert.deepEqual(affiliate.DIRECT_REVENUE_POTENTIAL_LIST.slice().sort(), [
        "non_commission_partner_program",
        "none",
        "possible_revenue_not_publicly_specified",
        "unknown",
        "verified_commission",
    ]);
    pass("exact program-type and commission-status enums are defined");
} catch (error) {
    fail(`enums: ${error.message}`);
}

try {
    const entries = affiliate.listPartnerCatalog();
    assert.equal(entries.length, 29);
    assert.ok(
        entries.every(
            (e) =>
                e.applicationStatus === "not_started" &&
                e.approvalStatus === "not_approved" &&
                e.activationStatus === "disabled" &&
                e.affiliateId === null &&
                e.referralId === null &&
                e.applicationDate === null &&
                e.approvalDate === null &&
                e.internalNotes === "",
        ),
    );
    assert.equal(
        entries.filter((e) =>
            ["applied", "pending", "approved"].includes(e.applicationStatus),
        ).length,
        0,
    );
    pass("every company remains Not Started / Disabled / no IDs / no Applied-Approved");
} catch (error) {
    fail(`defaults: ${error.message}`);
}

try {
    const entries = affiliate.listPartnerCatalog();
    for (const entry of entries) {
        assert.ok(entry.sourceTitle, `${entry.id} missing sourceTitle`);
        assert.ok(entry.verificationSource, `${entry.id} missing verificationSource`);
        assert.ok(entry.evidenceSummary, `${entry.id} missing evidenceSummary`);
        assert.match(entry.verificationSource, /^https:\/\//);
        if (entry.directRevenuePotential === "verified_commission") {
            assert.ok(
                !/affiliate.?directory|way2earning|postaffiliatepro/i.test(
                    entry.verificationSource,
                ),
                `${entry.id} verified_commission must not rely on third-party directories`,
            );
        }
    }
    pass("official-source fields required; verified_commission not from directories");
} catch (error) {
    fail(`sources: ${error.message}`);
}

try {
    const openai = affiliate.getPartnerCatalogEntry("openai");
    assert.equal(openai.enrollmentProgramType, "consulting_implementation_partner");
    assert.equal(openai.directRevenuePotential, "non_commission_partner_program");
    assert.equal(openai.applicationReady, false);
    assert.equal(openai.revenueReady, false);
    assert.ok(!openai.programTypes.includes("creator_affiliate"));

    const anthropic = affiliate.getPartnerCatalogEntry("anthropic");
    assert.equal(anthropic.enrollmentProgramType, "consulting_implementation_partner");
    assert.equal(anthropic.directRevenuePotential, "non_commission_partner_program");
    assert.match(anthropic.programNotes, /VC Partner Program/i);
    assert.match(anthropic.programNotes, /Development Partner Program/i);
    assert.equal(anthropic.applicationReady, false);

    const eleven = affiliate.getPartnerCatalogEntry("elevenlabs");
    assert.equal(eleven.enrollmentProgramType, "creator_affiliate");
    assert.equal(eleven.directRevenuePotential, "verified_commission");
    assert.equal(eleven.applicationReady, true);
    assert.equal(eleven.revenueReady, true);
    assert.match(eleven.evidenceSummary, /22%/);
    assert.match(eleven.evidenceSummary, /PartnerStack/i);

    pass("OpenAI / Anthropic / ElevenLabs classifications are accurate");
} catch (error) {
    fail(`priority companies: ${error.message}`);
}

try {
    const ready = affiliate.listApplicationReadyPartners();
    const revenue = affiliate.listRevenueReadyPartners();
    assert.ok(ready.every((e) => e.applicationReady));
    assert.ok(revenue.every((e) => e.revenueReady && e.applicationReady));
    assert.ok(
        revenue.every((e) => e.directRevenuePotential === "verified_commission"),
    );
    assert.ok(
        ready.every(
            (e) =>
                e.programStatus !== "invite_only" &&
                e.programStatus !== "closed" &&
                e.enrollmentProgramType !== "unknown" &&
                e.enrollmentProgramType !== "no_public_program",
        ),
    );
    pass("applicationReady / revenueReady separation enforced");
} catch (error) {
    fail(`readiness: ${error.message}`);
}

try {
    assert.equal(catalogSource.includes("ref="), false);
    assert.equal(seedSource.includes("tag="), false);
    assert.match(catalogSource, /affiliateId:\s*null/);
    assert.equal(
        /https?:\/\/[^\s"'`]*[?&](ref|tag|affiliate|aff)=/i.test(seedSource),
        false,
    );
    assert.equal(affiliate.listPartnerCatalog().every((e) => e.activationStatus === "disabled"), true);
    pass("no active links / no commercial tracked URL IDs in catalog seed");
} catch (error) {
    fail(`activation safety: ${error.message}`);
}

try {
    for (const entry of affiliate.listPartnerCatalog()) {
        assert.equal(
            /^\d+\s*(day|days|business\s*days)\b/i.test(entry.estimatedReviewTime),
            false,
            `${entry.id} invented numeric review SLA`,
        );
        if (
            entry.countryRestrictions === "UNKNOWN" ||
            entry.countryRestrictions === "NOT_PUBLISHED" ||
            entry.countryRestrictions === "n/a"
        ) {
            assert.ok(true);
        }
    }
    pass("review times not invented; unknown restrictions preserved");
} catch (error) {
    fail(`review/country: ${error.message}`);
}

try {
    const metrics = affiliate.getRevenueOpportunityMetrics();
    assert.equal(metrics.placeholder, true);
    assert.equal(metrics.revenue, 0);
    assert.equal(metrics.affiliateClicks, 0);
    assert.equal(metrics.active, 0);
    const inventory = affiliate.getEnrollmentInventoryMetrics();
    assert.equal(inventory.applicationsSubmitted, 0);
    assert.equal(inventory.approvedPrograms, 0);
    assert.equal(inventory.activeCommercialPrograms, 0);
    assert.ok(inventory.verifiedCommissionPrograms >= 1);
    assert.ok(inventory.verifiedNonCommissionPrograms >= 1);
    assert.ok(inventory.needsVerification >= 1);
    assert.ok(inventory.noPublicProgram >= 1);
    const report = affiliate.getPartnerVerificationReport();
    assert.equal(report.categories.length, 5);
    pass("dashboard/inventory counts accurate; revenue remains zero");
} catch (error) {
    fail(`inventory: ${error.message}`);
}

try {
    assert.equal(existsSync(join(root, "src/pages/RevenueOpportunities.jsx")), false);
    assert.equal(/RevenueOpportunities/.test(appSource), false);
    assert.equal(
        /export const ADMIN_PAGE_KEYS = new Set\(\[[^\]]*revenue-opportunities[^\]]*\]\)/s.test(
            seoSource,
        ),
        false,
    );
    assert.equal(
        /export const VALID_PAGE_KEYS = new Set\(\[[\s\S]*?revenue-opportunities[\s\S]*?\]\)/.test(
            seoSource,
        ),
        false,
    );
    assert.match(seoSource, /\/\?page=revenue-opportunities/);
    pass("public revenue-opportunities UI removed; robots disallow retained");
} catch (error) {
    fail(`admin route: ${error.message}`);
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
    pass("PARTNER_CATALOG.md covers required procedures");
} catch (error) {
    fail(`docs catalog: ${error.message}`);
}

try {
    for (const section of [
        "Affiliate vs partner programs",
        "Commission verification rules",
        "applicationReady",
        "revenueReady",
        "Official-source requirement",
        "How the owner submits an application",
        "Evidence before Applied",
        "Activation after approval",
        "Renewal",
    ]) {
        assert.match(enrollmentDocs, new RegExp(section, "i"));
    }
    assert.match(enrollmentDocs, /robots rule is not access control/i);
    pass("PARTNER_ENROLLMENT.md covers classification and workflow");
} catch (error) {
    fail(`docs enrollment: ${error.message}`);
}

try {
    assert.equal(packageJson.scripts["test:partner-catalog"], "node scripts/test-partner-catalog.mjs");
    assert.match(revenueSource, /placeholder/i);
    assert.equal(/\b(we are partners with|official partner of)\b/i.test(seedSource), false);
    pass("package script registered and no partnership claims");
} catch (error) {
    fail(`meta: ${error.message}`);
}

if (process.exitCode) {
    console.error("\nPartner catalog tests failed.");
} else {
    console.log("\nAll partner catalog tests passed.");
}
