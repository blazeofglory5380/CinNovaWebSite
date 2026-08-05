/**
 * Newsletter program — editions, welcome sequence, preferences, and archive.
 *
 * Complements `newsletterService.js`, which owns subscriber storage and provider
 * sync. This file owns the *program*: what a reader can subscribe to, what
 * arrives after they do, and what they can change afterwards.
 *
 * Integrity notes:
 *   - `newsletterArchive` is empty because no issue has been sent yet. The
 *     archive page renders an honest empty state rather than sample issues.
 *   - No subscriber counts, open rates, or click rates appear here. The site
 *     publishes no audience metrics it cannot verify.
 *   - `NEWSLETTER_PREMIUM.enabled` is false; the paid tier is described as a
 *     plan, not sold.
 */

import { siteUrl } from "./blogPosts.js";

export const NEWSLETTER_FROM_NAME = "Cin Nova";
export const NEWSLETTER_CONTACT_EMAIL = "thin_line_99@yahoo.com";

/**
 * Subscribable editions. `key` is stored on the subscriber record as a tag, so
 * renaming one is a data migration — add a new key instead.
 */
export const NEWSLETTER_CATEGORIES = [
    {
        key: "ai-tools",
        label: "AI & Tools",
        cadence: "Weekly",
        blurb: "What changed in the AI tools people actually use, and whether it matters.",
        contains: [
            "One tool change explained in plain language",
            "A prompt or workflow worth stealing",
            "Links to the primary sources, not to coverage of coverage",
        ],
        defaultOn: true,
    },
    {
        key: "learning",
        label: "Learning & Study",
        cadence: "Fortnightly",
        blurb: "Study methods that hold up, and StudyNest progress.",
        contains: [
            "One technique with the evidence behind it",
            "A printable or template when one fits",
            "Product notes when StudyNest ships something",
        ],
        defaultOn: true,
    },
    {
        key: "real-estate",
        label: "Real Estate",
        cadence: "Monthly",
        blurb: "Deal analysis, market context, and calculator updates.",
        contains: [
            "One worked deal analysis",
            "Market context with sources",
            "Changes to the free rental calculator",
        ],
        defaultOn: false,
    },
    {
        key: "family-safety",
        label: "Family & Safety",
        cadence: "Monthly",
        blurb: "Household safety, PoisonGuard research, and practical checklists.",
        contains: [
            "One household hazard explained properly",
            "A checklist or storage guide",
            "PoisonGuard development notes",
        ],
        defaultOn: false,
    },
    {
        key: "build-log",
        label: "Build Log",
        cadence: "Monthly",
        blurb: "How the products and this site are actually being built, including the failures.",
        contains: [
            "What shipped and what broke",
            "One technical decision explained",
            "Roadmap changes with the reasoning",
        ],
        defaultOn: false,
    },
    {
        key: "store",
        label: "Launches & Offers",
        cadence: "Occasional",
        blurb: "New store products and sales. Only sent when there is something to send.",
        contains: [
            "New product releases",
            "Sale periods, announced once and not repeated daily",
            "Subscriber-only pricing when it exists",
        ],
        defaultOn: false,
    },
];

export const NEWSLETTER_CATEGORY_KEYS = NEWSLETTER_CATEGORIES.map((category) => category.key);

const CATEGORY_BY_KEY = new Map(NEWSLETTER_CATEGORIES.map((category) => [category.key, category]));

export function getNewsletterCategory(key) {
    return CATEGORY_BY_KEY.get(key) || null;
}

/** Categories a new subscriber starts with unless they choose otherwise. */
export function getDefaultCategoryKeys() {
    return NEWSLETTER_CATEGORIES.filter((category) => category.defaultOn).map((category) => category.key);
}

/** Delivery frequency caps a subscriber can choose. */
export const NEWSLETTER_FREQUENCIES = [
    { key: "as-published", label: "As published", note: "Each edition arrives when it is written." },
    { key: "weekly-digest", label: "Weekly digest", note: "One email a week combining everything selected." },
    { key: "monthly-digest", label: "Monthly digest", note: "One email a month. The quietest option that still arrives." },
];

export const NEWSLETTER_FORMATS = [
    { key: "rich", label: "Formatted", note: "Headings, links, and images." },
    { key: "plain", label: "Plain text", note: "No images or tracking pixels. Best for screen readers and slow connections." },
];

/**
 * The automated sequence a new subscriber receives. Described here so the
 * program is documented and reviewable before any provider automation is built.
 */
