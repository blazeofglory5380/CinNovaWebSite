import { Component, useEffect, useState } from "react";
import "./App.css";
import HomePage from "./pages/HomePage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import StudyNest from "./pages/StudyNest.jsx";
import PoisonGuard from "./pages/PoisonGuard.jsx";
import RealEstate from "./pages/RealEstate.jsx";
import TechMateAI from "./pages/TechMateAI.jsx";
// Experiment-branch-only preview of the TechMate hero animation prototype.
import TechMateHero from "./prototypes/techmate-hero-animation/TechMateHero.prototype.jsx";
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
import NotFound from "./pages/NotFound.jsx";
import SiteFooter from "./components/SiteFooter.jsx";
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
import { getCategoryBySlug, slugifyCategory } from "./data/blogPosts.js";
import { VALID_PAGE_KEYS } from "./data/seoConfig.js";
import { trackPageView } from "./utils/analytics.js";
import { productDetails, products } from "./data/products.js";
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
        return { page: "not-found", article: null, resource: null, category: null };
    }

    if (articleSlug) {
        const post = getManagedPostBySlug(articleSlug, posts);
        if (post) return { page: "article", article: post, resource: null, category: null };
        return { page: "not-found", article: null, resource: null, category: null };
    }

    if (resourceSlug) {
        const resource = getResourceBySlug(resourceSlug);
        if (resource) return { page: "resource", article: null, resource, category: null };
        return { page: "not-found", article: null, resource: null, category: null };
    }

    // Experiment-branch-only preview route for the TechMate hero animation
    // prototype. Handled here (not via VALID_PAGE_KEYS) so SEO config, the
    // sitemap, and production routing stay untouched.
    if (routedPage === "techmate-hero-prototype") {
        return { page: "techmate-hero-prototype", article: null, resource: null, category: null };
    }

    if (routedPage) {
        if (VALID_PAGE_KEYS.has(routedPage)) {
            return { page: routedPage, article: null, resource: null, category: null };
        }
        return { page: "not-found", article: null, resource: null, category: null };
    }

    const isKnownPath =
        path === "/" ||
        path === "/blog" ||
        path === "/blog-admin" ||
        path.startsWith("/blog/");

    if (!isKnownPath) {
        return { page: "not-found", article: null, resource: null, category: null };
    }

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

    // Track SPA page views whenever the routed view changes.
    useEffect(() => {
        trackPageView(window.location.pathname + window.location.search);
    }, [page, selectedArticle?.slug, selectedResource?.slug]);

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
                    <span>CinNova</span>
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
                        <button onClick={goHome}>Back to CinNova</button>
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
                        <button onClick={goHome}>Back to CinNova</button>
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
                        <button onClick={goHome}>Back to CinNova</button>
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
                        <button onClick={goHome}>Back to CinNova</button>
                        <button type="button" className="back-bar-secondary" onClick={() => openPage("products")}>
                            All Products
                        </button>
                    </div>
                    <TechMateAI />
                    <ProductEcosystemSection currentPage="techmate" onNavigate={openPage} />
                </>
            )}

            {/* Experiment-branch-only preview of the TechMate hero animation
                prototype. Not a production route; not in the sitemap/SEO. */}
            {page === "techmate-hero-prototype" && (
                <>
                    <div className="back-bar">
                        <button onClick={goHome}>Back to CinNova</button>
                        <button type="button" className="back-bar-secondary" onClick={() => openPage("techmate")}>
                            Live TechMate
                        </button>
                    </div>
                    <TechMateHero primaryHref="#waitlist" secondaryHref="#waitlist" />
                </>
            )}

            {page === "kiddo" && (
                <>
                    <div className="back-bar">
                        <button onClick={goHome}>Back to CinNova</button>
                        <button type="button" className="back-bar-secondary" onClick={() => openPage("products")}>
                            All Products
                        </button>
                    </div>
                    <Kiddo />
                    <ProductEcosystemSection currentPage="kiddo" onNavigate={openPage} />
                </>
            )}

            {page === "not-found" && <NotFound onGoHome={goHome} />}

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
