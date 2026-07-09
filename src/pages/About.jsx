// About — CinNova About page (route: /?page=about)
// Visual redesign; renders inside the existing app layout (navbar/footer live
// outside). SEO is preserved via the shared SEO.jsx system; the final CTA
// newsletter form is wired to the real saveSubscriber service.
import React from "react";
import "./about.css";
import SEO from "../components/SEO.jsx";
import { siteUrl } from "../data/blogPosts.js";
import { saveSubscriber } from "../data/newsletterService.js";

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "About Cin Nova",
  description:
    "Learn about Cin Nova — the company building practical AI software products for education, safety, real estate, tech support, and early childhood learning.",
  url: `${siteUrl}/?page=about`,
  publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
};

const PRODUCTS = [
  {
    name: "StudyNest",
    cat: "Education AI",
    chip: "Education AI",
    desc: "AI-powered studying with notes, flashcards, quizzes, and a 24/7 AI tutor.",
    href: "/?page=studynest",
    initials: "SN",
    grad: "linear-gradient(135deg, #d9efe4, #bfe3d2)",
    markColor: "#0b5d43",
  },
  {
    name: "PoisonGuard",
    cat: "Safety Technology",
    chip: "Safety Tools",
    desc: "Poison and chemical safety lookup with emergency guidance for families and pets.",
    href: "/?page=poisonguard",
    initials: "PG",
    grad: "linear-gradient(135deg, #fdeee3, #f8dcc8)",
    markColor: "#b45a1b",
  },
  {
    name: "TechMate AI",
    cat: "Tech Support AI",
    chip: "Support AI",
    desc: "AI troubleshooting for devices, software, networks, and error codes.",
    href: "/?page=techmate",
    initials: "TM",
    grad: "linear-gradient(135deg, #e4edfb, #cfdef5)",
    markColor: "#1d4f9c",
  },
  {
    name: "Kiddo",
    cat: "Early Learning",
    chip: "Early Learning",
    desc: "Reading, writing, counting, and math for ages 3–8 with a parent dashboard.",
    href: "/?page=kiddo",
    initials: "K",
    grad: "linear-gradient(135deg, #fbeff3, #f3d9e4)",
    markColor: "#a83a68",
  },
  {
    name: "CinNova Real Estate",
    cat: "Real Estate AI",
    chip: "Investor Tools",
    desc: "Deal analysis, cash flow modeling, and AI investment guidance for every investor.",
    href: "/?page=real-estate",
    initials: "RE",
    grad: "linear-gradient(135deg, #e8f1ee, #d2e4dc)",
    markColor: "#0a4a36",
  },
];

const STATS = [
  { value: "5", label: "Products in the ecosystem", icon: "M3 3h5v5H3zM10 3h5v5h-5zM3 10h5v5H3zM10 10h5v5h-5z" },
  { value: "7", label: "Content categories", icon: "M3 5h12M3 9h12M3 13h8" },
  { value: "12", label: "Published resources", icon: "M5 2h6l3 3v11H5zM11 2v3h3" },
  { value: "Weekly", label: "AI tutorials published", icon: "M9 2a7 7 0 110 14A7 7 0 019 2zm-1 4v4l3 2" },
  { value: "Live", label: "Real estate tools", icon: "M3 9l6-5 6 5M5 8v7h8V8" },
  { value: "Growing", label: "Newsletter audience", icon: "M2 12l4-4 3 3 5-6M14 5h1v1" },
];

const VALUES = [
  { title: "Practical AI", desc: "AI built to solve real problems — every feature earns its place by being genuinely useful." },
  { title: "Education Access", desc: "High-quality learning tools shouldn't be locked behind expensive tutors or institutions." },
  { title: "Safety First", desc: "Software that touches families, children, and emergencies is held to a higher standard." },
  { title: "Family-Friendly Technology", desc: "Products parents trust and children enjoy. No ads, no dark patterns, no surveillance." },
  { title: "Real Estate Intelligence", desc: "Investment decisions should be driven by data, not guesswork." },
  { title: "Long-Term Innovation", desc: "A sustainable company takes time — shipping products, growing an audience, earning trust." },
];

