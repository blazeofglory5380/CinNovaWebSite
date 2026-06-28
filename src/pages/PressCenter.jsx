import "../App.css";
import SEO from "../components/SEO.jsx";
import BusinessHero from "../components/business/BusinessHero.jsx";
import BusinessSection from "../components/business/BusinessSection.jsx";
import BusinessStats from "../components/business/BusinessStats.jsx";
import BusinessFAQ from "../components/business/BusinessFAQ.jsx";
import BusinessCTABanner from "../components/business/BusinessCTABanner.jsx";
import BusinessContactCard from "../components/business/BusinessContactCard.jsx";
import { businessAudienceStats, pressFaq, pressNewsItems } from "../data/businessCenter.js";
import { mediaKitAssets } from "../data/marketingImages.js";
import { siteUrl } from "../data/seoConfig.js";
import { buildFaqSchema, withSchemaGraph } from "../data/schemaHelpers.js";

const pressSchema = withSchemaGraph(
    {
        "@type": "WebPage",
        name: "Cin Nova Press Center",
        description:
            "Press resources, company news, media assets, and contact information for journalists covering Cin Nova.",
        url: `${siteUrl}/?page=press-center`,
        publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
    },
    buildFaqSchema(pressFaq),
);

function downloadPressAsset(assetType) {
    const assets = {
        presspack: {
            filename: "cin-nova-press-pack.txt",
            content: [
                "CIN NOVA PRESS PACK",
                "===================",
                "",
                "COMPANY OVERVIEW",
                "Cin Nova is a multi-product AI software company building practical tools",
                "for education, household safety, tech support, early learning, and real estate.",
                "",
                `Website: ${siteUrl}`,
                "Email: thin_line_99@yahoo.com",
                "",
                "© 2026 Cin Nova. All Rights Reserved.",
            ].join("\n"),
        },
    };

    const asset = assets[assetType];
    if (!asset) return;
    const blob = new Blob([asset.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = asset.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function PressCenter({ onNavigate }) {
    return (
        <main className="product-page business-center-page media-kit-page">
            <SEO
                title="Press Center | Cin Nova"
                description="Press resources, company updates, media assets, and journalist contact information for Cin Nova."
                url={`${siteUrl}/?page=press-center`}
                type="website"
                schema={pressSchema}
            />

            <BusinessHero
                eyebrow="PRESS CENTER"
                title="News, assets, and media resources for Cin Nova."
                description="Journalists, podcast hosts, and creators can find company background, product context, downloadable assets, and contact paths for interviews and fact-checking."
                pills={["Company overview", "Product ecosystem", "Media assets", "Interview requests"]}
                actions={[
                    { label: "Download Press Pack", onClick: () => downloadPressAsset("presspack") },
                    { label: "View Media Kit", onClick: () => onNavigate?.("media-kit"), variant: "secondary" },
                    { label: "Contact Media Team", onClick: () => onNavigate?.("contact"), variant: "secondary" },
                ]}
            />

            <BusinessSection
                eyebrow="AUDIENCE SNAPSHOT"
                title="Cin Nova at a glance"
                description="Key metrics for press and partner planning. Placeholder values are labeled until verified reporting is available."
            >
                <BusinessStats
                    stats={businessAudienceStats}
                    note="Metrics marked “Placeholder metric” will be updated with verified analytics."
                    titleId="press-stats-title"
                />
            </BusinessSection>

            <BusinessSection
                eyebrow="COMPANY NEWS"
                title="Updates and announcements"
                description="Official company and product updates. Placeholder entries reflect the current public roadmap until formal press releases are published."
            >
                <div className="bc-news-grid">
                    {pressNewsItems.map((item) => (
                        <article key={item.title} className="bc-news-card">
                            <div className="bc-news-meta">
                                <span>{item.date}</span>
                                <span>{item.category}</span>
                                {item.placeholder && <span className="bc-stat-placeholder">Placeholder</span>}
                            </div>
                            <h3>{item.title}</h3>
                            <p>{item.summary}</p>
                        </article>
                    ))}
                </div>
            </BusinessSection>

            <BusinessSection
                eyebrow="MEDIA ASSETS"
                title="Downloads for press and partners"
                description="Use the Media Kit for full placement specs. These assets cover the essentials for articles, podcasts, and event listings."
            >
                <div className="bc-assets-grid">
                    {mediaKitAssets.map((asset) => (
                        <article key={asset.key} className="bc-asset-card">
                            <strong>{asset.title}</strong>
                            <p>{asset.description}</p>
                            <button
                                type="button"
                                className="secondary-btn"
                                onClick={() => onNavigate?.("media-kit")}
                            >
                                Open in Media Kit →
                            </button>
                        </article>
                    ))}
                </div>
            </BusinessSection>

            <BusinessSection
                eyebrow="MEDIA CONTACT"
                title="Request interviews, quotes, or fact-checking"
                description="Include your outlet, deadline, and story angle so the team can respond quickly."
            >
                <div className="bc-contact-grid">
                    <BusinessContactCard
                        title="Press & media inquiries"
                        description="For interviews, product background, founder quotes, and fact-checking on Cin Nova products or content."
                        topics={[
                            "Product launches and roadmap context",
                            "AI safety and education commentary",
                            "Company background and founder story",
                            "Asset requests and brand usage questions",
                        ]}
                        ctaLabel="Contact media team"
                        onCta={() => onNavigate?.("contact")}
                    />
                    <BusinessContactCard
                        title="Partnerships & advertising"
                        description="For sponsorships, co-marketing, and partnership proposals — see dedicated business pages for details."
                        topics={[
                            "Newsletter and website sponsorships",
                            "Technology and education partnerships",
                            "Affiliate and contributor programs",
                        ]}
                        ctaLabel="View partnerships"
                        onCta={() => onNavigate?.("partnerships")}
                    />
                </div>
            </BusinessSection>

            <BusinessSection eyebrow="FAQ" title="Press FAQ">
                <BusinessFAQ items={pressFaq} title="Press frequently asked questions" />
            </BusinessSection>

            <BusinessCTABanner
                eyebrow="NEXT STEP"
                title="Need full audience and placement details?"
                description="The Cin Nova Media Kit includes audience segments, ad formats, technical specs, and brand guidelines."
                primaryLabel="Open Media Kit"
                onPrimary={() => onNavigate?.("media-kit")}
                secondaryLabel="About Cin Nova"
                onSecondary={() => onNavigate?.("about")}
            />
        </main>
    );
}

export default PressCenter;
