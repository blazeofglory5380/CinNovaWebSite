import "../App.css";
import "./LegalCenter.css";
import SEO from "../components/SEO.jsx";
import BusinessHero from "../components/business/BusinessHero.jsx";
import BusinessSection from "../components/business/BusinessSection.jsx";
import { getPublicPageUrl } from "../data/publicPageRoutes.js";
import { siteUrl } from "../data/seoConfig.js";
import { buildBreadcrumbSchema, withSchemaGraph } from "../data/schemaHelpers.js";
import {
    LEGAL_CONTACT_EMAIL,
    LEGAL_EFFECTIVE_DATE,
    LEGAL_REVIEW_STATUS,
    getLegalIndex,
} from "../data/legalCenter.js";

const legalSchema = withSchemaGraph(
    {
        "@type": "CollectionPage",
        name: "Legal Center | Cin Nova Policies and Disclosures",
        description:
            "Every Cin Nova policy in one place: privacy, terms, affiliate disclosure, cookies, disclaimer, accessibility, DMCA, and copyright.",
        url: getPublicPageUrl("legal"),
        publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
        hasPart: getLegalIndex().map((item) => ({
            "@type": "WebPage",
            name: item.title,
            url: `${siteUrl}${item.path}`,
        })),
    },
    buildBreadcrumbSchema([
        { name: "Home", url: siteUrl },
        { name: "Legal Center", url: getPublicPageUrl("legal") },
    ]),
);

function LegalCenterPage({ onNavigate }) {
    const documents = getLegalIndex();

    return (
        <main className="product-page business-center-page lg-page">
            <SEO
                title="Legal Center | Cin Nova Policies and Disclosures"
                description="Every Cin Nova policy in one place: privacy, terms, affiliate disclosure, cookies, disclaimer, accessibility, DMCA, and copyright — with an honest note on their review status."
                url={getPublicPageUrl("legal")}
                type="website"
                schema={legalSchema}
            />

            <BusinessHero
                eyebrow="LEGAL CENTER"
                title="Every policy in one place, written in language you can actually read."
                description="Eight documents covering privacy, terms, money, cookies, accessibility, and copyright. They describe how this site really works rather than restating a template."
                pills={["Eight documents", "Plain language", `Effective ${LEGAL_EFFECTIVE_DATE}`, "Contactable"]}
                actions={[
                    { label: "Privacy policy", onClick: () => onNavigate?.("privacy") },
                    { label: "Affiliate disclosure", onClick: () => onNavigate?.("legal-affiliate-disclosure"), variant: "secondary" },
                ]}
            />

            <BusinessSection eyebrow="STATUS" title="An honest note on these documents">
                <div className="newsletter-card bc-list-card lg-status">
                    <p>{LEGAL_REVIEW_STATUS.note}</p>
                    <p>
                        If something here is wrong, unclear, or does not match what the site actually does,
                        email <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a> and it will be
                        corrected rather than defended.
                    </p>
                </div>
            </BusinessSection>

            <BusinessSection
                eyebrow="DOCUMENTS"
                title="All policies"
                description="Each document is a permanent URL. Links to them do not rot when a policy is revised — the page is updated in place and the effective date changes."
                className="showcase-section"
            >
                <ul className="lg-index">
                    {documents.map((doc) => (
                        <li key={doc.path}>
                            <a
                                href={doc.path}
                                onClick={(event) => {
                                    if (event.metaKey || event.ctrlKey || event.shiftKey) return;
                                    event.preventDefault();
                                    onNavigate?.(doc.pageKey);
                                }}
                            >
                                <span className="lg-index-title">{doc.title}</span>
                                <span className="lg-index-summary">{doc.summary}</span>
                                <span className="lg-index-path">{doc.path}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </BusinessSection>

            <BusinessSection
                eyebrow="ELSEWHERE"
                title="Related pages"
                description="Not policies, but frequently wanted alongside them."
            >
                <div className="product-grid">
                    <article className="product-card">
                        <p className="product-category">Money</p>
                        <h3>Partner programme</h3>
                        <p>
                            The partner relationships the affiliate disclosure covers, and how to apply to
                            work with CinNova.
                        </p>
                        <button type="button" className="secondary-btn" onClick={() => onNavigate?.("partners")}>
                            Partner programme
                        </button>
                    </article>
                    <article className="product-card">
                        <p className="product-category">Money</p>
                        <h3>Advertise</h3>
                        <p>
                            How sponsorship works, how it is labelled, and why it never buys an editorial
                            recommendation.
                        </p>
                        <button type="button" className="secondary-btn" onClick={() => onNavigate?.("advertise")}>
                            Advertising options
                        </button>
                    </article>
                    <article className="product-card">
                        <p className="product-category">Brand</p>
                        <h3>Brand assets</h3>
                        <p>
                            Permitted and prohibited uses of the Cin Nova logo, colours, and name, which the
                            copyright policy refers to.
                        </p>
                        <button type="button" className="secondary-btn" onClick={() => onNavigate?.("brand-assets")}>
                            Brand asset rules
                        </button>
                    </article>
                </div>
            </BusinessSection>
        </main>
    );
}

export default LegalCenterPage;
