import "../App.css";
import SEO from "../components/SEO.jsx";
import BusinessHero from "../components/business/BusinessHero.jsx";
import BusinessSection from "../components/business/BusinessSection.jsx";
import BusinessFAQ from "../components/business/BusinessFAQ.jsx";
import BusinessCTABanner from "../components/business/BusinessCTABanner.jsx";
import BusinessContactCard from "../components/business/BusinessContactCard.jsx";
import { partnershipsFaq, partnershipPrograms } from "../data/businessCenter.js";
import { siteUrl } from "../data/blogPosts.js";
import { trackSponsorCtaClick } from "../utils/analytics.js";

const partnershipsSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Cin Nova Partnerships",
    description:
        "Explore technology, education, real estate, media, affiliate, and contributor partnership opportunities with Cin Nova.",
    url: `${siteUrl}/?page=partnerships`,
    publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
};

function Partnerships({ onNavigate }) {
    function handleCta(cta, target) {
        trackSponsorCtaClick({ page: "partnerships", cta, target });
        onNavigate?.(target);
    }

    return (
        <main className="product-page business-center-page partners-page">
            <SEO
                title="Partnerships | Cin Nova"
                description="Partner with Cin Nova across technology, education, real estate, media, affiliate programs, and guest contributor opportunities."
                url={`${siteUrl}/?page=partnerships`}
                type="website"
                schema={partnershipsSchema}
            />

            <BusinessHero
                eyebrow="PARTNERSHIPS"
                title="Build with a practical AI and education-focused ecosystem."
                description="Cin Nova works with aligned companies, educators, creators, real estate professionals, and technology teams that help readers learn, stay safe, and make better decisions."
                pills={["Technology integrations", "Education collaborations", "Media & sponsorships", "Affiliate paths"]}
                actions={[
                    { label: "Apply to Partner Program", onClick: () => handleCta("Apply", "partners") },
                    { label: "Advertise with Cin Nova", onClick: () => handleCta("Advertise", "advertise"), variant: "secondary" },
                    { label: "Contact partnerships", onClick: () => handleCta("Contact", "contact"), variant: "secondary" },
                ]}
            />

            <BusinessSection
                eyebrow="PARTNERSHIP PROGRAMS"
                title="Five ways to work with Cin Nova"
                description="Each path is reviewed for audience fit, reader value, and long-term brand alignment."
            >
                <div className="bc-program-grid">
                    {partnershipPrograms.map((program) => (
                        <article key={program.category} className="bc-program-card">
                            <p className="product-category">{program.category}</p>
                            <h3>{program.title}</h3>
                            <p>{program.description}</p>
                            <ul className="partner-type-benefits">
                                {program.items.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </BusinessSection>

            <BusinessSection
                eyebrow="HOW WE REVIEW FIT"
                title="Reader value comes first"
                description="Partnerships work best when they make the Cin Nova audience more capable, informed, or connected to genuinely useful tools."
                className="showcase-section"
            >
                <div className="showcase-grid">
                    <div className="showcase-card">
                        <h3>Audience alignment</h3>
                        <p>
                            The partner should clearly serve one or more Cin Nova audience groups: students,
                            educators, AI professionals, real estate readers, families, builders, or technology
                            enthusiasts.
                        </p>
                    </div>
                    <div className="showcase-card">
                        <h3>Practical value</h3>
                        <p>
                            The opportunity should help readers learn something, solve a problem, compare options,
                            access a useful resource, or discover a relevant tool.
                        </p>
                    </div>
                    <div className="showcase-card">
                        <h3>Transparent execution</h3>
                        <p>
                            Sponsored content, affiliate links, and integrations are disclosed clearly. Cin Nova
                            prioritizes trust over short-term placement revenue.
                        </p>
                    </div>
                </div>
            </BusinessSection>

            <BusinessSection
                eyebrow="GET STARTED"
                title="Choose your next step"
                description="Explore program details, submit an application, or contact the team with a partnership proposal."
            >
                <div className="bc-contact-grid">
                    <BusinessContactCard
                        title="Partner Program application"
                        description="For affiliate, content, technology, and sponsor partnerships with a formal review process."
                        topics={["Affiliate and content partners", "Technology integrations", "Sponsor campaigns"]}
                        ctaLabel="Apply now"
                        onCta={() => handleCta("Apply", "partners")}
                    />
                    <BusinessContactCard
                        title="Custom partnership inquiry"
                        description="For co-marketing, education pilots, real estate collaborations, or multi-channel proposals."
                        topics={["Education and classroom pilots", "Real estate workflow content", "Guest contributor pitches"]}
                        ctaLabel="Contact Cin Nova"
                        onCta={() => handleCta("Contact", "contact")}
                    />
                </div>
            </BusinessSection>

            <BusinessSection eyebrow="FAQ" title="Partnership FAQ">
                <BusinessFAQ items={partnershipsFaq} title="Partnership frequently asked questions" />
            </BusinessSection>

            <BusinessCTABanner
                eyebrow="ADVERTISING"
                title="Looking for sponsorship placements?"
                description="Website, newsletter, and sponsored article opportunities are managed through the Advertise and Media Kit pages."
                primaryLabel="Advertise with Cin Nova"
                onPrimary={() => handleCta("Advertise", "advertise")}
                secondaryLabel="View Media Kit"
                onSecondary={() => handleCta("Media Kit", "media-kit")}
            />
        </main>
    );
}

export default Partnerships;
