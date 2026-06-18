const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

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
