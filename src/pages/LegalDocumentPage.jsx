import SEO from "../components/SEO.jsx";
import { getPublicPageUrl } from "../data/publicPageRoutes.js";
import { siteUrl } from "../data/blogPosts.js";
import { getLegalDocument, ATTORNEY_REVIEW_STATUS } from "../data/legalDocuments.js";
import { getMonetizationString } from "../data/monetizationI18n.js";

/**
 * Shared legal document renderer for monetization trust pages.
 */
function LegalDocumentPage({ documentKey, onNavigate, locale = "en" }) {
    const doc = getLegalDocument(documentKey);
    if (!doc) {
        return (
            <main className="product-page legal-page">
                <p>Document not found.</p>
            </main>
        );
    }

    const title = getMonetizationString(doc.titleKey, locale) || doc.title;
    const canonical = getPublicPageUrl(doc.key);
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: `${title} — Cin Nova`,
        description: doc.description,
        url: canonical,
        publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
    };

    return (
        <main className="product-page legal-page">
            <SEO
                title={`${title} | Cin Nova`}
                description={doc.description}
                url={canonical}
                type="website"
                schema={schema}
            />

            <section className="section legal-hero">
                <div className="section-heading">
                    <p className="eyebrow">LEGAL</p>
                    <h1>{title}</h1>
                    <p className="legal-updated">Last updated: {doc.lastUpdated}</p>
                    {doc.attorneyReview === ATTORNEY_REVIEW_STATUS && (
                        <p className="legal-updated" role="note">
                            {getMonetizationString("attorneyReviewRequired", locale)}
                        </p>
                    )}
                </div>
            </section>

            <section className="section legal-content">
                {doc.sections.map((section) => (
                    <article key={section.title} className="legal-section">
                        <h2>{section.title}</h2>
                        {section.body.map((paragraph) => (
                            <p key={paragraph.slice(0, 56)}>{paragraph}</p>
                        ))}
                    </article>
                ))}
                <p className="legal-contact">
                    Questions?{" "}
                    <button type="button" className="legal-inline-link" onClick={() => onNavigate?.("contact")}>
                        Contact Cin Nova
                    </button>
                    {" · "}
                    <button type="button" className="legal-inline-link" onClick={() => onNavigate?.("privacy")}>
                        Privacy
                    </button>
                    {" · "}
                    <button type="button" className="legal-inline-link" onClick={() => onNavigate?.("terms")}>
                        Terms
                    </button>
                </p>
            </section>
        </main>
    );
}

export function AffiliateDisclosurePage(props) {
    return <LegalDocumentPage documentKey="affiliate-disclosure" {...props} />;
}
export function RefundPolicyPage(props) {
    return <LegalDocumentPage documentKey="refund-policy" {...props} />;
}
export function DigitalProductTermsPage(props) {
    return <LegalDocumentPage documentKey="digital-product-terms" {...props} />;
}
export function CookiePolicyPage(props) {
    return <LegalDocumentPage documentKey="cookie-policy" {...props} />;
}
export function DisclaimerPage(props) {
    return <LegalDocumentPage documentKey="disclaimer" {...props} />;
}
export function AccessibilityStatementPage(props) {
    return <LegalDocumentPage documentKey="accessibility" {...props} />;
}
export function DmcaPage(props) {
    return <LegalDocumentPage documentKey="dmca" {...props} />;
}
export function SponsorshipDisclosurePage(props) {
    return <LegalDocumentPage documentKey="sponsorship-disclosure" {...props} />;
}

export default LegalDocumentPage;
