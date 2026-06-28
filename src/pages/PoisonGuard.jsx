import { useRef, useState } from "react";
import "../App.css";
import SEO from "../components/SEO.jsx";
import ImmersiveHeroScene from "../components/ImmersiveHeroScene.jsx";
import ProductHeroPhoto from "../components/ProductHeroPhoto.jsx";
import PoisonGuardFeatureCard from "../components/poisonguard/PoisonGuardFeatureCard.jsx";
import PoisonGuardFeatureModal from "../components/poisonguard/PoisonGuardFeatureModal.jsx";
import PoisonGuardWorkflowBanner from "../components/poisonguard/PoisonGuardWorkflowBanner.jsx";
import NewsletterSignup from "../components/NewsletterSignup.jsx";
import MarketingPhoto from "../components/MarketingPhoto.jsx";
import PoisonGuardSafetyDisclaimer from "../components/PoisonGuardSafetyDisclaimer.jsx";
import { poisonGuardFeatures } from "../data/poisonGuardFeatures.js";
import { productMarketing } from "../data/marketingImages.js";
import { saveSubscriber } from "../data/newsletterService.js";
import { siteUrl } from "../data/seoConfig.js";
import { buildFaqSchema, buildImageObject, withSchemaGraph } from "../data/schemaHelpers.js";

const { hero } = productMarketing.poisonguard;

const heroStats = [
    { value: "Seconds", label: "To scan & assess" },
    { value: "24/7", label: "Emergency links" },
    { value: "Families", label: "Pets & schools" },
];

const howItWorks = [
    {
        step: "01",
        title: "Scan or upload an image",
        description:
            "Point your camera at a plant, product label, pill bottle, or household item — or upload a photo from your gallery.",
    },
    {
        step: "02",
        title: "AI identifies possible hazards",
        description:
            "PoisonGuard analyzes the image and matches it against hazard databases for people, pets, and common household substances.",
    },
    {
        step: "03",
        title: "Get risk level and next-step guidance",
        description:
            "See a clear risk rating, confidence score, and plain-language steps — including when to call poison control or 911.",
    },
];

const useCases = [
    {
        title: "Parents",
        description: "Quickly check cleaning products, medications, and small objects when children are nearby.",
    },
    {
        title: "Pet owners",
        description: "Identify plants, foods, and chemicals that may be toxic to dogs, cats, and other pets.",
    },
    {
        title: "Schools",
        description: "Support science labs, cafeterias, and campus safety teams with fast substance lookups.",
    },
    {
        title: "Homeowners",
        description: "Audit garages, kitchens, and storage areas for hidden hazards before they become emergencies.",
    },
    {
        title: "Childcare centers",
        description: "Give staff a shared reference for common exposures and consistent emergency response steps.",
    },
    {
        title: "Community safety",
        description: "Equip neighborhoods, libraries, and local programs with accessible poison-prevention tools.",
    },
];

const trustPillars = [
    {
        title: "Privacy by design",
        description:
            "Scan data is handled with minimal retention. PoisonGuard is built to help in the moment — not to build advertising profiles.",
    },
    {
        title: "Responsible AI",
        description:
            "Models are tuned for cautious guidance. When confidence is low, PoisonGuard tells you to seek professional help.",
    },
    {
        title: "Clear limitations",
        description:
            "PoisonGuard supports decisions — it does not diagnose, prescribe, or replace licensed medical or veterinary care.",
    },
    {
        title: "Emergency-first guidance",
        description:
            "High-risk results surface poison control and 911 options immediately, with plain-language next steps.",
    },
    {
        title: "Human verification path",
        description:
            "Critical results encourage contacting poison control, veterinarians, or emergency services for confirmation.",
    },
];

const pricingPlans = [
    {
        name: "Free Beta",
        price: "$0",
        description: "Basic scans, substance lookup, emergency contacts, and scan history during beta.",
        featured: false,
    },
    {
        name: "Family Plan",
        price: "$4.99/mo",
        description: "Unlimited scans, pet safety database, priority alerts, and household member profiles.",
        featured: true,
    },
    {
        name: "School & Community",
        price: "Coming Soon",
        description: "Multi-user access, staff dashboards, and safety resources for schools and community programs.",
        featured: false,
    },
    {
        name: "Business & Organization",
        price: "Coming Soon",
        description: "Workplace chemical safety, MSDS integration, team management, and compliance reporting.",
        featured: false,
    },
];

