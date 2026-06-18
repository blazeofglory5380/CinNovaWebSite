const categoryProductMap = {
    "Artificial Intelligence": ["techmate", "studynest"],
    "Real Estate Technology": ["real-estate"],
    "Education Technology": ["studynest", "kiddo"],
    "Healthcare Technology": ["poisonguard"],
    "Construction Technology": ["techmate", "real-estate"],
    "Data Centers & Databases": ["techmate"],
    "Robotics & Automation": ["techmate"],
    "Future Technology": ["techmate", "studynest"],
    "Business & Entrepreneurship": ["studynest", "techmate"],
    "CinNova Updates": ["studynest", "poisonguard"],
};

const productDetails = {
    studynest: {
        icon: "SN",
        name: "StudyNest",
        category: "Education AI",
        tagline: "Notes, flashcards, AI tutoring, and a weekly study planner in one focused workspace.",
        status: "In Development",
        accent: "#38bdf8",
        page: "studynest",
        cta: "Try StudyNest",
    },
    poisonguard: {
        icon: "PG",
        name: "PoisonGuard",
        category: "Safety Technology",
        tagline: "Scan household chemicals for instant hazard info, pet safety warnings, and emergency guidance.",
        status: "In Development",
        accent: "#10b981",
        page: "poisonguard",
        cta: "Try PoisonGuard",
    },
    techmate: {
        icon: "TM",
        name: "TechMate AI",
        category: "Tech Support AI",
        tagline: "Describe the problem and get step-by-step fixes for phones, computers, apps, and WiFi.",
        status: "Concept Stage",
        accent: "#7c3aed",
        page: "techmate",
        cta: "Explore TechMate AI",
    },
    kiddo: {
        icon: "KD",
        name: "Kiddo",
        category: "Early Learning",
        tagline: "ABCs, reading games, counting activities, and a parent progress dashboard for young learners.",
        status: "Concept Stage",
        accent: "#f59e0b",
        page: "kiddo",
        cta: "Explore Kiddo",
    },
    "real-estate": {
        icon: "RE",
        name: "Cin Nova Real Estate",
        category: "Real Estate AI",
        tagline: "Cap rate, cash flow, mortgage analysis, and market intelligence for real estate investors.",
        status: "Active Build",
        accent: "#2563eb",
        page: "real-estate",
        cta: "Explore Real Estate AI",
    },
};

function RecommendedProducts({ category, onNavigate }) {
    const productKeys = categoryProductMap[category] || [];
    if (productKeys.length === 0) return null;

    const recs = productKeys.slice(0, 2).map((k) => productDetails[k]).filter(Boolean);
    if (recs.length === 0) return null;

    return (
        <section className="section recommended-products-section">
            <div className="section-heading">
                <p className="eyebrow">RECOMMENDED FOR YOU</p>
                <h2>Cin Nova products for {category.toLowerCase()} readers.</h2>
                <p>
                    These tools are built to solve the exact problems this article covers.
                </p>
            </div>
            <div className="recommended-products-grid">
                {recs.map((product) => (
                    <article
                        key={product.name}
                        className="rec-product-card"
                        style={{ "--rp-accent": product.accent }}
                    >
                        <div className="rec-product-icon">{product.icon}</div>
                        <div className="rec-product-body">
                            <p className="rec-product-category">{product.category}</p>
                            <h3>{product.name}</h3>
                            <p>{product.tagline}</p>
                            <span className="rec-product-status">Status: {product.status}</span>
                        </div>
                        <button
                            className="rec-product-cta"
                            onClick={() => onNavigate?.(product.page)}
                        >
                            {product.cta} →
                        </button>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default RecommendedProducts;
