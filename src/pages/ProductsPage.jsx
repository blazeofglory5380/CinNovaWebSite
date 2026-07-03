import SEO from "../components/SEO.jsx";
import NewsletterSignup from "../components/NewsletterSignup.jsx";
import MarketingPhoto from "../components/MarketingPhoto.jsx";
import GlassCard from "../components/brand-dna/GlassCard.jsx";
import GlassPanel from "../components/brand-dna/GlassPanel.jsx";
import SectionHead from "../components/brand-dna/SectionHead.jsx";
import Dispatch from "../components/brand-dna/Dispatch.jsx";
import { featureCapabilityPhotos, productMarketing } from "../data/marketingImages.js";
import { normalizeProductStatus, productDetails, products } from "../data/products.js";
import { siteUrl, defaultOgImage } from "../data/seoConfig.js";
import "../styles/brand-dna.css";
import "./ProductsPage.css";

/* Per-product accent (Brand DNA identity — decision #4). */
const ACCENT = {
    studynest: "#0ea5e9",
    poisonguard: "#10b981",
    kiddo: "#f59e0b",
    techmate: "#8b5cf6",
    "real-estate": "#2563eb",
};

const ecosystemShowcases = [
    {
        name: "StudyNest",
        page: "studynest",
        badge: "SN",
        category: "Education AI",
        summary:
            "A focused learning workspace for notes, review cycles, AI tutoring, and study planning.",
        features: ["Dashboard mockup", "Smart Notes", "Flashcards", "AI Tutor", "Study Planner"],
    },
    {
        name: "PoisonGuard",
        page: "poisonguard",
        badge: "PG",
        category: "Safety Technology",
        summary:
            "A safety command center for scanning hazards, detecting risk, and finding urgent guidance.",
        features: ["Hazard Scanner", "Risk Detection", "Emergency Guidance", "Pet Safety", "Scan History"],
    },
    {
        name: "TechMate AI",
        page: "techmate",
        badge: "TM",
        category: "Tech Support AI",
        summary:
            "An everyday repair assistant for diagnostics, error lookup, network help, and guided fixes.",
        features: ["AI Chat Assistant", "Device Diagnostics", "Error Lookup", "Network Troubleshooting", "Repair Guides"],
    },
    {
        name: "Kiddo",
        page: "kiddo",
        badge: "KD",
        category: "Early Learning",
        summary:
            "A playful parent-supported learning hub for reading, counting, rewards, and progress.",
        features: ["ABC Learning", "Reading Games", "Counting Activities", "Parent Dashboard", "Rewards System"],
    },
    {
        name: "Cin Nova Real Estate",
        page: "real-estate",
        badge: "RE",
        category: "Real Estate AI",
        summary:
            "A property intelligence suite for search, financing, investor analysis, and market research.",
        features: ["Property Search", "Deal Analyzer", "Mortgage Calculator", "Market Intelligence", "Commercial Analysis"],
    },
];

const timeline = [
    { year: "2026", title: "Brand Website + Product Foundation", items: ["Cin Nova Website", "Product pages", "Newsletter", "Blog foundation"] },
    { year: "2027", title: "First Product Launches", items: ["StudyNest launch", "PoisonGuard launch", "TechMate AI beta", "Early users"] },
    { year: "2028", title: "Mobile Apps + Subscriptions", items: ["iPhone apps", "iPad apps", "Premium plans", "User dashboards"] },
    { year: "2029", title: "Business + Organization Tools", items: ["School tools", "Business accounts", "Real estate pro tools", "Team dashboards"] },
    { year: "2030+", title: "Public Safety + Global Expansion", items: ["Government edition", "Multilingual support", "Canada expansion", "Agency dashboards"] },
];

const diagramNodes = [
    { name: "StudyNest", abbr: "SN", color: "#0ea5e9", angle: -90 },
    { name: "PoisonGuard", abbr: "PG", color: "#10b981", angle: -18 },
    { name: "Kiddo", abbr: "KD", color: "#f59e0b", angle: 54 },
    { name: "TechMate AI", abbr: "TM", color: "#8b5cf6", angle: 126 },
    { name: "Real Estate AI", abbr: "RE", color: "#2563eb", angle: 198 },
];

