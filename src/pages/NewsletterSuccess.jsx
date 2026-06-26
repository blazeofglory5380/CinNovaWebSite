import "../App.css";
import MarketingPhoto from "../components/MarketingPhoto.jsx";
import { newsletterSuccessPerks } from "../data/marketingImages.js";

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

                <div className="success-perks success-perks-photo">
                    {newsletterSuccessPerks.map((perk) => (
                        <div key={perk.title} className="success-perk success-perk-photo">
                            <div className="success-perk-photo-wrap">
                                <MarketingPhoto src={perk.image} alt={perk.alt} className="success-perk-photo-img" />
                            </div>
                            <strong>{perk.title}</strong>
                            <p>{perk.description}</p>
                        </div>
                    ))}
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
