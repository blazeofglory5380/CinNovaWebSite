import { useEffect, useRef, useState } from "react";
import {
    EarthHeroDirector,
    isReducedMotionPreferred,
    shouldRender3d,
} from "./earth-hero/index.js";

function EarthHeroScene({ reduceMotion: reduceMotionProp }) {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const directorRef = useRef(null);
    const [use3d, setUse3d] = useState(shouldRender3d);
    const [reduceMotion, setReduceMotion] = useState(isReducedMotionPreferred);

    useEffect(() => {
        setUse3d(shouldRender3d());
        setReduceMotion(isReducedMotionPreferred());

        const motionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
        const viewportMedia = window.matchMedia("(max-width: 768px)");

        const onMotionChange = (event) => setReduceMotion(event.matches);
        const onViewportChange = () => setUse3d(shouldRender3d());

        motionMedia.addEventListener("change", onMotionChange);
        viewportMedia.addEventListener("change", onViewportChange);

        return () => {
            motionMedia.removeEventListener("change", onMotionChange);
            viewportMedia.removeEventListener("change", onViewportChange);
        };
    }, []);

    const motionReduced = reduceMotionProp ?? reduceMotion;

    useEffect(() => {
        directorRef.current?.setMotionReduced(motionReduced);
    }, [motionReduced]);

    useEffect(() => {
        if (!use3d) return undefined;

        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return undefined;

        const director = new EarthHeroDirector({
            canvas,
            container,
            motionReduced,
            onLoadError: () => setUse3d(false),
        });
        directorRef.current = director;

        return () => {
            director.dispose();
            directorRef.current = null;
        };
    }, [use3d]);

    if (!use3d) {
        return (
            <div
                className="earth-hero-scene earth-hero-scene--fallback"
                ref={containerRef}
                aria-hidden="true"
            >
                <div className="earth-hero-scene__space" />
                <div className="earth-hero-scene__orb">
                    <span className="earth-hero-scene__orb-core" />
                    <span className="earth-hero-scene__orb-glow" />
                </div>
            </div>
        );
    }

    return (
        <div className="earth-hero-scene" ref={containerRef} aria-hidden="true">
            <canvas ref={canvasRef} className="earth-hero-scene__canvas" />
        </div>
    );
}

export default EarthHeroScene;
