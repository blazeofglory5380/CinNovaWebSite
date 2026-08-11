import SEO from "../components/SEO.jsx";
import { getPublicPageUrl } from "../data/publicPageRoutes.js";
import { mediaKitAssets } from "../data/marketingImages.js";

/**
 * Brand assets hub — reuses Media Kit asset inventory; no fabricated logos.
 */
function BrandAssets({ onNavigate }) {
    const assets = Array.isArray(mediaKitAssets) ? mediaKitAssets : [];

    return (
        <main className="product-page business-center-page">
            <SEO
                title="Brand Assets | Cin Nova"
                description="Cin Nova brand assets for press and partners. Download guidelines and press materials from the media kit."
                url={getPublicPageUrl("brand-assets")}
                type="website"
            />

            <section className="section">
                <div className="section-heading">
                    <p className="eyebrow">BRAND</p>
                    <h1>Brand assets</h1>
                    <p>
                        Use approved Cin Nova materials only. For full specs and downloads, open the
                        Media Kit brand-assets section.
                    </p>
                    <div className="hero-actions" style={{ justifyContent: "center", marginTop: "24px" }}>
                        <button
                            type="button"
                            className="primary-btn"
                            style={{ minHeight: "44px" }}
                            onClick={() => onNavigate?.("media-kit")}
                        >
                            Open Media Kit
                        </button>
                        <button
                            type="button"
                            className="secondary-btn"
                            style={{ minHeight: "44px" }}
                            onClick={() => onNavigate?.("press-center")}
                        >
                            Press Center
                        </button>
                    </div>
                </div>

                {assets.length > 0 && (
                    <ul style={{ maxWidth: "640px", margin: "32px auto", listStyle: "disc" }}>
                        {assets.map((asset) => (
                            <li key={asset.id || asset.title || asset.label}>
                                {asset.title || asset.label || asset.name || "Brand asset"}
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}

export default BrandAssets;
