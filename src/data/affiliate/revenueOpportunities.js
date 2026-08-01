/**
 * Phase 11.4B/D — Revenue Opportunities metrics.
 *
 * Revenue / click / conversion KPIs remain placeholders (0) until real
 * affiliate telemetry exists. Enrollment pipeline KPIs listed below are also
 * kept at 0 until applications are actually filed — inventory counts live in
 * getEnrollmentInventoryMetrics() / application tracker summary instead.
 */

export const REVENUE_METRICS_PLACEHOLDER = Object.freeze({
    totalPartners: 0,
    applications: 0,
    approved: 0,
    active: 0,
    affiliateClicks: 0,
    revenue: 0,
    conversionRate: 0,
    // Phase 11.4D enrollment KPI placeholders (pipeline / revenue telemetry).
    programsAvailable: 0,
    programsVerified: 0,
    applicationsSubmitted: 0,
    pendingReview: 0,
    rejected: 0,
    inactive: 0,
});

/**
 * @returns {Readonly<object>}
 */
export function getRevenueOpportunityMetrics() {
    return Object.freeze({
        ...REVENUE_METRICS_PLACEHOLDER,
        placeholder: true,
        currency: "USD",
        notes:
            "Placeholder revenue and enrollment-pipeline metrics only (all zeros). Catalog verification inventory is separate — see getEnrollmentInventoryMetrics() and the verification report. No affiliate clicks, revenue, or conversion data until partners are approved, activated, and telemetry is connected.",
    });
}

export function formatRevenueMetric(value, { currency = false } = {}) {
    const n = Number(value) || 0;
    if (currency) {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
        }).format(n);
    }
    if (Number.isInteger(n)) return String(n);
    return n.toFixed(2);
}

export function formatConversionRate(value) {
    const n = Number(value) || 0;
    return `${n.toFixed(2)}%`;
}
