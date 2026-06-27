import { Component, useEffect, useState } from "react";
import "./App.css";
import HomePage from "./pages/HomePage.jsx";
import StudyNest from "./pages/StudyNest.jsx";
import PoisonGuard from "./pages/PoisonGuard.jsx";
import RealEstate from "./pages/RealEstate.jsx";
import TechMateAI from "./pages/TechMateAI.jsx";
import Kiddo from "./pages/Kiddo.jsx";
import Pricing from "./pages/Pricing.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import TermsOfService from "./pages/TermsOfService.jsx";
import Blog from "./pages/Blog.jsx";
import ArticlePage from "./pages/ArticlePage.jsx";
import Resources from "./pages/Resources.jsx";
import ResourcePage from "./pages/ResourcePage.jsx";
import NewsletterAdmin from "./pages/NewsletterAdmin.jsx";
import NewsletterSuccess from "./pages/NewsletterSuccess.jsx";
import BlogManager from "./pages/BlogManager.jsx";
import Partners from "./pages/Partners.jsx";
import MediaKit from "./pages/MediaKit.jsx";
import NewsletterPage from "./pages/NewsletterPage.jsx";
import Advertise from "./pages/Advertise.jsx";
import PartnerWithUs from "./pages/PartnerWithUs.jsx";
import Partnerships from "./pages/Partnerships.jsx";
import PressCenter from "./pages/PressCenter.jsx";
import SponsorNewsletter from "./pages/SponsorNewsletter.jsx";
import SiteFooter from "./components/SiteFooter.jsx";
import NewsletterSignup from "./components/NewsletterSignup.jsx";
import NewsletterPopup from "./components/NewsletterPopup.jsx";
import ExitIntentPopup from "./components/ExitIntentPopup.jsx";
import GuideModal from "./components/GuideModal.jsx";
import StickyNewsletterBar from "./components/StickyNewsletterBar.jsx";
import FloatingNewsletterButton from "./components/FloatingNewsletterButton.jsx";
import {
    getManagedPostBySlug,
    getManagedPosts,
    getPublishedPosts,
} from "./data/blogManagerService.js";
import { getResourceBySlug, resources } from "./data/resources.js";
import { saveSubscriber } from "./data/newsletterService.js";
import { safeGetSessionFlag, safeSetSessionFlag } from "./utils/security.js";
import { getCategoryBySlug, slugifyCategory, siteUrl } from "./data/blogPosts.js";
import SEO from "./components/SEO.jsx";
import { initAnalytics, trackPageView } from "./utils/analytics.js";
import FeaturePhotoCard from "./components/FeaturePhotoCard.jsx";
import MarketingPhoto from "./components/MarketingPhoto.jsx";
import {
    featureCapabilityPhotos,
    productMarketing,
} from "./data/marketingImages.js";
import { productDetails, products } from "./data/products.js";
import ProductCatalogGrid from "./components/ProductCatalogGrid.jsx";
import ProductEcosystemSection from "./components/ProductEcosystemSection.jsx";

class ArticleErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    componentDidCatch(error) {
        console.error("[ArticlePage render error]", error);
    }
    componentDidUpdate(_, prevState) {
        if (this.state.hasError && !prevState.hasError) {
            this.props.onBack?.();
        }
    }
    render() {
        if (this.state.hasError) return null;
        return this.props.children;
    }
}

