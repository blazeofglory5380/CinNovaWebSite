/**
 * Phase 7B — Blog SEO / linking / source remediation overlays.
 * Merged onto published posts during enrichment in blogPosts.js.
 * Does not redesign the Blog; additive metadata and internal-link boosts only.
 */

/** @typedef {{ seoTitle?: string, seoDescription?: string, sources?: Array<{label: string, publisher: string, url: string, note?: string}>, relatedNewsIds?: string[] }} SeoOverlay */

/** Explicit SEO + sources + optional News links for high-priority published posts. */
export const blogSeoOverlays = {
    // Cornerstones 1–15
    1: {
        seoTitle: "How AI Is Transforming Education in 2026 | CinNova",
        seoDescription:
            "See how AI tutoring, adaptive practice, and study planning are changing classrooms—and why teachers still matter more than ever.",
        sources: [
            {
                label: "AI Risk Management Framework",
                publisher: "NIST",
                url: "https://www.nist.gov/itl/ai-risk-management-framework",
                note: "Governance context for trustworthy AI systems used in education products.",
            },
            {
                label: "Use of Technology in Teaching and Learning",
                publisher: "U.S. Department of Education",
                url: "https://www.ed.gov/teaching-and-learning",
                note: "Federal education technology orientation for schools and families.",
            },
        ],
    },
    2: {
        seoTitle: "The Infrastructure Behind ChatGPT and Modern AI | CinNova",
        seoDescription:
            "A plain-language look at chips, data centers, power, and cloud systems that make large AI models usable at scale.",
        sources: [
            {
                label: "Electric Power Monthly",
                publisher: "U.S. Energy Information Administration",
                url: "https://www.eia.gov/electricity/monthly/",
                note: "Primary U.S. electricity demand and generation statistics.",
            },
            {
                label: "Data Centers and Energy Use",
                publisher: "International Energy Agency",
                url: "https://www.iea.org/energy-system/buildings/data-centres-and-data-transmission-networks",
                note: "Authoritative overview of data-center energy demand trends.",
            },
        ],
        relatedNewsIds: ["news-national-2026-06-ferc-large-load"],
    },
    3: {
        seoTitle: "Why Data Centers Are the New Digital Gold Rush | CinNova",
        seoDescription:
            "Why hyperscale data centers are racing for land, power, and water—and what that means for communities and AI apps.",
        sources: [
            {
                label: "Data Centres and Data Transmission Networks",
                publisher: "International Energy Agency",
                url: "https://www.iea.org/energy-system/buildings/data-centres-and-data-transmission-networks",
            },
            {
                label: "FERC large-load interconnection oversight",
                publisher: "Federal Energy Regulatory Commission",
                url: "https://www.ferc.gov/",
                note: "U.S. federal context for large electricity loads and grid rules.",
            },
        ],
        relatedNewsIds: [
            "news-local-2026-07-sarasota-data-center",
            "news-national-2026-06-ferc-large-load",
        ],
    },
    4: {
        seoTitle: "Companies Building the AI Economy in 2026 | CinNova",
        seoDescription:
            "Map the AI stack from chips and clouds to model labs and application products—and where CinNova fits.",
        sources: [
            {
                label: "AI Risk Management Framework",
                publisher: "NIST",
                url: "https://www.nist.gov/itl/ai-risk-management-framework",
            },
        ],
        relatedNewsIds: ["news-national-2026-07-meta-iris-chip"],
    },
    5: {
        seoTitle: "Can America's Power Grid Handle AI Demand? | CinNova",
        seoDescription:
            "How AI data centers stress regional grids, why interconnection queues matter, and what investors should watch.",
        sources: [
            {
                label: "Electric Power Monthly",
                publisher: "U.S. Energy Information Administration",
                url: "https://www.eia.gov/electricity/monthly/",
            },
            {
                label: "FERC",
                publisher: "Federal Energy Regulatory Commission",
                url: "https://www.ferc.gov/",
            },
        ],
        relatedNewsIds: [
            "news-national-2026-06-ferc-large-load",
            "news-state-2026-07-virginia-data-center-tax",
        ],
    },
    6: {
        seoTitle: "AI Tutors and Personalized Learning Explained | CinNova",
        seoDescription:
            "What AI tutors do well, where they fail, and how personalized practice can support—not replace—human teaching.",
        sources: [
            {
                label: "Use of Technology in Teaching and Learning",
                publisher: "U.S. Department of Education",
                url: "https://www.ed.gov/teaching-and-learning",
            },
        ],
    },
    7: {
        seoTitle: "How AI Is Changing Real Estate Investing | CinNova",
        seoDescription:
            "Practical ways AI helps investors screen properties, model cash flow, and compare deals before deep diligence.",
        sources: [
            {
                label: "Consumer Financial Protection Bureau — Owning a Home",
                publisher: "CFPB",
                url: "https://www.consumerfinance.gov/owning-a-home/",
            },
        ],
    },
    8: {
        seoTitle: "AI in Construction and Engineering Workflows | CinNova",
        seoDescription:
            "Where AI helps contractors with estimating, documentation, and jobsite coordination—without replacing field judgment.",
        sources: [
            {
                label: "NIST AI Risk Management Framework",
                publisher: "NIST",
                url: "https://www.nist.gov/itl/ai-risk-management-framework",
            },
        ],
    },
    9: {
        seoTitle: "Robotics and Automation Trends for 2026 | CinNova",
        seoDescription:
            "A practical view of warehouse robots, collaborative arms, and software automation for everyday businesses.",
        sources: [
            {
                label: "ISO robotics standards committee",
                publisher: "ISO",
                url: "https://www.iso.org/committee/5915511.html",
            },
        ],
    },
    10: {
        seoTitle: "Technology Trends That Will Shape the Next Decade | CinNova",
        seoDescription:
            "Which emerging technologies are likely to stick: AI workflows, infrastructure, robotics, and focused product design.",
        sources: [
            {
                label: "OECD AI Principles",
                publisher: "OECD",
                url: "https://oecd.ai/en/ai-principles",
            },
        ],
    },
    11: {
        seoTitle: "Why AI Tutors Are Not Replacing Teachers | CinNova",
        seoDescription:
            "How AI tutoring and human teaching complement each other—and what classrooms still need from people.",
        sources: [
            {
                label: "Use of Technology in Teaching and Learning",
                publisher: "U.S. Department of Education",
                url: "https://www.ed.gov/teaching-and-learning",
            },
        ],
    },
    12: {
        seoTitle: "Spaced Repetition Science for Better Learning | CinNova",
        seoDescription:
            "Why spaced repetition improves long-term memory and how students can apply it with flashcards and study apps.",
        sources: [
            {
                label: "Learning Scientists — Spaced Practice",
                publisher: "The Learning Scientists",
                url: "https://www.learningscientists.org/blog/2016/7/21-1",
                note: "Accessible summary of spaced practice research for students and teachers.",
            },
        ],
    },
    13: {
        seoTitle: "How Students Can Study Smarter With AI | CinNova",
        seoDescription:
            "Active-recall workflows, better prompts, and guardrails so AI helps students learn instead of skipping the work.",
        sources: [
            {
                label: "Learning Scientists — Retrieval Practice",
                publisher: "The Learning Scientists",
                url: "https://www.learningscientists.org/blog/2016/6/23-1",
            },
        ],
    },
    14: {
        seoTitle: "The Future of Online Education Platforms | CinNova",
        seoDescription:
            "How online learning platforms are evolving with adaptive practice, AI support, and clearer progress signals.",
        sources: [
            {
                label: "Use of Technology in Teaching and Learning",
                publisher: "U.S. Department of Education",
                url: "https://www.ed.gov/teaching-and-learning",
            },
        ],
    },
    15: {
        seoTitle: "How StudyNest Is Reimagining Learning | CinNova",
        seoDescription:
            "StudyNest connects notes, flashcards, quizzes, and planning so students turn study effort into lasting recall.",
        sources: [
            {
                label: "Learning Scientists — Spaced Practice",
                publisher: "The Learning Scientists",
                url: "https://www.learningscientists.org/blog/2016/7/21-1",
            },
        ],
    },
    31: {
        seoTitle: "The Complete Guide to Artificial Intelligence in 2026 | CinNova",
        seoDescription:
            "A practical AI reference: models, infrastructure, products, risks, and how CinNova applies AI across five apps.",
        sources: [
            {
                label: "AI Risk Management Framework",
                publisher: "NIST",
                url: "https://www.nist.gov/itl/ai-risk-management-framework",
            },
            {
                label: "OECD AI Principles",
                publisher: "OECD",
                url: "https://oecd.ai/en/ai-principles",
            },
        ],
        relatedNewsIds: [
            "news-national-2026-04-nist-ai-rmf-critical-infrastructure",
            "news-national-2026-05-cisa-agentic-ai",
        ],
    },
    32: {
        // Already has seoTitle/metaDescription in overrides; keep description tightened if overlay wins
        seoDescription:
            "A complete 2026 guide to AI in education: tutors, spaced repetition, platforms, risks, and StudyNest workflows.",
        sources: [
            {
                label: "Use of Technology in Teaching and Learning",
                publisher: "U.S. Department of Education",
                url: "https://www.ed.gov/teaching-and-learning",
            },
            {
                label: "Learning Scientists — Spaced Practice",
                publisher: "The Learning Scientists",
                url: "https://www.learningscientists.org/blog/2016/7/21-1",
            },
        ],
    },
    // Product / healthcare / RE / AI news priorities
    20: {
        seoTitle: "Student Dashboards That Actually Help | CinNova",
        seoDescription:
            "What makes a student dashboard useful: next actions, weak-topic signals, and calm progress—not metric overload.",
    },
    22: {
        seoTitle: "Construction Tech for Small Contractors | CinNova",
        seoDescription:
            "Practical jobsite documentation, scheduling, and estimating tools that help small crews protect margins.",
    },
    24: {
        seoTitle: "Robotics Automation for Everyday Businesses | CinNova",
        seoDescription:
            "How to spot automation candidates in everyday workflows before buying robots or AI software.",
    },
    28: {
        seoTitle: "Database Basics for Product Founders | CinNova",
        seoDescription:
            "A plain-language primer on data models, reliability, and why databases matter for product founders.",
    },
    29: {
        seoTitle: "AI in Construction Estimating | CinNova",
        seoDescription:
            "Where AI helps contractors draft estimates faster—and why human review of scope and risk still matters.",
    },
    30: {
        seoTitle: "Robotics, AI, and the Next Wave of Automation | CinNova",
        seoDescription:
            "How robotics and AI software share the same lesson: clear constraints, measurable goals, and staged rollout.",
    },
    16: {
        seoTitle: "Home Safety Tips for Families | CinNova",
        seoDescription:
            "Practical home safety habits for storage, labeling, scan history, and emergency prep—plus how PoisonGuard can help.",
        sources: [
            {
                label: "Poison Help",
                publisher: "Health Resources & Services Administration",
                url: "https://poisonhelp.hrsa.gov/",
                note: "Official U.S. poison-help entry point (1-800-222-1222).",
            },
            {
                label: "Poison Prevention",
                publisher: "CDC",
                url: "https://www.cdc.gov/poisonprevention/",
            },
        ],
    },
    17: {
        seoTitle: "How Technology Can Support Parents | CinNova",
        seoDescription:
            "Parent dashboards, short learning sessions, and safety checks that fit family routines without adding noise.",
    },
    18: {
        seoTitle: "AI Assistants for Small Businesses | CinNova",
        seoDescription:
            "Where small teams should start with AI assistants, what to automate first, and the guardrails that prevent mistakes.",
    },
    19: {
        seoTitle: "How AI Changes Property Search for Investors | CinNova",
        seoDescription:
            "AI property search can screen listings faster—if investors still verify rent, expenses, and local market assumptions.",
    },
    21: {
        seoTitle: "Digital Triage for Family Safety Decisions | CinNova",
        seoDescription:
            "How digital triage, scan history, and clear next steps can reduce panic when a household safety question appears.",
        sources: [
            {
                label: "Poison Help",
                publisher: "Health Resources & Services Administration",
                url: "https://poisonhelp.hrsa.gov/",
            },
        ],
    },
    23: {
        seoTitle: "Why Data Centers Matter to Everyday Apps | CinNova",
        seoDescription:
            "How cloud regions, latency, and reliability in data centers shape the apps people use every day.",
        sources: [
            {
                label: "Data Centres and Data Transmission Networks",
                publisher: "International Energy Agency",
                url: "https://www.iea.org/energy-system/buildings/data-centres-and-data-transmission-networks",
            },
        ],
        relatedNewsIds: ["news-national-2026-06-ferc-large-load"],
    },
    25: {
        seoTitle: "Future Technology Trends Worth Watching | CinNova",
        seoDescription:
            "A practical filter for emerging tech: focused workflows, measurable value, and durable product design.",
    },
    26: {
        seoTitle: "How Founders Can Validate Multiple App Ideas | CinNova",
        seoDescription:
            "A simple scorecard for comparing product ideas by audience pain, feasibility, revenue path, and brand fit.",
    },
    27: {
        seoTitle: "CinNova Product Roadmap Overview | CinNova",
        seoDescription:
            "How CinNova is building across StudyNest, PoisonGuard, Kiddo, TechMate AI, and Real Estate AI.",
    },
    108: {
        seoTitle: "The Future of Real Estate AI Tools | CinNova",
        seoDescription:
            "Where real estate AI is headed: faster search, clearer deal analysis, and market signals investors can verify.",
    },
    109: {
        seoTitle: "Beginner Guide to Real Estate Deal Analysis | CinNova",
        seoDescription:
            "Learn income, expenses, financing, cap rate, and cash-on-cash basics before you commit to a property.",
    },
    110: {
        seoTitle: "Analyze a Rental Property in 10 Minutes | CinNova",
        seoDescription:
            "A fast first-pass screen for rent, expenses, financing, and cash flow before deeper due diligence.",
    },
    201: {
        seoTitle: "Anthropic vs. Federal Military AI Limits | CinNova",
        seoDescription:
            "What the Anthropic–Pentagon dispute means for military AI safeguards, procurement power, and accountability.",
        sources: [
            {
                label: "Trump administration denies unlawful retaliation in Anthropic AI blacklisting",
                publisher: "Reuters",
                url: "https://www.reuters.com/legal/litigation/trump-administration-denies-unlawful-retaliation-anthropic-ai-blacklisting-2026-06-09/",
            },
            {
                label: "Blacklisted AI company Anthropic, White House ease tensions ahead of IPO",
                publisher: "Reuters",
                url: "https://www.reuters.com/business/aerospace-defense/blacklisted-ai-company-anthropic-white-house-ease-tensions-ahead-ipo-sources-say-2026-06-05/",
            },
        ],
    },
    202: {
        seoTitle: "Utah Stratos AI Data Center Update | CinNova",
        seoDescription:
            "What changed in the Stratos Utah AI campus footprint plan and which approvals still remain ahead.",
        relatedNewsIds: ["news-state-2026-07-utah-stratos"],
        sources: [
            {
                label: "Military Installation Development Authority (MIDA)",
                publisher: "State of Utah",
                url: "https://midautah.org/",
            },
        ],
    },
    203: {
        seoTitle: "Meta Iris Chip and AI Agent Standards News | CinNova",
        seoDescription:
            "Meta's reported Iris chip timeline and new ITU work on autonomous AI agents—what the infrastructure race means next.",
        sources: [
            {
                label: "Reuters reporting on Meta Iris manufacturing plans",
                publisher: "Reuters",
                url: "https://www.reuters.com/",
                note: "Primary wire coverage for Iris production claims; treat memo details as attributed reporting.",
            },
            {
                label: "AI for Good / ITU initiatives",
                publisher: "International Telecommunication Union",
                url: "https://aiforgood.itu.int/",
                note: "Institutional home for ITU AI-for-Good and agent-governance discussions.",
            },
        ],
        relatedNewsIds: [
            "news-national-2026-07-meta-iris-chip",
            "news-national-2026-05-cisa-agentic-ai",
        ],
    },
    204: {
        seoTitle: "Georgia QTS Data Center Benefits and Backlash | CinNova",
        seoDescription:
            "How Georgia data-center incentives, water accounting, and community pushback are shaping the next projects.",
        relatedNewsIds: [
            "news-local-2026-05-fayetteville-qts-water-ban",
            "news-local-2026-06-augusta-haynes-station-qts",
            "news-state-2026-01-georgia-psc-large-load",
        ],
        sources: [
            {
                label: "Georgia Public Service Commission",
                publisher: "Georgia PSC",
                url: "https://psc.ga.gov/",
            },
        ],
    },
};

