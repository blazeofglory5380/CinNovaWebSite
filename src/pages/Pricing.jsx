import { useEffect, useRef, useState } from "react";
import "../App.css";
import "./Pricing.css";
import NewsletterSignup from "../components/NewsletterSignup.jsx";
import FeaturePhotoCard from "../components/FeaturePhotoCard.jsx";
import BusinessFAQ from "../components/business/BusinessFAQ.jsx";
import { pricingAudiences, productMarketing } from "../data/marketingImages.js";
import { saveSubscriber } from "../data/newsletterService.js";
import SEO from "../components/SEO.jsx";
import { getPublicPageUrl } from "../data/publicPageRoutes.js";
import { siteUrl } from "../data/blogPosts.js";
import { trackEvent } from "../utils/analytics.js";

/* Honesty rule (Phase M1): do not display invented dollar prices.
   Hosted subscriptions are not live — tiers are planned; CTAs go to waitlist. */
const products = [
    {
        key: "studynest",
        name: "StudyNest",
        category: "Education AI",
        description: "AI-powered studying for students of all levels.",
        tiers: [
            {
                label: "Free",
                price: "Planned",
                highlight: false,
                perks: "Planned starter tools: notes, flashcards, and quizzes. Limits will be published at launch.",
            },
            {
                label: "Student Pro",
                price: "Coming Soon",
                highlight: true,
                perks: "Planned: expanded study tools and AI tutor access. Pricing published when billing goes live.",
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
                price: "Planned",
                highlight: false,
                perks: "Planned: basic substance lookup and emergency contact directory. Not a medical substitute.",
            },
            {
                label: "Family Premium",
                price: "Coming Soon",
                highlight: true,
                perks: "Planned: expanded guidance and pet safety features. Pricing published when billing goes live.",
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
                price: "Planned",
                highlight: false,
                perks: "Planned: AI chat assistant, error code lookup, and basic guides.",
            },
            {
                label: "TechMate Pro",
                price: "Coming Soon",
                highlight: true,
                perks: "Planned: expanded diagnostics and repair guides. Pricing published when billing goes live.",
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
                price: "Planned",
                highlight: false,
                perks: "Planned starter learning modules. Details published at launch.",
            },
            {
                label: "Family Plan",
                price: "Coming Soon",
                highlight: true,
                perks: "Planned: expanded modules and parent dashboard. Pricing published when billing goes live.",
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
                price: "Planned",
                highlight: false,
                perks: "Free rental calculator is live today. Broader product tiers remain planned.",
            },
            {
                label: "Investor Pro",
                price: "Coming Soon",
                highlight: true,
                perks: "Planned: deeper deal analysis and market tools. Pricing published when billing goes live.",
            },
            {
                label: "Business / Broker",
                price: "Coming Soon",
                highlight: false,
                perks: "Planned: commercial underwriting and team collaboration tools.",
            },
        ],
    },
];

// FAQ content — preserved verbatim from the previous static pricing FAQ.
const pricingFaqItems = [
    {
        question: "Are these prices live?",
        answer:
            "No. Cin Nova hosted subscriptions and checkout are not live yet. This page shows planned tiers only — we do not invent or display unverified dollar prices.",
    },
    {
        question: "Can I buy a plan today?",
        answer:
            "Not through Cin Nova hosted checkout. Join the waitlist for launch updates. The free rental calculator and published books (via their retailers) remain available where labeled.",
    },
    {
        question: "Will free and paid tiers be available at launch?",
        answer:
            "We plan free and paid tiers per product. Exact limits, prices, and cancellation terms will be published when billing is activated.",
    },
    {
        question: "How do I get notified?",
        answer:
            "Join the waitlist on this page or subscribe to the Cin Nova newsletter for product and pricing updates.",
    },
];

const pricingSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Cin Nova Pricing",
    description: "Pricing plans for all Cin Nova products: StudyNest, PoisonGuard, TechMate AI, Kiddo, and Cin Nova Real Estate.",
    url: getPublicPageUrl("pricing"),
    publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
};

function ctaLabel(price) {
    if (price === "Coming Soon" || price === "Planned") return "Join Waitlist";
    return "Join Waitlist";
}

function computePerView() {
    if (typeof window === "undefined") return 3;
    if (window.matchMedia("(min-width: 1001px)").matches) return 3; // desktop
    if (window.matchMedia("(min-width: 769px)").matches) return 2; // tablet
    return 1; // mobile
}