const PHASES = [
  { title: "Build Product Pages & Brand Website", desc: "Establish the CinNova brand, product pages, and a professional web presence.", status: "In progress", active: true },
  { title: "Launch Core Apps", desc: "Ship StudyNest, PoisonGuard, TechMate AI, Kiddo, and Real Estate tools.", status: "Up next" },
  { title: "Grow Blog & Newsletter", desc: "Publish weekly AI tutorials and grow a subscriber base around the products.", status: "Planned" },
  { title: "Add Subscriptions & Premium Tools", desc: "Introduce paid tiers and premium features across the ecosystem.", status: "Planned" },
  { title: "Expand to Business, School & Enterprise", desc: "Bring CinNova products to teams, classrooms, and organizations.", status: "Planned" },
];

const VALUE_ICONS = [
  // simple 18px stroke icons, index-matched to VALUES
  "M9 2l2 4.5L15.5 8 11 9.5 9 14 7 9.5 2.5 8 7 6.5z", // spark — Practical AI
  "M2 7l7-4 7 4-7 4-7-4zm3 3v3.5c0 1 1.8 2 4 2s4-1 4-2V10", // grad cap — Education
  "M9 2l6 2.5V8c0 4-2.6 6.6-6 8-3.4-1.4-6-4-6-8V4.5L9 2z", // shield — Safety
  "M9 15s-6-3.6-6-8a3.4 3.4 0 016-2.2A3.4 3.4 0 0115 7c0 4.4-6 8-6 8z", // heart — Family
  "M2 15h14M4 15V8h3v7m2 0V4h3v11", // buildings — Real estate
  "M9 2v3m0 8v3m7-7h-3M5 9H2m11.5-4.5l-2 2m-5 5l-2 2m9 0l-2-2m-5-5l-2-2", // compass/long-term
];