/**
 * Extra relatedReading slugs prepended for selected source posts (inbound graph repair).
 * Only topically relevant links — not spam.
 */
export const relatedReadingBoosts = {
    2: ["ai-news-meta-iris-chip-agent-standards", "why-data-centers-matter-to-everyday-apps"],
    4: ["ai-news-meta-iris-chip-agent-standards", "how-founders-can-validate-multiple-app-ideas"],
    7: [
        "the-future-of-real-estate-ai",
        "beginner-guide-to-real-estate-deal-analysis",
        "analyze-rental-property-in-10-minutes",
    ],
    9: ["future-technology-trends-worth-watching", "robotics-ai-and-the-next-wave-of-automation"],
    10: ["future-technology-trends-worth-watching", "cinnova-product-roadmap-overview"],
    1: ["the-future-of-online-education-platforms", "how-technology-can-support-parents"],
    11: ["the-future-of-online-education-platforms"],
    15: ["cinnova-product-roadmap-overview", "student-dashboards-that-actually-help"],
    16: ["how-digital-triage-can-improve-family-safety"],
    17: ["home-safety-tips-for-families", "how-digital-triage-can-improve-family-safety"],
    21: ["home-safety-tips-for-families"],
    26: ["cinnova-product-roadmap-overview"],
    27: ["how-founders-can-validate-multiple-app-ideas", "how-studynest-is-reimagining-learning"],
    31: ["ai-news-meta-iris-chip-agent-standards", "future-technology-trends-worth-watching"],
    19: ["the-future-of-real-estate-ai", "analyze-rental-property-in-10-minutes"],
    108: [
        "how-ai-is-changing-real-estate-investing",
        "beginner-guide-to-real-estate-deal-analysis",
        "analyze-rental-property-in-10-minutes",
    ],
    109: [
        "how-ai-is-changing-real-estate-investing",
        "analyze-rental-property-in-10-minutes",
        "the-future-of-real-estate-ai",
    ],
    110: [
        "beginner-guide-to-real-estate-deal-analysis",
        "how-ai-changes-property-search",
        "the-future-of-real-estate-ai",
    ],
    203: [
        "the-companies-building-the-ai-economy",
        "the-hidden-infrastructure-behind-chatgpt-and-ai",
        "the-complete-guide-to-artificial-intelligence-in-2026",
    ],
    25: [
        "the-technology-trends-that-will-shape-the-next-decade",
        "robotics-and-automation-in-2026",
        "cinnova-product-roadmap-overview",
    ],
};

