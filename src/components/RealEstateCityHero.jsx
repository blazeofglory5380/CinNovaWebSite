import { useEffect, useRef } from "react";
import "./RealEstateCityHero.css";

/*
 * RealEstateCityHero — cinematic investment-dashboard VIDEO hero for the CinNova
 * Real Estate AI product page. The approved clip
 * (public/videos/cinnova-real-estate-ai-blog-hero-investment-dashboard.mp4) is
 * the dominant, full-bleed background (object-fit: cover, full width/height —
 * never boxed). A subtle dark scrim localized to the lower-left keeps the real
 * HTML copy readable. No baked-in UI, fake buttons, fake stats, or fake logos —
 * the only text/CTAs are real HTML. Muted, looping, playsInline; respects
 * prefers-reduced-motion. Scoped under `.rex-hero`; `rex-`-prefixed classes.
 *
 * Usage:  <RealEstateCityHero primaryHref="#features" secondaryHref="#tools" />
 */

const VIDEO_SRC = "/videos/cinnova-real-estate-ai-blog-hero-investment-dashboard.mp4";

const PROOF = ["Market Signals", "Deal Scoring", "Investment Insights"];

function prefersReducedMotion() {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function RealEstateCityHero({
    primaryHref = "#",
    secondaryHref = "#",
    primaryLabel = "Explore Real Estate AI",
    secondaryLabel = "View Dashboard",
    onPrimaryClick,
}) {
    const primaryIsExternal = /^https?:\/\//.test(primaryHref);
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        // Honor reduced-motion: hold the first frame instead of looping.
        if (prefersReducedMotion()) {
            video.removeAttribute("autoplay");
            video.pause();
            return;
        }
        // Some browsers need an explicit play() after mount for muted autoplay.
        const played = video.play();
        if (played && typeof played.catch === "function") played.catch(() => {});
    }, []);

    return (
        <section className="rex-hero">
            {/* ── Full-bleed cinematic video background (decorative) ── */}
            <div className="rex-media" aria-hidden="true">
                <video
                    ref={videoRef}
                    className="rex-video"
                    src={VIDEO_SRC}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    tabIndex={-1}
                />
                {/* Legibility scrim: heaviest at the lower-left under the copy. */}
                <div className="rex-scrim" />
            </div>

            {/* ── Left: real HTML copy ── */}
            <div className="rex-inner">
                <div className="rex-copy">
                    <p className="rex-eyebrow">
                        <span className="rex-eyebrow__dot" />
                        CinNova Real Estate AI · Live Beta
                    </p>
                    <h1 className="rex-title">AI for Smarter Real Estate Decisions</h1>
                    <p className="rex-lede">
                        Analyze markets, compare neighborhoods, and uncover investment opportunities with
                        AI-powered real estate intelligence.
                    </p>
                    <div className="rex-actions">
                        <a
                            className="rex-btn rex-btn--primary"
                            href={primaryHref}
                            onClick={onPrimaryClick}
                            {...(primaryIsExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                            {primaryLabel}
                        </a>
                        <a className="rex-btn rex-btn--ghost" href={secondaryHref}>{secondaryLabel}</a>
                    </div>
                    <ul className="rex-proof">
                        {PROOF.map((p) => (
                            <li className="rex-proof__item" key={p}>
                                <span className="rex-proof__dot" />
                                {p}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}

export default RealEstateCityHero;
