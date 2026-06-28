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