/**
 * Thin-content classification for published posts under ~350 words (Phase 7B).
 * EXPAND posts are updated in blogPosts.js; others remain intentional briefs.
 */
export const thinContentClassification = {
    "home-safety-tips-for-families": "EXPAND",
    "how-technology-can-support-parents": "KEEP",
    "what-small-businesses-should-know-about-ai-assistants": "EXPAND",
    "how-ai-changes-property-search": "EXPAND",
    "student-dashboards-that-actually-help": "KEEP",
    "how-digital-triage-can-improve-family-safety": "EXPAND",
    "construction-tech-for-small-contractors": "KEEP",
    "why-data-centers-matter-to-everyday-apps": "EXPAND",
    "robotics-automation-for-everyday-businesses": "KEEP",
    "future-technology-trends-worth-watching": "EXPAND",
    "how-founders-can-validate-multiple-app-ideas": "KEEP",
    "cinnova-product-roadmap-overview": "EXPAND",
    "database-basics-for-product-founders": "KEEP",
    "ai-in-construction-estimating": "KEEP",
    "robotics-ai-and-the-next-wave-of-automation": "KEEP",
    "the-future-of-real-estate-ai": "EXPAND",
    "beginner-guide-to-real-estate-deal-analysis": "EXPAND",
    // 110 was already richer; still expand slightly if under threshold after check
    "analyze-rental-property-in-10-minutes": "KEEP",
};

export function applyBlogSeoOverlay(post) {
    const overlay = blogSeoOverlays[post.id];
    if (!overlay) return post;

    const next = { ...post, ...overlay };
    // Prefer explicit overlay seoDescription; preserve existing seoTitle if overlay omits it.
    if (overlay.seoTitle) next.seoTitle = overlay.seoTitle;
    if (overlay.seoDescription) {
        next.seoDescription = overlay.seoDescription;
        next.metaDescription = overlay.seoDescription;
    }
    if (overlay.sources) next.sources = overlay.sources;
    if (overlay.relatedNewsIds) next.relatedNewsIds = overlay.relatedNewsIds;
    return next;
}
