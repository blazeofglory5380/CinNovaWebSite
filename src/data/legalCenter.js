/**
 * CinNova Legal Center — policy documents rendered by `/legal/*`.
 *
 * The existing Privacy Policy (`/privacy`) and Terms of Service (`/terms`) keep
 * their established URLs and their own page components; they are referenced
 * from the index here but not moved or rewritten.
 *
 * These documents are written to be accurate about how the site actually works.
 * They are not a substitute for review by a qualified lawyer in the operating
 * jurisdiction — `LEGAL_REVIEW_STATUS` records that honestly, and the Legal
 * Center index states it to the reader.
 */

import { siteUrl } from "./blogPosts.js";

export const LEGAL_CONTACT_EMAIL = "thin_line_99@yahoo.com";
export const LEGAL_EFFECTIVE_DATE = "2026-08-04";
export const LEGAL_ENTITY = "Cin Nova";

/** Honest state of professional review. Surfaced on the Legal Center index. */
export const LEGAL_REVIEW_STATUS = {
    reviewedByCounsel: false,
    note:
        "These documents describe how the site works today and were written in-house. They have not yet been reviewed by a qualified lawyer, and they are not legal advice.",
};

/**
 * Documents that live under /legal/<slug>. `key` doubles as the router page key
 * (prefixed `legal-`) and must stay in sync with publicPageRoutes.js.
 */
