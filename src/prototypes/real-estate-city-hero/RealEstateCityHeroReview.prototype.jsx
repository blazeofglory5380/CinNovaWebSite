import { useRef } from "react";
import "./RealEstateCityHeroReview.prototype.css";

/*
 * RealEstateCityHeroReview — full-bleed Real Estate AI hero (PROTOTYPE).
 *
 * The approved moonlit-city concept image is the ENTIRE hero background
 * (object-fit: cover, full width/height — never boxed). A left-weighted dark
 * scrim keeps the real HTML copy readable. Subtle screen-blend overlays add
 * life: moon + water breathing glow, bridge/car-trail glow, city shimmer, a
 * faint AI grid, pulsing market nodes, slow scanning arcs, and glassy floating
 * "intelligence" cards. Scoped under `.rex-hero`; `rex-`-prefixed keyframes.
 *
 * React + CSS only. Responsive + prefers-reduced-motion. Review-only — not wired
 * into production (the live Real Estate page keeps its 3D ProductHero3D hero).
 *
 * Usage:  <RealEstateCityHeroReview primaryHref="#" secondaryHref="#" />
 */

const IMAGE_SRC = "/prototypes/real-estate/real-estate-ai-city-hero-approved-v1.png";

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

function RealEstateCityHeroReview({ primaryHref = "#", secondaryHref = "#" }) {
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
            <div className="rex-haze" aria-hidden="true" />

            {/* ── Cinematic overlays (screen-blend light) ── */}
            <div className="rex-ov rex-ov--moon" aria-hidden="true" />
            <div className="rex-ov rex-ov--moon-core" aria-hidden="true" />
            <div className="rex-ov rex-ov--water" aria-hidden="true" />
            <div className="rex-ov rex-ov--bridge" aria-hidden="true" />
            <div className="rex-ov rex-ov--trail" aria-hidden="true" />
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
                        CinNova Real Estate AI
                    </p>
                    <h1 className="rex-title">AI for Smarter Real Estate Decisions</h1>
                    <p className="rex-lede">
                        Analyze markets, compare neighborhoods, and uncover investment opportunities with
                        AI-powered real estate intelligence.
                    </p>
                    <div className="rex-actions">
                        <a className="rex-btn rex-btn--primary" href={primaryHref}>Explore Real Estate AI</a>
                        <a className="rex-btn rex-btn--ghost" href={secondaryHref}>View Dashboard</a>
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

export default RealEstateCityHeroReview;
