import { useMemo } from "react";
import "../App.css";
import SEO from "../components/SEO.jsx";
import { siteUrl } from "../data/seoConfig.js";
import {
    getAffiliateProgramStatus,
    listPartners,
    validatePartnerRegistry,
    resolvePartnerLink,
    PARTNER_TYPE_LIST,
} from "../data/affiliate/index.js";

/**
 * Internal partner / affiliate configuration viewer.
 * Gated by VITE_ENABLE_ADMIN_ROUTES — not authentication.
 * Does not activate partners; read-only status of registry + env gates.
 */
function PartnerAdmin() {
    const program = getAffiliateProgramStatus();
    const partners = useMemo(() => listPartners(), []);
    const registryCheck = useMemo(() => validatePartnerRegistry(partners), [partners]);

    const rows = useMemo(
        () =>
            partners.map((partner) => {
                const resolved = resolvePartnerLink(partner.id);
                return {
                    partner,
                    resolved,
                    hasEnvUrl: Boolean(
                        partner.urlEnvKey && import.meta.env?.[partner.urlEnvKey]?.trim?.(),
                    ),
                };
            }),
        [partners],
    );

    return (
        <main className="product-page newsletter-admin-page partner-admin-page">
            <SEO
                title="Partner Admin | CinNova Internal"
                description="Internal affiliate and partner registry status. Not for public use."
                url={`${siteUrl}/partner-admin`}
                noindex
            />

            <section className="section">
                <p className="eyebrow">INTERNAL · PHASE 11.4A</p>
                <h1>Affiliate & partner management</h1>
                <p>
                    Central registry status for future monetization. No ads, checkout, or payment
                    processing. Live affiliate destinations stay off until the global flag and each
                    partner are explicitly enabled with validated env URLs.
                </p>
            </section>

            <section className="section newsletter-admin-grid">
                <article className="newsletter-card newsletter-admin-summary-card">
                    <h2>Global program</h2>
                    <ul>
                        <li>
                            Master switch (<code>{program.envFlag}</code>):{" "}
                            <strong>{program.activationState}</strong>
                        </li>
                        <li>
                            Globally enabled: <strong>{String(program.globallyEnabled)}</strong>
                        </li>
                        <li>
                            Supported types: {PARTNER_TYPE_LIST.join(", ")}
                        </li>
                        <li>
                            Registry validation:{" "}
                            <strong>{registryCheck.ok ? "pass" : "fail"}</strong>
                        </li>
                    </ul>
                    {!program.globallyEnabled && (
                        <p>
                            Production default is off. Set <code>VITE_AFFILIATES_ENABLED=true</code>{" "}
                            in a non-production env only after partner terms and disclosures are
                            ready. See <code>docs/AFFILIATE_MANAGEMENT.md</code>.
                        </p>
                    )}
                </article>

                <article className="newsletter-card">
                    <h2>Activation checklist</h2>
                    <ol>
                        <li>Add or update the partner in the registry (no production IDs in git).</li>
                        <li>Store destination in the partner&apos;s <code>urlEnvKey</code> env var.</li>
                        <li>Set <code>enabled: true</code> on that partner record.</li>
                        <li>Set <code>VITE_AFFILIATES_ENABLED=true</code> for the target deploy.</li>
                        <li>Confirm FTC disclosure renders on commercial types.</li>
                        <li>Confirm <code>affiliate_outbound_click</code> fires in GA4 DebugView.</li>
                    </ol>
                </article>
            </section>

            <section className="section">
                <h2>Partner registry</h2>
                <div className="subscriber-table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Enabled</th>
                                <th>Env URL</th>
                                <th>Renderable</th>
                                <th>Disclosure</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(({ partner, resolved, hasEnvUrl }) => (
                                <tr key={partner.id}>
                                    <td>
                                        <code>{partner.id}</code>
                                    </td>
                                    <td>{partner.name}</td>
                                    <td>{partner.type}</td>
                                    <td>{String(partner.enabled)}</td>
                                    <td>{hasEnvUrl ? "set" : "unset"}</td>
                                    <td>{String(resolved.renderable)}</td>
                                    <td>{String(resolved.disclosureRequired)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}

export default PartnerAdmin;