export const legalDocuments = [
    {
        key: "affiliate-disclosure",
        slug: "affiliate-disclosure",
        pageKey: "legal-affiliate-disclosure",
        title: "Affiliate Disclosure",
        summary:
            "How CinNova handles partner recommendations, when a link may earn a commission, and what that does and does not change about the recommendation.",
        sections: [
            {
                heading: "Current status",
                body: [
                    "No affiliate link on this site is active. CinNova's affiliate system is switched off at the application level, and no partner has been activated, so no outbound commercial link is rendered anywhere on the site today.",
                    "This disclosure is published in advance so that the rules are set before any commercial relationship exists, rather than written to justify one afterwards.",
                ],
            },
            {
                heading: "How the switch works",
                body: [
                    "Activation requires two independent conditions to be true at the same time, and the system fails closed if either is missing:",
                ],
                list: [
                    "A build-time master switch for the whole affiliate programme must be explicitly enabled.",
                    "The individual partner must be separately marked as active, with a destination that passes URL and host validation.",
                    "Until both hold, the link is not rendered at all — a disabled partner produces no href, not a fallback link.",
                ],
            },
            {
                heading: "What will change once a partner is activated",
                body: [
                    "When a partner is activated, its link may earn CinNova a commission if you sign up or buy. The price you pay is never increased by using such a link.",
                ],
                list: [
                    "Commercial links carry rel=\"sponsored nofollow\" so search engines can identify them.",
                    "A disclosure is shown with the link itself, not only in this policy.",
                    "Commercial destinations are supplied at deploy time and are never committed to the codebase, so no tracking identifier lives in the public source.",
                ],
            },
            {
                heading: "How recommendations are chosen",
                body: [
                    "Partners are selected because they are useful for a problem CinNova readers actually have. A commission arrangement does not buy a recommendation, a ranking position, or the removal of a criticism.",
                    "Where CinNova lists a company it is researching or has applied to, that listing is a research record. It does not claim a partnership, an approval, or an active commercial relationship.",
                ],
            },
            {
                heading: "Partners with no commercial relationship",
                body: [
                    "Some partners are referenced with no commission at all. Links to those are plain, non-commercial links and carry no sponsored marking, because there is nothing to disclose.",
                ],
            },
            {
                heading: "Sponsored content",
                body: [
                    "Sponsored articles and newsletter placements are a separate arrangement from affiliate links and are always labelled as sponsored at the top of the content. Editorial articles are never sold.",
                ],
            },
        ],
    },
    {
        key: "cookie-policy",
        slug: "cookie-policy",
        pageKey: "legal-cookie-policy",
        title: "Cookie Policy",
        summary:
            "What CinNova stores in your browser, why, and how to remove it — including the difference between cookies and local storage.",
        sections: [
            {
                heading: "What this site stores",
                body: [
                    "CinNova stores a small amount of data in your browser. Most of it is not a cookie in the technical sense — it is localStorage or sessionStorage, which stays on your device and is never transmitted with a request.",
                ],
                list: [
                    "Session flags that remember you dismissed a newsletter prompt, so it does not reappear on every page.",
                    "Newsletter preference selections you make on the preference page, held only in your browser and never sent to CinNova.",
                    "Analytics identifiers set by Google Analytics 4, described below.",
                ],
            },
            {
                heading: "Analytics",
                body: [
                    "CinNova uses Google Analytics 4 to understand which pages are read and which are not. GA4 sets its own cookies to distinguish one visit from another. It is configured for aggregate reporting; CinNova does not use it to build an advertising profile of you.",
                    "If you block analytics cookies, the site works normally. Nothing on CinNova depends on analytics being available.",
                ],
            },
            {
                heading: "Advertising cookies",
                body: [
                    "CinNova does not currently run a third-party advertising network, and no advertising cookies are set. Sponsorships are sold directly and served as plain content, with no tracking script.",
                    "If that changes, this policy will be updated before any advertising script is added, and the change will be dated below.",
                ],
            },
            {
                heading: "How to remove stored data",
                body: [
                    "Every major browser lets you clear cookies and site data for a single site from its settings, usually under Privacy. Clearing CinNova's site data removes your saved newsletter preferences and dismissal flags along with analytics cookies.",
                    "Browser extensions that block trackers will also prevent the analytics script from loading. The site does not detect or object to this.",
                ],
            },
            {
                heading: "Third parties",
                body: [
                    "Embedded content from another provider — for example a video player — can set its own cookies under that provider's policy. CinNova keeps third-party embeds to a minimum for this reason.",
                ],
            },
        ],
    },
    {
        key: "disclaimer",
        slug: "disclaimer",
        pageKey: "legal-disclaimer",
        title: "Disclaimer",
        summary:
            "The limits of what CinNova content is: informational, not professional advice, and generated in part with AI tools that can be wrong.",
        sections: [
            {
                heading: "Informational purpose only",
                body: [
                    "Everything published on CinNova — articles, guides, news, calculators, and product pages — is for general information. It is not professional advice and must not be relied on as a substitute for a qualified professional who knows your situation.",
                ],
            },
            {
                heading: "Financial and real estate content",
                body: [
                    "Real estate calculators and investment articles produce illustrative figures from the numbers you enter. They do not account for your tax position, local regulation, financing terms, or risk tolerance, and they are not investment advice. Consult a licensed financial adviser, accountant, or real estate professional before making a decision.",
                ],
            },
            {
                heading: "Health and safety content",
                body: [
                    "Household safety and poison-related content is educational. It is not medical advice and it is not an emergency service. If you suspect a poisoning or a medical emergency, contact your local emergency number or poison control centre immediately.",
                ],
            },
            {
                heading: "AI-assisted content",
                body: [
                    "Some CinNova content is drafted with AI assistance and reviewed by a person before publication. AI tools can produce confident, incorrect statements. Where a claim matters, CinNova links to the primary source so you can check it yourself, and you should.",
                ],
            },
            {
                heading: "Accuracy and currency",
                body: [
                    "Software pricing, features, and availability change frequently. CinNova deliberately avoids quoting specific prices for third-party products for this reason and links to the vendor's own page instead. Where a date matters, it is stated on the page.",
                ],
            },
            {
                heading: "External links",
                body: [
                    "CinNova links to external sites it does not control and is not responsible for their content, accuracy, or practices. A link is not an endorsement of everything on the destination site.",
                ],
            },
        ],
    },
    {
        key: "accessibility",
        slug: "accessibility",
        pageKey: "legal-accessibility",
        title: "Accessibility Statement",
        summary:
            "The accessibility standard CinNova builds to, what is known to fall short, and how to report a barrier.",
        sections: [
            {
                heading: "Our commitment",
                body: [
                    "CinNova aims to meet WCAG 2.1 Level AA. Accessibility is treated as part of building a page, not a later audit — semantic structure, keyboard operability, and colour contrast are checked as pages are built.",
                ],
            },
            {
                heading: "What is in place",
                body: [],
                list: [
                    "Semantic headings with a single H1 per page and a logical heading order.",
                    "Keyboard operability for navigation, menus, dialogs, and every interactive control.",
                    "Visible focus indicators that are not removed by styling.",
                    "Text alternatives on informative images; decorative images marked as such.",
                    "Colour contrast checked against WCAG AA for body and interface text.",
                    "Respect for the reduced-motion system preference on animated sections.",
                    "Layouts that reflow to 320 pixels wide without horizontal scrolling.",
                ],
            },
            {
                heading: "Known limitations",
                body: [
                    "Being specific is more useful than claiming full conformance. The following are known and open:",
                ],
                list: [
                    "Some cinematic hero videos have no descriptive text alternative for their visual content.",
                    "A small number of older interactive demos have not been re-tested with a screen reader since their last revision.",
                    "Third-party embedded content is outside CinNova's control and may not meet the same standard.",
                ],
            },
            {
                heading: "Assistive technology",
                body: [
                    "Pages are checked with keyboard-only navigation and browser accessibility inspection tools. Formal testing across the full range of screen readers has not been completed, so reports from real users of assistive technology are especially valuable.",
                ],
            },
            {
                heading: "Reporting a barrier",
                body: [
                    `If something on CinNova is difficult or impossible to use, email ${LEGAL_CONTACT_EMAIL} with the page address and what happened. Reports are read by a person, and a reply should be expected within five business days.`,
                    "If a barrier prevents you from reaching information you need, say so in the message and the content will be provided in another format.",
                ],
            },
        ],
    },
    {
        key: "dmca",
        slug: "dmca",
        pageKey: "legal-dmca",
        title: "DMCA Notice & Takedown",
        summary:
            "How to submit a copyright infringement notice, what a valid notice must contain, and how to file a counter-notice.",
        sections: [
            {
                heading: "Reporting infringement",
                body: [
                    `CinNova responds to properly submitted notices of claimed copyright infringement under the United States Digital Millennium Copyright Act. Send notices to ${LEGAL_CONTACT_EMAIL} with "DMCA Notice" in the subject line.`,
                ],
            },
            {
                heading: "What a valid notice must include",
                body: ["A notice that omits any of the following cannot be acted on:"],
                list: [
                    "A physical or electronic signature of the copyright owner or a person authorised to act for them.",
                    "Identification of the copyrighted work claimed to have been infringed.",
                    "Identification of the material claimed to be infringing, with enough detail to locate it — a full URL is best.",
                    "Your contact details: name, postal address, telephone number, and email address.",
                    "A statement that you believe in good faith that the use is not authorised by the copyright owner, its agent, or the law.",
                    "A statement, under penalty of perjury, that the information in the notice is accurate and that you are authorised to act on the owner's behalf.",
                ],
            },
            {
                heading: "What happens next",
                body: [
                    "Valid notices are acted on promptly. Material identified in a valid notice is removed or disabled, and the person who posted it is notified where CinNova has a way to reach them.",
                ],
            },
            {
                heading: "Counter-notice",
                body: [
                    "If your material was removed and you believe that was a mistake or a misidentification, you may send a counter-notice to the same address. A counter-notice must identify the removed material and its former location, include your contact details, include a statement under penalty of perjury that you believe in good faith the removal was a mistake, and include your consent to the jurisdiction of an appropriate federal court.",
                ],
            },
            {
                heading: "Misuse",
                body: [
                    "Knowingly making a material misrepresentation in a notice or counter-notice carries liability under United States law. Notices sent to suppress criticism or competition rather than to protect a copyright will be treated accordingly.",
                ],
            },
        ],
    },
    {
        key: "copyright",
        slug: "copyright",
        pageKey: "legal-copyright",
        title: "Copyright & Content Use",
        summary:
            "Who owns CinNova content, what you may reuse without asking, and the licence attached to purchased digital products.",
        sections: [
            {
                heading: "Ownership",
                body: [
                    `Unless stated otherwise, all content on this site — articles, guides, news reporting, illustrations, cinematic imagery, product copy, and code — is © ${new Date(LEGAL_EFFECTIVE_DATE).getFullYear()} ${LEGAL_ENTITY}. Product names and logos of other companies belong to their respective owners and appear here for identification only.`,
                ],
            },
            {
                heading: "What you may do without asking",
                body: [],
                list: [
                    "Quote a short excerpt — roughly a paragraph — with clear attribution and a link to the original page.",
                    "Link to any page on the site, including deep links to specific articles.",
                    "Share pages on social media using the share controls provided.",
                    "Print a page for personal, non-commercial reference.",
                ],
            },
            {
                heading: "What requires permission",
                body: [],
                list: [
                    "Republishing an article in full or in substantial part, on any platform.",
                    "Using CinNova imagery, illustrations, or video outside the terms of the brand-assets page.",
                    "Training a machine learning model on CinNova content as a distinct dataset.",
                    "Any commercial reuse not covered by the excerpt allowance above.",
                ],
            },
            {
                heading: "Books and other published works",
                body: [
                    "CinNova books are sold through external retailers, not through a CinNova checkout — the site takes no payment and hosts no purchasable file. What you may do with a copy you buy is governed by the retailer's terms and the licence printed in the work itself.",
                    "Reselling, redistributing, or repackaging a CinNova work is not permitted in any case.",
                ],
            },
            {
                heading: "Third-party material",
                body: [
                    "Where CinNova uses photography or other material under an external licence, the credit and licence are recorded on the page or in the site's image credits. If you believe something is used without a proper licence, see the DMCA page.",
                ],
            },
            {
                heading: "Requesting permission",
                body: [
                    `Send permission requests to ${LEGAL_CONTACT_EMAIL} describing what you want to use, where it will appear, and for how long. Reasonable non-commercial requests are usually granted.`,
                ],
            },
        ],
    },
];

