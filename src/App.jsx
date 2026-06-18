import { useEffect, useState } from "react";
import "./App.css";
import StudyNest from "./pages/StudyNest.jsx";
import PoisonGuard from "./pages/PoisonGuard.jsx";
import RealEstate from "./pages/RealEstate.jsx";
import TechMateAI from "./pages/TechMateAI.jsx";
import Kiddo from "./pages/Kiddo.jsx";
import Pricing from "./pages/Pricing.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
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
import FloatingNewsletterButton from "./components/FloatingNewsletterButton.jsx";
import HomepageCTABanner from "./components/HomepageCTABanner.jsx";
import NewsletterSignup from "./components/NewsletterSignup.jsx";
import NewsletterPopup from "./components/NewsletterPopup.jsx";
import ExitIntentPopup from "./components/ExitIntentPopup.jsx";
import GuideModal from "./components/GuideModal.jsx";
import StickyNewsletterBar from "./components/StickyNewsletterBar.jsx";
import {
    getManagedPostBySlug,
    getManagedPosts,
    getPublishedPosts,
} from "./data/blogManagerService.js";
import { getResourceBySlug, resources } from "./data/resources.js";
import { getDisplaySubscriberCount, saveSubscriber } from "./data/newsletterService.js";
import { safeGetSessionFlag, safeSetSessionFlag } from "./utils/security.js";
import { getCategoryBySlug, slugifyCategory } from "./data/blogPosts.js";

const products = [
    {
        name: "StudyNest",
        category: "Education AI",
        icon: "SN",
        status: "In Development",
        description:
            "AI-powered study tools with notes, flashcards, quizzes, study guides, tutoring, planner support, and future stylus note-taking.",
        page: "studynest",
    },
    {
        name: "PoisonGuard",
        category: "Safety Technology",
        icon: "PG",
        status: "In Development",
        description:
            "A poison and chemical safety assistant for families, pets, schools, and future public safety use.",
        page: "poisonguard",
    },
    {
        name: "Kiddo",
        category: "Early Learning",
        icon: "KD",
        status: "Concept Stage",
        description:
            "A playful early-learning platform for ABCs, reading, writing, counting, math, characters, levels, and rewards.",
        page: "kiddo",
    },
    {
        name: "TechMate AI",
        category: "Tech Support AI",
        icon: "TM",
        status: "Concept Stage",
        description:
            "An AI troubleshooting assistant for phones, computers, software, apps, smart devices, and everyday tech problems.",
        page: "techmate",
    },
    {
        name: "Cin Nova Real Estate",
        category: "Real Estate AI",
        icon: "RE",
        status: "Active Build",
        description:
            "AI tools for property analysis, deal evaluation, mortgage estimates, cash flow, commercial real estate, land, and development intelligence.",
        page: "real-estate",
    },
];

