import { trackProductCtaClick } from "../utils/analytics.js";
import PoisonGuardSafetyDisclaimer from "./PoisonGuardSafetyDisclaimer.jsx";
import ProductPhotoThumb from "./ProductPhotoThumb.jsx";
import { productMarketing } from "../data/marketingImages.js";

const productCTAContent = {
    studynest: {
        icon: "SN",
        imageKey: "studynest",
        name: "StudyNest",
        category: "Education AI",
        headline: "Stop studying harder. Start studying smarter.",
        features: [
            "Convert notes into flashcards automatically",
            "Build AI-powered study plans and weekly schedules",
            "Get instant AI tutoring on any topic, any time",
        ],
        cta: "Try StudyNest Free",
        page: "studynest",
        accent: "#38bdf8",
        accentBg: "rgba(56, 189, 248, 0.08)",
        status: "In Development",
    },
    poisonguard: {
        icon: "PG",
        imageKey: "poisonguard",
        name: "PoisonGuard",
        category: "Safety Technology",
        headline: "Know what's in your home before it becomes an emergency.",
        features: [
            "Scan any household chemical for instant hazard information",
            "Pet-safe warnings for common products and plants",
            "Emergency guidance and direct poison control support",
        ],
        cta: "Explore PoisonGuard",
        page: "poisonguard",
        accent: "#10b981",
        accentBg: "rgba(16, 185, 129, 0.08)",
        status: "In Development",
    },
    techmate: {
        icon: "TM",
        imageKey: "techmate",
        name: "TechMate AI",
        category: "Tech Support AI",
        headline: "Fix your tech problems without the tech degree.",
        features: [
            "Describe the issue and get step-by-step guided fixes",
            "Device diagnostics for phones, computers, and WiFi",
            "Error code lookup and plain-language repair guides",
        ],
        cta: "Explore TechMate AI",
        page: "techmate",
        accent: "#7c3aed",
        accentBg: "rgba(124, 58, 237, 0.08)",
        status: "Concept Stage",
    },
    kiddo: {
        icon: "KD",
        imageKey: "kiddo",
        name: "Kiddo",
        category: "Early Learning",
        headline: "Make every day a learning day — without the struggle.",
        features: [
            "ABC, reading, and counting games built for young learners",
            "A rewards system that builds consistent daily habits",
            "Parent dashboard to track progress without micromanaging",
        ],
        cta: "Explore Kiddo",
        page: "kiddo",
        accent: "#f59e0b",
        accentBg: "rgba(245, 158, 11, 0.08)",
        status: "Concept Stage",
    },
    "real-estate": {
        icon: "RE",
        imageKey: "real-estate",
        name: "Cin Nova Real Estate",
        category: "Real Estate AI",
        headline: "Analyze any deal before you waste time on the wrong property.",
        features: [
            "Cap rate, cash flow, and mortgage analysis in under a minute",
            "Side-by-side deal comparison with local market intelligence",
            "Built for buy-and-hold investors, flippers, and agents",
        ],
        cta: "Explore Real Estate AI",
        page: "real-estate",
        accent: "#2563eb",
        accentBg: "rgba(37, 99, 235, 0.08)",
        status: "Active Build",
    },
};

const categoryToProduct = {
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

function BlogProductCTA({ category, onNavigate }) {
    const productKey = categoryToProduct[category];
    const product = productCTAContent[productKey];
    if (!product) return null;

    return (
        <div
            className="blog-product-cta"
            style={{ "--bpc-accent": product.accent, "--bpc-bg": product.accentBg }}
        >
            <div className="bpc-left">
                <ProductPhotoThumb
                    src={productMarketing[product.imageKey]?.card?.src}
                    alt={productMarketing[product.imageKey]?.card?.alt || product.name}
                    badge={product.icon}
                    className="bpc-photo-thumb"
                />
                <div className="bpc-copy">
                    <p className="bpc-category">{product.category}</p>
                    <strong className="bpc-name">{product.name}</strong>
                    <p className="bpc-headline">{product.headline}</p>
                    <ul className="bpc-features">
                        {product.features.map((f) => (
                            <li key={f}>{f}</li>
                        ))}
                    </ul>
                    <p className="bpc-status">Status: {product.status}</p>
                </div>
            </div>
            <button
                className="bpc-cta"
                onClick={() => {
                    trackProductCtaClick({
                        product: product.name,
                        category,
                        location: "blog_product_cta",
                    });
                    onNavigate?.(product.page);
                }}
            >
                {product.cta} →
            </button>
            {productKey === "poisonguard" && (
                <PoisonGuardSafetyDisclaimer variant="compact" />
            )}
        </div>
    );
}

export default BlogProductCTA;
