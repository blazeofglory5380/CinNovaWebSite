import { useState } from "react";
import { isValidEmail, normalizeEmailInput } from "../utils/security.js";
import "../App.css";

function StickyNewsletterBar({ onSubscribe, onDismiss }) {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const [error, setError] = useState("");
    const [expanded, setExpanded] = useState(false);

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
        <div
            className={`sticky-newsletter-bar${expanded ? " sticky-bar-expanded" : ""}`}
            role="complementary"
            aria-label="Newsletter signup"
        >
            {subscribed ? (
                <>
                    <p className="sticky-bar-subscribed">
                        You're subscribed! Welcome to the CinNova newsletter.
                    </p>
                    <button className="sticky-bar-close" onClick={onDismiss} aria-label="Close">
                        ✕
                    </button>
                </>
            ) : (
                <>
                    {/* Collapsed pill — mobile only, tap to expand */}
                    <button
                        className="sticky-bar-collapsed-cta"
                        onClick={() => setExpanded(true)}
                        aria-label="Open newsletter signup"
                    >
                        <span className="sticky-bar-mark">CN</span>
                        <span>Join the newsletter →</span>
                    </button>

                    {/* Full form — always visible on desktop, visible when expanded on mobile */}
                    <div className="sticky-bar-full">
                        <div className="sticky-bar-brand">
                            <span className="sticky-bar-mark">CN</span>
                        </div>
                        <div className="sticky-bar-copy">
                            <strong>Join the CinNova newsletter</strong>
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
                    </div>

                    <button className="sticky-bar-close" onClick={onDismiss} aria-label="Dismiss">
                        ✕
                    </button>
                </>
            )}
        </div>
    );
}

export default StickyNewsletterBar;
