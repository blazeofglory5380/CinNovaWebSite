import { siteUrl } from "./blogPosts.js";
import { trackResourceDownload } from "../utils/analytics.js";

export const resourceCategories = [
    "All",
    "Free Guides",
    "Checklists",
    "Templates",
    "White Papers",
    "Product Brochures",
    "Case Studies",
];

export const resourceCategoryConfig = {
    "Free Guides": {
        icon: "📘",
        description: "Practical starter guides you can read and apply today",
        accentColor: "#38bdf8",
        accentBg: "rgba(56, 189, 248, 0.12)",
        accentBorder: "rgba(56, 189, 248, 0.25)",
    },
    "Checklists": {
        icon: "✅",
        description: "Step-by-step checklists for safety, planning, and action",
        accentColor: "#10b981",
        accentBg: "rgba(16, 185, 129, 0.12)",
        accentBorder: "rgba(16, 185, 129, 0.25)",
    },
    "Templates": {
        icon: "📋",
        description: "Ready-to-use templates for analysis, planning, and tracking",
        accentColor: "#f59e0b",
        accentBg: "rgba(245, 158, 11, 0.12)",
        accentBorder: "rgba(245, 158, 11, 0.25)",
    },
    "White Papers": {
        icon: "📄",
        description: "Research-backed papers on AI, safety, education, and market trends",
        accentColor: "#7c3aed",
        accentBg: "rgba(124, 58, 237, 0.12)",
        accentBorder: "rgba(124, 58, 237, 0.25)",
    },
    "Product Brochures": {
        icon: "🗂️",
        description: "Overview brochures for every product in the Cin Nova ecosystem",
        accentColor: "#2563eb",
        accentBg: "rgba(37, 99, 235, 0.12)",
        accentBorder: "rgba(37, 99, 235, 0.25)",
    },
    "Case Studies": {
        icon: "📊",
        description: "Real-world use cases showing how Cin Nova products solve problems",
        accentColor: "#ec4899",
        accentBg: "rgba(236, 72, 153, 0.12)",
        accentBorder: "rgba(236, 72, 153, 0.25)",
    },
};

