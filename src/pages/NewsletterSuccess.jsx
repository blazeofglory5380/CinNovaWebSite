import "../App.css";

function NewsletterSuccess({ onGoHome, onGoBlog }) {
    return (
        <main className="product-page newsletter-success-page">
            <section className="section newsletter-success-section">
                <div className="success-checkmark-wrap">
                    <div className="success-checkmark-icon">✓</div>
                </div>

                <p className="eyebrow">SUBSCRIBED</p>
                <h1>You're in the loop.</h1>
                <p className="newsletter-success-tagline">
                    You're now subscribed to the Cin Nova newsletter. New articles, product
                    updates, and launch announcements will land in your inbox.
                </p>

                <div className="success-perks">
                    <div className="success-perk">
                        <span className="success-perk-icon">📬</span>
                        <strong>Fresh Articles</strong>
                        <p>AI, education, real estate, safety, and product updates.</p>
                    </div>
                    <div className="success-perk">
                        <span className="success-perk-icon">🚀</span>
                        <strong>Launch Previews</strong>
                        <p>Early access to new Cin Nova products before public launch.</p>
                    </div>
                    <div className="success-perk">
                        <span className="success-perk-icon">💡</span>
                        <strong>Insider Updates</strong>
                        <p>Behind-the-scenes progress on StudyNest, PoisonGuard, and more.</p>
                    </div>
                </div>

                <div className="success-actions">
                    <button className="primary-btn" onClick={onGoBlog}>
                        Browse Articles
                    </button>
                    <button className="secondary-btn" onClick={onGoHome}>
                        Back to Home
                    </button>
                </div>
            </section>
        </main>
    );
}

export default NewsletterSuccess;
