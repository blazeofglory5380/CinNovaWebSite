import { useMemo, useState } from "react";
import "../App.css";
import SEO from "../components/SEO.jsx";
import { siteUrl } from "../data/seoConfig.js";
import {
    CATALOG_CATEGORY_LIST,
    formatConversionRate,
    formatRevenueMetric,
    getApplicationTrackerSummary,
    getCatalogCategoryLabel,
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
    const catalog = useMemo(() => listPartnerCatalog(), []);
    const trackerRows = useMemo(() => listApplicationTrackerRows(), []);
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredRows = useMemo(() => {
        const q = searchTerm.trim().toLowerCase();
        return trackerRows.filter((row) => {
            if (categoryFilter !== "all" && row.category !== categoryFilter) return false;
            if (!q) return true;
            return [row.companyName, row.categoryLabel, row.partnerType, row.notes, row.officialWebsite]
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
                    <p className="eyebrow">PHASE 11.4B · INTERNAL</p>
                    <h2>Revenue Opportunities</h2>
                    <p>
                        Prospect catalog and application tracker for AI and technology companies.
                        Listing a company here does not mean a partnership, affiliate approval, or
                        commercial relationship exists. No partners are activated in this phase.
                    </p>
                </div>

                <p className="revenue-opportunities-banner" role="note">
                    Revenue KPIs below are placeholders (all zeros) until real click and revenue
                    telemetry exists. Catalog rows are research inventory only.
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
                </div>

                <div className="newsletter-admin-grid" style={{ marginTop: "1.5rem" }}>
                    <article className="newsletter-stat-card">
                        <span>Catalog inventory</span>
                        <strong>{trackerSummary.catalogCount}</strong>
                    </article>
                    <article className="newsletter-stat-card">
                        <span>Not applied</span>
                        <strong>{trackerSummary.notApplied}</strong>
                    </article>
                    <article className="newsletter-stat-card">
                        <span>Activation disabled</span>
                        <strong>{trackerSummary.disabled}</strong>
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
                        placeholder="Search company, category, notes…"
                        aria-label="Search partner catalog"
                    />
                </div>

                <div className="revenue-catalog-table-wrap">
                    <table className="revenue-catalog-table">
                        <caption>
                            Partner Catalog &amp; Application Tracker ({filteredRows.length} shown)
                        </caption>
                        <thead>
                            <tr>
                                <th scope="col">Company</th>
                                <th scope="col">Category</th>
                                <th scope="col">Type</th>
                                <th scope="col">Program</th>
                                <th scope="col">Application</th>
                                <th scope="col">Approval</th>
                                <th scope="col">Activation</th>
                                <th scope="col">FTC</th>
                                <th scope="col">Reviewed</th>
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
                                        </div>
                                    </td>
                                    <td>{row.categoryLabel}</td>
                                    <td>{row.partnerType}</td>
                                    <td>{statusLabel(row.programStatus)}</td>
                                    <td>{statusLabel(row.applicationStatus)}</td>
                                    <td>{statusLabel(row.approvalStatus)}</td>
                                    <td>{statusLabel(row.activationStatus)}</td>
                                    <td>{row.ftcDisclosureRequired ? "Required" : "No"}</td>
                                    <td>{row.lastReviewed}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <p className="revenue-opportunities-footnote">
                    Official websites above are ordinary outbound reference links for internal
                    research. They are not affiliate, referral, or sponsored commercial destinations.
                    See <code>docs/PARTNER_CATALOG.md</code> for add / apply / activate / remove /
                    FTC / validation procedures.
                </p>
            </section>
        </main>
    );
}

export default RevenueOpportunities;
