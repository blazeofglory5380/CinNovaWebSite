import { useEffect, useMemo, useRef, useState } from "react";
import "./StudyNestHero.css";

/*
 * StudyNestHero — animated cinematic StudyNest spotlight hero.
 * Converted from the approved Claude Design export "StudyNest Hero Animation".
 * Self-contained and scoped under `.studynest-hero-animation`; renders an <h2>
 * so it integrates as a section without competing with the page's <h1>.
 */

function prefersReducedMotion() {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Deterministic pseudo-random particle field so positions are stable.
function makeParticles(count) {
    const rand = (i, salt) => {
        const v = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
        return v - Math.floor(v);
    };
    const out = [];
    for (let i = 0; i < count; i += 1) {
        const emerald = rand(i, 5) > 0.5;
        out.push({
            left: `${(6 + rand(i, 1) * 88).toFixed(1)}%`,
            top: `${(30 + rand(i, 2) * 62).toFixed(1)}%`,
            size: `${(2 + rand(i, 3) * 3).toFixed(1)}px`,
            dur: `${(7 + rand(i, 4) * 8).toFixed(1)}s`,
            delay: `${(rand(i, 6) * 9).toFixed(1)}s`,
            bg: emerald ? "rgba(22, 226, 154, 0.85)" : "rgba(62, 168, 255, 0.8)",
        });
    }
    return out;
}

const CONNECTIONS = [
    { pos: { left: "50%", bottom: "34%" }, height: "26%", color: "rgba(22, 226, 154, 0.55)", dash: "2.6s", pulse: "4s", pulseDelay: "0s", rotate: 0 },
    { pos: { left: "24%", bottom: "40%" }, height: "30%", color: "rgba(62, 168, 255, 0.5)", dash: "3.2s", pulse: "5s", pulseDelay: "0.6s", rotate: 24 },
    { pos: { right: "23%", bottom: "40%" }, height: "32%", color: "rgba(62, 168, 255, 0.5)", dash: "3s", pulse: "4.4s", pulseDelay: "1.1s", rotate: -26 },
    { pos: { left: "34%", bottom: "42%" }, height: "22%", color: "rgba(22, 226, 154, 0.4)", dash: "3.6s", pulse: "5.2s", pulseDelay: "1.6s", rotate: 10 },
    { pos: { right: "33%", bottom: "42%" }, height: "20%", color: "rgba(22, 226, 154, 0.4)", dash: "2.8s", pulse: "4.8s", pulseDelay: "2s", rotate: -12 },
];

const LEFT_LINES = [
    { w: "74%", bg: "rgba(140, 200, 255, 0.3)", delay: "0s" },
    { w: "88%", bg: "rgba(140, 200, 255, 0.2)", delay: "0.4s" },
    { w: "62%", bg: "rgba(140, 200, 255, 0.24)", delay: "0.8s" },
    { w: "81%", bg: "rgba(22, 226, 154, 0.3)", delay: "1.2s" },
    { w: "55%", bg: "rgba(140, 200, 255, 0.18)", delay: "1.6s" },
];

const BASE_CARD_SHADOW = "0 10px 32px -8px rgba(0, 0, 0, 0.6)";
const CARDS = [
    { label: "Notes", pos: { left: "4%", top: "34%" }, rise: "1.5s", bob: "5.4s", bobDelay: "0.2s", border: "rgba(22, 226, 154, 0.35)", glow: "0 0 22px -4px rgba(22, 226, 154, 0.3)", dot: { background: "#16E29A", borderRadius: "3px", boxShadow: "0 0 10px rgba(22, 226, 154, 0.8)" }, labelColor: "#D9F5EA" },
    { label: "Quiz", pos: { right: "3%", top: "28%" }, rise: "1.8s", bob: "6.2s", bobDelay: "0.8s", border: "rgba(62, 168, 255, 0.38)", glow: "0 0 22px -4px rgba(62, 168, 255, 0.32)", dot: { background: "#3EA8FF", borderRadius: "50%", boxShadow: "0 0 10px rgba(62, 168, 255, 0.85)" }, labelColor: "#D8EAFB" },
    { label: "Flashcards", pos: { left: "12%", top: "12%" }, rise: "2.1s", bob: "5.8s", bobDelay: "1.4s", border: "rgba(62, 168, 255, 0.3)", glow: "0 0 22px -4px rgba(62, 168, 255, 0.26)", dot: { background: "#7CC8FF", transform: "rotate(45deg)", boxShadow: "0 0 10px rgba(124, 200, 255, 0.8)" }, labelColor: "#D8EAFB" },
    { label: "AI Tutor", pos: { right: "10%", top: "9%" }, rise: "2.4s", bob: "6.6s", bobDelay: "0.5s", border: "rgba(22, 226, 154, 0.4)", glow: "0 0 26px -4px rgba(22, 226, 154, 0.35)", dot: { background: "linear-gradient(120deg, #16E29A, #3EA8FF)", borderRadius: "50%", boxShadow: "0 0 12px rgba(22, 226, 154, 0.8)" }, labelColor: "#D9F5EA" },
    { label: "Progress", pos: { left: "30%", top: "3%" }, rise: "2.7s", bob: "5.2s", bobDelay: "1.1s", border: "rgba(140, 190, 255, 0.26)", glow: null, bars: true, labelColor: "#D9F5EA" },
];

function StudyNestHero({
    particleCount = 18,
    parallaxStrength = 1,
    showConnections = true,
    showLabels = true,
    // TODO: replace "#studynest-articles" with the real StudyNest articles
    // route/collection once it exists (no article route ships yet — this is a
    // safe in-page placeholder anchor so the CTA is never a dead external link).
    primaryHref = "#studynest-articles",
    secondaryHref = "#product-ecosystem-title",
}) {
    const sectionRef = useRef(null);
    const rafRef = useRef(0);
    const [pointer, setPointer] = useState({ x: 0, y: 0 });
    const particles = useMemo(() => makeParticles(particleCount), [particleCount]);

    useEffect(() => {
        if (prefersReducedMotion()) return undefined;
        const onMove = (event) => {
            const el = sectionRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const x = (event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5;
            const y = (event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5;
            if (rafRef.current) return;
            rafRef.current = requestAnimationFrame(() => {
                rafRef.current = 0;
                setPointer({ x, y });
            });
        };
        window.addEventListener("mousemove", onMove);
        return () => {
            window.removeEventListener("mousemove", onMove);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    const move = (mx, my) =>
        `translate3d(${(pointer.x * parallaxStrength * mx).toFixed(1)}px, ${(pointer.y * parallaxStrength * my).toFixed(1)}px, 0)`;
    const backT = move(-14, -9);
    const midT = move(10, 7);
    const frontT = move(22, 15);

    return (
        <section ref={sectionRef} className="studynest-hero-animation">
            {/* ambient background (back parallax) */}
            <div className="snh-bg" style={{ transform: backT }} aria-hidden="true">
                <div className="snh-bg__glow snh-bg__glow--a" />
                <div className="snh-bg__glow snh-bg__glow--b" />
                <div className="snh-bg__glow snh-bg__glow--c" />
                <div className="snh-bg__grid" />
            </div>

            <div className="snh-inner">
                {/* ── copy column ── */}
                <div className="snh-copy">
                    <div className="snh-eyebrow snh-reveal" style={{ animationDelay: "0.15s" }}>
                        <span className="snh-eyebrow__dot" />
                        <span className="snh-eyebrow__text">CinNova Blog · Product Spotlight</span>
                    </div>

                    <h2 className="snh-title snh-reveal" style={{ animationDelay: "0.3s" }}>
                        StudyNest: Where <span className="snh-title__accent">Learning Evolves</span>
                    </h2>

                    <p className="snh-lede snh-reveal" style={{ animationDelay: "0.5s" }}>
                        An AI-powered study companion that turns notes, books, and lessons into
                        personalized learning paths, quizzes, and smarter study sessions.
                    </p>

                    <div className="snh-actions snh-reveal" style={{ animationDelay: "0.85s" }}>
                        <a href={primaryHref} className="snh-btn snh-btn--primary">
                            Explore StudyNest Articles
                        </a>
                        <a href={secondaryHref} className="snh-btn snh-btn--ghost">
                            View Product Ecosystem
                        </a>
                    </div>
                </div>

                {/* ── book scene ── */}
                <div className="snh-scene" aria-hidden="true">
                    {/* particles (back) */}
                    <div className="snh-particles" style={{ transform: backT }}>
                        {particles.map((p, i) => (
                            <span
                                key={i}
                                className="snh-particle"
                                style={{
                                    left: p.left,
                                    top: p.top,
                                    width: p.size,
                                    height: p.size,
                                    background: p.bg,
                                    boxShadow: `0 0 8px 1px ${p.bg}`,
                                    animationDuration: p.dur,
                                    animationDelay: p.delay,
                                }}
                            />
                        ))}
                    </div>

                    {/* mid parallax — book */}
                    <div className="snh-mid" style={{ transform: midT }}>
                        <div className="snh-book-wrap">
                            <div className="snh-underglow" />

                            {showConnections ? (
                                <div className="snh-connections">
                                    {CONNECTIONS.map((c, i) => (
                                        <div
                                            key={i}
                                            className="snh-conn"
                                            style={{
                                                ...c.pos,
                                                height: c.height,
                                                transform: `rotate(${c.rotate}deg)`,
                                                transformOrigin: "bottom center",
                                                background: `repeating-linear-gradient(to top, ${c.color} 0 6px, transparent 6px 12px)`,
                                                animation: `snh-line-dash ${c.dash} linear infinite, snh-line-pulse ${c.pulse} ease-in-out ${c.pulseDelay} infinite`,
                                            }}
                                        />
                                    ))}
                                </div>
                            ) : null}

                            {/* open book */}
                            <div className="snh-book">
                                <div className="snh-book__inner">
                                    <div className="snh-book__stack" />
                                    <div className="snh-book__edge" />

                                    {/* left page */}
                                    <div className="snh-page snh-page--left">
                                        <div className="snh-page__lines" style={{ gap: "9px" }}>
                                            {LEFT_LINES.map((l, i) => (
                                                <div
                                                    key={i}
                                                    className="snh-line-text"
                                                    style={{ width: l.w, background: l.bg, animationDelay: l.delay }}
                                                />
                                            ))}
                                        </div>
                                        <div className="snh-shimmer" style={{ animationDelay: "1s" }} />
                                    </div>

                                    {/* right page */}
                                    <div className="snh-page snh-page--right">
                                        <div className="snh-page__lines" style={{ gap: "12px" }}>
                                            <div
                                                className="snh-block"
                                                style={{ border: "1px solid rgba(62, 168, 255, 0.4)", background: "rgba(62, 168, 255, 0.09)", animationDelay: "0.3s" }}
                                            />
                                            <div
                                                className="snh-block"
                                                style={{ border: "1px solid rgba(22, 226, 154, 0.4)", background: "rgba(22, 226, 154, 0.09)", animationDelay: "1.1s" }}
                                            />
                                            <div
                                                className="snh-line-text"
                                                style={{ width: "70%", background: "rgba(140, 200, 255, 0.22)", animationDuration: "4.5s", animationDelay: "1.9s" }}
                                            />
                                        </div>
                                        <div className="snh-shimmer" style={{ animationDelay: "3.4s" }} />
                                    </div>

                                    {/* turning holo page */}
                                    <div className="snh-page-turn" />
                                    {/* spine glow */}
                                    <div className="snh-spine" />
                                </div>
                            </div>

                            {/* rising light column */}
                            <div className="snh-lightcol" />
                        </div>
                    </div>

                    {/* front parallax — orb + cards */}
                    <div className="snh-front" style={{ transform: frontT }}>
                        <div className="snh-orb">
                            <div className="snh-orb__inner">
                                <div className="snh-orb__core" />
                                <div className="snh-orb__ring snh-orb__ring--1" />
                                <div className="snh-orb__ring snh-orb__ring--2" />
                            </div>
                        </div>

                        {showLabels
                            ? CARDS.map((card) => (
                                  <div
                                      key={card.label}
                                      className="snh-card"
                                      style={{ ...card.pos, animationDelay: card.rise }}
                                  >
                                      <div
                                          className="snh-card__chip"
                                          style={{
                                              borderColor: card.border,
                                              boxShadow: card.glow ? `${BASE_CARD_SHADOW}, ${card.glow}` : BASE_CARD_SHADOW,
                                              animation: `snh-card-bob ${card.bob} ease-in-out ${card.bobDelay} infinite`,
                                          }}
                                      >
                                          {card.bars ? (
                                              <span className="snh-bars">
                                                  <span style={{ height: "6px", background: "rgba(22, 226, 154, 0.6)" }} />
                                                  <span style={{ height: "9px", background: "rgba(22, 226, 154, 0.8)" }} />
                                                  <span style={{ height: "12px", background: "#16E29A", boxShadow: "0 0 8px rgba(22, 226, 154, 0.7)" }} />
                                              </span>
                                          ) : (
                                              <span className="snh-card__dot" style={card.dot} />
                                          )}
                                          <span className="snh-card__label" style={{ color: card.labelColor }}>
                                              {card.label}
                                          </span>
                                      </div>
                                  </div>
                              ))
                            : null}
                    </div>
                </div>
            </div>

            {/* bottom fade into page content */}
            <div className="snh-fade-bottom" aria-hidden="true" />
        </section>
    );
}

export default StudyNestHero;
