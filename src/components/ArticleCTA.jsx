import { useState } from "react";
import "../App.css";
import { isValidEmail, normalizeEmailInput } from "../utils/security.js";

function ArticleCTA({ onSubscribe, subscriberCount }) {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const [error, setError] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        const normalizedEmail = normalizeEmailInput(email);
        if (!isValidEmail(normalizedEmail)) {
            setError("Please enter a valid email address.");
            return;
        }
        onSubscribe({ email: normalizedEmail, source: "Article CTA", tags: ["Article CTA", "In-Content"] });
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
                        onChange={(e) => {
                            setEmail(e.target.value.slice(0, 254));
                            setError("");
                        }}
                        placeholder="Your email address"
                        maxLength={254}
                        required
                    />
                    <button type="submit" className="primary-btn">
                        Subscribe Free
                    </button>
                    {error && <p className="newsletter-success">{error}</p>}
                </form>
            )}
        </div>
    );
}

export default ArticleCTA;
