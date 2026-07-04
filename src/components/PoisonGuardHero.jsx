import "./PoisonGuardHero.css";

/*
 * PoisonGuardHero — animated AI hazard-scanning hero.
 * Converted from the approved Claude Design export "PoisonGuard Hero Animation".
 * Self-contained, scoped under `.poison-guard-hero`, lightweight CSS-only
 * animations, no external/paid deps. Renders an <h2> by default; pass
 * headingLevel="h1" when it is the page's main hero.
 */

// Fixed particle field. Kept to the right (scene) half so none land in the
// copy column under the subheadline and read as an accidental stray dot.
const PARTICLES = [
    { left: "58%", top: "70%", size: 4, dur: 9, delay: 0, blue: false },
    { left: "66%", top: "85%", size: 3, dur: 11, delay: 2, blue: true },
    { left: "74%", top: "78%", size: 4, dur: 10, delay: 4, blue: false },
    { left: "55%", top: "88%", size: 3, dur: 12, delay: 1, blue: true },
    { left: "68%", top: "75%", size: 5, dur: 9.5, delay: 3, blue: false },
    { left: "80%", top: "82%", size: 3, dur: 11.5, delay: 5, blue: true },
    { left: "90%", top: "68%", size: 4, dur: 10.5, delay: 2.5, blue: false },
    { left: "84%", top: "92%", size: 4, dur: 13, delay: 6, blue: true },
];

function PoisonGuardHero({
    alertState = "hazard",
    scanSpeed = 8,
    showLabels = true,
    headingLevel = "h2",
    primaryHref = "#features",
    secondaryHref = "#product-ecosystem-title",
}) {
    const Heading = headingLevel;
    const hazardActive = alertState === "hazard";
    const statusText = hazardActive
        ? "Poison Guard · 1 hazard flagged"
        : "Poison Guard · all clear";

    return (
        <section className={`poison-guard-hero ${hazardActive ? "pgh--hazard" : "pgh--clear"}`}>
            <div className="pgh-glow pgh-glow--a" aria-hidden="true" />
            <div className="pgh-glow pgh-glow--b" aria-hidden="true" />
            {PARTICLES.map((p, i) => (
                <span
                    key={i}
                    className="pgh-particle"
                    aria-hidden="true"
                    style={{
                        left: p.left,
                        top: p.top,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        background: p.blue ? "rgba(77,159,255,0.7)" : "rgba(52,211,153,0.7)",
                        animationDuration: `${p.dur}s`,
                        animationDelay: `${p.delay}s`,
                    }}
                />
            ))}

            <div className="pgh-inner">
                {/* ── Copy column ── */}
                <div className="pgh-copy">
                    <div className="pgh-eyebrow">
                        <span className="pgh-eyebrow__dot" />
                        <span className="pgh-eyebrow__text">CinNova · Poison Guard</span>
                    </div>

                    <Heading className="pgh-title">
                        Poison Guard: AI{" "}Safety for Everyday{" "}Homes
                    </Heading>

                    <p className="pgh-lede">
                        An intelligent home safety assistant that helps families identify
                        household hazards, toxic items, and child safety risks before accidents
                        happen.
                    </p>

                    <div className="pgh-actions">
                        <a href={primaryHref} className="pgh-btn pgh-btn--primary">
                            Explore Poison Guard
                        </a>
                        <a href={secondaryHref} className="pgh-btn pgh-btn--ghost">
                            View Product Ecosystem
                        </a>
                    </div>

                    <div className="pgh-tags">
                        <span className="pgh-tag">
                            <span className="pgh-tag__dot" style={{ background: "#34D399" }} />
                            Real-time hazard scanning
                        </span>
                        <span className="pgh-tag">
                            <span className="pgh-tag__dot" style={{ background: "#4D9FFF" }} />
                            Child-safe zone mapping
                        </span>
                    </div>
                </div>

                {/* ── Scan panel scene (decorative) ── */}
                <div className="pgh-scene-col">
                    <div className="pgh-panel" aria-hidden="true">
                        <div className="pgh-wall" />
                        <div className="pgh-cabinet pgh-cabinet--l">
                            <div className="pgh-cabinet__handle" />
                        </div>
                        <div className="pgh-cabinet pgh-cabinet--r">
                            <div className="pgh-cabinet__handle" />
                        </div>
                        <div className="pgh-counter" />
                        <div className="pgh-floor" />

                        <div className="pgh-orb">
                            <div className="pgh-orb__ring pgh-orb__ring--1" />
                            <div className="pgh-orb__ring pgh-orb__ring--2" />
                            <div className="pgh-orb__core" />
                        </div>

                        {hazardActive ? <div className="pgh-beam" /> : null}

                        <div className="pgh-bottle-safe pgh-bottle-safe--1">
                            <div className="pgh-bottle-safe__cap" />
                            <div className="pgh-bottle-safe__band" />
                        </div>
                        <div className="pgh-bottle-safe pgh-bottle-safe--2">
                            <div className="pgh-bottle-safe__cap" />
                        </div>

                        <div className="pgh-hazard">
                            <div className="pgh-shield" />
                            {hazardActive ? (
                                <>
                                    <div className="pgh-warn pgh-warn--1" />
                                    <div className="pgh-warn pgh-warn--2" />
                                </>
                            ) : null}
                            <div className="pgh-bottle">
                                <div className="pgh-bottle__cap" />
                                <div className="pgh-bottle__label">
                                    <span>CHEM</span>
                                </div>
                            </div>
                        </div>

                        <div className="pgh-scan" style={{ animationDuration: `${scanSpeed}s` }} />
                        <div className="pgh-grid" />

                        {showLabels ? (
                            <>
                                {hazardActive ? (
                                    <>
                                        <div className="pgh-label pgh-label--hazard">
                                            <span className="pgh-label__dot" />
                                            <span className="pgh-label__text">Hazard Detected</span>
                                        </div>
                                        <div className="pgh-label pgh-label--toxic">
                                            <span className="pgh-label__dot" />
                                            <span className="pgh-label__text">Toxic Item · Cleaning Agent</span>
                                        </div>
                                        <div className="pgh-label pgh-label--alert">
                                            <span className="pgh-label__dot" />
                                            <span className="pgh-label__text">AI Alert · Child Safety Risk</span>
                                        </div>
                                    </>
                                ) : null}
                                <div className="pgh-label pgh-label--safe">
                                    <span className="pgh-label__dot" />
                                    <span className="pgh-label__text">Safe Zone</span>
                                </div>
                            </>
                        ) : null}

                        <div className="pgh-status">
                            <span className="pgh-status__left">
                                <span className="pgh-status__dot" />
                                {statusText}
                            </span>
                            <span className="pgh-status__cycle">Scan cycle · continuous</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default PoisonGuardHero;
