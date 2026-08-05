import "../App.css";
import SEO from "../components/SEO.jsx";
import BusinessHero from "../components/business/BusinessHero.jsx";
import BusinessSection from "../components/business/BusinessSection.jsx";
import BusinessFAQ from "../components/business/BusinessFAQ.jsx";
import BusinessCTABanner from "../components/business/BusinessCTABanner.jsx";
import { getPublicPageUrl } from "../data/publicPageRoutes.js";
import { siteUrl } from "../data/seoConfig.js";
import { buildBreadcrumbSchema, buildFaqSchema, withSchemaGraph } from "../data/schemaHelpers.js";
import { PRESS_CONTACT_EMAIL } from "../data/brandAssets.js";
import { trackSponsorCtaClick } from "../utils/analytics.js";

const SALES_EMAIL = PRESS_CONTACT_EMAIL;

const packages = [
    {
        name: "Newsletter sponsorship",
        surface: "Email",
        description:
            "One clearly labelled sponsor message in an edition, with a short brand line and a single destination link. Sold per issue or as a run of issues.",
        suits: "Products that solve a problem the edition's readers already have.",
    },
    {
        name: "Sponsored article",
        surface: "Website",
        description:
            "A full article written to CinNova editorial standards and labelled as sponsored at the top. Editorial review applies; the sponsor approves facts, not conclusions.",
        suits: "Brands with a genuinely useful workflow or explainer to share.",
    },
    {
        name: "Category sponsorship",
        surface: "Website",
        description:
            "Contextual placement across a subject area — AI, education, real estate, safety, or future technology — rather than a single page.",
        suits: "Brands aligned with one clear reader intent.",
    },
    {
        name: "Resource placement",
        surface: "Website",
        description:
            "A labelled placement in the resource library alongside guides, templates, and checklists that readers download.",
        suits: "Tools that pair naturally with a downloadable resource.",
    },
    {
        name: "Multi-channel campaign",
        surface: "Website + email",
        description:
            "A combined package across the newsletter, article placements, and the resource library, planned around one campaign goal.",
        suits: "Larger campaigns with a defined launch window.",
    },
    {
        name: "Technology partnership",
        surface: "Product",
        description:
            "Integration or referral pathways where the product overlap is real. Not an advertising product — reviewed on reader value, not budget.",
        suits: "Tools that CinNova products or readers would genuinely use together.",
    },
];

const includeInEnquiry = [
    "Your company and the specific product being promoted",
    "The audience you are trying to reach, in your own words",
    "The campaign goal — awareness, signups, trials, or downloads",
    "Budget range, even a rough one; it saves both sides a round trip",
    "Preferred timing and any hard launch date",
    "Whether you need a labelled sponsored article or a placement only",
];

const salesFaq = [
    {
        question: "What are your rates?",
        answer:
            "Rates depend on the surface, the run length, and the campaign. Send your budget range with the enquiry and you will get a specific proposal rather than a rate card that fits nobody.",
    },
    {
        question: "Can we buy a position in the recommended tools list?",
        answer:
            "No. Entries in the Affiliate Center are an editorial decision and are not for sale. Sponsorship buys clearly labelled placement, never an editorial recommendation or a ranking.",
    },
    {
        question: "Will sponsored content be labelled?",
        answer:
            "Always, at the top of the content and in the metadata. Unlabelled sponsorship is not offered at any price.",
    },
    {
        question: "Do you share subscriber data with sponsors?",
        answer:
            "Never. A sponsor buys placement in an issue. The subscriber list is not sold, rented, or shared, and sponsors receive aggregate delivery information only.",
    },
    {
        question: "What audience numbers can you share?",
        answer:
            "CinNova does not publish audience metrics it cannot verify. You will be told plainly what is measured and what is not, rather than given an estimate presented as a statistic.",
    },
    {
        question: "How quickly will I hear back?",
        answer:
            "Most enquiries get a reply within five business days. Complex partnerships take longer because they are reviewed on product fit, not just on budget.",
    },
];

const salesSchema = withSchemaGraph(
    {
        "@type": "ContactPage",
        name: "Contact Sales | Cin Nova",
        description:
            "Talk to Cin Nova about sponsorships, newsletter placements, sponsored articles, and partnership packages.",
        url: getPublicPageUrl("contact-sales"),
        publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
    },
    buildBreadcrumbSchema([
        { name: "Home", url: siteUrl },
        { name: "Contact Sales", url: getPublicPageUrl("contact-sales") },
    ]),
    buildFaqSchema(salesFaq),
);

