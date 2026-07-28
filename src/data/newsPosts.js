/**
 * Cin Nova News — story data model.
 *
 * Consumed by:
 *   - src/pages/News.jsx           (news center: latest feed + coverage sections)
 *   - src/pages/NewsStoryPage.jsx  (dedicated story page, route /news/<slug>)
 *   - src/data/seoConfig.js        (sitemap entries for public stories)
 *   - scripts/generate-route-metadata.mjs, scripts/audit-seo.mjs (build-time SEO)
 *
 * The array holds two kinds of entry:
 *   - Real reporting (`isDemo: false`) — public, indexable, sitemapped, and
 *     prerendered. Every one carries at least two labeled sources.
 *   - Demo fixtures (`isDemo: true`) — layout/QA scaffolding only. Excluded from
 *     the sitemap and from prerendered route metadata, and rendered `noindex`.
 *
 * IMPORTANT — editorial integrity rules baked into this file:
 *   1. Nothing here invents an event, a quotation, a statistic, or a source. No
 *      published entry uses quotation marks around anything a person said;
 *      statements are paraphrased and attributed.
 *   2. Sources declare a type: `verified` (independently confirmed or a primary
 *      record), `official` (attributable to the body that issued it), or `claim`
 *      (asserted but unconfirmed). Section `claimType` applies the same scale to
 *      the body copy, so an unresolved claim is never rendered as a fact.
 *   3. `breaking` and `developing` are reserved for live desk use. Neither is
 *      applied here, and no entry carries traffic or trending data.
 *   4. Hero images are library photographs from this repository, not original
 *      photojournalism. Published stories set `heroCaption` to say so.
 *   5. Demo fixtures never assert events. They describe how each desk will
 *      operate — which is true today. Deleting them is a one-step change: they
 *      are the entries flagged `isDemo: true`.
 *
 * This module is imported by Node build scripts, so it must stay free of JSX,
 * Vite-only syntax, and browser globals.
 */

import { siteUrl } from "./blogPosts.js";

export { siteUrl };

/** Fallback social image for stories with no hero (absolute URL is built later). */
export const NEWS_DEFAULT_IMAGE = "/images/home/homepage-hero-innovation.jpg";

/* ── Taxonomies ──────────────────────────────────────────────────────────── */

/** The four coverage levels shown on the News landing page. Order is meaningful. */
export const NEWS_COVERAGE_LEVELS = [
    {
        key: "local",
        label: "Local",
        kicker: "Your community",
        blurb: "Community updates, schools, small businesses, and public services.",
    },
    {
        key: "state",
        label: "State",
        kicker: "Across the state",
        blurb: "State government, the economy, infrastructure, and statewide services.",
    },
    {
        key: "national",
        label: "National",
        kicker: "Across the country",
        blurb: "U.S. policy, business, technology, and culture with practical context.",
    },
    {
        key: "international",
        label: "International",
        kicker: "Around the world",
        blurb: "Geopolitics, global markets, science, climate, and culture.",
    },
];

export const NEWS_COVERAGE_KEYS = NEWS_COVERAGE_LEVELS.map((level) => level.key);

/**
 * Editorial status. `breaking` and `developing` are reserved for live desk use
 * and must never be applied to fixtures or to a story without live reporting.
 */
export const NEWS_STATUSES = ["standard", "breaking", "developing", "update", "analysis"];

/** Labels for the status chip. `standard` renders no chip. */
export const NEWS_STATUS_LABELS = {
    standard: "",
    breaking: "Breaking",
    developing: "Developing",
    update: "Updated",
    analysis: "Analysis",
};

/**
 * Source transparency taxonomy. Every source link must declare which of these
 * it is so readers can tell a confirmed fact from an unresolved claim.
 */
export const NEWS_SOURCE_TYPES = {
    verified: {
        key: "verified",
        label: "Verified fact",
        description: "Independently confirmed by Cin Nova or documented in primary records.",
    },
    official: {
        key: "official",
        label: "Official statement",
        description: "Attributed on the record to the organization or office that issued it.",
    },
    claim: {
        key: "claim",
        label: "Unverified claim",
        description: "An allegation or assertion Cin Nova has not confirmed. Not presented as fact.",
    },
};

export const NEWS_SOURCE_TYPE_KEYS = Object.keys(NEWS_SOURCE_TYPES);

/* ── Authors ─────────────────────────────────────────────────────────────── */

export const newsAuthors = {
    "Cin Nova News Desk": {
        name: "Cin Nova News Desk",
        role: "Newsroom",
        initials: "CN",
        bio: "The Cin Nova News Desk reports across local, state, national, and international coverage, with an emphasis on context and human impact.",
    },
    "Cin Nova Local Desk": {
        name: "Cin Nova Local Desk",
        role: "Local Coverage",
        initials: "CL",
        bio: "The Local Desk covers community decisions, schools, small businesses, and the public services people use every day.",
    },
};

export function getNewsAuthor(name = "Cin Nova News Desk") {
    return newsAuthors[name] || newsAuthors["Cin Nova News Desk"];
}

/* ── Demo fixtures ───────────────────────────────────────────────────────────
   Each entry documents how a desk works. Nothing here reports an event.
   Replace these with sourced reporting; see the header rules above. */

const DEMO_NOTICE =
    "Demo fixture. This entry documents how the desk will operate; it is not a report of an event.";

const demoSources = [
    {
        label: "Cin Nova editorial approach",
        publisher: "Cin Nova",
        url: `${siteUrl}/?page=about`,
        type: "official",
        note: "Cin Nova's own published description of its editorial approach.",
    },
    {
        label: "Cin Nova Press Center",
        publisher: "Cin Nova",
        url: `${siteUrl}/?page=press-center`,
        type: "verified",
        note: "Primary Cin Nova record; verifiable on this site.",
    },
];

function demoStory(story) {
    return {
        status: "standard",
        updatedAt: null,
        isPublished: true,
        isDemo: true,
        demoNotice: DEMO_NOTICE,
        author: "Cin Nova News Desk",
        sources: demoSources,
        relatedNewsIds: [],
        relatedBlogSlugs: [],
        ...story,
    };
}

