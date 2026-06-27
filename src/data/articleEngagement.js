import { resources } from "./resources.js";

export const categoryProductKey = {
    "Artificial Intelligence": "techmate",
    "Real Estate Technology": "real-estate",
    "Education Technology": "studynest",
    "Healthcare Technology": "poisonguard",
    "Construction Technology": "techmate",
    "Data Centers & Databases": "techmate",
    "Robotics & Automation": "techmate",
    "Future Technology": "techmate",
    "Business & Entrepreneurship": "studynest",
    "CinNova Updates": "studynest",
};

export const productQuizQuestions = [
    {
        id: "goal",
        prompt: "What are you trying to solve right now?",
        options: [
            { label: "Study smarter or tutor my child", scores: { studynest: 3, kiddo: 2 } },
            { label: "Analyze property deals or cash flow", scores: { "real-estate": 3 } },
            { label: "Keep my home or pets safer from hazards", scores: { poisonguard: 3 } },
            { label: "Fix tech problems without calling support", scores: { techmate: 3 } },
            { label: "Early learning games for young kids", scores: { kiddo: 3, studynest: 1 } },
        ],
    },
    {
        id: "user",
        prompt: "Who is the primary user?",
        options: [
            { label: "Student or parent", scores: { studynest: 2, kiddo: 2 } },
            { label: "Investor, agent, or landlord", scores: { "real-estate": 3 } },
            { label: "Family with pets or kids at home", scores: { poisonguard: 2, kiddo: 1 } },
            { label: "Anyone with devices that break", scores: { techmate: 3 } },
            { label: "Preschool or early elementary learner", scores: { kiddo: 3 } },
        ],
    },
    {
        id: "priority",
        prompt: "What matters most in a CinNova product?",
        options: [
            { label: "Faster learning and better retention", scores: { studynest: 3, kiddo: 1 } },
            { label: "Clear numbers before I commit to a deal", scores: { "real-estate": 3 } },
            { label: "Emergency-ready safety guidance", scores: { poisonguard: 3 } },
            { label: "Step-by-step troubleshooting", scores: { techmate: 3 } },
            { label: "Fun daily habits for young learners", scores: { kiddo: 3 } },
        ],
    },
];

export const productQuizResults = {
    studynest: {
        name: "StudyNest",
        page: "studynest",
        summary: "Turn notes into flashcards, study plans, and AI tutoring support.",
    },
    poisonguard: {
        name: "PoisonGuard",
        page: "poisonguard",
        summary: "Scan household products, get pet-safe warnings, and organize emergency guidance.",
    },
    techmate: {
        name: "TechMate AI",
        page: "techmate",
        summary: "Describe the issue and get guided fixes for phones, computers, and WiFi.",
    },
    kiddo: {
        name: "Kiddo",
        page: "kiddo",
        summary: "ABC, reading, and counting games with a parent progress dashboard.",
    },
    "real-estate": {
        name: "Cin Nova Real Estate",
        page: "real-estate",
        summary: "Cap rate, cash flow, mortgage math, and deal comparison in one place.",
    },
};

export const pollsByCategory = {
    "Education Technology": {
        question: "Would you use AI tutoring for your child?",
        options: ["Yes, regularly", "Maybe for tough topics", "Only with teacher approval", "Not interested"],
    },
    "Healthcare Technology": {
        question: "How confident are you identifying household chemical risks?",
        options: ["Very confident", "Somewhat confident", "Not very confident", "I would use a scanner app"],
    },
    "Real Estate Technology": {
        question: "What slows down your investment decisions most?",
        options: ["Cash flow math", "Mortgage scenarios", "Market comps", "Repair estimates"],
    },
    default: {
        question: "Which topic should Cin Nova cover next on the blog?",
        options: ["AI product building", "Family safety", "Study systems", "Real estate deals"],
    },
};

export const checklistsByProduct = {
    poisonguard: [
        {
            id: "pet-safety",
            title: "Pet Safety Checklist",
            items: [
                "Store cleaners and medications in locked cabinets",
                "Keep chocolate, grapes, and xylitol products out of reach",
                "Check houseplants against a pet-toxic list",
                "Save your emergency vet number in your phone",
                "Review pet-safe zones before guests visit",
            ],
        },
        {
            id: "household-chemical",
            title: "Household Chemical Checklist",
            items: [
                "Label every bottle and keep originals when possible",
                "Never mix bleach with ammonia or acids",
                "Store chemicals upright with caps secured",
                "Keep products in original child-resistant packaging",
                "Dispose of expired cleaners at a hazardous waste site",
            ],
        },
        {
            id: "emergency-readiness",
            title: "Emergency Readiness Checklist",
            items: [
                "Save Poison Control: 1-800-222-1222",
                "Post emergency numbers on the fridge",
                "Know product name and active ingredient before calling",
                "Keep a first-aid kit accessible to adults only",
                "Run a monthly safety walkthrough with your family",
            ],
        },
    ],
};

