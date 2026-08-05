import "../App.css";
import SEO from "../components/SEO.jsx";
import BusinessHero from "../components/business/BusinessHero.jsx";
import BusinessSection from "../components/business/BusinessSection.jsx";
import BusinessCTABanner from "../components/business/BusinessCTABanner.jsx";
import { getPublicPageUrl } from "../data/publicPageRoutes.js";
import { siteUrl } from "../data/seoConfig.js";
import { buildBreadcrumbSchema, withSchemaGraph } from "../data/schemaHelpers.js";
import {
    ARCHIVE_STATUS,
    NEWSLETTER_CATEGORIES,
    WELCOME_SEQUENCE,
    newsletterArchive,
} from "../data/newsletterProgram.js";
import { trackEvent } from "../utils/analytics.js";

const archiveSchema = withSchemaGraph(
    {
        "@type": "CollectionPage",
        name: "Newsletter Archive | Cin Nova",
        description:
            "Past editions of the Cin Nova newsletter, plus what each edition covers and how often it is sent.",
        url: getPublicPageUrl("newsletter-archive"),
        publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
        hasPart: newsletterArchive.map((issue) => ({
            "@type": "Article",
            headline: issue.subject,
            url: `${siteUrl}/newsletter/archive`,
            datePublished: issue.sentAt,
        })),
    },
    buildBreadcrumbSchema([
        { name: "Home", url: siteUrl },
        { name: "Newsletter", url: `${siteUrl}/newsletter` },
        { name: "Archive", url: getPublicPageUrl("newsletter-archive") },
    ]),
);

function NewsletterArchive({ onNavigate }) {
    function go(target, cta) {
        trackEvent("newsletter_archive_cta", { cta, target });
        onNavigate?.(target);
    }

    return (
        <main className="product-page business-center-page">
            <SEO
                title="Newsletter Archive | Cin Nova"
                description="Every past edition of the Cin Nova newsletter, kept as a permanent linkable page — plus what each edition covers and how often it is sent, so you know before you subscribe."
                url={getPublicPageUrl("newsletter-archive")}
                type="website"
                schema={archiveSchema}
            />

            <BusinessHero
                eyebrow="NEWSLETTER ARCHIVE"
                title="Read what you would have received, before you hand over an email address."
                description="Every edition is archived here permanently as a linkable page. Nothing is paywalled after the fact, and nothing sent to subscribers is later hidden behind a signup."
                pills={["Permanent archive", "No paywall", "Six editions", "Unsubscribe in one click"]}
                actions={[
                    { label: "Subscribe", onClick: () => go("newsletter", "Subscribe") },
                    { label: "Choose your editions", onClick: () => go("newsletter-preferences", "Preferences"), variant: "secondary" },
                ]}
            />

            <BusinessSection eyebrow="PAST ISSUES" title="Archive">
                {newsletterArchive.length === 0 ? (
                    <div className="newsletter-card bc-list-card">
                        <h3>No issues yet</h3>
                        <p>{ARCHIVE_STATUS.note}</p>
                        <p>
                            There are no sample issues on this page on purpose. Publishing invented back issues
                            to make an archive look established would be the same category of dishonesty as
                            publishing an invented subscriber count.
                        </p>
                        <button type="button" className="secondary-btn" onClick={() => go("newsletter", "Empty state subscribe")}>
                            Be on the list for the first edition
                        </button>
                    </div>
                ) : (
                    <div className="product-grid">
                        {newsletterArchive.map((issue) => (
                            <article className="product-card" key={issue.slug}>
                                <p className="product-category">{issue.sentAt}</p>
                                <h3>{issue.subject}</h3>
                                <p>{issue.summary}</p>
                            </article>
                        ))}
                    </div>
                )}
            </BusinessSection>

            <BusinessSection
                eyebrow="WHAT YOU GET"
                title="The six editions"
                description="Each edition is subscribed to separately. Turning one on does not sign you up for the others."
                className="showcase-section"
            >
                <div className="product-grid">
                    {NEWSLETTER_CATEGORIES.map((category) => (
                        <article className="product-card" key={category.key}>
                            <p className="product-category">{category.cadence}</p>
                            <h3>{category.label}</h3>
                            <p>{category.blurb}</p>
                            <ul className="partner-type-benefits">
                                {category.contains.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </BusinessSection>

            <BusinessSection
                eyebrow="AFTER YOU SUBSCRIBE"
                title="The welcome sequence, in full"
                description="Five emails over two weeks, published here so there are no surprises. After that you only receive the editions you selected."
            >
                <div className="showcase-grid">
                    {WELCOME_SEQUENCE.map((step) => (
                        <div className="showcase-card" key={step.step}>
                            <h3>
                                {step.timing}: {step.subject}
                            </h3>
                            <p>{step.purpose}</p>
                            <ul className="partner-type-benefits">
                                {step.contains.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </BusinessSection>

            <BusinessCTABanner
                eyebrow="CONTROL"
                title="Change or leave at any time"
                description="Pick individual editions, cap delivery to a monthly digest, switch to tracking-free plain text, or request deletion of your record entirely."
                primaryLabel="Email preferences"
                onPrimary={() => go("newsletter-preferences", "Preferences banner")}
                secondaryLabel="Privacy policy"
                onSecondary={() => go("privacy", "Privacy banner")}
            />
        </main>
    );
}

export default NewsletterArchive;
