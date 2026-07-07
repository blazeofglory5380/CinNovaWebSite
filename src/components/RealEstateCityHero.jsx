import { useRef } from "react";
import "./RealEstateCityHero.css";

/*
 * RealEstateCityHero — full-bleed Real Estate AI hero.
 *
 * The approved moonlit-city image is the ENTIRE hero background (object-fit:
 * cover, full width/height — never boxed). A left-weighted dark scrim keeps the
 * real HTML copy readable. Cinematic screen-blend overlays add life: a threshold
 * light bloom (every light glows in its own colour), slow drifting clouds in the
 * upper sky, an alternating warm-light "living pulse" (left/right/center zones)
 * with matching warm water reflections, moon + blue-white water glow, faint AI
 * grid, pulsing market nodes, scanning arcs, and glassy floating intelligence
 * cards. Scoped under `.rex-hero`; `rex-`-prefixed keyframes.
 *
 * React + CSS only. Responsive + prefers-reduced-motion.
 *
 * Usage:  <RealEstateCityHero primaryHref="#features" secondaryHref="#tools" />
 */

const IMAGE_SRC = "/images/products/real-estate/real-estate-ai-city-hero-approved-v1.png";

const PROOF = ["Market Signals", "Deal Scoring", "Investment Insights"];

// Floating intelligence cards (positioned over the lower-right of the image).
const CARDS = [
    { key: "heat", label: "Market Heat", value: "High", tone: "hot", delay: "0s" },
    { key: "deal", label: "Deal Score", value: "92", tone: "good", delay: "0.5s" },
    { key: "rent", label: "Rent Potential", value: "Strong", tone: "good", delay: "1s" },
    { key: "risk", label: "Risk Level", value: "Moderate", tone: "warn", delay: "1.5s" },
];

// Pulsing market nodes over notable city points (% of the image).
const NODES = [
    { left: "54%", top: "34%", delay: "0s" },   // central tower
    { left: "38%", top: "46%", delay: "0.7s" },
    { left: "68%", top: "44%", delay: "1.3s" },
    { left: "24%", top: "44%", delay: "1.9s" },  // left bridge
    { left: "85%", top: "60%", delay: "2.4s" },  // right bridge
    { left: "14%", top: "64%", delay: "3s" },
];

function RealEstateCityHero({
    primaryHref = "#",
    secondaryHref = "#",
    primaryLabel = "Explore Real Estate AI",
    secondaryLabel = "View Dashboard",
    onPrimaryClick,
}) {
    const primaryIsExternal = /^https?:\/\//.test(primaryHref);
    const heroRef = useRef(null);

    return (
        <section className="rex-hero" ref={heroRef}>
            {/* ── Full-bleed approved city image ── */}
            <img
                className="rex-bg"
                src={IMAGE_SRC}
                alt="Moonlit city skyline at night with lit skyscrapers, bridges, car-light trails, and a bright moon reflected on the river — CinNova Real Estate AI."
                loading="eager"
                decoding="async"
                onError={(e) => {
                    // graceful degrade: keep the dark scene, never alt-text sprawl.
                    e.currentTarget.style.visibility = "hidden";
                }}
            />

            {/* ── Bloom layers: brightened + blurred copies of the same image,
                 screen-blended so every baked-in light (windows, car trails,
                 bridges, moon, water) blooms into a cinematic glow. The dark sky
                 stays dark under a screen blend, so composition is unchanged. ── */}
            <img className="rex-bloom" src={IMAGE_SRC} alt="" aria-hidden="true" loading="eager" decoding="async"
                onError={(e) => { e.currentTarget.style.display = "none"; }} />
            <img className="rex-bloom rex-bloom--wide" src={IMAGE_SRC} alt="" aria-hidden="true" loading="eager" decoding="async"
                onError={(e) => { e.currentTarget.style.display = "none"; }} />

            {/* ── Slow drifting clouds (masked to the upper sky only) ── */}
            <div className="rex-clouds" aria-hidden="true" />
            <div className="rex-clouds rex-clouds--2" aria-hidden="true" />

            {/* ── Targeted colored glows (screen-blend additive light) ── */}
            <div className="rex-ov rex-ov--moon" aria-hidden="true" />
            <div className="rex-ov rex-ov--moon-core" aria-hidden="true" />
            <div className="rex-ov rex-ov--water" aria-hidden="true" />
            <div className="rex-ov rex-ov--skyline" aria-hidden="true" />
            <div className="rex-ov rex-ov--gold" aria-hidden="true" />
            <div className="rex-ov rex-ov--bridge" aria-hidden="true" />
            <div className="rex-ov rex-ov--trail" aria-hidden="true" />

            {/* ── Warm-light "living pulse": left / right / center zones cycle
                 brightness out of phase (one side brightens while the other dims,
                 then alternate). Water reflections pulse in sync with their zone. ── */}
            <div className="rex-warm rex-warm--l1" aria-hidden="true" />
            <div className="rex-warm rex-warm--l2" aria-hidden="true" />
            <div className="rex-warm rex-warm--lwater" aria-hidden="true" />
            <div className="rex-warm rex-warm--r1" aria-hidden="true" />
            <div className="rex-warm rex-warm--r2" aria-hidden="true" />
            <div className="rex-warm rex-warm--rwater" aria-hidden="true" />
            <div className="rex-warm rex-warm--c1" aria-hidden="true" />
            <div className="rex-warm rex-warm--cwater" aria-hidden="true" />
            <div className="rex-ov rex-ov--shimmer" aria-hidden="true" />
            <div className="rex-grid" aria-hidden="true" />
            <div className="rex-arc" aria-hidden="true" />
            <div className="rex-arc rex-arc--2" aria-hidden="true" />
            {NODES.map((n, i) => (
                <span
                    key={i}
                    className="rex-node"
                    style={{ left: n.left, top: n.top, animationDelay: n.delay }}
                    aria-hidden="true"
                />
            ))}

            {/* ── Legibility scrim (left-weighted + bottom) + cinematic vignette ── */}
            <div className="rex-scrim" aria-hidden="true" />
            <div className="rex-vignette" aria-hidden="true" />

            {/* ── Left: real HTML copy ── */}
            <div className="rex-inner">
                <div className="rex-copy">
                    <p className="rex-eyebrow">
                        <span className="rex-eyebrow__dot" />
                        CinNova Real Estate AI · Live Beta
                    </p>
                    <h1 className="rex-title">AI for Smarter Real Estate Decisions</h1>
                    <p className="rex-lede">
                        Analyze markets, compare neighborhoods, and uncover investment opportunities with
                        AI-powered real estate intelligence.
                    </p>
                    <div className="rex-actions">
                        <a
                            className="rex-btn rex-btn--primary"
                            href={primaryHref}
                            onClick={onPrimaryClick}
                            {...(primaryIsExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                            {primaryLabel}
                        </a>
                        <a className="rex-btn rex-btn--ghost" href={secondaryHref}>{secondaryLabel}</a>
                    </div>
                    <ul className="rex-proof">
                        {PROOF.map((p) => (
                            <li className="rex-proof__item" key={p}>
                                <span className="rex-proof__dot" />
                                {p}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* ── Floating intelligence cards (lower-right) ── */}
            <div className="rex-cards" aria-hidden="true">
                {CARDS.map((c) => (
                    <div
                        key={c.key}
                        className={`rex-card rex-card--${c.tone}`}
                        style={{ animationDelay: c.delay }}
                    >
                        <span className="rex-card__label">{c.label}</span>
                        <span className="rex-card__value">{c.value}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default RealEstateCityHero;