const faqItems = [
    {
        question: "Is PoisonGuard medical advice?",
        answer:
            "No. PoisonGuard provides informational guidance to help you assess possible hazards. It is not a substitute for professional medical, veterinary, emergency, or poison-control advice.",
    },
    {
        question: "What can it scan?",
        answer:
            "PoisonGuard is designed for plants, common household products, medications, and pet-related hazards. Chemical label scanning and expanded substance libraries are on the roadmap.",
    },
    {
        question: "How accurate is it?",
        answer:
            "Accuracy depends on image quality and the item being scanned. Every result includes a confidence score — always verify high-risk situations with poison control or a professional.",
    },
    {
        question: "What should I do in an emergency?",
        answer:
            "If someone is in immediate danger, call 911. For poison exposure in the U.S., call Poison Control at 1-800-222-1222. PoisonGuard helps you assess risk — it does not replace emergency services.",
    },
    {
        question: "Are images stored?",
        answer:
            "PoisonGuard is designed with privacy-conscious defaults. Scan history helps you reference past checks; image retention policies will be clearly documented at launch.",
    },
    {
        question: "Will it support chemicals and multiple languages?",
        answer:
            "Yes — expanded chemical safety support and multilingual guidance are active roadmap priorities for Family, School, and Business plans.",
    },
];

const poisonguardSchema = withSchemaGraph(
    {
        "@type": "SoftwareApplication",
        name: "PoisonGuard",
        applicationCategory: "HealthApplication",
        description:
            "Household chemical and poison safety assistant for families, pets, and schools. Scan products for hazards and get emergency guidance.",
        operatingSystem: "Web",
        url: `${siteUrl}/?page=poisonguard`,
        screenshot: buildImageObject({ src: hero.src, alt: hero.alt }),
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
    },
    buildFaqSchema(faqItems),
);

