import { useState } from "react";
import "../App.css";
import "./Pricing.css";
import NewsletterSignup from "../components/NewsletterSignup.jsx";
import FeaturePhotoCard from "../components/FeaturePhotoCard.jsx";
import BusinessFAQ from "../components/business/BusinessFAQ.jsx";
import { pricingAudiences, productMarketing } from "../data/marketingImages.js";
import { saveSubscriber } from "../data/newsletterService.js";
import SEO from "../components/SEO.jsx";
import { siteUrl } from "../data/blogPosts.js";

const products = [
    {
        key: "studynest",
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
        key: "poisonguard",
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
        key: "techmate",
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
        key: "kiddo",
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
        key: "real-estate",
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

// FAQ content — preserved verbatim from the previous static pricing FAQ.
const pricingFaqItems = [
    {
        question: "Can I use multiple Cin Nova products under one account?",
        answer:
            "Yes — your Cin Nova account gives you access to all products. Each product has its own plan, so you only pay for what you use. You can mix and match: for example, StudyNest Pro + Kiddo Family Plan from a single login.",
    },
    {
        question: "Do free plans expire?",
        answer:
            "No. Free plans stay free forever. There are no trials or hidden time limits. You upgrade only when you need more features or higher usage limits.",
    },
    {
        question: "Can I cancel my subscription at any time?",
        answer:
            "Yes — cancel anytime from your account settings with no penalties or cancellation fees. Your plan stays active until the end of the billing period, then reverts to the free tier.",
    },
    {
        question: "Are there discounts for annual billing?",
        answer:
            "Annual billing will be available at launch with a 2-month discount (equivalent to paying for 10 months and getting 12). Join the waitlist to be notified when annual plans go live.",
    },
];

const pricingSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Cin Nova Pricing",
    description: "Pricing plans for all Cin Nova products: StudyNest, PoisonGuard, TechMate AI, Kiddo, and Cin Nova Real Estate.",
    url: `${siteUrl}/?page=pricing`,
    publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
};

function ctaLabel(price) {
    if (price === "Coming Soon") return "Coming Soon";
    if (price === "$0") return "Start Free";
    return "Get Started";
}

function Pricing() {
    const [selectedKey, setSelectedKey] = useState(products[0].key);
    const product = products.find((p) => p.key === selectedKey) || products[0];

    return (
        <div className="product-page">
            <SEO
                title="Pricing | Cin Nova AI Products — Plans and Tiers"
                description="Compare free and paid plans for StudyNest, PoisonGuard, TechMate AI, Kiddo, and Cin Nova Real Estate. Find the right plan for students, families, investors, and teams."
                url={`${siteUrl}/?page=pricing`}
                type="website"
                schema={pricingSchema}
            />

            {/* ── Hero ───────────────────────────────────────────── */}
            <section className="section" style={{ paddingBottom: "40px" }}>
                <div className="section-heading" style={{ marginBottom: "0" }}>
                    <p className="eyebrow">PRICING</p>
                    <h1>Flexible plans for every Cin Nova product</h1>
                    <p>
                        Choose the tools that fit your learning, safety, technology,
                        and real estate goals. Start free on any product — upgrade
                        when you're ready.
                    </p>
                    <div className="hero-actions" style={{ justifyContent: "center", marginTop: "28px" }}>
                        <a href="#all-plans" className="primary-btn">See Plans</a>
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

            {/* ── Single interactive pricing module ───────────────── */}
            <section className="section showcase-section" id="all-plans" style={{ paddingBottom: "40px" }}>
                <div className="section-heading">
                    <p className="eyebrow">ALL PLANS</p>
                    <h2>Pick a product. Pick a plan. Get started free.</h2>
                </div>

                <div className="pricing-module">
                    {/* Product dropdown */}
                    <div className="pricing-picker">
                        <label className="pricing-picker-label" htmlFor="pricing-product-select">
                            Choose a product
                        </label>
                        <select
                            id="pricing-product-select"
                            className="pricing-picker-select"
                            value={selectedKey}
                            onChange={(e) => setSelectedKey(e.target.value)}
                        >
                            {products.map((p) => (
                                <option key={p.key} value={p.key}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Selected product header */}
                    <div className="pricing-module-head">
                        <p className="eyebrow">{product.category.toUpperCase()}</p>
                        <h3>{product.name}</h3>
                        <p className="pricing-module-desc">{product.description}</p>
                    </div>

                    {/* Plans for the selected product — rows inside the one card */}
                    <ul className="pricing-plan-list">
                        {product.tiers.map((tier) => {
                            const comingSoon = tier.price === "Coming Soon";
                            return (
                                <li
                                    key={tier.label}
                                    className={`pricing-plan-row${tier.highlight ? " pricing-plan-row--featured" : ""}`}
                                >
                                    <div className="pricing-plan-info">
                                        <div className="pricing-plan-name-row">
                                            <span className="pricing-plan-name">{tier.label}</span>
                                            {tier.highlight && <span className="pricing-plan-tag">Most Popular</span>}
                                        </div>
                                        <p className="pricing-plan-perks">{tier.perks}</p>
                                    </div>
                                    <div className="pricing-plan-action">
                                        <span className="pricing-plan-price">{tier.price}</span>
                                        <button
                                            type="button"
                                            className={`pricing-plan-cta${tier.highlight ? " pricing-plan-cta--primary" : ""}`}
                                            disabled={comingSoon}
                                            aria-disabled={comingSoon}
                                        >
                                            {ctaLabel(tier.price)}
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </section>

            {/* ── Comparison Section ──────────────────────────────── */}
            <section className="section" id="comparison">
                <div className="section-heading">
                    <p className="eyebrow">FIND YOUR FIT</p>
                    <h2>Not sure which product is right for you?</h2>
                    <p>Here's how different Cin Nova products serve different people.</p>
                </div>

                <div className="product-grid product-grid-photo pricing-fit-grid">
                    {pricingAudiences.map((item) => {
                        const photo = productMarketing[item.key]?.card;
                        return (
                            <FeaturePhotoCard
                                key={item.audience}
                                image={photo?.src}
                                alt={photo?.alt || item.product}
                                category={item.audience}
                                title={item.product}
                                description={`${item.why} Recommended plan: ${item.plan}`}
                            />
                        );
                    })}
                </div>
            </section>

            {/* ── FAQ (accordion) ─────────────────────────────────── */}
            <section className="section showcase-section pricing-faq-section">
                <div className="section-heading">
                    <p className="eyebrow">COMMON QUESTIONS</p>
                    <h2>Everything you need to know about Cin Nova pricing</h2>
                </div>

                <BusinessFAQ items={pricingFaqItems} title="Everything you need to know about Cin Nova pricing" />
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
