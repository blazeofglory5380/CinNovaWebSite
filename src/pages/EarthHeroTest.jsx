import { useEffect, useState } from "react";
import SEO from "../components/SEO.jsx";
import EarthHeroScene from "../components/home-v3/EarthHeroScene.jsx";
import "../styles/earth-hero-test.css";

function isReducedMotionPreferred() {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function EarthHeroTest({ onNavigate, onGoHome }) {
    const [reduceMotion, setReduceMotion] = useState(isReducedMotionPreferred);

    useEffect(() => {
        setReduceMotion(isReducedMotionPreferred());
        const media = window.matchMedia("(prefers-reduced-motion: reduce)");
        const onChange = (event) => setReduceMotion(event.matches);
        media.addEventListener("change", onChange);
        return () => media.removeEventListener("change", onChange);
    }, []);

    return (
        <main className="earth-hero-test brand-dna">
            <SEO
                title="Earth Hero Prototype | Cin Nova"
                description="Internal prototype for a cinematic Earth hero experience."
                noindex
            />

            {/* Cinematic Earth stage — globe sits to the right; a left dark scrim
                keeps the copy readable, mirroring the production Core hero. */}
            <div className="earth-hero-test__visual" aria-hidden="true">
                <EarthHeroScene reduceMotion={reduceMotion} />
                <span className="earth-hero-test__tint" />
                <span className="earth-hero-test__scrim" />
                <span className="earth-hero-test__fade" />
            </div>

            <div className="earth-hero-test__wrap">
                <button
                    type="button"
                    className="earth-hero-test__back bdna-btn bdna-btn--ghost"
                    onClick={() => onGoHome?.()}
                >
                    ← Back to CinNova
                </button>

                <div className="earth-hero-test__copy">
                    <span className="bdna-eyebrow">Prototype · Earth Hero</span>

                    <h1 className="earth-hero-test__title">
                        One intelligence.
                        <b> Infinite possibilities.</b>
                    </h1>

                    <p className="earth-hero-test__sub">
                        A cinematic preview of CinNova&apos;s connected AI ecosystem — built for
                        learning, safety, real estate, and everyday decisions across the globe.
                    </p>

                    <div className="earth-hero-test__ctas">
                        <button
                            type="button"
                            className="bdna-btn bdna-btn--solid"
                            onClick={() => onNavigate?.("products")}
                        >
                            Explore Products
                        </button>
                        <button
                            type="button"
                            className="bdna-btn bdna-btn--ghost"
                            onClick={() => onNavigate?.("resources")}
                        >
                            Free Resources
                        </button>
                    </div>

                    <div className="earth-hero-test__meta">
                        <span><b>Experimental</b> route</span>
                        <span><b>3D</b> auto-rotate</span>
                        <span>{reduceMotion ? "Reduced motion on" : "Motion enabled"}</span>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default EarthHeroTest;
