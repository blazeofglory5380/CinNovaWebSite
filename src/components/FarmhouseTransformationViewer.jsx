import { useCallback, useEffect, useRef, useState } from "react";
import "./FarmhouseTransformationViewer.css";

let modelViewerLoader;

function loadModelViewer() {
    if (!modelViewerLoader) {
        modelViewerLoader = import("@google/model-viewer");
    }
    return modelViewerLoader;
}

function canUseWebGL() {
    if (typeof window === "undefined") return false;
    try {
        const canvas = document.createElement("canvas");
        return Boolean(
            window.WebGLRenderingContext
            && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")),
        );
    } catch {
        return false;
    }
}

const HOLD_BEFORE_MS = 2400;
const SWEEP_MS = 5600;
const TRANSITION_MS = HOLD_BEFORE_MS + SWEEP_MS;
const SCAN_WALL_BLEND = 10;

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2;
}

function scanPositionForTime(elapsedMs) {
    if (elapsedMs < HOLD_BEFORE_MS) return -12;
    const sweepT = Math.min(1, (elapsedMs - HOLD_BEFORE_MS) / SWEEP_MS);
    return -12 + 124 * easeInOutCubic(sweepT);
}

function FarmhouseTransformationViewer({
    beforeSrc,
    afterSrc,
    posterSrc,
    alt,
    reduceMotion = false,
    onError,
}) {
    const beforeRef = useRef(null);
    const afterRef = useRef(null);
    const rafRef = useRef(0);
    const startRef = useRef(0);

    const [playKey, setPlayKey] = useState(0);
    const [viewerReady, setViewerReady] = useState(false);
    const [beforeLoaded, setBeforeLoaded] = useState(false);
    const [afterLoaded, setAfterLoaded] = useState(false);
    const [aligned, setAligned] = useState(false);
    const [scanX, setScanX] = useState(-12);
    const [scanActive, setScanActive] = useState(false);
    const [transitionDone, setTransitionDone] = useState(false);
    const [loadError, setLoadError] = useState(false);

    const modelsReady = beforeLoaded && afterLoaded && aligned;

    const resetPlayback = useCallback(() => {
        cancelAnimationFrame(rafRef.current);
        setBeforeLoaded(false);
        setAfterLoaded(false);
        setAligned(false);
        setScanX(-12);
        setScanActive(false);
        setTransitionDone(false);
        setLoadError(false);
    }, []);

    const handleReplay = useCallback(() => {
        resetPlayback();
        setPlayKey((key) => key + 1);
    }, [resetPlayback]);

    useEffect(() => {
        let cancelled = false;
        loadModelViewer().then(() => {
            if (!cancelled) setViewerReady(true);
        });
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        const before = beforeRef.current;
        const after = afterRef.current;
        if (!viewerReady || !before || !after) return undefined;

        const onBeforeLoad = () => setBeforeLoaded(true);
        const onAfterLoad = () => setAfterLoaded(true);
        const onFail = () => {
            setLoadError(true);
            onError?.();
        };

        before.addEventListener("load", onBeforeLoad);
        after.addEventListener("load", onAfterLoad);
        before.addEventListener("error", onFail);
        after.addEventListener("error", onFail);

        return () => {
            before.removeEventListener("load", onBeforeLoad);
            after.removeEventListener("load", onAfterLoad);
            before.removeEventListener("error", onFail);
            after.removeEventListener("error", onFail);
        };
    }, [viewerReady, playKey, onError]);

    useEffect(() => {
        if (!beforeLoaded || !afterLoaded || loadError) return undefined;

        const before = beforeRef.current;
        const after = afterRef.current;
        if (!before || !after) return undefined;

        let cancelled = false;

        import("../utils/normalizeModelViewer.js")
            .then(({ normalizeTransformationPair }) => {
                if (cancelled) return;
                const result = normalizeTransformationPair(before, after);
                if (!result) {
                    setLoadError(true);
                    onError?.();
                    return;
                }
                setAligned(true);
            })
            .catch(() => {
                if (!cancelled) {
                    setLoadError(true);
                    onError?.();
                }
            });

        return () => {
            cancelled = true;
        };
    }, [beforeLoaded, afterLoaded, loadError, playKey, onError]);

    useEffect(() => {
        if (!modelsReady || loadError) return undefined;

        if (reduceMotion) {
            setScanActive(false);
            setTransitionDone(true);
            return undefined;
        }

        startRef.current = performance.now();
        setScanX(-12);
        setScanActive(false);
        setTransitionDone(false);

        const tick = (now) => {
            const elapsed = now - startRef.current;
            const scan = scanPositionForTime(elapsed);

            setScanActive(elapsed >= HOLD_BEFORE_MS && elapsed < TRANSITION_MS);
            setScanX(scan);

            if (elapsed >= TRANSITION_MS) {
                setScanX(112);
                setScanActive(false);
                setTransitionDone(true);
                return;
            }

            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(rafRef.current);
        };
    }, [modelsReady, loadError, reduceMotion, playKey]);

    useEffect(() => {
        const after = afterRef.current;
        if (!after || !transitionDone) return undefined;

        after.cameraControls = true;
        after.autoRotate = !reduceMotion;
        after.rotationPerSecond = reduceMotion ? "0deg" : "18deg";

        return undefined;
    }, [transitionDone, reduceMotion, playKey]);

    if (loadError) {
        return (
            <div className="re-tf-viewer re-tf-viewer--poster" role="img" aria-label={alt}>
                <img src={posterSrc} alt="" className="re-tf-viewer__poster" loading="eager" fetchPriority="high" decoding="async" />
            </div>
        );
    }

    const sharedViewerProps = {
        loading: "eager",
        "touch-action": "pan-y",
        "interaction-prompt": "none",
        "shadow-intensity": "0.45",
        exposure: "1.05",
        "environment-image": "neutral",
        poster: posterSrc,
        alt,
        "aria-label": alt,
    };

    const beforeMask = transitionDone
        ? "none"
        : `linear-gradient(90deg, #000 0%, #000 calc(${scanX - SCAN_WALL_BLEND}%), transparent calc(${scanX + 2}%))`;
    const afterMask = transitionDone
        ? "none"
        : `linear-gradient(90deg, transparent calc(${scanX - 2}%), #000 calc(${scanX + SCAN_WALL_BLEND}%), #000 100%)`;

    return (
        <div
            className="re-tf-viewer"
            data-transition-done={transitionDone ? "true" : "false"}
            data-scan-active={scanActive ? "true" : "false"}
            style={{ "--scan-x": `${scanX}%` }}
        >
            {!modelsReady ? (
                <img
                    src={posterSrc}
                    alt=""
                    className="re-tf-viewer__poster re-tf-viewer__poster--loading"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                />
            ) : null}

            {viewerReady ? (
                <div className="re-tf-viewer__stack" key={playKey}>
                    {!transitionDone ? (
                        <model-viewer
                            ref={beforeRef}
                            className="re-tf-viewer__layer re-tf-viewer__layer--before"
                            src={beforeSrc}
                            style={{ WebkitMaskImage: beforeMask, maskImage: beforeMask }}
                            {...sharedViewerProps}
                        />
                    ) : null}
                    <model-viewer
                        ref={afterRef}
                        className="re-tf-viewer__layer re-tf-viewer__layer--after"
                        src={afterSrc}
                        style={{
                            opacity: transitionDone ? 1 : 0.98,
                            WebkitMaskImage: afterMask,
                            maskImage: afterMask,
                        }}
                        {...sharedViewerProps}
                        {...(transitionDone ? { "camera-controls": true } : {})}
                    />
                </div>
            ) : null}

            {scanActive ? (
                <div className="re-tf-scanwall" style={{ left: `${scanX}%` }} aria-hidden="true">
                    <span className="re-tf-scanwall__trail" />
                    <span className="re-tf-scanwall__beam" />
                    <span className="re-tf-scanwall__core" />
                    <span className="re-tf-scanwall__bloom" />
                    <span className="re-tf-scanwall__flare" />
                </div>
            ) : null}

            {scanActive ? <div className="re-tf-renovation-glow" aria-hidden="true" /> : null}

            {transitionDone ? (
                <button type="button" className="re-tf-replay" onClick={handleReplay}>
                    Replay transformation
                </button>
            ) : null}

            <p className="re-tf-kicker" aria-live="polite">
                {transitionDone
                    ? "AI renovation reveal complete — drag to orbit."
                    : scanActive
                      ? "AI scan in progress — renovation reveal, not a mesh morph."
                      : "Studying the property before AI renovation…"}
            </p>
        </div>
    );
}

export function shouldUseTransformationViewer() {
    if (typeof window === "undefined") return false;
    if (!canUseWebGL()) return false;
    if (window.matchMedia("(max-width: 960px)").matches) return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    return true;
}

export default FarmhouseTransformationViewer;