const DOC_BY_KEY = new Map(legalDocuments.map((doc) => [doc.key, doc]));
const DOC_BY_PAGE_KEY = new Map(legalDocuments.map((doc) => [doc.pageKey, doc]));

export const LEGAL_DOCUMENT_KEYS = legalDocuments.map((doc) => doc.key);
export const LEGAL_PAGE_KEYS = new Set(legalDocuments.map((doc) => doc.pageKey));

export function getLegalDocument(key) {
    return DOC_BY_KEY.get(key) || null;
}

export function getLegalDocumentByPageKey(pageKey) {
    return DOC_BY_PAGE_KEY.get(pageKey) || null;
}

export function getLegalUrl() {
    return `${siteUrl}/legal`;
}

export function getLegalDocumentUrl(docOrSlug) {
    const slug = typeof docOrSlug === "string" ? docOrSlug : docOrSlug?.slug;
    return slug ? `${siteUrl}/legal/${slug}` : getLegalUrl();
}

/**
 * The full legal index, including the two documents that keep their original
 * top-level URLs. `external: true` marks those so the index links out to the
 * existing page rather than expecting a /legal/* route.
 */
export function getLegalIndex() {
    return [
        {
            title: "Privacy Policy",
            summary: "What data the site collects, how it is used, and the rights you have over it.",
            path: "/privacy",
            pageKey: "privacy",
            external: true,
        },
        {
            title: "Terms of Service",
            summary: "The terms governing use of the site, acceptable use, and limitation of liability.",
            path: "/terms",
            pageKey: "terms",
            external: true,
        },
        ...legalDocuments.map((doc) => ({
            title: doc.title,
            summary: doc.summary,
            path: `/legal/${doc.slug}`,
            pageKey: doc.pageKey,
            external: false,
        })),
    ];
}