/* Dark ecosystem-style pricing carousel: one card per product, all plans inside. */
function PricingCarousel() {
    const [perView, setPerView] = useState(computePerView);
    const [index, setIndex] = useState(0);
    const drag = useRef({ startX: 0, active: false, moved: false });

    useEffect(() => {
        const onResize = () => setPerView(computePerView());
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const maxIndex = Math.max(0, products.length - perView);
    useEffect(() => {
        setIndex((i) => Math.min(i, maxIndex));
    }, [maxIndex]);

    const go = (i) => setIndex(Math.max(0, Math.min(maxIndex, i)));
    const prev = () => go(index - 1);
    const next = () => go(index + 1);

    const pageCount = maxIndex + 1;
    const atStart = index <= 0;
    const atEnd = index >= maxIndex;

    const onPointerDown = (e) => { drag.current = { startX: e.clientX, active: true, moved: false }; };
    const onPointerMove = (e) => {
        if (!drag.current.active) return;
        if (Math.abs(e.clientX - drag.current.startX) > 8) drag.current.moved = true;
    };
    const onPointerUp = (e) => {
        if (!drag.current.active) return;
        const dx = e.clientX - drag.current.startX;
        drag.current.active = false;
        if (dx <= -40) next();
        else if (dx >= 40) prev();
    };

    return (
        <div className="pricing-carousel" style={{ "--pc-per-view": perView }}>
            <div
                className="pricing-carousel-viewport"
                role="group"
                aria-roledescription="carousel"
                aria-label="CinNova product pricing"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerUp}
            >
                <div
                    className="pricing-carousel-track"
                    style={{ transform: `translateX(-${(index * 100) / perView}%)` }}
                >
                    {products.map((product) => (
                        <div className="pricing-carousel-slide" key={product.key}>
                            <div className="pricing-pcard">
                                <span className="pricing-pcard-badge">{product.category.toUpperCase()}</span>
                                <h3>{product.name}</h3>
                                <p className="pricing-pcard-desc">{product.description}</p>

                                <div className="pricing-pcard-plans">
                                    {product.tiers.map((tier) => {
                                        const notLive = tier.price === "Coming Soon" || tier.price === "Planned";
                                        return (
                                            <div
                                                key={tier.label}
                                                className={`pricing-pplan${tier.highlight ? " pricing-pplan--featured" : ""}`}
                                            >
                                                <div className="pricing-pplan-head">
                                                    <span className="pricing-pplan-name">{tier.label}</span>
                                                    {tier.highlight && <span className="pricing-pplan-tag">Planned</span>}
                                                </div>
                                                <div className="pricing-pplan-price">{tier.price}</div>
                                                <p className="pricing-pplan-perks">{tier.perks}</p>
                                                <a
                                                    href="#waitlist"
                                                    className={`pricing-pplan-cta${tier.highlight ? " pricing-pplan-cta--primary" : ""}`}
                                                    onClick={() => trackEvent("pricing_plan_cta_click", {
                                                        product: product.name,
                                                        plan: tier.label,
                                                        price: tier.price,
                                                        availability: notLive ? "coming_soon" : "waitlist",
                                                    })}
                                                >
                                                    {ctaLabel(tier.price)}
                                                </a>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pricing-carousel-controls">
                <button
                    type="button"
                    className="pricing-carousel-arrow"
                    onClick={() => { trackEvent("pricing_carousel_previous_click", { from_index: index }); prev(); }}
                    disabled={atStart}
                    aria-label="Previous products"
                >
                    <span aria-hidden="true">‹</span>
                </button>

                <div className="pricing-carousel-dots" role="group" aria-label="Pricing slides">
                    {Array.from({ length: pageCount }).map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            className={`pricing-carousel-dot${i === index ? " is-active" : ""}`}
                            onClick={() => { trackEvent("pricing_carousel_dot_click", { slide_index: i }); go(i); }}
                            aria-label={`Go to slide ${i + 1} of ${pageCount}`}
                            aria-current={i === index ? "true" : undefined}
                        />
                    ))}
                </div>

                <button
                    type="button"
                    className="pricing-carousel-arrow"
                    onClick={() => { trackEvent("pricing_carousel_next_click", { from_index: index }); next(); }}
                    disabled={atEnd}
                    aria-label="Next products"
                >
                    <span aria-hidden="true">›</span>
                </button>
            </div>
        </div>
    );
}

function Pricing() {
    return (
        <div className="product-page">
            <SEO
                title="Pricing | Cin Nova AI Products — Plans and Tiers"
                description="Compare free and paid plans for StudyNest, PoisonGuard, TechMate AI, Kiddo, and Cin Nova Real Estate. Find the right plan for students, families, investors, and teams."
                url={getPublicPageUrl("pricing")}
                type="website"
                schema={pricingSchema}
                noindex
            />

            {/* ── Hero ───────────────────────────────────────────── */}
            <section className="section" style={{ paddingBottom: "40px" }}>
                <div className="section-heading" style={{ marginBottom: "0" }}>
                    <p className="eyebrow">PRICING</p>
                    <h1>Planned plans for every Cin Nova product</h1>
                    <p>
                        Hosted billing is not live yet. Review planned tiers below,
                        then join the waitlist for launch updates. We do not show
                        unverified subscription prices.
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
                    <div><strong>Planned</strong><span>Tier Roadmap</span></div>
                    <div><strong>Waitlist</strong><span>Billing Not Live</span></div>
                </div>
            </section>

            {/* ── Pricing carousel (dark ecosystem style) ─────────── */}
            <section className="section showcase-section" id="all-plans" style={{ paddingBottom: "40px" }}>
                <div className="section-heading">
                    <p className="eyebrow">ALL PLANS</p>
                    <h2>Pick a product. Review planned tiers. Join the waitlist.</h2>
                </div>

                <PricingCarousel />
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
