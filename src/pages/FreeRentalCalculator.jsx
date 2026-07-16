// FreeRentalCalculator — /tools/rental-property-calculator   CSS prefix: frc-
import { useEffect, useMemo, useRef, useState } from "react";
import "../App.css";
import "./FreeRentalCalculator.css";
import SEO from "../components/SEO.jsx";
import { getPublicPageUrl } from "../data/publicPageRoutes.js";
import { siteUrl } from "../data/blogPosts.js";
import {
    trackRentalCalculatorView,
    trackRentalCalculatorCalculate,
    trackRentalCalculatorBetaCta,
    trackLiveBetaClick,
} from "../utils/analytics.js";

const LIVE_BETA_URL = "https://cin-nova.vercel.app/getting-started";
const PAGE_URL = getPublicPageUrl("free-rental-property-calculator");

const calcSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Free Rental Property Score Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    description:
        "Free rental property calculator for cash flow, cap rate, cash-on-cash return, and a deal score. Estimate a rental's numbers before you buy.",
    url: PAGE_URL,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
};

/* Input fields — each declares its unit so math stays unambiguous. */
const FIELDS = [
    { key: "price",       label: "Purchase price",        unit: "$",        step: 1000 },
    { key: "down",        label: "Down payment",          unit: "$",        step: 1000 },
    { key: "rate",        label: "Interest rate",         unit: "%",        step: 0.05 },
    { key: "term",        label: "Loan term",             unit: "years",    step: 1 },
    { key: "rent",        label: "Monthly rent",          unit: "$/mo",     step: 25 },
    { key: "taxes",       label: "Property taxes",        unit: "$/yr",     step: 100 },
    { key: "insurance",   label: "Insurance",             unit: "$/yr",     step: 50 },
    { key: "repairsPct",  label: "Repairs / maintenance", unit: "% of rent", step: 1 },
    { key: "vacancyPct",  label: "Vacancy",               unit: "% of rent", step: 1 },
    { key: "mgmtPct",     label: "Property management",   unit: "% of rent", step: 1 },
    { key: "other",       label: "Other expenses",        unit: "$/mo",     step: 10 },
];

const DEFAULTS = {
    price: 350000, down: 70000, rate: 7, term: 30, rent: 2600,
    taxes: 3800, insurance: 1400, repairsPct: 5, vacancyPct: 5, mgmtPct: 8, other: 50,
};

const fmt$ = (n) => (n < 0 ? "−$" : "$") + Math.abs(Math.round(n)).toLocaleString();
const fmtPct = (n) => (Number.isFinite(n) ? `${n.toFixed(1)}%` : "—");
const num = (v) => { const n = parseFloat(v); return Number.isFinite(n) ? n : 0; };

