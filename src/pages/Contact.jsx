import { useState } from "react";
import "../App.css";
import NewsletterSignup from "../components/NewsletterSignup.jsx";
import FeaturePhotoCard from "../components/FeaturePhotoCard.jsx";
import { contactProductGuide, contactTopics, productMarketing } from "../data/marketingImages.js";
import { saveSubscriber } from "../data/newsletterService.js";
import { isValidEmail, normalizeEmailInput, sanitizeText } from "../utils/security.js";
import { trackContactSubmit } from "../utils/analytics.js";
import SEO from "../components/SEO.jsx";
import { siteUrl } from "../data/blogPosts.js";

const inquiryTypes = [
    "Product Question",
    "Partnership Inquiry",
    "School & Business Plan",
    "Investor / Real Estate Tools",
    "Support",
    "Media / Blog Collaboration",
    "Other",
];

const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Cin Nova",
    description: "Contact Cin Nova for product questions, partnerships, school and business plans, media inquiries, and support.",
    url: `${siteUrl}/?page=contact`,
    publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
};

function Contact() {
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        // Capture the form node before any await (event target is reset after
        // the handler yields).
        const form = e.currentTarget;
        const formData = new FormData(form);
        const name = sanitizeText(formData.get("name"), 100);
        const email = normalizeEmailInput(formData.get("email"));
        const message = sanitizeText(formData.get("message"), 1500);
        const inquiryType = sanitizeText(formData.get("inquiryType"), 80);

        if (!name || !isValidEmail(email) || message.length < 10) {
            setError("Please enter your name, a valid email, and a message of at least 10 characters.");
            return;
        }

        setError("");
        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    message,
                    inquiryType,
                    source: "contact_form",
                    page: window.location.pathname + window.location.search,
                }),
            });
            const data = await response.json().catch(() => ({}));
            if (response.ok && data.ok) {
                trackContactSubmit({ page: "contact", status: "sent" });
                // Thank-you only after a confirmed successful send — the message
                // is delivered, no longer discarded.
                alert("Thanks! Your message has been received.");
                form.reset();
            } else {
                trackContactSubmit({ page: "contact", status: "error" });
                setError("Sorry, we couldn't send your message right now. Please try again, or email us directly.");
            }
        } catch {
            trackContactSubmit({ page: "contact", status: "error" });
            setError("Sorry, we couldn't send your message right now. Please try again, or email us directly.");
        }
    }

    return (
        <div className="product-page">
            <SEO
                title="Contact Cin Nova | Get in Touch"
                description="Contact Cin Nova for product questions, partnership inquiries, school and business plans, media collaborations, or technical support."
                url={`${siteUrl}/?page=contact`}
                type="website"
                schema={contactSchema}
            />

            {/* ── Hero ───────────────────────────────────────────── */}
            <section className="section" style={{ paddingBottom: "48px" }}>
                {/* Screen-reader/SEO top-level heading. The visible hero heading
                    below is an <h2> for design consistency; this gives the page a
                    single, valid <h1> without altering the layout. */}
                <h1 className="sr-only">Contact CinNova</h1>
                <div className="section-heading" style={{ marginBottom: 0 }}>
                    <p className="eyebrow">GET IN TOUCH</p>
                    <h2>Contact Cin Nova</h2>
                    <p style={{ maxWidth: "620px", margin: "0 auto", fontSize: "1.1rem", lineHeight: "1.9" }}>
                        Reach out for product questions, partnerships, support, media,
                        school/business inquiries, or early access.
                    </p>
                </div>
            </section>

            {/* ── Contact Cards ───────────────────────────────────── */}
            <section className="section" id="options">
                <div className="section-heading">
                    <p className="eyebrow">HOW CAN WE HELP</p>
                    <h2>Choose the right channel for your inquiry.</h2>
                    <p>
                        Every message goes to the same inbox — pick the type that best
                        describes your reason for reaching out.
                    </p>
                </div>

                <div className="product-grid product-grid-photo">
                    {contactTopics.map((card) => (
                        <FeaturePhotoCard
                            key={card.title}
                            image={card.src}
                            alt={card.alt}
                            category={card.category}
                            title={card.title}
                            description={card.description}
                        />
                    ))}
                </div>
            </section>

            {/* ── Contact Form ────────────────────────────────────── */}
            <section className="section showcase-section" id="form">
                <div className="section-heading">
                    <p className="eyebrow">SEND A MESSAGE</p>
                    <h2>We read every message.</h2>
                    <p>Fill out the form below and we'll get back to you as soon as possible.</p>
                </div>

                <div
                    className="newsletter-card"
                    style={{ textAlign: "left", maxWidth: "700px" }}
                >
                    <p className="eyebrow">CONTACT FORM</p>
                    <h3 style={{ marginBottom: "28px" }}>Tell us what's on your mind.</h3>

                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    name="name"
                                    className="form-input"
                                    type="text"
                                    placeholder="Your full name"
                                    maxLength={100}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    name="email"
                                    className="form-input"
                                    type="email"
                                    placeholder="you@example.com"
                                    maxLength={254}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Inquiry Type</label>
                            <select name="inquiryType" className="form-input" defaultValue="">
                                <option value="" disabled>Select an inquiry type...</option>
                                {inquiryTypes.map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Message</label>
                            <textarea
                                name="message"
                                className="form-input form-textarea"
                                placeholder="Describe your question or inquiry in as much detail as you'd like..."
                                rows={6}
                                maxLength={1500}
                                required
                            />
                        </div>

                        {error && <p className="form-error">{error}</p>}
                        <button type="submit" className="primary-btn contact-submit">
                            Send Message
                        </button>
                    </form>
                </div>
            </section>

            {/* ── Product Inquiry Guide ───────────────────────────── */}
            <section className="section" id="guide">
                <div className="section-heading">
                    <p className="eyebrow">PRODUCT INQUIRY GUIDE</p>
                    <h2>Not sure which product to mention?</h2>
                    <p>
                        Referencing the right product in your message helps us route
                        your inquiry faster and give you a more useful reply.
                    </p>
                </div>

                <div className="product-grid product-grid-photo">
                    {contactProductGuide.map((p) => (
                        <FeaturePhotoCard
                            key={p.name}
                            image={productMarketing[p.key].card.src}
                            alt={productMarketing[p.key].card.alt}
                            title={p.name}
                            description={p.description}
                        />
                    ))}
                </div>
            </section>

            {/* ── CTA ─────────────────────────────────────────────── */}
            <section className="section" id="newsletter">
                <div className="newsletter-card">
                    <p className="eyebrow">STAY IN THE LOOP</p>
                    <h2>Join the Cin Nova newsletter.</h2>
                    <p style={{ color: "#64748b", maxWidth: "500px", margin: "0 auto 8px", lineHeight: "1.8" }}>
                        Get product updates, early access announcements, and behind-the-scenes
                        content delivered to your inbox.
                    </p>
                    <NewsletterSignup
                        onSubscribe={saveSubscriber}
                        source="Contact Page"
                        tags={["Contact Page"]}
                    />
                </div>
            </section>

        </div>
    );
}

export default Contact;
