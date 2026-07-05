import { useRef } from "react";
import "./PoisonGuardHeroReview.css";

/*
 * PoisonGuardHeroReview — approved image-based PoisonGuard hero.
 *
 * Left column is REAL HTML (crisp text, real buttons). Right column is the
 * approved PoisonGuard scene image, cropped to the right ~70% so the baked-in
 * left text is clipped out and replaced by the real copy — the full scanner
 * platform stays visible. The scene is frameless: an all-edge mask feathers it
 * into the hero background (no card/box). Animated emerald/amber overlays (scan
 * rings + beam, leaf breeze, amber base lights, status-card glow, hologrid
 * shimmer, lens/logo glow, drifting particles) sit on top; the lens/core glow
 * parallax toward the cursor.
 *
 * React + CSS only, scoped under `.pgr-hero`. Responsive +
 * prefers-reduced-motion.
 *
 * Usage:  <PoisonGuardHeroReview primaryHref="#waitlist" secondaryHref="/?page=resources" />
 */

const IMAGE_SRC = "/images/products/poisonguard/poisonguard-hero-approved-v1.png";

// Glow positions over each baked-in status-card (% of the image).
const CARD_GLOWS = [
    { key: "plant", left: "49%", top: "23%", delay: "0s" },
    { key: "pet", left: "88%", top: "23%", delay: "0.4s" },
    { key: "toxic", left: "49%", top: "41%", delay: "0.8s", warn: true },
    { key: "outdoor", left: "88%", top: "41%", delay: "1.2s" },
    { key: "skin", left: "48%", top: "57%", delay: "1.6s" },
    { key: "leaf", left: "90%", top: "62%", delay: "2s" },
];

const BENEFITS = ["Families", "Pets", "Schools"];

// Drifting emerald light motes (positions in % of the image, over the scene).
const PARTICLES = [
    { left: "58%", top: "40%", dur: 7.5, delay: 0 },
    { left: "72%", top: "34%", dur: 9, delay: 1.4 },
    { left: "64%", top: "56%", dur: 8.2, delay: 2.6 },
    { left: "80%", top: "50%", dur: 10, delay: 0.8 },
    { left: "55%", top: "62%", dur: 8.8, delay: 3.4 },
    { left: "76%", top: "66%", dur: 9.6, delay: 1.9 },
    { left: "68%", top: "28%", dur: 7.8, delay: 4.2 },
];

function prefersReducedMotion() {
    return typeof window !== "undefined" && window.matchMedia
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;
}

function PoisonGuardHeroReview({ primaryHref = "#", secondaryHref = "#" }) {
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
            el.style.setProperty("--pgr-lx", `${(nx * 20).toFixed(1)}px`);
            el.style.setProperty("--pgr-ly", `${(ny * 14).toFixed(1)}px`);
            el.style.setProperty("--pgr-cx", `${(nx * 11).toFixed(1)}px`);
            el.style.setProperty("--pgr-cy", `${(ny * 8).toFixed(1)}px`);
        });
    }

    function handleLeave() {
        const el = sceneRef.current;
        if (!el) return;
        el.style.setProperty("--pgr-lx", "0px");
        el.style.setProperty("--pgr-ly", "0px");
        el.style.setProperty("--pgr-cx", "0px");
        el.style.setProperty("--pgr-cy", "0px");
    }

    return (
        <section className="pgr-hero">
            <div className="pgr-inner">
                {/* ── Left: real HTML copy ── */}
                <div className="pgr-copy">
                    <p className="pgr-eyebrow">
                        <span className="pgr-eyebrow__dot" />
                        PoisonGuard
                    </p>
                    <h1 className="pgr-title">
                        Know what you are dealing with <span className="pgr-title__grad">before panic sets in.</span>
                    </h1>
                    <p className="pgr-lede">
                        Scan unknown substances, understand risk levels, and get clear next-step guidance
                        for families, pets, and schools.
                    </p>
                    <div className="pgr-actions">
                        <a className="pgr-btn pgr-btn--primary" href={primaryHref}>Join Waitlist</a>
                        <a className="pgr-btn pgr-btn--ghost" href={secondaryHref}>Safety Resources</a>
                    </div>
                    <ul className="pgr-benefits">
                        {BENEFITS.map((b) => (
                            <li className="pgr-benefit" key={b}>
                                <span className="pgr-benefit__dot" />
                                {b}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* ── Right: cropped approved image scene + animated overlays ── */}
                <div className="pgr-window" onMouseMove={handleMove} onMouseLeave={handleLeave}>
                    <div className="pgr-scene" ref={sceneRef}>
                        <img
                            className="pgr-img"
                            src={IMAGE_SRC}
                            alt="PoisonGuard AI plant & pet safety scanner: a poison-oak leaf on a scanning platform with emerald scan rings and floating risk-analysis cards."
                            loading="eager"
                            decoding="async"
                            onError={(e) => {
                                // graceful degrade: hide a broken image so the dark
                                // scene + glow remain, never alt-text sprawl.
                                e.currentTarget.style.visibility = "hidden";
                            }}
                        />
                        {/* swaying leaf layer: same image masked to the leaf, gentle breeze */}
                        <img
                            className="pgr-leaf-layer"
                            src={IMAGE_SRC}
                            alt=""
                            aria-hidden="true"
                            loading="eager"
                            decoding="async"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                        <div className="pgr-ov pgr-ov--shimmer" aria-hidden="true" />
                        <div className="pgr-ov pgr-ov--radial pgr-ov--emerald-wide" aria-hidden="true" />
                        <div className="pgr-ov pgr-ov--radial pgr-ov--emerald" aria-hidden="true" />
                        <div className="pgr-ov pgr-ov--radial pgr-ov--amber" aria-hidden="true" />
                        {PARTICLES.map((p, i) => (
                            <span
                                key={i}
                                className="pgr-particle"
                                style={{ left: p.left, top: p.top, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` }}
                                aria-hidden="true"
                            />
                        ))}
                        <div className="pgr-ov pgr-ov--radial pgr-ov--cards" aria-hidden="true" />
                        {CARD_GLOWS.map((c) => (
                            <div
                                key={c.key}
                                className={`pgr-ov pgr-ov--radial pgr-ov--card${c.warn ? " pgr-ov--card-warn" : ""}`}
                                style={{ left: c.left, top: c.top, animationDelay: c.delay }}
                                aria-hidden="true"
                            />
                        ))}
                        <div className="pgr-ov pgr-ov--radial pgr-ov--spill" aria-hidden="true" />
                        <div className="pgr-ov pgr-ov--radial pgr-ov--leaf" aria-hidden="true" />
                        <div className="pgr-ov pgr-ov--radial pgr-ov--core" aria-hidden="true" />
                        <div className="pgr-ov pgr-ov--ring" aria-hidden="true" />
                        <div className="pgr-ov pgr-ov--ring pgr-ov--ring-2" aria-hidden="true" />
                        <div className="pgr-ov pgr-ov--beam" aria-hidden="true" />
                        <div className="pgr-ov pgr-ov--beam-core" aria-hidden="true" />
                        <div className="pgr-ov pgr-ov--radial pgr-ov--lens" aria-hidden="true" />
                        <div className="pgr-ov pgr-ov--radial pgr-ov--logo" aria-hidden="true" />
                        <div className="pgr-ov pgr-ov--base" aria-hidden="true" />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default PoisonGuardHeroReview;
