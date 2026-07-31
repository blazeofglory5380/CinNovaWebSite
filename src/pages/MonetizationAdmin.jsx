import {
    getAllCommerceEntities,
    getActiveCommercialDestinations,
    getMonetizationChannelSummary,
} from "../data/commerceCatalog.js";
import { subscriptionPlans, isSubscriptionPlanPurchasable } from "../data/subscriptionPlans.js";
import { advertisingConfig } from "../data/advertisingPlacements.js";
import {
    REVENUE_MODELS,
    FUNNEL_STAGES,
    ACTIVE_FUNNEL_STAGES,
    FUTURE_FUNNEL_STAGES,
} from "../data/commerceModels.js";
import { RESERVED_COMMERCE_EVENTS } from "../utils/analytics.js";
import "./MonetizationAdmin.css";

/**
 * Internal monetization foundation view (admin-gated).
 * Does not display invented revenue. Live GA metrics are labeled unavailable.
 */
function MonetizationAdmin() {
    const summary = getMonetizationChannelSummary();
    const entities = getAllCommerceEntities();
    const active = getActiveCommercialDestinations();

    return (
        <main className="monetization-admin">
            <header className="monetization-admin__header">
                <p className="monetization-admin__eyebrow">Internal · Phase 11.1</p>
                <h1>Monetization Foundation</h1>
                <p>
                    Configuration and event definitions only. Live GA4 revenue metrics are{" "}
                    <strong>not connected</strong> in this view — zeros are not shown as measured results.
                </p>
            </header>

            <section className="monetization-admin__section" aria-labelledby="ma-summary">
                <h2 id="ma-summary">Channel summary</h2>
                <ul className="monetization-admin__grid">
                    <li>
                        <span>Configured entities</span>
                        <strong>{summary.totalEntities}</strong>
                    </li>
                    <li>
                        <span>Active purchase paths</span>
                        <strong>{summary.activePurchasePaths}</strong>
                    </li>
                    <li>
                        <span>Lead-eligible</span>
                        <strong>{summary.leadEligible}</strong>
                    </li>
                    <li>
                        <span>Affiliate-enabled now</span>
                        <strong>{summary.affiliateEnabledNow}</strong>
                    </li>
                    <li>
                        <span>Ad network</span>
                        <strong>{advertisingConfig.networkStatus}</strong>
                    </li>
                    <li>
                        <span>GA4 live metrics</span>
                        <strong>Unavailable / not connected</strong>
                    </li>
                </ul>
            </section>

            <section className="monetization-admin__section" aria-labelledby="ma-active">
                <h2 id="ma-active">Active commercial destinations</h2>
                {active.length === 0 ? (
                    <p>None configured.</p>
                ) : (
                    <table className="monetization-admin__table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Retailer</th>
                                <th>Host</th>
                                <th>Affiliate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {active.map((row) => (
                                <tr key={row.entityId}>
                                    <td>{row.title}</td>
                                    <td>{row.retailer || "—"}</td>
                                    <td>{row.destinationHost || "—"}</td>
                                    <td>{row.affiliateEnabled ? "Yes" : "No"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>

            <section className="monetization-admin__section" aria-labelledby="ma-entities">
                <h2 id="ma-entities">Entity availability</h2>
                <table className="monetization-admin__table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Type</th>
                            <th>Availability</th>
                            <th>Revenue now</th>
                            <th>Future models</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entities.map((entity) => (
                            <tr key={entity.entityId}>
                                <td>{entity.title}</td>
                                <td>{entity.entityType}</td>
                                <td>{entity.availability}</td>
                                <td>{entity.revenueModels.join(", ")}</td>
                                <td>{entity.futureRevenueModels.join(", ") || "—"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section className="monetization-admin__section" aria-labelledby="ma-events">
                <h2 id="ma-events">Analytics event definitions</h2>
                <p>Active commerce events: commerce_item_view, commerce_cta_click, commerce_outbound_click, commerce_lead_start, commerce_lead_complete. Preserved: book_external_purchase_click (outbound, not purchase).</p>
                <p>
                    Reserved (must not fire yet): {Object.values(RESERVED_COMMERCE_EVENTS).join(", ")}.
                </p>
                <p>
                    Funnel active: {ACTIVE_FUNNEL_STAGES.join(" → ")}. Future: {FUTURE_FUNNEL_STAGES.join(" → ")}.
                    Current stage enum includes {Object.keys(FUNNEL_STAGES).length} stages; revenue models:{" "}
                    {Object.keys(REVENUE_MODELS).length}.
                </p>
            </section>

            <section className="monetization-admin__section" aria-labelledby="ma-plans">
                <h2 id="ma-plans">Subscription plans (architecture only)</h2>
                <table className="monetization-admin__table">
                    <thead>
                        <tr>
                            <th>Plan</th>
                            <th>Status</th>
                            <th>Price</th>
                            <th>Purchasable</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subscriptionPlans.map((plan) => (
                            <tr key={plan.planId}>
                                <td>{plan.title}</td>
                                <td>{plan.status}</td>
                                <td>{plan.price == null ? "null (TBD)" : plan.price}</td>
                                <td>{isSubscriptionPlanPurchasable(plan) ? "Yes" : "No"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </main>
    );
}

export default MonetizationAdmin;