const ecosystemShowcases = [
    {
        name: "StudyNest",
        page: "studynest",
        badge: "SN",
        category: "Education AI",
        summary:
            "A focused learning workspace for notes, review cycles, AI tutoring, and study planning.",
        accent: "cyan",
        features: [
            "Dashboard mockup",
            "Smart Notes",
            "Flashcards",
            "AI Tutor",
            "Study Planner",
        ],
        metric: "87%",
        metricLabel: "Weekly progress",
        panelTitle: "Study Dashboard",
        activity: "Biology notes converted into 32 flashcards",
        bars: [86, 68, 74],
        chartLabels: ["Notes", "Cards", "Planner"],
    },
    {
        name: "PoisonGuard",
        page: "poisonguard",
        badge: "PG",
        category: "Safety Technology",
        summary:
            "A safety command center for scanning hazards, detecting risk, and finding urgent guidance.",
        accent: "emerald",
        features: [
            "Hazard Scanner",
            "Risk Detection",
            "Emergency Guidance",
            "Pet Safety",
            "Scan History",
        ],
        metric: "94",
        metricLabel: "Safety score",
        panelTitle: "Hazard Scan",
        activity: "Kitchen cleaner flagged for pet exposure review",
        bars: [72, 91, 58],
        chartLabels: ["Home", "Pets", "History"],
    },
    {
        name: "TechMate AI",
        page: "techmate",
        badge: "TM",
        category: "Tech Support AI",
        summary:
            "An everyday repair assistant for diagnostics, error lookup, network help, and guided fixes.",
        accent: "violet",
        features: [
            "AI Chat Assistant",
            "Device Diagnostics",
            "Error Lookup",
            "Network Troubleshooting",
            "Repair Guides",
        ],
        metric: "98%",
        metricLabel: "Device health",
        panelTitle: "Diagnostics",
        activity: "Wi-Fi latency issue matched with router reset guide",
        bars: [98, 64, 81],
        chartLabels: ["Device", "Network", "Guides"],
    },
    {
        name: "Kiddo",
        page: "kiddo",
        badge: "KD",
        category: "Early Learning",
        summary:
            "A playful parent-supported learning hub for reading, counting, rewards, and progress.",
        accent: "amber",
        features: [
            "ABC Learning",
            "Reading Games",
            "Counting Activities",
            "Parent Dashboard",
            "Rewards System",
        ],
        metric: "12",
        metricLabel: "Stars earned",
        panelTitle: "Learning Path",
        activity: "Letter sounds and counting games ready for today",
        bars: [76, 88, 54],
        chartLabels: ["ABC", "Reading", "Counting"],
    },
    {
        name: "Cin Nova Real Estate",
        page: "real-estate",
        badge: "RE",
        category: "Real Estate AI",
        summary:
            "A property intelligence suite for search, financing, investor analysis, and market research.",
        accent: "blue",
        features: [
            "Property Search",
            "Deal Analyzer",
            "Mortgage Calculator",
            "Market Intelligence",
            "Commercial Analysis",
        ],
        metric: "8.1%",
        metricLabel: "Cap rate",
        panelTitle: "Deal Analyzer",
        activity: "Duplex opportunity ranked A- for cash flow",
        bars: [82, 69, 93],
        chartLabels: ["Search", "Finance", "Market"],
    },
];

