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
import News from "./pages/News.jsx";
import NewsStoryPage from "./pages/NewsStoryPage.jsx";
import Books from "./pages/Books.jsx";
import BookDetailPage from "./pages/BookDetailPage.jsx";
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
import { getNewsStoryBySlug } from "./data/newsPosts.js";
import { getNewsDraftBySlug } from "./data/newsDrafts.js";
import { getBookBySlug } from "./data/booksCatalog.js";
import { getBlogDraftBySlug } from "./data/blogDrafts.js";
import { ADMIN_PAGE_KEYS, VALID_PAGE_KEYS } from "./data/seoConfig.js";
import { trackPageView, trackEvent } from "./utils/analytics.js";
import { PRODUCT_PAGE_KEYS, productDetails, products } from "./data/products.js";
import { resolveLegacyRouteRedirect } from "./data/legacyRouteRedirects.js";
import { getPublicPageKeyFromPath, getPublicPagePath } from "./data/publicPageRoutes.js";
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
    const newsStorySlug = params.get("story");
    const newsPreviewSlug = params.get("slug");

    // DEV-only draft preview. Never registered in VALID_PAGE_KEYS / sitemap.
    // Production builds always 404 this route even if a draft JSON ships in the repo.
    if (routedPage === "news-preview") {
        if (!import.meta.env.DEV) {
            return { page: "not-found", article: null, resource: null, category: null };
        }
        const slug = newsPreviewSlug ? decodeURIComponent(newsPreviewSlug) : "";
        const draft = slug ? getNewsDraftBySlug(slug) : null;
        if (draft) {
            return {
                page: "news-preview",
                article: null,
                resource: null,
                category: null,
                newsStory: draft,
            };
        }
        return { page: "not-found", article: null, resource: null, category: null };
    }

    if (routedPage === "blog-preview") {
        if (!import.meta.env.DEV) {
            return { page: "not-found", article: null, resource: null, category: null };
        }
        const slug = newsPreviewSlug ? decodeURIComponent(newsPreviewSlug) : "";
        const draft = slug ? getBlogDraftBySlug(slug) : null;
        if (draft) {
            return {
                page: "blog-preview",
                article: draft,
                resource: null,
                category: null,
            };
        }
        return { page: "not-found", article: null, resource: null, category: null };
    }

    // News stories use clean paths (/news/<slug>) to match the blog. The
    // ?page=news&story=<slug> form is supported as a fallback so shared links
    // built from the query-routed landing page still resolve.
    const newsStoryMatch = path.match(/^\/news\/([^/]+)$/);
    if (newsStoryMatch || (routedPage === "news" && newsStorySlug)) {
        const slug = decodeURIComponent(newsStoryMatch ? newsStoryMatch[1] : newsStorySlug);
        const story = getNewsStoryBySlug(slug);
        if (story) {
            return { page: "news-story", article: null, resource: null, category: null, newsStory: story };
        }
        return { page: "not-found", article: null, resource: null, category: null };
    }

    if (path === "/news") {
        return { page: "news", article: null, resource: null, category: null };
    }

    // CinNova Books: /books index + /books/:slug detail foundation.
    const bookMatch = path.match(/^\/books\/([^/]+)$/);
    if (bookMatch || (routedPage === "books" && params.get("book"))) {
        const slug = decodeURIComponent(bookMatch ? bookMatch[1] : params.get("book"));
        const book = getBookBySlug(slug);
        if (book) {
            return { page: "book-detail", article: null, resource: null, category: null, book };
        }
        return { page: "not-found", article: null, resource: null, category: null };
    }

    if (path === "/books") {
        return { page: "books", article: null, resource: null, category: null };
    }

    if (path === "/blog") {
        return { page: "blog", article: null, resource: null, category: "All" };
    }

    if (path === "/blog-admin") {
        if (!ADMIN_ROUTES_ENABLED) {
            return { page: "not-found", article: null, resource: null, category: null };
        }
        return { page: "blog-manager", article: null, resource: null, category: null };
    }

    // Clean product routes: /products (index) and /products/:key (detail).
    if (path === "/products") {
        return { page: "products", article: null, resource: null, category: null };
    }
    const productMatch = path.match(/^\/products\/([^/]+)$/);
    if (productMatch) {
        const productKey = decodeURIComponent(productMatch[1]);
        if (PRODUCT_PAGE_KEYS.has(productKey)) {
            return { page: productKey, article: null, resource: null, category: null };
        }
        return { page: "not-found", article: null, resource: null, category: null };
    }

    // Clean resource routes: /resources (index) and /resources/:slug (detail).
    if (path === "/resources") {
        return { page: "resources", article: null, resource: null, category: null };
    }
    const resourceMatch = path.match(/^\/resources\/([^/]+)$/);
    if (resourceMatch) {
        const resource = getResourceBySlug(decodeURIComponent(resourceMatch[1]));
        if (resource) return { page: "resource", article: null, resource, category: null };
        return { page: "not-found", article: null, resource: null, category: null };
    }

    // Migrated public pages (Phase 2B): clean path → the same page key/component
    // as the legacy ?page= route (e.g. /pricing → "pricing", /company/press →
    // "press-center", /guides → "ai-tutorials", /tools/... → calculator).
    const publicPageKey = getPublicPageKeyFromPath(path);
    if (publicPageKey) {
        return { page: publicPageKey, article: null, resource: null, category: null };
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
        path === "/news" ||
        path === "/books" ||
        path.startsWith("/blog/");

    if (!isKnownPath) {
        return { page: "not-found", article: null, resource: null, category: null };
    }

    return { page: "home", article: null, resource: null, category: null };
}

