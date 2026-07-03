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
        <main className="earth-hero-test">
            <SEO
                title="Earth Hero Prototype | Cin Nova"
                description="Internal prototype for a cinematic Earth hero experience."
                noindex
            />

            <div className="earth-hero-test__backdrop" aria-hidden="true">
                <span className="earth-hero-test__nebula earth-hero-test__nebula--left" />
                <span className="earth-hero-test__nebula earth-hero-test__nebula--right" />
                <span className="earth-hero-test__vignette" />
            </div>

            <EarthHeroScene reduceMotion={reduceMotion} />

            <div className="earth-hero-test__shell">
                <button
                    type="button"
                    className="earth-hero-test__back"
                    onClick={() => onGoHome?.()}
                >
                    Back to CinNova
                </button>

                <div className="earth-hero-test__content">
                    <p className="earth-hero-test__eyebrow">PROTOTYPE · EARTH HERO</p>
                    <h1 className="earth-hero-test__headline">
                        One intelligence. Infinite possibilities.
                    </h1>
                    <p className="earth-hero-test__lede">
                        A cinematic preview of CinNova&apos;s connected AI ecosystem — built for
                        learning, safety, real estate, and everyday decisions across the globe.
                    </p>

                    <div className="earth-hero-test__actions">
                        <button
                            type="button"
                            className="earth-hero-test__cta earth-hero-test__cta--primary"
                            onClick={() => onNavigate?.("products")}
                        >
                            Explore Products
                        </button>
                        <button
                            type="button"
                            className="earth-hero-test__cta earth-hero-test__cta--secondary"
                            onClick={() => onNavigate?.("resources")}
                        >
                            Free Resources
                        </button>
                    </div>

                    <p className="earth-hero-test__hint">
                        {reduceMotion
                            ? "Reduced motion is on — Earth holds still for a calmer view."
                            : "Drag is not required. Earth rotates slowly on its own."}
                    </p>
                </div>
            </div>
        </main>
    );
}

export default EarthHeroTest;
