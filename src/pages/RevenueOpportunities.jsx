import { useMemo, useState } from "react";
import "../App.css";
import SEO from "../components/SEO.jsx";
import { siteUrl } from "../data/seoConfig.js";
import {
    CATALOG_CATEGORY_LIST,
    VERIFICATION_BUCKET_LABELS,
    formatConversionRate,
    formatRevenueMetric,
    getApplicationTrackerSummary,
    getCatalogCategoryLabel,
    getEnrollmentInventoryMetrics,
    getEnrollmentProgramTypeLabel,
    getPartnerVerificationReport,
    getRevenueOpportunityMetrics,
    listApplicationTrackerRows,
    listPartnerCatalog,
} from "../data/affiliate/index.js";

function statusLabel(value) {
    return String(value || "")
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

function RevenueOpportunities() {
    const metrics = getRevenueOpportunityMetrics();
    const trackerSummary = getApplicationTrackerSummary();
    const enrollmentInventory = getEnrollmentInventoryMetrics();
    const verificationReport = useMemo(() => getPartnerVerificationReport(), []);
    const catalog = useMemo(() => listPartnerCatalog(), []);
    const trackerRows = useMemo(() => listApplicationTrackerRows(), []);
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredRows = useMemo(() => {
        const q = searchTerm.trim().toLowerCase();
        return trackerRows.filter((row) => {
            if (categoryFilter !== "all" && row.category !== categoryFilter) return false;
            if (!q) return true;
            return [
                row.companyName,
                row.categoryLabel,
                row.partnerType,
                row.enrollmentProgramType,
                row.enrollmentProgramTypeLabel,
                row.notes,
                row.officialWebsite,
                row.verificationBucket,
            ]
                .join(" ")
                .toLowerCase()
                .includes(q);
        });
    }, [trackerRows, categoryFilter, searchTerm]);

    const categoryCounts = useMemo(() => {
        const counts = Object.fromEntries(CATALOG_CATEGORY_LIST.map((key) => [key, 0]));
        catalog.forEach((entry) => {
            counts[entry.category] = (counts[entry.category] || 0) + 1;
        });
        return counts;
    }, [catalog]);

    return (
        <main className="product-page newsletter-admin-page revenue-opportunities-page">
            <SEO
                title="Revenue Opportunities | Cin Nova"
                description="Internal partner catalog and revenue opportunity tracker for Cin Nova."
                url={`${siteUrl}/?page=revenue-opportunities`}
                noindex
            />
            <section className="section">
                <div className="section-heading">
                    <p className="eyebrow">PHASE 11.4D · INTERNAL</p>
                    <h2>Revenue Opportunities</h2>
                    <p>
                        Prospect catalog, enrollment verification, and application tracker for AI
                        and technology companies. Listing a company here does not mean a
                        partnership, affiliate approval, or commercial relationship exists. No
                        partners are activated in this phase.
                    </p>
                </div>

                <p className="revenue-opportunities-banner" role="note">
                    Revenue and enrollment-pipeline KPIs below are placeholders (all zeros) until
                    real applications, clicks, and revenue telemetry exist. Verification inventory
                    counts are research-only and do not imply enrollment.
                </p>

                <div className="newsletter-admin-grid revenue-metrics-grid">
                    <article className="newsletter-stat-card">
                        <span>Total partners</span>
                        <strong>{formatRevenueMetric(metrics.totalPartners)}</strong>
                    </article>
                    <article className="newsletter-stat-card">
                        <span>Applications</span>
                        <strong>{formatRevenueMetric(metrics.applications)}</strong>
                    </article>
                    <article className="newsletter-stat-card">
                        <span>Approved</span>
                        <strong>{formatRevenueMetric(metrics.approved)}</strong>
                    </article>
                    <article className="newsletter-stat-card">
                        <span>Active</span>
                        <strong>{formatRevenueMetric(metrics.active)}</strong>
                    </article>
                    <article className="newsletter-stat-card">
                        <span>Affiliate clicks</span>
                        <strong>{formatRevenueMetric(metrics.affiliateClicks)}</strong>
                    </article>
                    <article className="newsletter-stat-card">
                        <span>Revenue</span>
                        <strong>{formatRevenueMetric(metrics.revenue, { currency: true })}</strong>
                    </article>
                    <article className="newsletter-stat-card">
                        <span>Conversion rate</span>
                        <strong>{formatConversionRate(metrics.conversionRate)}</strong>
                    </article>
                    <article className="newsletter-stat-card">
                        <span>Programs available (placeholder)</span>
                        <strong>{formatRevenueMetric(metrics.programsAvailable)}</strong>
                    </article>
                    <article className="newsletter-stat-card">
                        <span>Programs verified (placeholder)</span>
                        <strong>{formatRevenueMetric(metrics.programsVerified)}</strong>
                    </article>
                    <article className="newsletter-stat-card">
                        <span>Applications submitted</span>
                        <strong>{formatRevenueMetric(metrics.applicationsSubmitted)}</strong>
                    </article>
                    <article className="newsletter-stat-card">
                        <span>Pending review</span>
                        <strong>{formatRevenueMetric(metrics.pendingReview)}</strong>
                    </article>
                    <article className="newsletter-stat-card">
                        <span>Rejected</span>
                        <strong>{formatRevenueMetric(metrics.rejected)}</strong>
                    </article>
                    <article className="newsletter-stat-card">
                        <span>Inactive</span>
                        <strong>{formatRevenueMetric(metrics.inactive)}</strong>
                    </article>
                </div>

                <div className="newsletter-admin-grid" style={{ marginTop: "1.5rem" }}>
                    <article className="newsletter-stat-card">
                        <span>Catalog inventory</span>
                        <strong>{trackerSummary.catalogCount}</strong>
                    </article>
                    <article className="newsletter-stat-card">
                        <span>Not started</span>
                        <strong>{trackerSummary.notStarted}</strong>
                    </article>
                    <article className="newsletter-stat-card">
                        <span>Activation disabled</span>
                        <strong>{trackerSummary.disabled}</strong>
                    </article>
                    <article className="newsletter-stat-card">
                        <span>Research: programs classified</span>
                        <strong>{enrollmentInventory.programsAvailable}</strong>
                    </article>
                    <article className="newsletter-stat-card">
                        <span>Research: verified</span>
                        <strong>{enrollmentInventory.programsVerified}</strong>
                    </article>
                    <article className="newsletter-stat-card">
                        <span>Research: needs verification</span>
                        <strong>{enrollmentInventory.needsVerification}</strong>
                    </article>
                    <article className="newsletter-stat-card">
                        <span>Research: no public program</span>
                        <strong>{enrollmentInventory.noPublicProgram}</strong>
                    </article>
                    <article className="newsletter-stat-card">
                        <span>Research: applications ready</span>
                        <strong>{enrollmentInventory.applicationsReady}</strong>
                    </article>
                </div>

                <div className="revenue-category-strip" aria-label="Catalog categories">
                    {CATALOG_CATEGORY_LIST.map((key) => (
                        <button
                            key={key}
                            type="button"
                            className={
                                categoryFilter === key
                                    ? "revenue-category-chip is-active"
                                    : "revenue-category-chip"
                            }
                            onClick={() =>
                                setCategoryFilter((prev) => (prev === key ? "all" : key))
                            }
                        >
                            {getCatalogCategoryLabel(key)} ({categoryCounts[key] || 0})
                        </button>
                    ))}
                    {categoryFilter !== "all" && (
                        <button
                            type="button"
                            className="revenue-category-chip"
                            onClick={() => setCategoryFilter("all")}
                        >
                            Show all
                        </button>
                    )}
                </div>

                <div className="newsletter-admin-search" style={{ marginTop: "1rem" }}>
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Search company, category, enrollment type, notes…"
                        aria-label="Search partner catalog"
                    />
                </div>

                <div className="revenue-catalog-table-wrap">
                    <table className="revenue-catalog-table">
                        <caption>
                            Partner Enrollment &amp; Application Tracker ({filteredRows.length}{" "}
                            shown)
                        </caption>
                        <thead>
                            <tr>
                                <th scope="col">Company</th>
                                <th scope="col">Category</th>
                                <th scope="col">Enrollment type</th>
                                <th scope="col">Verification</th>
                                <th scope="col">Program</th>
                                <th scope="col">Application</th>
                                <th scope="col">Approval</th>
                                <th scope="col">Activation</th>
                                <th scope="col">FTC</th>
                                <th scope="col">Verified</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRows.map((row) => (
                                <tr key={row.catalogId}>
                                    <td>
                                        <div className="revenue-company-cell">
                                            <strong>{row.companyName}</strong>
                                            <a
                                                href={row.officialWebsite}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {row.officialWebsite.replace(/^https:\/\//, "")}
                                            </a>
                                            {row.officialProgramUrl ? (
                                                <a
                                                    href={row.officialProgramUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Program page
                                                </a>
                                            ) : null}
                                        </div>
                                    </td>
                                    <td>{row.categoryLabel}</td>
                                    <td>
                                        {row.enrollmentProgramTypeLabel ||
                                            getEnrollmentProgramTypeLabel(
                                                row.enrollmentProgramType,
                                            )}
                                    </td>
                                    <td>
                                        {VERIFICATION_BUCKET_LABELS[row.verificationBucket] ||
                                            statusLabel(row.verificationBucket)}
                                    </td>
                                    <td>{statusLabel(row.programStatus)}</td>
                                    <td>{statusLabel(row.applicationStatus)}</td>
                                    <td>{statusLabel(row.approvalStatus)}</td>
                                    <td>{statusLabel(row.activationStatus)}</td>
                                    <td>{row.ftcDisclosureRequired ? "Required" : "No"}</td>
                                    <td>{row.lastVerifiedDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="revenue-catalog-table-wrap" style={{ marginTop: "2rem" }}>
                    <table className="revenue-catalog-table">
                        <caption>Verification report by category</caption>
                        <thead>
                            <tr>
                                <th scope="col">Category</th>
                                <th scope="col">Verified</th>
                                <th scope="col">Needs verification</th>
                                <th scope="col">No public program</th>
                            </tr>
                        </thead>
                        <tbody>
                            {verificationReport.categories.map((row) => (
                                <tr key={row.category}>
                                    <td>{row.categoryLabel}</td>
                                    <td>
                                        {row.buckets.verified} —{" "}
                                        {row.verified.map((c) => c.companyName).join(", ") || "—"}
                                    </td>
                                    <td>
                                        {row.buckets.needs_verification} —{" "}
                                        {row.needsVerification
                                            .map((c) => c.companyName)
                                            .join(", ") || "—"}
                                    </td>
                                    <td>
                                        {row.buckets.no_public_program} —{" "}
                                        {row.noPublicProgram
                                            .map((c) => c.companyName)
                                            .join(", ") || "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <p className="revenue-opportunities-footnote">
                    Official websites and program URLs above are ordinary outbound reference links
                    for internal research. They are not affiliate, referral, or sponsored
                    commercial destinations. See <code>docs/PARTNER_ENROLLMENT.md</code> and{" "}
                    <code>docs/PARTNER_CATALOG.md</code> for verification / apply / compliance
                    procedures.
                </p>
            </section>
        </main>
    );
}

export default RevenueOpportunities;
