const GA_ID = import.meta.env?.VITE_GA_MEASUREMENT_ID;

function isEnabled() {
    return typeof window !== "undefined" && !!GA_ID;
}

function gtag(...args) {
    if (!window.dataLayer) return;
    window.dataLayer.push(args);
}

export function initAnalytics() {
    if (!isEnabled()) return;

    // Inject the GA4 loader script once
    if (document.getElementById("ga4-script")) return;

    window.dataLayer = window.dataLayer || [];
    // eslint-disable-next-line no-inner-declarations
    function gtagFn() { window.dataLayer.push(arguments); }
    window.gtag = gtagFn;
    gtag("js", new Date());
    gtag("config", GA_ID, { send_page_view: false });

    const script = document.createElement("script");
    script.id = "ga4-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

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

            const isOutbound = url.origin !== window.location.origin || url.protocol === "mailto:";
            if (!isOutbound) return;

            trackOutboundLinkClick({
                url: url.href,
                label: link.textContent?.trim() || link.getAttribute("aria-label") || "Outbound link",
                location: window.location.pathname + window.location.search,
            });
        });
    }
}

export function trackPageView(path) {
    if (!isEnabled() || !window.gtag) return;
    window.gtag("event", "page_view", {
        page_path: path,
        page_location: window.location.href,
    });
}

export function trackEvent(eventName, params = {}) {
    if (!isEnabled() || !window.gtag) return;
    window.gtag("event", eventName, params);
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
