import "../App.css";
import NewsletterSignup from "../components/NewsletterSignup.jsx";
import FeaturePhotoCard from "../components/FeaturePhotoCard.jsx";
import ProductPhotoThumb from "../components/ProductPhotoThumb.jsx";
import BusinessHero from "../components/business/BusinessHero.jsx";
import BusinessSection from "../components/business/BusinessSection.jsx";
import BusinessStats from "../components/business/BusinessStats.jsx";
import BusinessTimeline from "../components/business/BusinessTimeline.jsx";
import BusinessCTABanner from "../components/business/BusinessCTABanner.jsx";
import { aboutAudiences, aboutValues, ecosystemProducts, productMarketing } from "../data/marketingImages.js";
import { aboutRoadmapTimeline, businessCompanyStats } from "../data/businessCenter.js";
import { saveSubscriber } from "../data/newsletterService.js";
import SEO from "../components/SEO.jsx";
import { siteUrl } from "../data/blogPosts.js";

const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "About Cin Nova",
    description:
        "Learn about Cin Nova — the company building practical AI software products for education, safety, real estate, tech support, and early childhood learning.",
    url: `${siteUrl}/?page=about`,
    publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
};

function About({ onNavigate }) {
    return (
        <main className="product-page business-center-page">
            <SEO
                title="About Cin Nova | Practical AI Software Company"
                description="Cin Nova builds AI-powered products for learning, safety, real estate, tech support, and early childhood education. Learn about our products, values, and roadmap."
                url={`${siteUrl}/?page=about`}
                type="website"
                schema={aboutSchema}
            />

            <BusinessHero
                eyebrow="ABOUT CIN NOVA"
                title="Building practical software for real-world problems."
                description="Cin Nova is a software and media company creating AI tools, education platforms, safety products, technology assistants, and real estate intelligence — built for people who need tools that actually work."
                pills={["5 products", "Education & safety", "Media + software", "Long-term build"]}
                actions={[
                    { label: "View partnerships", onClick: () => onNavigate?.("partnerships"), variant: "secondary" },
                    { label: "Press center", onClick: () => onNavigate?.("press-center"), variant: "secondary" },
                ]}
            />

            <BusinessSection
                eyebrow="COMPANY SNAPSHOT"
                title="Cin Nova by the numbers"
                description="A growing product and content ecosystem. Placeholder metrics are labeled until verified reporting is available."
            >
                <BusinessStats
                    stats={businessCompanyStats}
                    note="Metrics marked “Placeholder metric” will be updated with verified analytics."
                />
            </BusinessSection>

            <BusinessSection
                eyebrow="OUR MISSION"
                title="Help people learn, stay safe, solve problems, and invest smarter."
                id="mission"
                className="showcase-section"
            >
                <div className="showcase-grid">
                    <div className="showcase-card">
                        <h3>What We Build</h3>
                        <div className="chat-ai" style={{ marginTop: "14px" }}>
                            Cin Nova builds software that addresses real gaps in how people access learning, safety
                            information, technical help, and investment tools. Every product starts with a clear
                            problem and works backward to the simplest, most useful solution.
                            <br />
                            <br />
                            We focus on five areas: education, family safety, technology support, early childhood
                            learning, and real estate intelligence — because these are areas where the right tool
                            can genuinely change outcomes for individuals and families.
                        </div>
                    </div>

                    <div className="showcase-card">
                        <h3>Who We Build For</h3>
                        <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>
                            {aboutAudiences.map((item) => {
                                const photo = productMarketing[item.key]?.card;
                                return (
                                    <div key={item.who} className="audience-photo-row">
                                        <ProductPhotoThumb
                                            src={photo?.src}
                                            alt={photo?.alt || item.who}
                                            className="audience-photo-thumb"
                                        />
                                        <p style={{ color: "#334155", lineHeight: "1.6", margin: 0 }}>
                                            <strong style={{ color: "#0f172a" }}>{item.who}</strong> — {item.desc}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </BusinessSection>

            <BusinessSection
                eyebrow="THE ECOSYSTEM"
                title="Five products. One brand. A connected platform."
                description="Every Cin Nova product lives under the same umbrella — sharing infrastructure, design language, and a single account login."
                id="products"
            >
                <div className="product-grid product-grid-photo">
                    {ecosystemProducts.map((p) => (
                        <FeaturePhotoCard
                            key={p.name}
                            image={productMarketing[p.key].card.src}
                            alt={productMarketing[p.key].card.alt}
                            category={p.category}
                            title={p.name}
                            description={p.description}
                        />
                    ))}
                </div>
            </BusinessSection>

            <BusinessSection eyebrow="FOUNDER VISION" title="Built for the long term." id="vision" className="showcase-section">
                <div className="newsletter-card bc-founder-card">
                    <p className="eyebrow">FROM THE FOUNDER</p>
                    <h2 className="bc-founder-quote">
                        &ldquo;Cin Nova is being built as a real software company — not a side project.&rdquo;
                    </h2>
                    <p>
                        The goal is straightforward: identify categories where people genuinely need better tools,
                        build clean and useful software, and grow an audience through honest content and product
                        quality. That is how sustainable technology businesses are built.
                    </p>
                    <p>
                        Each product under the Cin Nova brand is designed to stand on its own — to be useful to
                        someone on day one, not just after a long onboarding process. The five initial products
                        cover education, safety, tech support, early childhood learning, and real estate because
                        these are underserved markets where AI can make a meaningful difference today.
                    </p>
                    <p>
                        The roadmap is clear: ship great products, create content that helps people, build an email
                        list, launch subscriptions, and keep improving. No shortcuts. No pivots. Just the work.
                    </p>
                    <div className="bc-founder-meta">
                        <div className="bc-founder-avatar" aria-hidden="true">
                            CN
                        </div>
                        <div>
                            <strong>Cin Nova</strong>
                            <span>Founder &amp; Builder</span>
                        </div>
                    </div>
                </div>
            </BusinessSection>

            <BusinessSection
                eyebrow="OUR VALUES"
                title="The principles behind every product decision."
                description="These aren't mission-statement buzzwords. They're the actual filters used when deciding what to build, what to ship, and what to cut."
                id="values"
            >
                <div className="product-grid product-grid-photo">
                    {aboutValues.map((v) => (
                        <FeaturePhotoCard key={v.title} {...v} />
                    ))}
                </div>
            </BusinessSection>

            <BusinessSection
                eyebrow="ROADMAP"
                title="Five phases. One direction."
                description="Building a sustainable software company is a long game. Here's how Cin Nova is approaching it — one phase at a time."
                id="roadmap"
                className="showcase-section"
            >
                <BusinessTimeline items={aboutRoadmapTimeline} />
            </BusinessSection>

            <BusinessSection id="community">
                <div className="newsletter-card">
                    <p className="eyebrow">JOIN THE COMMUNITY</p>
                    <h2>Join the Cin Nova community and follow the build.</h2>
                    <p className="bc-newsletter-lead">
                        Get product updates, early access announcements, and behind-the-scenes content delivered to
                        your inbox.
                    </p>
                    <NewsletterSignup
                        onSubscribe={saveSubscriber}
                        source="About Page"
                        tags={["Community", "Company Updates"]}
                    />
                </div>
            </BusinessSection>
        </main>
    );
}

export default About;
