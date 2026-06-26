import { useState } from "react";
import "../App.css";
import SEO from "../components/SEO.jsx";
import NewsletterSignup from "../components/NewsletterSignup.jsx";
import MarketingPhoto from "../components/MarketingPhoto.jsx";
import { partnerTypeImages } from "../data/marketingImages.js";
import { siteUrl } from "../data/blogPosts.js";
import {
    isValidEmail,
    normalizeEmailInput,
    safeReadArray,
    safeWriteArray,
    sanitizeText,
} from "../utils/security.js";

const partnerTypes = partnerTypeImages;

const howItWorks = [
    {
        step: "01",
        title: "Apply",
        description: "Submit your interest using the form below. Include your company, channel, or website so we can review the fit.",
    },
    {
        step: "02",
        title: "Review",
        description: "The Cin Nova team reviews every application. You'll hear back within 5–7 business days with next steps or questions.",
    },
    {
        step: "03",
        title: "Launch",
        description: "We finalize the agreement, set up tracking or scheduling, and execute the first campaign, article, or integration together.",
    },
];

const partnerTypeOptions = [
    "Affiliate Partner",
    "Content Partner",
    "Technology Partner",
    "Sponsor",
];

function Partners({ onSubscribe }) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        company: "",
        website: "",
        type: "Affiliate Partner",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    function validate() {
        const e = {};
        if (!form.name.trim()) e.name = "Name is required";
        if (!isValidEmail(form.email)) e.email = "Valid email is required";
        if (!form.company.trim()) e.company = "Company or channel name is required";
        return e;
    }

    function handleSubmit(e) {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        const applications = safeReadArray("cn_partner_applications");
        applications.push({
            name: sanitizeText(form.name, 100),
            email: normalizeEmailInput(form.email),
            company: sanitizeText(form.company, 140),
            website: sanitizeText(form.website, 240),
            type: partnerTypeOptions.includes(form.type) ? form.type : "Affiliate Partner",
            message: sanitizeText(form.message, 1500),
            submittedAt: new Date().toISOString(),
        });
        safeWriteArray("cn_partner_applications", applications.slice(-500));
        setSubmitted(true);
    }

    function update(field, value) {
        const limits = { name: 100, email: 254, company: 140, website: 240, message: 1500 };
        setForm((prev) => ({ ...prev, [field]: limits[field] ? value.slice(0, limits[field]) : value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    const partnerSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Cin Nova Partner Program",
        description:
            "Work with Cin Nova as a content partner, affiliate, technology partner, or sponsor.",
        url: `${siteUrl}/?page=partners`,
    };

    return (
        <main className="product-page partners-page">
            <SEO
                title="Partner Program | Cin Nova"
                description="Work with Cin Nova as a content partner, affiliate, technology partner, or sponsor. Apply to join the Cin Nova partner network."
                url={`${siteUrl}/?page=partners`}
                type="website"
                schema={partnerSchema}
            />

            <section className="section blog-hero-section">
                <div className="section-heading blog-hero-copy">
                    <p className="eyebrow">PARTNER PROGRAM</p>
                    <h2>Work with a growing AI software ecosystem.</h2>
                    <p>
                        Cin Nova is building a multi-product software company across education,
                        safety, tech support, early learning, and real estate. We offer four ways
                        to partner — from content collaboration to full sponsorships.
                    </p>
                    <div className="resources-hero-stats">
                        <span>Growing newsletter audience</span>
                        <span>Live resource downloads</span>
                        <span>7 article categories</span>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="section-heading">
                    <p className="eyebrow">PARTNERSHIP TYPES</p>
                    <h2>Four ways to work with Cin Nova.</h2>
                    <p>Choose the partnership model that fits your company, channel, or goals.</p>
                </div>
                <div className="partner-types-grid">
                    {partnerTypes.map((pt) => (
                        <article
                            key={pt.name}
                            className="partner-type-card partner-type-card-photo"
                            style={{ "--pt-accent": pt.accent, "--pt-accent-bg": pt.accentBg }}
                        >
                            <div className="partner-type-photo-wrap">
                                <MarketingPhoto src={pt.image} alt={pt.alt} className="partner-type-photo-img" />
                            </div>
                            <h3>{pt.name}</h3>
                            <p>{pt.description}</p>
                            <ul className="partner-type-benefits">
                                {pt.benefits.map((b) => (
                                    <li key={b}>{b}</li>
                                ))}
                            </ul>
                            <div className="partner-type-footer">
                                <span className="partner-best-for">
                                    <strong>Best for:</strong> {pt.bestFor}
                                </span>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="section">
                <div className="section-heading">
                    <p className="eyebrow">HOW IT WORKS</p>
                    <h2>Three steps from interest to launch.</h2>
                    <p>Every partnership starts with a brief application and a quick review.</p>
                </div>
                <div className="partner-steps-row">
                    {howItWorks.map((step) => (
                        <div key={step.step} className="partner-step">
                            <span className="partner-step-number">{step.step}</span>
                            <strong>{step.title}</strong>
                            <p>{step.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="section">
                <div className="partner-spotlight-banner">
                    <div>
                        <p className="eyebrow">FOUNDING PARTNERS</p>
                        <h2>Be among the first.</h2>
                        <p>
                            Cin Nova is actively seeking founding partners across all four program
                            types. Founding partners receive priority placement, co-marketing
                            opportunities, and featured recognition as the audience grows.
                        </p>
                    </div>
                    <div className="partner-spotlight-slots">
                        {["Content", "Affiliate", "Technology", "Sponsor"].map((t) => (
                            <div key={t} className="partner-spotlight-slot">
                                <span>Open</span>
                                <strong>{t}</strong>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section" id="apply">
                <div className="section-heading">
                    <p className="eyebrow">APPLY NOW</p>
                    <h2>Tell us about your interest.</h2>
                    <p>
                        Fill in the form below. We review every application and respond within
                        5–7 business days.
                    </p>
                </div>

                {submitted ? (
                    <div className="partner-success">
                        <div className="partner-success-icon">✓</div>
                        <h3>Application received.</h3>
                        <p>
                            Thanks for your interest in the Cin Nova partner program. We review
                            every application carefully and will be in touch within 5–7 business
                            days.
                        </p>
                    </div>
                ) : (
                    <form className="partner-form" onSubmit={handleSubmit} noValidate>
                        <div className="partner-form-row">
                            <div className="partner-form-field">
                                <label htmlFor="partner-name">Full Name *</label>
                                <input
                                    id="partner-name"
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => update("name", e.target.value)}
                                    placeholder="Jane Smith"
                                    maxLength={100}
                                />
                                {errors.name && <span className="form-error">{errors.name}</span>}
                            </div>
                            <div className="partner-form-field">
                                <label htmlFor="partner-email">Email Address *</label>
                                <input
                                    id="partner-email"
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => update("email", e.target.value)}
                                    placeholder="jane@example.com"
                                    maxLength={254}
                                />
                                {errors.email && <span className="form-error">{errors.email}</span>}
                            </div>
                        </div>
                        <div className="partner-form-row">
                            <div className="partner-form-field">
                                <label htmlFor="partner-company">Company or Channel *</label>
                                <input
                                    id="partner-company"
                                    type="text"
                                    value={form.company}
                                    onChange={(e) => update("company", e.target.value)}
                                    placeholder="Acme Corp or YouTube/Blog name"
                                    maxLength={140}
                                />
                                {errors.company && <span className="form-error">{errors.company}</span>}
                            </div>
                            <div className="partner-form-field">
                                <label htmlFor="partner-website">Website or Channel URL</label>
                                <input
                                    id="partner-website"
                                    type="url"
                                    value={form.website}
                                    onChange={(e) => update("website", e.target.value)}
                                    placeholder="https://yoursite.com"
                                    maxLength={240}
                                />
                            </div>
                        </div>
                        <div className="partner-form-field">
                            <label htmlFor="partner-type">Partnership Type</label>
                            <select
                                id="partner-type"
                                value={form.type}
                                onChange={(e) => update("type", e.target.value)}
                            >
                                {partnerTypeOptions.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                        <div className="partner-form-field">
                            <label htmlFor="partner-message">Tell us about the opportunity</label>
                            <textarea
                                id="partner-message"
                                rows={5}
                                value={form.message}
                                onChange={(e) => update("message", e.target.value)}
                                placeholder="Describe your audience, goals, and how you'd like to work with Cin Nova..."
                                maxLength={1500}
                            />
                        </div>
                        <button type="submit" className="primary-btn">
                            Submit Application →
                        </button>
                    </form>
                )}
            </section>

            <section className="section" id="newsletter">
                <div className="newsletter-card">
                    <p className="eyebrow">STAY UPDATED</p>
                    <h2>Get partner program updates and announcements.</h2>
                    <NewsletterSignup
                        onSubscribe={onSubscribe}
                        source="Partners Page"
                        tags={["Partner Interest"]}
                    />
                </div>
            </section>
        </main>
    );
}

export default Partners;
