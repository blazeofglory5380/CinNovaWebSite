const productData = {
    studynest: {
        icon: "SN",
        name: "StudyNest",
        category: "Education AI",
        tagline: "Notes, flashcards, AI tutoring, and a weekly study planner — all in one app.",
        status: "In Development",
        accent: "#38bdf8",
        page: "studynest",
        cta: "Explore StudyNest",
    },
    poisonguard: {
        icon: "PG",
        name: "PoisonGuard",
        category: "Safety Technology",
        tagline: "Scan household chemicals, get instant hazard info, keep your family and pets safe.",
        status: "In Development",
        accent: "#10b981",
        page: "poisonguard",
        cta: "Explore PoisonGuard",
    },
    techmate: {
        icon: "TM",
        name: "TechMate AI",
        category: "Tech Support AI",
        tagline: "AI troubleshooting for phones, computers, WiFi, apps, and everyday devices.",
        status: "Concept Stage",
        accent: "#7c3aed",
        page: "techmate",
        cta: "Explore TechMate AI",
    },
    kiddo: {
        icon: "KD",
        name: "Kiddo",
        category: "Early Learning",
        tagline: "Playful ABC, reading, and counting activities with a parent dashboard for little ones.",
        status: "Concept Stage",
        accent: "#f59e0b",
        page: "kiddo",
        cta: "Explore Kiddo",
    },
    "real-estate": {
        icon: "RE",
        name: "Cin Nova Real Estate",
        category: "Real Estate AI",
        tagline: "Cap rate, cash flow, mortgage estimates, and market intelligence for investors.",
        status: "Active Build",
        accent: "#2563eb",
        page: "real-estate",
        cta: "Explore Real Estate AI",
    },
};

function ProductWidget({ productKey, onNavigate }) {
    const product = productData[productKey];
    if (!product) return null;

    return (
        <div
            className="product-widget"
            style={{ "--pw-accent": product.accent }}
        >
            <div className="product-widget-icon">{product.icon}</div>
            <div className="product-widget-copy">
                <p className="product-widget-category">{product.category}</p>
                <strong className="product-widget-name">{product.name}</strong>
                <p className="product-widget-tagline">{product.tagline}</p>
                <span className="product-widget-status">Status: {product.status}</span>
            </div>
            <button
                className="product-widget-cta"
                onClick={() => onNavigate?.(product.page)}
            >
                {product.cta} →
            </button>
        </div>
    );
}

export default ProductWidget;
