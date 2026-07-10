import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../ui/useReducedMotion.js";
import "./RealEstateDemo.css";

/*
 * CinNova Real Estate AI — "Analyze a Property" interactive demo.
 *
 * A marketing simulation ONLY. It runs entirely in the browser: no backend, no
 * external API, no real valuation. Every result is pre-authored example data,
 * and the UI says so ("Sample demo", "Example output"). Do not wire this to a
 * real endpoint without also removing the demo labelling.
 *
 * Lives BELOW the Real Estate hero, inside the dark `.realestate-scope`
 * product-page theme, so it inherits --pd-accent (#60a5fa blue), --pd-panel,
 * --pd-edge, --bdna-ink/dim, etc. No hero markup is touched.
 *
 * Accessibility & motion:
 *  - sample chips are a labelled radiogroup (arrow-key + aria-checked)
 *  - the address field is a controlled, labelled input
 *  - staged progress is announced via aria-live
 *  - prefers-reduced-motion skips the timed animation and shows results at once
 */

/* Pre-authored example outputs. Phoenix mirrors the brief exactly; the other
   two are plausible variants so switching samples visibly re-runs. All are
   clearly labelled example data in the UI. */
const SAMPLES = [
    {
        id: "phoenix",
        address: "1428 Maple Ridge Ave, Phoenix, AZ",
        dealScore: 87,
        marketHeat: "Strong",
        arv: "$482,000",
        purchaseRange: "$335,000 – $365,000",
        renovation: "High",
        risk: "Moderate",
        strategy: "Buy-renovate-rent or resale flip",
        insight:
            "Comparable renovated homes nearby show strong upside, but repair scope should be verified before offer.",
    },
    {
        id: "tampa",
        address: "316 Harbor View Dr, Tampa, FL",
        dealScore: 73,
        marketHeat: "Warm",
        arv: "$414,000",
        purchaseRange: "$300,000 – $328,000",
        renovation: "Moderate",
        risk: "Moderate",
        strategy: "Long-term rental hold with light refresh",
        insight:
            "Rents support healthy cash flow, though coastal insurance costs should be modelled into the hold.",
    },
    {
        id: "charlotte",
        address: "890 Cedar Park Ln, Charlotte, NC",
        dealScore: 91,
        marketHeat: "Very strong",
        arv: "$525,000",
        purchaseRange: "$360,000 – $392,000",
        renovation: "High",
        risk: "Low-moderate",
        strategy: "Renovate-and-resale flip",
        insight:
            "Fast-appreciating submarket with tight comps — margin is attractive if renovation stays on budget.",
    },
];

const STEPS = [
    "Reading property details",
    "Scanning neighborhood comps",
    "Estimating renovation upside",
    "Calculating deal score",
    "Preparing report preview",
];

const STEP_MS = 720; // per stage when motion is allowed

function heatLevel(heat) {
    const h = heat.toLowerCase();
    if (h.includes("very")) return 4;
    if (h.includes("strong")) return 3;
    if (h.includes("warm")) return 2;
    return 1;
}

