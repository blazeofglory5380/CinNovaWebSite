import { useState } from "react";
import "../App.css";

function ArticleCTA({ onSubscribe, subscriberCount }) {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        onSubscribe({ email, source: "Article CTA", tags: ["Article CTA", "In-Content"] });
        setSubscribed(true);
        setEmail("");
    }

    return (
        <div className="article-cta-block">
            <p className="article-cta-eyebrow">STAY IN THE LOOP</p>
            <h3>Enjoying this article?</h3>
            <p>
                Join{" "}
                <strong style={{ color: "#38bdf8" }}>
                    {subscriberCount.toLocaleString()}+ readers
                </strong>{" "}
                getting new Cin Nova articles and app updates straight to their inbox.
            </p>

            {subscribed ? (
                <p className="newsletter-success" style={{ maxWidth: 440, margin: "0 auto" }}>
                    You're subscribed! New articles will land in your inbox.
                </p>
            ) : (
                <form className="popup-form article-cta-form" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email address"
                        required
                    />
                    <button type="submit" className="primary-btn">
                        Subscribe Free
                    </button>
                </form>
            )}
        </div>
    );
}

export default ArticleCTA;
