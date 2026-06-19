import { useState } from "react";
import "../App.css";
import SEO from "../components/SEO.jsx";
import { siteUrl } from "../data/blogPosts.js";
import {
    isValidEmail,
    normalizeEmailInput,
    safeReadArray,
    safeWriteArray,
    sanitizeText,
} from "../utils/security.js";

const audienceStats = [
    { value: "Growing", label: "Newsletter Audience", icon: "📧" },
    { value: "Active", label: "Monthly Content Program", icon: "👁️" },
    { value: "Live", label: "Resource Downloads", icon: "⬇️" },
    { value: "6 min", label: "Avg. Article Read Time", icon: "⏱️" },
    { value: "7", label: "Article Categories", icon: "📂" },
    { value: "12", label: "Published Resources", icon: "📚" },
];

const audienceSegments = [
    {
        icon: "🎓",
        name: "Students and Parents",
        description:
            "Readers interested in AI study tools, education apps, and learning support for K-12 and college students. Primary audience for StudyNest and Kiddo content.",
        tags: ["Education", "Parenting"],
    },
    {
        icon: "🏠",
        name: "Real Estate Investors",
        description:
            "Rental property investors, house flippers, and real estate agents reading deal analysis articles and downloading investment analysis templates.",
        tags: ["Real Estate"],
    },
    {
        icon: "🛡️",
        name: "Safety-Conscious Households",
        description:
            "Families with children and pets who engage with household safety, poison prevention, and emergency preparedness content across the PoisonGuard blog posts.",
        tags: ["Safety", "Parenting"],
    },
    {
        icon: "💻",
        name: "Tech-Aware Professionals",
        description:
            "Entrepreneurs, product builders, and technology professionals reading AI and entrepreneurship content. Engaged with TechMate AI and product update posts.",
        tags: ["AI & Technology", "Entrepreneurship"],
    },
];

const adPlacements = [
    {
        icon: "📧",
        name: "Newsletter Sponsorship",
        format: "Text mention or short ad block",
        specs: "600px wide, plain text or HTML, 1 external link",
        reach: "Newsletter audience",
        range: "$150 – $350 / send",
        accent: "#38bdf8",
        accentBg: "rgba(56, 189, 248, 0.1)",
    },
    {
        icon: "✍️",
        name: "Article Sponsorship",
        format: "Branded or co-authored editorial article",
        specs: "600–900 words, labeled Sponsored, 1–2 external links",
        reach: "Blog audience + newsletter readers",
        range: "$200 – $500 / article",
        accent: "#10b981",
        accentBg: "rgba(16, 185, 129, 0.1)",
    },
    {
        icon: "🗂️",
        name: "Resource Co-Brand",
        format: "Logo and mention on a downloadable resource",
        specs: "Co-brand credit on cover page and footer",
        reach: "Resource download page + direct downloads",
        range: "$100 – $250 / resource",
        accent: "#7c3aed",
        accentBg: "rgba(124, 58, 237, 0.1)",
    },
    {
        icon: "📌",
        name: "Sidebar Display",
        format: "Static image or text widget in article sidebar",
        specs: "300×250px image or 300px wide text block",
        reach: "Article page readers",
        range: "$75 – $150 / month",
        accent: "#f59e0b",
        accentBg: "rgba(245, 158, 11, 0.1)",
    },
    {
        icon: "🌐",
        name: "Blog Section Placement",
        format: "Banner or callout in a targeted category section",
        specs: "728×90px or 970×90px, category targeted",
        reach: "Category article page visitors",
        range: "$100 – $200 / month",
        accent: "#2563eb",
        accentBg: "rgba(37, 99, 235, 0.1)",
    },
    {
        icon: "🏠",
        name: "Homepage Feature",
        format: "Product or brand callout on the Cin Nova homepage",
        specs: "Card or widget placement, 300px × flexible",
        reach: "All homepage visitors",
        range: "$200 – $450 / month",
        accent: "#ec4899",
        accentBg: "rgba(236, 72, 153, 0.1)",
    },
];

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
                "Email: thin_line_99@yahoo.com",
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
                "Email: thin_line_99@yahoo.com",
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

