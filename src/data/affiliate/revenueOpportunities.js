/**
 * Phase 11.4B/D — Revenue Opportunities metrics.
 *
 * All revenue / click / conversion / pipeline KPIs remain placeholders (0).
 * Classification inventory is separate — see getEnrollmentInventoryMetrics().
 * The public revenue-opportunities UI was removed in Phase 11.4D.
 */

export const REVENUE_METRICS_PLACEHOLDER = Object.freeze({
    totalPartners: 0,
    applications: 0,
    approved: 0,
    active: 0,
    affiliateClicks: 0,
    revenue: 0,
    conversionRate: 0,
    programsAvailable: 0,
    programsVerified: 0,
    applicationsSubmitted: 0,
    pendingReview: 0,
    rejected: 0,
    inactive: 0,
});

export function getRevenueOpportunityMetrics() {
    return Object.freeze({
        ...REVENUE_METRICS_PLACEHOLDER,
        placeholder: true,
        currency: "USD",
        notes:
            "Placeholder revenue metrics only (all zeros). No commercial programs are active. Classification inventory lives in getEnrollmentInventoryMetrics() / docs — not a public admin UI.",
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
