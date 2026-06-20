import "../App.css";
import SEO from "../components/SEO.jsx";
import { siteUrl } from "../data/blogPosts.js";

const audienceTypes = [
    {
        title: "AI professionals",
        description:
            "Builders, operators, and technology readers following practical AI tools, infrastructure, automation, and product strategy.",
    },
    {
        title: "Educators",
        description:
            "Teachers, tutors, learning creators, and education leaders interested in AI tutoring, study systems, and online learning.",
    },
    {
        title: "Students",
        description:
            "High school, college, and self-directed learners looking for smarter ways to study, plan, and use AI responsibly.",
    },
    {
        title: "Real estate professionals",
        description:
            "Agents, investors, analysts, and operators interested in property technology, deal analysis, and market intelligence.",
    },
    {
        title: "Technology enthusiasts",
        description:
            "Readers who follow useful software, data centers, future technology, robotics, and the buildout of the Cin Nova ecosystem.",
    },
];

const sponsorshipOptions = [
    {
        title: "Primary Issue Sponsor",
        description:
            "A dedicated sponsor mention near the top of a newsletter issue with concise copy and one destination link.",
    },
    {
        title: "Resource Sponsor",
        description:
            "A sponsor mention connected to a practical guide, checklist, template, or downloadable resource.",
    },
    {
        title: "Category Sponsor",
        description:
            "A recurring sponsorship aligned with education, AI, real estate, safety, or future technology issues.",
    },
    {
        title: "Founding Sponsor Package",
        description:
            "A multi-send package for early partners who want recurring visibility as the Cin Nova newsletter grows.",
    },
];

const newsletterSponsorSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Sponsor the Cin Nova Newsletter",
    description:
        "Sponsor the Cin Nova newsletter and reach AI professionals, educators, students, real estate professionals, and technology enthusiasts.",
    url: `${siteUrl}/?page=sponsor-newsletter`,
    publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
};

function SponsorNewsletter({ onNavigate }) {
    return (
        <main className="product-page newsletter-landing-page">
            <SEO
                title="Sponsor the Newsletter | Cin Nova"
                description="Sponsor the Cin Nova newsletter to reach AI professionals, educators, students, real estate professionals, and technology enthusiasts."
                url={`${siteUrl}/?page=sponsor-newsletter`}
                type="website"
                schema={newsletterSponsorSchema}
            />

            <section className="section nl-hero-section">
                <div className="nl-hero-inner">
                    <div className="nl-hero-copy">
                        <div className="nl-hero-badge">
                            <span className="nl-pulse-dot" />
                            Newsletter sponsorships
                        </div>
                        <p className="eyebrow">SPONSOR THE NEWSLETTER</p>
                        <h1 className="nl-hero-headline">
                            Put your brand in front of Cin Nova readers.
                        </h1>
                        <p className="nl-hero-sub">
                            The Cin Nova newsletter covers practical AI, StudyNest, education
                            technology, real estate tools, product updates, free resources, and
                            useful technology ideas for readers who want signal over noise.
                        </p>
                    </div>

                    <div className="nl-hero-form-card">
                        <p className="nl-form-card-title">Best-fit sponsors</p>
                        <ul className="partner-type-benefits">
                            <li>Education technology and learning tools</li>
                            <li>AI software, productivity, and workflow platforms</li>
                            <li>Real estate software, data, and investor education</li>
                            <li>Useful resources for builders, students, and professionals</li>
                        </ul>
                        <button className="primary-btn nl-submit-btn" onClick={() => onNavigate?.("contact")}>
                            Contact Cin Nova
                        </button>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="section-heading">
                    <p className="eyebrow">AUDIENCE TYPES</p>
                    <h2>Who the newsletter reaches.</h2>
                    <p>
                        Cin Nova's newsletter audience follows a mix of AI, learning, real estate,
                        product-building, and future technology content.
                    </p>
                </div>
                <div className="nl-benefits-grid">
                    {audienceTypes.map((audience) => (
                        <div className="nl-benefit-card" key={audience.title}>
                            <strong>{audience.title}</strong>
                            <p>{audience.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="section showcase-section">
                <div className="section-heading">
                    <p className="eyebrow">SPONSORSHIP OPPORTUNITIES</p>
                    <h2>Choose the right sponsorship format.</h2>
                    <p>
                        Sponsorships are designed to be clear, useful, and respectful of the
                        reader's inbox.
                    </p>
                </div>
                <div className="product-grid">
                    {sponsorshipOptions.map((option) => (
                        <article className="product-card" key={option.title}>
                            <p className="product-category">Newsletter</p>
                            <h3>{option.title}</h3>
                            <p>{option.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="section">
                <div className="newsletter-card">
                    <p className="eyebrow">CTA</p>
                    <h2>Want to sponsor an upcoming issue?</h2>
                    <p style={{ color: "#64748b", maxWidth: "560px", margin: "0 auto 18px", lineHeight: "1.8" }}>
                        Send your brand, target audience, product URL, desired timing, and
                        sponsorship format. Cin Nova will review fit and respond with current
                        availability.
                    </p>
                    <button className="primary-btn" onClick={() => onNavigate?.("contact")}>
                        Contact Cin Nova
                    </button>
                </div>
            </section>
        </main>
    );
}

export default SponsorNewsletter;