const platformPreviews = [
    {
        name: "StudyNest", badge: "SN", category: "Education AI", accentColor: "#0ea5e9", page: "studynest",
        desc: "Smart notes, spaced-repetition flashcards, AI tutoring, and a study planner — all in one connected workspace.",
        mockupLines: ["Notes → 32 flashcards generated", "AI Tutor: Biology session ready", "Planner: 3 tasks due tomorrow"],
    },
    {
        name: "PoisonGuard", badge: "PG", category: "Safety Technology", accentColor: "#10b981", page: "poisonguard",
        desc: "Scan household products, detect chemical risk levels, and get emergency guidance for pets and families instantly.",
        mockupLines: ["Hazard Scanner: Ready to scan", { text: "Risk Level: Low", success: true }, "Pet Safety: 2 items flagged"],
    },
    {
        name: "Kiddo", badge: "KD", category: "Early Learning", accentColor: "#f59e0b", page: "kiddo",
        desc: "Playful ABCs, counting games, reading activities, a parent dashboard, and a rewards system for young learners.",
        mockupLines: ["Today: Letter B + Counting", "12 Stars Earned Today", "Parent: Progress Report Ready"],
    },
    {
        name: "TechMate AI", badge: "TM", category: "Tech Support AI", accentColor: "#8b5cf6", page: "techmate",
        desc: "Diagnose devices, look up error codes, troubleshoot Wi-Fi, and follow guided repair steps — no technician needed.",
        mockupLines: [{ text: "Device Health: 98%", success: true }, "Wi-Fi Troubleshooter: Active", "Error Code Lookup: Resolved"],
    },
    {
        name: "Real Estate AI", badge: "RE", category: "Real Estate AI", accentColor: "#2563eb", page: "real-estate",
        desc: "Analyze investment deals, estimate mortgage payments, review cash flow, and score properties against your goals.",
        mockupLines: ["Deal Score: A- (Strong Buy)", "Cap Rate: 8.1% | Cash Flow: +$645", "Market Intelligence: Rising ↑"],
    },
];

function getButtonLabel(page) {
    if (page === "studynest") return "Explore StudyNest";
    if (page === "poisonguard") return "Explore PoisonGuard";
    if (page === "real-estate") return "Explore Real Estate AI";
    if (page === "techmate") return "Explore TechMate AI";
    if (page === "kiddo") return "Explore Kiddo";
    return "Coming Soon";
}

function platformMockupLineKey(line) {
    return typeof line === "string" ? line : line.text;
}

function CatalogCard({ product, onNavigate }) {
    const status = normalizeProductStatus(product.status);
    return (
        <GlassCard
            className="products-v2__catalog-card"
            style={{ "--bdna-accent": ACCENT[product.page] || "var(--bdna-emerald)" }}
            media={
                product.image ? (
                    <>
                        <img src={product.image} alt={product.imageAlt} loading="lazy" decoding="async" />
                        <span className="products-v2__brand">{product.name}</span>
                    </>
                ) : null
            }
            onClick={() => onNavigate(product.page)}
            aria-label={`${product.name} — learn more`}
        >
            <div className="products-v2__card-meta">
                <span className={`products-v2__status products-v2__status--${status.variant}`}>{status.label}</span>
                <span className="products-v2__cat">{product.category}</span>
            </div>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <span className="products-v2__cue">Learn More →</span>
        </GlassCard>
    );
}