function MediaKit({ onNavigate }) {
    const [contactForm, setContactForm] = useState({
        name: "", email: "", company: "", placement: "", message: "",
    });
    const [contactSent, setContactSent] = useState(false);
    const [errors, setErrors] = useState({});

    function validateContact() {
        const e = {};
        if (!contactForm.name.trim()) e.name = "Name is required";
        if (!isValidEmail(contactForm.email)) e.email = "Valid email required";
        if (!contactForm.company.trim()) e.company = "Company is required";
        return e;
    }

    function handleContactSubmit(e) {
        e.preventDefault();
        const errs = validateContact();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        const inquiries = safeReadArray("cn_media_inquiries");
        inquiries.push({
            name: sanitizeText(contactForm.name, 100),
            email: normalizeEmailInput(contactForm.email),
            company: sanitizeText(contactForm.company, 140),
            placement: sanitizeText(contactForm.placement, 120),
            message: sanitizeText(contactForm.message, 1500),
            submittedAt: new Date().toISOString(),
        });
        safeWriteArray("cn_media_inquiries", inquiries.slice(-500));
        setContactSent(true);
    }

    function updateContact(field, value) {
        const limits = { name: 100, email: 254, company: 140, placement: 120, message: 1500 };
        setContactForm((prev) => ({ ...prev, [field]: limits[field] ? value.slice(0, limits[field]) : value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    const mediaKitSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Cin Nova Media Kit",
        description: "Advertise with Cin Nova. Audience stats, ad placement options, and brand assets.",
        url: `${siteUrl}/?page=media-kit`,
    };

    return (
        <main className="product-page media-kit-page">
            <SEO
                title="Media Kit | Advertise with Cin Nova"
                description="Reach students, parents, real estate investors, and tech professionals through Cin Nova newsletter sponsorships, article placements, and display advertising."
                url={`${siteUrl}/?page=media-kit`}
                type="website"
                schema={mediaKitSchema}
            />

            <section className="section blog-hero-section">
                <div className="section-heading blog-hero-copy">
                    <p className="eyebrow">MEDIA KIT 2026</p>
                    <h2>Reach the Cin Nova audience.</h2>
                    <p>
                        Cin Nova reaches students, parents, real estate investors, tech
                        professionals, and safety-conscious households through a growing blog,
                        newsletter, and resource library. This media kit covers audience stats,
                        placement options, technical specs, and how to get in touch.
                    </p>
                    <div className="media-kit-hero-actions">
                        <button
                            className="primary-btn"
                            onClick={() => downloadAsset("presspack")}
                        >
                            ↓ Download Press Pack
                        </button>
                        <a href="#contact" className="secondary-btn">
                            Contact for Rates →
                        </a>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="section-heading">
                    <p className="eyebrow">AUDIENCE OVERVIEW</p>
                    <h2>By the numbers.</h2>
                    <p>Current audience metrics across newsletter, blog, and resources.</p>
                </div>
                <div className="mk-stats-grid">
                    {audienceStats.map((stat) => (
                        <div key={stat.label} className="mk-stat-card">
                            <span className="mk-stat-icon">{stat.icon}</span>
                            <strong className="mk-stat-value">{stat.value}</strong>
                            <p className="mk-stat-label">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="section">
                <div className="section-heading">
                    <p className="eyebrow">AUDIENCE SEGMENTS</p>
                    <h2>Who reads Cin Nova.</h2>
                    <p>Four distinct reader segments across the Cin Nova content and product ecosystem.</p>
                </div>
                <div className="mk-segments-grid">
                    {audienceSegments.map((seg) => (
                        <article key={seg.name} className="mk-segment-card">
                            <div className="mk-segment-icon">{seg.icon}</div>
                            <h3>{seg.name}</h3>
                            <p>{seg.description}</p>
                            <div className="mk-segment-tags">
                                {seg.tags.map((tag) => (
                                    <span key={tag} className="mk-segment-tag">{tag}</span>
                                ))}
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="section">
                <div className="section-heading">
                    <p className="eyebrow">AD PLACEMENTS</p>
                    <h2>Six ways to reach the Cin Nova audience.</h2>
                    <p>
                        All placements are reviewed and approved by Cin Nova. Pricing shown is an
                        estimated range — final rates depend on campaign details and availability.
                    </p>
                </div>
                <div className="mk-placements-grid">
                    {adPlacements.map((placement) => (
                        <article
                            key={placement.name}
                            className="mk-placement-card"
                            style={{ "--mk-accent": placement.accent, "--mk-accent-bg": placement.accentBg }}
                        >
                            <div className="mk-placement-icon">{placement.icon}</div>
                            <h3>{placement.name}</h3>
                            <p className="mk-placement-format">{placement.format}</p>
                            <dl className="mk-placement-specs">
                                <dt>Specs</dt>
                                <dd>{placement.specs}</dd>
                                <dt>Reach</dt>
                                <dd>{placement.reach}</dd>
                            </dl>
                            <div className="mk-placement-price">{placement.range}</div>
                        </article>
                    ))}
                </div>
                <p className="mk-pricing-note">
                    All rates are estimated. Final pricing depends on campaign scope, duration, and current availability.
                    Custom packages are available — use the contact form below for a quote.
                </p>
            </section>

            <section className="section">
                <div className="section-heading">
                    <p className="eyebrow">BRAND ASSETS</p>
                    <h2>Downloads for press and partners.</h2>
                    <p>Download the Cin Nova press pack, brand guidelines, and audience report.</p>
                </div>
                <div className="mk-assets-grid">
                    <div className="mk-asset-card">
                        <div className="mk-asset-icon">📦</div>
                        <strong>Press Pack</strong>
                        <p>Company overview, product descriptions, audience summary, and contact information.</p>
                        <button className="secondary-btn" onClick={() => downloadAsset("presspack")}>
                            ↓ Download Press Pack
                        </button>
                    </div>
                    <div className="mk-asset-card">
                        <div className="mk-asset-icon">🎨</div>
                        <strong>Brand Guidelines</strong>
                        <p>Colors, typography, logo usage rules, tone of voice, and product accent colors.</p>
                        <button className="secondary-btn" onClick={() => downloadAsset("brandguidelines")}>
                            ↓ Download Brand Guidelines
                        </button>
                    </div>
                    <div className="mk-asset-card">
                        <div className="mk-asset-icon">📊</div>
                        <strong>Audience Report</strong>
                        <p>Detailed breakdown of reader segments, engagement metrics, and content categories.</p>
                        <button className="secondary-btn" onClick={() => downloadAsset("audiencereport")}>
                            ↓ Download Audience Report
                        </button>
                    </div>
                </div>
            </section>

            <section className="section" id="contact">
                <div className="section-heading">
                    <p className="eyebrow">CONTACT</p>
                    <h2>Ready to advertise? Get in touch.</h2>
                    <p>
                        Fill in the form below or email{" "}
                        <a
                            href="mailto:thin_line_99@yahoo.com"
                            className="mk-email-link"
                        >
                            thin_line_99@yahoo.com
                        </a>{" "}
                        directly with your campaign brief.
                    </p>
                </div>

                {contactSent ? (
                    <div className="partner-success">
                        <div className="partner-success-icon">✓</div>
                        <h3>Inquiry received.</h3>
                        <p>
                            Thanks for reaching out. We'll review your inquiry and get back to you
                            within 3–5 business days with availability and a rate proposal.
                        </p>
                    </div>
                ) : (
                    <form className="partner-form" onSubmit={handleContactSubmit} noValidate>
                        <div className="partner-form-row">
                            <div className="partner-form-field">
                                <label htmlFor="mk-name">Full Name *</label>
                                <input
                                    id="mk-name"
                                    type="text"
                                    value={contactForm.name}
                                    onChange={(e) => updateContact("name", e.target.value)}
                                    placeholder="Jane Smith"
                                    maxLength={100}
                                />
                                {errors.name && <span className="form-error">{errors.name}</span>}
                            </div>
                            <div className="partner-form-field">
                                <label htmlFor="mk-email">Email Address *</label>
                                <input
                                    id="mk-email"
                                    type="email"
                                    value={contactForm.email}
                                    onChange={(e) => updateContact("email", e.target.value)}
                                    placeholder="jane@example.com"
                                    maxLength={254}
                                />
                                {errors.email && <span className="form-error">{errors.email}</span>}
                            </div>
                        </div>
                        <div className="partner-form-row">
                            <div className="partner-form-field">
                                <label htmlFor="mk-company">Company *</label>
                                <input
                                    id="mk-company"
                                    type="text"
                                    value={contactForm.company}
                                    onChange={(e) => updateContact("company", e.target.value)}
                                    placeholder="Acme Corp"
                                    maxLength={140}
                                />
                                {errors.company && <span className="form-error">{errors.company}</span>}
                            </div>
                            <div className="partner-form-field">
                                <label htmlFor="mk-placement">Placement Interest</label>
                                <select
                                    id="mk-placement"
                                    value={contactForm.placement}
                                    onChange={(e) => updateContact("placement", e.target.value)}
                                >
                                    <option value="">Select a placement...</option>
                                    {adPlacements.map((p) => (
                                        <option key={p.name} value={p.name}>{p.name}</option>
                                    ))}
                                    <option value="Custom Package">Custom Package</option>
                                </select>
                            </div>
                        </div>
                        <div className="partner-form-field">
                            <label htmlFor="mk-message">Campaign Brief or Questions</label>
                            <textarea
                                id="mk-message"
                                rows={5}
                                value={contactForm.message}
                                onChange={(e) => updateContact("message", e.target.value)}
                                placeholder="Tell us about your product, target audience, and campaign goals..."
                                maxLength={1500}
                            />
                        </div>
                        <button type="submit" className="primary-btn">
                            Send Inquiry →
                        </button>
                    </form>
                )}
            </section>
        </main>
    );
}

export default MediaKit;
