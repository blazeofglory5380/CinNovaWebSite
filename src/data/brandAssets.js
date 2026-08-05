/**
 * Brand and press asset definitions.
 *
 * Assets are generated as text files in the browser (see
 * `src/utils/downloadTextAsset.js`) rather than served as committed binaries, so
 * no download link can 404 and the content always matches this file. The
 * `format` field records what the eventual binary version will be; today every
 * asset ships as the text equivalent, and the page says so.
 */

import { siteUrl } from "./blogPosts.js";

export const PRESS_CONTACT_EMAIL = "thin_line_99@yahoo.com";

/** Colour system. Values mirror the tokens used across the site. */
export const brandColors = [
    { name: "Ink", hex: "#131720", usage: "Primary text and headings" },
    { name: "Signal Blue", hex: "#2457D6", usage: "Links, primary actions, focus states" },
    { name: "Deep Violet", hex: "#4F46E5", usage: "Secondary accent and gradients" },
    { name: "Midnight", hex: "#0F172A", usage: "Dark surfaces and cinematic panels" },
    { name: "Paper", hex: "#FFFFFF", usage: "Light surfaces" },
    { name: "Mist", hex: "#F6F7F9", usage: "Soft section backgrounds" },
    { name: "Border", hex: "#E3E6EC", usage: "Dividers and card outlines" },
];

