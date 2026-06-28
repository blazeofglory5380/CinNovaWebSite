import { useEffect, useId, useRef, useState } from "react";
import "./ProductHero3D.css";

let modelViewerLoader;

function loadModelViewer() {
    if (!modelViewerLoader) {
        modelViewerLoader = import("@google/model-viewer");
    }
    return modelViewerLoader;
}

function isReducedMotionPreferred() {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isInternalAppHref(href = "") {
    return href.startsWith("/?") || href === "/" || href.startsWith("/blog");
}

function ProductHero3D({
    modelSrc,
    posterSrc,
    alt,
    title,
    eyebrow,
    description,
    ctaText,
    ctaHref,
    secondaryCtaText,
    secondaryCtaHref,
    className = "",
    badges = null,
    stats = null,
    visualOverlay = null,
    onPrimaryCta,
    onSecondaryCta,
}) {
    const titleId = useId();
    const viewerRef = useRef(null);
    const [modelReady, setModelReady] = useState(false);
    const [modelAvailable, setModelAvailable] = useState(null);
    const [reduceMotion, setReduceMotion] = useState(false);
    const [viewerLoaded, setViewerLoaded] = useState(false);

    useEffect(() => {
        setReduceMotion(isReducedMotionPreferred());
        const media = window.matchMedia("(prefers-reduced-motion: reduce)");
        const onChange = (event) => setReduceMotion(event.matches);
        media.addEventListener("change", onChange);
        return () => media.removeEventListener("change", onChange);
    }, []);

    useEffect(() => {
        let cancelled = false;

        fetch(modelSrc, { method: "HEAD" })
            .then((response) => {
                if (!cancelled) setModelAvailable(response.ok);
            })
            .catch(() => {
                if (!cancelled) setModelAvailable(false);
            });

        return () => {
            cancelled = true;
        };
    }, [modelSrc]);

    useEffect(() => {
        if (modelAvailable !== true) return undefined;

        let cancelled = false;
        loadModelViewer().then(() => {
            if (!cancelled) setViewerLoaded(true);
        });

        return () => {
            cancelled = true;
        };
    }, [modelAvailable]);

    useEffect(() => {
        const viewer = viewerRef.current;
        if (!viewer || !viewerLoaded) return undefined;

        const handleLoad = () => setModelReady(true);
        const handleError = () => {
            setModelReady(false);
            setModelAvailable(false);
        };

        viewer.autoRotate = !reduceMotion;
        viewer.rotationPerSecond = reduceMotion ? "0deg" : "18deg";

        viewer.addEventListener("load", handleLoad);
        viewer.addEventListener("error", handleError);

        return () => {
            viewer.removeEventListener("load", handleLoad);
            viewer.removeEventListener("error", handleError);
        };
    }, [viewerLoaded, modelSrc, reduceMotion]);

    function handleCtaClick(event, href, handler) {
        if (!handler) return;
        event.preventDefault();
        handler();
    }

    function renderCta({ label, href, variant, handler }) {
        const classNames = variant === "primary" ? "ph3d__cta ph3d__cta--primary" : "ph3d__cta ph3d__cta--secondary";
        const useButton = Boolean(handler) || href.startsWith("#");

        if (useButton) {
            return (
                <button
                    type="button"
                    className={classNames}
                    onClick={(event) => {
                        if (handler) {
                            handler();
                            return;
                        }
                        if (href.startsWith("#")) {
                            const target = document.querySelector(href);
                            target?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
                            event.preventDefault();
                        }
                    }}
                >
                    {label}
                </button>
            );
        }

        return (
            <a
                href={href}
                className={classNames}
                onClick={(event) => handleCtaClick(event, href, handler)}
                {...(isInternalAppHref(href) ? { "data-spa-link": "true" } : {})}
            >
                {label}
            </a>
        );
    }

    const showViewer = modelAvailable === true && viewerLoaded;
    const showFallback = modelAvailable !== true || !modelReady;

    return (
        <section
            className={`ph3d${className ? ` ${className}` : ""}`}
            aria-labelledby={titleId}
        >
            <div className="ph3d__ambient" aria-hidden="true">
                <span className="ph3d__glow ph3d__glow--left" />
                <span className="ph3d__glow ph3d__glow--right" />
            </div>

            <div className="ph3d__shell">
                <div className="ph3d__grid">
                    <div className="ph3d__copy">
                        {badges}
                        {eyebrow ? <p className="ph3d__eyebrow">{eyebrow}</p> : null}
                        <h1 id={titleId} className="ph3d__title">
                            {title}
                        </h1>
                        {description ? <p className="ph3d__description">{description}</p> : null}
                        <div className="ph3d__actions">
                            {ctaText ? renderCta({
                                label: ctaText,
                                href: ctaHref || "#",
                                variant: "primary",
                                handler: onPrimaryCta,
                            }) : null}
                            {secondaryCtaText ? renderCta({
                                label: secondaryCtaText,
                                href: secondaryCtaHref || "#",
                                variant: "secondary",
                                handler: onSecondaryCta,
                            }) : null}
                        </div>
                        {stats}
                    </div>

                    <div className="ph3d__stage-wrap">
                        <div className="ph3d__stage">
                            {showViewer ? (
                                <model-viewer
                                    ref={viewerRef}
                                    className="ph3d__viewer"
                                    src={modelSrc}
                                    poster={posterSrc}
                                    alt={alt}
                                    loading="lazy"
                                    camera-controls
                                    touch-action="pan-y"
                                    interaction-prompt="none"
                                    shadow-intensity="0.45"
                                    exposure="1.05"
                                    environment-image="neutral"
                                    aria-label={alt}
                                />
                            ) : null}

                            {showFallback ? (
                                <div className="ph3d__fallback" role="img" aria-label={alt}>
                                    <img
                                        src={posterSrc}
                                        alt=""
                                        className="ph3d__fallback-image"
                                        loading="eager"
                                        fetchPriority="high"
                                        decoding="async"
                                    />
                                    <div className="ph3d__fallback-scrim" aria-hidden="true" />
                                    <div className="ph3d__fallback-panel">
                                        <p className="ph3d__fallback-kicker">Interactive 3D preview</p>
                                        <p className="ph3d__fallback-title">{title}</p>
                                        <p className="ph3d__fallback-copy">
                                            {modelAvailable === null
                                                ? "Checking for the interactive 360 model..."
                                                : modelAvailable === false
                                                  ? "The 360 model is being prepared. Explore the scene preview while the GLB asset ships."
                                                  : "Loading the 360 scene..."}
                                        </p>
                                        <span className="ph3d__fallback-chip">Poster preview active</span>
                                    </div>
                                </div>
                            ) : null}

                            {visualOverlay}
                        </div>
                        <p className="ph3d__stage-hint">
                            {reduceMotion
                                ? "Drag to inspect the product scene."
                                : "Drag or pinch to rotate. Auto-rotate resumes when idle."}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ProductHero3D;
