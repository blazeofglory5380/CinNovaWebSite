import { useEffect, useState } from "react";
import { isValidEmail, normalizeEmailInput, safeGetSessionFlag, safeSetSessionFlag } from "../utils/security.js";

const SESSION_KEY = "cn_float_btn_dismissed";
const SCROLL_SHOW_RATIO = 0.6;

function FloatingNewsletterButton({ onSubscribe, newsletterAnchorId = "newsletter" }) {
    const [dismissed] = useState(() => safeGetSessionFlag(SESSION_KEY));
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); // idle | loading | success | error
    const [pastScrollThreshold, setPastScrollThreshold] = useState(false);
    const [newsletterInView, setNewsletterInView] = useState(false);

    useEffect(() => {
        function updateScrollThreshold() {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const ratio = docHeight > 0 ? window.scrollY / docHeight : 0;
            setPastScrollThreshold(ratio >= SCROLL_SHOW_RATIO);
        }

        updateScrollThreshold();
        window.addEventListener("scroll", updateScrollThreshold, { passive: true });
        return () => window.removeEventListener("scroll", updateScrollThreshold);
    }, []);

    useEffect(() => {
        const newsletterSection = document.getElementById(newsletterAnchorId);
        if (!newsletterSection) return undefined;

        const observer = new IntersectionObserver(
            ([entry]) => setNewsletterInView(entry.isIntersecting),
            { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
        );

        observer.observe(newsletterSection);
        return () => observer.disconnect();
    }, [newsletterAnchorId]);

    if (dismissed) return null;

    const showWidget = pastScrollThreshold && !newsletterInView;

    function handleDismiss() {
        safeSetSessionFlag(SESSION_KEY);
        setOpen(false);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const normalizedEmail = normalizeEmailInput(email);
        if (!isValidEmail(normalizedEmail)) {
            setStatus("error");
            return;
        }
        setStatus("loading");
        onSubscribe?.({ email: normalizedEmail, source: "Floating Button", tags: ["Float Button"] });
        setStatus("success");
        setTimeout(() => {
            safeSetSessionFlag(SESSION_KEY);
            setOpen(false);
        }, 2200);
    }

    return (
        <div
            className={`float-nl-wrap${showWidget ? "" : " float-nl-wrap--hidden"}`}
            aria-live="polite"
            aria-hidden={!showWidget}
        >
            {open && (
                <div className="float-nl-modal" role="dialog" aria-label="Newsletter signup">
                    <button
                        className="float-nl-close"
                        onClick={() => setOpen(false)}
                        aria-label="Close"
                    >
                        ×
                    </button>
                    {status === "success" ? (
                        <div className="float-nl-success">
                            <span className="float-nl-success-icon">✓</span>
                            <strong>You're in!</strong>
                            <p>Welcome to the Cin Nova newsletter.</p>
                        </div>
                    ) : (
                        <>
                            <p className="float-nl-eyebrow">CIN NOVA NEWSLETTER</p>
                            <strong className="float-nl-headline">
                                Get product updates and free guides.
                            </strong>
                            <p className="float-nl-sub">Fresh product updates, guides, and launch notes.</p>
                            <form onSubmit={handleSubmit} className="float-nl-form">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value.slice(0, 254));
                                        setStatus("idle");
                                    }}
                                    placeholder="you@example.com"
                                    maxLength={254}
                                    aria-label="Email address"
                                    autoFocus
                                />
                                {status === "error" && (
                                    <p className="float-nl-error">Enter a valid email.</p>
                                )}
                                <button type="submit" disabled={status === "loading"}>
                                    {status === "loading" ? "Subscribing…" : "Subscribe →"}
                                </button>
                            </form>
                            <button className="float-nl-dismiss" onClick={handleDismiss}>
                                No thanks
                            </button>
                        </>
                    )}
                </div>
            )}

            <button
                className={`float-nl-btn${open ? " float-nl-btn-open" : ""}`}
                onClick={() => setOpen((prev) => !prev)}
                aria-label="Open newsletter signup"
                aria-expanded={open}
                tabIndex={showWidget ? 0 : -1}
            >
                <span className="float-nl-icon">NL</span>
                <span className="float-nl-label">Newsletter</span>
            </button>
        </div>
    );
}

export default FloatingNewsletterButton;
