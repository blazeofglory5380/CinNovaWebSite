import "./TechMateHero.prototype.css";

/*
 * TechMateHero — animated AI tech-support hero (PROTOTYPE).
 * Standalone React + CSS. No external libraries, no images, no 3D: the scene
 * (glowing robot-face core, floating status cards, laptop / phone, desk-edge
 * glow) is pure CSS + inline SVG, scoped under `.tmx-hero`. Honors
 * prefers-reduced-motion and is responsive. Not wired into production.
 *
 * Usage:  <TechMateHero primaryHref="#waitlist" secondaryHref="#waitlist" />
 */

const PARTICLES = [
    { left: "62%", top: "70%", dur: 9, delay: 0 },
    { left: "72%", top: "80%", dur: 11, delay: 2 },
    { left: "82%", top: "60%", dur: 10, delay: 4 },
    { left: "56%", top: "50%", dur: 12, delay: 1 },
    { left: "88%", top: "48%", dur: 10.5, delay: 3 },
];

const STATUS_CARDS = [
    { key: "wifi", title: "Wi-Fi Network", status: "Optimal",
        icon: (<><path d="M2 8.5a15 15 0 0120 0M5 12a10 10 0 0114 0M8.5 15.5a5 5 0 017 0" /><circle cx="12" cy="19" r="1.2" fill="currentColor" /></>) },
    { key: "laptop", title: "Laptop", status: "Healthy",
        icon: (<><rect x="4" y="5" width="16" height="10" rx="1.5" /><path d="M2 19h20" /></>) },
    { key: "security", title: "Security", status: "Protected",
        icon: (<><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" /><path d="M9 12l2 2 4-4" /></>) },
    { key: "phone", title: "Phone", status: "Optimal",
        icon: (<><rect x="7" y="3" width="10" height="18" rx="2" /><path d="M11 18h2" /></>) },
    { key: "home", title: "Smart Home", status: "Connected",
        icon: (<><path d="M4 11l8-6 8 6" /><path d="M6 10v9h12v-9" /><rect x="10" y="13" width="4" height="6" /></>) },
    { key: "printer", title: "Printer", status: "Ready",
        icon: (<><path d="M6 9V4h12v5" /><rect x="4" y="9" width="16" height="7" rx="1.5" /><rect x="7" y="15" width="10" height="5" /></>) },
];

const BENEFITS = [
    { label: "Smart Diagnostics", icon: (<><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" /><path d="M9 12l2 2 4-4" /></>) },
    { label: "Instant Solutions", icon: <path d="M13 2L4 14h6l-1 8 9-12h-6z" /> },
    { label: "24/7 AI Support", icon: (<><path d="M4 13a8 8 0 0116 0" /><rect x="3" y="13" width="4" height="7" rx="2" /><rect x="17" y="13" width="4" height="7" rx="2" /></>) },
    { label: "Secure & Private", icon: (<><rect x="4" y="10" width="16" height="11" rx="2.5" /><path d="M8 10V7a4 4 0 018 0v3" /></>) },
];

const CHECK = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12l5 5L20 6" />
    </svg>
);

function TechMateHero({ primaryHref = "#", secondaryHref = "#" }) {
    return (
        <section className="tmx-hero">
            <div className="tmx-bg" aria-hidden="true">
                <span className="tmx-glow tmx-glow--blue" />
                <span className="tmx-glow tmx-glow--purple" />
                <span className="tmx-glow tmx-glow--cyan" />
                <div className="tmx-grid" />
                {PARTICLES.map((p, i) => (
                    <span
                        key={i}
                        className="tmx-particle"
                        style={{ left: p.left, top: p.top, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` }}
                    />
                ))}
            </div>

            <div className="tmx-inner">
                {/* ── Left copy ── */}
                <div className="tmx-copy">
                    <p className="tmx-eyebrow">
                        <span className="tmx-eyebrow__dot" />
                        TechMate AI
                    </p>
                    <h1 className="tmx-title">
                        Your AI-powered <span className="tmx-title__grad">tech support</span> companion.
                    </h1>
                    <p className="tmx-lede">
                        TechMate AI diagnoses issues, provides step-by-step solutions, and keeps your
                        devices, network, and smart home running at peak performance.
                    </p>
                    <div className="tmx-actions">
                        <a className="tmx-btn tmx-btn--primary" href={primaryHref}>
                            Get TechMate AI
                            <svg className="tmx-btn__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M13 6l6 6-6 6" />
                            </svg>
                        </a>
                        <a className="tmx-btn tmx-btn--ghost" href={secondaryHref}>
                            Join Waitlist
                        </a>
                    </div>
                    <ul className="tmx-benefits">
                        {BENEFITS.map((b) => (
                            <li className="tmx-benefit" key={b.label}>
                                <span className="tmx-benefit__ico">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        {b.icon}
                                    </svg>
                                </span>
                                <span className="tmx-benefit__label">{b.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* ── Right scene ── */}
                <div className="tmx-scene" aria-hidden="true">
                    <div className="tmx-stage">
                        <svg className="tmx-links" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="tmxLine" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0" stopColor="#22d3ee" stopOpacity="0.9" />
                                    <stop offset="1" stopColor="#8b5cf6" stopOpacity="0.5" />
                                </linearGradient>
                            </defs>
                            {["M50 44 L12 12", "M50 44 L47 7", "M50 44 L88 14", "M50 44 L8 37", "M50 44 L92 41", "M50 44 L11 58"].map((d) => (
                                <path key={d} className="tmx-link" vectorEffect="non-scaling-stroke" d={d} />
                            ))}
                        </svg>

                        {STATUS_CARDS.map((c) => (
                            <div className={`tmx-card tmx-card--${c.key}`} key={c.key}>
                                <div className="tmx-card__row">
                                    <span className="tmx-card__ico">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                            {c.icon}
                                        </svg>
                                    </span>
                                    <div>
                                        <div className="tmx-card__title">{c.title}</div>
                                        <div className="tmx-card__status">Status: <b>{c.status}</b></div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="tmx-orb">
                            <span className="tmx-orb__ring tmx-orb__ring--1" />
                            <span className="tmx-orb__ring tmx-orb__ring--2" />
                            <span className="tmx-orb__ring tmx-orb__ring--3" />
                            <span className="tmx-orb__core" />
                            <div className="tmx-robot">
                                <svg viewBox="0 0 200 190">
                                    <line className="tmx-robot__antenna" x1="100" y1="44" x2="100" y2="26" />
                                    <circle className="tmx-robot__antenna-tip" cx="100" cy="20" r="5.5" />
                                    <rect className="tmx-robot__ear" x="28" y="80" width="13" height="34" rx="6" />
                                    <rect className="tmx-robot__ear" x="159" y="80" width="13" height="34" rx="6" />
                                    <rect className="tmx-robot__head" x="42" y="44" width="116" height="102" rx="36" />
                                    <rect className="tmx-robot__face" x="60" y="64" width="80" height="66" rx="26" />
                                    <ellipse className="tmx-robot__eye" cx="84" cy="92" rx="8" ry="9.5" />
                                    <ellipse className="tmx-robot__eye" cx="116" cy="92" rx="8" ry="9.5" />
                                    <path className="tmx-robot__smile" d="M82 108 Q100 124 118 108" />
                                </svg>
                            </div>
                        </div>

                        <div className="tmx-pedestal" />

                        <div className="tmx-device tmx-device--laptop">
                            <div className="tmx-device__scan" />
                            <div className="tmx-device__bar">
                                <span className="tmx-device__dot" />
                                <b>System Scan</b>
                            </div>
                            <div className="tmx-device__body">
                                <div className="tmx-ring-wrap">
                                    <div className="tmx-ring" />
                                    <div className="tmx-ring-val">
                                        <b>100%</b>
                                        <span>OPTIMAL</span>
                                    </div>
                                </div>
                                <ul className="tmx-check">
                                    <li>{CHECK}Wi-Fi</li>
                                    <li>{CHECK}Security</li>
                                    <li>{CHECK}Performance</li>
                                    <li>{CHECK}Drivers</li>
                                </ul>
                            </div>
                        </div>

                        <div className="tmx-device tmx-device--phone">
                            <div className="tmx-device__bar">
                                <span className="tmx-device__dot" />
                                <b>Device Care</b>
                            </div>
                            <div className="tmx-phone-val">
                                <b>98%</b>
                                <span>Excellent</span>
                            </div>
                            <div className="tmx-phone-btn">Optimize</div>
                        </div>

                        <div className="tmx-desk-edge" />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default TechMateHero;