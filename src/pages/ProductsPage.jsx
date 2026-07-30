import { useEffect, useRef, useState } from "react";
import SEO from "../components/SEO.jsx";
import NewsletterSignup from "../components/NewsletterSignup.jsx";
import MarketingPhoto from "../components/MarketingPhoto.jsx";
import CinNovaCoreHero from "../components/brand-dna/CinNovaCoreHero.jsx";
import GlassCard from "../components/brand-dna/GlassCard.jsx";
import GlassPanel from "../components/brand-dna/GlassPanel.jsx";
import SectionHead from "../components/brand-dna/SectionHead.jsx";
import Dispatch from "../components/brand-dna/Dispatch.jsx";
import { featureCapabilityPhotos, productMarketing } from "../data/marketingImages.js";
import { getProductsUrl, normalizeProductStatus, productDetails, products } from "../data/products.js";
import { siteUrl } from "../data/seoConfig.js";
import {
    trackProductExploreClick,
    trackProductsHeroDiscoverClick,
    trackProductsHeroExploreClick,
} from "../utils/analytics.js";
import "../styles/brand-dna.css";
import "./ProductsPage.css";

const PRODUCTS_HERO_VIDEO = "/images/hero/cinnova-products-hero-cinematic.mp4";
const PRODUCTS_HERO_POSTER = "/images/hero/cinnova-products-hero-cinematic-master.png";

/*
 * Per-product accent (Brand DNA identity — decision #4).
 *
 * These are the 400-level tints of each product's catalog hue. The 500-level
 * originals (#0ea5e9 / #10b981 / #f59e0b / #8b5cf6 / #2563eb) are too dark for
 * small label text on the page's midnight surfaces: on the #0f1826 card panel
 * the violet measured 4.21:1 and the blue 3.45:1, both below the WCAG AA 4.5:1
 * floor for body-size text. Every tint below clears it (6.5:1 – 10.7:1).
 *
 * They also match the per-product accents already used by ProductDark.css, so
 * the Products page and the product pages now share one palette.
 */
