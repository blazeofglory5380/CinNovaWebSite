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
    brandColors,
    brandTypography,
    buildAssetContent,
    downloadableAssets,
    logoUsageRules,
} from "../data/brandAssets.js";
import { downloadTextAsset } from "../utils/downloadTextAsset.js";
import { trackSponsorCtaClick } from "../utils/analytics.js";

const BRAND_ASSET_KEYS = ["brand-guidelines", "logo-spec"];
const BRAND_ASSETS = downloadableAssets.filter((asset) => BRAND_ASSET_KEYS.includes(asset.key));

const brandSchema = withSchemaGraph(
    {
        "@type": "WebPage",
        name: "Brand Assets & Usage Guidelines | Cin Nova",
        description:
            "Official Cin Nova logos, colour values, typography, clear-space rules, and the permitted and prohibited uses of the brand.",
        url: getPublicPageUrl("brand-assets"),
        publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
    },
    buildBreadcrumbSchema([
        { name: "Home", url: siteUrl },
        { name: "Brand Assets", url: getPublicPageUrl("brand-assets") },
    ]),
);

function BrandAssets({ onNavigate }) {
    function handleDownload(asset) {
        downloadTextAsset({
            filename: asset.filename,
            lines: buildAssetContent(asset.key),
            source: "brand-assets",
        });
    }

    function handleCta(cta, target) {
        trackSponsorCtaClick({ page: "brand-assets", cta, target });
        onNavigate?.(target);
    }

    return (
        <main className="product-page business-center-page">
            <SEO
                title="Brand Assets & Usage Guidelines | Cin Nova"
                description="Official Cin Nova logos, wordmarks, colour values, typography, and clear-space rules — with the permitted and prohibited uses spelled out for partners, press, and affiliates."
                url={getPublicPageUrl("brand-assets")}
                type="website"
                schema={brandSchema}
            />

            <BusinessHero
                eyebrow="BRAND ASSETS"
                title="Use the Cin Nova mark correctly, and you never have to ask permission."
                description="Everything on this page is cleared for use in articles, reviews, partner listings, and comparison content, provided the rules below are followed. Anything not covered here needs a written request."
                pills={["Logo and monogram", "Colour system", "Typography", "Usage rules"]}
                actions={[
                    { label: "Download brand guidelines", onClick: () => handleDownload(BRAND_ASSETS[0]) },
                    { label: "Press Kit", onClick: () => handleCta("Press Kit", "press-kit"), variant: "secondary" },
                ]}
            />

            <BusinessSection
                eyebrow="THE MARKS"
                title="Wordmark and monogram"
                description="Two marks, one system. Use the wordmark wherever it fits; fall back to the monogram only when horizontal space is genuinely constrained."
            >
                <div className="product-grid">
                    <article className="product-card">
                        <p className="product-category">Primary</p>
                        <h3>CinNova wordmark</h3>
                        <p>
                            The full name set in the heading stack at weight 700. Minimum width 96 pixels on
                            screen, 25 millimetres in print.
                        </p>
                    </article>
                    <article className="product-card">
                        <p className="product-category">Secondary</p>
                        <h3>CN monogram</h3>
                        <p>
                            A rounded square containing the letters CN. Minimum size 24 pixels. Never redraw or
                            re-letter the monogram.
                        </p>
                    </article>
                    <article className="product-card">
                        <p className="product-category">Spacing</p>
                        <h3>Clear space</h3>
                        <p>
                            Keep clear space on all four sides equal to the height of the letter N in the
                            wordmark. Nothing may enter that space.
                        </p>
                    </article>
                </div>
            </BusinessSection>

            <BusinessSection
                eyebrow="COLOUR"
                title="Colour system"
                description="Hex values as used across the site. Every foreground and background pairing in the brand meets a 4.5:1 contrast ratio for body text."
                className="showcase-section"
            >
                <div className="product-grid">
                    {brandColors.map((color) => (
                        <article className="product-card" key={color.hex}>
                            <span
                                aria-hidden="true"
                                style={{
                                    display: "block",
                                    height: "44px",
                                    borderRadius: "10px",
                                    border: "1px solid rgba(127,127,127,0.35)",
                                    background: color.hex,
                                    marginBottom: "0.75rem",
                                }}
                            />
                            <p className="product-category">{color.hex}</p>
                            <h3>{color.name}</h3>
                            <p>{color.usage}</p>
                        </article>
                    ))}
                </div>
            </BusinessSection>

            <BusinessSection
                eyebrow="TYPE"
                title="Typography"
                description="Cin Nova uses system font stacks so pages render immediately without a web-font download. There is no licensed brand typeface to distribute."
            >
                <div className="newsletter-card bc-list-card">
                    <ul className="partner-type-benefits">
                        {brandTypography.map((type) => (
                            <li key={type.role}>
                                <strong>{type.role}:</strong> {type.stack} — {type.note}
                            </li>
                        ))}
                    </ul>
                </div>
            </BusinessSection>

            <BusinessSection
                eyebrow="USAGE"
                title="What you may do"
                description="No written permission is needed for any of the following."
                className="showcase-section"
            >
                <div className="newsletter-card bc-list-card">
                    <ul className="partner-type-benefits">
                        {logoUsageRules.permitted.map((rule) => (
                            <li key={rule}>{rule}</li>
                        ))}
                    </ul>
                </div>
            </BusinessSection>

            <BusinessSection
                eyebrow="RESTRICTIONS"
                title="What you may not do"
                description="These uses are not permitted under any circumstances, including in partner and affiliate material."
            >
                <div className="newsletter-card bc-list-card">
                    <ul className="partner-type-benefits">
                        {logoUsageRules.prohibited.map((rule) => (
                            <li key={rule}>{rule}</li>
                        ))}
                    </ul>
                    <p>
                        Anything outside these lists needs written permission. Email{" "}
                        <a href={`mailto:${PRESS_CONTACT_EMAIL}`}>{PRESS_CONTACT_EMAIL}</a> describing the use,
                        where it will appear, and for how long.
                    </p>
                </div>
            </BusinessSection>

            <BusinessSection
                eyebrow="DOWNLOADS"
                title="Asset downloads"
                description="Generated from this page on click, so a file can never be out of date or missing. An SVG and PNG logo package is planned; the specification below defines the marks precisely in the meantime."
                className="showcase-section"
            >
                <div className="product-grid">
                    {BRAND_ASSETS.map((asset) => (
                        <article className="product-card" key={asset.key}>
                            <p className="product-category">{asset.format}</p>
                            <h3>{asset.title}</h3>
                            <p>{asset.description}</p>
                            <button type="button" className="secondary-btn" onClick={() => handleDownload(asset)}>
                                Download {asset.filename}
                            </button>
                        </article>
                    ))}
                </div>
            </BusinessSection>

            <BusinessCTABanner
                eyebrow="NEXT"
                title="Writing about Cin Nova?"
                description="The press kit has boilerplate you can paste, product one-liners with accurate development stages, and the short list of facts we will confirm."
                primaryLabel="Open the press kit"
                onPrimary={() => handleCta("Open the press kit", "press-kit")}
                secondaryLabel="Contact sales"
                onSecondary={() => handleCta("Contact sales", "contact-sales")}
            />
        </main>
    );
}

export default BrandAssets;
