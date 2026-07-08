import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import "./CinNovaCoreHero.css";

/*
 * CinNovaCoreHero — cinematic AI Core hero for the CinNova blog (Brand DNA).
 *
 * - Three.js is code-split (CinNovaCoreScene is React.lazy + dynamic three
 *   imports) and only mounts in a capable browser without data-saver.
 * - A CSS emerald orb renders instantly as the fallback/loading state; the
 *   canvas fades in over it once the GLB is ready. If the GLB is missing or
 *   WebGL is unavailable, the orb simply stays (never the Earth model).
 * - Prop-driven copy/CTAs so product pages can reuse the hero. CTAs are
 *   plain callbacks (SPA nav lives in the parent) — no router coupling.
 */

const CinNovaCoreScene = lazy(() => import("./CinNovaCoreScene.jsx"));

const DEFAULT_MODEL_PATH = "/models/cinnova-core/CinNova_AI_Core_v2.web.glb";

function prefersReducedMotion() {
    return typeof window !== "undefined" && window.matchMedia
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;
}

function CinNovaCoreHero({
    eyebrow = "CinNova Research · Publication",
    titleA = "CinNova",
    titleB = "Blog",
    subtitle = "Ideas, tutorials, product stories, and AI research from the CinNova ecosystem.",
    primaryCta,
    secondaryCta,
    // Optional stats row. When provided, it replaces the default
    // CORE/SIGNAL/STATUS meta strip. Shape: [{ value, label }].
    stats = null,
    // Optional single truthful ecosystem line (e.g. homepage product names).
    // Takes precedence over the meta strip; keeps the hero honest and uncluttered.
    ecosystemLine = null,
    modelPath = DEFAULT_MODEL_PATH,
    // Optional cinematic background video (e.g. homepage). When provided it
    // becomes the full-bleed hero visual instead of the CSS orb / 3D Core, and
    // the 3D bundle is not loaded. Other consumers (blog) omit it and are
    // completely unaffected.
    videoSrc = null,
    // Homepage video-only hero: render just the full 16:9 clip (no visible copy
    // overlay) plus a visually-hidden H1 for SEO/screen readers.
    videoOnly = false,
    srHeading = null,
}) {
    const pulseRef = useRef(null);
    const videoRef = useRef(null);
    const [canRender3D, setCanRender3D] = useState(false);

    useEffect(() => {
        // Gate the 3D bundle: WebGL2-capable browser + no data-saver.
        // Skip entirely when a background video is supplied.
        if (videoSrc) return;
        const saveData = navigator.connection?.saveData;
        setCanRender3D(typeof WebGL2RenderingContext !== "undefined" && !saveData);
    }, [videoSrc]);

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
    }, [videoSrc]);

    const onPulse = useCallback((v) => {
        if (pulseRef.current) pulseRef.current.textContent = v.toFixed(2);
    }, []);

    // Homepage video-only hero: the visual is the full 16:9 clip; the only text
    // is a visually-hidden H1. No copy overlay, scrim, orb, or 3D.
    if (videoOnly && videoSrc) {
        return (
            <section className="cn-core-hero cn-core-hero--videoonly">
                <h1 className="cn-core-hero__sr">{srHeading || `${titleA} ${titleB}`}</h1>
                <div className="cn-core-hero__videoframe" aria-hidden="true">
                    <video
                        ref={videoRef}
                        className="cn-core-hero__video"
                        src={videoSrc}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        tabIndex={-1}
                    />
                </div>
            </section>
        );
    }

    return (
        <section
            className={`cn-core-hero${videoSrc ? " cn-core-hero--video" : ""}`}
            aria-label={`${titleA} ${titleB}`}
        >
            <div className="cn-core-hero__visual" aria-hidden="true">
                {videoSrc ? (
                    <video
                        ref={videoRef}
                        className="cn-core-hero__video"
                        src={videoSrc}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        tabIndex={-1}
                    />
                ) : (
                    <>
                        <div className="cn-core-hero__orb" />
                        {canRender3D && (
                            <Suspense fallback={null}>
                                <CinNovaCoreScene modelPath={modelPath} onPulse={onPulse} />
                            </Suspense>
                        )}
                    </>
                )}
            </div>
            <div className="cn-core-hero__tint" aria-hidden="true" />
            <div className="cn-core-hero__scrim" aria-hidden="true" />
            <div className="cn-core-hero__fade" aria-hidden="true" />

            <div className="cn-core-hero__wrap">
                <div className="cn-core-hero__copy">
                    <span className="bdna-eyebrow">{eyebrow}</span>
                    <h1 className="cn-core-hero__title">
                        {titleA} <b>{titleB}</b>
                    </h1>
                    <p className="cn-core-hero__sub">{subtitle}</p>

                    {(primaryCta || secondaryCta) && (
                        <div className="cn-core-hero__ctas">
                            {primaryCta && (
                                <button
                                    type="button"
                                    className="bdna-btn bdna-btn--solid"
                                    onClick={primaryCta.onClick}
                                >
                                    {primaryCta.label}
                                </button>
                            )}
                            {secondaryCta && (
                                <button
                                    type="button"
                                    className="bdna-btn bdna-btn--ghost"
                                    onClick={secondaryCta.onClick}
                                >
                                    {secondaryCta.label}
                                </button>
                            )}
                        </div>
                    )}

                    {stats && stats.length > 0 ? (
                        <dl className="cn-core-hero__stats">
                            {stats.map((stat) => (
                                <div key={stat.label} className="cn-core-hero__stat">
                                    <dt>{stat.value}</dt>
                                    <dd>{stat.label}</dd>
                                </div>
                            ))}
                        </dl>
                    ) : ecosystemLine ? (
                        <p className="cn-core-hero__ecoline">{ecosystemLine}</p>
                    ) : videoSrc ? null : (
                        <div className="cn-core-hero__meta">
                            <div>CORE <b>V1.0</b></div>
                            <div>SIGNAL <b ref={pulseRef}>1.00</b></div>
                            <div>STATUS <b>ONLINE</b></div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default CinNovaCoreHero;