export const resources = [
    {
        id: 1,
        title: "AI Study Planning Starter Guide",
        slug: "ai-study-planning-starter-guide",
        category: "Free Guides",
        product: "StudyNest",
        format: "PDF Guide",
        readTime: "12 min",
        description:
            "A practical guide to building better study routines with notes, flashcards, planners, and AI tutoring support.",
        downloadLabel: "Download Guide",
        featured: true,
        sections: [
            {
                heading: "What this guide covers",
                body:
                    "This guide walks through a simple weekly study system: capture class material, turn notes into review prompts, schedule practice sessions, and use AI help when a topic is unclear.",
            },
            {
                heading: "Who it is for",
                body:
                    "Students, parents, tutors, and education partners can use this as a starting point for understanding how StudyNest fits into a modern learning workflow.",
            },
            {
                heading: "How to use it",
                body:
                    "Use the framework as a checklist for study sessions, product demos, newsletter content, or future downloadable PDF assets.",
            },
        ],
    },
    {
        id: 2,
        title: "Poison Safety Technology White Paper",
        slug: "poison-safety-technology-white-paper",
        category: "White Papers",
        product: "PoisonGuard",
        format: "White Paper",
        readTime: "18 min",
        description:
            "A deeper look at why families, schools, pet owners, and organizations need faster hazard identification tools.",
        downloadLabel: "Download White Paper",
        featured: true,
        sections: [
            {
                heading: "The safety gap",
                body:
                    "People often need substance safety answers during stressful moments. A digital safety assistant can help identify products, surface risk context, and organize next steps.",
            },
            {
                heading: "Product opportunity",
                body:
                    "PoisonGuard can support household scanning, pet safety, emergency guidance, and scan history while preparing for future organization-focused editions.",
            },
            {
                heading: "Implementation priorities",
                body:
                    "Reliable data, clear language, emergency disclaimers, and fast user flows matter more than flashy features in safety software.",
            },
        ],
    },
    {
        id: 3,
        title: "Cin Nova Product Ecosystem Brochure",
        slug: "cin-nova-product-ecosystem-brochure",
        category: "Product Brochures",
        product: "Cin Nova",
        format: "Brochure",
        readTime: "8 min",
        description:
            "A concise overview of StudyNest, PoisonGuard, TechMate AI, Kiddo, and Cin Nova Real Estate.",
        downloadLabel: "Download Brochure",
        featured: true,
        sections: [
            {
                heading: "One company, five product lanes",
                body:
                    "Cin Nova is built as a multi-product software company serving education, safety, tech support, early learning, and real estate intelligence.",
            },
            {
                heading: "Shared platform thinking",
                body:
                    "Each product has its own audience, but the company benefits from shared design language, newsletter growth, content marketing, and operational systems.",
            },
            {
                heading: "Best use",
                body:
                    "Use this brochure for partnership conversations, product overviews, early customer education, and investor-style summaries.",
            },
        ],
    },
    {
        id: 4,
        title: "Real Estate Deal Analysis Template",
        slug: "real-estate-deal-analysis-template",
        category: "Free Guides",
        product: "Cin Nova Real Estate",
        format: "Worksheet",
        readTime: "10 min",
        description:
            "A beginner-friendly framework for reviewing rent, expenses, financing, cash flow, and risk before deeper analysis.",
        downloadLabel: "Download Template",
        featured: false,
        sections: [
            {
                heading: "The basic inputs",
                body:
                    "Start with price, rent, taxes, insurance, vacancy, repairs, utilities, management, and expected financing terms.",
            },
            {
                heading: "What to compare",
                body:
                    "Monthly cash flow, cap rate, cash-on-cash return, and financing assumptions tell different parts of the story.",
            },
            {
                heading: "How the app helps",
                body:
                    "Cin Nova Real Estate can turn these assumptions into faster side-by-side analysis for investors and operators.",
            },
        ],
    },
    {
        id: 5,
        title: "TechMate AI Troubleshooting Brochure",
        slug: "techmate-ai-troubleshooting-brochure",
        category: "Product Brochures",
        product: "TechMate AI",
        format: "Brochure",
        readTime: "7 min",
        description:
            "A product overview for AI chat support, device diagnostics, error lookup, network troubleshooting, and repair guides.",
        downloadLabel: "Download Brochure",
        featured: false,
        sections: [
            {
                heading: "Everyday support problems",
                body:
                    "Users need help understanding error messages, device behavior, slow networks, software issues, and repair steps.",
            },
            {
                heading: "Assistant-led workflows",
                body:
                    "TechMate AI can guide users through symptoms, checks, likely causes, and next actions in plain language.",
            },
            {
                heading: "Business potential",
                body:
                    "The same support logic can grow into IT help desk tools, technician workflows, and business support products.",
            },
        ],
    },
    {
        id: 6,
        title: "Kiddo Early Learning Case Study",
        slug: "kiddo-early-learning-case-study",
        category: "Case Studies",
        product: "Kiddo",
        format: "Case Study",
        readTime: "9 min",
        description:
            "A sample use case showing how reading games, counting activities, rewards, and parent dashboards support early learning.",
        downloadLabel: "Download Case Study",
        featured: false,
        sections: [
            {
                heading: "The learning goal",
                body:
                    "A parent wants short daily learning sessions that build letter recognition, counting confidence, and a visible sense of progress.",
            },
            {
                heading: "The product flow",
                body:
                    "Kiddo combines ABC activities, reading games, counting practice, rewards, and a parent dashboard to keep learning simple.",
            },
            {
                heading: "The outcome",
                body:
                    "A child gets repeatable practice while the parent gets enough visibility to encourage progress without micromanaging every activity.",
            },
        ],
    },
    {
        id: 7,
        title: "Newsletter Growth Playbook for App Companies",
        slug: "newsletter-growth-playbook-for-app-companies",
        category: "White Papers",
        product: "Cin Nova",
        format: "Playbook",
        readTime: "15 min",
        description:
            "A strategy resource for turning articles, waitlists, lead magnets, and product updates into a durable audience channel.",
        downloadLabel: "Download Playbook",
        featured: false,
        sections: [
            {
                heading: "Why newsletters matter",
                body:
                    "A newsletter gives a software company a direct line to early users, potential customers, partners, and readers.",
            },
            {
                heading: "What to publish",
                body:
                    "Useful guides, product updates, case studies, and resource downloads can all move readers closer to the right product.",
            },
            {
                heading: "How to measure success",
                body:
                    "Track subscriber growth, resource downloads, article engagement, waitlist joins, and eventual product conversions.",
            },
        ],
    },
    {
        id: 8,
        title: "Family Safety Resource Kit",
        slug: "family-safety-resource-kit",
        category: "Free Guides",
        product: "PoisonGuard",
        format: "Resource Kit",
        readTime: "11 min",
        description:
            "A household safety checklist covering storage, labeling, pets, scan history, and emergency preparation.",
        downloadLabel: "Download Kit",
        featured: false,
        sections: [
            {
                heading: "Start with storage",
                body:
                    "Keep cleaners, medications, chemicals, and risky household items in consistent places away from children and pets.",
            },
            {
                heading: "Use scan history",
                body:
                    "A record of scanned items can help families revisit risk information quickly and understand patterns in the home.",
            },
            {
                heading: "Prepare contact information",
                body:
                    "Emergency contacts, vet information, and product details should be easy to find before a stressful event happens.",
            },
        ],
    },
    {
        id: 9,
        title: "AI Product Launch Checklist",
        slug: "ai-product-launch-checklist",
        category: "Checklists",
        product: "Cin Nova",
        format: "Checklist",
        readTime: "6 min",
        description:
            "A step-by-step pre-launch, launch day, and post-launch checklist for shipping an AI product to your first users.",
        downloadLabel: "Download Checklist",
        featured: false,
        sections: [
            {
                heading: "Pre-launch essentials",
                body:
                    "Before you announce anything: confirm core feature parity, set up email capture, prep your newsletter welcome sequence, finalize the pricing page, test on mobile, review error states, and run the product through a fresh walkthrough with someone who has never seen it.",
            },
            {
                heading: "Launch day execution",
                body:
                    "Post on every channel you have with a clear 'what it is' one-liner. Publish the product brochure and a blog intro post on the same day. Respond to every early comment and DM within the first 24 hours. Watch error logs and downtime alerts closely.",
            },
            {
                heading: "Post-launch follow-up",
                body:
                    "Send a launch recap to your newsletter list. Log every piece of feedback and sort it by frequency. Identify the top 3 friction points from early users. Book a 30-day review to decide what ships next based on what you heard.",
            },
        ],
    },
    {
        id: 10,
        title: "Household Chemical Safety Checklist",
        slug: "household-chemical-safety-checklist",
        category: "Checklists",
        product: "PoisonGuard",
        format: "Checklist",
        readTime: "8 min",
        description:
            "A room-by-room checklist for identifying hazardous household chemicals, reviewing safe storage, and preparing for emergencies.",
        downloadLabel: "Download Checklist",
        featured: false,
        sections: [
            {
                heading: "Kitchen and laundry check",
                body:
                    "Locate all cleaning products, dishwasher pods, drain cleaners, and laundry detergents. Confirm every container has its original label intact. Check that child-resistant caps are functioning. Move any open or partially used products to a locked or high cabinet.",
            },
            {
                heading: "Garage and storage areas",
                body:
                    "Identify pesticides, motor oil, antifreeze, paint, solvents, and fertilizers. Confirm all containers are tightly sealed. Remove any product with a missing or illegible label. Keep these items separate from pet food, bird seed, or anything edible.",
            },
            {
                heading: "Emergency preparation",
                body:
                    "Save the Poison Control hotline (1-800-222-1222) in your phone and post it visibly in your home. Know the location of your nearest emergency vet if you have pets. Review what information PoisonGuard needs — product name, active ingredient, and estimated exposure — so you can provide it quickly under stress.",
            },
        ],
    },
    {
        id: 11,
        title: "Weekly Student Study Planner Template",
        slug: "weekly-student-study-planner-template",
        category: "Templates",
        product: "StudyNest",
        format: "Template",
        readTime: "5 min",
        description:
            "A structured weekly template for organizing study sessions, review cycles, and exam preparation across all subjects.",
        downloadLabel: "Download Template",
        featured: false,
        sections: [
            {
                heading: "Weekly schedule layout",
                body:
                    "Map out Monday through Sunday with two session slots per day: a primary study block (45–90 min) and a review slot (15–20 min). Assign subjects to each primary block at the start of the week. Leave one 'flex' slot open for catching up or reviewing weak areas.",
            },
            {
                heading: "Subject priority grid",
                body:
                    "List every subject with three columns: upcoming deadlines, current confidence level (Low / Medium / High), and hours needed this week. Sort by deadline first, then by confidence level. Low confidence + near deadline = top priority. Update this grid every Sunday.",
            },
            {
                heading: "Review cycle tracker",
                body:
                    "For each topic studied, log the date studied and two future review dates: Day 3 and Day 7 after first study. On each review date, spend 10–15 minutes recalling the material without notes. If recall is strong, push the next review to Day 14. This spaced-repetition approach is the core of how StudyNest reinforces retention.",
            },
        ],
    },
    {
        id: 12,
        title: "Real Estate Cash Flow Analysis Template",
        slug: "real-estate-cash-flow-analysis-template",
        category: "Templates",
        product: "Cin Nova Real Estate",
        format: "Template",
        readTime: "7 min",
        description:
            "A ready-to-use worksheet for running income, expense, financing, and return calculations on any residential investment property.",
        downloadLabel: "Download Template",
        featured: false,
        sections: [
            {
                heading: "Income inputs",
                body:
                    "Enter: gross monthly rent, vacancy rate (%), and other income (parking, laundry, etc.). Calculate: effective gross income = (rent × 12) × (1 − vacancy rate) + other annual income. This is your top-line revenue before any expenses.",
            },
            {
                heading: "Expense inputs",
                body:
                    "Annual expenses to include: property taxes, insurance, repairs and maintenance (budget 1% of purchase price), property management (8–12% of rent), utilities paid by owner, HOA fees if applicable, and a CapEx reserve (5–10% of gross rent for future capital expenditures).",
            },
            {
                heading: "Return calculations",
                body:
                    "Net Operating Income (NOI) = Effective Gross Income − Total Expenses. Cap Rate = NOI ÷ Purchase Price × 100. Cash-on-Cash Return = Annual Cash Flow ÷ Total Cash Invested × 100. Monthly Cash Flow = (NOI − Annual Debt Service) ÷ 12. Use all four numbers together, not any one metric in isolation.",
            },
        ],
    },
];

export function generateResourceContent(resource) {
    const bar = "=".repeat(60);
    const lines = [
        resource.title.toUpperCase(),
        `${resource.format} · ${resource.category} · ${resource.product}`,
        `A resource from Cin Nova — ${siteUrl}`,
        bar,
        "",
        resource.description,
        "",
        bar,
        "",
    ];

    resource.sections.forEach((section) => {
        lines.push(section.heading.toUpperCase());
        lines.push("-".repeat(section.heading.length));
        lines.push(section.body);
        lines.push("");
    });

    lines.push(bar);
    lines.push("ABOUT CIN NOVA");
    lines.push("Cin Nova builds practical AI products for real everyday problems.");
    lines.push(`Website: ${siteUrl}`);
    lines.push(`This resource is provided by the ${resource.product} team.`);
    lines.push("All resources are free to download and share with attribution.");

    return lines.join("\n");
}

export function downloadResource(resource) {
    trackResourceDownload(resource);
    const content = generateResourceContent(resource);
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cin-nova-${resource.slug}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export function getResourceBySlug(slug) {
    return resources.find((resource) => resource.slug === slug);
}

export function getResourceUrl(resource) {
    return `${siteUrl}/?resource=${resource.slug}`;
}
