import { useState } from "react";
import { isValidEmail, normalizeEmailInput } from "../utils/security.js";
import "../App.css";

function StickyNewsletterBar({ onSubscribe, onDismiss }) {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const [error, setError] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        const normalizedEmail = normalizeEmailInput(email);
        if (!isValidEmail(normalizedEmail)) {
            setError("Enter a valid email.");
            return;
        }
        onSubscribe({ email: normalizedEmail, source: "Sticky Bar", tags: ["Sticky Bar"] });
        setSubscribed(true);
        setEmail("");
    }

    return (
        <div className="sticky-newsletter-bar" role="complementary" aria-label="Newsletter signup">
            {subscribed ? (
                <>
                    <p className="sticky-bar-subscribed">
                        You're subscribed! Welcome to the Cin Nova newsletter.
                    </p>
                    <button className="sticky-bar-close" onClick={onDismiss} aria-label="Close">
                        ✕
                    </button>
                </>
            ) : (
                <>
                    <div className="sticky-bar-brand">
                        <span className="sticky-bar-mark">CN</span>
                    </div>
                    <div className="sticky-bar-copy">
                        <strong>Join the Cin Nova newsletter</strong>
                        <span>Get AI, education, real estate, and app updates.</span>
                    </div>
                    <form className="sticky-bar-form" onSubmit={handleSubmit}>
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
                            aria-label="Email address"
                        />
                        <button type="submit" className="primary-btn sticky-bar-btn">
                            Subscribe
                        </button>
                    </form>
                    {error && <span className="form-error">{error}</span>}
                    <button className="sticky-bar-close" onClick={onDismiss} aria-label="Dismiss">
                        ✕
                    </button>
                </>
            )}
        </div>
    );
}

export default StickyNewsletterBar;