export const newsPosts = [
    /* ═══════════════════════════════════════════════════════════════════════
       PHASE 3 — LAUNCH STORIES (real, sourced, public)
       Each entry below reports a documented action by a named public body, with
       at least two independent or primary sources labeled by type. No quotation
       marks are used around anything a person said: statements are paraphrased
       and attributed. Figures the newsroom has not independently checked are
       labeled as official claims, and unconfirmed assertions are labeled claims.

       Hero images are library photographs from this repository, not original
       photojournalism. `heroCaption` states that explicitly on every story so a
       reader is never led to think the image depicts the event.
       ═══════════════════════════════════════════════════════════════════════ */
    {
        id: "news-local-2026-07-sarasota-data-center",
        slug: "sarasota-county-hyperscale-data-center-moratorium",
        title: "Sarasota County freezes hyperscale data center applications",
        dek: "County commissioners voted unanimously to stop accepting, reviewing, or approving hyperscale data center proposals for a year, citing electricity and water demand.",
        coverageLevel: "local",
        category: "Public services",
        location: "Sarasota County, Florida",
        author: "Cin Nova News Desk",
        publishedAt: "2026-07-27T13:00:00Z",
        updatedAt: null,
        status: "standard",
        isPublished: true,
        isDemo: false,
        heroImage: "/images/blog/datacenters/server-cooling-aisle.jpg",
        heroAlt: "A row of equipment racks in a data center cooling aisle.",
        heroCaption:
            "Library image used for illustration. It is not a photograph of the meeting, the county, or any facility described in this story.",
        summary:
            "In early July 2026 the Sarasota County Commission voted 5-0 to pause acceptance, review, and approval of hyperscale data center applications for twelve months, into at least July 2027. The move followed interest from a developer in a property on Cattlemen Road.",
        whyItMatters:
            "Local land-use boards, not state or federal regulators, decide where large computing facilities physically land. A twelve-month pause changes the calendar for any developer weighing this market, and it puts the county's water and electricity questions ahead of the project timeline.",
        sections: [
            {
                id: "what-the-commission-did",
                heading: "What the commission did",
                claimType: "verified",
                body: [
                    "The commission approved a twelve-month moratorium halting the acceptance, review, and approval of hyperscale data center applications. Reporting places the vote at 5-0, and the pause runs into at least July 2027.",
                    "Coverage describes the freeze as applying to hyperscale facilities, which Florida defines at 50 megawatts and above. One account notes that the moratorium text itself does not fix a megawatt threshold, so the operative definition is a detail to watch when county staff return with permanent zoning language.",
                    "Commissioners signalled interest in going further than a pause, and staff were expected to bring forward additional regulatory options in August.",
                ],
            },
            {
                id: "what-prompted-it",
                heading: "What prompted it",
                claimType: "verified",
                body: [
                    "The county had been approached about a data center on a property along Cattlemen Road. Accounts differ on how far that interest had progressed: WGCU identified the interested party as XF Group, while the Business Observer reported that no formal application had been received at the time of the vote.",
                    "Cin Nova has not independently confirmed the identity of the prospective applicant or the status of any filing, and both points are reported here as sourced reporting rather than as settled fact.",
                    "Neighboring DeSoto County had already moved in the same direction, taking its own step toward a data center development freeze shortly before the Sarasota vote.",
                ],
            },
            {
                id: "the-stated-concerns",
                heading: "The concerns commissioners raised",
                claimType: "claim",
                body: [
                    "The reasons commissioners gave centered on electricity demand and on the water large facilities consume for cooling, alongside broader environmental and neighborhood impacts. Commissioner Mark Smith objected on grounds of noise, scale, and overnight security lighting, and separately raised the possibility that data center wastewater could affect the local water supply. Commissioner Joe Neunder pointed to electricity consumption and strain on the grid.",
                    "These are positions stated by elected officials in a public meeting, not findings. In particular, the suggestion that a specific facility would contaminate the local water supply is an unverified concern: no such facility has been permitted here, and Cin Nova has seen no study establishing that outcome for this county.",
                    "That distinction matters for readers weighing the decision. The commission acted on anticipated risk, which is a normal basis for a land-use pause, but it is not the same thing as documented harm.",
                ],
            },
        ],
        sources: [
            {
                label: "Sarasota County blocks hyperscale data centers for at least one year",
                publisher: "WGCU (PBS & NPR for Southwest Florida)",
                url: "https://www.wgcu.org/government-politics/2026-07-09/sarasota-county-blocks-hyperscale-data-centers-for-at-least-one-year-desoto-earlier-made-similar-move",
                type: "verified",
                note: "Public media report on the vote, the Cattlemen Road inquiry, and DeSoto County's earlier action.",
            },
            {
                label: "Sarasota County bans data center applications for one year",
                publisher: "Business Observer",
                url: "https://www.businessobserverfl.com/news/2026/jul/09/sarasota-county-data-center-moratorium/",
                type: "verified",
                note: "Independent report giving the 5-0 tally, the twelve-month term, and the status of any application.",
            },
        ],
        relatedNewsIds: [
            "news-state-2026-07-nj-data-center-rate-class",
            "news-national-2026-06-ferc-large-load",
        ],
        relatedBlogSlugs: [
            "why-data-centers-are-becoming-the-new-gold-rush",
            "can-americas-power-grid-handle-ai",
        ],
        seoTitle: "Sarasota County freezes hyperscale data center applications | Cin Nova News",
        seoDescription:
            "Sarasota County commissioners voted 5-0 for a twelve-month pause on hyperscale data center applications, citing electricity and water demand. What the freeze covers.",
    },
    {
        id: "news-state-2026-07-nj-data-center-rate-class",
        slug: "new-jersey-data-center-fair-share-rate-class",
        title: "New Jersey sets a separate power rate class for data centers",
        dek: "The Data Center Fair Share law directs state regulators to build tariff standards for large data centers so their grid costs are not spread across household bills.",
        coverageLevel: "state",
        category: "Government",
        location: "Trenton, New Jersey",
        author: "Cin Nova News Desk",
        publishedAt: "2026-07-27T13:10:00Z",
        updatedAt: null,
        status: "standard",
        isPublished: true,
        isDemo: false,
        heroImage: "/images/datacenters/data-center-gold-rush-facility.jpg",
        heroAlt: "A large data center building on an industrial site.",
        heroCaption:
            "Library image used for illustration. It is not a photograph of any New Jersey facility affected by this law.",
        summary:
            "Governor Sherrill signed S731/A796, the Data Center Fair Share legislation, on July 7, 2026, as part of a three-bill energy package. The law creates a distinct ratepayer classification for large data centers and tasks the New Jersey Board of Public Utilities with developing the tariff standards.",
        whyItMatters:
            "Who pays for the grid capacity that large computing loads require is now a live question in most states. New Jersey has answered it by separating data centers into their own rate class, which is a template other legislatures can copy or reject.",
        sections: [
            {
                id: "what-the-law-does",
                heading: "What the law does",
                claimType: "verified",
                body: [
                    "The legislation creates a new ratepayer classification for data centers with its own rate structure, and requires those facilities to cover their energy use and the associated grid infrastructure costs rather than having them spread across other customers.",
                    "It applies to facilities of 50 megawatts and larger, covering both new and existing data centers, and directs the New Jersey Board of Public Utilities to develop the tariff standards. The legislature passed the measure on June 30, 2026.",
                    "The law also contains provisions intended to encourage data centers to supply clean power to the grid and to require them to reduce consumption ahead of residential customers when the system is under strain.",
                ],
            },
            {
                id: "official-positions",
                heading: "What the state says about it",
                claimType: "official",
                body: [
                    "The Governor's office announced the signing as part of a ratepayer relief package it says will save New Jersey residents about $1 billion annually, attributing that estimate to Synapse Energy Economics. Cin Nova has not independently verified that figure; it is reported here as the state's own claim, and the estimate covers the package as a whole rather than the data center law alone.",
                    "The same announcement described additional bill credits for ratepayers and lower- and moderate-income households.",
                    "Assemblyman David Bailey Jr. described this version of the bill as more protective than an earlier one, noting that the threshold was lowered from 100 megawatts and that coverage was extended to existing facilities. That is a characterization by a sponsor, and readers should weigh it as such.",
                ],
            },
            {
                id: "what-is-unresolved",
                heading: "What is still unresolved",
                claimType: "verified",
                body: [
                    "The operative details now sit with the Board of Public Utilities, which has to translate the statute into actual tariff standards. Until those standards exist, the practical effect on any specific facility or any specific household bill cannot be stated.",
                    "Cin Nova will report the BPU proceeding when a schedule and draft standards are published rather than projecting an outcome now.",
                ],
            },
        ],
        sources: [
            {
                label: "Governor Sherrill Announces Ratepayer Relief, Signs Major Legislation on Energy",
                publisher: "State of New Jersey, Office of the Governor",
                url: "https://www.nj.gov/governor/news/2026/approved/20260707a.shtml",
                type: "official",
                note: "The state's own announcement of the July 7, 2026 signing, the bills included, and the savings estimate it attributes to Synapse Energy Economics.",
            },
            {
                label: "New Jersey lawmakers send data center tariff bill to governor",
                publisher: "Utility Dive",
                url: "https://www.utilitydive.com/news/new-jersey-lawmakers-send-data-center-tariff-bill-to-governor/824191/",
                type: "verified",
                note: "Trade reporting on the June 30, 2026 passage, the 50 MW threshold, and the Board of Public Utilities' role.",
            },
        ],
        relatedNewsIds: [
            "news-national-2026-06-ferc-large-load",
            "news-local-2026-07-sarasota-data-center",
        ],
        relatedBlogSlugs: [
            "can-americas-power-grid-handle-ai",
            "why-data-centers-are-becoming-the-new-gold-rush",
        ],
        seoTitle: "New Jersey sets a separate power rate class for data centers | Cin Nova News",
        seoDescription:
            "New Jersey's Data Center Fair Share law puts data centers of 50 MW and up in their own rate class and sends tariff standards to the Board of Public Utilities.",
    },
    {
        id: "news-national-2026-06-ferc-large-load",
        slug: "ferc-show-cause-orders-large-load-interconnection",
        title: "FERC orders grid operators to justify large-load rules",
        dek: "Federal regulators told all six regional grid operators to defend or rewrite the tariffs that govern how data centers and other large loads connect to the transmission system.",
        coverageLevel: "national",
        category: "U.S. policy",
        location: "Washington, D.C.",
        author: "Cin Nova News Desk",
        publishedAt: "2026-07-27T13:20:00Z",
        updatedAt: null,
        status: "standard",
        isPublished: true,
        isDemo: false,
        heroImage: "/images/datacenters/power-grid-ai-electricity-demand.jpg",
        heroAlt: "High-voltage transmission lines and towers against an open sky.",
        heroCaption:
            "Library image used for illustration. It is not a photograph of any facility or proceeding described in this story.",
        summary:
            "On June 18, 2026, the Federal Energy Regulatory Commission issued show cause orders under Section 206 of the Federal Power Act to all six regional transmission organizations and independent system operators, along with their transmission owners, over the rules for interconnecting large and co-located loads.",
        whyItMatters:
            "Interconnection rules decide how quickly a large computing facility can be energized and who pays for the capacity it needs. A federal move against all six regional markets at once means those terms are likely to change nationally rather than market by market.",
        sections: [
            {
                id: "what-ferc-ordered",
                heading: "What FERC ordered",
                claimType: "verified",
                body: [
                    "The orders direct each grid operator and its transmission owners either to justify how existing tariffs handle the interconnection of large and co-located loads, or to propose revisions. FERC used its Section 206 authority, which puts the burden on the operators to show their current terms remain just and reasonable.",
                    "The issues named include study procedures and definitions for large load transmission service, cost allocation and recovery, the rates and conditions that apply to generation serving co-located load, service options for flexible loads, and interconnection provisions where generation and load sit together.",
                    "FERC set staged deadlines: a generation adequacy informational report within 30 days, an optional request to hold a proceeding in abeyance at 45 days, and tariff justification or proposed changes within 60 days.",
                ],
            },
            {
                id: "the-co-location-question",
                heading: "The co-location question",
                claimType: "verified",
                body: [
                    "FERC's stated concern is that existing tariffs lack clarity on the rates, terms, and conditions applying to generators that serve co-located load — the arrangement where a data center sits directly alongside a power plant rather than drawing from the grid at large.",
                    "The commission also required the operators to explain how they will ensure adequate generation is available to serve both existing and new large loads.",
                ],
            },
            {
                id: "what-happens-next",
                heading: "What happens next",
                claimType: "verified",
                body: [
                    "Nothing is decided by a show cause order. It opens a proceeding in which the operators respond, other parties intervene, and FERC then determines whether to require changes.",
                    "Because the deadlines run in days from issuance rather than to fixed calendar dates announced in advance, the substantive filings land over the summer. Cin Nova will report the responses as they are docketed rather than characterizing the likely outcome now.",
                ],
            },
        ],
        sources: [
            {
                label: "FERC Launches Aggressive Targeted Action to Speed Large Load Integration",
                publisher: "Federal Energy Regulatory Commission",
                url: "https://www.ferc.gov/news-events/news/ferc-launches-aggressive-targeted-action-speed-large-load-integration",
                type: "official",
                note: "The commission's own announcement of the action. The framing, including the word aggressive, is FERC's.",
            },
            {
                label: "FERC Presses Grid Operators on Data Center, Large Load Interconnections",
                publisher: "Morgan Lewis, Power & Pipes",
                url: "https://www.morganlewis.com/blogs/powerandpipes/2026/07/ferc-presses-grid-operators-on-data-center-large-load-interconnections",
                type: "verified",
                note: "Independent legal analysis detailing the June 18 issuance date, the Section 206 posture, the issues named, and the 30/45/60-day deadlines.",
            },
            {
                label: "Interconnection of Large Loads to the Interstate Transmission System (Docket No. RM26-4-000)",
                publisher: "Federal Energy Regulatory Commission",
                url: "https://www.ferc.gov/rm26-4",
                type: "official",
                note: "FERC's docket page for its broader large-load interconnection rulemaking, which runs alongside the show cause proceedings.",
            },
        ],
        relatedNewsIds: [
            "news-state-2026-07-nj-data-center-rate-class",
            "news-local-2026-07-sarasota-data-center",
            "news-international-2026-08-eu-ai-act-transparency",
        ],
        relatedBlogSlugs: [
            "can-americas-power-grid-handle-ai",
            "the-hidden-infrastructure-behind-chatgpt-and-ai",
        ],
        seoTitle: "FERC orders grid operators to justify large-load rules | Cin Nova News",
        seoDescription:
            "FERC issued Section 206 show cause orders to all six regional grid operators over how data centers and other large loads interconnect. What the orders require.",
    },
    {
        id: "news-international-2026-08-eu-ai-act-transparency",
        slug: "eu-ai-act-august-2026-transparency-enforcement",
        title: "EU AI Act transparency rules become enforceable August 2",
        dek: "Disclosure duties for chatbots, synthetic media, and emotion recognition start being enforced, while the high-risk obligations move to later dates.",
        coverageLevel: "international",
        category: "World affairs",
        location: "European Union",
        author: "Cin Nova News Desk",
        publishedAt: "2026-07-27T13:30:00Z",
        updatedAt: null,
        status: "standard",
        isPublished: true,
        isDemo: false,
        heroImage: "/images/ai/ai-complete-guide-2026.jpg",
        heroAlt: "An abstract representation of artificial intelligence systems and data.",
        heroCaption:
            "Library image used for illustration. It is not a photograph of any institution or product described in this story.",
        summary:
            "The European Commission's implementation timeline puts August 2, 2026 as the date the majority of the AI Act's rules apply and enforcement starts at national and EU level, including the Article 50 transparency obligations. Separately, the Digital Omnibus amendments pushed the high-risk system deadlines to December 2027 and August 2028.",
        whyItMatters:
            "Any organization that puts an AI product in front of European users is affected by the transparency duties, regardless of where it is based. The date matters more than usual this year because a parallel amendment delayed a different set of obligations, and the two are easy to confuse.",
        sections: [
            {
                id: "what-starts",
                heading: "What starts on August 2",
                claimType: "verified",
                body: [
                    "The Commission's official timeline states that on August 2, 2026 the majority of the AI Act's rules come into force and enforcement starts for the applicable rules, at both national and EU level, covering general-purpose AI models, the prohibitions, transparency rules, and AI literacy.",
                    "The Article 50 transparency duties are the practical ones for most product teams: telling people they are interacting with an AI system, marking AI-generated content in a machine-readable way, disclosing deepfakes, and informing people about emotion recognition and biometric categorization.",
                    "The underlying obligations are not new on that date. Prohibitions have applied since February 2, 2025 and general-purpose AI model provider obligations since August 2, 2025. What changes is enforceability.",
                ],
            },
            {
                id: "what-moved",
                heading: "What moved, and what did not",
                claimType: "verified",
                body: [
                    "The Digital Omnibus on AI, now published in the EU statute book, delayed the high-risk obligations: standalone high-risk systems under Annex III move to December 2, 2027, and high-risk AI embedded in regulated products under Annex I moves to August 2, 2028.",
                    "The prohibitions, the AI literacy requirements, and the general-purpose AI provider obligations were not delayed. Coverage describing the AI Act as postponed refers to the high-risk track, not to what becomes enforceable this August.",
                ],
            },
            {
                id: "open-questions",
                heading: "Open questions",
                claimType: "verified",
                body: [
                    "How aggressively the Commission and national authorities use their enforcement powers from day one is not something anyone can state in advance, and Cin Nova is not going to predict it.",
                    "The Commission has published further detail on the Omnibus changes through its own FAQ, which is the authoritative place to check any specific obligation against a specific product.",
                ],
            },
        ],
        sources: [
            {
                label: "Timeline for the implementation of the EU AI Act",
                publisher: "European Commission — AI Act Service Desk",
                url: "https://ai-act-service-desk.ec.europa.eu/en/ai-act/timeline/timeline-implementation-eu-ai-act",
                type: "official",
                note: "The Commission's own milestone dates, including what begins on August 2, 2026.",
            },
            {
                label: "The EU AI Act — when does it become enforceable now?",
                publisher: "Norton Rose Fulbright, Data Protection Report",
                url: "https://www.dataprotectionreport.com/2026/07/the-eu-ai-act-when-does-it-become-enforceable-now/",
                type: "verified",
                note: "Independent legal analysis of the Article 50 duties and of which obligations the Digital Omnibus delayed.",
            },
        ],
        relatedNewsIds: [
            "news-national-2026-06-ferc-large-load",
            "news-state-2026-07-nj-data-center-rate-class",
        ],
        relatedBlogSlugs: [
            "the-companies-building-the-ai-economy",
            "the-hidden-infrastructure-behind-chatgpt-and-ai",
        ],
        seoTitle: "EU AI Act transparency rules become enforceable August 2 | Cin Nova News",
        seoDescription:
            "The EU AI Act's Article 50 transparency duties become enforceable on August 2, 2026, while the Digital Omnibus moved high-risk obligations to 2027 and 2028.",
    },

    /* ── Local ───────────────────────────────────────────────────────────── */
    demoStory({
        id: "news-local-001",
        slug: "how-the-local-desk-decides-what-to-cover",
        title: "How the Cin Nova local desk decides what to cover",
        dek: "The first question the local desk asks about any story: does this change a decision someone in the neighborhood has to make?",
        coverageLevel: "local",
        category: "Community",
        location: "Sample City, ST",
        author: "Cin Nova Local Desk",
        publishedAt: "2026-07-21T13:00:00Z",
        status: "analysis",
        heroImage: "/images/blog/education/classroom-student-collaboration.jpg",
        heroAlt: "People collaborating around a table in a shared community space.",
        summary:
            "Local coverage on Cin Nova is organized around decisions rather than events: meetings, budgets, and services that change what a household can do next week.",
        whyItMatters:
            "Neighborhood reporting is the layer most often cut first, and it is the layer where a single missed notice can cost a family time or money.",
        sections: [
            {
                id: "what-the-desk-covers",
                heading: "What the desk covers",
                claimType: "verified",
                body: [
                    "The local desk is scoped to community decisions, schools, small businesses, and public services — the four areas named on the Cin Nova News coverage model.",
                    "Coverage is selected by consequence, not volume. A routine agenda item that changes a fee schedule outranks an event that produces more noise but no decision.",
                ],
            },
            {
                id: "how-stories-are-checked",
                heading: "How stories are checked before publication",
                claimType: "verified",
                body: [
                    "Every reported story carries a source list. Each source is labeled as a verified fact, an official statement, or an unverified claim, and the labels are shown to readers rather than kept internal.",
                    "When a claim cannot be confirmed, it is published as a claim with attribution or it is held. It is never promoted to a fact by phrasing.",
                ],
            },
            {
                id: "what-comes-next",
                heading: "What comes next",
                claimType: "verified",
                body: [
                    "This entry is a demo fixture that exists so the news layout, filters, and story pages can be reviewed before reporting begins.",
                    "Once the desk publishes sourced local reporting, entries like this one are replaced and the real stories become public, indexable URLs.",
                ],
            },
        ],
        relatedNewsIds: ["news-local-002", "news-state-001", "news-national-001"],
        relatedBlogSlugs: ["how-technology-can-support-parents"],
        seoTitle: "How the Cin Nova local desk decides what to cover | Cin Nova News",
        seoDescription:
            "How Cin Nova's local desk selects community, school, small business, and public service stories — and how each source is labeled before publication.",
    }),
    demoStory({
        id: "news-local-002",
        slug: "what-local-school-coverage-will-look-like",
        title: "What local school coverage will look like on Cin Nova",
        dek: "School reporting starts with the calendar, the budget, and the bus route — the three things families have to plan around.",
        coverageLevel: "local",
        category: "Education",
        location: "Sample City, ST",
        author: "Cin Nova Local Desk",
        publishedAt: "2026-07-18T14:30:00Z",
        updatedAt: "2026-07-20T09:15:00Z",
        heroImage: "/images/blog/education/parent-child-learning-support.jpg",
        heroAlt: "An adult helping a child with schoolwork at a kitchen table.",
        summary:
            "The education beat is built around what families act on: schedules, costs, transportation, and the board decisions behind them.",
        whyItMatters:
            "School decisions arrive as documents and meeting minutes. Turning those into plain language is the difference between a notice and an informed household.",
        sections: [
            {
                id: "beat-scope",
                heading: "The scope of the beat",
                claimType: "verified",
                body: [
                    "The education beat covers district decisions, school calendars, funding, and the practical logistics that follow from them.",
                    "Where a decision affects a specific school, the story names the school and links the underlying document rather than paraphrasing it.",
                ],
            },
            {
                id: "documents-first",
                heading: "Documents first",
                claimType: "verified",
                body: [
                    "Agendas, budgets, and minutes are primary records. When a story relies on one, it is linked in the source list and labeled as a verified record.",
                    "Statements from officials are labeled separately as official statements, because an official statement is evidence of a position, not proof of an outcome.",
                ],
            },
            {
                id: "corrections",
                heading: "Updates and corrections",
                claimType: "verified",
                body: [
                    "Stories that change after publication carry an updated timestamp alongside the original publication time, so readers can see what they are looking at.",
                    "This fixture carries an updated timestamp specifically so that behavior is visible during review.",
                ],
            },
        ],
        relatedNewsIds: ["news-local-001", "news-local-003", "news-state-004"],
        relatedBlogSlugs: ["how-ai-is-transforming-education", "student-dashboards-that-actually-help"],
        seoTitle: "What local school coverage will look like on Cin Nova | Cin Nova News",
        seoDescription:
            "Cin Nova's local education beat covers district decisions, calendars, funding, and logistics — with primary documents linked and labeled in every story.",
    }),
    demoStory({
        id: "news-local-003",
        slug: "small-business-reporting-starts-at-the-counter",
        title: "Small business reporting starts at the counter",
        dek: "Permits, rent, staffing, and payment fees decide whether a storefront opens next year. That is the beat.",
        coverageLevel: "local",
        category: "Small business",
        location: "Sample City, ST",
        publishedAt: "2026-07-15T12:00:00Z",
        heroImage: "/images/blog/business/startup-founders-whiteboard.jpg",
        heroAlt: "Two people planning at a whiteboard in a small office.",
        summary:
            "Small business coverage follows the operating costs and local rules that determine whether independent businesses can keep running.",
        whyItMatters:
            "Local commerce is where policy becomes tangible: a fee change or zoning revision shows up on a storefront before it shows up in a statewide figure.",
        sections: [
            {
                id: "operating-reality",
                heading: "Start with operating reality",
                claimType: "verified",
                body: [
                    "The beat prioritizes the costs owners actually manage — permits, occupancy, staffing, and the rules that govern them.",
                    "Coverage avoids success-story framing that is not supported by records the reader can check.",
                ],
            },
            {
                id: "numbers-discipline",
                heading: "Discipline about numbers",
                claimType: "verified",
                body: [
                    "Figures appear only when they come from a named, linkable source. Cin Nova does not publish estimated or illustrative numbers as reporting.",
                    "Where a figure is disputed, the dispute is reported and both positions are labeled.",
                ],
            },
        ],
        relatedNewsIds: ["news-local-004", "news-state-002", "news-national-002"],
        relatedBlogSlugs: ["what-small-businesses-should-know-about-ai-assistants"],
        seoTitle: "Small business reporting starts at the counter | Cin Nova News",
        seoDescription:
            "How Cin Nova covers independent local business: permits, rent, staffing, and fees, reported from named sources rather than illustrative figures.",
    }),
    demoStory({
        id: "news-local-004",
        slug: "tracking-the-local-services-people-use",
        title: "Tracking the local services people actually use",
        dek: "Transit, waste collection, water, and permitting are judged by whether they work on a Tuesday, not by an announcement.",
        coverageLevel: "local",
        category: "Public services",
        location: "Sample City, ST",
        publishedAt: "2026-07-11T11:00:00Z",
        heroImage: "/images/blog/construction/small-contractor-jobsite-tablet.jpg",
        heroAlt: "A worker reviewing plans on a tablet at a work site.",
        summary:
            "Public service coverage measures delivery — whether a service reaches residents — rather than restating the announcement that funded it.",
        whyItMatters:
            "The gap between an announced service and a delivered one is where most local frustration lives, and it is rarely covered after launch day.",
        sections: [
            {
                id: "after-the-announcement",
                heading: "Reporting after the announcement",
                claimType: "verified",
                body: [
                    "The desk plans to revisit funded services after launch, because delivery is the part residents experience.",
                    "Follow-ups are linked back to the original story so the record stays continuous.",
                ],
            },
            {
                id: "resident-accounts",
                heading: "Resident accounts are claims until confirmed",
                claimType: "verified",
                body: [
                    "First-hand accounts from residents are valuable and are labeled as unverified claims until they are corroborated by records or additional sources.",
                    "That label is not a judgment about the person. It is a statement about what has been confirmed at publication time.",
                ],
            },
        ],
        relatedNewsIds: ["news-local-001", "news-state-003", "news-international-001"],
        relatedBlogSlugs: ["home-safety-tips-for-families"],
        seoTitle: "Tracking the local services people actually use | Cin Nova News",
        seoDescription:
            "Cin Nova's public services beat follows transit, waste, water, and permitting after launch day — and labels resident accounts until they are confirmed.",
    }),

    /* ── State ───────────────────────────────────────────────────────────── */
    demoStory({
        id: "news-state-001",
        slug: "following-state-policy-from-proposal-to-impact",
        title: "Following state policy from proposal to impact",
        dek: "A bill is a document until it changes a bill you pay. The state desk covers the distance between the two.",
        coverageLevel: "state",
        category: "Government",
        location: "Sample State",
        publishedAt: "2026-07-22T15:00:00Z",
        status: "analysis",
        heroImage: "/images/blog/real-estate/city-skyline-property-investment.jpg",
        heroAlt: "A city skyline viewed across open water at dusk.",
        summary:
            "State government coverage tracks proposals through committee, passage, and implementation, with the practical effect stated in plain language.",
        whyItMatters:
            "Most statewide decisions are reported at announcement and then dropped, which is exactly when their real effects begin.",
        sections: [
            {
                id: "stages",
                heading: "Covering every stage, not just the vote",
                claimType: "verified",
                body: [
                    "The desk covers proposal, amendment, passage, and implementation as separate moments, each with its own story where warranted.",
                    "Implementation coverage is scheduled deliberately, because that is where the text becomes a cost or a service.",
                ],
            },
            {
                id: "plain-language",
                heading: "Plain language, linked text",
                claimType: "verified",
                body: [
                    "Legislative language is summarized in plain terms with the original text linked, so a reader can check the summary against the source.",
                    "Where a summary requires interpretation, the story says so rather than presenting the interpretation as the text's meaning.",
                ],
            },
        ],
        relatedNewsIds: ["news-state-002", "news-national-001", "news-local-001"],
        relatedBlogSlugs: ["can-americas-power-grid-handle-ai"],
        seoTitle: "Following state policy from proposal to impact | Cin Nova News",
        seoDescription:
            "How the Cin Nova state desk covers legislation at every stage — proposal, amendment, passage, and implementation — with original text linked.",
    }),
    demoStory({
        id: "news-state-002",
        slug: "state-economy-coverage-and-household-budgets",
        title: "How state economy coverage connects to household budgets",
        dek: "Statewide economic figures matter when they are translated into what a household pays, earns, or plans around.",
        coverageLevel: "state",
        category: "Economy",
        location: "Sample State",
        publishedAt: "2026-07-19T16:20:00Z",
        heroImage: "/images/blog/future-tech/clean-energy-solar-panels.jpg",
        heroAlt: "Rows of solar panels under a clear sky.",
        summary:
            "Economic coverage pairs official statewide data with the household-level effect, and names the source of every figure it uses.",
        whyItMatters:
            "Aggregate economic numbers move independently of the household experience. Reporting that skips the translation leaves readers no better informed.",
        sections: [
            {
                id: "official-data",
                heading: "Official data, cited",
                claimType: "verified",
                body: [
                    "Statewide figures come from official releases and are cited with a link, a publisher, and a date.",
                    "Figures without a checkable source are not published, even as illustration.",
                ],
            },
            {
                id: "translation",
                heading: "Translation without exaggeration",
                claimType: "verified",
                body: [
                    "The household effect is stated as a range or a condition when that is what the data supports, rather than a single dramatic number.",
                    "Forecasts are labeled as forecasts and attributed to whoever produced them.",
                ],
            },
        ],
        relatedNewsIds: ["news-state-001", "news-state-003", "news-national-002"],
        relatedBlogSlugs: ["why-data-centers-are-becoming-the-new-gold-rush"],
        seoTitle: "State economy coverage and household budgets | Cin Nova News",
        seoDescription:
            "Cin Nova's state economy beat pairs cited official data with household-level effects, labels forecasts, and publishes no figure without a source.",
    }),
    demoStory({
        id: "news-state-003",
        slug: "roads-grids-and-water-the-infrastructure-beat",
        title: "Roads, grids, and water: the state infrastructure beat",
        dek: "Infrastructure stories are schedule stories. What was promised, what was funded, and what is actually built.",
        coverageLevel: "state",
        category: "Infrastructure",
        location: "Sample State",
        publishedAt: "2026-07-16T10:45:00Z",
        heroImage: "/images/blog/construction/crane-active-building-site.jpg",
        heroAlt: "A construction crane above an active building site.",
        summary:
            "Infrastructure coverage tracks funding, timelines, and delivery, and returns to projects after the ribbon cutting.",
        whyItMatters:
            "Infrastructure timelines slip quietly. A project reported only at announcement leaves the public with the optimistic version permanently on the record.",
        sections: [
            {
                id: "timelines",
                heading: "Timelines are the story",
                claimType: "verified",
                body: [
                    "Each project story records the stated timeline and cost at the time of reporting so later coverage has a baseline to compare against.",
                    "Slippage is reported against that baseline rather than against a revised figure.",
                ],
            },
            {
                id: "contested",
                heading: "Contested projects",
                claimType: "verified",
                body: [
                    "Where a project is contested, opposing positions are attributed and labeled, and neither is presented as the settled outcome.",
                    "Unresolved disputes stay marked as unresolved until a decision is documented.",
                ],
            },
        ],
        relatedNewsIds: ["news-state-001", "news-state-004", "news-international-002"],
        relatedBlogSlugs: ["ai-in-construction-and-engineering"],
        seoTitle: "Roads, grids, and water: the state infrastructure beat | Cin Nova News",
        seoDescription:
            "How Cin Nova covers state infrastructure: recorded baselines for cost and timeline, reporting after delivery, and clearly labeled contested projects.",
    }),
    demoStory({
        id: "news-state-004",
        slug: "statewide-services-and-the-people-who-depend-on-them",
        title: "Statewide services and the people who depend on them",
        dek: "Benefits, licensing, and public health programs are judged by access, wait times, and whether the process can be completed.",
        coverageLevel: "state",
        category: "Public services",
        location: "Sample State",
        publishedAt: "2026-07-12T13:40:00Z",
        heroImage: "/images/blog/datacenters/fiber-optic-network-cables.jpg",
        heroAlt: "Bundled fiber optic network cables in a server room.",
        summary:
            "Statewide service coverage focuses on access and completion — whether a person can actually get through the process being reported on.",
        whyItMatters:
            "A program that exists on paper and a program a resident can complete are different things, and only the second one helps.",
        sections: [
            {
                id: "access",
                heading: "Access over announcement",
                claimType: "verified",
                body: [
                    "Coverage measures the steps a resident must complete, the documents required, and the published wait times.",
                    "Where wait times are not published, the story says they are not published rather than estimating them.",
                ],
            },
            {
                id: "official-response",
                heading: "Room for official response",
                claimType: "verified",
                body: [
                    "Agencies are given the opportunity to respond, and their response is labeled as an official statement in the source list.",
                    "If no response is received by publication, the story records that fact.",
                ],
            },
        ],
        relatedNewsIds: ["news-state-002", "news-local-004", "news-national-004"],
        relatedBlogSlugs: ["how-digital-triage-can-improve-family-safety"],
        seoTitle: "Statewide services and the people who depend on them | Cin Nova News",
        seoDescription:
            "Cin Nova's statewide services beat measures access, required documents, and published wait times — and records when an agency does not respond.",
    }),

    /* ── National ────────────────────────────────────────────────────────── */
    demoStory({
        id: "news-national-001",
        slug: "national-policy-explained-without-the-noise",
        title: "National policy, explained without the noise",
        dek: "The national desk reports what a policy does, who it applies to, and when it takes effect — before it reports the argument about it.",
        coverageLevel: "national",
        category: "U.S. policy",
        location: "United States",
        publishedAt: "2026-07-23T17:10:00Z",
        status: "analysis",
        heroImage: "/images/blog/ai/neural-network-abstract-visualization.jpg",
        heroAlt: "An abstract visualization of a connected network.",
        summary:
            "National policy coverage leads with mechanics — scope, eligibility, effective dates — and treats political reaction as a separate, clearly labeled layer.",
        whyItMatters:
            "Most readers need to know whether a policy applies to them. Reaction coverage answers a different question and often crowds that one out.",
        sections: [
            {
                id: "mechanics-first",
                heading: "Mechanics first",
                claimType: "verified",
                body: [
                    "Every policy story answers four questions early: what changes, who it applies to, when it starts, and what a reader has to do.",
                    "Analysis is separated from those answers and marked as analysis, both in the story and in the status field.",
                ],
            },
            {
                id: "reaction",
                heading: "Reaction is attributed, not merged",
                claimType: "verified",
                body: [
                    "Statements from officials and advocacy groups are attributed and labeled as official statements or claims.",
                    "Reaction never substitutes for the description of what a policy does.",
                ],
            },
        ],
        relatedNewsIds: ["news-national-002", "news-state-001", "news-international-001"],
        relatedBlogSlugs: ["anthropic-vs-federal-government-military-ai"],
        seoTitle: "National policy, explained without the noise | Cin Nova News",
        seoDescription:
            "How Cin Nova's national desk covers policy: scope, eligibility, and effective dates first, with reaction attributed and analysis clearly labeled.",
    }),
    demoStory({
        id: "news-national-002",
        slug: "business-coverage-aimed-at-practical-decisions",
        title: "Business coverage aimed at practical decisions",
        dek: "Company news matters here when it changes a price, a job, a product, or a rule that applies to someone outside the company.",
        coverageLevel: "national",
        category: "Business",
        location: "United States",
        publishedAt: "2026-07-20T14:05:00Z",
        heroImage: "/images/blog/business/startup-pitch-presentation.jpg",
        heroAlt: "A person presenting to a small group in a meeting room.",
        summary:
            "Business coverage is filtered by external consequence: what changes for customers, workers, or an industry rather than for a share price alone.",
        whyItMatters:
            "Corporate announcements are written to be repeated. Filtering for consequence is what separates reporting from distribution.",
        sections: [
            {
                id: "filter",
                heading: "The consequence filter",
                claimType: "verified",
                body: [
                    "A company announcement earns coverage when it changes something outside the company — pricing, employment, availability, or obligations.",
                    "Announcements that do not clear that bar are not covered as news.",
                ],
            },
            {
                id: "press-releases",
                heading: "Press releases are official statements",
                claimType: "official",
                body: [
                    "Company communications are labeled as official statements in the source list, never as independent verification.",
                    "Where a company's figures cannot be checked, the story says the figures are company-reported.",
                ],
            },
        ],
        relatedNewsIds: ["news-national-003", "news-state-002", "news-local-003"],
        relatedBlogSlugs: ["the-companies-building-the-ai-economy"],
        seoTitle: "Business coverage aimed at practical decisions | Cin Nova News",
        seoDescription:
            "Cin Nova's national business beat covers announcements that change prices, jobs, availability, or rules — and labels company figures as company-reported.",
    }),
    demoStory({
        id: "news-national-003",
        slug: "technology-reporting-built-on-verifiable-claims",
        title: "Technology reporting built on verifiable claims",
        dek: "Capability claims are tested against documentation and independent evidence before they are repeated.",
        coverageLevel: "national",
        category: "Technology",
        location: "United States",
        publishedAt: "2026-07-17T15:35:00Z",
        heroImage: "/images/blog/ai/developer-laptop-ai-code.jpg",
        heroAlt: "A developer working on code at a laptop.",
        summary:
            "Technology coverage distinguishes between what a system is documented to do, what a vendor says it does, and what has been independently demonstrated.",
        whyItMatters:
            "Technology claims travel faster than the evidence behind them, and the gap between demo and deployment is where readers get misled.",
        sections: [
            {
                id: "three-buckets",
                heading: "Three buckets, never merged",
                claimType: "verified",
                body: [
                    "Documented behavior, vendor claims, and independently reproduced results are reported as three different categories.",
                    "The source list carries the same distinction, so readers can see which category a story rests on.",
                ],
            },
            {
                id: "benchmarks",
                heading: "Benchmarks need provenance",
                claimType: "verified",
                body: [
                    "Performance numbers are reported with who produced them and under what conditions, or they are not reported.",
                    "Vendor-run benchmarks are labeled as vendor-run.",
                ],
            },
        ],
        relatedNewsIds: ["news-national-001", "news-international-003", "news-national-004"],
        // Kept to blog slugs that exist in committed history so the News feature
        // can ship independently of in-progress blog work.
        relatedBlogSlugs: ["the-companies-building-the-ai-economy", "the-hidden-infrastructure-behind-chatgpt-and-ai"],
        seoTitle: "Technology reporting built on verifiable claims | Cin Nova News",
        seoDescription:
            "How Cin Nova covers technology: documented behavior, vendor claims, and reproduced results kept separate, with provenance required for every benchmark.",
    }),
    demoStory({
        id: "news-national-004",
        slug: "culture-coverage-that-respects-the-readers-time",
        title: "Culture coverage that respects the reader's time",
        dek: "Cultural reporting explains why something is happening now and what it signals, without manufacturing a controversy.",
        coverageLevel: "national",
        category: "Culture",
        location: "United States",
        publishedAt: "2026-07-13T12:25:00Z",
        heroImage: "/images/blog/datacenters/server-cooling-aisle.jpg",
        heroAlt: "A row of equipment racks in a cooled facility aisle.",
        summary:
            "Culture coverage is built around context and pattern rather than reaction cycles, and avoids treating engagement as significance.",
        whyItMatters:
            "Attention is not the same as importance, and coverage that conflates them wastes the reader's time by design.",
        sections: [
            {
                id: "no-engagement-metrics",
                heading: "No engagement metrics as evidence",
                claimType: "verified",
                body: [
                    "Cin Nova does not publish trending or traffic figures as evidence that something matters.",
                    "Significance is argued from context and stated plainly, so a reader can disagree with the reasoning.",
                ],
            },
            {
                id: "restraint",
                heading: "Restraint about unresolved stories",
                claimType: "verified",
                body: [
                    "Where a cultural story rests on unresolved allegations, it is either reported with those allegations clearly labeled or it is not published yet.",
                    "Allegations are never restated as settled facts.",
                ],
            },
        ],
        relatedNewsIds: ["news-national-002", "news-international-004", "news-local-002"],
        relatedBlogSlugs: ["the-technology-trends-that-will-shape-the-next-decade"],
        seoTitle: "Culture coverage that respects the reader's time | Cin Nova News",
        seoDescription:
            "Cin Nova culture coverage argues significance from context instead of engagement metrics, and never restates unresolved allegations as settled facts.",
    }),

    /* ── International ───────────────────────────────────────────────────── */
    demoStory({
        id: "news-international-001",
        slug: "global-events-with-local-consequences",
        title: "Global events with local consequences",
        dek: "International coverage on Cin Nova always answers the same closing question: what does this change here?",
        coverageLevel: "international",
        category: "World affairs",
        location: "Global",
        publishedAt: "2026-07-24T09:30:00Z",
        status: "analysis",
        heroImage: "/images/blog/future-tech/emerging-technology-research.jpg",
        heroAlt: "Researchers examining equipment in a laboratory setting.",
        summary:
            "World coverage connects international developments back to prices, supply, travel, and policy that readers encounter directly.",
        whyItMatters:
            "International news is often reported as distant. The connection to daily life is usually real and usually missing.",
        sections: [
            {
                id: "connection",
                heading: "The connection is the assignment",
                claimType: "verified",
                body: [
                    "Every international story states its local consequence explicitly, or explains why the consequence is currently uncertain.",
                    "Speculative consequences are labeled as speculation rather than implied.",
                ],
            },
            {
                id: "distance",
                heading: "Reporting at distance",
                claimType: "verified",
                body: [
                    "Where Cin Nova is not on the ground, the story says so and names the outlets or records it is relying on.",
                    "Second-hand reporting is labeled as second-hand in the source list.",
                ],
            },
        ],
        relatedNewsIds: ["news-international-002", "news-national-001", "news-local-004"],
        relatedBlogSlugs: ["the-technology-trends-that-will-shape-the-next-decade"],
        seoTitle: "Global events with local consequences | Cin Nova News",
        seoDescription:
            "Cin Nova international coverage ties global developments to local effects, labels speculation, and names the records behind reporting done at distance.",
    }),
    demoStory({
        id: "news-international-002",
        slug: "market-coverage-without-hype",
        title: "Market coverage without hype",
        dek: "Global market moves are reported with their cause, their scale, and an honest statement of what is not yet known.",
        coverageLevel: "international",
        category: "Global markets",
        location: "Global",
        publishedAt: "2026-07-21T08:45:00Z",
        heroImage: "/images/blog/datacenters/database-admin-workstation.jpg",
        heroAlt: "A workstation displaying data dashboards.",
        summary:
            "Market coverage avoids narrative causation, reports magnitude in context, and states the limits of what can be attributed.",
        whyItMatters:
            "Assigning a single cause to a market move is usually storytelling. Readers making decisions need the uncertainty stated, not smoothed over.",
        sections: [
            {
                id: "causation",
                heading: "Causation is claimed carefully",
                claimType: "verified",
                body: [
                    "A move is attributed to a cause only when an analyst or institution has made that attribution on the record, and the attribution is credited.",
                    "Otherwise the story reports the move and the candidate explanations as candidates.",
                ],
            },
            {
                id: "scale",
                heading: "Scale in context",
                claimType: "verified",
                body: [
                    "Percentage moves are reported alongside the period and the baseline, so a number cannot be read as larger than it is.",
                    "No figure appears without a named source.",
                ],
            },
        ],
        relatedNewsIds: ["news-international-001", "news-international-003", "news-state-002"],
        relatedBlogSlugs: ["why-data-centers-are-becoming-the-new-gold-rush"],
        seoTitle: "Market coverage without hype | Cin Nova News",
        seoDescription:
            "How Cin Nova covers global markets: attributed causation, magnitude reported with baseline and period, and no figure published without a named source.",
    }),
    demoStory({
        id: "news-international-003",
        slug: "science-and-climate-reporting-grounded-in-sources",
        title: "Science and climate reporting grounded in sources",
        dek: "Findings are reported with their study, their sample, and their limits — including the ones the authors state themselves.",
        coverageLevel: "international",
        category: "Science & climate",
        location: "Global",
        publishedAt: "2026-07-18T10:15:00Z",
        heroImage: "/images/blog/robotics/industrial-robot-arm-factory.jpg",
        heroAlt: "An industrial robotic arm on a factory floor.",
        summary:
            "Science coverage links the underlying research, reports the stated limitations, and distinguishes peer-reviewed work from preprints and announcements.",
        whyItMatters:
            "A finding stripped of its limitations becomes a different claim, and that transformation happens most often in the headline.",
        sections: [
            {
                id: "link-the-study",
                heading: "Link the study",
                claimType: "verified",
                body: [
                    "Every science story links the primary research and identifies whether it is peer-reviewed, a preprint, or an institutional announcement.",
                    "The distinction appears in the source list, not only in the body text.",
                ],
            },
            {
                id: "limits",
                heading: "Report the limits",
                claimType: "verified",
                body: [
                    "Sample size, methodology limits, and author-stated caveats are reported as part of the finding rather than as a footnote.",
                    "Headlines are written to survive the caveats.",
                ],
            },
        ],
        relatedNewsIds: ["news-international-004", "news-national-003", "news-state-003"],
        relatedBlogSlugs: ["robotics-and-automation-in-2026"],
        seoTitle: "Science and climate reporting grounded in sources | Cin Nova News",
        seoDescription:
            "Cin Nova science and climate coverage links primary research, separates peer review from preprints, and reports author-stated limits as part of the finding.",
    }),
    demoStory({
        id: "news-international-004",
        slug: "how-international-reporting-is-verified",
        title: "How international reporting is verified",
        dek: "Verification at distance has rules: named records, corroboration, and an explicit label when neither is available yet.",
        coverageLevel: "international",
        category: "World affairs",
        location: "Global",
        publishedAt: "2026-07-14T09:00:00Z",
        heroImage: "/images/blog/real-estate/commercial-real-estate-ai.webp",
        heroAlt: "A commercial building exterior photographed from street level.",
        summary:
            "The verification standard for international stories is written down: what counts as confirmation, what counts as attribution, and what stays a claim.",
        whyItMatters:
            "Readers cannot evaluate a story's reliability unless the newsroom states its standard and applies it visibly.",
        sections: [
            {
                id: "standard",
                heading: "The standard, stated",
                claimType: "verified",
                body: [
                    "Confirmation requires a primary record or two independent sources. Anything short of that is published as attribution or as an unverified claim.",
                    "The label travels with the source in the story's source list so it is visible at the point of use.",
                ],
            },
            {
                id: "corrections",
                heading: "Corrections are part of the standard",
                claimType: "verified",
                body: [
                    "When a claim is later resolved, the story is updated with a new timestamp and the resolution is stated rather than quietly edited in.",
                    "Removing an unresolved claim without explanation is not treated as a correction.",
                ],
            },
        ],
        relatedNewsIds: ["news-international-001", "news-international-003", "news-national-004"],
        relatedBlogSlugs: ["anthropic-vs-federal-government-military-ai"],
        seoTitle: "How international reporting is verified | Cin Nova News",
        seoDescription:
            "Cin Nova's verification standard for international stories: primary records or two independent sources, with everything else labeled attribution or claim.",
    }),
];

