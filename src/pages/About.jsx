import "../App.css";

const products = [
    {
        icon: "🎓",
        name: "StudyNest",
        category: "Education AI",
        description:
            "AI-powered studying with notes, flashcards, quizzes, study guides, and an AI tutor available 24/7.",
    },
    {
        icon: "🛡️",
        name: "PoisonGuard",
        category: "Safety Technology",
        description:
            "Poison and chemical safety tools for families and pets — fast substance lookup and emergency guidance.",
    },
    {
        icon: "💻",
        name: "TechMate AI",
        category: "Tech Support AI",
        description:
            "AI troubleshooting for devices, software, networks, and error codes — no hold music required.",
    },
    {
        icon: "🧸",
        name: "Kiddo",
        category: "Early Learning",
        description:
            "Interactive reading, writing, counting, and math for children ages 3–8 with a full parent dashboard.",
    },
    {
        icon: "🏡",
        name: "Cin Nova Real Estate",
        category: "Real Estate AI",
        description:
            "Deal analysis, cash flow modeling, mortgage calculators, and AI investment guidance for every level of investor.",
    },
];

const values = [
    {
        icon: "🤖",
        name: "Practical AI",
        description:
            "AI built to solve real problems — not just impressive demos. Every feature earns its place by being genuinely useful.",
    },
    {
        icon: "📚",
        name: "Education Access",
        description:
            "High-quality learning tools should not be locked behind expensive tutors or institutions. StudyNest and Kiddo are built to change that.",
    },
    {
        icon: "🔒",
        name: "Safety First",
        description:
            "Software that touches families, children, and emergencies holds a higher standard. PoisonGuard is built with that responsibility in mind.",
    },
    {
        icon: "👨‍👩‍👧",
        name: "Family-Friendly Technology",
        description:
            "Products that parents trust and children enjoy. No ads, no dark patterns, no surveillance — just tools that help families.",
    },
    {
        icon: "🏠",
        name: "Real Estate Intelligence",
        description:
            "Property investment decisions should be driven by data, not guesswork. Cin Nova RE puts institutional-grade tools in every investor's hands.",
    },
    {
        icon: "🌱",
        name: "Long-Term Innovation",
        description:
            "Building a sustainable company takes time. Cin Nova is focused on doing the work — shipping products, growing an audience, and earning trust.",
    },
];

const roadmap = [
    {
        phase: "01",
        title: "Build Product Pages &amp; Brand Website",
        status: "In Progress",
        statusColor: "#38bdf8",
        description:
            "Establish the Cin Nova brand identity, product pages, and a professional web presence that represents the full product ecosystem.",
    },
    {
        phase: "02",
        title: "Launch Core Apps",
        status: "Coming Soon",
        statusColor: "#7c3aed",
        description:
            "Ship the first versions of StudyNest, PoisonGuard, TechMate AI, Kiddo, and Cin Nova Real Estate as functional web applications.",
    },
    {
        phase: "03",
        title: "Grow Blog &amp; Newsletter",
        status: "Planned",
        statusColor: "#64748b",
        description:
            "Publish consistent content across all five product verticals — education, safety, tech, family, and real estate — to build organic traffic and an email list.",
    },
    {
        phase: "04",
        title: "Add Subscriptions &amp; Premium Tools",
        status: "Planned",
        statusColor: "#64748b",
        description:
            "Launch paid tiers across all products. Introduce advanced AI features, deeper analytics, and premium tools that justify recurring revenue.",
    },
    {
        phase: "05",
        title: "Expand to Business, School &amp; Enterprise",
        status: "Future",
        statusColor: "#334155",
        description:
            "Scale beyond individual users into classrooms, IT teams, real estate brokerages, and enterprise organizations with team plans and custom integrations.",
    },
];

