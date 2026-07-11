import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../ui/useReducedMotion.js";
import "./PoisonGuardDemo.css";

/*
 * PoisonGuard — "Try a sample safety scan" interactive demo.
 *
 * A marketing simulation ONLY. Runs entirely in the browser: no backend, no
 * external API, no real camera, no real image recognition or toxicology lookup.
 * Every result is pre-authored example copy, and the UI says so repeatedly
 * ("Sample only", "Example safety preview", "not medical advice"). It never
 * claims to replace Poison Control, a doctor, a veterinarian, or emergency
 * services. Do not wire this to a real endpoint without also removing the
 * demo labelling.
 *
 * Lives BELOW the PoisonGuard hero, inside the dark `.product-dark-scope`
 * product-page theme, so it inherits --pd-accent (#34d399 emerald), --bdna-ink,
 * etc. Semantic safety colours (red = high/emergency, amber = moderate/pet
 * warning) are preserved locally, not flattened into the page accent. No hero
 * markup is touched.
 */

/* Pre-authored example outputs — one per sample chip. Copy follows the brief:
   plain-language, cautious, and always deferring to Poison Control / 911. */
const SAMPLES = [
    {
        id: "lily",
        name: "Lily plant",
        risk: "High risk for cats",
        tone: "high",
        confidence: 92,
        message:
            "Highly toxic to cats and may cause kidney failure. Contact a veterinarian or poison control immediately.",
        steps: [
            "Move the pet away from the plant.",
            "Do not induce vomiting unless told by a professional.",
            "Call your vet or poison control immediately.",
        ],
    },
    {
        id: "ibuprofen",
        name: "Ibuprofen bottle",
        risk: "High risk",
        tone: "high",
        confidence: 89,
        message: "Pain relievers can be dangerous for children and pets if swallowed.",
        steps: [
            "Keep the bottle out of reach.",
            "Check whether any pills are missing.",
            "Call poison control with the product name and estimated amount.",
        ],
    },
    {
        id: "bleach",
        name: "Bleach cleaner",
        risk: "Moderate risk",
        tone: "moderate",
        confidence: 84,
        message:
            "Bleach can irritate skin, eyes, and lungs. Mixing with ammonia or acids can create toxic gas.",
        steps: [
            "Move to fresh air if fumes are strong.",
            "Rinse skin or eyes with water if exposed.",
            "Do not mix cleaners.",
            "Call poison control if swallowed or symptoms appear.",
        ],
    },
    {
        id: "chocolate",
        name: "Chocolate bar",
        risk: "Pet warning",
        tone: "moderate",
        confidence: 80,
        message: "Chocolate can be toxic to dogs depending on type and amount.",
        steps: [
            "Keep the pet away from more chocolate.",
            "Estimate how much was eaten.",
            "Contact a veterinarian with the pet’s weight and chocolate type.",
        ],
    },
    {
        id: "button-battery",
        name: "Button battery",
        risk: "Emergency",
        tone: "high",
        confidence: 95,
        message: "Button batteries can cause serious internal burns if swallowed.",
        steps: [
            "Treat as urgent.",
            "Do not wait for symptoms.",
            "Call poison control or seek emergency care immediately.",
        ],
    },
];

/* Staged scan animation — four short steps (brief). Collapsed entirely under
   prefers-reduced-motion: the result is shown at once with no staging. */
const STEPS = [
    "Detecting item",
    "Matching safety database",
    "Checking risk profile",
    "Preparing guidance",
];

const STEP_MS = 780;

