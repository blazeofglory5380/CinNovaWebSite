import SEO from "../components/SEO.jsx";
import { getRevenueDashboardModel } from "../data/commerce/platform/revenueDashboard.js";
import { MONETIZATION_FLAGS } from "../data/monetizationFlags.js";
import { getMonetizationString } from "../data/monetizationI18n.js";

/**
 * Admin-only revenue dashboard. Never present DEMO numbers as live revenue.
 * Routed only when VITE_ENABLE_ADMIN_ROUTES=true.
 */
function RevenueDashboardAdmin({ locale = "en" }) {
    const includeDemo = MONETIZATION_FLAGS.revenueDashboardDemo;
    const model = getRevenueDashboardModel({ includeDemo });

    return (
        <main className="product-page" data-demo={model.demo ? "true" : "false"}>
            <SEO
                title="Revenue Dashboard (Admin) | Cin Nova"
                description="Internal revenue dashboard architecture. Demo data is labeled DEMO."
                noindex
            />

            <section className="section">
                <div className="section-heading">
                    <p className="eyebrow">ADMIN</p>
                    <h1>Revenue dashboard</h1>
                    <p role="status">
                        Data label: <strong>{model.label}</strong>
                        {model.demo ? ` (${getMonetizationString("demoLabel", locale)})` : ""}
                    </p>
                    <p>{model.note}</p>
                </div>

                <dl style={{ maxWidth: "640px", margin: "0 auto", display: "grid", gap: "12px" }}>
                    <div><dt>Product revenue</dt><dd>{model.productRevenue}</dd></div>
                    <div><dt>Affiliate clicks</dt><dd>{model.affiliateClicks}</dd></div>
                    <div><dt>Affiliate revenue</dt><dd>{model.affiliateRevenue}</dd></div>
                    <div><dt>Newsletter growth</dt><dd>{model.newsletterGrowth ?? "—"}</dd></div>
                    <div><dt>Sponsorship revenue</dt><dd>{model.sponsorshipRevenue}</dd></div>
                    <div><dt>Ad revenue</dt><dd>{model.adRevenue}</dd></div>
                    <div><dt>Conversion rate</dt><dd>{model.conversionRate ?? "—"}</dd></div>
                    <div><dt>App downloads</dt><dd>{model.appDownloads ?? "—"}</dd></div>
                    <div><dt>Book clicks</dt><dd>{model.bookClicks ?? "—"}</dd></div>
                    <div><dt>Book sales</dt><dd>{model.bookSales ?? "—"}</dd></div>
                </dl>
            </section>
        </main>
    );
}

export default RevenueDashboardAdmin;
