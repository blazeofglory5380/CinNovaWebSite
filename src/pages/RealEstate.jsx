import "../App.css";
// Shared dark ecosystem tokens + the below-hero dark theme. Both load after
// App.css so they win over the light defaults. Hero CSS is untouched.
import "../styles/brand-dna.css";
import "./ProductDark.css";
import NewsletterSignup from "../components/NewsletterSignup.jsx";
import ProductHero3D from "../components/ProductHero3D.jsx";
import RealEstateCityHero from "../components/RealEstateCityHero.jsx";
import RealEstateResourceCta from "../components/RealEstateResourceCta.jsx";
import RealEstateDemo from "../components/RealEstateDemo.jsx";
import FeaturePhotoCard from "../components/FeaturePhotoCard.jsx";
import { productMarketing } from "../data/marketingImages.js";
import { productHero3DConfigs } from "../data/productHero3D.js";
import { saveSubscriber } from "../data/newsletterService.js";
import SEO from "../components/SEO.jsx";
import { siteUrl } from "../data/blogPosts.js";
import { getProductUrl } from "../data/products.js";
import { MotionHeroWrap } from "../motion/MotionHeroWrap.jsx";
import { MotionCardWrap } from "../motion/MotionCardWrap.jsx";
import { MotionSectionWrap } from "../motion/MotionSectionWrap.jsx";
import { MotionAiPanelWrap } from "../motion/MotionAiPanelWrap.jsx";
import { trackLiveBetaClick, trackEvent } from "../utils/analytics.js";

const { features } = productMarketing["real-estate"];
const realEstateHero = productHero3DConfigs["real-estate"];

const LIVE_BETA_URL = "https://cin-nova.vercel.app/getting-started";
// "Try the Live Beta" opens the Real Estate AI app dashboard. Environment-aware so
// local testing hits the local app while production points at the deployed app —
// never hardcode localhost for production.
const realEstateAppUrl = import.meta.env.DEV
    ? "http://localhost:5173/main-dashboard"
    : "https://cin-nova.vercel.app/main-dashboard";
const betaClick = (label, destinationUrl = LIVE_BETA_URL) => () =>
    trackLiveBetaClick({ sourcePage: "real-estate", ctaLabel: label, destinationUrl });

const realestateSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Cin Nova Real Estate",
    applicationCategory: "FinanceApplication",
    description: "AI-powered real estate investment tools for deal analysis, cash flow modeling, mortgage calculators, and market intelligence. Live beta available in the browser.",
    operatingSystem: "Web",
    url: getProductUrl("real-estate"),
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
};

/* What the live beta can do today — mirrors the app's Getting Started guide. */
const BETA_CAPABILITIES = [
    { title: "Score properties", note: "Run any address through the Score Engine for cap rate, cash flow, and a 100-point investment score." },
    { title: "Explore the interactive map", note: "A real map with clustered, score-colored property markers across key US metros." },
    { title: "Ask the AI Advisor", note: "Plain-English questions about your saved properties — best cash flow, risk, next steps." },
    { title: "Generate investor reports", note: "Turn any saved analysis into a polished report with strengths, risks, and recommendations." },
    { title: "Track deals and portfolio", note: "Kanban deal pipeline plus portfolio KPIs, tables, and filters." },
    { title: "View saved reports", note: "Every scored property collected in a filterable Reports Library." },
];

/* Related reading — existing published posts only (safe internal links). */
const BETA_RELATED_POSTS = [
    { slug: "analyze-rental-property-in-10-minutes", label: "How to analyze a rental property in 10 minutes" },
    { slug: "beginner-guide-to-real-estate-deal-analysis", label: "Beginner guide to real estate deal analysis" },
    { slug: "the-future-of-real-estate-ai", label: "The future of real estate AI" },
];

