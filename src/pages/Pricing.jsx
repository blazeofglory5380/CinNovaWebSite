import "../App.css";
import NewsletterSignup from "../components/NewsletterSignup.jsx";
import { saveSubscriber } from "../data/newsletterService.js";

const products = [
    {
        icon: "🎓",
        name: "StudyNest",
        category: "Education AI",
        description: "AI-powered studying for students of all levels.",
        tiers: [
            {
                label: "Free",
                price: "$0",
                highlight: false,
                perks: "Basic notes, flashcards, and starter quizzes. Up to 10 AI tutor queries per month.",
            },
            {
                label: "Student Pro",
                price: "$9.99/mo",
                highlight: true,
                perks: "Unlimited notes, flashcards, quizzes, study guides, and full AI Tutor access.",
            },
            {
                label: "School Plan",
                price: "Coming Soon",
                highlight: false,
                perks: "Teacher tools, classroom dashboards, student progress tracking, and group plans.",
            },
        ],
    },
    {
        icon: "🛡️",
        name: "PoisonGuard",
        category: "Safety Technology",
        description: "Poison and chemical safety for families and pets.",
        tiers: [
            {
                label: "Free",
                price: "$0",
                highlight: false,
                perks: "Basic substance lookup, emergency contact directory, and 10 AI safety queries.",
            },
            {
                label: "Family Premium",
                price: "$4.99/mo",
                highlight: true,
                perks: "Full AI guidance, complete pet safety database, unlimited lookups, and priority alerts.",
            },
            {
                label: "Professional",
                price: "Coming Soon",
                highlight: false,
                perks: "Workplace chemical safety, MSDS integration, team management, and compliance tools.",
            },
        ],
    },
    {
        icon: "💻",
        name: "TechMate AI",
        category: "Tech Support AI",
        description: "AI-powered device and software troubleshooting.",
        tiers: [
            {
                label: "Free",
                price: "$0",
                highlight: false,
                perks: "AI chat assistant, error code lookup, basic guides, and 20 support sessions per month.",
            },
            {
                label: "TechMate Pro",
                price: "$14.99/mo",
                highlight: true,
                perks: "Unlimited AI chat, network diagnostics, full repair guides, and software support.",
            },
            {
                label: "Team / IT Desk",
                price: "Coming Soon",
                highlight: false,
                perks: "Ticket triage, auto-documentation, multi-user support, and IT dashboard for teams.",
            },
        ],
    },
    {
        icon: "🧸",
        name: "Kiddo",
        category: "Early Learning",
        description: "Interactive learning for children ages 3–8.",
        tiers: [
            {
                label: "Free",
                price: "$0",
                highlight: false,
                perks: "ABCs, basic counting, 5 interactive stories, and memory games. One child profile.",
            },
            {
                label: "Family Plan",
                price: "$6.99/mo",
                highlight: true,
                perks: "All 12 modules, unlimited stories, parent dashboard, progress tracking, and 3 profiles.",
            },
            {
                label: "School Plan",
                price: "Coming Soon",
                highlight: false,
                perks: "Classroom tools, teacher dashboards, student tracking, and curriculum alignment for Pre-K–Grade 2.",
            },
        ],
    },
    {
        icon: "🏡",
        name: "Cin Nova Real Estate",
        category: "Real Estate AI",
        description: "AI investment tools for investors and developers.",
        tiers: [
            {
                label: "Free",
                price: "$0",
                highlight: false,
                perks: "Property search, basic mortgage calculator, and 10 AI advisor queries per month.",
            },
            {
                label: "Investor Pro",
                price: "$29/mo",
                highlight: true,
                perks: "Unlimited deal analysis, cash flow modeling, market intelligence, and full AI advisor.",
            },
            {
                label: "Business / Broker",
                price: "$199/mo",
                highlight: false,
                perks: "BIM intelligence, commercial underwriting, land development tools, and team collaboration.",
            },
        ],
    },
];

