const GA_ID = import.meta.env?.VITE_GA_MEASUREMENT_ID?.trim();
const GA_DEBUG =
    import.meta.env?.DEV || import.meta.env?.VITE_GA_DEBUG === "true";

let scriptRequested = false;
let scriptLoaded = false;
const pendingCalls = [];

function log(...args) {
    if (GA_DEBUG) {
        console.info("[GA4]", ...args);
    }
}

function isEnabled() {
    return typeof window !== "undefined" && Boolean(GA_ID);
}

function flushPendingCalls() {
    const queue = pendingCalls.splice(0, pendingCalls.length);
    log("flushing queued calls", queue.length);
    queue.forEach((call) => {
        try {
            call();
        } catch (error) {
            console.error("[GA4] queued call failed", error);
        }
    });
}

function runWhenReady(callback) {
    if (!isEnabled()) {
        log("disabled — missing VITE_GA_MEASUREMENT_ID");
        return;
    }

    if (scriptLoaded && typeof window.gtag === "function") {
        callback();
        return;
    }

    pendingCalls.push(callback);
    initAnalytics();
}

function pushGtagCommand() {
    window.dataLayer.push(arguments);
}

export function initAnalytics() {
    if (!isEnabled()) {
        log("init skipped — no measurement ID");
        return;
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || pushGtagCommand;

    if (scriptRequested) {
        log("init already requested");
        return;
    }

    scriptRequested = true;
    log("initializing", GA_ID);

    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { send_page_view: false });
    log("queued config", { send_page_view: false });

    if (document.getElementById("ga4-script")) {
        log("script tag already present");
        return;
    }

    const script = document.createElement("script");
    script.id = "ga4-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    script.onload = () => {
        scriptLoaded = true;
        log("gtag.js loaded");
        flushPendingCalls();
    };
    script.onerror = () => {
        console.error("[GA4] failed to load gtag.js");
    };
    document.head.appendChild(script);
    log("injected gtag.js");

    if (!document.documentElement.dataset.outboundAnalyticsBound) {
        document.documentElement.dataset.outboundAnalyticsBound = "true";
        document.addEventListener("click", (event) => {
            const link = event.target.closest?.("a[href]");
            if (!link) return;
            const href = link.getAttribute("href");
            if (!href || href.startsWith("#")) return;

            let url;
            try {
                url = new URL(href, window.location.href);
            } catch {
                return;
            }

            const isOutbound =
                url.origin !== window.location.origin || url.protocol === "mailto:";
            if (!isOutbound) return;

            trackOutboundLinkClick({
                url: url.href,
                label: link.textContent?.trim() || link.getAttribute("aria-label") || "Outbound link",
                location: window.location.pathname + window.location.search,
            });
        });
    }
}

export function trackPageView(path = window.location.pathname + window.location.search) {
    runWhenReady(() => {
        const pagePath = path || window.location.pathname + window.location.search;
        const payload = {
            page_path: pagePath,
            page_location: window.location.href,
            page_title: document.title,
        };

        // Recommended SPA pattern with manual page views disabled at init.
        window.gtag("config", GA_ID, payload);
        log("page_view sent", payload);
    });
}

export function trackEvent(eventName, params = {}) {
    runWhenReady(() => {
        window.gtag("event", eventName, params);
        log("event sent", eventName, params);
    });
}

export function trackNewsletterSignup({ source = "Website", tags = [], status = "unknown" } = {}) {
    trackEvent("newsletter_signup", {
        signup_source: source,
        signup_status: status,
        signup_tags: Array.isArray(tags) ? tags.join(",") : "",
    });
}

export function trackResourceDownload(resource = {}) {
    trackEvent("resource_download", {
        resource_id: resource.id,
        resource_slug: resource.slug,
        resource_title: resource.title,
        resource_category: resource.category,
        resource_product: resource.product,
        resource_format: resource.format,
    });
}

export function trackProductCtaClick({ product = "", category = "", location = "" } = {}) {
    trackEvent("product_cta_click", {
        product,
        category,
        click_location: location,
    });
}

export function trackArticleView(post = {}) {
    trackEvent("article_view", {
        article_id: post.id,
        article_slug: post.slug,
        article_title: post.title,
        article_category: post.category,
        article_cornerstone: Boolean(post.cornerstone),
    });
}

/* ── News Center ─────────────────────────────────────────────────────────────
   Structural only: coverage level, category, slug, and the UI surface a click
   came from. No reader identifiers and no derived traffic/trending metrics. */

export function trackNewsPageView({ storyCount = 0, isDemoFeed = false } = {}) {
    trackEvent("news_page_view", {
        news_story_count: storyCount,
        news_demo_feed: isDemoFeed,
    });
}

export function trackNewsFilterChange({ coverageLevel = "all", source = "filter_pills", resultCount = 0 } = {}) {
    trackEvent("news_filter_change", {
        news_coverage_level: coverageLevel,
        news_filter_source: source,
        news_result_count: resultCount,
    });
}

export function trackNewsStoryClick(story = {}, { surface = "" } = {}) {
    trackEvent("news_story_click", {
        news_story_id: story.id,
        news_story_slug: story.slug,
        news_coverage_level: story.coverageLevel,
        news_category: story.category,
        news_surface: surface,
    });
}

