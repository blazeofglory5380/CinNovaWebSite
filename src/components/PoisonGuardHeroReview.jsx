import { useEffect, useRef } from "react";
import "./PoisonGuardHeroReview.css";

/*
 * PoisonGuardHeroReview — cinematic video-background PoisonGuard hero.
 *
 * The approved cinematic clip
 * (public/videos/cinnova-poisonguard-blog-hero.mp4, 1280x720 / 16:9) is the
 * dominant, full-bleed background. A soft dark gradient scrim — heaviest at the
 * lower-left where the copy sits, light everywhere else — keeps the video the
 * dominant visual while making the overlaid text readable. `object-fit: cover`
 * with `object-position: center` protects the central composition (protected
 * food island, child, shield, drifting toxin particles) from bad cropping as
 * the viewport narrows.
 *
 * The <h1> and CTAs are real HTML overlaid on the video. The looping background
 * video is muted/decorative and respects prefers-reduced-motion (paused, first
 * frame held). React + CSS only, scoped under `.pgr-hero`, responsive.
 *
 * Usage:  <PoisonGuardHeroReview primaryHref="#waitlist" secondaryHref="/resources" />
 */

const VIDEO_SRC = "/videos/cinnova-poisonguard-blog-hero.mp4";
const BENEFITS = ["Families", "Pets", "Schools"];

function prefersReducedMotion() {
    return typeof window !== "undefined" && window.matchMedia
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;
}

function PoisonGuardHeroReview({ primaryHref = "#", secondaryHref = "#" }) {
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
        <section className="pgr-hero">
            {/* ── Full-bleed cinematic video background (decorative) ── */}
            <div className="pgr-media" aria-hidden="true">
                <video
                    ref={videoRef}
                    className="pgr-video"
                    src={VIDEO_SRC}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    tabIndex={-1}
                />
                {/* Corner-only scrims — the center/lower area stays bright so the
                    child, protected food island/shield, and glowing plant show. */}
                <div className="pgr-scrim pgr-scrim--tl" />
                <div className="pgr-scrim pgr-scrim--tr" />
            </div>

            {/* ── Top-left: brand + headline + CTAs ── */}
            <div className="pgr-corner pgr-corner--tl">
                <p className="pgr-eyebrow">
                    <span className="pgr-eyebrow__dot" />
                    PoisonGuard
                </p>
                <h1 className="pgr-title">
                    Know what you&rsquo;re dealing with <span className="pgr-title__grad">before panic sets in.</span>
                </h1>
                <div className="pgr-actions">
                    <a className="pgr-btn pgr-btn--primary" href={primaryHref}>Join Waitlist</a>
                    <a className="pgr-btn pgr-btn--ghost" href={secondaryHref}>Safety Resources</a>
                </div>
            </div>

            {/* ── Top-right: supporting message + audience chips ── */}
            <div className="pgr-corner pgr-corner--tr">
                <p className="pgr-support">
                    Scan unknown substances, understand risk levels, and get clear next-step guidance.
                </p>
                <ul className="pgr-chips">
                    {BENEFITS.map((b) => (
                        <li className="pgr-chip" key={b}>{b}</li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

export default PoisonGuardHeroReview;
