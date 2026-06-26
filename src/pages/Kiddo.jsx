import "../App.css";
import NewsletterSignup from "../components/NewsletterSignup.jsx";
import ProductHeroPhoto from "../components/ProductHeroPhoto.jsx";
import FeaturePhotoCard from "../components/FeaturePhotoCard.jsx";
import { productMarketing } from "../data/marketingImages.js";
import { saveSubscriber } from "../data/newsletterService.js";
import SEO from "../components/SEO.jsx";
import { siteUrl } from "../data/blogPosts.js";

const { hero, features } = productMarketing.kiddo;

const kiddoBenefits = [
    {
        src: "/images/marketing/about-safety-first.jpg",
        alt: "Family in a safe, child-friendly home environment",
        category: "Safety",
        title: "Safe for Young Children",
        description: "No ads, no social features, no external links. Kiddo is a fully closed, child-safe environment reviewed for ages 3–8. COPPA compliant and privacy-first by design.",
    },
    {
        src: "/images/marketing/kiddo-progress-tracking.jpg",
        alt: "Children learning in an age-appropriate classroom",
        category: "Curriculum",
        title: "Age-Appropriate Learning",
        description: "Content is structured around early childhood milestones and adapts automatically to each child's pace — never too easy, never too frustrating.",
    },
    {
        src: "/images/education/ai-tutor-teacher-classroom-partnership.jpg",
        alt: "Parent and educator guiding a child's learning",
        category: "Parents",
        title: "Full Parent Controls",
        description: "Set daily time limits, choose which subjects to focus on, lock specific activities, and require your approval before a child advances to a new level.",
    },
    {
        src: "/images/education/online-education-platform-adaptive-learning.jpg",
        alt: "Child learning with guided digital tools on a tablet",
        category: "Insights",
        title: "Progress Monitoring",
        description: "Real-time insight into what your child has mastered, where they need support, and how their learning compares to early childhood development benchmarks.",
    },
];

const kiddoSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Kiddo",
    applicationCategory: "EducationApplication",
    description: "Interactive early learning app for children ages 3–8 with reading, writing, counting, math games, stories, and a parent dashboard.",
    operatingSystem: "Web",
    url: `${siteUrl}/?page=kiddo`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
};