function ProductDetailSection({ product, index, onNavigate }) {
    const detail = productDetails[product.page];
    const isEven = index % 2 === 0;
    return (
        <section
            id={product.page}
            className={`products-v2__section products-v2__detail${isEven ? "" : " products-v2__detail--flip"}`}
            style={{ "--bdna-accent": ACCENT[product.page] || "var(--bdna-emerald)" }}
            aria-label={product.name}
        >
            <div className="products-v2__detail-grid">
                <GlassPanel className="products-v2__detail-visual">
                    {product.image && (
                        <img src={product.image} alt={product.imageAlt} loading="lazy" decoding="async" className="products-v2__detail-img" />
                    )}
                    <div className="products-v2__detail-badge">{product.icon}</div>
                </GlassPanel>
                <div className="products-v2__detail-content">
                    <div className="products-v2__card-meta">
                        <span className={`products-v2__status products-v2__status--${normalizeProductStatus(product.status).variant}`}>
                            {product.status}
                        </span>
                        <span className="products-v2__cat">{product.category}</span>
                    </div>
                    <h2 className="products-v2__detail-name">{product.name}</h2>
                    <p className="products-v2__detail-lead">{product.description}</p>
                    {detail && (
                        <>
                            <div className="products-v2__detail-blocks">
                                <div className="products-v2__meta-block">
                                    <strong>Who it&rsquo;s for</strong>
                                    <ul>
                                        {detail.whoFor.map((who) => (
                                            <li key={who}>{who}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="products-v2__meta-block">
                                    <strong>What it solves</strong>
                                    <p>{detail.problem}</p>
                                </div>
                            </div>
                            <ul className="products-v2__features">
                                {detail.features.map((f) => (
                                    <li key={f}>
                                        <span className="products-v2__check" aria-hidden="true" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                    <button className="bdna-btn bdna-btn--solid" onClick={() => onNavigate(product.page)}>
                        {getButtonLabel(product.page)}
                    </button>
                </div>
            </div>
        </section>
    );
}

function EcosystemDiagramSection() {
    const cx = 320, cy = 240, r = 155;
    return (
        <section className="products-v2__section" aria-label="Cin Nova ecosystem diagram">
            <SectionHead eyebrow="The Ecosystem" title="Five products. One connected AI platform." center />
            <p className="products-v2__lead products-v2__lead--center">
                Each product solves a unique real-world problem while sharing a unified AI foundation, design language, and roadmap.
            </p>
            <GlassPanel className="products-v2__diagram">
                <svg
                    viewBox="0 0 640 480"
                    className="products-v2__diagram-svg"
                    role="img"
                    aria-label="Pentagon diagram showing five Cin Nova products connected to a central Cin Nova hub"
                >
                    <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(63,232,192,0.18)" strokeWidth="1" strokeDasharray="6 5" />
                    {diagramNodes.map((node, i) => {
                        const rad = (node.angle * Math.PI) / 180;
                        return (
                            <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(rad)} y2={cy + r * Math.sin(rad)} stroke={node.color} strokeWidth="1.2" opacity="0.4" strokeDasharray="5 5" />
                        );
                    })}
                    <circle cx={cx} cy={cy} r={64} fill="rgba(10,191,140,0.1)" stroke="rgba(63,232,192,0.4)" strokeWidth="1.5" />
                    <circle cx={cx} cy={cy} r={46} fill="rgba(10,191,140,0.06)" stroke="rgba(63,232,192,0.22)" strokeWidth="1" />
                    <text x={cx} y={cy - 10} textAnchor="middle" fontSize="13" fontWeight="800" fill="#f8fafc" letterSpacing="1.5">CIN NOVA</text>
                    <text x={cx} y={cy + 9} textAnchor="middle" fontSize="10" fill="#3fe8c0" letterSpacing="0.8">AI ECOSYSTEM</text>
                    {diagramNodes.map((node, i) => {
                        const rad = (node.angle * Math.PI) / 180;
                        const nx = cx + r * Math.cos(rad);
                        const ny = cy + r * Math.sin(rad);
                        return (
                            <g key={i}>
                                <circle cx={nx} cy={ny} r={42} fill={node.color + "22"} stroke={node.color} strokeWidth="1.5" />
                                <text x={nx} y={ny - 5} textAnchor="middle" fontSize="12" fontWeight="900" fill={node.color}>{node.abbr}</text>
                                <text x={nx} y={ny + 11} textAnchor="middle" fontSize="9" fontWeight="600" fill="#c4d3dd">{node.name}</text>
                            </g>
                        );
                    })}
                </svg>
                <div className="products-v2__legend">
                    {diagramNodes.map((node) => (
                        <div key={node.name} className="products-v2__legend-item">
                            <span style={{ background: node.color + "26", color: node.color, border: `1px solid ${node.color}55` }}>{node.abbr}</span>
                            {node.name}
                        </div>
                    ))}
                </div>
            </GlassPanel>
        </section>
    );
}

function FeatureIconsSection() {
    return (
        <section className="products-v2__section" aria-label="Platform capabilities">
            <SectionHead eyebrow="What We Build" title="AI-powered tools across every major domain" />
            <p className="products-v2__lead">
                Six core capability areas — every Cin Nova product is built on one or more of these foundations.
            </p>
            <div className="products-v2__feature-grid">
                {featureCapabilityPhotos.map((cat) => (
                    <GlassCard key={cat.id} className="products-v2__feature-card" media={<img src={cat.src} alt={cat.alt} loading="lazy" decoding="async" />}>
                        <span className="products-v2__cat">{cat.label}</span>
                        <h3>{cat.label}</h3>
                        <p>{cat.desc}</p>
                    </GlassCard>
                ))}
            </div>
        </section>
    );
}

function EcosystemShowcase({ showcase, index, onNavigate }) {
    const photo = productMarketing[showcase.page]?.hero;
    return (
        <GlassPanel
            as="article"
            className={`products-v2__showcase${index % 2 === 1 ? " products-v2__showcase--flip" : ""}`}
            style={{ "--bdna-accent": ACCENT[showcase.page] || "var(--bdna-emerald)" }}
        >
            <div className="products-v2__showcase-copy">
                <span className="products-v2__cat">{showcase.category}</span>
                <h3>{showcase.name}</h3>
                <p>{showcase.summary}</p>
                <div className="products-v2__showcase-features">
                    {showcase.features.map((feature) => (
                        <span key={feature}>{feature}</span>
                    ))}
                </div>
                <button type="button" className="bdna-btn bdna-btn--ghost" onClick={() => onNavigate(showcase.page)}>
                    Learn More
                </button>
            </div>
            {photo && (
                <div className="products-v2__showcase-photo">
                    <MarketingPhoto src={photo.src} alt={photo.alt} className="products-v2__showcase-img" />
                    <span className="products-v2__showcase-badge">{showcase.badge}</span>
                </div>
            )}
        </GlassPanel>
    );
}

function PlatformScreenshotCard({ preview, onNavigate }) {
    const photo = productMarketing[preview.page]?.card;
    return (
        <GlassPanel as="article" className="products-v2__platform-card" style={{ "--bdna-accent": preview.accentColor }}>
            <div className="products-v2__browser">
                <div className="products-v2__browser-bar">
                    <span className="products-v2__dot" /><span className="products-v2__dot" /><span className="products-v2__dot" />
                    <div className="products-v2__browser-url">cin-nova.app/{preview.page}</div>
                </div>
                <div className="products-v2__browser-screen">
                    {photo && (
                        <div className="products-v2__screen-photo">
                            <MarketingPhoto src={photo.src} alt={photo.alt} className="products-v2__screen-img" />
                            <span className="products-v2__screen-badge">{preview.badge}</span>
                        </div>
                    )}
                    <div className="products-v2__screen-header">
                        <span>{preview.category.toUpperCase()}</span>
                        <strong>{preview.name}</strong>
                    </div>
                    <div className="products-v2__screen-rows">
                        {preview.mockupLines.map((line) => (
                            <div
                                key={platformMockupLineKey(line)}
                                className={`products-v2__screen-row${typeof line === "object" && line.success ? " products-v2__screen-row--ok" : ""}`}
                            >
                                {typeof line === "string" ? line : line.text}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="products-v2__platform-body">
                <span className="products-v2__cat">{preview.category}</span>
                <h3>{preview.name}</h3>
                <p>{preview.desc}</p>
                <button type="button" className="bdna-btn bdna-btn--ghost" onClick={() => onNavigate(preview.page)}>
                    Explore {preview.name}
                </button>
            </div>
        </GlassPanel>
    );
}

function ProductsPage({ onNavigate, onSubscribe }) {
    const productsSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Cin Nova Product Catalog",
        description: "Explore StudyNest, PoisonGuard, Kiddo, TechMate AI, and Cin Nova Real Estate AI.",
        url: `${siteUrl}/?page=products`,
        publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
    };

    return (
        <main className="products-v2 brand-dna">
            <SEO
                title="Products | Cin Nova AI Software Ecosystem"
                description="Explore the Cin Nova product catalog: StudyNest, PoisonGuard, Kiddo, TechMate AI, and Cin Nova Real Estate AI. Five platforms solving real-world problems."
                url={`${siteUrl}/?page=products`}
                type="website"
                image={defaultOgImage}
                schema={productsSchema}
            />

            {/* ── Hero ─────────────────────────────────────────────── */}
            <section className="products-v2__hero" aria-label="Product catalog">
                <div className="products-v2__hero-ambient" aria-hidden="true">
                    <span className="products-v2__hero-glow" />
                    <span className="products-v2__hero-grid" />
                </div>
                <div className="products-v2__hero-inner">
                    <p className="bdna-eyebrow">Product Catalog</p>
                    <h1>Five platforms. One connected AI ecosystem.</h1>
                    <p className="products-v2__hero-text">
                        Every Cin Nova product solves a specific real-world problem — and each one is built to
                        work together as a unified AI platform.
                    </p>
                    <div className="products-v2__hero-actions">
                        <a href="#products-catalog" className="bdna-btn bdna-btn--solid">Browse Products</a>
                        <button className="bdna-btn bdna-btn--ghost" onClick={() => onNavigate("pricing")}>View Pricing</button>
                    </div>
                    <div className="products-v2__pills">
                        {products.map((p) => (
                            <button
                                type="button"
                                key={p.name}
                                className="products-v2__pill"
                                style={{ "--bdna-accent": ACCENT[p.page] || "var(--bdna-emerald)" }}
                                onClick={() => onNavigate(p.page)}
                            >
                                <span className="products-v2__pill-icon">{p.icon}</span>
                                <span>{p.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Catalog ──────────────────────────────────────────── */}
            <section id="products-catalog" className="products-v2__section" aria-label="All products">
                <SectionHead eyebrow="All Products" title="Choose your platform" />
                <p className="products-v2__lead">
                    Five focused AI products for education, safety, learning, tech support, and real estate.
                </p>
                <div className="products-v2__catalog-grid">
                    {products.map((product) => (
                        <CatalogCard key={product.name} product={product} onNavigate={onNavigate} />
                    ))}
                </div>
            </section>

            {/* ── Per-product detail ───────────────────────────────── */}
            {products.map((product, i) => (
                <ProductDetailSection key={product.name} product={product} index={i} onNavigate={onNavigate} />
            ))}

            <EcosystemDiagramSection />

            <FeatureIconsSection />

            {/* ── Product previews (editorial) ─────────────────────── */}
            <section className="products-v2__section" aria-label="Product previews">
                <SectionHead eyebrow="Product Previews" title="Inside the Cin Nova Ecosystem" />
                <p className="products-v2__lead">
                    Editorial previews of each product — real photography paired with the capabilities that define the Cin Nova platform family.
                </p>
                <div className="products-v2__showcase-stack">
                    {ecosystemShowcases.map((showcase, index) => (
                        <EcosystemShowcase key={showcase.name} showcase={showcase} index={index} onNavigate={onNavigate} />
                    ))}
                </div>
            </section>

            {/* ── Platform previews ────────────────────────────────── */}
            <section className="products-v2__section" aria-label="Inside the platform">
                <SectionHead eyebrow="Inside the Platform" title="A closer look at each product" />
                <p className="products-v2__lead">
                    Explore what each Cin Nova product does and how it fits into your everyday life or workflow.
                </p>
                <div className="products-v2__platform-grid">
                    {platformPreviews.map((preview) => (
                        <PlatformScreenshotCard key={preview.name} preview={preview} onNavigate={onNavigate} />
                    ))}
                </div>
            </section>

            {/* ── Roadmap ──────────────────────────────────────────── */}
            <section className="products-v2__section" aria-label="Roadmap">
                <SectionHead eyebrow="Roadmap" title="The future of the Cin Nova ecosystem" />
                <p className="products-v2__lead">
                    Cin Nova is being built as a long-term software company with consumer, business, education, real estate, and public safety opportunities.
                </p>
                <div className="products-v2__roadmap">
                    {timeline.map((item) => (
                        <GlassPanel as="article" key={item.year} className="products-v2__roadmap-card">
                            <span className="products-v2__cat">{item.year}</span>
                            <h3>{item.title}</h3>
                            {item.items.map((line) => (
                                <p key={line}>— {line}</p>
                            ))}
                        </GlassPanel>
                    ))}
                </div>
            </section>

            {/* ── Newsletter (Dispatch) ────────────────────────────── */}
            <section className="products-v2__section" aria-label="Newsletter">
                <Dispatch
                    eyebrow="Stay in the loop"
                    title="Get product updates, launch announcements, and early access."
                >
                    <NewsletterSignup onSubscribe={onSubscribe} source="Products Page" tags={["Products", "Launch Updates"]} />
                </Dispatch>
            </section>
        </main>
    );
}

export default ProductsPage;
