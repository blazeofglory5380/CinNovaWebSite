/**
 * Phase M1 — legal / trust document content.
 * ATTORNEY_REVIEW_REQUIRED on all commercial legal pages.
 * Do not claim attorney review occurred.
 */

export const ATTORNEY_REVIEW_STATUS = "ATTORNEY_REVIEW_REQUIRED";

export const LEGAL_DOCUMENTS = Object.freeze({
    "affiliate-disclosure": {
        key: "affiliate-disclosure",
        title: "Affiliate Disclosure",
        titleKey: "affiliateDisclosureTitle",
        description:
            "How Cin Nova discloses affiliate and referral relationships, tracking, and editorial independence.",
        lastUpdated: "2026-08-11",
        attorneyReview: ATTORNEY_REVIEW_STATUS,
        sections: [
            {
                title: "Overview",
                body: [
                    "Some links on getcinnova.com may be affiliate or referral links. If you click and later purchase, Cin Nova may earn a commission at no extra cost to you.",
                    "Affiliate relationships never invent partnerships. Links are only activated when a partner program is verified and feature flags allow commercial affiliate destinations.",
                ],
            },
            {
                title: "Where disclosures appear",
                body: [
                    "When an affiliate-enabled commercial module is shown, a visible disclosure appears near the offer.",
                    "Outbound affiliate links use appropriate rel attributes (typically sponsored and noopener noreferrer) and do not use deceptive buttons or hidden redirects.",
                ],
            },
            {
                title: "Editorial independence",
                body: [
                    "Editorial conclusions, rankings, and safety guidance are independent of commission rates. Commission does not change PoisonGuard, medical, or safety-critical guidance.",
                    "Sponsored or branded content, when published, must be clearly labeled.",
                ],
            },
            {
                title: "Tracking",
                body: [
                    "Privacy-safe analytics may record affiliate link views and clicks with partner id, category, placement, page type, locale, and optional campaign id.",
                    "We do not log personal data, exact IP, raw search terms, health/scanner content, or API secrets in affiliate event payloads.",
                ],
            },
        ],
    },
    "refund-policy": {
        key: "refund-policy",
        title: "Refund Policy",
        titleKey: "refundPolicyTitle",
        description: "Refund expectations for future Cin Nova hosted digital and physical products.",
        lastUpdated: "2026-08-11",
        attorneyReview: ATTORNEY_REVIEW_STATUS,
        sections: [
            {
                title: "Current status",
                body: [
                    "Hosted Cin Nova checkout and payments are not live. There are no Cin Nova-hosted paid orders to refund at this time.",
                    "Third-party purchases (for example Amazon Kindle titles) follow that retailer’s refund rules.",
                ],
            },
            {
                title: "Future hosted purchases",
                body: [
                    "When hosted payments activate, refund eligibility, windows, and digital revocation rules will be published here before sales begin.",
                    "Digital entitlements may be revoked after an approved refund.",
                ],
            },
        ],
    },
    "digital-product-terms": {
        key: "digital-product-terms",
        title: "Digital Product Terms",
        titleKey: "digitalProductTermsTitle",
        description: "License and delivery terms for future Cin Nova digital downloads and apps.",
        lastUpdated: "2026-08-11",
        attorneyReview: ATTORNEY_REVIEW_STATUS,
        sections: [
            {
                title: "License",
                body: [
                    "Digital products are licensed for personal or permitted commercial use as stated on each product page. Redistribution of paid files is not allowed unless expressly stated.",
                    "Unpublished manuscripts and source files are never exposed through public download URLs.",
                ],
            },
            {
                title: "Delivery",
                body: [
                    "Paid downloads will use server-validated entitlements and time-limited signed access where appropriate. Client-side-only unlocks are not used.",
                ],
            },
        ],
    },
    "cookie-policy": {
        key: "cookie-policy",
        title: "Cookie Policy",
        titleKey: "cookiePolicyTitle",
        description: "How Cin Nova uses cookies and similar technologies on getcinnova.com.",
        lastUpdated: "2026-08-11",
        attorneyReview: ATTORNEY_REVIEW_STATUS,
        sections: [
            {
                title: "Analytics",
                body: [
                    "We may use Google Analytics 4 cookies or similar technologies to measure traffic and interactions. See the Privacy Policy for details.",
                    "You can limit analytics via browser settings, extensions, or Google opt-out tools.",
                ],
            },
            {
                title: "Essential storage",
                body: [
                    "localStorage may store newsletter dismissal flags, drafts for admin tools, and similar site preferences on your device.",
                ],
            },
        ],
    },
    disclaimer: {
        key: "disclaimer",
        title: "Disclaimer",
        titleKey: "disclaimerTitle",
        description: "General informational disclaimer for Cin Nova content and products.",
        lastUpdated: "2026-08-11",
        attorneyReview: ATTORNEY_REVIEW_STATUS,
        sections: [
            {
                title: "Informational content",
                body: [
                    "Website content is for general information. It is not professional legal, medical, veterinary, financial, or emergency advice.",
                    "PoisonGuard and safety content do not replace emergency services or poison control. In an emergency, call local emergency numbers.",
                ],
            },
            {
                title: "AI limitations",
                body: [
                    "AI-assisted features can be wrong. Verify important decisions independently.",
                ],
            },
        ],
    },
    accessibility: {
        key: "accessibility",
        title: "Accessibility Statement",
        titleKey: "accessibilityTitle",
        description: "Cin Nova accessibility goals for monetization and public surfaces.",
        lastUpdated: "2026-08-11",
        attorneyReview: ATTORNEY_REVIEW_STATUS,
        sections: [
            {
                title: "Commitment",
                body: [
                    "We aim for keyboard access, screen-reader usability, visible focus, adequate touch targets, reduced-motion respect, and accessible form errors on monetization surfaces.",
                    "If you encounter a barrier, contact us via the Contact page and describe the page and issue.",
                ],
            },
        ],
    },
    dmca: {
        key: "dmca",
        title: "Copyright / DMCA",
        titleKey: "dmcaTitle",
        description: "Copyright notice and DMCA-style takedown contact for Cin Nova content.",
        lastUpdated: "2026-08-11",
        attorneyReview: ATTORNEY_REVIEW_STATUS,
        sections: [
            {
                title: "Ownership",
                body: [
                    "Cin Nova content, branding, and product materials are protected by applicable intellectual property laws unless otherwise noted.",
                ],
            },
            {
                title: "Notices",
                body: [
                    "To report alleged copyright infringement on this site, use the Contact page with “Copyright Notice” in the subject and include the URL, your contact details, and a description of the work.",
                    "Formal statutory notice procedures may require attorney guidance; this page is not legal advice.",
                ],
            },
        ],
    },
    "sponsorship-disclosure": {
        key: "sponsorship-disclosure",
        title: "Sponsorship & Advertising Disclosure",
        titleKey: "sponsorshipDisclosureTitle",
        description: "How Cin Nova labels sponsorships, branded content, and advertising inquiries.",
        lastUpdated: "2026-08-11",
        attorneyReview: ATTORNEY_REVIEW_STATUS,
        sections: [
            {
                title: "Labels",
                body: [
                    "Sponsored articles, newsletter sponsorships, and branded content will be clearly labeled when published.",
                    "Intrusive ad networks are not enabled. Ads will not appear inside PoisonGuard emergency flows, scanner safety results, or medical/safety-critical content.",
                ],
            },
            {
                title: "Inquiries",
                body: [
                    "Sponsorship and advertising inquiries use Media Kit, Advertise, Sponsor Newsletter, Partner With Us, and Contact Sales pages.",
                ],
            },
        ],
    },
});

export function getLegalDocument(key) {
    return LEGAL_DOCUMENTS[key] || null;
}

export function listLegalDocuments() {
    return Object.values(LEGAL_DOCUMENTS);
}