export const brandTypography = [
    { role: "Headings", stack: "system-ui, -apple-system, 'Segoe UI', Roboto, Inter, Arial, sans-serif", note: "Weight 600–700, tight leading." },
    { role: "Body", stack: "system-ui, -apple-system, 'Segoe UI', Roboto, Inter, Arial, sans-serif", note: "Weight 400, 1.6–1.7 line height." },
    { role: "Code and data", stack: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", note: "Used for identifiers and technical values only." },
];

export const logoUsageRules = {
    permitted: [
        "Use the wordmark or the CN monogram to identify Cin Nova in an article, review, or partner listing.",
        "Scale the logo proportionally, keeping clear space equal to the height of the N on every side.",
        "Place the light logo on dark backgrounds and the dark logo on light backgrounds.",
        "Use the logo in a comparison or roundup alongside other companies' marks.",
    ],
    prohibited: [
        "Do not stretch, rotate, skew, or recolour the logo.",
        "Do not add effects — shadows, outlines, gradients, or glows — to the mark.",
        "Do not place the logo on a busy photograph without a solid backing shape.",
        "Do not use the logo to imply endorsement, partnership, or certification that does not exist.",
        "Do not incorporate the logo or the name into your own product name, logo, or domain.",
        "Do not use a modified or redrawn version of the mark.",
    ],
};

/** Approved facts a journalist may quote without checking back. */
export const pressFacts = [
    { label: "Company", value: "Cin Nova" },
    { label: "What it does", value: "Builds practical AI software across education, household safety, tech support, early learning, and real estate." },
    { label: "Website", value: siteUrl },
    { label: "Products", value: "StudyNest, PoisonGuard, TechMate AI, Kiddo, Cin Nova Real Estate AI" },
    { label: "Publishing", value: "A news desk, a blog, and a free guide library covering AI tools and practical workflows." },
    { label: "Stage", value: "Products range from concept stage to active build. None is a general-availability commercial release." },
    { label: "Press contact", value: PRESS_CONTACT_EMAIL },
];

export const companyBoilerplate = {
    short:
        "Cin Nova builds practical AI software for learning, household safety, tech support, early learning, and real estate, alongside a free library of guides and reporting on the AI tools people actually use.",
    long:
        "Cin Nova is a multi-product software company building practical AI tools for everyday problems: StudyNest for active-recall studying, PoisonGuard for household and pet chemical safety, TechMate AI for everyday tech troubleshooting, Kiddo for early learning, and Cin Nova Real Estate AI for property and deal analysis. Alongside the products, Cin Nova publishes a news desk, a blog, and a free library of step-by-step guides covering the AI tools people actually use, with a stated editorial rule that nothing is published without a verifiable source.",
};

export const productOneLiners = [
    { name: "StudyNest", line: "AI study tools that turn notes into flashcards, quizzes, and a spaced-repetition schedule.", stage: "In development" },
    { name: "PoisonGuard", line: "A household and pet chemical safety assistant with hazard lookup and emergency guidance.", stage: "In development" },
    { name: "TechMate AI", line: "An AI troubleshooting assistant that diagnoses everyday device problems in plain language.", stage: "Concept stage" },
    { name: "Kiddo", line: "An early-learning platform for ABCs, reading, and counting, with a parent progress view.", stage: "Concept stage" },
    { name: "Cin Nova Real Estate AI", line: "Property and deal analysis tools covering cash flow, cap rate, and market context.", stage: "Active build" },
];

/** Downloadable asset definitions rendered on the Press Kit and Brand Assets pages. */
export const downloadableAssets = [
    {
        key: "press-kit",
        title: "Press kit",
        description: "Boilerplate, product one-liners, approved facts, and press contact details in one file.",
        filename: "cin-nova-press-kit.txt",
        format: "Text today; PDF planned",
    },
    {
        key: "brand-guidelines",
        title: "Brand guidelines",
        description: "Colour values, typography, clear-space rules, and the permitted and prohibited uses of the mark.",
        filename: "cin-nova-brand-guidelines.txt",
        format: "Text today; PDF planned",
    },
    {
        key: "product-summary",
        title: "Product summary sheet",
        description: "Every product with its one-line description and current development stage.",
        filename: "cin-nova-product-summary.txt",
        format: "Text today; PDF planned",
    },
    {
        key: "logo-spec",
        title: "Logo specification",
        description: "How the wordmark and CN monogram are constructed, with clear-space and minimum-size rules.",
        filename: "cin-nova-logo-spec.txt",
        format: "Text today; SVG and PNG package planned",
    },
];

const DIVIDER = "=".repeat(60);

/** Build the plain-text body for a downloadable asset. */
export function buildAssetContent(key) {
    if (key === "press-kit") {
        return [
            "CIN NOVA — PRESS KIT",
            DIVIDER,
            "",
            "BOILERPLATE (SHORT)",
            companyBoilerplate.short,
            "",
            "BOILERPLATE (LONG)",
            companyBoilerplate.long,
            "",
            "PRODUCTS",
            ...productOneLiners.map((product) => `- ${product.name} (${product.stage}): ${product.line}`),
            "",
            "APPROVED FACTS",
            ...pressFacts.map((fact) => `- ${fact.label}: ${fact.value}`),
            "",
            "WHAT WE WILL NOT CONFIRM",
            "- Revenue, funding, user counts, or traffic figures. Cin Nova publishes no audience metrics",
            "  it cannot verify, and will not provide unverified numbers for publication.",
            "",
            "PRESS CONTACT",
            PRESS_CONTACT_EMAIL,
            "",
            `Generated from ${siteUrl}/company/press-kit`,
        ];
    }

    if (key === "brand-guidelines") {
        return [
            "CIN NOVA — BRAND GUIDELINES",
            DIVIDER,
            "",
            "COLOURS",
            ...brandColors.map((color) => `- ${color.name.padEnd(14)} ${color.hex}  — ${color.usage}`),
            "",
            "TYPOGRAPHY",
            ...brandTypography.map((type) => `- ${type.role}: ${type.stack}\n  ${type.note}`),
            "",
            "CLEAR SPACE",
            "Keep clear space on every side of the logo equal to the height of the letter N in the wordmark.",
            "Minimum wordmark width: 96px on screen, 25mm in print.",
            "",
            "PERMITTED USE",
            ...logoUsageRules.permitted.map((rule) => `- ${rule}`),
            "",
            "PROHIBITED USE",
            ...logoUsageRules.prohibited.map((rule) => `- ${rule}`),
            "",
            `Generated from ${siteUrl}/company/brand-assets`,
        ];
    }

    if (key === "product-summary") {
        return [
            "CIN NOVA — PRODUCT SUMMARY",
            DIVIDER,
            "",
            ...productOneLiners.flatMap((product) => [
                product.name.toUpperCase(),
                `Stage: ${product.stage}`,
                product.line,
                "",
            ]),
            "Stages are accurate as published. No product listed here is a general-availability",
            "commercial release, and none should be described as one.",
            "",
            `Generated from ${siteUrl}/company/press-kit`,
        ];
    }

    if (key === "logo-spec") {
        return [
            "CIN NOVA — LOGO SPECIFICATION",
            DIVIDER,
            "",
            "MARKS",
            "1. Wordmark — 'CinNova' set in the heading stack at weight 700.",
            "2. Monogram — 'CN' in a rounded square, used where the full wordmark will not fit.",
            "",
            "CONSTRUCTION",
            "- Monogram container: 12px corner radius at 48px, scaling proportionally.",
            "- Monogram letters: weight 700, letter-spacing 0.05em, optically centred.",
            "",
            "CLEAR SPACE AND SIZE",
            "- Clear space: the height of the letter N, on all four sides.",
            "- Minimum wordmark width: 96px on screen, 25mm in print.",
            "- Minimum monogram size: 24px on screen.",
            "",
            "COLOUR PAIRINGS",
            "- Dark mark (#131720) on light backgrounds (#FFFFFF, #F6F7F9).",
            "- Light mark (#FFFFFF) on dark backgrounds (#0F172A, #131720).",
            "- Never place the mark on a mid-tone that fails a 4.5:1 contrast check.",
            "",
            "PROHIBITED",
            ...logoUsageRules.prohibited.map((rule) => `- ${rule}`),
            "",
            `Generated from ${siteUrl}/company/brand-assets`,
        ];
    }

    return [`No asset is defined for "${key}".`];
}
