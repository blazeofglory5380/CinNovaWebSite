/**
 * Phase M1 — media kit metrics model.
 * Use only real metrics. Unavailable numbers → available on request.
 */

export const MEDIA_KIT_METRICS = Object.freeze([
    {
        id: "newsletter",
        label: "Newsletter subscribers",
        value: null,
        display: "Available on request",
        availableOnRequest: true,
    },
    {
        id: "content-program",
        label: "Monthly content program",
        value: "Active",
        display: "Active",
        availableOnRequest: false,
    },
    {
        id: "resource-downloads",
        label: "Resource downloads",
        value: "Live",
        display: "Live",
        availableOnRequest: false,
    },
    {
        id: "product-verticals",
        label: "Product verticals",
        value: 5,
        display: "5",
        availableOnRequest: false,
    },
    {
        id: "article-categories",
        label: "Article categories",
        value: 7,
        display: "7",
        availableOnRequest: false,
    },
    {
        id: "campaign-reach",
        label: "Campaign reach",
        value: null,
        display: "Available on request",
        availableOnRequest: true,
    },
    {
        id: "revenue",
        label: "Revenue / CPM",
        value: null,
        display: "Available on request",
        availableOnRequest: true,
    },
]);

export function listMediaKitMetrics() {
    return MEDIA_KIT_METRICS.map((m) => ({ ...m }));
}

export function buildMediaKitExportText({ siteUrl = "https://getcinnova.com", email = "" } = {}) {
    const lines = [
        "CIN NOVA MEDIA KIT SUMMARY",
        "==========================",
        "",
        "METRICS",
        ...MEDIA_KIT_METRICS.map((m) => `- ${m.label}: ${m.display}`),
        "",
        "NOTE",
        "Numeric traffic, subscriber, and revenue figures that are not verified",
        "are listed as Available on request — never fabricated.",
        "",
        `Website: ${siteUrl}`,
        email ? `Email: ${email}` : "",
        "",
        "© Cin Nova. All Rights Reserved.",
    ].filter(Boolean);
    return lines.join("\n");
}
