import "../App.css";

const featured = {
    category: "AI & Technology",
    title: "How AI Tools Are Changing the Way People Learn, Work, and Build",
    excerpt:
        "Explore how AI-powered apps can support students, families, technicians, investors, and everyday users — and why the next wave of software is built around practical intelligence, not hype.",
    readTime: "8 min read",
    date: "June 2026",
    tags: ["AI", "Education", "Tech Support", "Real Estate", "Productivity"],
};

const categories = [
    { icon: "🤖", name: "AI & Technology" },
    { icon: "📚", name: "Education" },
    { icon: "🛡️", name: "Safety & Family" },
    { icon: "🏡", name: "Real Estate" },
    { icon: "🧸", name: "Parenting & Kids" },
    { icon: "📢", name: "Product Updates" },
    { icon: "💡", name: "Entrepreneurship" },
];

const articles = [
    {
        category: "Education",
        title: "How AI Is Changing Education",
        excerpt:
            "AI-powered tools like StudyNest are reshaping how students take notes, study flashcards, and prepare for exams — at any hour of the day.",
    },
    {
        category: "Education",
        title: "Best Study Tools for Students",
        excerpt:
            "A practical guide to the tools that help students stay organized, retain information, and cut study time without cutting corners.",
    },
    {
        category: "Safety & Family",
        title: "Poison Safety Tips for Families",
        excerpt:
            "What every parent should know about household chemicals, medication storage, and what to do if an accidental exposure happens.",
    },
    {
        category: "Safety & Family",
        title: "Why Pet Safety Apps Matter",
        excerpt:
            "Pets can't tell you what they ate. Here's why a fast, reliable substance lookup tool for animals could save a life.",
    },
    {
        category: "AI & Technology",
        title: "How AI Can Help Technicians Troubleshoot Faster",
        excerpt:
            "From error codes to network diagnostics, AI is changing the way IT professionals and everyday users solve device problems.",
    },
    {
        category: "Real Estate",
        title: "Beginner Guide to Real Estate Deal Analysis",
        excerpt:
            "Understanding cap rates, cash-on-cash returns, and cash flow before you make your first or next investment property offer.",
    },
    {
        category: "Parenting & Kids",
        title: "How Kids Learn ABCs and Numbers",
        excerpt:
            "Research-backed approaches to early literacy and numeracy — and how apps like Kiddo can reinforce them every day at home.",
    },
    {
        category: "Entrepreneurship",
        title: "Building a Software Company With Multiple Products",
        excerpt:
            "Why building a portfolio of focused apps under one brand can be a stronger long-term strategy than going all-in on a single product.",
    },
    {
        category: "Product Updates",
        title: "How Newsletters Help App Businesses Grow",
        excerpt:
            "Email lists remain one of the highest-ROI channels for software companies. Here's how Cin Nova is using the newsletter to build its audience.",
    },
];

const monetization = [
    {
        icon: "📱",
        title: "App Promotion",
        description:
            "Each article creates organic discovery for Cin Nova's five products — linking readers to the right tool at the moment they need it most.",
    },
    {
        icon: "📧",
        title: "Newsletter Growth",
        description:
            "Blog readers convert to newsletter subscribers, building a direct line for product launch announcements and long-term audience retention.",
    },
    {
        icon: "🔗",
        title: "Affiliate Content",
        description:
            "Articles about education, tech support, real estate, and parenting naturally align with high-paying affiliate programs in each niche.",
    },
    {
        icon: "💰",
        title: "Display Ads",
        description:
            "High-traffic evergreen articles on AI, education, and real estate generate passive ad revenue through AdSense or direct sponsorships.",
    },
    {
        icon: "🚀",
        title: "Product Launches",
        description:
            "A built-up blog audience gives Cin Nova a warm channel to announce new products and drive early sign-ups from existing readers.",
    },
    {
        icon: "🔍",
        title: "SEO Traffic",
        description:
            "Consistent publishing on targeted keywords drives compounding organic search traffic to both articles and product pages over time.",
    },
];

