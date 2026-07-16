import SEO from "../components/SEO.jsx";

function NotFound({ onGoHome }) {
    return (
        <main className="product-page not-found-page">
            {/* Error page: noindex,follow and NO canonical (never /404, never the
                invalid requested URL). `noCanonical` also strips any canonical the
                previous route left in the head after client-side navigation. The
                invalid URL is intentionally left unchanged in the address bar. */}
            <SEO
                title="Page Not Found | CinNova"
                description="The page you requested could not be found on CinNova. It may have moved or never existed."
                noindex
                noCanonical
            />
            <section className="section" aria-labelledby="not-found-title">
                <p className="eyebrow">404</p>
                <h1 id="not-found-title">Page not found</h1>
                <p>The page you are looking for does not exist or may have moved.</p>
                <div className="article-actions">
                    <button type="button" className="primary-btn" onClick={onGoHome}>
                        Back to Home
                    </button>
                </div>
            </section>
        </main>
    );
}

export default NotFound;