/* ── URLs ────────────────────────────────────────────────────────────────── */

/** Landing page for the News Center (unchanged existing route). */
export function getNewsIndexUrl() {
    return `${siteUrl}/?page=news`;
}

/** Canonical URL for a single story. */
export function getNewsStoryUrl(story) {
    return `${siteUrl}/news/${story.slug}`;
}

/** In-app path for a single story (used for real, crawlable anchors). */
export function getNewsStoryPath(story) {
    return `/news/${story.slug}`;
}

/* ── Selection helpers ───────────────────────────────────────────────────── */

function byNewestFirst(a, b) {
    return Date.parse(b.publishedAt || 0) - Date.parse(a.publishedAt || 0);
}

/** All stories flagged for publication, newest first (includes demo fixtures). */
export function getPublishedNewsStories() {
    return newsPosts.filter((story) => story.isPublished !== false).sort(byNewestFirst);
}

/**
 * Stories eligible for public SEO surfaces (sitemap, prerendered route HTML).
 * Demo fixtures are deliberately excluded — see the editorial rules at the top.
 */
export function getPublicNewsStories() {
    return getPublishedNewsStories().filter((story) => !story.isDemo);
}

export function getNewsStoryBySlug(slug = "") {
    return newsPosts.find((story) => story.slug === slug && story.isPublished !== false) || null;
}

