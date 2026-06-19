import { useState } from "react";
import { downloadFreeGuide, freeGuideTitle } from "../data/freeGuide.js";
import { isValidEmail, normalizeEmailInput } from "../utils/security.js";
import "../App.css";

function ExitIntentPopup({ onSubscribe, onClose }) {
    const [email, setEmail] = useState("");
    const [downloaded, setDownloaded] = useState(false);
    const [error, setError] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        const normalizedEmail = normalizeEmailInput(email);
        if (!isValidEmail(normalizedEmail)) {
            setError("Please enter a valid email address.");
            return;
        }
        onSubscribe({
            email: normalizedEmail,
            source: "Exit Intent Popup",
            tags: ["Exit Intent", "Guide Download"],
        });
        downloadFreeGuide();
        setDownloaded(true);
        setEmail("");
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-panel exit-popup-panel" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose} aria-label="Close">
                    ✕
                </button>

                {downloaded ? (
                    <div className="popup-success">
                        <div className="popup-success-icon">↓</div>
                        <h3>Your guide is downloading!</h3>
                        <p>
                            You're also subscribed to the Cin Nova newsletter. New articles and
                            product updates will land in your inbox.
                        </p>
                        <button className="primary-btn popup-submit-btn" onClick={onClose}>
                            Keep Reading
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="exit-popup-icon">📘</div>
                        <p className="eyebrow">FREE RESOURCE</p>
                        <h2>Wait — grab the free guide first.</h2>
                        <p className="popup-body">
                            Download{" "}
                            <em style={{ color: "#334155" }}>"{freeGuideTitle}"</em> — free, no
                            credit card, no catch. Plus we'll send new Cin Nova articles straight
                            to your inbox.
                        </p>
                        <div className="exit-guide-preview">
                            <div className="exit-guide-cover">
                                <span>CN</span>
                                <small>AI Guide</small>
                            </div>
                            <ul className="exit-guide-bullets">
                                <li>AI in Education</li>
                                <li>AI in Home Safety</li>
                                <li>AI in Real Estate</li>
                                <li>AI in Tech Support</li>
                                <li>AI in Early Learning</li>
                            </ul>
                        </div>
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
                                Download Free Guide
                            </button>
                        </form>
                        {error && <p className="popup-fine-print">{error}</p>}
                        <p className="popup-fine-print">
                            Free download. Subscribe to the newsletter at the same time.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

export default ExitIntentPopup;
