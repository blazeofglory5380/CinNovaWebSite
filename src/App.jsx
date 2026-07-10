import { Component, useEffect, useState } from "react";
import "./App.css";
import HomePage from "./pages/HomePage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import StudyNest from "./pages/StudyNest.jsx";
import PoisonGuard from "./pages/PoisonGuard.jsx";
import RealEstate from "./pages/RealEstate.jsx";
import TechMateAI from "./pages/TechMateAI.jsx";
import Kiddo from "./pages/Kiddo.jsx";
import Pricing from "./pages/Pricing.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import FreeRentalCalculator from "./pages/FreeRentalCalculator.jsx";
import AiTutorialsPage from "./pages/AiTutorialsPage.jsx";
import AIPromptGuide from "./pages/AIPromptGuide.jsx";
import AIPromptGuideES from "./pages/AIPromptGuideES.jsx";
import AIPromptGuideFR from "./pages/AIPromptGuideFR.jsx";
import AIPromptGuideDE from "./pages/AIPromptGuideDE.jsx";
import AIResearchGuide from "./pages/AIResearchGuide.jsx";
import AIResearchGuideES from "./pages/AIResearchGuideES.jsx";
import AIResearchGuideFR from "./pages/AIResearchGuideFR.jsx";
import AIResearchGuideDE from "./pages/AIResearchGuideDE.jsx";
import AICodingGuide from "./pages/AICodingGuide.jsx";
import AICodingGuideES from "./pages/AICodingGuideES.jsx";
import AICodingGuideFR from "./pages/AICodingGuideFR.jsx";
import AICodingGuideDE from "./pages/AICodingGuideDE.jsx";
import AIWorkspaceSetupGuide from "./pages/AIWorkspaceSetupGuide.jsx";
import HiggsfieldAIVideoSetupGuide from "./pages/HiggsfieldAIVideoSetupGuide.jsx";
import RunwayAIVideoGuide from "./pages/RunwayAIVideoGuide.jsx";
import HiggsfieldRunwayGoogleFlowComparison from "./pages/HiggsfieldRunwayGoogleFlowComparison.jsx";
import CinNovaCinematicAssetLibraryGuide from "./pages/CinNovaCinematicAssetLibraryGuide.jsx";
import HiggsfieldWebsiteHeroVideoGuide from "./pages/HiggsfieldWebsiteHeroVideoGuide.jsx";
import ChatGPTBeginnerGuide from "./pages/ChatGPTBeginnerGuide.jsx";
import ClaudeBeginnerGuide from "./pages/ClaudeBeginnerGuide.jsx";
import GeminiBeginnerGuide from "./pages/GeminiBeginnerGuide.jsx";
import MicrosoftCopilotBeginnerGuide from "./pages/MicrosoftCopilotBeginnerGuide.jsx";
import PerplexityBeginnerGuide from "./pages/PerplexityBeginnerGuide.jsx";
import CursorBeginnerGuide from "./pages/CursorBeginnerGuide.jsx";
import ReplitBeginnerGuide from "./pages/ReplitBeginnerGuide.jsx";
import CanvaAIBeginnerGuide from "./pages/CanvaAIBeginnerGuide.jsx";
import ClaudeWithAdobeGuide from "./pages/ClaudeWithAdobeGuide.jsx";
import ClaudeWebsiteDesignGuide from "./pages/ClaudeWebsiteDesignGuide.jsx";
import ClaudeArtPromptsGuide from "./pages/ClaudeArtPromptsGuide.jsx";
import ClaudeBrandingMarketingGuide from "./pages/ClaudeBrandingMarketingGuide.jsx";
import ClaudeWithCanvaGuide from "./pages/ClaudeWithCanvaGuide.jsx";
import ClaudeWithFigmaGuide from "./pages/ClaudeWithFigmaGuide.jsx";
import ClaudeWithCursorGuide from "./pages/ClaudeWithCursorGuide.jsx";
import ClaudeWithHiggsfieldGuide from "./pages/ClaudeWithHiggsfieldGuide.jsx";
import Languages from "./pages/Languages.jsx";
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
import { ADMIN_PAGE_KEYS, VALID_PAGE_KEYS } from "./data/seoConfig.js";
import { trackPageView, trackEvent } from "./utils/analytics.js";
import { productDetails, products } from "./data/products.js";
import ProductEcosystemSection from "./components/ProductEcosystemSection.jsx";
import NavMoreMenu from "./components/NavMoreMenu.jsx";
import { useNavHeight, useScrollReveal, useStickyNav } from "./ui/index.js";

