export const products = [
    {
        name: "StudyNest",
        category: "Education AI",
        icon: "SN",
        status: "In Development",
        description:
            "AI-powered study tools with notes, flashcards, quizzes, study guides, tutoring, planner support, and future stylus note-taking.",
        page: "studynest",
        image: "/images/products/studynest-student-learning.jpg",
        imageAlt: "Student writing organized notes in a study checklist \u2014 the foundation of effective learning",
    },
    {
        name: "PoisonGuard",
        category: "Safety Technology",
        icon: "PG",
        status: "In Development",
        description:
            "A poison and chemical safety assistant for families, pets, schools, and future public safety use.",
        page: "poisonguard",
        image: "/images/products/poisonguard-pet-family-safety.jpg",
        imageAlt: "Happy dog outdoors \u2014 PoisonGuard helps protect pets and families from household hazards",
    },
    {
        name: "Kiddo",
        category: "Early Learning",
        icon: "KD",
        status: "Concept Stage",
        description:
            "A playful early-learning platform for ABCs, reading, writing, counting, math, characters, levels, and rewards.",
        page: "kiddo",
        image: "/images/products/kiddo-child-learning.jpg",
        imageAlt: "Joyful child covered in colorful paint \u2014 Kiddo makes early learning fun and playful",
    },
    {
        name: "TechMate AI",
        category: "Tech Support AI",
        icon: "TM",
        status: "Concept Stage",
        description:
            "An AI troubleshooting assistant for phones, computers, software, apps, smart devices, and everyday tech problems.",
        page: "techmate",
        image: "/images/products/techmate-ai-device-support.jpg",
        imageAlt: "MacBook with code editor open on a clean home office desk \u2014 TechMate AI guides device troubleshooting",
    },
    {
        name: "Cin Nova Real Estate",
        category: "Real Estate AI",
        icon: "RE",
        status: "Active Build",
        description:
            "AI tools for property analysis, deal evaluation, mortgage estimates, cash flow, commercial real estate, land, and development intelligence.",
        page: "real-estate",
        image: "/images/products/cinnova-real-estate-property.jpg",
        imageAlt: "Classic white colonial house with a green lawn \u2014 Cin Nova Real Estate AI for property analysis",
    },
];

export const productDetails = {
    studynest: {
        whoFor: ["High school and college students", "Self-directed learners", "Exam preppers and certification seekers"],
        problem:
            "Students spend hours rereading notes without retaining anything. StudyNest converts notes into active recall tools \u2014 flashcards, quizzes, and AI-guided sessions \u2014 so studying actually sticks.",
        features: [
            "AI-powered flashcard generation",
            "Smart quiz builder",
            "Note summarization",
            "Spaced repetition engine",
            "Study planner",
            "AI tutor chat",
            "Progress dashboard",
            "Future stylus note-taking",
        ],
    },
    poisonguard: {
        whoFor: ["Pet owners and families", "Parents of young children", "Schools and daycare centers"],
        problem:
            "Most families don't know which household products, plants, or foods are toxic to their pets or kids. PoisonGuard puts instant hazard lookup and emergency guidance in your pocket.",
        features: [
            "Product barcode scanner",
            "Ingredient toxicity lookup",
            "Pet-specific safety database",
            "Plant hazard identification",
            "Emergency first-aid guidance",
            "Poison Control integration",
            "Scan history log",
            "Multi-pet support",
        ],
    },
    kiddo: {
        whoFor: ["Parents of children ages 2\u20137", "Early childhood educators", "Homeschool families"],
        problem:
            "Early learning apps are either too passive or too complex. Kiddo uses characters, levels, and rewards to make ABCs, reading, and counting genuinely fun while giving parents a clear view of progress.",
        features: [
            "ABC and phonics lessons",
            "Interactive reading games",
            "Counting and number activities",
            "Reward badges and stars",
            "Character companions",
            "Parent progress dashboard",
            "Age-adaptive difficulty",
            "No ads, no in-app purchases",
        ],
    },
    techmate: {
        whoFor: ["Non-technical users and families", "Small business owners", "Students and remote workers"],
        problem:
            "Tech issues send most people to YouTube rabbit holes or expensive repair shops. TechMate AI diagnoses the problem, explains it in plain English, and walks you through the fix step by step.",
        features: [
            "Conversational AI assistant",
            "Device health diagnostics",
            "Error code lookup",
            "Network troubleshooting",
            "Step-by-step repair guides",
            "Software and app help",
            "Smart device support",
            "Available 24/7",
        ],
    },
    "real-estate": {
        whoFor: ["Real estate investors", "First-time homebuyers", "Agents and wholesalers"],
        problem:
            "Evaluating a property deal means pulling data from dozens of sources and running complex calculations by hand. Cin Nova Real Estate AI automates the analysis so decisions are faster and more confident.",
        features: [
            "AI deal analyzer",
            "Cash flow calculator",
            "Cap rate and ROI estimator",
            "Mortgage and financing tools",
            "Market trend intelligence",
            "Property comparables",
            "Commercial real estate analysis",
            "Land and development scoring",
        ],
    },
};

export function normalizeProductStatus(status) {
    if (status === "Active Build") return { label: "Available", variant: "available" };
    if (status === "In Development") return { label: "Beta", variant: "beta" };
    return { label: "Coming Soon", variant: "coming-soon" };
}

export function getProductByPage(page) {
    return products.find((product) => product.page === page);
}

export function getOtherProducts(page) {
    return products.filter((product) => product.page !== page);
}
