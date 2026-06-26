import "../App.css";
import NewsletterSignup from "../components/NewsletterSignup.jsx";
import ProductHeroPhoto from "../components/ProductHeroPhoto.jsx";
import FeaturePhotoCard from "../components/FeaturePhotoCard.jsx";
import { productMarketing } from "../data/marketingImages.js";
import { saveSubscriber } from "../data/newsletterService.js";
import SEO from "../components/SEO.jsx";
import { siteUrl } from "../data/blogPosts.js";

const { hero, features } = productMarketing.poisonguard;

const poisonguardSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PoisonGuard",
    applicationCategory: "HealthApplication",
    description: "Household chemical and poison safety assistant for families, pets, and schools. Scan products for hazards and get emergency guidance.",
    operatingSystem: "Web",
    url: `${siteUrl}/?page=poisonguard`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
};

function PoisonGuard() {
    return (
        <div className="product-page">
            <SEO
                title="PoisonGuard | Household Chemical Safety App — Cin Nova"
                description="PoisonGuard scans household chemicals for hazard information, provides pet-safe warnings, and delivers emergency guidance. In development by Cin Nova."
                url={`${siteUrl}/?page=poisonguard`}
                type="website"
                schema={poisonguardSchema}
            />
            <section className="studynest-hero">
                <div>
                    <p className="eyebrow">POISONGUARD</p>
                    <h1>Poison and chemical safety for every home.</h1>
                    <p className="hero-text">
                        PoisonGuard helps families and pet owners quickly identify dangerous
                        substances, assess exposure risk, and get emergency guidance when
                        every second counts.
                    </p>
                    <div className="hero-actions">
                        <a href="#waitlist" className="primary-btn">Join Waitlist</a>
                        <a href="#features" className="secondary-btn">View Features</a>
                    </div>
                </div>

                <ProductHeroPhoto src={hero.src} alt={hero.alt} />
            </section>

            <section className="section" id="features">
                <div className="section-heading">
                    <p className="eyebrow">FEATURES</p>
                    <h2>Safety tools built for fast, confident decisions</h2>
                </div>
                <div className="product-grid product-grid-photo">
                    {features.map((feature) => (
                        <FeaturePhotoCard key={feature.title} {...feature} />
                    ))}
                </div>
            </section>

            <section className="section showcase-section">
                <div className="section-heading">
                    <p className="eyebrow">PRODUCT PREVIEW</p>
                    <h2>Fast answers when it matters most</h2>
                </div>
                <div className="showcase-grid">
                    <div className="showcase-card">
                        <h3>AI Safety Check</h3>
                        <div className="chat-user">My dog ate a grape. Is it dangerous?</div>
                        <div className="chat-ai">
                            Yes — grapes are highly toxic to dogs and can cause kidney failure.
                            Contact your vet or call poison control immediately.
                        </div>
                    </div>
                    <div className="showcase-card">
                        <h3>Substance Risk Card</h3>
                        <div className="flashcard-preview">
                            <p>Bleach (Sodium Hypochlorite)</p>
                            <strong>HIGH RISK — Do not induce vomiting. Rinse with water and call poison control.</strong>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section pricing-section">
                <div className="section-heading">
                    <p className="eyebrow">PRICING</p>
                    <h2>Protection for every family</h2>
                </div>
                <div className="pricing-grid">
                    <div className="pricing-card">
                        <h3>Free</h3>
                        <div className="price">$0</div>
                        <p>Basic substance lookup and emergency contact directory.</p>
                    </div>
                    <div className="pricing-card featured">
                        <h3>Family Pro</h3>
                        <div className="price">$4.99/mo</div>
                        <p>AI guidance, pet safety database, full chemical library, and priority alerts.</p>
                    </div>
                    <div className="pricing-card">
                        <h3>Business Plan</h3>
                        <div className="price">Coming Soon</div>
                        <p>Workplace chemical safety, MSDS integration, and team management.</p>
                    </div>
                </div>
            </section>

            <section className="section" id="waitlist">
                <div className="newsletter-card">
                    <p className="eyebrow">JOIN THE WAITLIST</p>
                    <h2>Be first to try PoisonGuard when it launches.</h2>
                    <NewsletterSignup
                        onSubscribe={saveSubscriber}
                        source="PoisonGuard Waitlist"
                        tags={["PoisonGuard", "Waitlist"]}
                        buttonLabel="Join Waitlist"
                    />
                </div>
            </section>
        </div>
    );
}

export default PoisonGuard;