function StatIcon({ d }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Orbit chip positions (percent of the orbit square, clockwise from top)
const ORBIT_POS = [
  { left: "50%", top: "8%" },
  { left: "90%", top: "37%" },
  { left: "74.7%", top: "84%" },
  { left: "25.3%", top: "84%" },
  { left: "10%", top: "37%" },
];

function ValueIcon({ d }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function About() {
  const [email, setEmail] = React.useState("");
  // status: "idle" | "success" | "error"
  const [status, setStatus] = React.useState("idle");

  function handleSubscribe(e) {
    e.preventDefault();
    const value = email.trim();
    if (!value.includes("@")) {
      setStatus("error");
      return;
    }
    try {
      saveSubscriber({ email: value, source: "About Page", tags: ["About"] });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="about-page">
      <SEO
        title="About Cin Nova | Practical AI Software Company"
        description="Cin Nova builds AI-powered products for learning, safety, real estate, tech support, and early childhood education. Learn about our products, values, and roadmap."
        url={`${siteUrl}/?page=about`}
        type="website"
        schema={aboutSchema}
      />

      {/* 1. Hero */}
      <header className="about-page-hero">
        <div className="about-page-container about-page-hero-inner">
          <div>
            <h1 className="about-page-h1">Building practical software for real-world problems.</h1>
            <p className="about-page-hero-sub">
              CinNova creates AI tools, education platforms, safety products, technology
              assistants, and real estate intelligence — built for people who need software
              that actually works.
            </p>
            <ul className="about-page-pills" style={{ listStyle: "none", padding: 0 }}>
              <li className="about-page-pill">5 products</li>
              <li className="about-page-pill">Education &amp; safety</li>
              <li className="about-page-pill">AI software</li>
              <li className="about-page-pill">Long-term build</li>
            </ul>
            <div className="about-page-hero-actions">
              <a className="about-page-btn about-page-btn--primary" href="/?page=products">Explore Products</a>
              <a className="about-page-btn about-page-btn--ghost" href="/?page=partner-with-us">Partner With Us</a>
            </div>
          </div>
          <div className="about-page-hero-visual" aria-hidden="true">
            <div className="about-page-orbit">
              <span className="about-page-orbit-glow"></span>
              <span className="about-page-orbit-glow about-page-orbit-glow--blue"></span>
              <svg className="about-page-orbit-lines" viewBox="0 0 400 400" fill="none">
                <circle cx="200" cy="200" r="168" stroke="#c8e0d5" strokeWidth="1.5" strokeDasharray="3 6" />
                <circle cx="200" cy="200" r="116" stroke="#d6e6ef" strokeWidth="1" strokeDasharray="2 7" />
                <path d="M200 200L200 32M200 200L359.8 148M200 200L298.8 335.9M200 200L101.2 335.9M200 200L40.2 148" stroke="url(#about-orbit-line)" strokeWidth="1" />
                <defs>
                  <linearGradient id="about-orbit-line" x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9ecdb9" />
                    <stop offset="1" stopColor="#a9c4e2" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="about-page-orbit-hub">
                <span className="about-page-orbit-hub-mark">CN</span>
                <small>One platform</small>
              </div>
              {PRODUCTS.map((p, i) => (
                <div key={p.name} className="about-page-orbit-chip" style={ORBIT_POS[i]}>
                  <span className="about-page-hero-dot" style={{ background: p.markColor }}>{p.initials}</span>
                  <span className="about-page-orbit-chip-name">{p.name}</span>
                </div>
              ))}
            </div>
            <div className="about-page-orbit-list">
              <div className="about-page-orbit-list-core">
                <span className="about-page-orbit-list-mark">CN</span>
                <span>CinNova Core</span>
              </div>
              {PRODUCTS.map((p) => (
                <div key={p.name} className="about-page-orbit-list-item">
                  <span className="about-page-hero-dot" style={{ background: p.markColor }}>{p.initials}</span>
                  <span>{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* 2. Company Snapshot */}
      <section className="about-page-section" aria-labelledby="about-snapshot">
        <div className="about-page-container about-page-center">
          <p className="about-page-eyebrow">Company Snapshot</p>
          <h2 className="about-page-h2" id="about-snapshot">CinNova today</h2>
          <p className="about-page-lead">A growing product and content ecosystem, built in public.</p>
          <div className="about-page-stats">
            {STATS.map((s) => (
              <div key={s.label} className="about-page-stat">
                <span className="about-page-stat-icon"><StatIcon d={s.icon} /></span>
                <div>
                  <p className="about-page-stat-value">{s.value}</p>
                  <p className="about-page-stat-label">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Mission */}
      <section className="about-page-section about-page-section--tint" aria-labelledby="about-mission">
        <div className="about-page-container about-page-center">
          <p className="about-page-eyebrow">Our Mission</p>
          <h2 className="about-page-h2" id="about-mission">Help people learn, stay safe, solve problems, and invest smarter.</h2>
          <div className="about-page-mission-grid">
            <div className="about-page-panel">
              <h3>What We Build</h3>
              <p>
                CinNova builds software that addresses real gaps in how people access learning,
                safety information, technical help, and investment tools. Every product starts
                with a clear problem and works backward to the simplest, most useful solution.
              </p>
              <p>
                We focus on five areas — education, family safety, technology support, early
                childhood learning, and real estate intelligence — where the right tool can
                genuinely change outcomes.
              </p>
            </div>
            <div className="about-page-panel">
              <h3>Who We Build For</h3>
              <ul className="about-page-audience">
                <li><strong>Students</strong><span>— smarter study tools, not just flashcard apps</span></li>
                <li><strong>Families</strong><span>— safe, age-appropriate tech for every member</span></li>
                <li><strong>Technicians</strong><span>— fast, accurate answers, not scripted call centers</span></li>
                <li><strong>Children</strong><span>— joyful, screen-time-worthy learning</span></li>
                <li><strong>Investors</strong><span>— data-driven decisions, not gut-feel guesses</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Ecosystem */}
      <section className="about-page-section" aria-labelledby="about-ecosystem">
        <div className="about-page-container about-page-center">
          <p className="about-page-eyebrow">The Ecosystem</p>
          <h2 className="about-page-h2" id="about-ecosystem">Five products. One brand. A connected platform.</h2>
          <div className="about-page-bento">
            <div className="about-page-bento-core">
              <span className="about-page-product-node about-page-product-node--core"></span>
              <span className="about-page-bento-core-mark">CN</span>
              <h3>CinNova Core</h3>
              <p>
                Every CinNova product shares infrastructure, design language, and a single
                account login — one platform underneath five products.
              </p>
              <ul className="about-page-bento-core-list">
                {PRODUCTS.map((p) => (
                  <li key={p.name}><span className="about-page-bento-core-dot" style={{ "--dot-color": p.markColor }}></span>{p.name}</li>
                ))}
              </ul>
            </div>
            {PRODUCTS.map((p) => (
              <article key={p.name} className="about-page-product" style={{ "--p-accent": p.markColor }}>
                <span className="about-page-product-node"></span>
                <div className="about-page-product-media" style={{ background: p.grad }}>
                  <span className="about-page-product-mark" style={{ color: p.markColor }}>{p.initials}</span>
                  <span className="about-page-product-status">{p.chip}</span>
                </div>
                <div className="about-page-product-body">
                  <h3 className="about-page-product-name">{p.name}</h3>
                  <p className="about-page-product-desc">{p.desc}</p>
                  <a className="about-page-product-link" href={p.href}>Explore product →</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Founder Vision */}
      <section className="about-page-section about-page-section--tint" aria-labelledby="about-founder">
        <div className="about-page-container">
          <div className="about-page-founder">
            <span className="about-page-founder-badge"><span className="about-page-founder-badge-dot"></span>Building in public</span>
            <h2 className="about-page-h2" id="about-founder">Built for the long term.</h2>
            <blockquote>
              “CinNova is being built as a <em>real software company</em> — not a side project.”
            </blockquote>
            <p className="about-page-founder-body">
              That means shipping products people actually use, publishing consistently, and
              growing step by step — no shortcuts, no vaporware, no inflated numbers.
            </p>
            <div className="about-page-founder-sig">
              <span className="about-page-founder-avatar">CN</span>
              <span className="about-page-founder-sig-text"><strong>The CinNova Founder</strong><span>Founder, CinNova</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Values */}
      <section className="about-page-section" aria-labelledby="about-values">
        <div className="about-page-container about-page-center">
          <p className="about-page-eyebrow">Our Values</p>
          <h2 className="about-page-h2" id="about-values">The principles behind every product decision.</h2>
          <div className="about-page-values">
            {VALUES.map((v, i) => (
              <div key={v.title} className="about-page-value">
                <span className="about-page-value-icon"><ValueIcon d={VALUE_ICONS[i]} /></span>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Roadmap */}
      <section className="about-page-section about-page-section--tint" aria-labelledby="about-roadmap">
        <div className="about-page-container about-page-center">
          <p className="about-page-eyebrow">Roadmap</p>
          <h2 className="about-page-h2" id="about-roadmap">Five phases. One direction.</h2>
          <ol className="about-page-roadmap">
            {PHASES.map((ph, i) => (
              <li key={ph.title} className={"about-page-phase" + (ph.active ? " about-page-phase--active" : "")}>
                <span className="about-page-phase-num">{i + 1}</span>
                <div className="about-page-phase-body">
                  <p className="about-page-phase-title">
                    {ph.title}
                    <span className={"about-page-phase-badge" + (ph.active ? " about-page-phase-badge--active" : "")}>{ph.status}</span>
                  </p>
                  <p className="about-page-phase-desc">{ph.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="about-page-section" aria-labelledby="about-cta">
        <div className="about-page-container">
          <div className="about-page-cta">
            <h2 className="about-page-h2" id="about-cta">Join the CinNova community and follow the build.</h2>
            <p className="about-page-cta-sub">
              Product updates, early access announcements, and behind-the-scenes content — in your inbox.
            </p>
            {status === "success" ? (
              <p className="about-page-cta-success" role="status">You're in — welcome to the build. ✓</p>
            ) : (
              <form className="about-page-cta-form" onSubmit={handleSubscribe} noValidate>
                <input
                  className="about-page-cta-input"
                  type="email"
                  required
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  aria-label="Email address"
                  aria-invalid={status === "error"}
                />
                <button className="about-page-btn about-page-btn--primary" type="submit">Subscribe</button>
              </form>
            )}
            {status === "error" && (
              <p className="about-page-cta-error" role="alert">Please enter a valid email address.</p>
            )}
            <div className="about-page-cta-links">
              <a className="about-page-btn" href="/?page=products">View Products</a>
              <a className="about-page-btn" href="/blog">Read the Blog</a>
              <a className="about-page-btn" href="/?page=contact">Contact</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;
