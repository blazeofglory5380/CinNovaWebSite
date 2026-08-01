/**
 * Phase 12 — CinNova Commerce Platform shared constants.
 * Architecture only: no payments, checkout, or production accounts.
 */

export const COMMERCE_PLATFORM_PHASE = "12.0";

export const PRODUCT_CATEGORIES = Object.freeze({
    BOOK: "book",
    APPLICATION: "application",
    COURSE: "course",
    DOWNLOAD: "download",
    MEMBERSHIP: "membership",
    SERVICE: "service",
    BUNDLE: "bundle",
    RESOURCE: "resource",
});

export const PRODUCT_CATEGORY_LIST = Object.freeze(Object.values(PRODUCT_CATEGORIES));

export const PRODUCT_CATEGORY_LABELS = Object.freeze({
    [PRODUCT_CATEGORIES.BOOK]: "Book",
    [PRODUCT_CATEGORIES.APPLICATION]: "Application",
    [PRODUCT_CATEGORIES.COURSE]: "Course",
    [PRODUCT_CATEGORIES.DOWNLOAD]: "Download",
    [PRODUCT_CATEGORIES.MEMBERSHIP]: "Membership",
    [PRODUCT_CATEGORIES.SERVICE]: "Service",
    [PRODUCT_CATEGORIES.BUNDLE]: "Bundle",
    [PRODUCT_CATEGORIES.RESOURCE]: "Resource",
});

export const OWNERSHIP_TYPES = Object.freeze({
    PURCHASE: "purchase",
    SUBSCRIPTION: "subscription",
    LICENSE: "license",
    FREE: "free",
    BUNDLE: "bundle",
    ENTERPRISE: "enterprise",
    UNKNOWN: "unknown",
});

export const OWNERSHIP_TYPE_LIST = Object.freeze(Object.values(OWNERSHIP_TYPES));

export const LAUNCH_STATUSES = Object.freeze({
    CONCEPT: "concept",
    IN_DEVELOPMENT: "in_development",
    BETA: "beta",
    LAUNCHED: "launched",
    MATURE: "mature",
    RETIRED: "retired",
});

export const LAUNCH_STATUS_LIST = Object.freeze(Object.values(LAUNCH_STATUSES));

export const PLATFORM_TARGETS = Object.freeze({
    WEB: "web",
    IOS: "ios",
    ANDROID: "android",
    DESKTOP: "desktop",
    KINDLE: "kindle",
    PRINT: "print",
    API: "api",
    MULTI: "multi",
});

export const PLATFORM_TARGET_LIST = Object.freeze(Object.values(PLATFORM_TARGETS));

/** Unified availability aligned with Phase 11 commerce primitives. */
export const PRODUCT_AVAILABILITY = Object.freeze({
    AVAILABLE: "AVAILABLE",
    COMING_SOON: "COMING_SOON",
    IN_DEVELOPMENT: "IN_DEVELOPMENT",
    BETA: "BETA",
    UNAVAILABLE: "UNAVAILABLE",
});

export const PRODUCT_AVAILABILITY_LIST = Object.freeze(
    Object.values(PRODUCT_AVAILABILITY),
);

export const SUBSCRIPTION_TIERS = Object.freeze({
    FREE: "FREE",
    PLUS: "PLUS",
    PRO: "PRO",
    FAMILY: "FAMILY",
    TEAM: "TEAM",
    ENTERPRISE: "ENTERPRISE",
});

export const SUBSCRIPTION_TIER_LIST = Object.freeze(Object.values(SUBSCRIPTION_TIERS));

export const SUBSCRIPTION_TIER_LABELS = Object.freeze({
    [SUBSCRIPTION_TIERS.FREE]: "Free",
    [SUBSCRIPTION_TIERS.PLUS]: "Plus",
    [SUBSCRIPTION_TIERS.PRO]: "Pro",
    [SUBSCRIPTION_TIERS.FAMILY]: "Family",
    [SUBSCRIPTION_TIERS.TEAM]: "Team",
    [SUBSCRIPTION_TIERS.ENTERPRISE]: "Enterprise",
});

/** Architecture plan status — never ACTIVE with billing in Phase 12. */
export const SUBSCRIPTION_PLAN_STATUS = Object.freeze({
    ARCHITECTURE_ONLY: "ARCHITECTURE_ONLY",
    READY_TO_ACTIVATE: "READY_TO_ACTIVATE",
    ACTIVE: "ACTIVE",
    RETIRED: "RETIRED",
});

export const ENTITLEMENT_KINDS = Object.freeze({
    OWN: "own",
    ACCESS: "access",
    DOWNLOAD: "download",
    FEATURE: "feature",
    SEAT: "seat",
});