/**
 * Map an internal page key to its canonical URL path. Products and the product
 * index resolve to clean `/products` routes; the resource index to `/resources`.
 * All other static keys keep their legacy `?page=` form (not migrated in this
 * phase). Resource detail navigation uses `openResource` (clean `/resources/:slug`).
 */
function pathForPage(nextPage) {
    if (nextPage === "blog") return "/blog";
    if (nextPage === "news") return "/news";
    if (nextPage === "books") return "/books";
    if (nextPage === "blog-manager") return "/blog-admin";
    if (nextPage === "products") return "/products";
    if (nextPage === "resources") return "/resources";
    if (PRODUCT_PAGE_KEYS.has(nextPage)) return `/products/${nextPage}`;
    // Migrated public pages resolve to their clean route; unmigrated guide keys
    // and everything else keep their legacy ?page= form for now.
    const publicPath = getPublicPagePath(nextPage);
    if (publicPath) return publicPath;
    return `/?page=${nextPage}`;
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
    const [selectedNewsStory, setSelectedNewsStory] = useState(initialRoute.newsStory || null);
    const [selectedBook, setSelectedBook] = useState(initialRoute.book || null);
    // Coverage level the News Center should open on (set by story breadcrumbs).
    const [newsCoverage, setNewsCoverage] = useState("all");

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

    // Client-side fallback that canonicalizes legacy product/resource query URLs
    // to their clean path. On Vercel the edge Routing Middleware (middleware.js)
    // is the PRIMARY handler — it issues a true 308 with a query-free Location, so
    // this rarely fires there. It remains for local dev (`vite`) and any non-Vercel
    // host where middleware does not run, and it uses the SAME shared resolver as
    // the middleware so the two can never diverge. Runs once on mount; only the
    // 19 supported product/resource forms resolve, plus News Center and the
    // Phase 2B migrated public pages — other `?page=` routes are left untouched.
    useEffect(() => {
        const cleanPath = resolveLegacyRouteRedirect(window.location.search);
        if (!cleanPath) return;
        const current = window.location.pathname + window.location.search;
        const onLegacyRoot = window.location.pathname === "/";
        const onCleanPathWithStrayQuery =
            window.location.pathname === cleanPath && Boolean(window.location.search);
        if ((onLegacyRoot || onCleanPathWithStrayQuery) && current !== cleanPath) {
            window.history.replaceState({}, "", cleanPath);
        }
    }, []);

    // Backup SPA page-view tracking when routed view state changes (covers
    // initial load + popstate). pushRoute also tracks eagerly with the
    // destination URL so SPA navigations (including News → /news) cannot miss
    // a hit if the effect timing races the history update.
    useEffect(() => {
        trackPageView(
            window.location.pathname + window.location.search + window.location.hash
        );
    }, [page, selectedArticle?.slug, selectedResource?.slug, selectedNewsStory?.slug, selectedBook?.slug]);

    // Frosted nav gains a subtle shadow once the page scrolls off the top.
    const navScrolled = useStickyNav();

    // Publishes the measured nav height as `--cn-nav-height` so fixed elements
    // (e.g. the article reading progress bar) can sit flush beneath the nav.
    useNavHeight();

    // Re-scan for `.reveal-on-scroll` targets whenever the routed view swaps,
    // since this router mounts pages without remounting the shell.
    useScrollReveal([
        page,
        selectedArticle?.slug,
        selectedResource?.slug,
        selectedNewsStory?.slug,
        selectedBook?.slug,
        selectedCategory,
    ]);

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
            setSelectedNewsStory(route.newsStory || null);
            setSelectedBook(route.book || null);
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
        // Track immediately with the known destination. Critical for legacy
        // `?page=` routes where pathname stays `/` and only search changes —
        // relying solely on a later effect can miss the collect entirely.
        trackPageView(url);
    }

    function goHome() {
        setSelectedArticle(null);
        setSelectedResource(null);
        setSelectedNewsStory(null);
        setSelectedBook(null);
        setSelectedCategory("All");
        setPage("home");
        pushRoute("/");
        scrollTop();
    }

    function goBlog() {
        setSelectedArticle(null);
        setSelectedResource(null);
        setSelectedNewsStory(null);
        setSelectedBook(null);
        setSelectedCategory("All");
        setPage("blog");
        pushRoute("/blog");
        scrollTop();
    }

    function goBlogCategory(category) {
        setSelectedArticle(null);
        setSelectedResource(null);
        setSelectedNewsStory(null);
        setSelectedBook(null);
        setSelectedCategory(category);
        setPage("blog");
        pushRoute(category === "All" ? "/blog" : `/blog/category/${slugifyCategory(category)}`);
        scrollTop();
    }

    function goResources() {
        setSelectedArticle(null);
        setSelectedResource(null);
        setSelectedNewsStory(null);
        setSelectedBook(null);
        setSelectedCategory("All");
        setPage("resources");
        pushRoute("/resources");
        scrollTop();
    }

    function openArticle(post) {
        setSelectedArticle(post);
        setSelectedResource(null);
        setSelectedNewsStory(null);
        setSelectedBook(null);
        setSelectedCategory("All");
        setPage("article");
        pushRoute(`/blog/${post.slug}`);
        scrollTop();
    }

    function openResource(resource) {
        setSelectedArticle(null);
        setSelectedResource(resource);
        setSelectedNewsStory(null);
        setSelectedBook(null);
        setSelectedCategory("All");
        setPage("resource");
        pushRoute(`/resources/${resource.slug}`);
        scrollTop();
    }

    /* News Center: canonical `/news`; stories use `/news/<slug>`.
       Legacy `/?page=news` 308s (edge) or replaceStates (client) to `/news`. */
    function goNews(coverageLevel = "all") {
        setSelectedArticle(null);
        setSelectedResource(null);
        setSelectedNewsStory(null);
        setSelectedBook(null);
        setSelectedCategory("All");
        setNewsCoverage(coverageLevel);
        setPage("news");
        pushRoute("/news");
        scrollTop();
    }

    function openNewsStory(story) {
        setSelectedArticle(null);
        setSelectedResource(null);
        setSelectedCategory("All");
        setSelectedNewsStory(story);
        setSelectedBook(null);
        setPage("news-story");
        pushRoute(`/news/${story.slug}`);
        scrollTop();
    }

    function goBooks() {
        setSelectedArticle(null);
        setSelectedResource(null);
        setSelectedNewsStory(null);
        setSelectedBook(null);
        setSelectedCategory("All");
        setPage("books");
        pushRoute("/books");
        scrollTop();
    }

    function openBook(slugOrBook) {
        const book = typeof slugOrBook === "string" ? getBookBySlug(slugOrBook) : slugOrBook;
        if (!book) return;
        setSelectedArticle(null);
        setSelectedResource(null);
        setSelectedNewsStory(null);
        setSelectedBook(book);
        setSelectedCategory("All");
        setPage("book-detail");
        pushRoute(`/books/${book.slug}`);
        scrollTop();
    }

    function openPage(nextPage) {
        setSelectedArticle(null);
        setSelectedResource(null);
        setSelectedNewsStory(null);
        setSelectedBook(null);
        setSelectedCategory("All");
        // Nav/menu entries to News always open the unfiltered feed.
        if (nextPage === "news") setNewsCoverage("all");
        setPage(nextPage);
        pushRoute(pathForPage(nextPage));
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

                <div id="nav-links" className={`nav-links${mobileMenuOpen ? " nav-mobile-open" : ""}`}>
                    <button
                        className="nav-mobile-close"
                        onClick={() => setMobileMenuOpen(false)}
                        aria-label="Close menu"
                    />
                    {/* Primary links — always inline on desktop; same set in mobile overlay */}
                    <button onClick={() => { goHome();                       setMobileMenuOpen(false); }}>Home</button>
                    <button onClick={() => { openPage("products");            setMobileMenuOpen(false); }}>Products</button>
                    <button onClick={() => { openPage("news");               setMobileMenuOpen(false); }}>News</button>
                    <button onClick={() => { goResources();                  setMobileMenuOpen(false); }}>Resources</button>
                    <button onClick={() => { goBlog();                       setMobileMenuOpen(false); }}>Blog</button>
                    <button
                        className={page === "books" || page === "book-detail" ? "is-active" : undefined}
                        aria-current={page === "books" || page === "book-detail" ? "page" : undefined}
                        onClick={() => { goBooks(); setMobileMenuOpen(false); }}
                    >
                        Books
                    </button>
                    <button className="nav-languages" onClick={() => { trackEvent("language_header_click", { source: "header" }); openPage("languages"); setMobileMenuOpen(false); }} aria-label="Languages">
                        <span aria-hidden="true">🌐</span> Languages
                    </button>
                    {/* Secondary links — "More" dropdown on desktop, flat on mobile */}
                    <NavMoreMenu
                        items={[
                            { label: "About", onSelect: () => { openPage("about"); setMobileMenuOpen(false); } },
                            { label: "Pricing", onSelect: () => { openPage("pricing"); setMobileMenuOpen(false); } },
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
                    onOpenNewsStory={openNewsStory}
                    onOpenResource={openResource}
                    onOpenBook={openBook}
                    onGoResources={goResources}
                    onGoBlog={goBlog}
                    onGoNews={goNews}
                    onSubscribe={showNewsletterAlert}
                />
            )}
            {page === "products" && (
                <ProductsPage
                    onNavigate={openPage}
                    onSubscribe={showNewsletterAlert}
                    onOpenBook={openBook}
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
                        onOpenBook={openBook}
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
            {page === "news" && (
                <News
                    key={`news-${newsCoverage}`}
                    onNavigate={openPage}
                    onOpenStory={openNewsStory}
                    initialCoverage={newsCoverage}
                />
            )}
            {page === "news-story" && selectedNewsStory && (
                <NewsStoryPage
                    story={selectedNewsStory}
                    onNavigate={openPage}
                    onGoHome={goHome}
                    onGoNews={goNews}
                    onOpenStory={openNewsStory}
                    onOpenArticle={openArticle}
                />
            )}
            {page === "books" && (
                <Books
                    onNavigate={openPage}
                    onOpenBook={openBook}
                />
            )}
            {page === "book-detail" && selectedBook && (
                <BookDetailPage
                    book={selectedBook}
                    onBackToBooks={goBooks}
                />
            )}
            {import.meta.env.DEV && page === "news-preview" && selectedNewsStory && (
                <NewsStoryPage
                    story={selectedNewsStory}
                    previewMode
                    onNavigate={openPage}
                    onGoHome={goHome}
                    onGoNews={goNews}
                    onOpenStory={openNewsStory}
                    onOpenArticle={openArticle}
                />
            )}
            {import.meta.env.DEV && page === "blog-preview" && selectedArticle && (
                <ArticleErrorBoundary onBack={goBlog}>
                    <ArticlePage
                        post={selectedArticle}
                        posts={publishedPosts}
                        previewMode
                        onBack={goBlog}
                        onOpenArticle={openArticle}
                        onOpenResource={openResource}
                        onSubscribe={showNewsletterAlert}
                        onNavigate={openPage}
                        onOpenBook={openBook}
                    />
                </ArticleErrorBoundary>
            )}
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