const ACCENT = {
    studynest: "#38bdf8",
    poisonguard: "#34d399",
    kiddo: "#fbbf24",
    techmate: "#a78bfa",
    "real-estate": "#60a5fa",
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

/* Same 400-level tints as ACCENT: the node abbreviations are text painted on a
   dark canvas, so they need the same contrast floor. */
const diagramNodes = [
    { name: "StudyNest", abbr: "SN", color: "#38bdf8", angle: -90 },
    { name: "PoisonGuard", abbr: "PG", color: "#34d399", angle: -18 },
    { name: "Kiddo", abbr: "KD", color: "#fbbf24", angle: 54 },
    { name: "TechMate AI", abbr: "TM", color: "#a78bfa", angle: 126 },
    { name: "Real Estate AI", abbr: "RE", color: "#60a5fa", angle: 198 },
];

const platformPreviews = [
    {
        name: "StudyNest", badge: "SN", category: "Education AI", page: "studynest",
        desc: "Smart notes, spaced-repetition flashcards, AI tutoring, and a study planner — all in one connected workspace.",
        mockupLines: ["Notes → 32 flashcards generated", "AI Tutor: Biology session ready", "Planner: 3 tasks due tomorrow"],
    },
    {
        name: "PoisonGuard", badge: "PG", category: "Safety Technology", page: "poisonguard",
        desc: "Scan household products, detect chemical risk levels, and get emergency guidance for pets and families instantly.",
        mockupLines: ["Hazard Scanner: Ready to scan", { text: "Risk Level: Low", success: true }, "Pet Safety: 2 items flagged"],
    },
    {
        name: "Kiddo", badge: "KD", category: "Early Learning", page: "kiddo",
        desc: "Playful ABCs, counting games, reading activities, a parent dashboard, and a rewards system for young learners.",
        mockupLines: ["Today: Letter B + Counting", "12 Stars Earned Today", "Parent: Progress Report Ready"],
    },
    {
        name: "TechMate AI", badge: "TM", category: "Tech Support AI", page: "techmate",
        desc: "Diagnose devices, look up error codes, troubleshoot Wi-Fi, and follow guided repair steps — no technician needed.",
        mockupLines: [{ text: "Device Health: 98%", success: true }, "Wi-Fi Troubleshooter: Active", "Error Code Lookup: Resolved"],
    },
    {
        name: "Real Estate AI", badge: "RE", category: "Real Estate AI", page: "real-estate",
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
            onClick={() => {
                trackProductExploreClick({ productName: product.name, sourcePage: "products", destinationPage: product.page });
                onNavigate(product.page);
            }}
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

/* Merges the three former per-product blocks (detail section, editorial
   showcase, platform preview) into one record so a single tab panel can
   render every field that used to be spread across three page sections. */
function buildShowcaseItems() {
    const showcaseByPage = Object.fromEntries(ecosystemShowcases.map((s) => [s.page, s]));
    const previewByPage = Object.fromEntries(platformPreviews.map((p) => [p.page, p]));

    return products.map((product) => ({
        product,
        page: product.page,
        // Preview names are the shorter, catalog-friendly labels ("Real Estate
        // AI" rather than "Cin Nova Real Estate"), which fit the tab strip.
        tabLabel: previewByPage[product.page]?.name || product.name,
        detail: productDetails[product.page],
        showcase: showcaseByPage[product.page],
        preview: previewByPage[product.page],
    }));
}

function ProductPanelPreview({ preview }) {
    const photo = productMarketing[preview.page]?.card;
    return (
        <div className="products-v2__panel-preview">
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
            <p className="products-v2__panel-preview-copy">{preview.desc}</p>
        </div>
    );
}

function ProductTabPanel({ item, onNavigate }) {
    const { product, detail, showcase, preview } = item;
    return (
        <div
            id={product.page}
            role="tabpanel"
            aria-labelledby={`products-tab-${product.page}`}
            tabIndex={0}
            className="products-v2__tabpanel"
            style={{ "--bdna-accent": ACCENT[product.page] || "var(--bdna-emerald)" }}
        >
            <div className="products-v2__tabpanel-grid">
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
                    <h3 className="products-v2__detail-name">{product.name}</h3>
                    <p className="products-v2__detail-lead">{product.description}</p>
                    {showcase && <p className="products-v2__panel-summary">{showcase.summary}</p>}

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

                    {showcase && (
                        <div className="products-v2__showcase-features">
                            {showcase.features.map((feature) => (
                                <span key={feature}>{feature}</span>
                            ))}
                        </div>
                    )}

                    <button className="bdna-btn bdna-btn--solid hover-lift" onClick={() => onNavigate(product.page)}>
                        {getButtonLabel(product.page)}
                    </button>
                </div>
            </div>

            {preview && <ProductPanelPreview preview={preview} />}
        </div>
    );
}

/**
 * Compact tabbed replacement for the five stacked per-product sections.
 * Follows the WAI-ARIA tabs pattern: roving tabindex, arrow/Home/End keys,
 * and only the active panel in the DOM. Each panel keeps its former section
 * `id` (e.g. `#studynest`) so existing deep links still resolve.
 */
function ProductShowcaseTabs({ items, onNavigate }) {
    // Honour a deep link such as /products#poisonguard on first paint,
    // resolved in the initializer so the correct tab renders immediately
    // rather than flashing the default one.
    const [activePage, setActivePage] = useState(() => {
        const hash = typeof window === "undefined" ? "" : window.location.hash.replace("#", "");
        return items.some((item) => item.page === hash) ? hash : items[0].page;
    });
    const tabRefs = useRef({});
    const shouldFocus = useRef(false);

    // Only pull focus when the user drove the change from the keyboard —
    // never on mount, which would scroll the page down to the tab strip.
    useEffect(() => {
        if (!shouldFocus.current) return;
        shouldFocus.current = false;
        tabRefs.current[activePage]?.focus();
    }, [activePage]);

    // Keep the tab in sync when the hash changes without a reload — browser
    // back/forward between anchors, or an in-page link to #kiddo.
    useEffect(() => {
        function onHashChange() {
            const hash = window.location.hash.replace("#", "");
            if (items.some((item) => item.page === hash)) setActivePage(hash);
        }
        window.addEventListener("hashchange", onHashChange);
        return () => window.removeEventListener("hashchange", onHashChange);
    }, [items]);

    function selectByOffset(event, nextIndex) {
        event.preventDefault();
        shouldFocus.current = true;
        setActivePage(items[nextIndex].page);
    }

    function handleKeyDown(event) {
        const index = items.findIndex((item) => item.page === activePage);
        if (event.key === "ArrowRight") selectByOffset(event, (index + 1) % items.length);
        else if (event.key === "ArrowLeft") selectByOffset(event, (index - 1 + items.length) % items.length);
        else if (event.key === "Home") selectByOffset(event, 0);
        else if (event.key === "End") selectByOffset(event, items.length - 1);
    }

    const activeItem = items.find((item) => item.page === activePage) || items[0];

    return (
        <div className="products-v2__tabs">
            <div
                className="products-v2__tablist"
                role="tablist"
                aria-label="Cin Nova products"
                onKeyDown={handleKeyDown}
            >
                {items.map((item) => {
                    const selected = item.page === activePage;
                    return (
                        <button
                            key={item.page}
                            type="button"
                            role="tab"
                            id={`products-tab-${item.page}`}
                            aria-selected={selected}
                            aria-controls={item.page}
                            tabIndex={selected ? 0 : -1}
                            ref={(node) => { tabRefs.current[item.page] = node; }}
                            className={`products-v2__tab${selected ? " is-active" : ""}`}
                            style={{ "--bdna-accent": ACCENT[item.page] || "var(--bdna-emerald)" }}
                            onClick={() => setActivePage(item.page)}
                        >
                            <span className="products-v2__tab-icon" aria-hidden="true">{item.product.icon}</span>
                            <span>{item.tabLabel}</span>
                        </button>
                    );
                })}
            </div>

            <ProductTabPanel key={activeItem.page} item={activeItem} onNavigate={onNavigate} />
        </div>
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

function ProductsPage({ onNavigate, onSubscribe }) {
    const showcaseItems = buildShowcaseItems();
    const productsSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Cin Nova Product Catalog",
        description: "Explore StudyNest, PoisonGuard, Kiddo, TechMate AI, and Cin Nova Real Estate AI.",
        url: getProductsUrl(),
        publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
    };

    function scrollToCatalog() {
        trackProductsHeroExploreClick();
        const target = document.getElementById("products-catalog");
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
        }
        window.location.hash = "products-catalog";
    }

    function discoverCinNova() {
        trackProductsHeroDiscoverClick();
        onNavigate("about");
    }

    return (
        <main className="products-v2 brand-dna">
            <SEO
                title="Products | Cin Nova AI Software Ecosystem"
                description="Explore the Cin Nova product catalog: StudyNest, PoisonGuard, Kiddo, TechMate AI, and Cin Nova Real Estate AI. Five platforms solving real-world problems."
                url={getProductsUrl()}
                type="website"
                image={PRODUCTS_HERO_POSTER}
                schema={productsSchema}
            />

            {/* ── Hero — cinematic ecosystem video + HTML overlay ── */}
            <CinNovaCoreHero
                className="cn-core-hero--products"
                eyebrow="The CinNova Ecosystem"
                titleA="Technology Built for"
                titleB="Real Life"
                subtitle="AI-powered products for learning, safety, real estate, technology, and everyday life — connected through the CinNova ecosystem."
                videoSrc={PRODUCTS_HERO_VIDEO}
                poster={PRODUCTS_HERO_POSTER}
                objectPosition="center center"
                preload="metadata"
                primaryCta={{ label: "Explore Products", onClick: scrollToCatalog }}
                secondaryCta={{ label: "Discover CinNova", onClick: discoverCinNova }}
            />

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

            {/* ── Per-product detail (tabbed) ──────────────────────
                Replaces the five stacked detail sections plus the editorial
                showcase stack and the platform preview grid — the same five
                products used to appear three times over. */}
            <section className="products-v2__section" aria-label="Inside the platform">
                <SectionHead eyebrow="Inside the Platform" title="A closer look at each product" />
                <p className="products-v2__lead">
                    Explore what each Cin Nova product does and how it fits into your everyday life or workflow.
                </p>
                <ProductShowcaseTabs items={showcaseItems} onNavigate={onNavigate} />
            </section>

            <EcosystemDiagramSection />

            <FeatureIconsSection />

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
