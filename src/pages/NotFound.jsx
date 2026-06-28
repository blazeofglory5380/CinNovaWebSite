import SEO from "../components/SEO.jsx";
import { siteUrl } from "../data/seoConfig.js";

function NotFound({ onGoHome }) {
    return (
        <main className="product-page not-found-page">
            <SEO
                title="Page Not Found | Cin Nova"
                description="The page you requested could not be found on Cin Nova."
                url={`${siteUrl}/404`}
                noindex
            />
            <section className="section" aria-labelledby="not-found-title">
                <p className="eyebrow">404</p>
                <h1 id="not-found-title">Page not found</h1>
                <p>The page you are looking for does not exist or may have moved.</p>
                <div className="article-actions">
                    <button type="button" onClick={onGoHome}>
                        Back to Home
                    </button>
                </div>
            </section>
        </main>
    );
}

export default NotFound;
