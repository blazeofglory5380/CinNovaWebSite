/**
 * CinNova organic social UTM helpers.
 *
 * Canonical page URLs must stay clean. Append UTMs only to outbound tracked links
 * used in social posts, share intents, and campaign CTAs.
 */

export const SOCIAL_UTM_SOURCES = Object.freeze([
    "facebook",
    "instagram",
    "x",
    "linkedin",
    "youtube",
    "tiktok",
]);

export const SOCIAL_UTM_MEDIUM = "organic_social";

export const SOCIAL_CONTENT_TYPES = Object.freeze(["news", "blog", "product", "site"]);

export const SOCIAL_UTM_CONTENT_VALUES = Object.freeze([
    "post",
    "story",
    "reel",
    "short",
    "bio",
    "share_button",
    "comment",
    "description",
]);

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CAMPAIGN_RE = /^[a-z0-9][a-z0-9_-]{0,80}$/i;

/**
 * @param {string} pathOrUrl Absolute https URL or site path starting with /
 * @param {object} options
 * @param {string} options.source utm_source
 * @param {string} [options.medium=organic_social]
 * @param {string} options.campaign utm_campaign
 * @param {string} [options.content] utm_content
 * @param {string} [options.term] utm_term (avoid PII)
 * @param {string} [options.siteOrigin=https://getcinnova.com]
 */
export function buildSocialUrl(pathOrUrl, options = {}) {
    const {
        source,
        medium = SOCIAL_UTM_MEDIUM,
        campaign,
        content,
        term,
        siteOrigin = "https://getcinnova.com",
    } = options;

    if (!SOCIAL_UTM_SOURCES.includes(source)) {
        throw new Error(`Invalid utm_source "${source}". Expected one of: ${SOCIAL_UTM_SOURCES.join(", ")}`);
    }
    if (medium !== SOCIAL_UTM_MEDIUM) {
        throw new Error(`Invalid utm_medium "${medium}". Organic social must use "${SOCIAL_UTM_MEDIUM}".`);
    }
    if (!campaign || !CAMPAIGN_RE.test(campaign)) {
        throw new Error("utm_campaign must be 1–81 chars of letters, numbers, _ or -");
    }
    if (content != null && content !== "" && !SOCIAL_UTM_CONTENT_VALUES.includes(content)) {
        throw new Error(`Invalid utm_content "${content}".`);
    }
    if (term != null && /@|email|phone|ssn/i.test(String(term))) {
        throw new Error("utm_term must not contain contact or sensitive identifiers");
    }

    const url = toAbsoluteUrl(pathOrUrl, siteOrigin);
    if (url.origin !== new URL(siteOrigin).origin && !url.hostname.endsWith("getcinnova.com")) {
        throw new Error("Social tracked URLs must target getcinnova.com");
    }

    url.searchParams.set("utm_source", source);
    url.searchParams.set("utm_medium", medium);
    url.searchParams.set("utm_campaign", campaign);
    if (content) url.searchParams.set("utm_content", content);
    if (term) url.searchParams.set("utm_term", String(term));

    return url.toString();
}

/**
 * Build a campaign id that is descriptive but not secret.
 * Example: 2026-07-28_news_meta-blackrock-el-paso
 */
export function buildSocialCampaign({ date, contentType, slug, maxSlugChars = 40 } = {}) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "")) {
        throw new Error("date must be YYYY-MM-DD");
    }
    if (!SOCIAL_CONTENT_TYPES.includes(contentType)) {
        throw new Error(`contentType must be one of: ${SOCIAL_CONTENT_TYPES.join(", ")}`);
    }
    if (!slug || !SLUG_RE.test(slug)) {
        throw new Error("slug must be lowercase kebab-case");
    }
    const short = slug.length > maxSlugChars ? slug.slice(0, maxSlugChars).replace(/-$/, "") : slug;
    return `${date}_${contentType}_${short}`;
}

export function buildNewsSocialUrl(slug, { source, content = "post", date, siteOrigin } = {}) {
    const campaign = buildSocialCampaign({
        date: date || todayUtc(),
        contentType: "news",
        slug,
    });
    return buildSocialUrl(`/news/${slug}`, { source, campaign, content, siteOrigin });
}

export function buildBlogSocialUrl(slug, { source, content = "post", date, siteOrigin } = {}) {
    const campaign = buildSocialCampaign({
        date: date || todayUtc(),
        contentType: "blog",
        slug,
    });
    return buildSocialUrl(`/blog/${slug}`, { source, campaign, content, siteOrigin });
}

export function stripSocialUtm(urlString) {
    const url = new URL(urlString);
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((key) => {
        url.searchParams.delete(key);
    });
    return url.toString();
}

export function parseSocialUtm(urlString) {
    const url = new URL(urlString);
    return {
        source: url.searchParams.get("utm_source"),
        medium: url.searchParams.get("utm_medium"),
        campaign: url.searchParams.get("utm_campaign"),
        content: url.searchParams.get("utm_content"),
        term: url.searchParams.get("utm_term"),
        isOrganicSocial: url.searchParams.get("utm_medium") === SOCIAL_UTM_MEDIUM,
    };
}

function toAbsoluteUrl(pathOrUrl, siteOrigin) {
    if (/^https?:\/\//i.test(pathOrUrl)) {
        return new URL(pathOrUrl);
    }
    if (!pathOrUrl.startsWith("/")) {
        throw new Error("pathOrUrl must be absolute http(s) or begin with /");
    }
    return new URL(pathOrUrl, siteOrigin.endsWith("/") ? siteOrigin : `${siteOrigin}/`);
}

function todayUtc() {
    return new Date().toISOString().slice(0, 10);
}
