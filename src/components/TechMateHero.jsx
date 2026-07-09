import { useEffect, useRef } from "react";
import "./TechMateHero.css";

/*
 * TechMateHero — cinematic global-network video hero for the CinNova website's
 * TechMate AI product spotlight. The approved clip
 * (public/videos/cinnova-techmate-ai-hero-global-network.mp4, 1920x1080 / 16:9)
 * is the dominant, full-bleed background. A small real-HTML text block sits in
 * the lower-left corner over a subtle localized scrim — no baked-in UI, fake
 * buttons, fake stats, or fake logos. The muted, looping background video
 * respects prefers-reduced-motion. Scoped under `.tmxr-hero`.
 */

const VIDEO_SRC = "/videos/cinnova-techmate-ai-hero-global-network.mp4";

function prefersReducedMotion() {
    return typeof window !== "undefined" && window.matchMedia
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;
}

function TechMateHero() {
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
        <section className="tmxr-hero">
            {/* Full-bleed cinematic video background (decorative) */}
            <div className="tmxr-media" aria-hidden="true">
                <video
                    ref={videoRef}
                    className="tmxr-video"
                    src={VIDEO_SRC}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    tabIndex={-1}
                />
                <div className="tmxr-scrim" />
            </div>

            {/* Minimal real-HTML corner text */}
            <div className="tmxr-corner">
                <p className="tmxr-eyebrow">
                    <span className="tmxr-eyebrow__dot" />
                    TechMate AI
                </p>
                <h1 className="tmxr-title">
                    Your AI-powered <span className="tmxr-title__grad">tech support</span> companion.
                </h1>
                <p className="tmxr-lede">
                    Diagnose device, network, and smart-home issues and get clear, step-by-step solutions.
                </p>
            </div>
        </section>
    );
}

export default TechMateHero;