function RealEstate() {
    return (
        <div className="product-page realestate-landing brand-dna">
            <SEO
                title="Cin Nova Real Estate | AI Investment Tools — Live Beta"
                description="Score properties, explore a real interactive map, ask an AI advisor, and generate investor reports. The Cin Nova Real Estate beta is live — try it free in your browser."
                url={getProductUrl("real-estate")}
                type="website"
                schema={realestateSchema}
            />

            {/* Main Real Estate hero — approved full-bleed city hero
                (RealEstateCityHero). ProductHero3D and productHero3DConfigs
                ["real-estate"] (realEstateHero) are intentionally retained for
                rollback — nothing is deleted; the 3D model assets stay in the repo. */}
            <MotionHeroWrap>
                <RealEstateCityHero
                    primaryHref={realEstateAppUrl}
                    primaryLabel="Try the Live Beta"
                    onPrimaryClick={betaClick("Hero — Try the Live Beta", realEstateAppUrl)}
                    secondaryHref="#features"
                    secondaryLabel="Explore Features"
                />
            </MotionHeroWrap>

            {/* ── Interactive "Analyze a Property" demo (marketing simulation,
                no backend/API). Sits directly below the hero, inside the dark
                product-page theme. ── */}
            <RealEstateDemo />

            {/* ── Live beta section: what you can do today ── */}
            <section className="section" id="live-beta">
                <div className="section-heading">
                    <p className="eyebrow">LIVE BETA</p>
                    <h2>The Cin Nova Real Estate beta is live — here's what you can do today</h2>
                    <p>
                        No account, no install. The beta runs free in your browser and saves
                        your analyses locally on your device.
                    </p>
                </div>

                <div className="showcase-grid">
                    {BETA_CAPABILITIES.slice(0, 3).map((cap) => (
                        <MotionCardWrap as="div" className="showcase-card" key={cap.title}>
                            <h3>{cap.title}</h3>
                            <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.6 }}>{cap.note}</p>
                        </MotionCardWrap>
                    ))}
                </div>
                <div className="showcase-grid" style={{ marginTop: "24px" }}>
                    {BETA_CAPABILITIES.slice(3).map((cap) => (
                        <MotionCardWrap as="div" className="showcase-card" key={cap.title}>
                            <h3>{cap.title}</h3>
                            <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.6 }}>{cap.note}</p>
                        </MotionCardWrap>
                    ))}
                </div>

                <div className="preview-note" style={{ marginTop: "28px" }}>
                    <p>Beta scope</p>
                    <h4>Some features are demo/local and coming later</h4>
                    <span>
                        The beta uses local, demo-grade data on your device. Accounts, a backend
                        database, PDF export and report sharing, a live external AI API, and
                        Stripe payments are planned upgrades — not in the beta yet.
                    </span>
                </div>

                <div style={{ marginTop: "24px", display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                    <a
                        className="primary-btn"
                        href={realEstateAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={betaClick("Beta section — Try the Live Beta", realEstateAppUrl)}
                    >
                        Try the Live Beta →
                    </a>
                    <a
                        href="/?page=free-rental-property-calculator"
                        onClick={() => trackEvent("free_calculator_cta_click", { source_page: "real-estate", destination_page: "free-rental-property-calculator" })}
                    >
                        Or try the free Rental Property Calculator →
                    </a>
                </div>

                <div className="preview-note" style={{ marginTop: "28px" }}>
                    <p>From the blog</p>
                    <h4>Learn the playbook before you score your first deal</h4>
                    <span>
                        {BETA_RELATED_POSTS.map((post, i) => (
                            <span key={post.slug}>
                                <a href={`/blog/${post.slug}`}>{post.label}</a>
                                {i < BETA_RELATED_POSTS.length - 1 ? " · " : ""}
                            </span>
                        ))}
                    </span>
                </div>
            </section>

            <section className="section" id="features">
                <div className="section-heading">
                    <p className="eyebrow">FEATURES</p>
                    <h2>Every tool serious real estate investors need in one place</h2>
                    <p>
                        From your first property search to full commercial development
                        underwriting — Cin Nova RE covers the entire investment lifecycle.
                    </p>
                </div>

                <div className="product-grid product-grid-photo re-feature-grid">
                    {features.map((feature) => (
                        <FeaturePhotoCard key={feature.title} image={feature.src} alt={feature.alt} {...feature} />
                    ))}
                </div>
            </section>

            <RealEstateResourceCta />

            <section className="section showcase-section" id="tools">
                <div className="section-heading">
                    <p className="eyebrow">DEAL ANALYZER &amp; FINANCING</p>
                    <h2>Underwrite any deal and model your financing in seconds</h2>
                </div>

                <div className="showcase-grid">
                    <MotionCardWrap as="div" className="showcase-card">
                        <h3>Deal Analyzer</h3>
                        <div className="chat-user">
                            Analyze 742 Birchwood Ave — asking $385,000, estimated rehab $45,000, ARV $510,000.
                        </div>
                        <MotionAiPanelWrap className="chat-ai">
                            <strong>Projected Profit: $47,200</strong> after all costs.
                            All-in cost: $462,800 vs ARV $510,000. Spread is solid at 9.3%.
                            Recommend targeting $365K offer to hit 12% margin.
                        </MotionAiPanelWrap>
                    </MotionCardWrap>

                    <MotionCardWrap as="div" className="showcase-card">
                        <h3>Mortgage Calculator</h3>
                        <div className="flashcard-preview">
                            <p style={{ color: "#1d4ed8", fontWeight: 900, fontSize: "0.8rem", letterSpacing: "1px", marginBottom: "10px" }}>
                                30-YEAR FIXED @ 7.1%
                            </p>
                            <strong style={{ fontSize: "1.8rem", display: "block", marginBottom: "4px" }}>$2,574/mo</strong>
                            <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "10px" }}>
                                Loan: $308,000 &nbsp;|&nbsp; Down: 20% ($77K)
                                <br />Principal + Interest: $2,068 &nbsp;|&nbsp; Taxes + Insurance: $506
                            </p>
                        </div>
                        <div className="flashcard-preview" style={{ marginTop: "12px" }}>
                            <p style={{ color: "#7c3aed", fontWeight: 900, fontSize: "0.8rem", letterSpacing: "1px", marginBottom: "6px" }}>
                                15-YEAR FIXED @ 6.6%
                            </p>
                            <strong style={{ fontSize: "1.4rem", display: "block" }}>$3,218/mo</strong>
                            <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "6px" }}>
                                Save $187,400 in interest over life of loan
                            </p>
                        </div>
                    </MotionCardWrap>
                </div>
            </section>

            <section className="section" id="cashflow">
                <div className="section-heading">
                    <p className="eyebrow">CASH FLOW &amp; AI ADVISOR</p>
                    <h2>Know your numbers before you close — and get expert guidance after</h2>
                </div>

                <div className="showcase-grid">
                    <MotionCardWrap as="div" className="showcase-card">
                        <h3>Cash Flow Analyzer</h3>
                        <div className="preview-grid" style={{ marginTop: "14px" }}>
                            <div><strong>$2,100</strong><span>Gross Rent</span></div>
                            <div><strong>$420</strong><span>Expenses</span></div>
                            <div><strong>$1,680</strong><span>NOI/mo</span></div>
                            <div><strong>6.9%</strong><span>Cash-on-Cash</span></div>
                        </div>
                        <div className="preview-note" style={{ marginTop: "14px" }}>
                            <p>5-Year Projection</p>
                            <h4>Total Return: $142,800</h4>
                            <span>
                                Includes $68K cash flow + $74K equity gain at 4% annual appreciation.
                                Vacancy modeled at 6%.
                            </span>
                        </div>
                    </MotionCardWrap>

                    <MotionCardWrap as="div" className="showcase-card">
                        <h3>AI Advisor</h3>
                        <div className="chat-user">
                            Should I 1031 exchange into a multifamily or keep my SFR portfolio?
                        </div>
                        <MotionAiPanelWrap className="chat-ai">
                            A 1031 into a small multifamily (4–12 units) lets you defer capital
                            gains while scaling cash flow per dollar deployed. With your current
                            equity and a 7–8% cap rate target, a 6-unit in a Class B market
                            would outperform three additional SFRs on cash-on-cash in year one.
                        </MotionAiPanelWrap>
                        <div className="chat-user" style={{ marginTop: "10px" }}>
                            What markets should I target?
                        </div>
                        <MotionAiPanelWrap className="chat-ai">
                            Mid-sized Sunbelt metros with job growth above 2.5% YoY: Huntsville AL,
                            Greenville SC, and Boise ID show strong rent growth with cap rates
                            still above 6.5%.
                        </MotionAiPanelWrap>
                    </MotionCardWrap>
                </div>
            </section>

            <section className="section showcase-section" id="market">
                <div className="section-heading">
                    <p className="eyebrow">MARKET INTELLIGENCE</p>
                    <h2>Real-time data on every market that matters to your portfolio</h2>
                </div>

                <div className="showcase-grid">
                    <MotionCardWrap as="div" className="showcase-card">
                        <h3>Market Snapshot</h3>
                        <div className="preview-grid" style={{ marginTop: "14px" }}>
                            <div><strong>+6.2%</strong><span>YoY Rent Growth</span></div>
                            <div><strong>28 days</strong><span>Avg Days on Market</span></div>
                            <div><strong>97.4%</strong><span>Occupancy Rate</span></div>
                            <div><strong>1.3mo</strong><span>Supply / Inventory</span></div>
                        </div>
                        <div className="preview-note" style={{ marginTop: "14px" }}>
                            <p>AI Market Signal</p>
                            <h4>Huntsville, AL — Strong Demand</h4>
                            <span>
                                Job growth 3.1% YoY, population up 2.4%. Median home price
                                $342K with cap rates averaging 6.8%. Favorable entry window.
                            </span>
                        </div>
                    </MotionCardWrap>

                    <MotionCardWrap as="div" className="showcase-card">
                        <h3>Neighborhood Scoring</h3>
                        <div className="chat-user">
                            Score the investment potential of 32607 zip code.
                        </div>
                        <MotionAiPanelWrap className="chat-ai">
                            <strong>Overall Score: 78/100</strong>
                            <br /><br />
                            Rent growth: 82 &nbsp;|&nbsp; Job market: 74 &nbsp;|&nbsp;
                            School district: 88 &nbsp;|&nbsp; Crime trend: 71 &nbsp;|&nbsp;
                            Infrastructure: 69
                            <br /><br />
                            Strong for long-term hold. Watch infrastructure score — road
                            expansion planned for Q3 2026 which may push values 5–8%.
                        </MotionAiPanelWrap>
                    </MotionCardWrap>
                </div>
            </section>

            <section className="section" id="advanced">
                <div className="section-heading">
                    <p className="eyebrow">ADVANCED TOOLS</p>
                    <h2>From architecture to commercial deals to raw land — full coverage</h2>
                </div>

                <div className="showcase-grid">
                    <MotionCardWrap as="div" className="showcase-card">
                        <h3>Architecture &amp; BIM Intelligence</h3>
                        <div className="chat-user">
                            Estimate construction cost for a 4,200 sq ft duplex in Nashville, TN.
                        </div>
                        <MotionAiPanelWrap className="chat-ai">
                            <strong>Estimated Build Cost: $714,000 – $882,000</strong>
                            <br /><br />
                            $170–$210/sq ft for standard residential construction in Nashville
                            metro. Includes foundation, framing, MEP, finishes, and permits.
                            BIM integration can reduce waste cost by 8–12%. Timeline: 10–14 months.
                        </MotionAiPanelWrap>
                    </MotionCardWrap>

                    <MotionCardWrap as="div" className="showcase-card">
                        <h3>Commercial RE Analysis</h3>
                        <div className="preview-grid" style={{ marginTop: "14px" }}>
                            <div><strong>$4.8M</strong><span>Asset Value</span></div>
                            <div><strong>7.1%</strong><span>Cap Rate</span></div>
                            <div><strong>1.34x</strong><span>DSCR</span></div>
                            <div><strong>94%</strong><span>Occupancy</span></div>
                        </div>
                        <div className="preview-note" style={{ marginTop: "14px" }}>
                            <p>12-Unit Multifamily — Memphis, TN</p>
                            <h4>NOI: $340,800/yr — Qualify for Bridge Loan</h4>
                            <span>
                                Tenant mix: 8 long-term, 4 month-to-month. Recommend
                                converting 4 units to stabilize DSCR above 1.40x before refi.
                            </span>
                        </div>
                    </MotionCardWrap>
                </div>

                <div className="showcase-grid" style={{ marginTop: "24px" }}>
                    <MotionCardWrap as="div" className="showcase-card">
                        <h3>Land Development Tools</h3>
                        <div className="chat-user">
                            I have 14 acres in a suburban county zoned R-2. What's the highest and best use?
                        </div>
                        <MotionAiPanelWrap className="chat-ai">
                            <strong>Recommended: 22-lot single-family subdivision</strong>
                            <br /><br />
                            R-2 allows 1.5 units/acre minimum lot size. At 14 acres with
                            ~15% roads/green space, you can yield 18–22 buildable lots.
                            At $85K/lot wholesale or $310K finished lot, projected gross
                            margin: $2.1M–$3.8M. Entitlement timeline: 14–22 months.
                        </MotionAiPanelWrap>
                    </MotionCardWrap>

                    <MotionCardWrap as="div" className="showcase-card">
                        <h3>Property Search</h3>
                        <div className="chat-user">
                            Find multifamily properties under $1M in Chattanooga with cap rate above 6%.
                        </div>
                        <MotionAiPanelWrap className="chat-ai">
                            Found <strong>14 matches</strong>. Top result: 8-unit on Brainerd Rd,
                            asking $795,000 — cap rate 7.2%, gross rent $7,400/mo, 96% occupancy.
                            Off-market duplex on MLK Blvd at $410K also flagged — estimated cap 6.8%
                            based on neighborhood comps. Would you like a full deal report?
                        </MotionAiPanelWrap>
                    </MotionCardWrap>
                </div>
            </section>

            <section className="section pricing-section" id="pricing">
                <div className="section-heading">
                    <p className="eyebrow">PRICING</p>
                    <h2>Plans built for every stage of your real estate journey</h2>
                    <p>Start free and scale as your portfolio grows.</p>
                </div>

                <div className="pricing-grid">
                    <MotionCardWrap as="div" className="pricing-card">
                        <p className="product-category">STARTER</p>
                        <h3>Free</h3>
                        <div className="price">$0</div>
                        <p>
                            Property search, basic mortgage calculator, and 10 AI advisor
                            queries per month. Perfect for first-time buyers exploring options.
                        </p>
                    </MotionCardWrap>

                    <MotionCardWrap as="div" className="pricing-card featured">
                        <p className="product-category">INVESTOR PRO</p>
                        <h3>Pro</h3>
                        <div className="price">$29/mo</div>
                        <p>
                            Unlimited deal analyzer, full cash flow modeling, mortgage
                            comparison, market intelligence dashboards, and unlimited
                            AI advisor access. Built for active investors.
                        </p>
                    </MotionCardWrap>

                    <MotionCardWrap as="div" className="pricing-card">
                        <p className="product-category">DEVELOPER</p>
                        <h3>Enterprise</h3>
                        <div className="price">$99/mo</div>
                        <p>
                            Everything in Pro plus Architecture &amp; BIM intelligence,
                            commercial RE analysis, land development tools, team
                            collaboration, and priority support. Built for developers.
                        </p>
                    </MotionCardWrap>
                </div>
            </section>

            <section className="section" id="waitlist">
                <MotionSectionWrap className="newsletter-card">
                    <p className="eyebrow">STAY IN THE LOOP</p>
                    <h2>The beta is live — get updates as new features ship.</h2>
                    <p style={{ color: "#64748b", marginBottom: "16px" }}>
                        Accounts, PDF reports, live data, and paid plans are on the roadmap.
                        Join the list and we'll tell you the moment they land — or{" "}
                        <a href={LIVE_BETA_URL} target="_blank" rel="noopener noreferrer" onClick={betaClick("Waitlist — jump into the live beta")}>
                            jump into the live beta now
                        </a>.
                    </p>
                    <NewsletterSignup
                        onSubscribe={saveSubscriber}
                        source="Real Estate Waitlist"
                        tags={["Real Estate", "Waitlist"]}
                        buttonLabel="Get Beta Updates"
                    />
                </MotionSectionWrap>
            </section>

        </div>
    );
}

export default RealEstate;
