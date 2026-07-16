import "./RealEstateResourceCta.css";

/*
 * RealEstateResourceCta — below-hero conversion section for the Real Estate AI
 * page. Frames investor vs. broker use cases and surfaces the two existing Real
 * Estate templates. The templates are gated content pages (no physical download
 * file exists), so cards link to the resource detail routes (/resources/<slug>)
 * and the section CTA links to the Resources hub — no broken download links.
 *
 * Fully self-contained; scoped `re-conv-` classes (see RealEstateResourceCta.css).
 */

const TEMPLATES = [
    {
        tag: "Free Worksheet",
        title: "Real Estate Deal Analysis Template",
        description:
            "A beginner-friendly framework for reviewing rent, expenses, financing, cash flow, and risk before you commit to a deeper analysis.",
        href: "/resources/real-estate-deal-analysis-template",
        linkLabel: "View the template",
    },
    {
        tag: "Free Template",
        title: "Real Estate Cash Flow Analysis Template",
        description:
            "A ready-to-use worksheet for running income, expense, financing, and return calculations on any residential investment property.",
        href: "/resources/real-estate-cash-flow-analysis-template",
        linkLabel: "View the template",
    },
];

function RealEstateResourceCta() {
    return (
        <section className="section re-conv" id="templates">
            <div className="re-conv-inner">
                <div className="section-heading">
                    <p className="eyebrow">FOR INVESTORS &amp; BROKERS</p>
                    <h2>Evaluate deals faster — and show up ready for every client</h2>
                    <p>
                        Score deals, model cash flow, and read market signals in minutes instead
                        of hours. Start with our free templates, then let Cin Nova Real Estate AI
                        do the heavy lifting.
                    </p>
                </div>

                <div className="re-conv-uses">
                    <div className="re-conv-use">
                        <span className="re-conv-use__role">For Investors</span>
                        <h3>Underwrite rentals and flips with confidence</h3>
                        <ul>
                            <li>Analyze rental deals with instant cash-flow and cash-on-cash math.</li>
                            <li>Compare markets and neighborhoods with AI-scored signals.</li>
                            <li>Estimate returns and risk before you make an offer.</li>
                        </ul>
                    </div>

                    <div className="re-conv-use">
                        <span className="re-conv-use__role">For Agents &amp; Brokers</span>
                        <h3>Advise clients with sharper market insight</h3>
                        <ul>
                            <li>Back up recommendations with real-time market and rent data.</li>
                            <li>Show sellers and buyers deal-readiness at a glance.</li>
                            <li>Win listings by bringing data-driven guidance to every meeting.</li>
                        </ul>
                    </div>
                </div>

                <div className="re-conv-templates">
                    {TEMPLATES.map((tpl) => (
                        <div className="re-conv-card" key={tpl.title}>
                            <span className="re-conv-card__tag">{tpl.tag}</span>
                            <h3>{tpl.title}</h3>
                            <p>{tpl.description}</p>
                            <a className="re-conv-card__link" href={tpl.href}>
                                {tpl.linkLabel}
                            </a>
                        </div>
                    ))}
                </div>

                <div className="re-conv-actions">
                    <a className="re-conv-btn re-conv-btn--primary" href="/resources">
                        Browse all templates
                    </a>
                    <a className="re-conv-btn re-conv-btn--ghost" href="#waitlist">
                        Join the Real Estate AI waitlist
                    </a>
                </div>
            </div>
        </section>
    );
}

export default RealEstateResourceCta;