export const glossaryByCategory = {
    "Artificial Intelligence": {
        LLM: "Large Language Model — AI trained on text to generate and reason about language.",
        ROI: "Return on Investment — profit relative to money spent.",
        API: "Application Programming Interface — how software systems talk to each other.",
        "machine learning": "Systems that improve from data without explicit step-by-step rules.",
    },
    "Real Estate Technology": {
        "cap rate": "Net operating income divided by property value — a quick yield snapshot.",
        NOI: "Net Operating Income — income after operating expenses, before debt service.",
        PITI: "Principal, Interest, Taxes, and Insurance — total monthly housing payment.",
        "cash flow": "Money left after all income and expenses on a property.",
        APY: "Annual Percentage Yield — effective yearly return including compounding.",
    },
    "Education Technology": {
        "active recall": "Testing yourself instead of only rereading material.",
        "spaced repetition": "Reviewing information at increasing intervals to improve retention.",
        LLM: "Large Language Model — can power tutoring, summarization, and Q&A.",
    },
    "Healthcare Technology": {
        MSDS: "Material Safety Data Sheet — hazard and handling info for chemicals.",
        exposure: "Contact with a substance through skin, ingestion, or inhalation.",
    },
    default: {
        AI: "Artificial Intelligence — software that performs tasks requiring human-like reasoning.",
        ROI: "Return on Investment — value gained relative to cost.",
        SaaS: "Software as a Service — subscription software delivered online.",
    },
};

export const relatedResourceSlugsByCategory = {
    "Education Technology": ["ai-study-planning-starter-guide", "weekly-student-study-planner-template"],
    "Healthcare Technology": ["household-chemical-safety-checklist", "family-safety-resource-kit", "poison-safety-technology-white-paper"],
    "Real Estate Technology": ["real-estate-deal-analysis-template", "real-estate-cash-flow-analysis-template"],
    "Artificial Intelligence": ["ai-product-launch-checklist", "techmate-ai-troubleshooting-brochure"],
    "Business & Entrepreneurship": ["newsletter-growth-playbook-for-app-companies", "ai-product-launch-checklist"],
    "CinNova Updates": ["cin-nova-product-ecosystem-brochure"],
};

export const launchChecklistItems = [
    "Define the core user problem in one sentence",
    "Confirm target audience and early feedback channel",
    "Ship a narrow MVP with one clear workflow",
    "Add analytics for the primary conversion action",
    "Prepare launch copy, screenshots, and support FAQ",
    "Plan a two-week post-launch review cycle",
];

export function getInteractiveBlockType(post = {}) {
    const category = post.category || "";
    const productKey = categoryProductKey[category];

    if (productKey === "real-estate") return null;
    if (productKey === "poisonguard") return "safety-checklist";
    if (category === "Education Technology") return "quiz";
    if (category === "Business & Entrepreneurship" || category === "CinNova Updates") {
        return "launch-checklist";
    }
    if (
        [
            "Artificial Intelligence",
            "Future Technology",
            "Data Centers & Databases",
            "Robotics & Automation",
            "Construction Technology",
        ].includes(category)
    ) {
        return "explainer";
    }
    return null;
}

export function getArticleTakeaways(post = {}) {
    if (Array.isArray(post.takeaways) && post.takeaways.length) {
        return post.takeaways.map((item) =>
            typeof item === "string" ? { title: "Key takeaway", body: item } : item
        );
    }

    const sections = Array.isArray(post.content) ? post.content : [];
    const explicit = sections.filter((section) =>
        /takeaway|key point|summary|conclusion/i.test(section.heading || "")
    );

    if (explicit.length) {
        return explicit.slice(0, 5).map((section) => ({
            title: section.heading,
            body:
                section.body ||
                (Array.isArray(section.list) ? section.list.join(" ") : "") ||
                "See the full section for details.",
        }));
    }

    return sections.slice(0, 4).map((section) => {
        const firstSentence =
            (section.body || "").match(/[^.!?]+[.!?]+/)?.[0]?.trim() || section.heading;
        return {
            title: section.heading,
            body: firstSentence,
        };
    });
}