export function getNewsStoryById(id = "") {
    return newsPosts.find((story) => story.id === id) || null;
}

/** Published stories for one coverage level, newest first. */
export function getNewsStoriesByCoverage(coverageLevel, limit) {
    const stories = getPublishedNewsStories().filter(
        (story) => story.coverageLevel === coverageLevel,
    );
    return typeof limit === "number" ? stories.slice(0, limit) : stories;
}

/** Latest stories across every coverage level, optionally filtered to one. */
export function getLatestNewsStories({ coverageLevel = "all", limit } = {}) {
    const stories =
        coverageLevel === "all"
            ? getPublishedNewsStories()
            : getNewsStoriesByCoverage(coverageLevel);
    return typeof limit === "number" ? stories.slice(0, limit) : stories;
}

/** Resolve `relatedNewsIds` to published stories, skipping self and misses. */
export function getRelatedNewsStories(story, limit = 3) {
    if (!story) return [];
    const resolved = (story.relatedNewsIds || [])
        .filter((id) => id !== story.id)
        .map((id) => getNewsStoryById(id))
        .filter((related) => related && related.isPublished !== false);
    return resolved.slice(0, limit);
}

export function getCoverageLevel(key) {
    return NEWS_COVERAGE_LEVELS.find((level) => level.key === key) || null;
}

