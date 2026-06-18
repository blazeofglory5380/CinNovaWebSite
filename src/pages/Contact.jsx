import "../App.css";
import NewsletterSignup from "../components/NewsletterSignup.jsx";
import { saveSubscriber } from "../data/newsletterService.js";

const contactCards = [
    {
        icon: "🎓",
        title: "Product Questions",
        category: "General",
        description:
            "Questions about any Cin Nova product — features, availability, how to get started, or what's coming next.",
    },
    {
        icon: "🤝",
        title: "Partnership Inquiries",
        category: "Business",
        description:
            "Interested in co-marketing, cross-promotions, integration partnerships, or affiliate arrangements.",
    },
    {
        icon: "🏫",
        title: "School & Business Plans",
        category: "Enterprise",
        description:
            "Looking for classroom licenses, team subscriptions, school dashboards, or volume business plans.",
    },
    {
        icon: "🏡",
        title: "Investor / Real Estate Tools",
        category: "Real Estate",
        description:
            "Questions about Cin Nova Real Estate — deal analysis, cash flow tools, mortgage calculators, or investment features.",
    },
    {
        icon: "🛠️",
        title: "Support",
        category: "Help",
        description:
            "Experiencing a bug, account issue, or technical problem? Describe what's happening and we'll help.",
    },
    {
        icon: "📰",
        title: "Media / Blog Collaborations",
        category: "Media",
        description:
            "Press inquiries, content partnerships, guest blog opportunities, or coverage of Cin Nova products.",
    },
];

const productGuide = [
    {
        icon: "🎓",
        name: "StudyNest",
        description:
            "Mention StudyNest for questions about AI tutoring, notes, flashcards, quizzes, study guides, or education partnerships.",
    },
    {
        icon: "🛡️",
        name: "PoisonGuard",
        description:
            "Mention PoisonGuard for substance safety lookups, household hazard tools, pet safety, or emergency guidance features.",
    },
    {
        icon: "💻",
        name: "TechMate AI",
        description:
            "Mention TechMate AI for device troubleshooting, error code lookup, software support, or IT help desk tools.",
    },
    {
        icon: "🧸",
        name: "Kiddo",
        description:
            "Mention Kiddo for children's reading, writing, counting, math activities, or parent dashboard and tracking features.",
    },
    {
        icon: "🏡",
        name: "Cin Nova Real Estate",
        description:
            "Mention Cin Nova Real Estate for property analysis, mortgage tools, cash flow modeling, or investment calculators.",
    },
];

const inquiryTypes = [
    "Product Question",
    "Partnership Inquiry",
    "School & Business Plan",
    "Investor / Real Estate Tools",
    "Support",
    "Media / Blog Collaboration",
    "Other",
];

function Contact() {
    function handleSubmit(e) {
        e.preventDefault();
        alert("Thanks! Your message has been received.");
    }

    return (
        <div className="product-page">

            {/* ── Hero ───────────────────────────────────────────── */}
            <section className="section" style={{ paddingBottom: "48px" }}>
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

                <div className="product-grid">
                    {contactCards.map((card) => (
                        <article className="product-card" key={card.title}>
                            <div className="product-icon">{card.icon}</div>
                            <p className="product-category">{card.category}</p>
                            <h3>{card.title}</h3>
                            <p>{card.description}</p>
                        </article>
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
                                    className="form-input"
                                    type="text"
                                    placeholder="Your full name"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    className="form-input"
                                    type="email"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Inquiry Type</label>
                            <select className="form-input" defaultValue="">
                                <option value="" disabled>Select an inquiry type...</option>
                                {inquiryTypes.map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Message</label>
                            <textarea
                                className="form-input form-textarea"
                                placeholder="Describe your question or inquiry in as much detail as you'd like..."
                                rows={6}
                                required
                            />
                        </div>

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

                <div className="product-grid">
                    {productGuide.map((p) => (
                        <article className="product-card" key={p.name}>
                            <div className="product-icon">{p.icon}</div>
                            <h3>{p.name}</h3>
                            <p>{p.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            {/* ── CTA ─────────────────────────────────────────────── */}
            <section className="section" id="newsletter">
                <div className="newsletter-card">
                    <p className="eyebrow">STAY IN THE LOOP</p>
                    <h2>Join the Cin Nova newsletter.</h2>
                    <p style={{ color: "#94a3b8", maxWidth: "500px", margin: "0 auto 8px", lineHeight: "1.8" }}>
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