function RealEstateDemo() {
    const reduceMotion = useReducedMotion();
    const [selectedId, setSelectedId] = useState(SAMPLES[0].id);
    const [address, setAddress] = useState(SAMPLES[0].address);
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

    function chooseSample(s) {
        setSelectedId(s.id);
        setAddress(s.address);
        reset();
    }

    function onAddressChange(e) {
        setAddress(e.target.value.slice(0, 90));
        if (phase !== "idle") reset();
    }

    function analyze() {
        clearTimers();
        // Reduced motion: no staged animation — show the finished report at once.
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
        timers.current.push(
            setTimeout(() => setPhase("done"), STEPS.length * STEP_MS),
        );
    }

    const running = phase === "running";
    const done = phase === "done";
    const heat = heatLevel(sample.marketHeat);

    return (
        <section className="re-demo" id="analyze-demo" aria-labelledby="re-demo-title">
            <div className="re-demo__head">
                <p className="eyebrow">Interactive demo · Sample only</p>
                <h2 id="re-demo-title">Analyze a property</h2>
                <p className="re-demo__lede">
                    Try the flow the way an investor would. Pick a sample property and watch the
                    AI walk through its analysis. This is a <strong>preview simulation</strong> with
                    example output — not a real valuation.
                </p>
            </div>

            <div className="re-demo__panel">
                {/* ── Input column ── */}
                <div className="re-demo__controls">
                    <span className="re-demo__label" id="re-demo-samples-label">
                        Choose a sample property
                    </span>
                    <div
                        className="re-demo__samples"
                        role="radiogroup"
                        aria-labelledby="re-demo-samples-label"
                    >
                        {SAMPLES.map((s) => {
                            const active = s.id === selectedId;
                            return (
                                <button
                                    key={s.id}
                                    type="button"
                                    role="radio"
                                    aria-checked={active}
                                    className={`re-demo__chip${active ? " is-active" : ""}`}
                                    onClick={() => chooseSample(s)}
                                >
                                    {s.address}
                                </button>
                            );
                        })}
                    </div>

                    <label className="re-demo__label" htmlFor="re-demo-address">
                        Or edit the address
                    </label>
                    <input
                        id="re-demo-address"
                        className="re-demo__input"
                        type="text"
                        value={address}
                        onChange={onAddressChange}
                        placeholder="123 Example St, City, ST"
                        autoComplete="off"
                        spellCheck="false"
                    />

                    <button
                        type="button"
                        className="re-demo__analyze primary-btn"
                        onClick={analyze}
                        disabled={running || address.trim().length === 0}
                    >
                        {running ? "Analyzing…" : done ? "Re-run analysis" : "Analyze property"}
                    </button>
                    <p className="re-demo__disclaimer">
                        Sample demo. No account, no real data — example output for illustration only.
                    </p>
                </div>

                {/* ── Output column ── */}
                <div className="re-demo__stage">
                    {phase === "idle" && (
                        <div className="re-demo__idle">
                            <span className="re-demo__idle-mark" aria-hidden="true">◎</span>
                            <p>
                                Press <strong>Analyze property</strong> to see an example AI deal
                                report for <span className="re-demo__idle-addr">{address}</span>.
                            </p>
                        </div>
                    )}

                    {running && (
                        <div className="re-demo__steps" aria-live="polite">
                            <p className="re-demo__steps-title">Preview analysis in progress</p>
                            <ol>
                                {STEPS.map((step, i) => {
                                    const state =
                                        i < activeStep ? "done" : i === activeStep ? "active" : "todo";
                                    return (
                                        <li key={step} className={`re-demo__step re-demo__step--${state}`}>
                                            <span className="re-demo__step-dot" aria-hidden="true" />
                                            <span className="re-demo__step-label">{step}</span>
                                            <span className="re-demo__step-status" aria-hidden="true">
                                                {state === "done" ? "✓" : state === "active" ? "…" : ""}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ol>
                        </div>
                    )}

                    {done && (
                        <div className="re-demo__report" role="status">
                            <div className="re-demo__report-head">
                                <div>
                                    <span className="re-demo__report-tag">Example output</span>
                                    <h3>{address}</h3>
                                </div>
                                <div className="re-demo__score" aria-label={`Deal score ${sample.dealScore} out of 100`}>
                                    <span className="re-demo__score-num">{sample.dealScore}</span>
                                    <span className="re-demo__score-max">/ 100</span>
                                    <span className="re-demo__score-cap">Deal score</span>
                                </div>
                            </div>

                            <div className="re-demo__metrics">
                                <div className="re-demo__metric">
                                    <span className="re-demo__metric-label">Market heat</span>
                                    <span className="re-demo__metric-value">{sample.marketHeat}</span>
                                    <span className="re-demo__heat" aria-hidden="true">
                                        {[1, 2, 3, 4].map((n) => (
                                            <span
                                                key={n}
                                                className={`re-demo__heat-bar${n <= heat ? " is-on" : ""}`}
                                            />
                                        ))}
                                    </span>
                                </div>
                                <div className="re-demo__metric">
                                    <span className="re-demo__metric-label">Estimated ARV</span>
                                    <span className="re-demo__metric-value">{sample.arv}</span>
                                    <span className="re-demo__metric-sub">Purchase {sample.purchaseRange}</span>
                                </div>
                                <div className="re-demo__metric">
                                    <span className="re-demo__metric-label">Renovation potential</span>
                                    <span className="re-demo__metric-value">{sample.renovation}</span>
                                </div>
                                <div className="re-demo__metric">
                                    <span className="re-demo__metric-label">Risk level</span>
                                    <span className="re-demo__metric-value">{sample.risk}</span>
                                </div>
                            </div>

                            <div className="re-demo__strategy">
                                <span className="re-demo__metric-label">Suggested strategy</span>
                                <p>{sample.strategy}</p>
                            </div>

                            <div className="re-demo__insight">
                                <span className="re-demo__insight-mark" aria-hidden="true">“</span>
                                <p>{sample.insight}</p>
                            </div>

                            <div className="re-demo__report-preview" aria-hidden="true">
                                <span className="re-demo__report-preview-bar" style={{ width: "82%" }} />
                                <span className="re-demo__report-preview-bar" style={{ width: "64%" }} />
                                <span className="re-demo__report-preview-bar" style={{ width: "73%" }} />
                            </div>

                            <div className="re-demo__cta-row">
                                <a
                                    className="primary-btn re-demo__cta"
                                    href="https://cin-nova.vercel.app/getting-started"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    See a real report in the live beta →
                                </a>
                                <span className="re-demo__cta-note">
                                    The live beta scores real addresses you enter.
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default RealEstateDemo;
