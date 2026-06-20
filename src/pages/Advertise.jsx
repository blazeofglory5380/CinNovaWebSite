import "../App.css";
import SEO from "../components/SEO.jsx";
import { siteUrl } from "../data/blogPosts.js";
import { trackSponsorCtaClick } from "../utils/analytics.js";

const audienceSegments = [
    {
        name: "AI builders and professionals",
        category: "Artificial Intelligence",
        description:
            "Readers following AI infrastructure, productivity tools, practical assistants, and the business impact of automation.",
    },
    {
        name: "Students and education readers",
        category: "Education Technology",
        description:
            "Students, parents, and educators interested in StudyNest, AI tutoring, flashcards, study planning, and online learning.",
    },
    {
        name: "Real estate operators",
        category: "Real Estate Technology",
        description:
            "Investors, agents, and property-minded readers researching deal analysis, mortgage tools, and market intelligence.",
    },
    {
        name: "Technology enthusiasts",
        category: "Future Technology",
        description:
            "Readers who want practical context on emerging software, data centers, robotics, and the Cin Nova product ecosystem.",
    },
];

const websiteOpportunities = [
    "Category sponsorships on AI, education, real estate, safety, and future technology sections",
    "Article sidebar placements aligned with reader intent and topic category",
    "Resource center placements for guides, templates, checklists, and downloadable reports",
    "Homepage or product-ecosystem callouts for brands with broad Cin Nova audience fit",
];

const sponsoredArticleOpportunities = [
    "Clearly labeled sponsored articles written for educational value and reader trust",
    "Co-authored explainers with relevant partners, founders, educators, or industry experts",
    "Product comparison or workflow articles when the sponsor directly helps the reader solve a problem",
    "Newsletter and resource cross-promotion when the campaign includes multiple channels",
];

const newsletterOpportunities = [
    "Primary issue sponsor with a short brand message and one destination link",
    "Partner resource mention connected to a guide, checklist, template, or product launch",
    "Category-specific sponsorship for education, AI, real estate, or technology-focused sends",
    "Founding sponsor packages for brands that want early, recurring placement as the list grows",
];

const advertiseSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Advertise With Cin Nova",
    description:
        "Advertise with Cin Nova through website sponsorships, sponsored articles, and newsletter sponsorship opportunities.",
    url: `${siteUrl}/?page=advertise`,
    publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
};

function Advertise({ onNavigate }) {
    function handleSponsorCta(cta, target) {
        trackSponsorCtaClick({ page: "advertise", cta, target });
        onNavigate?.(target);
    }

    return (
        <main className="product-page media-kit-page">
            <SEO
                title="Advertise With Us | Cin Nova"
                description="Reach the Cin Nova audience through website sponsorships, sponsored articles, newsletter sponsorships, and resource placements."
                url={`${siteUrl}/?page=advertise`}
                type="website"
                schema={advertiseSchema}
            />

            <section className="section blog-hero-section">
                <div className="section-heading blog-hero-copy">
                    <p className="eyebrow">ADVERTISE WITH US</p>
                    <h2>Reach readers who care about practical AI, learning, real estate, and technology.</h2>
                    <p>
                        Cin Nova connects useful technology content with a growing audience of
                        students, educators, AI professionals, real estate readers, founders,
                        and technology enthusiasts. Advertising is reviewed carefully so every
                        placement protects reader trust and fits the surrounding content.
                    </p>
                    <div className="media-kit-hero-actions">
                        <button className="primary-btn" onClick={() => handleSponsorCta("Contact Cin Nova", "contact")}>
                            Contact Cin Nova
                        </button>
                        <button className="secondary-btn" onClick={() => handleSponsorCta("View Media Kit", "media-kit")}>
                            View Media Kit
                        </button>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="section-heading">
                    <p className="eyebrow">AUDIENCE OVERVIEW</p>
                    <h2>A focused audience across growing product categories.</h2>
                    <p>
                        Cin Nova publishes cornerstone articles, product pages, guides, and
                        newsletter updates across education, AI, real estate, safety, and future
                        technology.
                    </p>
                </div>
                <div className="product-grid">
                    {audienceSegments.map((segment) => (
                        <article className="product-card" key={segment.name}>
                            <p className="product-category">{segment.category}</p>
                            <h3>{segment.name}</h3>
                            <p>{segment.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="section showcase-section">
                <div className="section-heading">
                    <p className="eyebrow">WEBSITE SPONSORSHIPS</p>
                    <h2>Website sponsorship opportunities.</h2>
                    <p>
                        Website placements are best for brands that want contextual visibility
                        near articles, resources, and product education pages.
                    </p>
                </div>
                <div className="newsletter-card" style={{ textAlign: "left", maxWidth: "860px" }}>
                    <ul className="partner-type-benefits">
                        {websiteOpportunities.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="section">
                <div className="section-heading">
                    <p className="eyebrow">SPONSORED ARTICLES</p>
                    <h2>Sponsored article opportunities.</h2>
                    <p>
                        Sponsored articles must be useful, clearly labeled, and aligned with
                        the editorial quality of the Cin Nova blog.
                    </p>
                </div>
                <div className="product-grid">
                    {sponsoredArticleOpportunities.map((item) => (
                        <article className="product-card" key={item}>
                            <p className="product-category">Editorial Sponsorship</p>
                            <h3>{item.split(" ").slice(0, 4).join(" ")}</h3>
                            <p>{item}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="section showcase-section">
                <div className="section-heading">
                    <p className="eyebrow">NEWSLETTER SPONSORSHIPS</p>
                    <h2>Newsletter sponsorship opportunities.</h2>
                    <p>
                        Newsletter sponsorships put your brand in front of readers who have
                        opted in to follow Cin Nova articles, guides, product launches, and
                        practical AI updates.
                    </p>
                </div>
                <div className="showcase-grid">
                    {newsletterOpportunities.map((item) => (
                        <div className="showcase-card" key={item}>
                            <h3>{item.split(" ").slice(0, 3).join(" ")}</h3>
                            <p>{item}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="section" id="contact">
                <div className="newsletter-card">
                    <p className="eyebrow">CONTACT CTA</p>
                    <h2>Ready to discuss a campaign?</h2>
                    <p style={{ color: "#64748b", maxWidth: "560px", margin: "0 auto 18px", lineHeight: "1.8" }}>
                        Tell us about your product, audience, campaign goal, budget range, and
                        preferred timing. We will review fit and respond with availability.
                    </p>
                    <button className="primary-btn" onClick={() => handleSponsorCta("Contact Cin Nova", "contact")}>
                        Contact Cin Nova
                    </button>
                </div>
            </section>
        </main>
    );
}

export default Advertise;
