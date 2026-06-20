import "../App.css";
import SEO from "../components/SEO.jsx";
import { siteUrl } from "../data/blogPosts.js";
import { trackSponsorCtaClick } from "../utils/analytics.js";

const partnerGroups = [
    {
        category: "Technology Partners",
        title: "Build useful integrations and product pathways.",
        description:
            "Technology partners may include AI tools, infrastructure providers, productivity software, support platforms, and product teams with clear overlap across the Cin Nova ecosystem.",
        items: [
            "API and workflow integrations where product value is clear",
            "Co-marketing around practical AI use cases",
            "Product bundling or referral pathways for aligned audiences",
            "Joint educational content for technical readers and founders",
        ],
    },
    {
        category: "Education Partners",
        title: "Support smarter learning workflows.",
        description:
            "Education partners include schools, tutors, learning creators, curriculum teams, and organizations focused on student support, AI tutoring, and study habits.",
        items: [
            "StudyNest-focused learning content and classroom pilots",
            "Educator interviews, guides, and expert guest contributions",
            "Student success resources around active recall and planning",
            "Early feedback partnerships for education product features",
        ],
    },
    {
        category: "Real Estate Partners",
        title: "Help readers make better property decisions.",
        description:
            "Real estate partners may include agents, investor communities, data providers, mortgage educators, and software companies serving property professionals.",
        items: [
            "Deal analysis education and investor workflow content",
            "Market intelligence and data partnership exploration",
            "Co-branded real estate templates, guides, and resources",
            "Newsletter or article collaborations for property audiences",
        ],
    },
    {
        category: "Affiliate Partners",
        title: "Grow through aligned recommendations.",
        description:
            "Affiliate partnerships are designed for useful products that fit Cin Nova readers and can be recommended transparently inside articles, resources, and newsletters.",
        items: [
            "Tracked partner links for relevant products and services",
            "Approved descriptions that clearly explain reader value",
            "Category-specific affiliate placements where appropriate",
            "Performance review before expanding into larger campaigns",
        ],
    },
    {
        category: "Guest Contributors",
        title: "Contribute practical expertise.",
        description:
            "Guest contributors can share expert explainers, founder lessons, classroom insights, real estate workflows, or technical guides that help Cin Nova readers make better decisions.",
        items: [
            "Original, practical articles with clear reader value",
            "Expert quotes, interviews, or educational explainers",
            "Contributor byline and short bio when accepted",
            "Editorial review for quality, accuracy, and brand fit",
        ],
    },
];

const partnerSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Partner With Cin Nova",
    description:
        "Partner with Cin Nova through technology, education, real estate, affiliate, and guest contributor opportunities.",
    url: `${siteUrl}/?page=partner-with-us`,
    publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
};

function PartnerWithUs({ onNavigate }) {
    function handleSponsorCta(cta, target) {
        trackSponsorCtaClick({ page: "partner-with-us", cta, target });
        onNavigate?.(target);
    }

    return (
        <main className="product-page partners-page">
            <SEO
                title="Partner With Us | Cin Nova"
                description="Explore technology, education, real estate, affiliate, and guest contributor partnership opportunities with Cin Nova."
                url={`${siteUrl}/?page=partner-with-us`}
                type="website"
                schema={partnerSchema}
            />

            <section className="section blog-hero-section">
                <div className="section-heading blog-hero-copy">
                    <p className="eyebrow">PARTNER WITH US</p>
                    <h2>Build with a practical AI and education-focused media ecosystem.</h2>
                    <p>
                        Cin Nova works with aligned companies, educators, creators, real estate
                        professionals, and technology teams that can help readers learn, solve
                        problems, and make better decisions.
                    </p>
                    <div className="resources-hero-stats">
                        <span>Technology partnerships</span>
                        <span>Education collaborations</span>
                        <span>Affiliate and contributor paths</span>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="section-heading">
                    <p className="eyebrow">PARTNERSHIP AREAS</p>
                    <h2>Five ways to work with Cin Nova.</h2>
                    <p>
                        Each partnership path is reviewed for audience fit, reader value, and
                        long-term brand alignment.
                    </p>
                </div>
                <div className="partner-types-grid">
                    {partnerGroups.map((group) => (
                        <article className="partner-type-card" key={group.category}>
                            <p className="product-category">{group.category}</p>
                            <h3>{group.title}</h3>
                            <p>{group.description}</p>
                            <ul className="partner-type-benefits">
                                {group.items.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </section>

            <section className="section showcase-section">
                <div className="section-heading">
                    <p className="eyebrow">HOW WE REVIEW FIT</p>
                    <h2>Reader value comes first.</h2>
                    <p>
                        Partnerships work best when they make the Cin Nova audience more capable,
                        informed, or connected to genuinely useful tools.
                    </p>
                </div>
                <div className="showcase-grid">
                    <div className="showcase-card">
                        <h3>Audience Alignment</h3>
                        <p>
                            The partner should clearly serve one or more Cin Nova audience groups:
                            students, educators, AI professionals, real estate readers, families,
                            builders, or technology enthusiasts.
                        </p>
                    </div>
                    <div className="showcase-card">
                        <h3>Practical Value</h3>
                        <p>
                            The opportunity should help readers learn something, solve a problem,
                            compare options, access a useful resource, or discover a relevant tool.
                        </p>
                    </div>
                </div>
            </section>

            <section className="section" id="contact">
                <div className="newsletter-card">
                    <p className="eyebrow">CONTACT CTA</p>
                    <h2>Have a partnership idea?</h2>
                    <p style={{ color: "#64748b", maxWidth: "560px", margin: "0 auto 18px", lineHeight: "1.8" }}>
                        Share your company, audience, proposed partnership type, and what you
                        think Cin Nova readers would gain from the collaboration.
                    </p>
                    <button className="primary-btn" onClick={() => handleSponsorCta("Contact Cin Nova", "contact")}>
                        Contact Cin Nova
                    </button>
                </div>
            </section>
        </main>
    );
}

export default PartnerWithUs;
