import { useRef } from "react";
import "./PoisonGuardHeroReview.prototype.css";

/*
 * PoisonGuardHeroReview — approved-image PoisonGuard hero (PROTOTYPE).
 *
 * Left column is REAL HTML (crisp text, real buttons). Right column is the
 * approved PoisonGuard concept image, cropped to the right ~68% so the baked-in
 * left text is clipped out and replaced by the real copy — the full scanner
 * platform stays visible. Animated emerald/amber overlays (scan rings + beam,
 * leaf pulse, amber base lights, status-card glow, hologrid shimmer, lens glow)
 * sit on top; the lens/core glow parallax toward the cursor.
 *
 * React + CSS only, scoped under `.pgr-hero`. Responsive +
 * prefers-reduced-motion. Review-only — not wired into production.
 *
 * Usage:  <PoisonGuardHeroReview primaryHref="#waitlist" secondaryHref="/?page=resources" />
 */

const IMAGE_SRC = "/prototypes/poisonguard/poisonguard-hero-approved-v1.png";

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
                        <div className="pgr-ov pgr-ov--shimmer" aria-hidden="true" />
                        <div className="pgr-ov pgr-ov--radial pgr-ov--emerald" aria-hidden="true" />
                        <div className="pgr-ov pgr-ov--radial pgr-ov--amber" aria-hidden="true" />
                        <div className="pgr-ov pgr-ov--radial pgr-ov--cards" aria-hidden="true" />
                        {CARD_GLOWS.map((c) => (
                            <div
                                key={c.key}
                                className={`pgr-ov pgr-ov--radial pgr-ov--card${c.warn ? " pgr-ov--card-warn" : ""}`}
                                style={{ left: c.left, top: c.top, animationDelay: c.delay }}
                                aria-hidden="true"
                            />
                        ))}
                        <div className="pgr-ov pgr-ov--radial pgr-ov--leaf" aria-hidden="true" />
                        <div className="pgr-ov pgr-ov--radial pgr-ov--core" aria-hidden="true" />
                        <div className="pgr-ov pgr-ov--ring" aria-hidden="true" />
                        <div className="pgr-ov pgr-ov--ring pgr-ov--ring-2" aria-hidden="true" />
                        <div className="pgr-ov pgr-ov--beam" aria-hidden="true" />
                        <div className="pgr-ov pgr-ov--radial pgr-ov--lens" aria-hidden="true" />
                        <div className="pgr-ov pgr-ov--base" aria-hidden="true" />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default PoisonGuardHeroReview;