/* Pure, local calculation — no APIs, runs entirely in the browser. */
function computeDeal(f) {
    const loan = Math.max(0, num(f.price) - num(f.down));
    const r = num(f.rate) / 100 / 12;
    const n = Math.max(1, num(f.term) * 12);
    const mortgage = r === 0 ? loan / n : (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    const rent = num(f.rent);
    const opMonthly =
        num(f.taxes) / 12 +
        num(f.insurance) / 12 +
        ((num(f.repairsPct) + num(f.vacancyPct) + num(f.mgmtPct)) / 100) * rent +
        num(f.other);

    const totalMonthlyExp = mortgage + opMonthly;
    const monthlyCashFlow = rent - totalMonthlyExp;
    const annualCashFlow = monthlyCashFlow * 12;

    const noi = rent * 12 - opMonthly * 12; // excludes debt service
    const capRate = num(f.price) > 0 ? (noi / num(f.price)) * 100 : 0;
    const invested = Math.max(1, num(f.down));
    const cashOnCash = (annualCashFlow / invested) * 100;

    // Transparent 0–100 deal score
    let score = 0;
    score += capRate >= 8 ? 35 : capRate >= 6 ? 28 : capRate >= 5 ? 20 : capRate >= 4 ? 12 : 4;
    score += cashOnCash >= 10 ? 35 : cashOnCash >= 8 ? 28 : cashOnCash >= 6 ? 20 : cashOnCash >= 4 ? 12 : 4;
    score += monthlyCashFlow >= 300 ? 30 : monthlyCashFlow > 0 ? 20 : monthlyCashFlow >= -150 ? 8 : 0;
    score = Math.max(0, Math.min(100, Math.round(score)));

    const grade = score >= 82 ? "A" : score >= 70 ? "B" : score >= 55 ? "C" : score >= 40 ? "D" : "F";
    const verdict = score >= 70 ? "Strong deal" : score >= 55 ? "Watchlist" : "Needs review";
    const tone = score >= 70 ? "good" : score >= 55 ? "watch" : "risk";

    return { mortgage, totalMonthlyExp, monthlyCashFlow, annualCashFlow, capRate, cashOnCash, score, grade, verdict, tone };
}

export default function FreeRentalCalculator() {
    const [form, setForm] = useState(DEFAULTS);
    const out = useMemo(() => computeDeal(form), [form]);
    const calcTracked = useRef(false);

    // Fire once when the calculator page loads.
    useEffect(() => { trackRentalCalculatorView(); }, []);

    const update = (key) => (e) => {
        // Signal "calculator used" once per visit — never send the input values.
        if (!calcTracked.current) {
            calcTracked.current = true;
            trackRentalCalculatorCalculate();
        }
        setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

    return (
        <div className="product-page frc-page">
            <SEO
                title="Free Rental Property Calculator | Cash Flow, Cap Rate & ROI"
                description="Free rental property calculator for cash flow, cap rate, cash-on-cash ROI, and a deal score. Analyze any rental before you buy, then get a full AI-powered report with CinNova Real Estate AI."
                url={PAGE_URL}
                type="website"
                schema={calcSchema}
            />

            <section className="section frc-hero">
                <p className="eyebrow">FREE TOOL · REAL ESTATE</p>
                <h1>Free Rental Property Score Calculator</h1>
                <p className="frc-intro">
                    Use this free calculator to estimate rental property cash flow, cap rate, ROI,
                    and deal strength before you buy. Everything runs in your browser — no sign-up,
                    no data sent anywhere.
                </p>
            </section>

            <section className="section frc-tool">
                <div className="frc-grid">
                    {/* Inputs */}
                    <div className="frc-inputs">
                        <h2 className="frc-col-title">Property numbers</h2>
                        <div className="frc-fields">
                            {FIELDS.map((field) => (
                                <label className="frc-field" key={field.key}>
                                    <span className="frc-field-label">{field.label}</span>
                                    <span className="frc-input-wrap">
                                        <input
                                            type="number"
                                            className="frc-input"
                                            value={form[field.key]}
                                            step={field.step}
                                            min="0"
                                            inputMode="decimal"
                                            onChange={update(field.key)}
                                        />
                                        <span className="frc-unit">{field.unit}</span>
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Outputs */}
                    <div className="frc-results">
                        <h2 className="frc-col-title">Your deal at a glance</h2>

                        <div className={`frc-score frc-score--${out.tone}`}>
                            <div className="frc-score-num">{out.score}<span>/100</span></div>
                            <div className="frc-score-meta">
                                <span className="frc-score-grade">Grade {out.grade}</span>
                                <span className="frc-score-verdict">{out.verdict}</span>
                            </div>
                        </div>

                        <div className="frc-metrics">
                            <div className="frc-metric">
                                <span>Estimated monthly mortgage</span>
                                <strong>{fmt$(out.mortgage)}</strong>
                            </div>
                            <div className="frc-metric">
                                <span>Total monthly expenses</span>
                                <strong>{fmt$(out.totalMonthlyExp)}</strong>
                            </div>
                            <div className="frc-metric">
                                <span>Monthly cash flow</span>
                                <strong className={out.monthlyCashFlow >= 0 ? "frc-pos" : "frc-neg"}>{fmt$(out.monthlyCashFlow)}</strong>
                            </div>
                            <div className="frc-metric">
                                <span>Annual cash flow</span>
                                <strong className={out.annualCashFlow >= 0 ? "frc-pos" : "frc-neg"}>{fmt$(out.annualCashFlow)}</strong>
                            </div>
                            <div className="frc-metric">
                                <span>Cap rate</span>
                                <strong>{fmtPct(out.capRate)}</strong>
                            </div>
                            <div className="frc-metric">
                                <span>Cash-on-cash return</span>
                                <strong>{fmtPct(out.cashOnCash)}</strong>
                            </div>
                        </div>

                        <p className="frc-disclaimer">
                            Estimates only, for educational use — not financial advice. Cash-on-cash
                            uses your down payment as invested capital; taxes and insurance are annual.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA into the live beta */}
            <section className="section frc-cta">
                <div className="frc-cta-card">
                    <h2>Want a full AI-powered report?</h2>
                    <p>
                        CinNova Real Estate AI scores the deal, models cash flow, maps the market,
                        and writes an investor-ready report — free in the live beta.
                    </p>
                    <a
                        className="primary-btn frc-cta-btn"
                        href={LIVE_BETA_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                            trackRentalCalculatorBetaCta({ destinationUrl: LIVE_BETA_URL });
                            trackLiveBetaClick({ sourcePage: "free-rental-property-calculator", ctaLabel: "Try CinNova Real Estate AI", destinationUrl: LIVE_BETA_URL });
                        }}
                    >
                        Try CinNova Real Estate AI →
                    </a>
                </div>
            </section>
        </div>
    );
}