const comparisons = [
    {
        icon: "🎓",
        audience: "Best for Students",
        product: "StudyNest",
        why: "AI tutoring, flashcards, and study guides that adapt to how you learn — available 24/7.",
        plan: "Student Pro — $9.99/mo",
    },
    {
        icon: "👨‍👩‍👧",
        audience: "Best for Families",
        product: "PoisonGuard + Kiddo",
        why: "Keep children safe from household hazards and give them a head start with guided early learning.",
        plan: "Family Premium + Family Plan — $11.98/mo",
    },
    {
        icon: "🔧",
        audience: "Best for Technicians",
        product: "TechMate AI",
        why: "AI-powered troubleshooting, error lookup, and repair guides that save hours on every job.",
        plan: "TechMate Pro — $14.99/mo",
    },
    {
        icon: "💼",
        audience: "Best for Investors",
        product: "Cin Nova Real Estate",
        why: "Deal analysis, cash flow modeling, and market intelligence that makes every decision data-driven.",
        plan: "Investor Pro — $29/mo",
    },
    {
        icon: "🏫",
        audience: "Best for Schools & Teams",
        product: "StudyNest + Kiddo",
        why: "Classroom tools, student progress dashboards, and curriculum-aligned learning from K–12.",
        plan: "School Plans — Coming Soon",
    },
];