export const ENTITLEMENT_KIND_LIST = Object.freeze(Object.values(ENTITLEMENT_KINDS));

export const ENTITLEMENT_STATUS = Object.freeze({
    ACTIVE: "active",
    PENDING: "pending",
    EXPIRED: "expired",
    REVOKED: "revoked",
    SUSPENDED: "suspended",
});

export const ENTITLEMENT_STATUS_LIST = Object.freeze(Object.values(ENTITLEMENT_STATUS));

export const LICENSE_TYPES = Object.freeze({
    DIGITAL_BOOK: "digital_book",
    APPLICATION: "application",
    ENTERPRISE: "enterprise",
    COURSE: "course",
    BUNDLE: "bundle",
    MEMBERSHIP: "membership",
});

export const LICENSE_TYPE_LIST = Object.freeze(Object.values(LICENSE_TYPES));

export const LICENSE_STATES = Object.freeze({
    ACTIVE: "active",
    EXPIRED: "expired",
    PENDING: "pending",
    SUSPENDED: "suspended",
    CANCELLED: "cancelled",
});

export const LICENSE_STATE_LIST = Object.freeze(Object.values(LICENSE_STATES));

export const NOTIFICATION_CATEGORIES = Object.freeze({
    BOOKS: "books",
    APPLICATIONS: "applications",
    SUBSCRIPTIONS: "subscriptions",
    PRODUCT_UPDATES: "product_updates",
    RECOMMENDATIONS: "recommendations",
    PARTNER_STATUS: "partner_status",
    ACCOUNT_MESSAGES: "account_messages",
    SYSTEM_MESSAGES: "system_messages",
});

export const NOTIFICATION_CATEGORY_LIST = Object.freeze(
    Object.values(NOTIFICATION_CATEGORIES),
);

export const NOTIFICATION_SEVERITY = Object.freeze({
    INFO: "info",
    SUCCESS: "success",
    WARNING: "warning",
    CRITICAL: "critical",
});

export const DASHBOARD_SECTIONS = Object.freeze({
    PROFILE: "profile",
    PRODUCTS: "products",
    BOOKS: "books",
    APPLICATIONS: "applications",
    SUBSCRIPTIONS: "subscriptions",
    DOWNLOADS: "downloads",
    RECOMMENDATIONS: "recommendations",
    NOTIFICATIONS: "notifications",
    LICENSES: "licenses",
    INVOICES: "invoices",
    RECEIPTS: "receipts",
    SUPPORT: "support",
});

export const DASHBOARD_SECTION_LIST = Object.freeze(Object.values(DASHBOARD_SECTIONS));

export const RELATIONSHIP_KINDS = Object.freeze({
    RECOMMENDS: "recommends",
    UPGRADE_TO: "upgrade_to",
    BUNDLE_WITH: "bundle_with",
    SEQUEL: "sequel",
    COMPLEMENT: "complement",
    RESOURCE_FOR: "resource_for",
});

export const RELATIONSHIP_KIND_LIST = Object.freeze(Object.values(RELATIONSHIP_KINDS));

/** Future payment providers — declared only; never wired in Phase 12. */
export const FUTURE_PAYMENT_PROVIDERS = Object.freeze({
    STRIPE: "stripe",
    PAYPAL: "paypal",
    APPLE: "apple",
    GOOGLE: "google",
});

export const FUTURE_PAYMENT_PROVIDER_LIST = Object.freeze(
    Object.values(FUTURE_PAYMENT_PROVIDERS),
);

export const SUPPORT_STATUSES = Object.freeze({
    NONE: "none",
    OPEN: "open",
    PENDING: "pending",
    RESOLVED: "resolved",
    ESCALATED: "escalated",
});

export const SUPPORT_STATUS_LIST = Object.freeze(Object.values(SUPPORT_STATUSES));

/**
 * Catalog record lifecycle.
 * AUTHORITATIVE — adapted from Books / Phase 11 commerce / marketing product sources.
 * ARCHITECTURE_PLACEHOLDER — future SKU shape only; never public / purchasable / indexed.
 */
export const RECORD_KINDS = Object.freeze({
    AUTHORITATIVE: "authoritative",
    ARCHITECTURE_PLACEHOLDER: "architecture_placeholder",
});

export const RECORD_KIND_LIST = Object.freeze(Object.values(RECORD_KINDS));

/** Commercial analytics events that Phase 12 must never emit at runtime. */
export const FORBIDDEN_COMMERCE_ANALYTICS_EVENTS = Object.freeze([
    "purchase",
    "begin_checkout",
    "add_to_cart",
    "subscribe",
    "entitlement_granted",
    "license_activated",
]);