const ecosystemShowcases = [
    {
        name: "StudyNest",
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

function DashboardCard({ icon, title, tag, stats }) {
    return (
        <div className="dashboard-card">
            <div className="dashboard-header">
                <h3>
                    <span className="dashboard-icon">{icon}</span>
                    {title}
                </h3>
                <span>{tag}</span>
            </div>

            <div className="dashboard-stats">
                {stats.map((stat) => (
                    <div key={stat.label}>
                        <strong>{stat.value}</strong>
                        <p>{stat.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function EcosystemShowcase({ showcase, index }) {
    return (
        <article className={`ecosystem-showcase-row ${index % 2 === 1 ? "is-reversed" : ""}`}>
            <div className="ecosystem-copy">
                <p className="product-category">{showcase.category}</p>
                <h3>{showcase.name}</h3>
                <p>{showcase.summary}</p>

                <div className="showcase-feature-list">
                    {showcase.features.map((feature) => (
                        <span key={feature}>{feature}</span>
                    ))}
                </div>
            </div>

            <div className={`showcase-mockup showcase-mockup-${showcase.accent}`}>
                <div className="mockup-topbar">
                    <div>
                        <span />
                        <span />
                        <span />
                    </div>
                    <p>{showcase.panelTitle}</p>
                </div>

                <div className="mockup-body">
                    <aside className="mockup-sidebar">
                        <strong>CN</strong>
                        {showcase.chartLabels.map((label) => (
                            <span key={label}>{label}</span>
                        ))}
                    </aside>

                    <div className="mockup-main">
                        <div className="mockup-metric-card">
                            <p>{showcase.metricLabel}</p>
                            <strong>{showcase.metric}</strong>
                        </div>

                        <div className="mockup-activity-card">
                            <p>Latest activity</p>
                            <strong>{showcase.activity}</strong>
                        </div>

                        <div className="mockup-chart-card">
                            {showcase.bars.map((bar, barIndex) => (
                                <div key={showcase.chartLabels[barIndex]} className="mockup-bar-row">
                                    <span>{showcase.chartLabels[barIndex]}</span>
                                    <div>
                                        <i style={{ width: `${bar}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}

function HomePage({ posts, setPage, onOpenArticle, onSubscribe, subscriberCount, onGoBlog }) {
    const latestPosts = posts.slice(0, 3);

    function openProduct(page) {
        setPage(page);
        window.scrollTo(0, 0);
    }

    return (
        <main>
            <section className="hero">
                <div>
                    <p className="eyebrow">SOFTWARE - AI - EDUCATION - SAFETY - REAL ESTATE</p>
                    <h1>One AI ecosystem for real-world problems.</h1>
                    <p className="hero-text">
                        Cin Nova builds practical AI products for learning, safety, technology,
                        real estate, and everyday decision-making.
                    </p>

                    <div className="hero-actions">
                        <a href="#products" className="primary-btn">
                            Explore Products
                        </a>
                        <button className="secondary-btn" onClick={onGoBlog}>
                            Start Reading
                        </button>
                        <button className="secondary-btn" onClick={() => setPage("resources")}>
                            View Resources
                        </button>
                        <button className="secondary-btn" onClick={() => openProduct("pricing")}>
                            View Pricing
                        </button>
                    </div>

                    <div className="hero-stats">
                        <div>
                            <strong>5</strong>
                            <span>Platforms</span>
                        </div>
                        <div>
                            <strong>100+</strong>
                            <span>Planned Features</span>
                        </div>
                        <div>
                            <strong>1</strong>
                            <span>Unified Ecosystem</span>
                        </div>
                    </div>
                </div>

                <div className="hero-panel">
                    <h3>Cin Nova Ecosystem</h3>
                    {products.map((product) => (
                        <div className="ecosystem-item" key={product.name}>
                            <span>{product.icon}</span>
                            <div>
                                <strong>{product.name}</strong>
                                <p>{product.category}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="section" id="products">
                <div className="section-heading">
                    <p className="eyebrow">PRODUCT SHOWCASE</p>
                    <h2>Apps and platforms under the Cin Nova brand</h2>
                    <p>
                        Each product solves a different problem while supporting the larger
                        Cin Nova ecosystem.
                    </p>
                </div>

                <div className="product-grid">
                    {products.map((product) => (
                        <article className="product-card" key={product.name}>
                            <div className="product-icon">{product.icon}</div>
                            <p className="product-category">{product.category}</p>
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <p className="product-category">Status: {product.status}</p>
                            <button onClick={() => openProduct(product.page)}>
                                {getButtonLabel(product.page)}
                            </button>
                        </article>
                    ))}
                </div>
            </section>

            <section className="section ecosystem-showcase-section">
                <div className="section-heading">
                    <p className="eyebrow">PRODUCT SHOWCASE</p>
                    <h2>Inside the Cin Nova Ecosystem</h2>
                    <p>
                        Dashboard-style previews of how each product can feel as part of one
                        connected AI software family.
                    </p>
                </div>

                <div className="ecosystem-showcase-stack">
                    {ecosystemShowcases.map((showcase, index) => (
                        <EcosystemShowcase
                            key={showcase.name}
                            showcase={showcase}
                            index={index}
                        />
                    ))}
                </div>
            </section>

            <section className="section showcase-section">
                <div className="section-heading">
                    <p className="eyebrow">PRODUCT DASHBOARDS</p>
                    <h2>Software previews built for the Cin Nova ecosystem</h2>
                    <p>
                        These dashboard mockups show how each platform can look as the products
                        continue to develop.
                    </p>
                </div>

                <div className="dashboard-grid">
                    <DashboardCard
                        icon="SN"
                        title="StudyNest"
                        tag="AI Learning"
                        stats={[
                            { value: "87%", label: "Progress" },
                            { value: "120", label: "Flashcards" },
                            { value: "42", label: "Quizzes" },
                            { value: "AI", label: "Tutor Active" },
                        ]}
                    />

                    <DashboardCard
                        icon="PG"
                        title="PoisonGuard"
                        tag="Scanner Ready"
                        stats={[
                            { value: "94", label: "Safety Score" },
                            { value: "Scan", label: "Product Check" },
                            { value: "Guide", label: "Emergency Help" },
                            { value: "DB", label: "Hazard Lookup" },
                        ]}
                    />

                    <DashboardCard
                        icon="RE"
                        title="Real Estate AI"
                        tag="Market Analysis"
                        stats={[
                            { value: "92", label: "Deal Score" },
                            { value: "$645", label: "Cash Flow" },
                            { value: "8.1%", label: "Cap Rate" },
                            { value: "A+", label: "Market Grade" },
                        ]}
                    />

                    <DashboardCard
                        icon="TM"
                        title="TechMate AI"
                        tag="Diagnostics"
                        stats={[
                            { value: "98%", label: "Device Health" },
                            { value: "24/7", label: "AI Help" },
                            { value: "WiFi", label: "Network Tools" },
                            { value: "Apps", label: "Troubleshooting" },
                        ]}
                    />
                </div>
            </section>

            <section className="section">
                <div className="section-heading">
                    <p className="eyebrow">GROWTH TIMELINE</p>
                    <h2>The future of the Cin Nova ecosystem</h2>
                    <p>
                        Cin Nova is being built as a long-term software company with consumer,
                        business, education, real estate, and public safety opportunities.
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

            <section className="section blog-section" id="blog">
                <div className="section-heading">
                    <p className="eyebrow">LATEST ARTICLES</p>
                    <h2>Read the newest Cin Nova articles.</h2>
                    <p>
                        Guides and ideas that promote the apps, grow traffic, and build a
                        useful public knowledge base around the company.
                    </p>
                </div>

                <div className="article-grid">
                    {latestPosts.map((post) => (
                        <article
                            className="article-card article-card-clickable"
                            key={post.id}
                            onClick={() => onOpenArticle(post)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") onOpenArticle(post);
                            }}
                        >
                            <span>{post.category}</span>
                            <h3>{post.title}</h3>
                            <p>{post.excerpt}</p>
                            <a
                                href={`/blog/${post.slug}`}
                                className="article-card-action"
                                onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    onOpenArticle(post);
                                }}
                            >
                                Read Article
                            </a>
                        </article>
                    ))}
                </div>

                <div className="section-action">
                    <button className="primary-btn" onClick={onGoBlog}>
                        Start Reading
                    </button>
                </div>
            </section>

            <HomepageCTABanner
                subscriberCount={subscriberCount}
                onSubscribe={onSubscribe}
            />

            <section className="section" id="newsletter">
                <div className="newsletter-card">
                    <p className="eyebrow">JOIN THE NEWSLETTER</p>
                    <h2>Get product updates, blog posts, and launch announcements.</h2>
                    <NewsletterSignup
                        onSubscribe={onSubscribe}
                        source="Homepage"
                        tags={["Homepage", "Product Updates"]}
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

    // Lead capture state
    const [subscriberCount, setSubscriberCount] = useState(getDisplaySubscriberCount);
    const [showNewsletterPopup, setShowNewsletterPopup] = useState(false);
    const [showExitPopup, setShowExitPopup] = useState(false);
    const [showGuideModal, setShowGuideModal] = useState(false);
    const [showStickyBar, setShowStickyBar] = useState(false);
    const [stickyDismissed, setStickyDismissed] = useState(
        () => safeGetSessionFlag(STICKY_KEY)
    );

    // Timed newsletter popup — fires once per session after 45 s
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

    // 50% scroll trigger — fires once, removes itself after triggering or dismissal
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

    // Exit-intent popup — mouse leaves viewport through the top
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

    // Sticky bar — appears after 40 % scroll, once per session
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
        }

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [managedPosts]);

    function scrollTop() {
        window.scrollTo(0, 0);
    }

    function pushRoute(url) {
        window.history.pushState({}, "", url);
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
        setSubscriberCount(getDisplaySubscriberCount());
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
            {/* ── Lead capture overlays ───────────────────────── */}
            {showNewsletterPopup && !isSuccessPage && (
                <NewsletterPopup
                    onSubscribe={showNewsletterAlert}
                    onClose={closeNewsletterPopup}
                    subscriberCount={subscriberCount}
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
                    subscriberCount={subscriberCount}
                />
            )}
            {!isSuccessPage && (
                <FloatingNewsletterButton
                    onSubscribe={showNewsletterAlert}
                    subscriberCount={subscriberCount}
                />
            )}

            <nav className="navbar">
                <button className="brand" onClick={goHome}>
                    <span className="brand-mark">CN</span>
                    <span>Cin Nova</span>
                </button>

                <div className="nav-links">
                    <button onClick={goHome}>Home</button>
                    <button onClick={goHome}>Products</button>
                    <button onClick={goBlog}>Blog</button>
                    <button onClick={goResources}>Resources</button>
                    <button onClick={() => openPage("blog-manager")}>Blog Admin</button>
                    <button onClick={() => openPage("pricing")}>Pricing</button>
                    <button onClick={() => openPage("about")}>About</button>
                    <button onClick={() => openPage("contact")}>Contact</button>
                    <button onClick={() => openPage("newsletter")}>Newsletter</button>
                    <button onClick={() => openPage("partners")}>Partners</button>
                    <button onClick={() => openPage("media-kit")}>Media Kit</button>
                    <button onClick={() => openPage("newsletter-admin")}>Admin</button>
                </div>

                <button className="nav-cta" onClick={() => openPage("pricing")}>
                    See Plans
                </button>
            </nav>

            {page === "home" && (
                <HomePage
                    posts={publishedPosts}
                    setPage={openPage}
                    onOpenArticle={openArticle}
                    onSubscribe={showNewsletterAlert}
                    subscriberCount={subscriberCount}
                    onGoBlog={goBlog}
                />
            )}
            {page === "blog" && (
                <Blog
                    posts={publishedPosts}
                    onOpenArticle={openArticle}
                    onSubscribe={showNewsletterAlert}
                    subscriberCount={subscriberCount}
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
                <ArticlePage
                    post={selectedArticle}
                    posts={publishedPosts}
                    onBack={goBlog}
                    onOpenArticle={openArticle}
                    onSubscribe={showNewsletterAlert}
                    subscriberCount={subscriberCount}
                    onNavigate={openPage}
                />
            )}
            {page === "resource" && selectedResource && (
                <ResourcePage
                    resource={selectedResource}
                    resources={resources}
                    onBack={goResources}
                    onOpenResource={openResource}
                    onSubscribe={showNewsletterAlert}
                />
            )}
            {page === "pricing" && <Pricing />}
            {page === "about" && <About />}
            {page === "contact" && <Contact />}
            {page === "partners" && <Partners onSubscribe={showNewsletterAlert} />}
            {page === "media-kit" && <MediaKit onNavigate={openPage} />}
            {page === "newsletter" && (
                <NewsletterPage
                    onSubscribe={showNewsletterAlert}
                    subscriberCount={subscriberCount}
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
                    </div>
                    <StudyNest />
                </>
            )}

            {page === "poisonguard" && (
                <>
                    <div className="back-bar">
                        <button onClick={goHome}>Back to Cin Nova</button>
                    </div>
                    <PoisonGuard />
                </>
            )}

            {page === "real-estate" && (
                <>
                    <div className="back-bar">
                        <button onClick={goHome}>Back to Cin Nova</button>
                    </div>
                    <RealEstate />
                </>
            )}

            {page === "techmate" && (
                <>
                    <div className="back-bar">
                        <button onClick={goHome}>Back to Cin Nova</button>
                    </div>
                    <TechMateAI />
                </>
            )}

            {page === "kiddo" && (
                <>
                    <div className="back-bar">
                        <button onClick={goHome}>Back to Cin Nova</button>
                    </div>
                    <Kiddo />
                </>
            )}

            <footer className="footer site-footer">
                <div>
                    <button className="brand footer-brand" onClick={goHome}>
                        <span className="brand-mark">CN</span>
                        <span>Cin Nova</span>
                    </button>
                    <p>
                        Public company website, app hub, and technology blog for the
                        Cin Nova software ecosystem.
                    </p>
                    <p className="footer-subscriber-count">
                        {subscriberCount.toLocaleString()}+ subscribers and counting.
                    </p>
                </div>

                <div className="footer-links">
                    <button onClick={goHome}>Products</button>
                    <button onClick={goBlog}>Blog</button>
                    <button onClick={goResources}>Resources</button>
                    <button onClick={() => openPage("blog-manager")}>Blog Admin</button>
                    <button onClick={() => openPage("pricing")}>Pricing</button>
                    <button onClick={() => openPage("about")}>About</button>
                    <button onClick={() => openPage("contact")}>Contact</button>
                    <button onClick={() => openPage("newsletter")}>Newsletter</button>
                    <button onClick={() => openPage("partners")}>Partners</button>
                    <button onClick={() => openPage("media-kit")}>Media Kit</button>
                    <button onClick={() => openPage("newsletter-admin")}>Newsletter Admin</button>
                </div>

                <p className="footer-bottom">(c) 2026 Cin Nova. All Rights Reserved.</p>
            </footer>
        </div>
    );
}

export default App;