export function trackNewsStoryView(story = {}) {
    trackEvent("news_story_view", {
        news_story_id: story.id,
        news_story_slug: story.slug,
        news_coverage_level: story.coverageLevel,
        news_category: story.category,
        news_status: story.status,
        news_demo_story: Boolean(story.isDemo),
    });
}

export function trackRelatedNewsClick({ fromSlug = "", toSlug = "", type = "news" } = {}) {
    trackEvent("related_news_click", {
        news_from_slug: fromSlug,
        news_to_slug: toSlug,
        related_type: type,
    });
}

export function trackNewsNewsletterClick({ location = "", storySlug = "" } = {}) {
    trackEvent("news_newsletter_click", {
        click_location: location,
        news_story_slug: storySlug,
    });
}

export function trackOutboundLinkClick({ url = "", label = "", location = "" } = {}) {
    trackEvent("outbound_link_click", {
        link_url: url,
        link_label: label.slice(0, 120),
        click_location: location,
    });
}

export function trackSponsorCtaClick({ page = "", cta = "", target = "" } = {}) {
    trackEvent("sponsor_cta_click", {
        sponsor_page: page,
        cta_label: cta,
        cta_target: target,
    });
}

export function trackContactSubmit({ page = "", status = "unknown" } = {}) {
    trackEvent("contact_submit", {
        contact_page: page,
        contact_status: status,
    });
}

export function trackLeadDelivery({ source = "", ok = false, status = 0 } = {}) {
    trackEvent("lead_delivery", {
        lead_source: source,
        delivery_ok: ok,
        delivery_status: status,
    });
}

/* ── Conversion tracking (PR G) ──────────────────────────────────────────────
   Privacy-safe: these only capture action type, source/destination page, CTA
   label, and product/tutorial/language names. They never send form values,
   calculator numbers, or any personal data. All go through trackEvent, which
   no-ops silently when GA is unavailable. */

export function trackLiveBetaClick({ sourcePage = "", ctaLabel = "", destinationUrl = "" } = {}) {
    trackEvent("cinnova_live_beta_click", {
        source_page: sourcePage,
        cta_label: ctaLabel,
        destination_url: destinationUrl,
    });
}

export function trackRentalCalculatorView({ sourcePage = "free-rental-property-calculator" } = {}) {
    trackEvent("rental_calculator_view", { source_page: sourcePage });
}

// Only signals that the calculator was used — no input values are sent.
export function trackRentalCalculatorCalculate({ sourcePage = "free-rental-property-calculator" } = {}) {
    trackEvent("rental_calculator_calculate", { source_page: sourcePage });
}

export function trackRentalCalculatorBetaCta({ sourcePage = "free-rental-property-calculator", destinationUrl = "" } = {}) {
    trackEvent("rental_calculator_beta_cta_click", {
        source_page: sourcePage,
        destination_url: destinationUrl,
    });
}

export function trackAiTutorialClick({ sourcePage = "", tutorialKey = "", tutorialTitle = "" } = {}) {
    trackEvent("ai_tutorial_click", {
        source_page: sourcePage,
        tutorial_key: tutorialKey,
        tutorial_title: tutorialTitle,
    });
}

export function trackLanguageSectionClick({ language = "", sourcePage = "languages" } = {}) {
    trackEvent("language_section_click", { language, source_page: sourcePage });
}

export function trackLanguageInternalLinkClick({ language = "", destinationPage = "", sourcePage = "languages" } = {}) {
    trackEvent("language_internal_link_click", {
        language,
        destination_page: destinationPage,
        source_page: sourcePage,
    });
}

export function trackProductExploreClick({ productName = "", sourcePage = "", destinationPage = "" } = {}) {
    trackEvent("product_explore_click", {
        product_name: productName,
        source_page: sourcePage,
        destination_page: destinationPage,
    });
}

/* ── Organic social (Phase 9A helpers) ───────────────────────────────────────
   Fire only when real UI or UTM landings exist. Do not invent conversion data.
   Preserves existing News/Blog events; these are additive. */

function socialParams({
    platform = "",
    contentType = "",
    slug = "",
    campaign = "",
    cta = "",
    destination = "",
} = {}) {
    return {
        platform,
        content_type: contentType,
        slug,
        campaign,
        cta,
        destination,
    };
}

/** On-site share button (Blog/News share intents). */
export function trackSocialShareClick(params = {}) {
    trackEvent("social_share_click", socialParams(params));
}

/** Click from site to a CinNova social profile (footer/follow). */
export function trackSocialOutboundClick(params = {}) {
    trackEvent("social_outbound_click", socialParams(params));
}

/** Landing page view attributed to organic social UTM. */
export function trackSocialCampaignLanding(params = {}) {
    trackEvent("social_campaign_landing", socialParams(params));
}

/** Product CTA attributed to a social campaign. */
export function trackSocialProductClick(params = {}) {
    trackEvent("social_product_click", socialParams(params));
}

/** Newsletter signup attributed to a social campaign (after successful signup). */
export function trackSocialNewsletterConversion(params = {}) {
    trackEvent("social_newsletter_conversion", socialParams(params));
}
