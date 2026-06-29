import { useEffect, useRef, useState } from "react";
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

const SCAN_START = 0.18;
const SCAN_END = 0.72;
const TRANSITION_MS = 6800;
const HOLD_BEFORE_MS = 1200;

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2;
}

function scanProgressForTime(elapsedMs) {
    if (elapsedMs < HOLD_BEFORE_MS) return 0;
    const scanWindow = TRANSITION_MS - HOLD_BEFORE_MS;
    const t = Math.min(1, (elapsedMs - HOLD_BEFORE_MS) / scanWindow);
    return SCAN_START + (SCAN_END - SCAN_START) * easeInOutCubic(t);
}

function blendProgressForScan(scan) {
    if (scan <= SCAN_START) return 0;
    if (scan >= SCAN_END) return 1;
    return (scan - SCAN_START) / (SCAN_END - SCAN_START);
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
    const syncingRef = useRef(false);

    const [viewerReady, setViewerReady] = useState(false);
    const [beforeReady, setBeforeReady] = useState(false);
    const [afterReady, setAfterReady] = useState(false);
    const [scanX, setScanX] = useState(0);
    const [beforeOpacity, setBeforeOpacity] = useState(1);
    const [afterOpacity, setAfterOpacity] = useState(0);
    const [scanVisible, setScanVisible] = useState(false);
    const [transitionDone, setTransitionDone] = useState(false);
    const [loadError, setLoadError] = useState(false);

    const modelsReady = beforeReady && afterReady;

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

        const onBeforeLoad = () => setBeforeReady(true);
        const onAfterLoad = () => setAfterReady(true);
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
    }, [viewerReady, onError]);

    useEffect(() => {
        if (!modelsReady) return undefined;

        const before = beforeRef.current;
        const after = afterRef.current;
        if (!before || !after) return undefined;

        const syncCamera = (source, target) => {
            if (syncingRef.current || !source || !target) return;
            syncingRef.current = true;
            const orbit = source.getCameraOrbit();
            const targetOrbit = target.getCameraOrbit();
            targetOrbit.theta = orbit.theta;
            targetOrbit.phi = orbit.phi;
            targetOrbit.radius = orbit.radius;
            target.updateFraming();
            target.jumpCameraToGoal();
            syncingRef.current = false;
        };

        const onBeforeCamera = () => syncCamera(before, after);
        const onAfterCamera = () => syncCamera(after, before);

        before.addEventListener("camera-change", onBeforeCamera);
        after.addEventListener("camera-change", onAfterCamera);

        before.autoRotate = false;
        after.autoRotate = false;

        return () => {
            before.removeEventListener("camera-change", onBeforeCamera);
            after.removeEventListener("camera-change", onAfterCamera);
        };
    }, [modelsReady]);

    useEffect(() => {
        if (!modelsReady || loadError) return undefined;

        if (reduceMotion) {
            setBeforeOpacity(0);
            setAfterOpacity(1);
            setScanVisible(false);
            setTransitionDone(true);
            return undefined;
        }

        startRef.current = performance.now();
        setBeforeOpacity(1);
        setAfterOpacity(0);
        setScanVisible(true);
        setTransitionDone(false);

        const tick = (now) => {
            const elapsed = now - startRef.current;
            const scan = scanProgressForTime(elapsed);
            const blend = easeInOutCubic(blendProgressForScan(scan));

            setScanX(scan * 100);
            setBeforeOpacity(1 - blend);
            setAfterOpacity(blend);

            if (elapsed >= TRANSITION_MS) {
                setBeforeOpacity(0);
                setAfterOpacity(1);
                setScanVisible(false);
                setTransitionDone(true);

                const after = afterRef.current;
                if (after) {
                    after.autoRotate = true;
                    after.rotationPerSecond = "18deg";
                }
                return;
            }

            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(rafRef.current);
        };
    }, [modelsReady, loadError, reduceMotion]);

    if (loadError) {
        return (
            <div className="re-tf-viewer re-tf-viewer--poster" role="img" aria-label={alt}>
                <img src={posterSrc} alt="" className="re-tf-viewer__poster" loading="eager" fetchPriority="high" decoding="async" />
            </div>
        );
    }

    const sharedViewerProps = {
        loading: "eager",
        "camera-controls": !transitionDone && !reduceMotion ? false : transitionDone,
        "touch-action": "pan-y",
        "interaction-prompt": "none",
        "shadow-intensity": "0.45",
        exposure: "1.05",
        "environment-image": "neutral",
        "tone-mapping": "neutral",
        poster: posterSrc,
        alt,
        "aria-label": alt,
    };

    return (
        <div className="re-tf-viewer" data-transition-done={transitionDone ? "true" : "false"}>
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
                <>
                    <model-viewer
                        ref={beforeRef}
                        className="re-tf-viewer__layer re-tf-viewer__layer--before"
                        src={beforeSrc}
                        style={{ opacity: beforeOpacity }}
                        {...sharedViewerProps}
                    />
                    <model-viewer
                        ref={afterRef}
                        className="re-tf-viewer__layer re-tf-viewer__layer--after"
                        src={afterSrc}
                        style={{ opacity: afterOpacity }}
                        {...sharedViewerProps}
                    />
                </>
            ) : null}

            {scanVisible ? (
                <div className="re-tf-scan" style={{ left: `${scanX}%` }} aria-hidden="true">
                    <span className="re-tf-scan__core" />
                    <span className="re-tf-scan__glow" />
                </div>
            ) : null}
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
