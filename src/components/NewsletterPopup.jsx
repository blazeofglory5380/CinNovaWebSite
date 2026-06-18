import { useState } from "react";
import { isValidEmail, normalizeEmailInput } from "../utils/security.js";
import "../App.css";

function NewsletterPopup({ onSubscribe, onClose, subscriberCount }) {
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
        onSubscribe({ email: normalizedEmail, source: "Newsletter Popup", tags: ["Popup Signup"] });
        setSubscribed(true);
        setEmail("");
        setTimeout(onClose, 2400);
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose} aria-label="Close">
                    ✕
                </button>

                {subscribed ? (
                    <div className="popup-success">
                        <div className="popup-success-icon">✓</div>
                        <h3>You're in!</h3>
                        <p>
                            Welcome to the Cin Nova newsletter. Great articles and product updates
                            are on their way.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="popup-brand-mark">CN</div>
                        <p className="eyebrow">CIN NOVA NEWSLETTER</p>
                        <h2>Build smarter with AI.</h2>
                        <p className="popup-body">
                            Join{" "}
                            <strong style={{ color: "#38bdf8" }}>
                                {subscriberCount.toLocaleString()}+ readers
                            </strong>{" "}
                            getting practical articles on AI, education, real estate, family
                            safety, and the Cin Nova product ecosystem.
                        </p>
                        <form className="popup-form" onSubmit={handleSubmit}>
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
                                autoFocus
                            />
                            <button type="submit" className="primary-btn popup-submit-btn">
                                Subscribe Free
                            </button>
                        </form>
                        {error && <p className="popup-fine-print">{error}</p>}
                        <p className="popup-fine-print">No spam. Unsubscribe any time.</p>
                    </>
                )}
            </div>
        </div>
    );
}

export default NewsletterPopup;