export function getArticleEngagement(post = {}) {
    const category = post.category || "";
    const productKey = categoryProductKey[category] || "studynest";
    const poll = pollsByCategory[category] || pollsByCategory.default;
    const glossary = {
        ...glossaryByCategory.default,
        ...(glossaryByCategory[category] || {}),
    };
    const resourceSlugs = relatedResourceSlugsByCategory[category] || ["cin-nova-product-ecosystem-brochure"];
    const relatedResources = resourceSlugs
        .map((slug) => resources.find((r) => r.slug === slug))
        .filter(Boolean);

    return {
        productKey,
        poll,
        glossary,
        relatedResources,
        checklists: productKey === "poisonguard" ? checklistsByProduct.poisonguard : [],
        showCalculators: productKey === "real-estate",
        showStudyTools: category === "Education Technology",
        showChecklists: productKey === "poisonguard",
    };
}

export function scoreProductQuiz(answers = []) {
    const totals = {};
    answers.forEach((answer) => {
        Object.entries(answer.scores || {}).forEach(([key, value]) => {
            totals[key] = (totals[key] || 0) + value;
        });
    });
    const winner = Object.entries(totals).sort((a, b) => b[1] - a[1])[0]?.[0] || "studynest";
    return productQuizResults[winner] || productQuizResults.studynest;
}

export function buildStudyToolsFromPost(post = {}) {
    const sections = Array.isArray(post.content) ? post.content : [];
    const flashcards = sections.slice(0, 4).map((section) => ({
        prompt: section.heading,
        answer: (section.body || "").split(/[.!?]/)[0]?.trim() || section.heading,
    }));
    const quiz = sections.slice(0, 3).map((section, i) => ({
        question: `Which topic does "${section.heading}" cover?`,
        options: [
            section.heading,
            sections[(i + 1) % sections.length]?.heading || "Another section",
            sections[(i + 2) % sections.length]?.heading || "A different topic",
            "None of the above",
        ],
        correct: 0,
    }));
    const summaries = sections.slice(0, 3).map((section) => ({
        title: section.heading,
        body: (section.body || "").slice(0, 160) + ((section.body || "").length > 160 ? "…" : ""),
    }));
    return { flashcards, quiz, summaries };
}

export function answerArticleQuestion(question = "", post = {}) {
    const q = question.toLowerCase().trim();
    if (!q) return "Ask a question about this article — try a topic from the headings or a term from the glossary.";
    const sections = Array.isArray(post.content) ? post.content : [];
    const matches = sections
        .map((section) => {
            const text = `${section.heading} ${section.body || ""}`.toLowerCase();
            const words = q.split(/\s+/).filter((w) => w.length > 3);
            const score = words.reduce((sum, word) => sum + (text.includes(word) ? 1 : 0), 0);
            return { section, score };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score);

    if (matches.length) {
        const best = matches[0].section;
        const excerpt = (best.body || "").split(/[.!?]/).find((s) => s.trim().length > 40)?.trim();
        return excerpt
            ? `From "${best.heading}": ${excerpt}.`
            : `"${best.heading}" is one of the main sections in this article. Scroll to that heading for the full explanation.`;
    }

    if (/product|studynest|poisonguard|techmate|kiddo|real estate/i.test(q)) {
        return "Cin Nova builds focused products for study, safety, tech support, early learning, and real estate analysis. Use the product quiz below to see which one fits your needs.";
    }

    return "I could not find a direct match in this article. Try asking about a specific heading, or browse the table of contents on the right.";
}

export function highlightGlossaryTerms(text = "", glossary = {}) {
    if (!text || !Object.keys(glossary).length) return [{ type: "text", value: text }];
    const terms = Object.keys(glossary).sort((a, b) => b.length - a.length);
    const pattern = new RegExp(`\\b(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`, "gi");
    const parts = [];
    let lastIndex = 0;
    let match;
    while ((match = pattern.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push({ type: "text", value: text.slice(lastIndex, match.index) });
        }
        const termKey = terms.find((t) => t.toLowerCase() === match[0].toLowerCase());
        parts.push({ type: "term", value: match[0], definition: glossary[termKey] });
        lastIndex = pattern.lastIndex;
    }
    if (lastIndex < text.length) {
        parts.push({ type: "text", value: text.slice(lastIndex) });
    }
    return parts.length ? parts : [{ type: "text", value: text }];
}
