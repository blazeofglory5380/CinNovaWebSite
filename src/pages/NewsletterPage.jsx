import { useState } from "react";
import "../App.css";
import SEO from "../components/SEO.jsx";
import { siteUrl } from "../data/blogPosts.js";

const benefits = [
    {
        icon: "🚀",
        title: "Product launches first",
        description: "Get notified the moment a new Cin Nova app is ready for early access — before it's announced anywhere else.",
    },
    {
        icon: "📘",
        title: "Free guides and resources",
        description: "Every issue includes links to new downloadable guides, templates, and checklists — all free, no strings attached.",
    },
    {
        icon: "🔧",
        title: "Behind-the-scenes builds",
        description: "See how the products are being built: what features are shipping, what's being cut, and what the roadmap looks like.",
    },
    {
        icon: "🎯",
        title: "Early access and betas",
        description: "Subscribers get first invites to product betas, new feature previews, and Cin Nova resource drops before the general public.",
    },
];

const testimonials = [
    {
        name: "Sarah M.",
        role: "High School Student",
        initials: "SM",
        content:
            "The Cin Nova newsletter is the only one I actually open. Every issue has something I can use right away — whether it's a study tip or a resource I can download for free.",
    },
    {
        name: "James T.",
        role: "Real Estate Investor",
        initials: "JT",
        content:
            "I found Cin Nova through the real estate analysis template. Now I get every newsletter update. The content is practical — no fluff, no paid ads pretending to be advice.",
    },
    {
        name: "Rachel K.",
        role: "Parent of Three",
        initials: "RK",
        content:
            "Between the Kiddo updates and the safety articles, Cin Nova covers exactly what I need. The free guides are genuinely useful, not just lead magnets.",
    },
];

const faqs = [
    {
        q: "How often does the newsletter send?",
        a: "Roughly once or twice a week during active product builds — and less frequently when there's nothing worth your time to share. Cin Nova only sends when there's something useful.",
    },
    {
        q: "What topics does it cover?",
        a: "AI tools, education technology, household safety, real estate investing, early learning, product builds, and behind-the-scenes updates from the Cin Nova product team.",
    },
    {
        q: "Is it really free?",
        a: "Yes. The newsletter is free, all the guides and resources are free, and there is no premium tier. Cin Nova uses the audience to grow its product business, not to sell the newsletter itself.",
    },
    {
        q: "How do I unsubscribe?",
        a: "Every email has an unsubscribe link at the bottom. You can also email directly to be removed. Cin Nova respects your inbox.",
    },
];

const recentTopics = [
    {
        icon: "🤖",
        category: "AI & Technology",
        topic: "How AI Is Changing the Way Students Study",
        desc: "A practical breakdown of how AI tutoring, flashcard generation, and adaptive scheduling are shifting what effective studying looks like.",
    },
    {
        icon: "🏠",
        category: "Real Estate",
        topic: "Three Numbers Every Rental Property Investor Needs",
        desc: "Cap rate, cash-on-cash return, and monthly cash flow — explained plainly so you can analyze any deal before wasting time on a bad one.",
    },
    {
        icon: "🛡️",
        category: "Safety",
        topic: "The Household Chemicals Most Families Don't Know Are Dangerous",
        desc: "A room-by-room look at common products that create serious risk when mixed, stored improperly, or left accessible to children and pets.",
    },
];