// Admin/internal routes (BlogManager, NewsletterAdmin) are disabled by default.
// Enable only for local dev via VITE_ENABLE_ADMIN_ROUTES=true; leave unset/false
// in production unless the pages are protected by real authentication.
const ADMIN_ROUTES_ENABLED = import.meta.env.VITE_ENABLE_ADMIN_ROUTES === "true";

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
        if (!ADMIN_ROUTES_ENABLED) {
            return { page: "not-found", article: null, resource: null, category: null };
        }
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

    if (routedPage) {
        if (!ADMIN_ROUTES_ENABLED && ADMIN_PAGE_KEYS.has(routedPage)) {
            return { page: "not-found", article: null, resource: null, category: null };
        }
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

    // Frosted nav gains a subtle shadow once the page scrolls off the top.
    const navScrolled = useStickyNav();

    // Publishes the measured nav height as `--cn-nav-height` so fixed elements
    // (e.g. the article reading progress bar) can sit flush beneath the nav.
    useNavHeight();

    // Re-scan for `.reveal-on-scroll` targets whenever the routed view swaps,
    // since this router mounts pages without remounting the shell.
    useScrollReveal([page, selectedArticle?.slug, selectedResource?.slug, selectedCategory]);

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
    // The sticky newsletter bar is redundant on pages whose primary purpose is
    // newsletter signup, so suppress it there (keep it on marketing/product/blog).
    const isNewsletterFocusedPage =
        page === "newsletter" || page === "sponsor-newsletter" || isSuccessPage;
    // Also suppress the sticky bar on pages that already have their own strong
    // conversion CTAs (e.g. Pricing), where it is redundant and overlaps content.
    const hideStickyBar = isNewsletterFocusedPage || page === "pricing" || page === "media-kit";

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
            {showStickyBar && !stickyDismissed && !hideStickyBar && (
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

            <nav className={`navbar glass-nav sticky-nav${navScrolled ? " is-scrolled" : ""}`}>
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
                    {/* Primary links — always inline on desktop */}
                    <button onClick={() => { goHome();                       setMobileMenuOpen(false); }}>Home</button>
                    <button onClick={() => { openPage("products");            setMobileMenuOpen(false); }}>Products</button>
                    <button onClick={() => { openPage("pricing");            setMobileMenuOpen(false); }}>Pricing</button>
                    <button onClick={() => { goResources();                  setMobileMenuOpen(false); }}>Resources</button>
                    <button onClick={() => { goBlog();                       setMobileMenuOpen(false); }}>Blog</button>
                    <button onClick={() => { openPage("about");              setMobileMenuOpen(false); }}>About</button>
                    <button className="nav-languages" onClick={() => { trackEvent("language_header_click", { source: "header" }); openPage("languages"); setMobileMenuOpen(false); }} aria-label="Languages">
                        <span aria-hidden="true">🌐</span> Languages
                    </button>
                    {/* Secondary links — "More" dropdown on desktop, flat on mobile */}
                    <NavMoreMenu
                        items={[
                            { label: "AI Tutorials", onSelect: () => { openPage("ai-tutorials"); setMobileMenuOpen(false); } },
                            { label: "Free Rental Calculator", onSelect: () => { openPage("free-rental-property-calculator"); setMobileMenuOpen(false); } },
                            { label: "Contact",         onSelect: () => { openPage("contact");         setMobileMenuOpen(false); } },
                            { label: "Partners",        onSelect: () => { openPage("partners");        setMobileMenuOpen(false); } },
                            { label: "Partner With Us", onSelect: () => { openPage("partner-with-us"); setMobileMenuOpen(false); } },
                            { label: "Media Kit",       onSelect: () => { openPage("media-kit");       setMobileMenuOpen(false); } },
                            { label: "Advertise",       onSelect: () => { openPage("advertise");       setMobileMenuOpen(false); } },
                            { label: "Partnerships",    onSelect: () => { openPage("partnerships");    setMobileMenuOpen(false); } },
                            { label: "Press Center",    onSelect: () => { openPage("press-center");    setMobileMenuOpen(false); } },
                        ]}
                    />
                </div>

                <div className="nav-right">
                    <button className="nav-cta hover-lift glow-button" onClick={() => { openPage("pricing"); setMobileMenuOpen(false); }}>
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
            {ADMIN_ROUTES_ENABLED && page === "blog-manager" && (
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
            {page === "free-rental-property-calculator" && <FreeRentalCalculator />}
            {page === "ai-tutorials" && <AiTutorialsPage />}
            {page === "ai-prompt-writing-guide" && <AIPromptGuide />}
            {page === "ai-prompt-writing-guide-es" && <AIPromptGuideES />}
            {page === "ai-prompt-writing-guide-fr" && <AIPromptGuideFR />}
            {page === "ai-prompt-writing-guide-de" && <AIPromptGuideDE />}
            {page === "ai-research-guide" && <AIResearchGuide />}
            {page === "ai-research-guide-es" && <AIResearchGuideES />}
            {page === "ai-research-guide-fr" && <AIResearchGuideFR />}
            {page === "ai-research-guide-de" && <AIResearchGuideDE />}
            {page === "ai-coding-guide" && <AICodingGuide />}
            {page === "ai-coding-guide-es" && <AICodingGuideES />}
            {page === "ai-coding-guide-fr" && <AICodingGuideFR />}
            {page === "ai-coding-guide-de" && <AICodingGuideDE />}
            {page === "ai-workspace-setup-guide" && <AIWorkspaceSetupGuide />}
            {page === "higgsfield-ai-video-setup-guide" && <HiggsfieldAIVideoSetupGuide />}
            {page === "runway-ai-video-guide" && <RunwayAIVideoGuide />}
            {page === "higgsfield-vs-runway-vs-google-flow" && <HiggsfieldRunwayGoogleFlowComparison />}
            {page === "cinnova-cinematic-asset-library-guide" && <CinNovaCinematicAssetLibraryGuide />}
            {page === "higgsfield-website-hero-video-guide" && <HiggsfieldWebsiteHeroVideoGuide />}
            {page === "chatgpt-beginner-guide" && <ChatGPTBeginnerGuide />}
            {page === "claude-beginner-guide" && <ClaudeBeginnerGuide />}
            {page === "gemini-beginner-guide" && <GeminiBeginnerGuide />}
            {page === "microsoft-copilot-beginner-guide" && <MicrosoftCopilotBeginnerGuide />}
            {page === "perplexity-beginner-guide" && <PerplexityBeginnerGuide />}
            {page === "cursor-beginner-guide" && <CursorBeginnerGuide />}
            {page === "replit-beginner-guide" && <ReplitBeginnerGuide />}
            {page === "canva-ai-beginner-guide" && <CanvaAIBeginnerGuide />}
            {page === "claude-with-adobe-guide" && <ClaudeWithAdobeGuide />}
            {page === "claude-website-design-guide" && <ClaudeWebsiteDesignGuide />}
            {page === "claude-art-prompts-guide" && <ClaudeArtPromptsGuide />}
            {page === "claude-branding-marketing-guide" && <ClaudeBrandingMarketingGuide />}
            {page === "claude-with-canva-guide" && <ClaudeWithCanvaGuide />}
            {page === "claude-with-figma-guide" && <ClaudeWithFigmaGuide />}
            {page === "claude-with-cursor-guide" && <ClaudeWithCursorGuide />}
            {page === "claude-with-higgsfield-guide" && <ClaudeWithHiggsfieldGuide />}
            {page === "languages" && <Languages />}
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
            {ADMIN_ROUTES_ENABLED && page === "newsletter-admin" && <NewsletterAdmin />}
            {page === "newsletter-success" && (
                <NewsletterSuccess onGoHome={goHome} onGoBlog={goBlog} />
            )}

            {page === "studynest" && (
                /* `studynest-scope` only scopes CSS — it sets no font or color,
                   so the back bar above the hero keeps its original metrics.
                   The dark `brand-dna` token layer is opted into by the page
                   <main> (see StudyNest.jsx) and by the ecosystem section. */
                <div className="studynest-scope">
                    <div className="back-bar">
                        <button onClick={goHome}>Back to CinNova</button>
                        <button type="button" className="back-bar-secondary" onClick={() => openPage("products")}>
                            All Products
                        </button>
                    </div>
                    <StudyNest />
                    <div className="brand-dna">
                        <ProductEcosystemSection currentPage="studynest" onNavigate={openPage} />
                    </div>
                </div>
            )}

            {page === "poisonguard" && (
                <div className="product-dark-scope poisonguard-scope">
                    <div className="back-bar">
                        <button onClick={goHome}>Back to CinNova</button>
                        <button type="button" className="back-bar-secondary" onClick={() => openPage("products")}>
                            All Products
                        </button>
                    </div>
                    <PoisonGuard />
                    <div className="pd-eco brand-dna">
                        <ProductEcosystemSection currentPage="poisonguard" onNavigate={openPage} />
                    </div>
                </div>
            )}

            {page === "real-estate" && (
                <div className="product-dark-scope realestate-scope">
                    <div className="back-bar">
                        <button onClick={goHome}>Back to CinNova</button>
                        <button type="button" className="back-bar-secondary" onClick={() => openPage("products")}>
                            All Products
                        </button>
                    </div>
                    <RealEstate />
                    <div className="pd-eco brand-dna">
                        <ProductEcosystemSection currentPage="real-estate" onNavigate={openPage} />
                    </div>
                </div>
            )}

            {page === "techmate" && (
                <div className="product-dark-scope techmate-scope">
                    <div className="back-bar">
                        <button onClick={goHome}>Back to CinNova</button>
                        <button type="button" className="back-bar-secondary" onClick={() => openPage("products")}>
                            All Products
                        </button>
                    </div>
                    <TechMateAI />
                    <div className="pd-eco brand-dna">
                        <ProductEcosystemSection currentPage="techmate" onNavigate={openPage} />
                    </div>
                </div>
            )}


            {page === "kiddo" && (
                <div className="product-dark-scope kiddo-scope">
                    <div className="back-bar">
                        <button onClick={goHome}>Back to CinNova</button>
                        <button type="button" className="back-bar-secondary" onClick={() => openPage("products")}>
                            All Products
                        </button>
                    </div>
                    <Kiddo />
                    <div className="pd-eco brand-dna">
                        <ProductEcosystemSection currentPage="kiddo" onNavigate={openPage} />
                    </div>
                </div>
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
