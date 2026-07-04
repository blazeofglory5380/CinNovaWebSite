import { useRef } from "react";
import "./TechMateHero.css";

/*
 * TechMateHero — animated TechMate product hero.
 *
 * Left column is REAL HTML (crisp text, real clickable buttons). Right column is
 * the approved animated image scene, cropped to the right ~68% so the baked-in
 * left text is clipped out and replaced by the real copy — the full desk edge
 * and top-right corner stay visible. Carries over the approved design's
 * animated glow overlays and cursor-follow eye/core glow.
 *
 * React + CSS only. Scoped under `.tmxr-hero`. Responsive +
 * prefers-reduced-motion.
 *
 * Usage:  <TechMateHero primaryHref="#waitlist" secondaryHref="#waitlist" />
 */

const IMAGE_SRC = "/images/products/techmate/techmate-hero-approved-v1.png";

const CARD_GLOWS = [
    { key: "wifi", left: "50%", top: "19.5%", delay: "0s" },
    { key: "laptop", left: "66%", top: "15%", delay: "0.4s" },
    { key: "security", left: "83.5%", top: "19.5%", delay: "0.8s" },
    { key: "phone", left: "48%", top: "34%", delay: "1.2s" },
    { key: "home", left: "84%", top: "34%", delay: "1.6s" },
    { key: "printer", left: "48%", top: "45%", delay: "2s" },
];

const BENEFITS = [
    { label: "Smart Diagnostics", icon: (<><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" /><path d="M9 12l2 2 4-4" /></>) },
    { label: "Instant Solutions", icon: <path d="M13 2L4 14h6l-1 8 9-12h-6z" /> },
    { label: "24/7 AI Support", icon: (<><path d="M4 13a8 8 0 0116 0" /><rect x="3" y="13" width="4" height="7" rx="2" /><rect x="17" y="13" width="4" height="7" rx="2" /></>) },
    { label: "Secure & Private", icon: (<><rect x="4" y="10" width="16" height="11" rx="2.5" /><path d="M8 10V7a4 4 0 018 0v3" /></>) },
];

function prefersReducedMotion() {
    return typeof window !== "undefined" && window.matchMedia
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;
}

function TechMateHero({ primaryHref = "#", secondaryHref = "#" }) {
    const sceneRef = useRef(null);
    const rafRef = useRef(0);

    function handleMove(event) {
        const el = sceneRef.current;
        const win = event.currentTarget;
        if (!el || prefersReducedMotion()) return;
        const rect = win.getBoundingClientRect();
        const nx = (event.clientX - rect.left) / rect.width - 0.5;
        const ny = (event.clientY - rect.top) / rect.height - 0.5;
        if (rafRef.current) return;
        rafRef.current = requestAnimationFrame(() => {
            rafRef.current = 0;
            el.style.setProperty("--tmxr-ex", `${(nx * 22).toFixed(1)}px`);
            el.style.setProperty("--tmxr-ey", `${(ny * 16).toFixed(1)}px`);
            el.style.setProperty("--tmxr-px", `${(nx * 11).toFixed(1)}px`);
            el.style.setProperty("--tmxr-py", `${(ny * 8).toFixed(1)}px`);
        });
    }

    function handleLeave() {
        const el = sceneRef.current;
        if (!el) return;
        el.style.setProperty("--tmxr-ex", "0px");
        el.style.setProperty("--tmxr-ey", "0px");
        el.style.setProperty("--tmxr-px", "0px");
        el.style.setProperty("--tmxr-py", "0px");
    }

    return (
        <section className="tmxr-hero">
            <div className="tmxr-inner">
                {/* ── Left: real HTML copy ── */}
                <div className="tmxr-copy">
                    <p className="tmxr-eyebrow">
                        <span className="tmxr-eyebrow__dot" />
                        TechMate AI
                    </p>
                    <h1 className="tmxr-title">
                        Your AI-powered <span className="tmxr-title__grad">tech support</span> companion.
                    </h1>
                    <p className="tmxr-lede">
                        TechMate AI diagnoses issues, provides step-by-step solutions, and keeps your
                        devices, network, and smart home running at peak performance.
                    </p>
                    <div className="tmxr-actions">
                        <a className="tmxr-btn tmxr-btn--primary" href={primaryHref}>
                            Get TechMate AI
                            <svg className="tmxr-btn__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M13 6l6 6-6 6" />
                            </svg>
                        </a>
                        <a className="tmxr-btn tmxr-btn--ghost" href={secondaryHref}>
                            Join Waitlist
                        </a>
                    </div>
                    <ul className="tmxr-benefits">
                        {BENEFITS.map((b) => (
                            <li className="tmxr-benefit" key={b.label}>
                                <span className="tmxr-benefit__ico">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        {b.icon}
                                    </svg>
                                </span>
                                <span className="tmxr-benefit__label">{b.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* ── Right: cropped approved image scene + animated overlays ── */}
                <div className="tmxr-window" onMouseMove={handleMove} onMouseLeave={handleLeave}>
                    <div className="tmxr-scene" ref={sceneRef}>
                        <img
                            className="tmxr-img"
                            src={IMAGE_SRC}
                            alt="TechMate AI diagnostics scene: an AI assistant core surrounded by device status cards, with a system-scan laptop and phone on a futuristic desk."
                            loading="eager"
                            decoding="async"
                        />
                        <div className="tmxr-ov tmxr-ov--shimmer" aria-hidden="true" />
                        <div className="tmxr-ov tmxr-ov--radial tmxr-ov--blue" aria-hidden="true" />
                        <div className="tmxr-ov tmxr-ov--radial tmxr-ov--purple" aria-hidden="true" />
                        <div className="tmxr-ov tmxr-ov--radial tmxr-ov--cards" aria-hidden="true" />
                        {CARD_GLOWS.map((c) => (
                            <div
                                key={c.key}
                                className="tmxr-ov tmxr-ov--radial tmxr-ov--card"
                                style={{ left: c.left, top: c.top, animationDelay: c.delay }}
                                aria-hidden="true"
                            />
                        ))}
                        <div className="tmxr-ov tmxr-ov--radial tmxr-ov--orb" aria-hidden="true" />
                        <div className="tmxr-ov tmxr-ov--radial tmxr-ov--eyes" aria-hidden="true" />
                        <div className="tmxr-ov tmxr-ov--pulse" aria-hidden="true" />
                        <div className="tmxr-ov tmxr-ov--pulse tmxr-ov--pulse-2" aria-hidden="true" />
                        <div className="tmxr-ov tmxr-ov--radial tmxr-ov--laptop" aria-hidden="true" />
                        <div className="tmxr-ov tmxr-ov--radial tmxr-ov--phone" aria-hidden="true" />
                        <div className="tmxr-ov tmxr-ov--desk" aria-hidden="true" />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default TechMateHero;
