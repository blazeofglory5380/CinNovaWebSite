/**
 * Phase 11.4B — Revenue Opportunities metrics.
 *
 * All KPI values are placeholders (0) until real affiliate click / revenue
 * telemetry is wired. Catalog inventory counts live in applicationTracker —
 * do not treat these zeros as “no companies exist.”
 */

export const REVENUE_METRICS_PLACEHOLDER = Object.freeze({
    totalPartners: 0,
    applications: 0,
    approved: 0,
    active: 0,
    affiliateClicks: 0,
    revenue: 0,
    conversionRate: 0,
});

/**
 * @returns {{
 *   totalPartners: number,
 *   applications: number,
 *   approved: number,
 *   active: number,
 *   affiliateClicks: number,
 *   revenue: number,
 *   conversionRate: number,
 *   placeholder: true,
 *   currency: 'USD',
 *   notes: string,
 * }}
 */
export function getRevenueOpportunityMetrics() {
    return Object.freeze({
        ...REVENUE_METRICS_PLACEHOLDER,
        placeholder: true,
        currency: "USD",
        notes:
            "Placeholder metrics only. No affiliate clicks, revenue, or conversion data until partners are approved, activated, and telemetry is connected.",
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
