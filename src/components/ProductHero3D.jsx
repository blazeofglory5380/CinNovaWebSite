import { useEffect, useId, useRef, useState } from "react";
import FarmhouseTransformationViewer, { shouldUseTransformationViewer } from "./FarmhouseTransformationViewer.jsx";
import "../styles/brand-dna.css";
import "./ProductHero3D.css";

let modelViewerLoader;

function loadModelViewer() {
    if (!modelViewerLoader) {
        // model-viewer bakes its Draco decoder path at module-evaluation time
        // from `self.ModelViewerElement.dracoDecoderLocation`, falling back to
        // the gstatic CDN — which our production CSP blocks. Setting the static
        // property AFTER import races with that and loses on production, so we
        // configure the global BEFORE the dynamic import. This is model-viewer's
        // documented, race-free way to self-host the decoder at /draco/ (already
        // shipped for the Core/Earth heroes). Poster-only products never call
        // this loader, so they are unaffected.
        if (typeof self !== "undefined") {
            self.ModelViewerElement = self.ModelViewerElement || {};
            self.ModelViewerElement.dracoDecoderLocation = "/draco/";
        }
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
    heroVisual = "model",
    viewer = {},
    minPosterMs = 0,
    transformation = null,
    badges = null,
    stats = null,
    visualOverlay = null,
    stageHint = null,
    onPrimaryCta,
    onSecondaryCta,
}) {
    const titleId = useId();
    const viewerRef = useRef(null);
    const [modelReady, setModelReady] = useState(false);
    const [modelAvailable, setModelAvailable] = useState(null);
    const [reduceMotion, setReduceMotion] = useState(false);
    const [viewerLoaded, setViewerLoaded] = useState(false);
    const [useTransformationViewer, setUseTransformationViewer] = useState(false);
    const [transformationFailed, setTransformationFailed] = useState(false);
    const [transformationPreviewOpen, setTransformationPreviewOpen] = useState(false);
    // Minimum-poster-display gate (opt-in per product via minPosterMs > 0).
    // Keeps the poster on screen for a set time, then crossfades to the model.
    const [posterMinElapsed, setPosterMinElapsed] = useState(false);
    const [posterUnmounted, setPosterUnmounted] = useState(false);

    const isTransformationHero = heroVisual === "transformation" && Boolean(transformation);
    const canPreviewTransformation = isTransformationHero && useTransformationViewer && !transformationFailed;
    const isPosterHero = heroVisual === "poster"
        || (isTransformationHero && (!canPreviewTransformation || !transformationPreviewOpen));

    useEffect(() => {
        setReduceMotion(isReducedMotionPreferred());
        const media = window.matchMedia("(prefers-reduced-motion: reduce)");
        const onChange = (event) => setReduceMotion(event.matches);
        media.addEventListener("change", onChange);
        return () => media.removeEventListener("change", onChange);
    }, []);

    useEffect(() => {
        if (!isTransformationHero) {
            setUseTransformationViewer(false);
            return undefined;
        }

        setUseTransformationViewer(shouldUseTransformationViewer());

        const mobileMedia = window.matchMedia("(max-width: 960px)");
        const onViewportChange = () => setUseTransformationViewer(shouldUseTransformationViewer());
        mobileMedia.addEventListener("change", onViewportChange);

        return () => mobileMedia.removeEventListener("change", onViewportChange);
    }, [isTransformationHero]);

    useEffect(() => {
        if (heroVisual === "poster") {
            setModelAvailable(false);
            return undefined;
        }

        if (isTransformationHero) {
            if (!useTransformationViewer) {
                setModelAvailable(false);
                return undefined;
            }

            // Dual GLB assets are shipped in-repo; skip HEAD probes on large files.
            setModelAvailable(true);
            return undefined;
        }

        let cancelled = false;

        fetch(modelSrc, { method: "HEAD" })
            .then((response) => {
                const contentType = response.headers.get("content-type") || "";
                // A dev server answering a missing .glb with index.html (200) must
                // count as "no model" — otherwise model-viewer tries to parse HTML
                // as glTF and logs a GLTFLoader error. Poster fallback then renders.
                const modelOk = response.ok && !contentType.includes("text/html");
                if (!cancelled) setModelAvailable(modelOk);
            })
            .catch(() => {
                if (!cancelled) setModelAvailable(false);
            });

        return () => {
            cancelled = true;
        };
    }, [modelSrc, heroVisual, isTransformationHero, transformation, useTransformationViewer]);

    useEffect(() => {
        if (isTransformationHero) return undefined;
        if (modelAvailable !== true) return undefined;

        let cancelled = false;
        loadModelViewer().then(() => {
            if (!cancelled) setViewerLoaded(true);
        });

        return () => {
            cancelled = true;
        };
    }, [modelAvailable, isTransformationHero]);

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

    // Start the minimum-poster timer on mount (opt-in via minPosterMs).
    useEffect(() => {
        if (!(minPosterMs > 0)) return undefined;
        const timer = setTimeout(() => setPosterMinElapsed(true), minPosterMs);
        return () => clearTimeout(timer);
    }, [minPosterMs]);

    // Once the model is revealed, unmount the poster only after the crossfade
    // has finished so there is no flash or layout shift.
    useEffect(() => {
        const gated = minPosterMs > 0 && heroVisual !== "poster" && !isTransformationHero;
        if (!gated) return undefined;
        if (!(modelReady && posterMinElapsed)) return undefined;
        const timer = setTimeout(() => setPosterUnmounted(true), 850);
        return () => clearTimeout(timer);
    }, [minPosterMs, heroVisual, isTransformationHero, modelReady, posterMinElapsed]);

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

    // Minimum poster display: only a model hero that opts in (minPosterMs > 0,
    // i.e. StudyNest) holds the poster for a set time before crossfading to the
    // model. All other products keep the exact original reveal behavior.
    const posterGated = minPosterMs > 0 && !isPosterHero && !isTransformationHero;
    const modelRevealed = modelReady && (posterGated ? posterMinElapsed : true);

    const showTransformation = canPreviewTransformation && transformationPreviewOpen;
    const showViewer = !isPosterHero && !showTransformation && modelAvailable === true && viewerLoaded;
    // Gated: keep the poster mounted (over the loading model-viewer) until the
    // crossfade completes; on model failure it simply stays visible (safe).
    const showFallback = posterGated
        ? !posterUnmounted
        : isPosterHero || (!isTransformationHero && (modelAvailable !== true || !modelReady));

    return (
        <section
            className={`ph3d brand-dna${className ? ` ${className}` : ""}${isPosterHero ? " ph3d--poster-hero" : ""}`}
            aria-labelledby={titleId}
            {...(transformation
                ? {
                      "data-transform-before-model": transformation.beforeModelSrc,
                      "data-transform-after-model": transformation.afterModelSrc,
                  }
                : {})}
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
                            {showTransformation ? (
                                <FarmhouseTransformationViewer
                                    beforeSrc={transformation.beforeModelSrc}
                                    afterSrc={transformation.afterModelSrc}
                                    posterSrc={posterSrc}
                                    alt={alt}
                                    reduceMotion={reduceMotion}
                                    onError={() => setTransformationFailed(true)}
                                />
                            ) : null}

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
                                    shadow-intensity={viewer.shadowIntensity ?? "0.45"}
                                    exposure={viewer.exposure ?? "1.05"}
                                    environment-image={viewer.environmentImage ?? "neutral"}
                                    {...(viewer.shadowSoftness ? { "shadow-softness": viewer.shadowSoftness } : {})}
                                    {...(viewer.cameraOrbit ? { "camera-orbit": viewer.cameraOrbit } : {})}
                                    {...(viewer.cameraTarget ? { "camera-target": viewer.cameraTarget } : {})}
                                    {...(viewer.fieldOfView ? { "field-of-view": viewer.fieldOfView } : {})}
                                    {...(viewer.toneMapping ? { "tone-mapping": viewer.toneMapping } : {})}
                                    aria-label={alt}
                                />
                            ) : null}

                            {showFallback ? (
                                <div
                                    className={`ph3d__fallback${posterGated && modelRevealed ? " ph3d__fallback--revealing" : ""}`}
                                    role="img"
                                    aria-label={alt}
                                >
                                    <img
                                        src={posterSrc}
                                        alt=""
                                        className="ph3d__fallback-image"
                                        loading="eager"
                                        fetchPriority="high"
                                        decoding="async"
                                    />
                                    {canPreviewTransformation && !transformationPreviewOpen ? (
                                        <div className="ph3d__preview-launch">
                                            <button
                                                type="button"
                                                className="ph3d__preview-launch-btn"
                                                onClick={() => setTransformationPreviewOpen(true)}
                                            >
                                                Preview 3D transformation
                                            </button>
                                            <p className="ph3d__preview-launch-copy">
                                                AI renovation reveal with scan wall — not a geometry morph.
                                            </p>
                                        </div>
                                    ) : null}
                                    {!isPosterHero ? (
                                        <>
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
                                        </>
                                    ) : null}
                                </div>
                            ) : null}

                            {visualOverlay}
                        </div>
                        <p className="ph3d__stage-hint">
                            {stageHint ?? (isTransformationHero
                                ? showTransformation
                                    ? reduceMotion
                                        ? "Drag to orbit the renovated farmhouse."
                                        : "AI scan reveal — watch the renovation, then drag to orbit."
                                    : canPreviewTransformation
                                      ? "Poster preview active. Launch the 3D AI renovation reveal when ready."
                                      : "Interactive farmhouse transformation preview."
                                : reduceMotion
                                  ? "Drag to inspect the product scene."
                                  : "Drag or pinch to rotate. Auto-rotate resumes when idle.")}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ProductHero3D;