export const WELCOME_SEQUENCE = [
    {
        step: 1,
        timing: "Immediately",
        subject: "You're in — here's what to expect",
        purpose: "Confirm the subscription, set the cadence expectation, and link the preference page.",
        contains: [
            "Which editions were selected and how often they arrive",
            "A one-click link to the preference page",
            "The unsubscribe link, in the first email, not buried later",
        ],
    },
    {
        step: 2,
        timing: "Day 2",
        subject: "The three guides worth reading first",
        purpose: "Deliver value immediately from existing free material.",
        contains: ["Prompt-writing guide", "AI research guide", "AI workspace setup guide"],
    },
    {
        step: 3,
        timing: "Day 5",
        subject: "A free resource you can use today",
        purpose: "Point to the resource library and let the reader pick by their own interest.",
        contains: ["Study planner template", "Real estate deal-analysis template", "Household safety checklist"],
    },
    {
        step: 4,
        timing: "Day 9",
        subject: "What CinNova is building, and why",
        purpose: "Explain the product ecosystem once, so later product mentions have context.",
        contains: ["The five products in one paragraph each", "The roadmap in its current honest state"],
    },
    {
        step: 5,
        timing: "Day 14",
        subject: "Tell us what you want more of",
        purpose: "Ask a single question and route the answer into the preference categories.",
        contains: ["One question, one click", "A reminder that preferences can change at any time"],
    },
];

/**
 * Published issues. Empty until the first send — the archive page renders an
 * honest empty state rather than fabricated back issues.
 */
export const newsletterArchive = [];

export const ARCHIVE_STATUS = {
    published: newsletterArchive.length,
    note:
        "No issues have been sent yet. When the first edition goes out it will be archived here as a permanent, linkable page.",
};

/** Privacy controls a subscriber has, and how each one is exercised. */
export const NEWSLETTER_PRIVACY_CONTROLS = [
    {
        key: "unsubscribe",
        title: "Unsubscribe from everything",
        detail:
            "Every email carries a one-click unsubscribe link in its header and footer. Unsubscribing takes effect immediately and requires no reply or explanation.",
    },
    {
        key: "granular",
        title: "Change what you receive",
        detail:
            "Editions can be turned on and off individually, and delivery can be capped to a weekly or monthly digest, without leaving the list entirely.",
    },
    {
        key: "plain-text",
        title: "Turn off tracking pixels",
        detail:
            "Choosing plain-text delivery removes the open-tracking pixel. Link tracking is not applied to plain-text sends.",
    },
    {
        key: "export",
        title: "Request your data",
        detail: `Email ${NEWSLETTER_CONTACT_EMAIL} and the record held for your address will be sent to you within 30 days.`,
    },
    {
        key: "delete",
        title: "Request deletion",
        detail:
            "Deletion removes the subscriber record entirely, not just the subscription status. Once deleted it cannot be restored.",
    },
    {
        key: "no-sale",
        title: "No selling or sharing",
        detail:
            "Subscriber addresses are never sold, rented, or shared with sponsors. A sponsor buys placement in an issue; they never receive the list.",
    },
];

/** Planned paid tier. Described, not sold. */
export const NEWSLETTER_PREMIUM = {
    enabled: false,
    name: "CinNova Premium",
    status: "Planned — not available",
    summary:
        "A paid tier is planned once the free newsletter has a consistent publishing record. Nothing is on sale, and no payment is collected.",
    plannedBenefits: [
        "Full archive access including deep-dive editions",
        "Store discounts for subscribers",
        "Early access to new products before public release",
        "Ad-free and sponsor-free editions",
    ],
    commitments: [
        "The free newsletter stays free and stays useful. Premium adds, it does not subtract.",
        "No paywalling of anything already published free.",
        "Price and terms will be published before any signup opens.",
    ],
};

export function getNewsletterUrl() {
    return `${siteUrl}/newsletter`;
}

export function getNewsletterArchiveUrl() {
    return `${siteUrl}/newsletter/archive`;
}

export function getNewsletterPreferencesUrl() {
    return `${siteUrl}/newsletter/preferences`;
}

/** Validate and normalise a preference selection before it is stored. */
export function normalizePreferences(input = {}) {
    const requested = Array.isArray(input.categories) ? input.categories : [];
    const categories = requested.filter((key) => CATEGORY_BY_KEY.has(key));
    const frequency = NEWSLETTER_FREQUENCIES.some((option) => option.key === input.frequency)
        ? input.frequency
        : "as-published";
    const format = NEWSLETTER_FORMATS.some((option) => option.key === input.format) ? input.format : "rich";
    return {
        categories: categories.length ? categories : getDefaultCategoryKeys(),
        frequency,
        format,
    };
}
