/*
 * GA4 event reporting.
 *
 * The Google tag itself lives in index.html — see the "Google tag (gtag.js)"
 * block in <head>. That is the ONLY place gtag.js is loaded and the ONLY place
 * `gtag('config', …)` runs. This module deliberately owns neither: it just
 * reports events through the global `dataLayer` that the tag already set up.
 *
 * GA_ID is read here solely to decide whether analytics is switched on for this
 * build. It is never used to load a script or to configure a measurement ID.
 */
import {
    sanitizeCommerceAnalyticsParams,
    destinationHostFromUrl,
} from "../data/commerceModels.js";
import { buildCommerceAnalyticsContext } from "../data/commerceCatalog.js";

const GA_ID = import.meta.env?.VITE_GA_MEASUREMENT_ID?.trim();

/**
 * Survives SPA route changes, which drop the query string that started the
 * debug session. Session-scoped, so it disappears when the tab closes.
 */
const GA_DEBUG_SESSION_KEY = "cn:ga-debug";

/**
 * Opt-in debug session. True for `vite dev`, for a build with
 * `VITE_GA_DEBUG=true`, or for a browser that landed on `?ga_debug=1`.
 *
 * `gtm_debug` is the parameter Google Tag Assistant appends when it connects.
 * gtag.js reads it natively, so honouring it here is belt-and-braces: it keeps
 * debug sessions working even if the tag initialises after Tag Assistant's
 * connection attempt.
 *
 * Normal production traffic never matches any of these, so it is never tagged.
 */
function resolveDebugSession() {
    if (typeof window === "undefined") return false;
    if (import.meta.env?.DEV || import.meta.env?.VITE_GA_DEBUG === "true") return true;

    try {
        const params = new URLSearchParams(window.location.search);
        if (params.get("ga_debug") === "1" || params.has("gtm_debug")) {
            window.sessionStorage?.setItem(GA_DEBUG_SESSION_KEY, "1");
            return true;
        }
        return window.sessionStorage?.getItem(GA_DEBUG_SESSION_KEY) === "1";
    } catch {
        // Private mode / storage disabled — fall back to "not debugging".
        return false;
    }
}

const GA_DEBUG = resolveDebugSession();

// Ensures exactly one `gtag('config', …)` per page load. See ensureConfigured().
let configured = false;

// Guards against duplicate page views when a React re-render re-runs the route
// effect without the URL actually changing. Keyed on pathname + search (+ hash
// when present) so legacy query routes like `/?page=news` are distinct from `/`.
// Only consecutive repeats of the same key are suppressed, so A → B → A still
// reports three page views.
let lastPageKey = null;

function log(...args) {
    if (GA_DEBUG) {
        console.info("[GA4]", ...args);
    }
}

function isEnabled() {
    return typeof window !== "undefined" && Boolean(GA_ID);
}

function pushGtagCommand() {
    window.dataLayer.push(arguments);
}

/**
 * Initialises `dataLayer`, the `gtag` shim, and the single `config` command.
 *
 * The gtag.js LOADER lives in index.html so Google's Tag Diagnostics crawler can
 * find it in the served HTML. The `js`/`config` commands must NOT live there:
 * vercel.json sets `script-src 'self' https://www.googletagmanager.com` with no
 * `'unsafe-inline'` and no nonce, so an inline <script> is blocked outright.
 * Bundled JS is `'self'`, so it runs.
 *
 * Confirmed against production: with the loader present but the config blocked,
 * gtag.js initialised and then sent zero hits. That also proves gtag.js does not
 * self-configure from the `?id=` in the loader URL, so issuing the config from
 * here — a moment after the loader starts — cannot produce an unwanted automatic
 * page view.
 *
 * Idempotent: exactly one `config` per page load, whichever caller arrives first.
 */
function ensureConfigured() {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || pushGtagCommand;

    if (configured) return;
    configured = true;

    window.gtag("js", new Date());

    // Per Google's DebugView docs, `debug_mode: false` does NOT turn debug mode
    // off — only omitting the key does. So the key is added conditionally.
    const configParams = { send_page_view: false };
    if (GA_DEBUG) {
        configParams.debug_mode = true;
    }
    window.gtag("config", GA_ID, configParams);
    log("configured", GA_ID, configParams);
}

/**
 * Reports one GA4 event.
 *
 * Pushes straight to `dataLayer`, which is gtag.js's own buffer: commands queued
 * before the library finishes loading are replayed in order once it does, and
 * commands queued after are processed synchronously. Nothing is gated on a
 * script `onload`, so a slow or blocked gtag.js can never silently discard
 * events.
 */
