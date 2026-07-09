import { useState } from "react";
import "./MediaKit.css";
import SEO from "../components/SEO.jsx";
import { mediaKitAssets, mediaKitPlacements, mediaKitSegments } from "../data/marketingImages.js";
import { siteUrl } from "../data/blogPosts.js";
import {
    isValidEmail,
    normalizeEmailInput,
    safeReadArray,
    safeWriteArray,
    sanitizeText,
} from "../utils/security.js";

const CONTACT_EMAIL = "thin_line_99@yahoo.com";

// Real client-side downloads (plain-text press assets), carried over unchanged.
function downloadAsset(assetType) {
    const assets = {
        presspack: {
            filename: "cin-nova-press-pack.txt",
            content: [
                "CIN NOVA PRESS PACK",
                "===================",
                "",
                "COMPANY OVERVIEW",
                "Cin Nova is a multi-product AI software company building practical tools",
                "for education, household safety, tech support, early learning, and real estate.",
                "",
                "PRODUCTS",
                "- StudyNest: AI study platform with notes, flashcards, and AI tutoring (In Development)",
                "- PoisonGuard: Household chemical safety scanner for families and pets (In Development)",
                "- TechMate AI: AI troubleshooting assistant for everyday tech problems (Concept Stage)",
                "- Kiddo: Early learning platform for ABC, reading, counting, and math (Concept Stage)",
                "- Cin Nova Real Estate: AI tools for property analysis and deal evaluation (Active Build)",
                "",
                "AUDIENCE",
                "- Growing newsletter audience",
                "- Active monthly content program",
                "- Live resource download center",
                "- 7 article categories across education, safety, real estate, AI, and parenting",
                "",
                "CONTACT",
                `Website: ${siteUrl}`,
                `Email: ${CONTACT_EMAIL}`,
                "",
                "© 2026 Cin Nova. All Rights Reserved.",
            ].join("\n"),
        },
        brandguidelines: {
            filename: "cin-nova-brand-guidelines.txt",
            content: [
                "CIN NOVA BRAND GUIDELINES",
                "=========================",
                "",
                "BRAND COLORS",
                "Primary Blue:   #38bdf8 (sky blue — used for primary actions and accents)",
                "Background:     #ffffff (light theme)",
                "Surface:        #ffffff",
                "Text Primary:   #0f172a",
                "Text Secondary: #475569",
                "Text Muted:     #64748b",
                "",
                "PRODUCT ACCENT COLORS",
                "StudyNest:      #38bdf8 (Sky Blue)",
                "PoisonGuard:    #10b981 (Emerald)",
                "TechMate AI:    #7c3aed (Violet)",
                "Kiddo:          #f59e0b (Amber)",
                "Real Estate AI: #2563eb (Blue)",
                "",
                "LOGO USAGE",
                "- The Cin Nova mark is a rounded square with initials 'CN' in a sky-to-violet gradient",
                "- Do not stretch, rotate, or recolor the mark",
                "- Minimum size: 32px × 32px",
                "- Always maintain clear space equal to the mark width on all sides",
                "",
                "TYPOGRAPHY",
                "- Headings: system-ui, -apple-system, sans-serif, bold/extrabold weight",
                "- Body: same stack, regular weight at 1rem/16px",
                "",
                "TONE OF VOICE",
                "- Direct, practical, and informative — never jargon-heavy",
                "- First-person plural (we/our) for company voice",
                "- Use plain language; assume the reader is smart but busy",
                "",
                `Website: ${siteUrl}`,
                "© 2026 Cin Nova. All Rights Reserved.",
            ].join("\n"),
        },
        audiencereport: {
            filename: "cin-nova-audience-report.txt",
            content: [
                "CIN NOVA AUDIENCE REPORT",
                "========================",
                "",
                "OVERVIEW",
                "Cin Nova's audience spans five distinct reader segments across the company's",
                "five product lanes: education, safety, real estate, tech, and parenting.",
                "",
                "AUDIENCE METRICS",
                "Newsletter audience:       Growing",
                "Content program:           Active",
                "Resource downloads:        Live",
                "Average read time:         6 minutes",
                "Categories covered:        7",
                "",
                "AUDIENCE SEGMENTS",
                "",
                "1. Students and Parents (Education, Parenting)",
                "   Engaged with StudyNest, Kiddo, and study-planning content.",
                "   High download rate on the AI Study Planning Starter Guide.",
                "",
                "2. Real Estate Investors (Real Estate)",
                "   Engaged with deal analysis articles and real estate templates.",
                "   High download rate on cash flow and analysis worksheets.",
                "",
                "3. Safety-Conscious Households (Safety, Parenting)",
                "   Engaged with household chemical safety, PoisonGuard, and emergency prep.",
                "   Consistent return readers for safety-focused content.",
                "",
                "4. Tech Professionals and Entrepreneurs (AI & Technology, Entrepreneurship)",
                "   Engaged with AI tools, product building, and newsletter growth articles.",
                "   High newsletter open rate for product update content.",
                "",
                "PLACEMENT OPPORTUNITIES",
                "For advertising rates and placement specs, see the Cin Nova Media Kit.",
                `Website: ${siteUrl}/?page=media-kit`,
                `Email: ${CONTACT_EMAIL}`,
                "",
                "© 2026 Cin Nova. All Rights Reserved.",
            ].join("\n"),
        },
    };

    const asset = assets[assetType];
    if (!asset) return;
    const blob = new Blob([asset.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = asset.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

const STATS = [
    { value: "Growing", label: "Newsletter subscribers", placeholder: true },
    { value: "Active", label: "Monthly content program", placeholder: false },
    { value: "Live", label: "Resource downloads", placeholder: false },
    { value: "5", label: "Product verticals", placeholder: false },
    { value: "7", label: "Article categories", placeholder: false },
    { value: "TBD", label: "Campaign reach (est.)", placeholder: true },
];

const mediaKitSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Cin Nova Media Kit",
    description: "Advertise with Cin Nova. Audience stats, ad placement options, and brand assets.",
    url: `${siteUrl}/?page=media-kit`,
};

export default function MediaKit() {
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const name = (fd.get("name") || "").toString().trim();
        const email = (fd.get("email") || "").toString().trim();
        const company = (fd.get("company") || "").toString().trim();
        const placement = (fd.get("placement") || "").toString();
        const brief = (fd.get("brief") || "").toString();

        if (!name || !isValidEmail(email) || !company) {
            setError("Please add your name, a valid email, and your company.");
            return;
        }
        try {
            const inquiries = safeReadArray("cn_media_inquiries");
            inquiries.push({
                name: sanitizeText(name, 100),
                email: normalizeEmailInput(email),
                company: sanitizeText(company, 140),
                placement: sanitizeText(placement, 120),
                message: sanitizeText(brief, 1500),
                submittedAt: new Date().toISOString(),
            });
            safeWriteArray("cn_media_inquiries", inquiries.slice(-500));
        } catch {
            /* storage is best-effort — still confirm to the user */
        }
        setError("");
        setSent(true);
    }

    return (
        <main className="mk-page media-kit-page">
            <SEO
                title="Media Kit | Advertise with Cin Nova"
                description="CinNova media kit: audience stats, ad placements, brand assets, and advertising contact. Reach students, parents, real estate investors, and tech professionals."
                url={`${siteUrl}/?page=media-kit`}
                type="website"
                schema={mediaKitSchema}
            />

            {/* ============ Hero ============ */}
            <section className="mk-container mk-hero-wrap" aria-label="Media kit introduction">
                <div className="mk-hero">
                    <div className="mk-hero-glow" aria-hidden="true" />
                    <div className="mk-hero-copy">
                        <span className="mk-eyebrow mk-eyebrow--green">MEDIA KIT 2026</span>
                        <h1 className="mk-hero-title">Reach the Cin&nbsp;Nova audience.</h1>
                        <p className="mk-hero-sub">
                            Cin Nova reaches students, parents, real estate investors, tech
                            professionals, and safety-conscious households through a growing
                            blog, newsletter, and resource library. This media kit covers
                            audience stats, placement options, technical specs, and how to
                            get in touch.
                        </p>
                        <div className="mk-hero-chips">
                            <a className="mk-chip-link" href="#segments">Audience segments</a>
                            <a className="mk-chip-link" href="#placements">Ad placements</a>
                            <a className="mk-chip-link" href="#brand-assets">Brand assets</a>
                            <a className="mk-chip-link" href="#contact">Rate inquiries</a>
                        </div>
                        <div className="mk-hero-ctas">
                            <button type="button" className="mk-btn mk-btn--primary" onClick={() => downloadAsset("presspack")}>
                                Download Press Pack
                            </button>
                            <a className="mk-btn mk-btn--outline" href="#contact">Contact for Rates</a>
                            <a className="mk-btn mk-btn--outline" href="/?page=advertise">Advertise With Us</a>
                        </div>
                    </div>
                    <div className="mk-hero-art" aria-hidden="true">
                        <div className="mk-hero-orb">
                            <div className="mk-hero-mark">CN</div>
                            <span className="mk-hero-float mk-hero-float--tl">Newsletter</span>
                            <span className="mk-hero-float mk-hero-float--br">Blog + Resources</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ Audience overview ============ */}
            <section id="audience" className="mk-container mk-section" aria-label="Audience overview">
                <header className="mk-section-head">
                    <span className="mk-eyebrow mk-eyebrow--blue">AUDIENCE OVERVIEW</span>
                    <h2 className="mk-h2">By the numbers</h2>
                    <p className="mk-section-sub">
                        Current audience metrics across newsletter, blog, and resources.{" "}
                        <span className="mk-muted">
                            Metrics marked “Placeholder” will be updated with verified analytics.
                        </span>
                    </p>
                </header>
                <div className="mk-grid mk-grid--stats">
                    {STATS.map((s) => (
                        <div className="mk-card mk-stat" key={s.label}>
                            <div className="mk-stat-row">
                                <span className="mk-stat-value">{s.value}</span>
                                {s.placeholder && <span className="mk-badge-placeholder">PLACEHOLDER METRIC</span>}
                            </div>
                            <span className="mk-stat-label">{s.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ============ Audience segments ============ */}
            <section id="segments" className="mk-band" aria-label="Audience segments">
                <div className="mk-container mk-band-inner">
                    <header className="mk-section-head">
                        <span className="mk-eyebrow mk-eyebrow--blue">AUDIENCE SEGMENTS</span>
                        <h2 className="mk-h2">Who reads Cin Nova</h2>
                        <p className="mk-section-sub">
                            Four distinct reader segments across the Cin Nova content and product ecosystem.
                        </p>
                    </header>
                    <div className="mk-grid mk-grid--segments">
                        {mediaKitSegments.map((seg) => (
                            <article className="mk-card mk-card--media" key={seg.name}>
                                <img className="mk-card-img" src={seg.image} alt={seg.alt} loading="lazy" />
                                <div className="mk-card-body">
                                    <h3 className="mk-h3">{seg.name}</h3>
                                    <p className="mk-card-text">{seg.description}</p>
                                    <div className="mk-tags">
                                        {seg.tags.map((tag, i) => (
                                            <span key={tag} className={`mk-tag mk-tag--${i === 0 ? "green" : "blue"}`}>{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ Ad placements ============ */}
            <section id="placements" className="mk-container mk-section" aria-label="Ad placements">
                <header className="mk-section-head">
                    <span className="mk-eyebrow mk-eyebrow--blue">AD PLACEMENTS</span>
                    <h2 className="mk-h2">Six ways to reach the Cin Nova audience</h2>
                    <p className="mk-section-sub">
                        All placements are reviewed and approved by Cin Nova. Pricing shown
                        is an estimated range — final rates depend on campaign details and availability.
                    </p>
                </header>
                <div className="mk-grid mk-grid--placements">
                    {mediaKitPlacements.map((p) => (
                        <article className="mk-card mk-card--media mk-placement" key={p.name}>
                            <img className="mk-card-img mk-card-img--short" src={p.image} alt={p.alt} loading="lazy" />
                            <div className="mk-card-body mk-placement-body">
                                <div>
                                    <h3 className="mk-h3 mk-h3--sm">{p.name}</h3>
                                    <p className="mk-card-text mk-card-text--sm">{p.format}</p>
                                </div>
                                <div className="mk-spec">
                                    <span className="mk-spec-label">SPECS</span>
                                    {p.specs}
                                </div>
                                <div className="mk-spec">
                                    <span className="mk-spec-label">REACH</span>
                                    {p.reach}
                                </div>
                                <div className="mk-price">{p.range}</div>
                            </div>
                        </article>
                    ))}
                </div>
                <p className="mk-footnote">
                    All rates are estimated. Final pricing depends on campaign scope,
                    duration, and current availability. Custom packages are available —
                    use the contact form below for a quote.
                </p>
                <div className="mk-hero-ctas mk-placements-actions">
                    <a className="mk-btn mk-btn--outline" href="/?page=sponsor-newsletter">Sponsor the Newsletter</a>
                    <a className="mk-btn mk-btn--outline" href="/?page=partnerships">Partnerships</a>
                </div>
            </section>

            {/* ============ Brand assets ============ */}
            <section id="brand-assets" className="mk-band" aria-label="Brand assets">
                <div className="mk-container mk-band-inner">
                    <header className="mk-section-head">
                        <span className="mk-eyebrow mk-eyebrow--blue">BRAND ASSETS</span>
                        <h2 className="mk-h2">Downloads for press and partners</h2>
                        <p className="mk-section-sub">
                            Download the Cin Nova press pack, brand guidelines, and audience report.
                        </p>
                    </header>
                    <div className="mk-grid mk-grid--assets">
                        {mediaKitAssets.map((a) => (
                            <article className="mk-card mk-asset" key={a.key}>
                                <span className="mk-asset-icon">TXT</span>
                                <h3 className="mk-h3">{a.title}</h3>
                                <p className="mk-card-text">{a.description}</p>
                                <button type="button" className="mk-btn mk-btn--primary mk-btn--sm" onClick={() => downloadAsset(a.key)}>
                                    ↓ Download {a.title}
                                </button>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ Contact ============ */}
            <section id="contact" className="mk-container mk-section mk-section--last" aria-label="Advertising contact">
                <header className="mk-section-head">
                    <span className="mk-eyebrow mk-eyebrow--green">CONTACT</span>
                    <h2 className="mk-h2">Ready to advertise? Get in touch.</h2>
                    <p className="mk-section-sub">
                        Fill in the form below or email{" "}
                        <a className="mk-inline-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>{" "}
                        directly with your campaign brief.
                    </p>
                </header>
                {sent ? (
                    <div className="mk-form mk-card">
                        <div className="mk-form-success" role="status">
                            Thanks — your inquiry was sent. We&rsquo;ll get back to you within 3–5 business days
                            with availability and a rate proposal.
                        </div>
                    </div>
                ) : (
                    <form className="mk-form mk-card" onSubmit={handleSubmit} noValidate>
                        <div className="mk-form-grid">
                            <label className="mk-field">
                                <span>Full Name <em className="mk-req">*</em></span>
                                <input required type="text" name="name" placeholder="Jane Smith" maxLength={100} />
                            </label>
                            <label className="mk-field">
                                <span>Email Address <em className="mk-req">*</em></span>
                                <input required type="email" name="email" placeholder="jane@example.com" maxLength={254} />
                            </label>
                            <label className="mk-field">
                                <span>Company <em className="mk-req">*</em></span>
                                <input required type="text" name="company" placeholder="Acme Corp" maxLength={140} />
                            </label>
                            <label className="mk-field">
                                <span>Placement Interest</span>
                                <select name="placement" defaultValue="">
                                    <option value="">Select a placement…</option>
                                    {mediaKitPlacements.map((p) => (
                                        <option key={p.name} value={p.name}>{p.name}</option>
                                    ))}
                                    <option value="Custom Package">Custom package</option>
                                </select>
                            </label>
                        </div>
                        <label className="mk-field mk-field--full">
                            <span>Campaign Brief or Questions</span>
                            <textarea
                                name="brief"
                                rows={5}
                                maxLength={1500}
                                placeholder="Tell us about your product, target audience, and campaign goals…"
                            />
                        </label>
                        {error && <p className="mk-form-error" role="alert">{error}</p>}
                        <button type="submit" className="mk-btn mk-btn--primary mk-btn--block">
                            Send Inquiry →
                        </button>
                    </form>
                )}
            </section>
        </main>
    );
}
