import { useState } from "react";
import { downloadFreeGuide, freeGuideTitle } from "../data/freeGuide.js";
import { isValidEmail, normalizeEmailInput } from "../utils/security.js";
import "../App.css";

function GuideModal({ onSubscribe, onClose }) {
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
            source: "Free Guide Download",
            tags: ["Guide Download", "Free Resource"],
        });
        downloadFreeGuide();
        setDownloaded(true);
        setEmail("");
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-panel guide-modal-panel" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose} aria-label="Close">
                    ✕
                </button>

                {downloaded ? (
                    <div className="popup-success">
                        <div className="popup-success-icon">↓</div>
                        <h3>Downloading now!</h3>
                        <p>
                            Your copy of{" "}
                            <em style={{ color: "#e2e8f0" }}>"{freeGuideTitle}"</em> is on its
                            way. You're also subscribed to the Cin Nova newsletter.
                        </p>
                        <button className="primary-btn popup-submit-btn" onClick={onClose}>
                            Done
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="guide-modal-cover">
                            <span>CN</span>
                            <p>Free AI Guide</p>
                        </div>
                        <p className="eyebrow">FREE DOWNLOAD</p>
                        <h2>The Cin Nova AI Guide</h2>
                        <p className="popup-body">
                            A practical breakdown of five ways AI is changing education, home
                            safety, real estate, tech support, and early learning. Free — no
                            credit card needed.
                        </p>
                        <ul className="guide-chapters">
                            <li>AI in Education</li>
                            <li>AI in Home Safety</li>
                            <li>AI in Real Estate</li>
                            <li>AI in Tech Support</li>
                            <li>AI in Early Learning</li>
                        </ul>
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
                                Get the Free Guide →
                            </button>
                        </form>
                        {error && <p className="popup-fine-print">{error}</p>}
                        <p className="popup-fine-print">
                            Instant download. We'll also add you to the Cin Nova newsletter.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

export default GuideModal;
