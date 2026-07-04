import { useRef } from "react";
import "./TechMateHero.prototype.css";

/*
 * TechMateHero — approved-image hero with animated glow overlays (PROTOTYPE).
 *
 * Uses the actual approved concept PNG as the base hero visual, with animated
 * `mix-blend-mode: screen` overlays on top (blue/purple ambient breathing,
 * shimmer, AI-core + eye glow, expanding energy rings, per-icon status-card
 * glow, laptop/phone screen glow, stronger pulsing purple desk-edge glow). The
 * AI core + eyes parallax toward the cursor so the robot appears to follow the
 * mouse, easing back to center on leave; on touch / reduced-motion it falls back
 * to the calm idle glow. React + CSS only, scoped under `.tmx-hero`. Responsive
 * + prefers-reduced-motion. Not wired into production.
 *
 * Image (served from /public):
 *   /prototypes/techmate/techmate-hero-approved-v1.png
 *
 * Usage:  <TechMateHero primaryHref="#waitlist" secondaryHref="#waitlist" />
 */

const IMAGE_SRC = "/prototypes/techmate/techmate-hero-approved-v1.png";

// Glow positions over each baked-in status-card icon (% of the image).
const CARD_GLOWS = [
    { key: "wifi", left: "50%", top: "19.5%", delay: "0s" },
    { key: "laptop", left: "66%", top: "15%", delay: "0.4s" },
    { key: "security", left: "83.5%", top: "19.5%", delay: "0.8s" },
    { key: "phone", left: "48%", top: "34%", delay: "1.2s" },
    { key: "home", left: "84%", top: "34%", delay: "1.6s" },
    { key: "printer", left: "48%", top: "45%", delay: "2s" },
];

function prefersReducedMotion() {
    return typeof window !== "undefined" && window.matchMedia
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;
}

function TechMateHero({ primaryHref = "#", secondaryHref = "#" }) {
    const photoRef = useRef(null);
    const rafRef = useRef(0);

    function handleMove(event) {
        const el = photoRef.current;
        if (!el || prefersReducedMotion()) return;
        const rect = el.getBoundingClientRect();
        const nx = (event.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
        const ny = (event.clientY - rect.top) / rect.height - 0.5;
        if (rafRef.current) return;
        rafRef.current = requestAnimationFrame(() => {
            rafRef.current = 0;
            // eyes track more than the core; CSS transition smooths the follow
            el.style.setProperty("--tmx-ex", `${(nx * 22).toFixed(1)}px`);
            el.style.setProperty("--tmx-ey", `${(ny * 16).toFixed(1)}px`);
            el.style.setProperty("--tmx-px", `${(nx * 11).toFixed(1)}px`);
            el.style.setProperty("--tmx-py", `${(ny * 8).toFixed(1)}px`);
        });
    }

    function handleLeave() {
        const el = photoRef.current;
        if (!el) return;
        el.style.setProperty("--tmx-ex", "0px");
        el.style.setProperty("--tmx-ey", "0px");
        el.style.setProperty("--tmx-px", "0px");
        el.style.setProperty("--tmx-py", "0px");
    }

    return (
        <section className="tmx-hero">
            <div className="tmx-photo" ref={photoRef} onMouseMove={handleMove} onMouseLeave={handleLeave}>
                <img
                    className="tmx-photo__img"
                    src={IMAGE_SRC}
                    alt="TechMate AI — your AI-powered tech support companion: an AI assistant core surrounded by device status cards, a system-scan laptop and phone on a futuristic desk."
                    loading="eager"
                    decoding="async"
                />

                {/* Animated glow overlays (additive light over the flattened art) */}
                <div className="tmx-ov tmx-ov--shimmer" aria-hidden="true" />
                <div className="tmx-ov tmx-ov--radial tmx-ov--blue" aria-hidden="true" />
                <div className="tmx-ov tmx-ov--radial tmx-ov--purple" aria-hidden="true" />
                <div className="tmx-ov tmx-ov--radial tmx-ov--cards" aria-hidden="true" />

                {/* per-icon status-card glows */}
                {CARD_GLOWS.map((c) => (
                    <div
                        key={c.key}
                        className="tmx-ov tmx-ov--radial tmx-ov--card"
                        style={{ left: c.left, top: c.top, animationDelay: c.delay }}
                        aria-hidden="true"
                    />
                ))}

                <div className="tmx-ov tmx-ov--radial tmx-ov--orb" aria-hidden="true" />
                <div className="tmx-ov tmx-ov--radial tmx-ov--eyes" aria-hidden="true" />
                <div className="tmx-ov tmx-ov--pulse" aria-hidden="true" />
                <div className="tmx-ov tmx-ov--pulse tmx-ov--pulse-2" aria-hidden="true" />
                <div className="tmx-ov tmx-ov--radial tmx-ov--laptop" aria-hidden="true" />
                <div className="tmx-ov tmx-ov--radial tmx-ov--phone" aria-hidden="true" />
                <div className="tmx-ov tmx-ov--desk" aria-hidden="true" />

                {/* Transparent clickable hotspots over the baked-in CTA buttons */}
                <a className="tmx-hotspot tmx-hotspot--primary" href={primaryHref} aria-label="Get TechMate AI" />
                <a className="tmx-hotspot tmx-hotspot--secondary" href={secondaryHref} aria-label="Join Waitlist" />
            </div>
        </section>
    );
}

export default TechMateHero;
