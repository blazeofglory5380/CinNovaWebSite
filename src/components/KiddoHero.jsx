import { useEffect, useRef } from "react";
import "./KiddoHero.css";

/*
 * KiddoHero — cinematic whimsical-treehouse-library video hero for the CinNova
 * website's Kiddo product spotlight. The approved clip
 * (public/videos/cinnova-kiddo-ai-blog-hero-whimsical-treehouse-library.mp4,
 * 1920x1080 / 16:9) is the dominant, full-bleed background. A small real-HTML
 * text block sits in the lower-left corner over a subtle localized scrim — no
 * baked-in UI, fake buttons, fake stats, or fake logos. The muted, looping
 * background video respects prefers-reduced-motion. Scoped under `.kiddo-hero`.
 */

const VIDEO_SRC = "/videos/cinnova-kiddo-ai-blog-hero-whimsical-treehouse-library.mp4";

function prefersReducedMotion() {
    return typeof window !== "undefined" && window.matchMedia
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;
}

function KiddoHero() {
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
        <section className="kiddo-hero" aria-labelledby="kiddo-hero-title">
            {/* Full-bleed cinematic video background (decorative) */}
            <div className="kh-media" aria-hidden="true">
                <video
                    ref={videoRef}
                    className="kh-video"
                    src={VIDEO_SRC}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    tabIndex={-1}
                />
                <div className="kh-scrim" />
            </div>

            {/* Minimal real-HTML corner text */}
            <div className="kh-corner">
                <p className="kh-eyebrow">
                    <span className="kh-eyebrow__dot" />
                    Cin Nova · Kiddo
                </p>
                <h1 id="kiddo-hero-title" className="kh-title">
                    Kiddo: A <span className="kh-title__accent">Safer AI Companion</span> for Families
                </h1>
                <p className="kh-lede">
                    A guided AI experience for learning, creativity, stories, and family-safe exploration.
                </p>
            </div>
        </section>
    );
}

export default KiddoHero;
