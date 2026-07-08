import { useEffect, useRef } from "react";
import "./StudyNestHero.css";

/*
 * StudyNestHero — cinematic campus-library video hero for the CinNova website's
 * StudyNest product spotlight. The approved clip
 * (public/videos/cinnova-studynest-campus-library-hero.mp4, 1920x1080 / 16:9)
 * is the dominant, full-bleed background. A small real-HTML text block sits in
 * the lower-left corner over a subtle dark/teal scrim — no baked-in UI, fake
 * buttons, fake stats, or fake logos. The muted, looping background video
 * respects prefers-reduced-motion. Scoped under `.studynest-hero-animation`.
 *
 * headingLevel: "h1" when this is the page's main heading (StudyNest page),
 * "h2" when used as a secondary spotlight. Extra props are ignored.
 */

const VIDEO_SRC = "/videos/cinnova-studynest-campus-library-hero.mp4";

function prefersReducedMotion() {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function StudyNestHero({ headingLevel = "h2" }) {
    const Heading = headingLevel;
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
        <section className="studynest-hero-animation">
            {/* Full-bleed cinematic video background (decorative) */}
            <div className="snh-media" aria-hidden="true">
                <video
                    ref={videoRef}
                    className="snh-video"
                    src={VIDEO_SRC}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    tabIndex={-1}
                />
                <div className="snh-scrim" />
            </div>

            {/* Minimal real-HTML corner text */}
            <div className="snh-corner">
                <p className="snh-eyebrow">
                    <span className="snh-eyebrow__dot" />
                    <span className="snh-eyebrow__text">CinNova Blog · Product Spotlight</span>
                </p>
                <Heading className="snh-title">
                    StudyNest: Where <span className="snh-title__accent">Learning Evolves</span>
                </Heading>
                <p className="snh-lede">
                    An AI-powered study companion that turns notes, books, and lessons into
                    personalized learning paths.
                </p>
            </div>
        </section>
    );
}

export default StudyNestHero;