const MAILTO = `mailto:${SALES_EMAIL}?subject=${encodeURIComponent("CinNova sponsorship enquiry")}`;

function ContactSales({ onNavigate }) {
    function handleCta(cta, target) {
        trackSponsorCtaClick({ page: "contact-sales", cta, target });
        onNavigate?.(target);
    }

    return (
        <main className="product-page business-center-page">
            <SEO
                title="Contact Sales | Advertising & Partnerships at Cin Nova"
                description="Talk to Cin Nova about sponsorships, newsletter placements, sponsored articles, and partnership packages. See what to include in an enquiry and what happens after you send it."
                url={getPublicPageUrl("contact-sales")}
                type="website"
                schema={salesSchema}
            />

            <BusinessHero
                eyebrow="CONTACT SALES"
                title="Tell us the campaign, and you will get a straight answer about fit."
                description="Cin Nova sells clearly labelled placement across the website and the newsletter. Editorial recommendations are not for sale, and you will be told directly if a campaign is not a good fit rather than sold something that will not work."
                pills={["Newsletter sponsorship", "Sponsored articles", "Category placement", "Partnerships"]}
                actions={[
                    { label: "Email the sales contact", href: MAILTO },
                    { label: "Use the contact form", onClick: () => handleCta("Use the contact form", "contact"), variant: "secondary" },
                ]}
            />

            <BusinessSection
                eyebrow="PACKAGES"
                title="What can be bought"
                description="Availability varies by month. Every website and newsletter placement is labelled as sponsored."
            >
                <div className="product-grid">
                    {packages.map((item) => (
                        <article className="product-card" key={item.name}>
                            <p className="product-category">{item.surface}</p>
                            <h3>{item.name}</h3>
                            <p>{item.description}</p>
                            <p>
                                <strong>Suits:</strong> {item.suits}
                            </p>
                        </article>
                    ))}
                </div>
            </BusinessSection>

            <BusinessSection
                eyebrow="WHAT TO SEND"
                title="Include these six things"
                description="An enquiry with these details usually gets a proposal on the first reply instead of a list of questions."
                className="showcase-section"
            >
                <div className="newsletter-card bc-list-card">
                    <ul className="partner-type-benefits">
                        {includeInEnquiry.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                    <p>
                        Send it to <a href={MAILTO}>{SALES_EMAIL}</a>, or use the contact form and choose the
                        advertising enquiry type.
                    </p>
                </div>
            </BusinessSection>

            <BusinessSection
                eyebrow="PROCESS"
                title="What happens after you send it"
                description="Four steps, no discovery-call theatre."
            >
                <div className="showcase-grid">
                    <div className="showcase-card">
                        <h3>1. Fit review</h3>
                        <p>
                            We check whether the product genuinely helps this audience. If it does not, you get a
                            no with the reason, within the same reply.
                        </p>
                    </div>
                    <div className="showcase-card">
                        <h3>2. Proposal</h3>
                        <p>
                            Surfaces, timing, labelling, and price against your stated budget range. One
                            document, no tiered upsell ladder.
                        </p>
                    </div>
                    <div className="showcase-card">
                        <h3>3. Editorial review</h3>
                        <p>
                            For sponsored articles, the draft is reviewed against the same standards as
                            unsponsored content. You approve facts; the conclusions stay editorial.
                        </p>
                    </div>
                    <div className="showcase-card">
                        <h3>4. Placement and reporting</h3>
                        <p>
                            The placement goes live labelled, and you receive whatever delivery data actually
                            exists — never an estimate dressed up as a measurement.
                        </p>
                    </div>
                </div>
            </BusinessSection>

            <BusinessSection eyebrow="FAQ" title="Sales questions" className="showcase-section">
                <BusinessFAQ items={salesFaq} title="Advertising and partnership questions" />
            </BusinessSection>

            <BusinessCTABanner
                eyebrow="BEFORE YOU WRITE"
                title="Read the media kit first"
                description="The media kit covers placement formats and audience segments. The advertise page explains what each surface is for. Both will make your enquiry faster to answer."
                primaryLabel="View the media kit"
                onPrimary={() => handleCta("View the media kit", "media-kit")}
                secondaryLabel="Advertise with us"
                onSecondary={() => handleCta("Advertise with us", "advertise")}
            />
        </main>
    );
}

export default ContactSales;