function NewsletterPage({ onSubscribe, subscriberCount = 1247 }) {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle");
    const [openFaqIndex, setOpenFaqIndex] = useState(null);

    function handleSubmit(e) {
        e.preventDefault();
        if (!email.trim() || !email.includes("@")) {
            setStatus("error");
            return;
        }
        setStatus("loading");
        onSubscribe?.({ email, source: "Newsletter Landing Page", tags: ["Newsletter Landing Page"] });
        setStatus("success");
    }

    const nlSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Cin Nova Newsletter",
        description: "Join the Cin Nova newsletter. Get product updates, free guides, and early access.",
        url: `${siteUrl}/?page=newsletter`,
    };

    return (
        <main className="product-page newsletter-landing-page">
            <SEO
                title="Cin Nova Newsletter — Free Product Updates, Guides, and Early Access"
                description="Join 1,247+ readers getting Cin Nova product launches, free downloadable guides, behind-the-scenes builds, and early access to new features."
                url={`${siteUrl}/?page=newsletter`}
                type="website"
                schema={nlSchema}
            />

            {/* Hero */}
            <section className="section nl-hero-section">
                <div className="nl-hero-inner">
                    <div className="nl-hero-copy">
                        <div className="nl-hero-badge">
                            <span className="nl-pulse-dot" />
                            {subscriberCount.toLocaleString()}+ readers and growing
                        </div>
                        <p className="eyebrow">CIN NOVA NEWSLETTER</p>
                        <h1 className="nl-hero-headline">
                            The newsletter for people who want to understand what AI is actually
                            building.
                        </h1>
                        <p className="nl-hero-sub">
                            Product updates, free guides, behind-the-scenes builds, and early access
                            to the Cin Nova product ecosystem — in your inbox, free, every week.
                        </p>
                        <ul className="nl-hero-perks">
                            <li>🚀 Product launches and early access</li>
                            <li>📘 Free guides and downloadable resources</li>
                            <li>🔧 Behind-the-scenes build updates</li>
                            <li>🎯 No spam, no paid posts, just useful content</li>
                        </ul>
                    </div>

                    <div className="nl-hero-form-card">
                        {status === "success" ? (
                            <div className="nl-success-state">
                                <div className="nl-success-icon">✓</div>
                                <strong>You're subscribed.</strong>
                                <p>
                                    Welcome to the Cin Nova newsletter. Watch your inbox for the
                                    next issue — and check your downloads folder if you came here
                                    for a guide.
                                </p>
                            </div>
                        ) : (
                            <>
                                <p className="nl-form-card-title">Join the newsletter — it's free</p>
                                <form
                                    className="nl-form"
                                    onSubmit={handleSubmit}
                                    noValidate
                                >
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setStatus("idle");
                                        }}
                                        placeholder="your@email.com"
                                        aria-label="Email address"
                                    />
                                    {status === "error" && (
                                        <p className="nl-form-error">Please enter a valid email.</p>
                                    )}
                                    <button
                                        type="submit"
                                        className="primary-btn nl-submit-btn"
                                        disabled={status === "loading"}
                                    >
                                        {status === "loading" ? "Subscribing…" : "Subscribe Free →"}
                                    </button>
                                </form>
                                <p className="nl-form-note">
                                    Free. No spam. Unsubscribe any time.
                                </p>
                                <div className="nl-form-social-proof">
                                    <div className="nl-avatar-stack">
                                        {["SM", "JT", "RK"].map((initials) => (
                                            <div key={initials} className="nl-avatar">{initials}</div>
                                        ))}
                                    </div>
                                    <span>Joined by {subscriberCount.toLocaleString()}+ readers</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="section">
                <div className="section-heading">
                    <p className="eyebrow">WHAT YOU GET</p>
                    <h2>Four reasons to subscribe.</h2>
                    <p>Each issue delivers something useful — no filler, no sponsored posts disguised as advice.</p>
                </div>
                <div className="nl-benefits-grid">
                    {benefits.map((b) => (
                        <div key={b.title} className="nl-benefit-card">
                            <span className="nl-benefit-icon">{b.icon}</span>
                            <strong>{b.title}</strong>
                            <p>{b.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Recent topics */}
            <section className="section">
                <div className="section-heading">
                    <p className="eyebrow">RECENT TOPICS</p>
                    <h2>What we've been covering.</h2>
                    <p>A sample of the topics from recent Cin Nova newsletters and blog posts.</p>
                </div>
                <div className="nl-topics-list">
                    {recentTopics.map((topic) => (
                        <article key={topic.topic} className="nl-topic-item">
                            <div className="nl-topic-icon">{topic.icon}</div>
                            <div className="nl-topic-body">
                                <p className="nl-topic-category">{topic.category}</p>
                                <strong>{topic.topic}</strong>
                                <p>{topic.desc}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* Testimonials */}
            <section className="section">
                <div className="section-heading">
                    <p className="eyebrow">WHAT READERS SAY</p>
                    <h2>From the inbox.</h2>
                    <p>Real feedback from Cin Nova newsletter readers.</p>
                </div>
                <div className="nl-testimonials-grid">
                    {testimonials.map((t) => (
                        <article key={t.name} className="nl-testimonial-card">
                            <p className="nl-testimonial-text">"{t.content}"</p>
                            <div className="nl-testimonial-author">
                                <div className="nl-testimonial-avatar">{t.initials}</div>
                                <div>
                                    <strong>{t.name}</strong>
                                    <span>{t.role}</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* Second signup CTA */}
            <section className="section nl-mid-cta-section">
                <div className="nl-mid-cta">
                    <p className="eyebrow">STILL ON THE FENCE?</p>
                    <h2>
                        The worst that happens is you unsubscribe in one click.
                    </h2>
                    <p>
                        Join {subscriberCount.toLocaleString()}+ readers who get practical Cin Nova
                        content — free guides, product updates, and launch announcements.
                    </p>
                    {status === "success" ? (
                        <p className="nl-already-subbed">✓ You're already subscribed. See you in your inbox.</p>
                    ) : (
                        <form
                            className="nl-inline-form"
                            onSubmit={handleSubmit}
                            noValidate
                        >
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setStatus("idle");
                                }}
                                placeholder="your@email.com"
                            />
                            <button
                                type="submit"
                                className="primary-btn"
                                disabled={status === "loading"}
                            >
                                {status === "loading" ? "Subscribing…" : "Subscribe →"}
                            </button>
                        </form>
                    )}
                </div>
            </section>

            {/* FAQ */}
            <section className="section">
                <div className="section-heading">
                    <p className="eyebrow">FAQ</p>
                    <h2>Common questions.</h2>
                </div>
                <div className="nl-faq-list">
                    {faqs.map((faq, i) => (
                        <div
                            key={faq.q}
                            className={`nl-faq-item${openFaqIndex === i ? " nl-faq-open" : ""}`}
                        >
                            <button
                                className="nl-faq-question"
                                onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                                aria-expanded={openFaqIndex === i}
                            >
                                <span>{faq.q}</span>
                                <span className="nl-faq-arrow">{openFaqIndex === i ? "−" : "+"}</span>
                            </button>
                            {openFaqIndex === i && (
                                <p className="nl-faq-answer">{faq.a}</p>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}

export default NewsletterPage;
