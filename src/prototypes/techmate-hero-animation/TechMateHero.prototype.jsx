import "./TechMateHero.prototype.css";

/*
 * TechMateHero — approved-image hero with animated glow overlays (PROTOTYPE).
 *
 * Uses the actual approved concept PNG as the base hero visual, with animated
 * `mix-blend-mode: screen` overlays layered on top (blue/purple ambient pulses,
 * shimmer, AI-core + eye glow, expanding energy rings, card/laptop/phone screen
 * glow, purple desk-edge glow). React + CSS only, no libraries. Scoped under
 * `.tmx-hero`. Responsive + prefers-reduced-motion. Not wired into production.
 *
 * The approved image is served from /public:
 *   /prototypes/techmate/techmate-hero-approved-v1.png
 *
 * Usage:  <TechMateHero primaryHref="#waitlist" secondaryHref="#waitlist" />
 */

const IMAGE_SRC = "/prototypes/techmate/techmate-hero-approved-v1.png";

function TechMateHero({ primaryHref = "#", secondaryHref = "#" }) {
    return (
        <section className="tmx-hero">
            <div className="tmx-photo">
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