const timeline = [
    {
        year: "2026",
        title: "Brand Website + Product Foundation",
        items: ["Cin Nova Website", "Product pages", "Newsletter", "Blog foundation"],
    },
    {
        year: "2027",
        title: "First Product Launches",
        items: ["StudyNest launch", "PoisonGuard launch", "TechMate AI beta", "Early users"],
    },
    {
        year: "2028",
        title: "Mobile Apps + Subscriptions",
        items: ["iPhone apps", "iPad apps", "Premium plans", "User dashboards"],
    },
    {
        year: "2029",
        title: "Business + Organization Tools",
        items: ["School tools", "Business accounts", "Real estate pro tools", "Team dashboards"],
    },
    {
        year: "2030+",
        title: "Public Safety + Global Expansion",
        items: ["Government edition", "Multilingual support", "Canada expansion", "Agency dashboards"],
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

function EcosystemShowcase({ showcase, index, onNavigate }) {
    const photo = productMarketing[showcase.page]?.hero;

    return (
        <article className={`ecosystem-showcase-row ${index % 2 === 1 ? " is-reversed" : ""}`}>
            <div className="ecosystem-copy">
                <p className="product-category">{showcase.category}</p>
                <h3>{showcase.name}</h3>
                <p>{showcase.summary}</p>

                <div className="showcase-feature-list">
                    {showcase.features.map((feature) => (
                        <span key={feature}>{feature}</span>
                    ))}
                </div>

                <button type="button" className="secondary-btn ecosystem-showcase-cta" onClick={() => onNavigate(showcase.page)}>
                    Learn More
                </button>
            </div>

            {photo && (
                <div className="showcase-photo-card">
                    <MarketingPhoto
                        src={photo.src}
                        alt={photo.alt}
                        className="showcase-photo-img"
                    />
                    <span className="showcase-photo-badge">{showcase.badge}</span>
                </div>
            )}
        </article>
    );
}

const featureCategories = featureCapabilityPhotos;

function FeatureIconsSection() {
    return (
        <section className="section feature-icons-section" aria-label="Platform capabilities">
            <div className="section-heading">
                <p className="eyebrow">WHAT WE BUILD</p>
                <h2>AI-powered tools across every major domain</h2>
                <p>Six core capability areas \u2014 every Cin Nova product is built on one or more of these foundations.</p>
            </div>
            <div className="feature-icons-grid product-grid-photo">
                {featureCategories.map((cat) => (
                    <FeaturePhotoCard
                        key={cat.id}
                        image={cat.src}
                        alt={cat.alt}
                        category={cat.label}
                        title={cat.label}
                        description={cat.desc}
                    />
                ))}
            </div>
        </section>
    );
}

const diagramNodes = [
    { name: "StudyNest",      abbr: "SN", color: "#0ea5e9", angle: -90  },
    { name: "PoisonGuard",    abbr: "PG", color: "#10b981", angle: -18  },
    { name: "Kiddo",          abbr: "KD", color: "#f59e0b", angle:  54  },
    { name: "TechMate AI",    abbr: "TM", color: "#8b5cf6", angle: 126  },
    { name: "Real Estate AI", abbr: "RE", color: "#2563eb", angle: 198  },
];

function EcosystemDiagramSection() {
    const cx = 320, cy = 240, r = 155;
    return (
        <section className="section ecosystem-diagram-section" aria-label="Cin Nova ecosystem diagram">
            <div className="section-heading">
                <p className="eyebrow">THE ECOSYSTEM</p>
                <h2>Five products. One connected AI platform.</h2>
                <p>Each product solves a unique real-world problem while sharing a unified AI foundation, design language, and roadmap.</p>
            </div>
            <div className="ecosystem-diagram-outer">
                <svg
                    viewBox="0 0 640 480"
                    className="ecosystem-diagram-svg"
                    role="img"
                    aria-label="Pentagon diagram showing five Cin Nova products connected to a central Cin Nova hub"
                >
                    <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(99,102,241,0.15)" strokeWidth="1" strokeDasharray="6 5"/>
                    {diagramNodes.map((node, i) => {
                        const rad = (node.angle * Math.PI) / 180;
                        return (
                            <line key={i}
                                x1={cx} y1={cy}
                                x2={cx + r * Math.cos(rad)} y2={cy + r * Math.sin(rad)}
                                stroke={node.color} strokeWidth="1.2" opacity="0.35" strokeDasharray="5 5"/>
                        );
                    })}
                    <circle cx={cx} cy={cy} r={64} fill="rgba(99,102,241,0.07)" stroke="rgba(99,102,241,0.3)" strokeWidth="1.5"/>
                    <circle cx={cx} cy={cy} r={46} fill="rgba(99,102,241,0.05)" stroke="rgba(99,102,241,0.18)" strokeWidth="1"/>
                    <text x={cx} y={cy - 10} textAnchor="middle" fontSize="13" fontWeight="800" fill="#1e1b4b" letterSpacing="1.5">CIN NOVA</text>
                    <text x={cx} y={cy + 9}  textAnchor="middle" fontSize="10" fill="#6366f1" letterSpacing="0.8">AI ECOSYSTEM</text>
                    {diagramNodes.map((node, i) => {
                        const rad = (node.angle * Math.PI) / 180;
                        const nx = cx + r * Math.cos(rad);
                        const ny = cy + r * Math.sin(rad);
                        return (
                            <g key={i}>
                                <circle cx={nx} cy={ny} r={42} fill={node.color + "18"} stroke={node.color} strokeWidth="1.5"/>
                                <text x={nx} y={ny - 5} textAnchor="middle" fontSize="12" fontWeight="900" fill={node.color}>{node.abbr}</text>
                                <text x={nx} y={ny + 11} textAnchor="middle" fontSize="9" fontWeight="600" fill="#334155">{node.name}</text>
                            </g>
                        );
                    })}
                </svg>
                <div className="ecosystem-diagram-legend">
                    {diagramNodes.map((node) => (
                        <div key={node.name} className="diagram-legend-item">
                            <span style={{ background: node.color + "20", color: node.color, border: `1px solid ${node.color}44` }}>
                                {node.abbr}
                            </span>
                            {node.name}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

const platformPreviews = [
    {
        name: "StudyNest",
        badge: "SN",
        category: "Education AI",
        accentColor: "#0ea5e9",
        desc: "Smart notes, spaced-repetition flashcards, AI tutoring, and a study planner \u2014 all in one connected workspace.",
        page: "studynest",
        mockupLines: ["Notes \u2192 32 flashcards generated", "AI Tutor: Biology session ready", "Planner: 3 tasks due tomorrow"],
    },
    {
        name: "PoisonGuard",
        badge: "PG",
        category: "Safety Technology",
        accentColor: "#10b981",
        desc: "Scan household products, detect chemical risk levels, and get emergency guidance for pets and families instantly.",
        page: "poisonguard",
        mockupLines: ["Hazard Scanner: Ready to scan", { text: "Risk Level: Low", success: true }, "Pet Safety: 2 items flagged"],
    },
    {
        name: "Kiddo",
        badge: "KD",
        category: "Early Learning",
        accentColor: "#f59e0b",
        desc: "Playful ABCs, counting games, reading activities, a parent dashboard, and a rewards system for young learners.",
        page: "kiddo",
        mockupLines: ["Today: Letter B + Counting", "12 Stars Earned Today", "Parent: Progress Report Ready"],
    },
    {
        name: "TechMate AI",
        badge: "TM",
        category: "Tech Support AI",
        accentColor: "#8b5cf6",
        desc: "Diagnose devices, look up error codes, troubleshoot Wi-Fi, and follow guided repair steps \u2014 no technician needed.",
        page: "techmate",
        mockupLines: [{ text: "Device Health: 98%", success: true }, "Wi-Fi Troubleshooter: Active", "Error Code Lookup: Resolved"],
    },
    {
        name: "Real Estate AI",
        badge: "RE",
        category: "Real Estate AI",
        accentColor: "#2563eb",
        desc: "Analyze investment deals, estimate mortgage payments, review cash flow, and score properties against your goals.",
        page: "real-estate",
        mockupLines: ["Deal Score: A- (Strong Buy)", "Cap Rate: 8.1% | Cash Flow: +$645", "Market Intelligence: Rising \u2191"],
    },
];

function platformMockupLineKey(line) {
    return typeof line === "string" ? line : line.text;
}

function PlatformScreenshotCard({ preview, onNavigate }) {
    const photo = productMarketing[preview.page]?.card;

    return (
        <article className="platform-card">
            <div className="platform-browser">
                <div className="platform-browser-bar">
                    <span className="dot-red"/><span className="dot-yellow"/><span className="dot-green"/>
                    <div className="platform-browser-url">cin-nova.app/{preview.page}</div>
                </div>
                <div className="platform-browser-screen">
                    {photo && (
                        <div className="platform-screen-photo">
                            <MarketingPhoto src={photo.src} alt={photo.alt} className="platform-screen-photo-img" />
                            <span className="platform-screen-badge">{preview.badge}</span>
                        </div>
                    )}
                    <div className="platform-screen-header" style={{ background: preview.accentColor + "12" }}>
                        <span style={{ color: preview.accentColor }}>{preview.category.toUpperCase()}</span>
                        <strong>{preview.name}</strong>
                    </div>
                    <div className="platform-screen-rows">
                        {preview.mockupLines.map((line) => (
                            <div
                                key={platformMockupLineKey(line)}
                                className={`platform-screen-row${typeof line === "object" && line.success ? " platform-screen-row--success" : ""}`}
                            >
                                {typeof line === "string" ? line : line.text}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="platform-card-body">
                <p className="product-category">{preview.category}</p>
                <h3>{preview.name}</h3>
                <p>{preview.desc}</p>
                <button
                    className="platform-learn-btn"
                    style={{ borderColor: preview.accentColor + "66", color: preview.accentColor }}
                    onClick={() => onNavigate(preview.page)}
                >
                    Explore {preview.name}
                </button>
            </div>
        </article>
    );
}

function PlatformSection({ onNavigate }) {
    return (
        <section className="section platform-section" aria-label="Inside the platform">
            <div className="section-heading">
                <p className="eyebrow">INSIDE THE PLATFORM</p>
                <h2>A closer look at each product</h2>
                <p>Explore what each Cin Nova product does and how it fits into your everyday life or workflow.</p>
            </div>
            <div className="platform-grid">
                {platformPreviews.map((preview) => (
                    <PlatformScreenshotCard key={preview.name} preview={preview} onNavigate={onNavigate}/>
                ))}
            </div>
        </section>
    );
}

function ProductDetailSection({ product, index, onNavigate }) {
    const detail = productDetails[product.page];
    const isEven = index % 2 === 0;
    const badgeClass =
        product.status === "Active Build" ? "badge-green" :
        product.status === "In Development" ? "badge-blue" : "badge-gray";
    return (
        <section
            id={product.page}
            className={`section product-detail-section${isEven ? "" : " product-detail-flip"}`}
            aria-label={product.name}
        >
            <div className="product-detail-grid">
                <div className="product-detail-visual">
                    {product.image && (
                        <img
                            src={product.image}
                            alt={product.imageAlt}
                            loading="lazy"
                            decoding="async"
                            className="product-detail-img"
                        />
                    )}
                    <div className="product-detail-icon-badge">{product.icon}</div>
                </div>
                <div className="product-detail-content">
                    <div className="product-detail-meta-row">
                        <span className={`product-status-badge ${badgeClass}`}>{product.status}</span>
                        <span className="product-category">{product.category}</span>
                    </div>
                    <h2 className="product-detail-name">{product.name}</h2>
                    <p className="product-detail-lead">{product.description}</p>
                    {detail && (
                        <>
                            <div className="product-detail-blocks">
                                <div className="product-meta-block">
                                    <strong>Who it&rsquo;s for</strong>
                                    <ul>
                                        {detail.whoFor.map((who) => (
                                            <li key={who}>{who}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="product-meta-block">
                                    <strong>What it solves</strong>
                                    <p>{detail.problem}</p>
                                </div>
                            </div>
                            <ul className="product-features-list">
                                {detail.features.map((f) => (
                                    <li key={f}>
                                        <span className="feature-check" aria-hidden="true" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                    <button className="primary-btn" onClick={() => onNavigate(product.page)}>
                        {getButtonLabel(product.page)}
                    </button>
                </div>
            </div>
        </section>
    );
}

function ProductsPage({ onNavigate, onSubscribe }) {
    return (
        <main>
            <SEO
                title="Products | Cin Nova AI Software Ecosystem"
                description="Explore the Cin Nova product catalog: StudyNest, PoisonGuard, Kiddo, TechMate AI, and Cin Nova Real Estate AI. Five platforms solving real-world problems."
                url={`${siteUrl}/?page=products`}
                type="website"
            />

            <section className="products-hero">
                <div className="products-hero-content">
                    <p className="eyebrow">PRODUCT CATALOG</p>
                    <h1>Five platforms. One connected AI ecosystem.</h1>
                    <p className="hero-text">
                        Every Cin Nova product solves a specific real-world problem \u2014 and each one is built to
                        work together as a unified AI platform.
                    </p>
                    <div className="hero-actions">
                        <a href="#products-catalog" className="primary-btn">Browse Products</a>
                        <button className="secondary-btn" onClick={() => onNavigate("pricing")}>
                            View Pricing
                        </button>
                    </div>
                </div>
                <div className="products-hero-pills">
                    {products.map((p) => (
                        <button
                            type="button"
                            key={p.name}
                            className="product-hero-pill"
                            onClick={() => onNavigate(p.page)}
                        >
                            <span className="product-hero-pill-icon">{p.icon}</span>
                            <span>{p.name}</span>
                        </button>
                    ))}
                </div>
            </section>

            <section id="products-catalog" className="section products-catalog-section" aria-labelledby="products-catalog-title">
                <div className="section-heading">
                    <p className="eyebrow">ALL PRODUCTS</p>
                    <h2 id="products-catalog-title">Choose your platform</h2>
                    <p>Five focused AI products for education, safety, learning, tech support, and real estate.</p>
                </div>
                <ProductCatalogGrid products={products} onNavigate={onNavigate} />
            </section>

            {products.map((product, i) => (
                <ProductDetailSection
                    key={product.name}
                    product={product}
                    index={i}
                    onNavigate={onNavigate}
                />
            ))}

            <EcosystemDiagramSection />

            <FeatureIconsSection />

            <section className="section ecosystem-showcase-section">
                <div className="section-heading">
                    <p className="eyebrow">PRODUCT PREVIEWS</p>
                    <h2>Inside the Cin Nova Ecosystem</h2>
                    <p>
                        Editorial previews of each product \u2014 real photography paired with the
                        capabilities that define the Cin Nova platform family.
                    </p>
                </div>
                <div className="ecosystem-showcase-stack">
                    {ecosystemShowcases.map((showcase, index) => (
                        <EcosystemShowcase key={showcase.name} showcase={showcase} index={index} onNavigate={onNavigate} />
                    ))}
                </div>
            </section>

            <PlatformSection onNavigate={onNavigate} />

            <section className="section">
                <div className="section-heading">
                    <p className="eyebrow">ROADMAP</p>
                    <h2>The future of the Cin Nova ecosystem</h2>
                    <p>
                        Cin Nova is being built as a long-term software company with consumer, business,
                        education, real estate, and public safety opportunities.
                    </p>
                </div>
                <div className="pricing-grid">
                    {timeline.map((item) => (
                        <article className="pricing-card" key={item.year}>
                            <p className="product-category">{item.year}</p>
                            <h3>{item.title}</h3>
                            {item.items.map((line) => (
                                <p key={line}>- {line}</p>
                            ))}
                        </article>
                    ))}
                </div>
            </section>

            <section className="section">
                <div className="newsletter-card">
                    <p className="eyebrow">STAY IN THE LOOP</p>
                    <h2>Get product updates, launch announcements, and early access.</h2>
                    <NewsletterSignup
                        onSubscribe={onSubscribe}
                        source="Products Page"
                        tags={["Products", "Launch Updates"]}
                    />
                </div>
            </section>
        </main>
    );
}


function getRouteFromUrl(posts = getManagedPosts()) {
    const path = window.location.pathname.replace(/\/+$/, "") || "/";
    const params = new URLSearchParams(window.location.search);
    const articleSlug = params.get("article");
    const resourceSlug = params.get("resource");
    const routedPage = params.get("page");

    if (path === "/blog") {
        return { page: "blog", article: null, resource: null, category: "All" };
    }

    if (path === "/blog-admin") {
        return { page: "blog-manager", article: null, resource: null, category: null };
    }

    const categoryMatch = path.match(/^\/blog\/category\/([^/]+)$/);
    if (categoryMatch) {
        const category = getCategoryBySlug(decodeURIComponent(categoryMatch[1]));
        return { page: "blog", article: null, resource: null, category: category || "All" };
    }

    const articleMatch = path.match(/^\/blog\/([^/]+)$/);
    if (articleMatch) {
        const post = getManagedPostBySlug(decodeURIComponent(articleMatch[1]), posts);
        if (post) return { page: "article", article: post, resource: null, category: null };
    }

    if (articleSlug) {
        const post = getManagedPostBySlug(articleSlug, posts);
        if (post) return { page: "article", article: post, resource: null, category: null };
    }

    if (resourceSlug) {
        const resource = getResourceBySlug(resourceSlug);
        if (resource) return { page: "resource", article: null, resource, category: null };
    }

    if (routedPage) return { page: routedPage, article: null, resource: null, category: null };
    return { page: "home", article: null, resource: null, category: null };
}

const POPUP_KEY = "newsletterDismissed";
const EXIT_KEY = "cn_exit_popup_dismissed";
const STICKY_KEY = "cn_sticky_dismissed";

function App() {
    const [managedPosts, setManagedPosts] = useState(getManagedPosts());
    const publishedPosts = getPublishedPosts(managedPosts);
    const initialRoute = getRouteFromUrl(managedPosts);
    const [page, setPage] = useState(initialRoute.page);
    const [selectedArticle, setSelectedArticle] = useState(initialRoute.article);
    const [selectedResource, setSelectedResource] = useState(initialRoute.resource);
    const [selectedCategory, setSelectedCategory] = useState(initialRoute.category || "All");

    // Mobile nav state
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Lead capture state
    const [showNewsletterPopup, setShowNewsletterPopup] = useState(false);
    const [showExitPopup, setShowExitPopup] = useState(false);
    const [showGuideModal, setShowGuideModal] = useState(false);
    const [showStickyBar, setShowStickyBar] = useState(false);
    const [stickyDismissed, setStickyDismissed] = useState(
        () => safeGetSessionFlag(STICKY_KEY)
    );

    // Boot GA4: inject gtag script and fire the initial page_view
    useEffect(() => {
        initAnalytics();
        trackPageView(window.location.pathname + window.location.search);
    }, []);

    // Timed newsletter popup - fires once per session after 45 s
    useEffect(() => {
        if (safeGetSessionFlag(POPUP_KEY)) return;
        const timer = setTimeout(() => {
            // Re-check at fire time in case the user dismissed via another trigger
            if (!safeGetSessionFlag(POPUP_KEY)) {
                setShowNewsletterPopup(true);
            }
        }, 45000);
        return () => clearTimeout(timer);
    }, []);

    // 50% scroll trigger - fires once, removes itself after triggering or dismissal
    useEffect(() => {
        if (safeGetSessionFlag(POPUP_KEY)) return;
        function onScroll50() {
            // Check inside handler so it sees the key even after dismissal
            if (safeGetSessionFlag(POPUP_KEY)) {
                window.removeEventListener("scroll", onScroll50);
                return;
            }
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight > 0 && window.scrollY / docHeight >= 0.5) {
                setShowNewsletterPopup(true);
                // Remove immediately so further scrolling cannot re-trigger
                window.removeEventListener("scroll", onScroll50);
            }
        }
        window.addEventListener("scroll", onScroll50, { passive: true });
        return () => window.removeEventListener("scroll", onScroll50);
    }, []);

    // Exit-intent popup - mouse leaves viewport through the top
    useEffect(() => {
        function onMouseLeave(e) {
            if (
                e.clientY <= 3 &&
                !safeGetSessionFlag(EXIT_KEY) &&
                !showNewsletterPopup &&
                !showGuideModal
            ) {
                setShowExitPopup(true);
            }
        }
        document.addEventListener("mouseleave", onMouseLeave);
        return () => document.removeEventListener("mouseleave", onMouseLeave);
    }, [showNewsletterPopup, showGuideModal]);

    // Sticky bar - appears after 40 % scroll, once per session
    useEffect(() => {
        if (stickyDismissed) return;
        function onScroll() {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight > 0 && window.scrollY / docHeight > 0.4) {
                setShowStickyBar(true);
            }
        }
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [stickyDismissed]);

    useEffect(() => {
        function handlePopState() {
            const route = getRouteFromUrl(managedPosts);
            setPage(route.page);
            setSelectedArticle(route.article);
            setSelectedResource(route.resource);
            setSelectedCategory(route.category || "All");
            scrollTop();
            trackPageView(window.location.pathname + window.location.search);
        }

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [managedPosts]);

    function scrollTop() {
        window.scrollTo(0, 0);
    }

    function pushRoute(url) {
        window.history.pushState({}, "", url);
        trackPageView(url);
    }

    function goHome() {
        setSelectedArticle(null);
        setSelectedResource(null);
        setSelectedCategory("All");
        setPage("home");
        pushRoute("/");
        scrollTop();
    }

    function goBlog() {
        setSelectedArticle(null);
        setSelectedResource(null);
        setSelectedCategory("All");
        setPage("blog");
        pushRoute("/blog");
        scrollTop();
    }

    function goBlogCategory(category) {
        setSelectedArticle(null);
        setSelectedResource(null);
        setSelectedCategory(category);
        setPage("blog");
        pushRoute(category === "All" ? "/blog" : `/blog/category/${slugifyCategory(category)}`);
        scrollTop();
    }

    function goResources() {
        setSelectedArticle(null);
        setSelectedResource(null);
        setSelectedCategory("All");
        setPage("resources");
        pushRoute("/?page=resources");
        scrollTop();
    }

    function openArticle(post) {
        setSelectedArticle(post);
        setSelectedResource(null);
        setSelectedCategory("All");
        setPage("article");
        pushRoute(`/blog/${post.slug}`);
        scrollTop();
    }

    function openResource(resource) {
        setSelectedArticle(null);
        setSelectedResource(resource);
        setSelectedCategory("All");
        setPage("resource");
        pushRoute(`/?resource=${resource.slug}`);
        scrollTop();
    }

    function openPage(nextPage) {
        setSelectedArticle(null);
        setSelectedResource(null);
        setSelectedCategory("All");
        setPage(nextPage);
        pushRoute(
            nextPage === "blog"
                ? "/blog"
                : nextPage === "blog-manager"
                  ? "/blog-admin"
                  : `/?page=${nextPage}`,
        );
        scrollTop();
    }

    function showNewsletterAlert(payload) {
        const result = saveSubscriber(payload);
        return result;
    }

    function closeNewsletterPopup() {
        setShowNewsletterPopup(false);
        safeSetSessionFlag(POPUP_KEY);
    }

    function closeExitPopup() {
        setShowExitPopup(false);
        safeSetSessionFlag(EXIT_KEY);
    }

    function dismissStickyBar() {
        setShowStickyBar(false);
        setStickyDismissed(true);
        safeSetSessionFlag(STICKY_KEY);
    }

    const isSuccessPage = page === "newsletter-success";

    return (
        <div className="site">
            {/* â”€â”€ Lead capture overlays â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            {showNewsletterPopup && !isSuccessPage && (
                <NewsletterPopup
                    onSubscribe={showNewsletterAlert}
                    onClose={closeNewsletterPopup}
                />
            )}
            {showExitPopup && !isSuccessPage && (
                <ExitIntentPopup
                    onSubscribe={showNewsletterAlert}
                    onClose={closeExitPopup}
                />
            )}
            {showGuideModal && (
                <GuideModal
                    onSubscribe={showNewsletterAlert}
                    onClose={() => setShowGuideModal(false)}
                />
            )}
            {showStickyBar && !stickyDismissed && !isSuccessPage && (
                <StickyNewsletterBar
                    onSubscribe={showNewsletterAlert}
                    onDismiss={dismissStickyBar}
                />
            )}
            {!isSuccessPage && (
                <FloatingNewsletterButton
                    onSubscribe={showNewsletterAlert}
                />
            )}

            <nav className="navbar">
                {mobileMenuOpen && (
                    <div
                        className="nav-mobile-overlay"
                        onClick={() => setMobileMenuOpen(false)}
                        aria-hidden="true"
                    />
                )}
                <button
                    className="brand"
                    onClick={() => { goHome(); setMobileMenuOpen(false); }}
                >
                    <span className="brand-mark">CN</span>
                    <span>Cin Nova</span>
                </button>

                <div className={`nav-links${mobileMenuOpen ? " nav-mobile-open" : ""}`}>
                    <button
                        className="nav-mobile-close"
                        onClick={() => setMobileMenuOpen(false)}
                        aria-label="Close menu"
                    />
                    <button onClick={() => { goHome();                       setMobileMenuOpen(false); }}>Home</button>
                    <button onClick={() => { openPage("products");            setMobileMenuOpen(false); }}>Products</button>
                    <button onClick={() => { goBlog();                       setMobileMenuOpen(false); }}>Blog</button>
                    <button onClick={() => { goResources();                  setMobileMenuOpen(false); }}>Resources</button>
                    <button onClick={() => { openPage("pricing");            setMobileMenuOpen(false); }}>Pricing</button>
                    <button onClick={() => { openPage("about");              setMobileMenuOpen(false); }}>About</button>
                    <button onClick={() => { openPage("advertise");          setMobileMenuOpen(false); }}>Advertise</button>
                    <button onClick={() => { openPage("partnerships");       setMobileMenuOpen(false); }}>Partnerships</button>
                    <button onClick={() => { openPage("media-kit");          setMobileMenuOpen(false); }}>Media Kit</button>
                    <button onClick={() => { openPage("press-center");        setMobileMenuOpen(false); }}>Press</button>
                    <button onClick={() => { openPage("contact");            setMobileMenuOpen(false); }}>Contact</button>
                    <button onClick={() => { openPage("newsletter");         setMobileMenuOpen(false); }}>Newsletter</button>
                    <button onClick={() => { openPage("partners");           setMobileMenuOpen(false); }}>Partners</button>
                </div>

                <div className="nav-right">
                    <button className="nav-cta" onClick={() => { openPage("pricing"); setMobileMenuOpen(false); }}>
                        See Plans
                    </button>
                    <button
                        className="hamburger-btn"
                        onClick={() => setMobileMenuOpen((prev) => !prev)}
                        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileMenuOpen}
                        aria-controls="nav-links"
                    >
                        <span className={`ham-bar${mobileMenuOpen ? " ham-open" : ""}`} />
                        <span className={`ham-bar${mobileMenuOpen ? " ham-open" : ""}`} />
                        <span className={`ham-bar${mobileMenuOpen ? " ham-open" : ""}`} />
                    </button>
                </div>
            </nav>

            {page === "home" && (
                <HomePage
                    products={products}
                    productDetails={productDetails}
                    posts={publishedPosts}
                    onNavigate={openPage}
                    onOpenArticle={openArticle}
                    onOpenResource={openResource}
                    onGoResources={goResources}
                    onGoBlog={goBlog}
                    onSubscribe={showNewsletterAlert}
                />
            )}
            {page === "products" && (
                <ProductsPage
                    onNavigate={openPage}
                    onSubscribe={showNewsletterAlert}
                />
            )}
            {page === "blog" && (
                <Blog
                    posts={publishedPosts}
                    onOpenArticle={openArticle}
                    onSubscribe={showNewsletterAlert}
                    onOpenGuide={() => setShowGuideModal(true)}
                    onNavigate={openPage}
                    activeCategory={selectedCategory}
                    onOpenCategory={goBlogCategory}
                />
            )}
            {page === "blog-manager" && (
                <BlogManager posts={managedPosts} onPostsChange={setManagedPosts} />
            )}
            {page === "resources" && (
                <Resources onOpenResource={openResource} onSubscribe={showNewsletterAlert} />
            )}
            {page === "article" && selectedArticle && (
                <ArticleErrorBoundary onBack={goBlog}>
                    <ArticlePage
                        post={selectedArticle}
                        posts={publishedPosts}
                        onBack={goBlog}
                        onOpenArticle={openArticle}
                        onOpenResource={openResource}
                        onSubscribe={showNewsletterAlert}
                        onNavigate={openPage}
                    />
                </ArticleErrorBoundary>
            )}
            {page === "resource" && selectedResource && (
                <ResourcePage
                    resource={selectedResource}
                    resources={resources}
                    onBack={goResources}
                    onOpenResource={openResource}
                    onSubscribe={showNewsletterAlert}
                    onNavigate={openPage}
                    onOpenArticle={openArticle}
                />
            )}
            {page === "pricing" && <Pricing />}
            {page === "about" && <About onNavigate={openPage} />}
            {page === "contact" && <Contact />}
            {page === "privacy" && <PrivacyPolicy onNavigate={openPage} />}
            {page === "terms" && <TermsOfService onNavigate={openPage} />}
            {page === "partners" && <Partners onSubscribe={showNewsletterAlert} />}
            {page === "media-kit" && <MediaKit onNavigate={openPage} />}
            {page === "advertise" && <Advertise onNavigate={openPage} />}
            {page === "partnerships" && <Partnerships onNavigate={openPage} />}
            {page === "press-center" && <PressCenter onNavigate={openPage} />}
            {page === "partner-with-us" && <PartnerWithUs onNavigate={openPage} />}
            {page === "sponsor-newsletter" && <SponsorNewsletter onNavigate={openPage} />}
            {page === "newsletter" && (
                <NewsletterPage
                    onSubscribe={showNewsletterAlert}
                />
            )}
            {page === "newsletter-admin" && <NewsletterAdmin />}
            {page === "newsletter-success" && (
                <NewsletterSuccess onGoHome={goHome} onGoBlog={goBlog} />
            )}

            {page === "studynest" && (
                <>
                    <div className="back-bar">
                        <button onClick={goHome}>Back to Cin Nova</button>
                        <button type="button" className="back-bar-secondary" onClick={() => openPage("products")}>
                            All Products
                        </button>
                    </div>
                    <StudyNest />
                    <ProductEcosystemSection currentPage="studynest" onNavigate={openPage} />
                </>
            )}

            {page === "poisonguard" && (
                <>
                    <div className="back-bar">
                        <button onClick={goHome}>Back to Cin Nova</button>
                        <button type="button" className="back-bar-secondary" onClick={() => openPage("products")}>
                            All Products
                        </button>
                    </div>
                    <PoisonGuard />
                    <ProductEcosystemSection currentPage="poisonguard" onNavigate={openPage} />
                </>
            )}

            {page === "real-estate" && (
                <>
                    <div className="back-bar">
                        <button onClick={goHome}>Back to Cin Nova</button>
                        <button type="button" className="back-bar-secondary" onClick={() => openPage("products")}>
                            All Products
                        </button>
                    </div>
                    <RealEstate />
                    <ProductEcosystemSection currentPage="real-estate" onNavigate={openPage} />
                </>
            )}

            {page === "techmate" && (
                <>
                    <div className="back-bar">
                        <button onClick={goHome}>Back to Cin Nova</button>
                        <button type="button" className="back-bar-secondary" onClick={() => openPage("products")}>
                            All Products
                        </button>
                    </div>
                    <TechMateAI />
                    <ProductEcosystemSection currentPage="techmate" onNavigate={openPage} />
                </>
            )}

            {page === "kiddo" && (
                <>
                    <div className="back-bar">
                        <button onClick={goHome}>Back to Cin Nova</button>
                        <button type="button" className="back-bar-secondary" onClick={() => openPage("products")}>
                            All Products
                        </button>
                    </div>
                    <Kiddo />
                    <ProductEcosystemSection currentPage="kiddo" onNavigate={openPage} />
                </>
            )}

            <SiteFooter
                onNavigate={openPage}
                onGoBlog={goBlog}
                onGoResources={goResources}
                onGoHome={goHome}
            />
        </div>
    );
}

export default App;
