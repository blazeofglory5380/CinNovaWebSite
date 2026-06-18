export const affiliateLinks = {
    1: {
        id: 1,
        name: "Notion",
        category: "Productivity",
        url: "https://notion.so/?ref=cinnova",
        tagline: "All-in-one notes, tasks, and planning workspace",
        disclosure: "Affiliate link — Cin Nova earns a commission at no cost to you.",
    },
    2: {
        id: 2,
        name: "Canva",
        category: "Design",
        url: "https://canva.com/?ref=cinnova",
        tagline: "Design graphics, social posts, and presentations in minutes",
        disclosure: "Affiliate link — Cin Nova earns a commission at no cost to you.",
    },
    3: {
        id: 3,
        name: "Grammarly",
        category: "Writing",
        url: "https://grammarly.com/?ref=cinnova",
        tagline: "AI writing assistant for clear, professional, error-free writing",
        disclosure: "Affiliate link — Cin Nova earns a commission at no cost to you.",
    },
    4: {
        id: 4,
        name: "BiggerPockets Pro",
        category: "Real Estate",
        url: "https://biggerpockets.com/?ref=cinnova",
        tagline: "Real estate investing education, deal analysis tools, and community",
        disclosure: "Affiliate link — Cin Nova earns a commission at no cost to you.",
    },
    5: {
        id: 5,
        name: "DealCheck",
        category: "Real Estate",
        url: "https://dealcheck.io/?ref=cinnova",
        tagline: "Rental property and flip analyzer used by 200,000+ investors",
        disclosure: "Affiliate link — Cin Nova earns a commission at no cost to you.",
    },
    6: {
        id: 6,
        name: "Khan Academy",
        category: "Education",
        url: "https://www.khanacademy.org/",
        tagline: "Free world-class education for anyone, anywhere — K-12 and beyond",
        disclosure: "Partner link — no commission. We recommend Khan Academy because it is genuinely excellent.",
    },
};

export function getAffiliateLink(id) {
    return affiliateLinks[id] || null;
}

export function getAffiliateLinksForIds(ids = []) {
    return ids.map((id) => affiliateLinks[id]).filter(Boolean);
}