function PoisonGuardDemo() {
    const reduceMotion = useReducedMotion();
    const [selectedId, setSelectedId] = useState(SAMPLES[0].id); // default: Lily plant
    const [phase, setPhase] = useState("idle"); // idle | running | done
    const [activeStep, setActiveStep] = useState(-1);
    const timers = useRef([]);

    const sample = SAMPLES.find((s) => s.id === selectedId) || SAMPLES[0];

    const clearTimers = () => {
        timers.current.forEach(clearTimeout);
        timers.current = [];
    };
    useEffect(() => clearTimers, []);

    function reset() {
        clearTimers();
        setPhase("idle");
        setActiveStep(-1);
    }

    // Changing the item always resets the demo back to idle.
    function chooseSample(s) {
        if (s.id === selectedId) return;
        setSelectedId(s.id);
        reset();
    }

    function scan() {
        clearTimers();
        // Reduced motion: skip the staged animation — reveal the result at once.
        if (reduceMotion) {
            setActiveStep(STEPS.length - 1);
            setPhase("done");
            return;
        }
        setPhase("running");
        setActiveStep(0);
        for (let i = 1; i < STEPS.length; i += 1) {
            timers.current.push(setTimeout(() => setActiveStep(i), i * STEP_MS));
        }
        timers.current.push(setTimeout(() => setPhase("done"), STEPS.length * STEP_MS));
    }

    const running = phase === "running";
    const done = phase === "done";
    const scanLabel = running ? "Scanning…" : done ? "Re-run scan" : "Start sample scan";
    const liveStatus = running
        ? `${STEPS[activeStep] || STEPS[0]}…`
        : done
          ? `Sample scan complete for ${sample.name}. Example ${sample.risk}.`
          : "";

    return (
        <section className="pgd-demo" id="scan-demo" aria-labelledby="pgd-demo-title">
            <div className="pgd-demo__head">
                <p className="eyebrow">Interactive demo · Sample only</p>
                <h2 id="pgd-demo-title">Try a sample safety scan</h2>
                <p className="pgd-demo__lede">
                    Pick a household item and watch PoisonGuard preview the risk, safety steps,
                    and emergency guidance. This is a <strong>sample preview</strong> with example
                    data — <strong>not medical advice</strong>, and not a substitute for Poison
                    Control, a doctor, a vet, or emergency services.
                </p>
            </div>

            <div className="pgd-demo__panel">
                {/* ── Controls column ── */}
                <div className="pgd-demo__controls">
                    <span className="pgd-demo__label" id="pgd-demo-samples-label">
                        Choose a household item
                    </span>
                    <div
                        className="pgd-demo__samples"
                        role="radiogroup"
                        aria-labelledby="pgd-demo-samples-label"
                    >
                        {SAMPLES.map((s) => {
                            const active = s.id === selectedId;
                            return (
                                <button
                                    key={s.id}
                                    type="button"
                                    role="radio"
                                    aria-checked={active}
                                    className={`pgd-demo__chip${active ? " is-active" : ""}`}
                                    onClick={() => chooseSample(s)}
                                >
                                    {s.name}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        type="button"
                        className="pgd-demo__scan primary-btn"
                        onClick={scan}
                        disabled={running}
                        aria-describedby="pgd-demo-disclaimer"
                    >
                        {scanLabel}
                    </button>

                    <p className="pgd-demo__disclaimer" id="pgd-demo-disclaimer">
                        Sample preview only. PoisonGuard is not a substitute for professional
                        medical, veterinary, or poison-control guidance. In an emergency, call
                        Poison Control at 1-800-222-1222 or call 911.
                    </p>
                </div>

                {/* ── Scanner stage column ── */}
                <div className="pgd-demo__stage">
                    {/* Mock scanner viewport — reticle + scan line. Purely decorative;
                        no real camera or image capture is involved. */}
                    <div className={`pgd-demo__scanner pgd-demo__scanner--${phase}`} aria-hidden="true">
                        <span className="pgd-demo__reticle pgd-demo__reticle--tl" />
                        <span className="pgd-demo__reticle pgd-demo__reticle--tr" />
                        <span className="pgd-demo__reticle pgd-demo__reticle--bl" />
                        <span className="pgd-demo__reticle pgd-demo__reticle--br" />
                        {running && <span className="pgd-demo__scanline" />}
                        <span className="pgd-demo__scanner-item">{sample.name}</span>
                        <span className="pgd-demo__scanner-hint">
                            {done ? "Sample preview ready" : running ? "Scanning sample…" : "Sample scanner"}
                        </span>
                    </div>

                    {/* Screen-reader status for the whole scan lifecycle. */}
                    <p className="pgd-demo__sr-status" aria-live="polite">
                        {liveStatus}
                    </p>

                    {phase === "idle" && (
                        <div className="pgd-demo__idle">
                            <p>
                                Press <strong>Start sample scan</strong> to see an example safety
                                preview for <span className="pgd-demo__idle-item">{sample.name}</span>.
                            </p>
                        </div>
                    )}

                    {running && (
                        <div className="pgd-demo__steps">
                            <p className="pgd-demo__steps-title">Sample scan in progress</p>
                            <ol>
                                {STEPS.map((step, i) => {
                                    const state =
                                        i < activeStep ? "done" : i === activeStep ? "active" : "todo";
                                    return (
                                        <li
                                            key={step}
                                            className={`pgd-demo__step pgd-demo__step--${state}`}
                                        >
                                            <span className="pgd-demo__step-dot" aria-hidden="true" />
                                            <span className="pgd-demo__step-label">{step}</span>
                                            <span className="pgd-demo__step-status" aria-hidden="true">
                                                {state === "done" ? "✓" : state === "active" ? "…" : ""}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ol>
                        </div>
                    )}

                    {done && (
                        <div
                            className={`pgd-demo__report pgd-demo__report--${sample.tone}`}
                            role="status"
                        >
                            <div className="pgd-demo__report-head">
                                <div>
                                    <span className="pgd-demo__report-tag">Example safety preview</span>
                                    <h3>{sample.name}</h3>
                                </div>
                                <span
                                    className={`pgd-demo__risk pgd-demo__risk--${sample.tone}`}
                                    aria-label={`Risk level: ${sample.risk}`}
                                >
                                    <span className="pgd-demo__risk-dot" aria-hidden="true" />
                                    {sample.risk}
                                </span>
                            </div>

                            <div className={`pgd-demo__confidence pgd-demo__confidence--${sample.tone}`}>
                                <div className="pgd-demo__confidence-head">
                                    <span className="pgd-demo__cell-label">Sample confidence</span>
                                    <strong>{sample.confidence}%</strong>
                                </div>
                                <div
                                    className="pgd-demo__confidence-bar"
                                    role="progressbar"
                                    aria-valuenow={sample.confidence}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-label="Sample confidence"
                                >
                                    <span style={{ width: `${sample.confidence}%` }} />
                                </div>
                            </div>

                            <p className="pgd-demo__message">{sample.message}</p>

                            <div className="pgd-demo__guidance">
                                <span className="pgd-demo__cell-label">Safety steps</span>
                                <ol className="pgd-demo__guidance-steps">
                                    {sample.steps.map((step) => (
                                        <li key={step}>{step}</li>
                                    ))}
                                </ol>
                            </div>

                            <div className="pgd-demo__emergency">
                                <span className="pgd-demo__emergency-mark" aria-hidden="true">
                                    !
                                </span>
                                <div className="pgd-demo__emergency-body">
                                    <strong>Emergency guidance</strong>
                                    <p>
                                        If you suspect exposure, don’t wait — get expert help right
                                        away.
                                    </p>
                                    <div className="pgd-demo__emergency-ctas">
                                        <a href="tel:18002221222" className="pgd-demo__emergency-btn">
                                            Call Poison Control: 1-800-222-1222
                                        </a>
                                        <a href="tel:911" className="pgd-demo__emergency-link">
                                            Or call 911
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <p className="pgd-demo__report-note">
                                Example safety preview — not medical advice. PoisonGuard does not
                                replace Poison Control, a doctor, a veterinarian, or emergency
                                services.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default PoisonGuardDemo;
