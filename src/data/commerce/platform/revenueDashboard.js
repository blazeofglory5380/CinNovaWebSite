/**
 * Phase M1 — revenue dashboard architecture.
 * Demo metrics must be explicitly labeled DEMO. No fake real revenue.
 */

export function getRevenueDashboardModel({ includeDemo = false } = {}) {
    const emptySeries = { productRevenue: 0, affiliateRevenue: 0, sponsorshipRevenue: 0, adRevenue: 0 };
    const live = {
        label: "LIVE",
        demo: false,
        productRevenue: 0,
        affiliateClicks: 0,
        affiliateRevenue: 0,
        newsletterGrowth: null,
        sponsorshipRevenue: 0,
        adRevenue: 0,
        topProducts: [],
        topArticles: [],
        conversionRate: null,
        appDownloads: null,
        bookClicks: null,
        bookSales: null,
        note: "No live revenue telemetry connected. Zeros are not invented sales.",
        series: emptySeries,
    };

    if (!includeDemo) return live;

    return {
        ...live,
        label: "DEMO",
        demo: true,
        productRevenue: 1250,
        affiliateClicks: 420,
        affiliateRevenue: 89.5,
        newsletterGrowth: 37,
        sponsorshipRevenue: 500,
        adRevenue: 0,
        topProducts: [
            { id: "demo-seat", name: "Demo: SEAT outbound interest", value: 12 },
        ],
        topArticles: [
            { id: "demo-article", title: "Demo article (not real traffic)", value: 8 },
        ],
        conversionRate: 0.024,
        appDownloads: 0,
        bookClicks: 15,
        bookSales: null,
        note: "DEMO ONLY — fictional numbers for UI layout. Never present as real revenue.",
        series: {
            productRevenue: 1250,
            affiliateRevenue: 89.5,
            sponsorshipRevenue: 500,
            adRevenue: 0,
        },
    };
}