function About() {
    return (
        <div className="product-page">

            {/* ── Hero ───────────────────────────────────────────── */}
            <section className="section" style={{ paddingBottom: "48px" }}>
                <div className="section-heading" style={{ marginBottom: 0 }}>
                    <p className="eyebrow">ABOUT CIN NOVA</p>
                    <h2>Building practical software for real-world problems.</h2>
                    <p style={{ maxWidth: "700px", margin: "0 auto", fontSize: "1.1rem", lineHeight: "1.9" }}>
                        Cin Nova is a software and media company creating AI tools, education
                        platforms, safety products, technology assistants, and real estate
                        intelligence — built for people who need tools that actually work.
                    </p>
                </div>
            </section>

            {/* ── Stats bar ──────────────────────────────────────── */}
            <section className="section" style={{ paddingTop: 0, paddingBottom: "60px" }}>
                <div className="hero-stats" style={{ maxWidth: "760px", margin: "0 auto" }}>
                    <div><strong>5</strong><span>Products</span></div>
                    <div><strong>4</strong><span>Industries</span></div>
                    <div><strong>1</strong><span>Company</span></div>
                </div>
            </section>

            {/* ── Mission ────────────────────────────────────────── */}
            <section className="section showcase-section" id="mission">
                <div className="section-heading">
                    <p className="eyebrow">OUR MISSION</p>
                    <h2>Help people learn, stay safe, solve problems, and invest smarter.</h2>
                </div>

                <div className="showcase-grid">
                    <div className="showcase-card">
                        <h3>What We Build</h3>
                        <div className="chat-ai" style={{ marginTop: "14px" }}>
                            Cin Nova builds software that addresses real gaps in how people
                            access learning, safety information, technical help, and investment
                            tools. Every product starts with a clear problem and works backward
                            to the simplest, most useful solution.
                            <br /><br />
                            We focus on five areas: education, family safety, technology support,
                            early childhood learning, and real estate intelligence — because
                            these are areas where the right tool can genuinely change outcomes
                            for individuals and families.
                        </div>
                    </div>

                    <div className="showcase-card">
                        <h3>Who We Build For</h3>
                        <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>
                            {[
                                ["🎓", "Students", "who need smarter study tools, not just flashcard apps"],
                                ["👨‍👩‍👧", "Families", "who want safe, age-appropriate tech for every member"],
                                ["🔧", "Technicians", "who need fast, accurate answers — not scripted call centers"],
                                ["🧒", "Children", "who deserve joyful, screen-time-worthy learning experiences"],
                                ["💼", "Investors", "who want data-driven decisions, not gut-feel guesses"],
                            ].map(([icon, who, desc]) => (
                                <div key={who} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                    <span style={{ fontSize: "1.2rem", marginTop: "2px" }}>{icon}</span>
                                    <p style={{ color: "#cbd5e1", lineHeight: "1.6", margin: 0 }}>
                                        <strong style={{ color: "#ffffff" }}>{who}</strong> — {desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Product Ecosystem ──────────────────────────────── */}
            <section className="section" id="products">
                <div className="section-heading">
                    <p className="eyebrow">THE ECOSYSTEM</p>
                    <h2>Five products. One brand. A connected platform.</h2>
                    <p>
                        Every Cin Nova product lives under the same umbrella — sharing
                        infrastructure, design language, and a single account login.
                    </p>
                </div>

                <div className="product-grid">
                    {products.map((p) => (
                        <article className="product-card" key={p.name}>
                            <div className="product-icon">{p.icon}</div>
                            <p className="product-category">{p.category}</p>
                            <h3>{p.name}</h3>
                            <p>{p.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            {/* ── Founder Vision ─────────────────────────────────── */}
            <section className="section showcase-section" id="vision">
                <div className="section-heading">
                    <p className="eyebrow">FOUNDER VISION</p>
                    <h2>Built for the long term.</h2>
                </div>

                <div
                    className="newsletter-card"
                    style={{ textAlign: "left", maxWidth: "860px" }}
                >
                    <p className="eyebrow">FROM THE FOUNDER</p>
                    <h2 style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)", marginBottom: "24px" }}>
                        "Cin Nova is being built as a real software company — not a side project."
                    </h2>

                    <p style={{ color: "#cbd5e1", lineHeight: "1.9", marginBottom: "18px" }}>
                        The goal is straightforward: identify categories where people genuinely
                        need better tools, build clean and useful software, and grow an audience
                        through honest content and product quality. That is how sustainable
                        technology businesses are built.
                    </p>
                    <p style={{ color: "#cbd5e1", lineHeight: "1.9", marginBottom: "18px" }}>
                        Each product under the Cin Nova brand is designed to stand on its own —
                        to be useful to someone on day one, not just after a long onboarding
                        process. The five initial products cover education, safety, tech support,
                        early childhood learning, and real estate because these are underserved
                        markets where AI can make a meaningful difference today.
                    </p>
                    <p style={{ color: "#cbd5e1", lineHeight: "1.9" }}>
                        The roadmap is clear: ship great products, create content that helps
                        people, build an email list, launch subscriptions, and keep improving.
                        No shortcuts. No pivots. Just the work.
                    </p>

                    <div
                        style={{
                            marginTop: "28px",
                            paddingTop: "24px",
                            borderTop: "1px solid rgba(255,255,255,0.08)",
                            display: "flex",
                            alignItems: "center",
                            gap: "14px",
                        }}
                    >
                        <div
                            style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "14px",
                                background: "linear-gradient(135deg, #38bdf8, #7c3aed)",
                                display: "grid",
                                placeItems: "center",
                                fontWeight: 900,
                                fontSize: "1.1rem",
                                color: "#fff",
                                flexShrink: 0,
                            }}
                        >
                            CN
                        </div>
                        <div>
                            <strong style={{ display: "block", color: "#ffffff" }}>Cin Nova</strong>
                            <span style={{ color: "#64748b", fontSize: "0.88rem" }}>Founder &amp; Builder</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Values ─────────────────────────────────────────── */}
            <section className="section" id="values">
                <div className="section-heading">
                    <p className="eyebrow">OUR VALUES</p>
                    <h2>The principles behind every product decision.</h2>
                    <p>
                        These aren't mission-statement buzzwords. They're the actual filters
                        used when deciding what to build, what to ship, and what to cut.
                    </p>
                </div>

                <div className="product-grid">
                    {values.map((v) => (
                        <article className="product-card" key={v.name}>
                            <div className="product-icon">{v.icon}</div>
                            <h3>{v.name}</h3>
                            <p>{v.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            {/* ── Roadmap ────────────────────────────────────────── */}
            <section className="section showcase-section" id="roadmap">
                <div className="section-heading">
                    <p className="eyebrow">ROADMAP</p>
                    <h2>Five phases. One direction.</h2>
                    <p>
                        Building a sustainable software company is a long game.
                        Here's how Cin Nova is approaching it — one phase at a time.
                    </p>
                </div>

                <div className="product-grid">
                    {roadmap.map((step) => (
                        <article className="product-card" key={step.phase}>
                            <div
                                className="product-icon"
                                style={{
                                    background: "rgba(56,189,248,0.10)",
                                    fontSize: "1rem",
                                    fontWeight: 900,
                                    color: "#38bdf8",
                                    letterSpacing: "1px",
                                }}
                            >
                                {step.phase}
                            </div>

                            <div
                                style={{
                                    display: "inline-block",
                                    padding: "3px 10px",
                                    borderRadius: "999px",
                                    border: `1px solid ${step.statusColor}40`,
                                    background: `${step.statusColor}14`,
                                    color: step.statusColor,
                                    fontSize: "0.73rem",
                                    fontWeight: 900,
                                    letterSpacing: "1px",
                                    marginBottom: "12px",
                                }}
                            >
                                {step.status}
                            </div>

                            <h3
                                dangerouslySetInnerHTML={{ __html: step.title }}
                                style={{ marginBottom: "10px" }}
                            />
                            <p>{step.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            {/* ── CTA ─────────────────────────────────────────────── */}
            <section className="section" id="community">
                <div className="newsletter-card">
                    <p className="eyebrow">JOIN THE COMMUNITY</p>
                    <h2>Join the Cin Nova community and follow the build.</h2>
                    <p style={{ color: "#94a3b8", maxWidth: "520px", margin: "0 auto 8px", lineHeight: "1.8" }}>
                        Get product updates, early access announcements, and behind-the-scenes
                        content delivered to your inbox.
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

export default About;
