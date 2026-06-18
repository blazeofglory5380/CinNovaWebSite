export const houseAds = [
    {
        id: 1,
        product: "StudyNest",
        headline: "Study smarter, not longer.",
        body: "Turn class notes into flashcards, build a weekly study plan, and get instant AI help when you're stuck.",
        cta: "Try StudyNest",
        page: "studynest",
        icon: "SN",
        accent: "#38bdf8",
        category: "Education AI",
    },
    {
        id: 2,
        product: "PoisonGuard",
        headline: "Household safety in your pocket.",
        body: "Scan household chemicals, get instant risk info, and keep your family and pets safe from common hazards.",
        cta: "Explore PoisonGuard",
        page: "poisonguard",
        icon: "PG",
        accent: "#10b981",
        category: "Safety Technology",
    },
    {
        id: 3,
        product: "TechMate AI",
        headline: "Fix your tech without the stress.",
        body: "Describe the problem and get a step-by-step fix. Works for phones, computers, WiFi, apps, and devices.",
        cta: "Explore TechMate AI",
        page: "techmate",
        icon: "TM",
        accent: "#7c3aed",
        category: "Tech Support AI",
    },
    {
        id: 4,
        product: "Kiddo",
        headline: "Make learning fun for little ones.",
        body: "ABCs, reading games, counting activities, and a parent dashboard — early learning built for busy families.",
        cta: "Explore Kiddo",
        page: "kiddo",
        icon: "KD",
        accent: "#f59e0b",
        category: "Early Learning",
    },
    {
        id: 5,
        product: "Cin Nova Real Estate",
        headline: "Analyze any deal in minutes.",
        body: "Cap rate, cash flow, mortgage estimates, and market intelligence — real estate AI for investors and agents.",
        cta: "Explore Real Estate AI",
        page: "real-estate",
        icon: "RE",
        accent: "#2563eb",
        category: "Real Estate AI",
    },
];

export function getAdForPlacement(placement) {
    const index = placement.length % houseAds.length;
    return houseAds[index];
}