function sendEvent(name, params = {}) {
    if (!isEnabled()) {
        log("disabled — missing VITE_GA_MEASUREMENT_ID");
        return;
    }

    // Guarantees the config precedes the event even if an event somehow fires
    // before initAnalytics(). debug_mode is set once on the config, not per event.
    ensureConfigured();

    window.gtag("event", name, params);
}

/**
 * Prepares client-side analytics.
 *
 * Deliberately does NOT load gtag.js — index.html owns the loader. This issues
 * the single `config` (which cannot live in the HTML; see ensureConfigured) and
 * binds the delegated outbound-link listener.
 */
export function initAnalytics() {
    if (!isEnabled()) {
        log("init skipped — no measurement ID");
        return;
    }

    ensureConfigured();

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

/**
 * Normalize an SPA destination into stable analytics fields.
 * Resolves against `location.origin` (not the current href) so a relative
 * `/?page=news` never accidentally inherits a prior path like `/blog`.
 */
function resolvePageViewTarget(pathInput) {
    const fallbackPath =
        window.location.pathname + window.location.search + window.location.hash;
    const raw = (pathInput && String(pathInput)) || fallbackPath;

    try {
        const url = new URL(raw, window.location.origin);
        const pagePath = `${url.pathname}${url.search}${url.hash}`;
        return {
            pageKey: pagePath || "/",
            pagePath: pagePath || "/",
            pageLocation: url.href,
        };
    } catch {
        return {
            pageKey: fallbackPath || "/",
            pagePath: fallbackPath || "/",
            pageLocation: window.location.href,
        };
    }
}

export function trackPageView(
    path = window.location.pathname + window.location.search + window.location.hash
) {
    if (!isEnabled()) {
        log("disabled — missing VITE_GA_MEASUREMENT_ID");
        return;
    }

    const { pageKey, pagePath, pageLocation } = resolvePageViewTarget(path);

    if (pageKey === lastPageKey) {
        log("page_view skipped — already reported", pageKey);
        return;
    }
    lastPageKey = pageKey;

    // Google's documented SPA pattern: the `config` in index.html disables the
    // automatic page view, and every view — including the first — is reported
    // here as an explicit `page_view` event. A repeated `config` for an
    // already-configured measurement ID is not a supported way to do this.
    // Include page_path so legacy query destinations (`/?page=news`) remain
    // identifiable alongside page_location.
    const payload = {
        page_path: pagePath,
        page_location: pageLocation,
        page_title: document.title,
    };

    sendEvent("page_view", payload);
    log("page_view sent", payload);
}

export function trackEvent(eventName, params = {}) {
    sendEvent(eventName, params);
    log("event sent", eventName, params);
}

export function trackNewsletterSignup({
    source = "Website",
    tags = [],
    status = "unknown",
    placement = "",
    entitySlug = "",
    campaignId = "",
} = {}) {
    trackEvent(
        "newsletter_signup",
        sanitizeCommerceAnalyticsParams({
            signup_source: source,
            signup_status: status,
            signup_tags: Array.isArray(tags) ? tags.join(",") : "",
            newsletter_placement: placement,
            entity_slug: entitySlug,
            campaign_id: campaignId,
        }),
    );
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

export function trackProductsHeroExploreClick() {
    trackEvent("products_hero_explore_click", {
        source_page: "products",
        click_location: "products_hero",
    });
}

export function trackProductsHeroDiscoverClick() {
    trackEvent("products_hero_discover_click", {
        source_page: "products",
        click_location: "products_hero",
        destination_page: "about",
    });
}

export function trackBooksHeroExploreClick() {
    trackEvent("books_hero_explore_click", {
        source_page: "books",
        click_location: "books_hero",
    });
}

export function trackBooksHeroFeaturedClick() {
    trackEvent("books_hero_featured_click", {
        source_page: "books",
        click_location: "books_hero",
    });
}

export function trackBookCardClick({ bookSlug = "", bookTitle = "", releaseStatus = "" } = {}) {
    trackEvent("book_card_click", {
        book_slug: bookSlug,
        book_title: bookTitle,
        release_status: releaseStatus,
        source_page: "books",
    });
}

export function trackBookExternalPurchaseClick({ bookSlug = "", bookTitle = "", releaseStatus = "" } = {}) {
    trackEvent("book_external_purchase_click", {
        book_slug: bookSlug,
        book_title: bookTitle,
        release_status: releaseStatus,
        source_page: "books",
    });
}

/* ── Phase 11.1 commerce helpers ─────────────────────────────────────────────
   Measurable today: item view, CTA click, outbound retailer click, lead start/
   complete. An Amazon outbound click is INTENT/OUTBOUND — never a purchase.
   Reserved (do not fire): begin_checkout, purchase, subscribe. */

export const RESERVED_COMMERCE_EVENTS = Object.freeze({
    BEGIN_CHECKOUT: "begin_checkout",
    PURCHASE: "purchase",
    SUBSCRIBE: "subscribe",
});

let lastCommerceEventKey = null;
let lastCommerceEventAt = 0;

function shouldSkipDuplicateCommerce(key, windowMs = 400) {
    const now = Date.now();
    if (key && key === lastCommerceEventKey && now - lastCommerceEventAt < windowMs) {
        return true;
    }
    lastCommerceEventKey = key;
    lastCommerceEventAt = now;
    return false;
}

function commerceParams(entity, extra = {}) {
    return sanitizeCommerceAnalyticsParams({
        ...buildCommerceAnalyticsContext(entity, {
            placement: extra.placement || "",
            ctaType: extra.cta_type || extra.ctaType || "",
        }),
        ...extra,
    });
}

export function trackCommerceItemView({ entity = null, placement = "" } = {}) {
    if (!entity) return;
    const key = `view:${entity.entityId}:${placement}`;
    if (shouldSkipDuplicateCommerce(key)) return;
    trackEvent("commerce_item_view", commerceParams(entity, { placement }));
}

export function trackCommerceCtaClick({
    entity = null,
    placement = "",
    ctaType = "",
    label = "",
} = {}) {
    if (!entity) return;
    const key = `cta:${entity.entityId}:${placement}:${ctaType}:${label}`;
    if (shouldSkipDuplicateCommerce(key)) return;
    trackEvent(
        "commerce_cta_click",
        commerceParams(entity, {
            placement,
            cta_type: ctaType,
            cta_label: label,
        }),
    );
}

export function trackCommerceOutboundClick({
    entity = null,
    placement = "",
    ctaType = "",
    url = "",
} = {}) {
    if (!entity) return;
    const destination = url || entity.destinationUrl || "";
    const key = `out:${entity.entityId}:${destination}`;
    if (shouldSkipDuplicateCommerce(key)) return;
    trackEvent(
        "commerce_outbound_click",
        commerceParams(entity, {
            placement,
            cta_type: ctaType,
            destination_url_host: destinationHostFromUrl(destination) || "",
            // Never include full email/PII; host only.
        }),
    );
}

/* ── Phase 11.4A affiliate / partner outbound ────────────────────────────────
   Fires only from PartnerOutboundLink after resolve+validation succeeds.
   Never send full affiliate query strings or PII — host + partner metadata only. */

export function trackAffiliateOutboundClick({
    partnerId = "",
    partnerName = "",
    partnerType = "",
    placement = "",
    url = "",
    campaignId = "",
    disclosureShown = false,
} = {}) {
    if (!partnerId || !url) return;
    const key = `aff:${partnerId}:${destinationHostFromUrl(url) || ""}:${placement}`;
    if (shouldSkipDuplicateCommerce(key)) return;
    trackEvent(
        "affiliate_outbound_click",
        sanitizeCommerceAnalyticsParams({
            partner_id: partnerId,
            partner_name: partnerName,
            partner_type: partnerType,
            placement,
            destination_url_host: destinationHostFromUrl(url) || "",
            campaign_id: campaignId ? String(campaignId).slice(0, 64) : "",
            disclosure_shown: Boolean(disclosureShown),
        }),
    );
}

export function trackCommerceLeadStart({
    source = "",
    placement = "",
    entitySlug = "",
    campaignId = "",
} = {}) {
    trackEvent(
        "commerce_lead_start",
        sanitizeCommerceAnalyticsParams({
            newsletter_source: source,
            newsletter_placement: placement,
            entity_slug: entitySlug,
            campaign_id: campaignId,
        }),
    );
}

export function trackCommerceLeadComplete({
    source = "",
    placement = "",
    entitySlug = "",
    campaignId = "",
    status = "unknown",
} = {}) {
    trackEvent(
        "commerce_lead_complete",
        sanitizeCommerceAnalyticsParams({
            newsletter_source: source,
            newsletter_placement: placement,
            entity_slug: entitySlug,
            campaign_id: campaignId,
            signup_status: status,
        }),
    );
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