function Blog() {
    return (
        <div className="product-page">

            {/* ── Hero ───────────────────────────────────────────── */}
            <section className="section" style={{ paddingBottom: "48px" }}>
                <div className="section-heading" style={{ marginBottom: 0 }}>
                    <p className="eyebrow">CIN NOVA BLOG</p>
                    <h2>Cin Nova Blog</h2>
                    <p style={{ maxWidth: "640px", margin: "0 auto", fontSize: "1.1rem", lineHeight: "1.9" }}>
                        Articles about AI, education, technology, safety, parenting, real estate,
                        and building useful software.
                    </p>
                </div>
            </section>

            {/* ── Featured Article ────────────────────────────────── */}
            <section className="section" style={{ paddingTop: 0 }} id="featured">
                <div className="section-heading" style={{ marginBottom: "28px" }}>
                    <p className="eyebrow">FEATURED ARTICLE</p>
                </div>

                <div className="blog-featured">
                    <div>
                        <p className="eyebrow" style={{ marginBottom: "18px" }}>
                            {featured.category.toUpperCase()}
                        </p>
                        <h2
                            style={{
                                fontSize: "clamp(1.6rem, 2.8vw, 2.5rem)",
                                lineHeight: "1.2",
                                marginBottom: "20px",
                                color: "#ffffff",
                            }}
                        >
                            {featured.title}
                        </h2>
                        <p
                            style={{
                                color: "#94a3b8",
                                lineHeight: "1.85",
                                marginBottom: "30px",
                                fontSize: "1.05rem",
                            }}
                        >
                            {featured.excerpt}
                        </p>
                        <button
                            style={{
                                display: "inline-block",
                                padding: "14px 28px",
                                borderRadius: "14px",
                                border: "none",
                                background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                                color: "#fff",
                                fontWeight: 900,
                                fontSize: "0.95rem",
                                cursor: "pointer",
                            }}
                        >
                            Read Featured Article →
                        </button>
                    </div>

                    <div className="showcase-card" style={{ margin: 0 }}>
                        <p className="eyebrow" style={{ marginBottom: "18px" }}>ARTICLE DETAILS</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                            {[
                                ["CATEGORY",  featured.category, "#38bdf8"],
                                ["READ TIME", featured.readTime, "#ffffff"],
                                ["PUBLISHED", featured.date,     "#ffffff"],
                            ].map(([label, value, color]) => (
                                <div
                                    key={label}
                                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                                >
                                    <span style={{ color: "#64748b", fontSize: "0.82rem", fontWeight: 700 }}>
                                        {label}
                                    </span>
                                    <span style={{ color, fontSize: "0.88rem", fontWeight: label === "CATEGORY" ? 700 : 400 }}>
                                        {value}
                                    </span>
                                </div>
                            ))}

                            <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.07)", margin: "2px 0" }} />

                            <div>
                                <span
                                    style={{
                                        color: "#64748b",
                                        fontSize: "0.82rem",
                                        fontWeight: 700,
                                        display: "block",
                                        marginBottom: "10px",
                                    }}
                                >
                                    TAGS
                                </span>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                    {featured.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            style={{
                                                padding: "4px 10px",
                                                borderRadius: "999px",
                                                background: "rgba(56,189,248,0.10)",
                                                border: "1px solid rgba(56,189,248,0.18)",
                                                color: "#38bdf8",
                                                fontSize: "0.74rem",
                                                fontWeight: 700,
                                            }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Categories ──────────────────────────────────────── */}
            <section className="section" style={{ paddingTop: 0, paddingBottom: "60px" }} id="categories">
                <div className="section-heading">
                    <p className="eyebrow">BROWSE BY CATEGORY</p>
                    <h2>Find articles by topic.</h2>
                    <p>
                        Every article on the Cin Nova blog sits within one of these seven
                        content verticals — each aligned to a real product or audience.
                    </p>
                </div>

                <div className="blog-categories">
                    {categories.map((cat) => (
                        <button className="blog-category-pill" key={cat.name}>
                            <span>{cat.icon}</span>
                            {cat.name}
                        </button>
                    ))}
                </div>
            </section>

            {/* ── Latest Articles ─────────────────────────────────── */}
            <section className="section showcase-section" id="articles">
                <div className="section-heading">
                    <p className="eyebrow">LATEST ARTICLES</p>
                    <h2>Fresh from the Cin Nova blog.</h2>
                    <p>
                        Guides, insights, and practical advice covering every vertical
                        in the Cin Nova product ecosystem.
                    </p>
                </div>

                <div className="article-grid">
                    {articles.map((article) => (
                        <article className="article-card" key={article.title}>
                            <span>{article.category}</span>
                            <h3>{article.title}</h3>
                            <p>{article.excerpt}</p>
                            <button>Read More →</button>
                        </article>
                    ))}
                </div>
            </section>

            {/* ── Monetization Strategy ───────────────────────────── */}
            <section className="section" id="strategy">
                <div className="section-heading">
                    <p className="eyebrow">BLOG STRATEGY</p>
                    <h2>How the Cin Nova blog supports business growth.</h2>
                    <p>
                        Content isn't just marketing — it's infrastructure. The Cin Nova
                        blog is built to compound across six distinct growth and revenue channels.
                    </p>
                </div>

                <div className="product-grid">
                    {monetization.map((item) => (
                        <article className="product-card" key={item.title}>
                            <div className="product-icon">{item.icon}</div>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            {/* ── Newsletter CTA ──────────────────────────────────── */}
            <section className="section" id="newsletter">
                <div className="newsletter-card">
                    <p className="eyebrow">STAY IN THE LOOP</p>
                    <h2>Get new articles and product updates in your inbox.</h2>
                    <p
                        style={{
                            color: "#94a3b8",
                            maxWidth: "500px",
                            margin: "0 auto 8px",
                            lineHeight: "1.8",
                        }}
                    >
                        Subscribe to the Cin Nova newsletter and be the first to know about
                        new blog posts, product launches, and early access openings.
                    </p>
                    <div className="signup-form">
                        <input type="email" placeholder="Enter your email address" />
                        <button>Subscribe</button>
                    </div>
                </div>
            </section>

        </div>
    );
}

export default Blog;
