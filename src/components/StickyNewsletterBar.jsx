import { useState } from "react";
import "../App.css";

function StickyNewsletterBar({ onSubscribe, onDismiss, subscriberCount }) {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        onSubscribe({ email, source: "Sticky Bar", tags: ["Sticky Bar"] });
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
                        <strong>Join {subscriberCount.toLocaleString()}+ readers</strong>
                        <span>Get AI, education, real estate, and app updates.</span>
                    </div>
                    <form className="sticky-bar-form" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your email address"
                            required
                            aria-label="Email address"
                        />
                        <button type="submit" className="primary-btn sticky-bar-btn">
                            Subscribe
                        </button>
                    </form>
                    <button className="sticky-bar-close" onClick={onDismiss} aria-label="Dismiss">
                        ✕
                    </button>
                </>
            )}
        </div>
    );
}

export default StickyNewsletterBar;