function Kiddo() {
    return (
        <div className="product-page">
            <SEO
                title="Kiddo | Early Learning App for Kids Ages 3–8 — Cin Nova"
                description="Kiddo makes learning to read, write, count, and explore the world a joyful adventure for children ages 3–8, with a parent dashboard to track progress. In development by Cin Nova."
                url={`${siteUrl}/?page=kiddo`}
                type="website"
                schema={kiddoSchema}
            />

            {/* ── Hero ───────────────────────────────────────────── */}
            <section className="studynest-hero">
                <div>
                    <p className="eyebrow">KIDDO</p>
                    <h1>AI-powered learning built for young minds.</h1>
                    <p className="hero-text">
                        Kiddo makes learning to read, write, count, and explore the world
                        a joyful adventure for children ages 3–8 — with interactive stories,
                        games, and a parent dashboard that keeps you in the loop.
                    </p>
                    <div className="hero-actions">
                        <a href="#waitlist" className="primary-btn">Join Waitlist</a>
                        <a href="#features" className="secondary-btn">View Features</a>
                    </div>
                </div>

                <ProductHeroPhoto src={hero.src} alt={hero.alt} />
            </section>

            <section className="section" id="features">
                <div className="section-heading">
                    <p className="eyebrow">FEATURES</p>
                    <h2>Everything children need to learn, explore, and grow</h2>
                    <p>
                        Kiddo covers every early learning milestone — from the alphabet to
                        addition — through games, stories, and guided practice children
                        actually enjoy.
                    </p>
                </div>

                <div className="product-grid product-grid-photo">
                    {features.map((feature) => (
                        <FeaturePhotoCard key={feature.title} {...feature} />
                    ))}
                </div>
            </section>

            {/* ── Learning Preview ────────────────────────────────── */}
            <section className="section showcase-section" id="preview">
                <div className="section-heading">
                    <p className="eyebrow">LEARNING IN ACTION</p>
                    <h2>See how Kiddo teaches through play and guided discovery</h2>
                </div>

                <div className="showcase-grid">
                    <div className="showcase-card">
                        <h3>ABC &amp; Reading Session</h3>
                        <div className="chat-user">
                            Kiddo: Can you find the animal that starts with the letter C?
                            🐱 🐶 🐰 🦊
                        </div>
                        <div className="chat-ai">
                            <strong>🐱 Yes! Cat starts with C!</strong>
                            <br /><br />
                            Great job, Emma! C makes the "kuh" sound.
                            C — C — Cat. C — C — Car. C — C — Cookie.
                            <br /><br />
                            You earned a ⭐ Gold Star! Ready to try writing the letter C?
                        </div>
                    </div>

                    <div className="showcase-card">
                        <h3>Counting &amp; Math Game</h3>
                        <div className="flashcard-preview">
                            <p style={{ color: "#1d4ed8", fontWeight: 900, fontSize: "0.8rem", letterSpacing: "1px", marginBottom: "10px" }}>
                                COUNTING CHALLENGE — LEVEL 2
                            </p>
                            <p style={{ color: "#334155", fontSize: "1.1rem", marginBottom: "10px" }}>
                                🍎 🍎 🍎 + 🍎 🍎 = ?
                            </p>
                            <strong style={{ fontSize: "1.6rem", display: "block", marginBottom: "6px" }}>3 + 2 = 5 ✅</strong>
                            <p style={{ color: "#64748b", fontSize: "0.88rem", lineHeight: "1.6" }}>
                                Noah counted the apples one by one and got it right!
                                Score: 7/8 correct. Next: subtraction with stars ⭐
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Interactive Stories + Memory Games Preview ────────── */}
            <section className="section" id="stories">
                <div className="section-heading">
                    <p className="eyebrow">STORIES &amp; GAMES</p>
                    <h2>Adventures that teach — every choice builds a skill</h2>
                </div>

                <div className="showcase-grid">
                    <div className="showcase-card">
                        <h3>Interactive Story — The Lost Star</h3>
                        <div className="chat-ai">
                            <em style={{ color: "#64748b" }}>
                                Luna the bunny found a glowing star in the meadow. It was lost
                                and wanted to go home to the sky. Luna needed to cross the
                                Whispering Forest to find the rainbow bridge...
                            </em>
                        </div>
                        <div className="chat-user" style={{ marginTop: "10px" }}>
                            What should Luna do?
                            <br />
                            <strong>A)</strong> Follow the fireflies 🪲&nbsp;&nbsp;
                            <strong>B)</strong> Ask the owl 🦉&nbsp;&nbsp;
                            <strong>C)</strong> Walk alone 🐰
                        </div>
                        <div className="chat-ai">
                            You chose <strong>B — Ask the owl!</strong> Great thinking!
                            The wise owl knew the forest path. Luna learned that asking for
                            help is always a good idea. <strong>New word: Wisdom 🦉</strong>
                        </div>
                    </div>

                    <div className="showcase-card">
                        <h3>Memory Match Game</h3>
                        <div className="preview-grid" style={{ marginTop: "14px" }}>
                            <div><strong>8</strong><span>Cards Left</span></div>
                            <div><strong>5</strong><span>Matches</span></div>
                            <div><strong>12s</strong><span>Fastest Flip</span></div>
                            <div><strong>Level 2</strong><span>Current</span></div>
                        </div>
                        <div className="preview-note" style={{ marginTop: "14px" }}>
                            <p>Shapes &amp; Colors — Match Game</p>
                            <h4>Sofia matched the blue circle — 3 in a row!</h4>
                            <span>
                                Pattern recognition score improving. Sofia is now 40% faster
                                at matching than her first session. Unlocking Level 3: Animals.
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Benefits Section ────────────────────────────────── */}
            <section className="section showcase-section" id="benefits">
                <div className="section-heading">
                    <p className="eyebrow">BUILT FOR FAMILIES</p>
                    <h2>Safe, age-appropriate, and always in your hands</h2>
                    <p>
                        Kiddo is designed from the ground up for young children — with
                        parent controls, no ads, and content reviewed by early childhood
                        education specialists.
                    </p>
                </div>

                <div className="product-grid product-grid-photo">
                    {kiddoBenefits.map((benefit) => (
                        <FeaturePhotoCard key={benefit.title} {...benefit} />
                    ))}
                </div>
            </section>

            {/* ── Parent Dashboard Preview ────────────────────────── */}
            <section className="section" id="parents">
                <div className="section-heading">
                    <p className="eyebrow">PARENT DASHBOARD</p>
                    <h2>Stay connected to your child's learning journey</h2>
                </div>

                <div className="showcase-grid">
                    <div className="showcase-card">
                        <h3>Weekly Progress Report</h3>
                        <div className="preview-grid" style={{ marginTop: "14px" }}>
                            <div><strong>14</strong><span>Lessons Done</span></div>
                            <div><strong>3h 20m</strong><span>Time Learned</span></div>
                            <div><strong>8</strong><span>Stars Earned</span></div>
                            <div><strong>92%</strong><span>Accuracy</span></div>
                        </div>
                        <div className="preview-note" style={{ marginTop: "14px" }}>
                            <p>AI Parent Insight — Emma, Age 5</p>
                            <h4>Strong week! Reading is her superpower.</h4>
                            <span>
                                Emma completed all 5 reading lessons and scored above 90%
                                on each. Recommend adding 10 minutes of counting practice
                                this week to keep math on track.
                            </span>
                        </div>
                    </div>

                    <div className="showcase-card">
                        <h3>Achievement Milestones</h3>
                        <div className="flashcard-preview">
                            <p style={{ color: "#1d4ed8", fontWeight: 900, fontSize: "0.8rem", letterSpacing: "1px", marginBottom: "12px" }}>
                                BADGES EARNED THIS MONTH
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {[
                                    ["ABC", "Alphabet Champion", "All 26 letters mastered"],
                                    ["READ", "Bookworm", "10 stories completed"],
                                    ["STAR", "Gold Star Collector", "25 stars earned"],
                                    ["NUM", "Number Ninja", "Counted to 50 without help"],
                                    ["COLOR", "Color Master", "All 12 colors identified"],
                                ].map(([label, badge, desc]) => (
                                    <div key={badge} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 0", borderBottom: "1px solid #e2e8f0" }}>
                                        <span className="kiddo-badge-label">{label}</span>
                                        <div>
                                            <strong style={{ display: "block", color: "#0f172a", fontSize: "0.88rem" }}>{badge}</strong>
                                            <span style={{ color: "#64748b", fontSize: "0.78rem" }}>{desc}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Pricing ─────────────────────────────────────────── */}
            <section className="section pricing-section" id="pricing">
                <div className="section-heading">
                    <p className="eyebrow">PRICING</p>
                    <h2>Affordable learning for every family</h2>
                    <p>Cancel anytime. No ads. No surprise charges.</p>
                </div>

                <div className="pricing-grid">
                    <div className="pricing-card">
                        <p className="product-category">STARTER</p>
                        <h3>Free</h3>
                        <div className="price">$0</div>
                        <p>
                            ABC learning, basic counting, 5 interactive stories, and
                            memory games. Perfect for getting started with one child.
                        </p>
                    </div>

                    <div className="pricing-card featured">
                        <p className="product-category">FAMILY</p>
                        <h3>Kiddo Plus</h3>
                        <div className="price">$7.99/mo</div>
                        <p>
                            All 12 learning modules, unlimited stories, full parent
                            dashboard, progress tracking, achievement rewards, and
                            monthly learning reports. Up to 3 child profiles.
                        </p>
                    </div>

                    <div className="pricing-card">
                        <p className="product-category">CLASSROOM</p>
                        <h3>Educator Plan</h3>
                        <div className="price">Coming Soon</div>
                        <p>
                            Classroom tools, student progress tracking, teacher
                            dashboards, and curriculum alignment for Pre-K through
                            Grade 2. Built for schools and daycares.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── CTA / Waitlist ───────────────────────────────────── */}
            <section className="section" id="waitlist">
                <div className="newsletter-card">
                    <p className="eyebrow">EARLY ACCESS</p>
                    <h2>Give your child a head start — join the Kiddo waitlist today.</h2>
                    <NewsletterSignup
                        onSubscribe={saveSubscriber}
                        source="Kiddo Waitlist"
                        tags={["Kiddo", "Early Access"]}
                        buttonLabel="Get Early Access"
                    />
                </div>
            </section>

        </div>
    );
}

export default Kiddo;