export function getCoverageLabel(key) {
    return getCoverageLevel(key)?.label || "";
}

/** True when the feed is still running on demo fixtures (drives the UI notice). */
export function hasDemoNewsFixtures() {
    return getPublishedNewsStories().some((story) => story.isDemo);
}

/* ── Formatting ──────────────────────────────────────────────────────────── */

/** Human-readable date, e.g. "July 21, 2026". Returns "" for missing values. */
export function formatNewsDate(value) {
    if (!value) return "";
    const parsed = Date.parse(value);
    if (Number.isNaN(parsed)) return "";
    return new Date(parsed).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    });
}

/** Compact date for cards, e.g. "Jul 21, 2026". */
export function formatNewsDateShort(value) {
    if (!value) return "";
    const parsed = Date.parse(value);
    if (Number.isNaN(parsed)) return "";
    return new Date(parsed).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
    });
}

/** ISO value for <time dateTime>, or "" when the timestamp is unusable. */
export function toNewsDateTimeAttr(value) {
    if (!value) return "";
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? "" : new Date(parsed).toISOString();
}

/* ── SEO ─────────────────────────────────────────────────────────────────── */

function toAbsolute(path = "") {
    if (!path) return `${siteUrl}${NEWS_DEFAULT_IMAGE}`;
    if (/^https?:\/\//i.test(path)) return path;
    return `${siteUrl}${path.startsWith("/") ? "" : "/"}${path}`;
}

/**
 * Title / description / canonical / OG image for one story.
 * Shared by the React page and the build-time route generator so both emit
 * identical metadata.
 */
export function getNewsStoryMetadata(story) {
    return {
        title: story.seoTitle || `${story.title} | Cin Nova News`,
        description: story.seoDescription || story.dek || story.summary,
        canonical: getNewsStoryUrl(story),
        type: "article",
        image: toAbsolute(story.heroImage),
        imageAlt: story.heroAlt || story.title,
        // Demo fixtures must never be indexed as reporting.
        noindex: Boolean(story.isDemo),
    };
}

/**
 * NewsArticle + BreadcrumbList JSON-LD graph for one story, including the
 * author Person node and image metadata.
 */
export function buildNewsArticleSchema(story, relatedStories = []) {
    const metadata = getNewsStoryMetadata(story);
    const author = getNewsAuthor(story.author);
    const datePublished = toNewsDateTimeAttr(story.publishedAt);
    const dateModified = toNewsDateTimeAttr(story.updatedAt || story.publishedAt);
    const coverage = getCoverageLabel(story.coverageLevel);

    const newsArticle = {
        "@type": "NewsArticle",
        headline: story.title,
        alternativeHeadline: story.dek,
        description: metadata.description,
        url: metadata.canonical,
        mainEntityOfPage: metadata.canonical,
        articleSection: `${coverage} / ${story.category}`,
        ...(datePublished ? { datePublished } : {}),
        ...(dateModified ? { dateModified } : {}),
        image: {
            "@type": "ImageObject",
            url: metadata.image,
            name: metadata.imageAlt,
        },
        author: {
            "@type": "Person",
            name: author.name,
            ...(author.role ? { jobTitle: author.role } : {}),
            ...(author.bio ? { description: author.bio } : {}),
            url: getNewsIndexUrl(),
        },
        publisher: {
            "@type": "Organization",
            name: "Cin Nova",
            url: siteUrl,
            logo: {
                "@type": "ImageObject",
                url: `${siteUrl}${NEWS_DEFAULT_IMAGE}`,
                name: "Cin Nova",
            },
        },
        isPartOf: {
            "@type": "CollectionPage",
            name: "Cin Nova News",
            url: getNewsIndexUrl(),
        },
        ...(story.location ? { contentLocation: { "@type": "Place", name: story.location } } : {}),
        ...(story.sources?.length
            ? {
                  citation: story.sources.map((source) => ({
                      "@type": "CreativeWork",
                      name: source.label,
                      url: source.url,
                      ...(source.publisher
                          ? { publisher: { "@type": "Organization", name: source.publisher } }
                          : {}),
                  })),
              }
            : {}),
        relatedLink: relatedStories.map((related) => getNewsStoryUrl(related)),
    };

    const breadcrumb = {
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
            { "@type": "ListItem", position: 2, name: "News", item: getNewsIndexUrl() },
            { "@type": "ListItem", position: 3, name: coverage, item: `${getNewsIndexUrl()}#news-latest` },
            { "@type": "ListItem", position: 4, name: story.title, item: metadata.canonical },
        ],
    };

    return { "@context": "https://schema.org", "@graph": [newsArticle, breadcrumb] };
}
