import { useState } from "react";
import { isValidEmail, normalizeEmailInput } from "../utils/security.js";

function HomepageCTABanner({ onSubscribe }) {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); // idle | loading | success | error

    function handleSubmit(e) {
        e.preventDefault();
        const normalizedEmail = normalizeEmailInput(email);
        if (!isValidEmail(normalizedEmail)) {
            setStatus("error");
            return;
        }
        setStatus("loading");
        onSubscribe?.({ email: normalizedEmail, source: "Homepage CTA Banner", tags: ["Homepage Banner"] });
        setStatus("success");
    }

    return (
        <section className="homepage-cta-banner">
            <div className="homepage-cta-inner">
                <div className="homepage-cta-copy">
                    <p className="homepage-cta-eyebrow">
                        <span className="homepage-cta-pulse" />
                        Cin Nova product updates
                    </p>
                    <h2 className="homepage-cta-headline">
                        Get Cin Nova updates before anyone else.
                    </h2>
                    <p className="homepage-cta-sub">
                        Product launches, free guides, behind-the-scenes builds, and early access —
                        straight to your inbox. No spam. Unsubscribe any time.
                    </p>
                    <ul className="homepage-cta-perks">
                        <li>Product launch announcements</li>
                        <li>Free guides and resource drops</li>
                        <li>Behind-the-scenes building updates</li>
                        <li>Early access to new features</li>
                    </ul>
                </div>

                <div className="homepage-cta-form-side">
                    {status === "success" ? (
                        <div className="homepage-cta-success">
                            <div className="homepage-cta-success-icon">✓</div>
                            <strong>You're in the loop.</strong>
                            <p>
                                Thanks for subscribing. Watch your inbox for the first Cin Nova
                                update.
                            </p>
                        </div>
                    ) : (
                        <form
                            className="homepage-cta-form"
                            onSubmit={handleSubmit}
                            noValidate
                        >
                            <p className="homepage-cta-form-label">
                                Join the Cin Nova newsletter
                            </p>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value.slice(0, 254));
                                    setStatus("idle");
                                }}
                                placeholder="your@email.com"
                                maxLength={254}
                                aria-label="Email address"
                            />
                            {status === "error" && (
                                <p className="homepage-cta-error">Please enter a valid email.</p>
                            )}
                            <button
                                type="submit"
                                className="homepage-cta-submit"
                                disabled={status === "loading"}
                            >
                                {status === "loading" ? "Subscribing…" : "Subscribe Free →"}
                            </button>
                            <p className="homepage-cta-disclaimer">
                                Free. No spam. Unsubscribe at any time.
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}

export default HomepageCTABanner;
