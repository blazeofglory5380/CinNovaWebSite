import { useState } from "react";
import "../App.css";
import SEO from "../components/SEO.jsx";
import MarketingPhoto from "../components/MarketingPhoto.jsx";
import { mediaKitAssets, mediaKitPlacements, mediaKitSegments } from "../data/marketingImages.js";
import { siteUrl } from "../data/blogPosts.js";
import {
    isValidEmail,
    normalizeEmailInput,
    safeReadArray,
    safeWriteArray,
    sanitizeText,
} from "../utils/security.js";

import BusinessHero from "../components/business/BusinessHero.jsx";
import BusinessSection from "../components/business/BusinessSection.jsx";
import BusinessStats from "../components/business/BusinessStats.jsx";
import { businessAudienceStats } from "../data/businessCenter.js";
const adPlacements = mediaKitPlacements;

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
        <main className="product-page business-center-page media-kit-page">
            <SEO
                title="Media Kit | Advertise with Cin Nova"
                description="Reach students, parents, real estate investors, and tech professionals through Cin Nova newsletter sponsorships, article placements, and display advertising."
                url={`${siteUrl}/?page=media-kit`}
                type="website"
                schema={mediaKitSchema}
            />

            <BusinessHero
                eyebrow="MEDIA KIT 2026"
                title="Reach the Cin Nova audience."
                description="Cin Nova reaches students, parents, real estate investors, tech professionals, and safety-conscious households through a growing blog, newsletter, and resource library. This media kit covers audience stats, placement options, technical specs, and how to get in touch."
                pills={["Audience segments", "Ad placements", "Brand assets", "Rate inquiries"]}
                actions={[
                    { label: "Download Press Pack", onClick: () => downloadAsset("presspack") },
                    { label: "Contact for Rates", href: "#contact", variant: "secondary" },
                    { label: "Advertise With Us", onClick: () => onNavigate?.("advertise"), variant: "secondary" },
                ]}
            />

            <BusinessSection
                eyebrow="AUDIENCE OVERVIEW"
                title="By the numbers"
                description="Current audience metrics across newsletter, blog, and resources."
            >
                <BusinessStats
                    stats={businessAudienceStats}
                    note="Metrics marked “Placeholder metric” will be updated with verified analytics."
                />
            </BusinessSection>

            <BusinessSection
                eyebrow="AUDIENCE SEGMENTS"
                title="Who reads Cin Nova"
                description="Four distinct reader segments across the Cin Nova content and product ecosystem."
            >
                <div className="mk-segments-grid">
                    {mediaKitSegments.map((seg) => (
                        <article key={seg.name} className="mk-segment-card mk-segment-card-photo">
                            <div className="mk-segment-photo-wrap">
                                <MarketingPhoto src={seg.image} alt={seg.alt} className="mk-segment-photo-img" />
                            </div>
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
            </BusinessSection>

            <BusinessSection
                eyebrow="AD PLACEMENTS"
                title="Six ways to reach the Cin Nova audience"
                description="All placements are reviewed and approved by Cin Nova. Pricing shown is an estimated range — final rates depend on campaign details and availability."
            >
                <div className="mk-placements-grid">
                    {mediaKitPlacements.map((placement) => (
                        <article
                            key={placement.name}
                            className="mk-placement-card mk-placement-card-photo"
                            style={{ "--mk-accent": placement.accent, "--mk-accent-bg": placement.accentBg }}
                        >
                            <div className="mk-placement-photo-wrap">
                                <MarketingPhoto src={placement.image} alt={placement.alt} className="mk-placement-photo-img" />
                            </div>
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
                <div className="media-kit-hero-actions" style={{ justifyContent: "center", marginTop: "18px" }}>
                    <button
                        className="secondary-btn"
                        onClick={() => onNavigate?.("sponsor-newsletter")}
                    >
                        Sponsor the Newsletter
                    </button>
                    <button
                        className="secondary-btn"
                        onClick={() => onNavigate?.("partnerships")}
                    >
                        Partnerships
                    </button>
                </div>
            </BusinessSection>

            <BusinessSection
                eyebrow="BRAND ASSETS"
                title="Downloads for press and partners"
                description="Download the Cin Nova press pack, brand guidelines, and audience report."
            >
                <div className="mk-assets-grid">
                    {mediaKitAssets.map((asset) => (
                        <div key={asset.key} className="mk-asset-card mk-asset-card-photo">
                            <div className="mk-asset-photo-wrap">
                                <MarketingPhoto src={asset.image} alt={asset.alt} className="mk-asset-photo-img" />
                            </div>
                            <strong>{asset.title}</strong>
                            <p>{asset.description}</p>
                            <button className="secondary-btn" onClick={() => downloadAsset(asset.key)}>
                                ↓ Download {asset.title}
                            </button>
                        </div>
                    ))}
                </div>
            </BusinessSection>

            <BusinessSection
                id="contact"
                eyebrow="CONTACT"
                title="Ready to advertise? Get in touch."
                description="Fill in the form below or email thin_line_99@yahoo.com directly with your campaign brief."
            >

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
                                    {mediaKitPlacements.map((p) => (
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
            </BusinessSection>
        </main>
    );
}

export default MediaKit;