function PoisonGuard() {
    const [activeFeature, setActiveFeature] = useState(null);
    const returnFocusRef = useRef(null);

    function handleOpenFeature(feature, buttonRef) {
        returnFocusRef.current = buttonRef.current;
        setActiveFeature(feature);
    }

    function handleCloseFeature() {
        setActiveFeature(null);
    }

    return (
        <main className="product-page poisonguard-landing">
            <SEO
                title="PoisonGuard | Household Chemical Safety App — Cin Nova"
                description="PoisonGuard scans household chemicals for hazard information, provides pet-safe warnings, and delivers emergency guidance. In development by Cin Nova."
                url={`${siteUrl}/?page=poisonguard`}
                type="website"
                schema={poisonguardSchema}
            />

            <section className="pg-hero section hero-with-immersive-scene" aria-labelledby="pg-hero-title">
                <ImmersiveHeroScene variant="poisonguard" intensity="calm" />
                <div className="pg-hero-grid">
                    <div className="pg-hero-copy">
                        <div className="pg-hero-badges">
                            <span className="pg-status-badge">Beta — In Development</span>
                            <span className="pg-category-badge">Safety Technology</span>
                        </div>
                        <p className="eyebrow">POISONGUARD</p>
                        <h1 id="pg-hero-title">Know what you&apos;re dealing with — before panic sets in.</h1>
                        <p className="pg-hero-lead">
                            PoisonGuard helps families, pet owners, schools, and households scan unknown substances,
                            understand risk levels, and get clear next-step guidance when every second counts.
                        </p>
                        <div className="pg-hero-actions">
                            <a href="#waitlist" className="primary-btn pg-btn-primary">
                                Join Waitlist
                            </a>
                            <a href="/?page=resources" className="secondary-btn">
                                View Safety Resources
                            </a>
                        </div>
                        <div className="pg-hero-stats" role="list" aria-label="PoisonGuard highlights">
                            {heroStats.map((stat) => (
                                <div key={stat.label} role="listitem" className="pg-hero-stat">
                                    <strong>{stat.value}</strong>
                                    <span>{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="pg-hero-visual">
                        <div className="pg-scanner-shell">
                            <ProductHeroPhoto src={hero.src} alt={hero.alt} />
                            <div className="pg-scanner-overlay" aria-hidden="true">
                                <div className="pg-scanner-frame">
                                    <span className="pg-scanner-corner pg-scanner-corner--tl" />
                                    <span className="pg-scanner-corner pg-scanner-corner--tr" />
                                    <span className="pg-scanner-corner pg-scanner-corner--bl" />
                                    <span className="pg-scanner-corner pg-scanner-corner--br" />
                                </div>
                                <div className="pg-scanner-chip">Scanning…</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="pg-disclaimer-wrap">
                <PoisonGuardSafetyDisclaimer variant="prominent" />
            </div>

            <section className="pg-trust-bar" aria-label="PoisonGuard value highlights">
                <div className="pg-trust-inner">
                    <span>Built for real households</span>
                    <span>People, pets, and schools</span>
                    <span>Part of the Cin Nova ecosystem</span>
                </div>
            </section>

            <section className="section pg-how" aria-labelledby="pg-how-title">
                <div className="pg-section-head">
                    <p className="eyebrow">HOW IT WORKS</p>
                    <h2 id="pg-how-title">From photo to guidance in three steps</h2>
                    <p>Designed for stressful moments when you need answers fast — not a medical textbook.</p>
                </div>
                <div className="pg-how-grid">
                    {howItWorks.map((item) => (
                        <article key={item.step} className="pg-how-card">
                            <span className="pg-how-step">{item.step}</span>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="section pg-use-cases" aria-labelledby="pg-use-cases-title">
                <div className="pg-section-head">
                    <p className="eyebrow">USE CASES</p>
                    <h2 id="pg-use-cases-title">Safety support for every kind of household</h2>
                </div>
                <div className="pg-use-cases-grid">
                    {useCases.map((item) => (
                        <article key={item.title} className="pg-use-case-card">
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="section pg-features" id="features" aria-labelledby="pg-features-title">
                <div className="pg-section-head">
                    <p className="eyebrow">FEATURES</p>
                    <h2 id="pg-features-title">Safety tools built for fast, confident decisions</h2>
                    <p>
                        Hazard recognition, risk assessment, and emergency guidance — with privacy and transparency
                        built in from day one.
                    </p>
                </div>
                <PoisonGuardWorkflowBanner />
                <div className="product-grid product-grid-photo pg-feature-grid">
                    {poisonGuardFeatures.map((feature) => (
                        <PoisonGuardFeatureCard
                            key={feature.id}
                            feature={feature}
                            onOpen={handleOpenFeature}
                        />
                    ))}
                </div>
            </section>

            {activeFeature ? (
                <PoisonGuardFeatureModal
                    feature={activeFeature}
                    onClose={handleCloseFeature}
                    returnFocusRef={returnFocusRef}
                />
            ) : null}

            <section className="section pg-preview" aria-labelledby="pg-preview-title">
                <div className="pg-section-head">
                    <p className="eyebrow">PRODUCT PREVIEW</p>
                    <h2 id="pg-preview-title">Fast answers when it matters most</h2>
                    <p>Early interface concepts showing scan flow, hazard results, and emergency guidance.</p>
                </div>
                <div className="pg-preview-grid">
                    <article className="pg-preview-card">
                        <p className="pg-preview-label">Scanner</p>
                        <h3>Point, scan, and identify</h3>
                        <div className="pg-mock-scanner">
                            <MarketingPhoto
                                src="/images/blog/healthcare/pet-safety-home-environment.jpg"
                                alt=""
                                className="pg-mock-scanner-img"
                                loading="lazy"
                            />
                            <div className="pg-mock-scanner-ui">
                                <span className="pg-mock-scanner-pulse" />
                                <span>Align item in frame</span>
                            </div>
                        </div>
                    </article>
                    <article className="pg-preview-card">
                        <p className="pg-preview-label">Hazard result</p>
                        <h3>Clear risk at a glance</h3>
                        <div className="pg-mock-result">
                            <div className="pg-mock-result-header">
                                <strong>Lily plant (Lilium)</strong>
                                <span className="pg-risk-badge pg-risk-badge--high">High risk</span>
                            </div>
                            <p className="pg-mock-result-copy">
                                Highly toxic to cats — can cause kidney failure. Do not wait for symptoms.
                            </p>
                            <div className="pg-confidence">
                                <div className="pg-confidence-label">
                                    <span>Confidence</span>
                                    <strong>92%</strong>
                                </div>
                                <div className="pg-confidence-bar">
                                    <span style={{ width: "92%" }} />
                                </div>
                            </div>
                        </div>
                    </article>
                    <article className="pg-preview-card pg-preview-card-wide">
                        <p className="pg-preview-label">Safety guidance</p>
                        <h3>Next steps you can act on</h3>
                        <div className="pg-guidance-grid">
                            <ol className="pg-guidance-steps">
                                <li>Remove your cat from the area and check for bite marks or pollen.</li>
                                <li>Do not induce vomiting unless directed by a professional.</li>
                                <li>Contact your veterinarian or poison control immediately.</li>
                            </ol>
                            <div className="pg-emergency-cta">
                                <p className="pg-emergency-label">In an emergency</p>
                                <a href="tel:18002221222" className="pg-emergency-btn">
                                    Call Poison Control · 1-800-222-1222
                                </a>
                                <a href="tel:911" className="pg-emergency-link">
                                    Or call 911
                                </a>
                            </div>
                        </div>
                    </article>
                </div>
            </section>

            <section className="section pg-trust" aria-labelledby="pg-trust-title">
                <div className="pg-section-head">
                    <p className="eyebrow">TRUST &amp; SAFETY</p>
                    <h2 id="pg-trust-title">Responsible technology for high-stakes decisions</h2>
                    <p>PoisonGuard is built with the humility that safety products require.</p>
                </div>
                <div className="pg-trust-grid">
                    {trustPillars.map((item) => (
                        <article key={item.title} className="pg-trust-card">
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="section pg-pricing" id="pricing" aria-labelledby="pg-pricing-title">
                <div className="pg-section-head">
                    <p className="eyebrow">PRICING</p>
                    <h2 id="pg-pricing-title">Protection for every family and organization</h2>
                    <p>Start free during beta. Upgrade when you need full household or team coverage.</p>
                </div>
                <div className="pg-pricing-grid">
                    {pricingPlans.map((plan) => (
                        <article
                            key={plan.name}
                            className={`pg-pricing-card${plan.featured ? " pg-pricing-card--featured" : ""}`}
                        >
                            {plan.featured && <span className="pg-pricing-flag">Most popular</span>}
                            <h3>{plan.name}</h3>
                            <div className="pg-pricing-price">{plan.price}</div>
                            <p>{plan.description}</p>
                            <a href="#waitlist" className={plan.featured ? "primary-btn pg-btn-primary" : "secondary-btn"}>
                                Join Waitlist
                            </a>
                        </article>
                    ))}
                </div>
            </section>

            <section className="section pg-faq" aria-labelledby="pg-faq-title">
                <div className="pg-section-head">
                    <p className="eyebrow">FAQ</p>
                    <h2 id="pg-faq-title">Common questions about PoisonGuard</h2>
                </div>
                <div className="pg-faq-list">
                    {faqItems.map((item) => (
                        <article key={item.question} className="pg-faq-item">
                            <h3>{item.question}</h3>
                            <p>{item.answer}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="section pg-waitlist" id="waitlist" aria-labelledby="pg-waitlist-title">
                <div className="pg-waitlist-card">
                    <div className="pg-waitlist-copy">
                        <p className="eyebrow">JOIN THE WAITLIST</p>
                        <h2 id="pg-waitlist-title">Be first to try PoisonGuard when it launches.</h2>
                        <p>
                            Get product updates, early access invitations, and household safety tips from the Cin Nova
                            team. No spam — unsubscribe anytime.
                        </p>
                    </div>
                    <div className="pg-waitlist-form">
                        <NewsletterSignup
                            onSubscribe={saveSubscriber}
                            source="PoisonGuard Waitlist"
                            tags={["PoisonGuard", "Waitlist"]}
                            buttonLabel="Join Waitlist"
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}

export default PoisonGuard;
