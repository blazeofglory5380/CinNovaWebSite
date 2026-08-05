import "../App.css";
import SEO from "../components/SEO.jsx";
import BusinessHero from "../components/business/BusinessHero.jsx";
import BusinessSection from "../components/business/BusinessSection.jsx";
import BusinessCTABanner from "../components/business/BusinessCTABanner.jsx";
import { getPublicPageUrl } from "../data/publicPageRoutes.js";
import { siteUrl } from "../data/seoConfig.js";
import { withSchemaGraph, buildBreadcrumbSchema } from "../data/schemaHelpers.js";
import {
    PRESS_CONTACT_EMAIL,
    buildAssetContent,
    companyBoilerplate,
    downloadableAssets,
    pressFacts,
    productOneLiners,
} from "../data/brandAssets.js";
import { downloadTextAsset } from "../utils/downloadTextAsset.js";
import { trackSponsorCtaClick } from "../utils/analytics.js";

const PRESS_KIT_ASSETS = downloadableAssets.filter((asset) =>
    ["press-kit", "product-summary", "brand-guidelines"].includes(asset.key),
);

const pressKitSchema = withSchemaGraph(
    {
        "@type": "WebPage",
        name: "Press Kit | Cin Nova",
        description:
            "Company boilerplate, product one-liners, approved facts, downloadable press assets, and journalist contact details for Cin Nova.",
        url: getPublicPageUrl("press-kit"),
        publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
    },
    buildBreadcrumbSchema([
        { name: "Home", url: siteUrl },
        { name: "Press Kit", url: getPublicPageUrl("press-kit") },
    ]),
);

function PressKit({ onNavigate }) {
    function handleDownload(asset) {
        downloadTextAsset({
            filename: asset.filename,
            lines: buildAssetContent(asset.key),
            source: "press-kit",
        });
    }

    function handleCta(cta, target) {
        trackSponsorCtaClick({ page: "press-kit", cta, target });
        onNavigate?.(target);
    }

    return (
        <main className="product-page business-center-page">
            <SEO
                title="Press Kit | Cin Nova"
                description="Download the Cin Nova press kit: company boilerplate, product one-liners, founder background, approved facts, logo files, and journalist contact details for accurate reporting."
                url={getPublicPageUrl("press-kit")}
                type="website"
                schema={pressKitSchema}
            />

            <BusinessHero
                eyebrow="PRESS KIT"
                title="Everything a journalist needs to write about Cin Nova accurately."
                description="Boilerplate you can paste, product descriptions that match reality, and a short list of facts we will confirm. Everything below may be quoted without checking back."
                pills={["Boilerplate", "Product one-liners", "Approved facts", "Downloadable assets"]}
                actions={[
                    { label: "Download the press kit", onClick: () => handleDownload(PRESS_KIT_ASSETS[0]) },
                    { label: "Brand assets", onClick: () => handleCta("Brand assets", "brand-assets"), variant: "secondary" },
                ]}
            />

            <BusinessSection
                eyebrow="BOILERPLATE"
                title="Company description"
                description="Two lengths, both approved for publication as written."
            >
                <div className="newsletter-card bc-list-card">
                    <h3>Short (one sentence)</h3>
                    <p>{companyBoilerplate.short}</p>
                    <h3>Long (one paragraph)</h3>
                    <p>{companyBoilerplate.long}</p>
                </div>
            </BusinessSection>

            <BusinessSection
                eyebrow="PRODUCTS"
                title="Product one-liners and current stage"
                description="Development stage is stated for each product. No Cin Nova product is a general-availability commercial release, and none should be described as one."
                className="showcase-section"
            >
                <div className="product-grid">
                    {productOneLiners.map((product) => (
                        <article className="product-card" key={product.name}>
                            <p className="product-category">{product.stage}</p>
                            <h3>{product.name}</h3>
                            <p>{product.line}</p>
                        </article>
                    ))}
                </div>
            </BusinessSection>

            <BusinessSection
                eyebrow="APPROVED FACTS"
                title="What we will confirm"
                description="These are accurate as published and may be quoted directly."
            >
                <div className="newsletter-card bc-list-card">
                    <ul className="partner-type-benefits">
                        {pressFacts.map((fact) => (
                            <li key={fact.label}>
                                <strong>{fact.label}:</strong> {fact.value}
                            </li>
                        ))}
                    </ul>
                </div>
            </BusinessSection>

            <BusinessSection
                eyebrow="WHAT WE WILL NOT CONFIRM"
                title="Numbers we do not publish"
                description="Cin Nova publishes no audience or revenue metric it cannot verify, and will not supply an unverified figure for publication."
                className="showcase-section"
            >
                <div className="newsletter-card bc-list-card">
                    <ul className="partner-type-benefits">
                        <li>Revenue, funding, or valuation figures</li>
                        <li>User, subscriber, or download counts</li>
                        <li>Traffic or pageview statistics</li>
                        <li>Launch dates that have not been publicly committed to</li>
                    </ul>
                    <p>
                        If a story needs a number we have not published, say so in the enquiry and we will tell
                        you plainly whether it exists and whether it can be shared.
                    </p>
                </div>
            </BusinessSection>

            <BusinessSection
                eyebrow="DOWNLOADS"
                title="Downloadable press assets"
                description="Each file is generated from this page when you click, so it always matches what you are reading. Binary PDF and logo packages are planned; the text versions below are complete today."
            >
                <div className="product-grid">
                    {PRESS_KIT_ASSETS.map((asset) => (
                        <article className="product-card" key={asset.key}>
                            <p className="product-category">{asset.format}</p>
                            <h3>{asset.title}</h3>
                            <p>{asset.description}</p>
                            <button
                                type="button"
                                className="secondary-btn"
                                onClick={() => handleDownload(asset)}
                            >
                                Download {asset.filename}
                            </button>
                        </article>
                    ))}
                </div>
            </BusinessSection>

            <BusinessSection eyebrow="CONTACT" title="Media enquiries">
                <div className="newsletter-card bc-list-card">
                    <p>
                        Email <a href={`mailto:${PRESS_CONTACT_EMAIL}`}>{PRESS_CONTACT_EMAIL}</a> with your
                        outlet, the story angle, what you need from us, and your deadline. Include any embargo.
                    </p>
                    <p>
                        Interview and quote requests are answered by a person, usually within five business
                        days. Same-day deadlines should be flagged in the subject line.
                    </p>
                </div>
            </BusinessSection>

            <BusinessCTABanner
                eyebrow="MORE FOR PARTNERS"
                title="Looking for logos, colours, and usage rules?"
                description="The brand assets page covers the wordmark, the monogram, colour values, typography, clear space, and the specific uses that are and are not permitted."
                primaryLabel="Brand assets"
                onPrimary={() => handleCta("Brand assets", "brand-assets")}
                secondaryLabel="Press Center"
                onSecondary={() => handleCta("Press Center", "press-center")}
            />
        </main>
    );
}

export default PressKit;