function Pricing() {
    return (
        <div className="product-page">

            {/* ── Hero ───────────────────────────────────────────── */}
            <section className="section" style={{ paddingBottom: "40px" }}>
                <div className="section-heading" style={{ marginBottom: "0" }}>
                    <p className="eyebrow">PRICING</p>
                    <h2>Flexible plans for every Cin Nova product</h2>
                    <p>
                        Choose the tools that fit your learning, safety, technology,
                        and real estate goals. Start free on any product — upgrade
                        when you're ready.
                    </p>
                    <div className="hero-actions" style={{ justifyContent: "center", marginTop: "28px" }}>
                        <a href="#all-plans" className="primary-btn">See All Plans</a>
                        <a href="#comparison" className="secondary-btn">Compare Products</a>
                    </div>
                </div>
            </section>

            {/* ── Hero Stats ─────────────────────────────────────── */}
            <section className="section" style={{ paddingTop: "0", paddingBottom: "60px" }}>
                <div className="hero-stats" style={{ maxWidth: "680px", margin: "0 auto" }}>
                    <div><strong>5</strong><span>Products</span></div>
                    <div><strong>Free</strong><span>Entry on All</span></div>
                    <div><strong>No Lock-in</strong><span>Cancel Anytime</span></div>
                </div>
            </section>

            {/* ── All Pricing Tiers ───────────────────────────────── */}
            <section className="section showcase-section" id="all-plans" style={{ paddingBottom: "40px" }}>
                <div className="section-heading">
                    <p className="eyebrow">ALL PLANS</p>
                    <h2>Pick a product. Pick a plan. Get started free.</h2>
                </div>

                {products.map((product, i) => (
                    <div
                        key={product.name}
                        style={{
                            marginBottom: i < products.length - 1 ? "72px" : "0",
                        }}
                    >
                        {/* Product label row */}
                        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
                            <div className="product-icon" style={{ marginBottom: 0, flexShrink: 0 }}>
                                {product.icon}
                            </div>
                            <div>
                                <p className="eyebrow" style={{ marginBottom: "2px" }}>
                                    {product.category.toUpperCase()}
                                </p>
                                <h3 style={{ margin: 0, fontSize: "1.5rem" }}>{product.name}</h3>
                                <p style={{ color: "#64748b", fontSize: "0.88rem", marginTop: "2px" }}>
                                    {product.description}
                                </p>
                            </div>
                        </div>

                        <div className="pricing-grid">
                            {product.tiers.map((tier) => (
                                <div
                                    key={tier.label}
                                    className={`pricing-card${tier.highlight ? " featured" : ""}`}
                                >
                                    {tier.highlight && (
                                        <p className="eyebrow" style={{ marginBottom: "12px" }}>
                                            MOST POPULAR
                                        </p>
                                    )}
                                    <h3>{tier.label}</h3>
                                    <div className="price">{tier.price}</div>
                                    <p>{tier.perks}</p>
                                    <button
                                        style={{
                                            display: "block",
                                            width: "100%",
                                            marginTop: "22px",
                                            padding: "13px 20px",
                                            borderRadius: "14px",
                                            border: tier.highlight
                                                ? "none"
                                                : "1px solid rgba(255,255,255,0.12)",
                                            background: tier.highlight
                                                ? "linear-gradient(135deg, #2563eb, #7c3aed)"
                                                : "rgba(255,255,255,0.08)",
                                            color: "#ffffff",
                                            fontWeight: 900,
                                            fontSize: "0.9rem",
                                            cursor: tier.price === "Coming Soon" ? "default" : "pointer",
                                            opacity: tier.price === "Coming Soon" ? 0.5 : 1,
                                        }}
                                    >
                                        {tier.price === "Coming Soon" ? "Coming Soon" : tier.highlight ? "Get Started" : "Start Free"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </section>

            {/* ── Comparison Section ──────────────────────────────── */}
            <section className="section" id="comparison">
                <div className="section-heading">
                    <p className="eyebrow">FIND YOUR FIT</p>
                    <h2>Not sure which product is right for you?</h2>
                    <p>Here's how different Cin Nova products serve different people.</p>
                </div>

                <div className="product-grid">
                    {comparisons.map((item) => (
                        <article className="product-card" key={item.audience}>
                            <div className="product-icon">{item.icon}</div>
                            <p className="product-category">{item.audience}</p>
                            <h3>{item.product}</h3>
                            <p>{item.why}</p>
                            <div
                                style={{
                                    marginTop: "18px",
                                    padding: "10px 14px",
                                    borderRadius: "10px",
                                    background: "rgba(56, 189, 248, 0.08)",
                                    border: "1px solid rgba(56, 189, 248, 0.2)",
                                    color: "#38bdf8",
                                    fontSize: "0.82rem",
                                    fontWeight: 700,
                                }}
                            >
                                {item.plan}
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* ── FAQ Strip ───────────────────────────────────────── */}
            <section className="section showcase-section">
                <div className="section-heading">
                    <p className="eyebrow">COMMON QUESTIONS</p>
                    <h2>Everything you need to know about Cin Nova pricing</h2>
                </div>

                <div className="showcase-grid">
                    <div className="showcase-card">
                        <div className="chat-user">Can I use multiple Cin Nova products under one account?</div>
                        <div className="chat-ai">
                            Yes — your Cin Nova account gives you access to all products.
                            Each product has its own plan, so you only pay for what you use.
                            You can mix and match: for example, StudyNest Pro + Kiddo Family
                            Plan from a single login.
                        </div>
                        <div className="chat-user" style={{ marginTop: "10px" }}>
                            Do free plans expire?
                        </div>
                        <div className="chat-ai">
                            No. Free plans stay free forever. There are no trials or hidden
                            time limits. You upgrade only when you need more features or
                            higher usage limits.
                        </div>
                    </div>

                    <div className="showcase-card">
                        <div className="chat-user">Can I cancel my subscription at any time?</div>
                        <div className="chat-ai">
                            Yes — cancel anytime from your account settings with no penalties
                            or cancellation fees. Your plan stays active until the end of the
                            billing period, then reverts to the free tier.
                        </div>
                        <div className="chat-user" style={{ marginTop: "10px" }}>
                            Are there discounts for annual billing?
                        </div>
                        <div className="chat-ai">
                            Annual billing will be available at launch with a 2-month discount
                            (equivalent to paying for 10 months and getting 12). Join the
                            waitlist to be notified when annual plans go live.
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA ─────────────────────────────────────────────── */}
            <section className="section" id="waitlist">
                <div className="newsletter-card">
                    <p className="eyebrow">JOIN THE CIN NOVA WAITLIST</p>
                    <h2>Get early access to every product before public launch.</h2>
                    <NewsletterSignup
                        onSubscribe={saveSubscriber}
                        source="Pricing Waitlist"
                        tags={["Pricing", "Early Access"]}
                        buttonLabel="Get Early Access"
                    />
                </div>
            </section>

        </div>
    );
}

export default Pricing;
