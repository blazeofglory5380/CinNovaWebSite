const FALLBACK_LABELS = {
    "plant-recognition": "Plant & animal scan preview",
    "chemical-safety": "Chemical label scan preview",
    "risk-gauge": "Risk level preview",
    "confidence-score": "Confidence score preview",
    "emergency-guidance": "Emergency guidance preview",
    "scan-history": "Scan history preview",
    multilingual: "Multilingual support preview",
    "privacy-first": "Privacy & security preview",
};

function PoisonGuardFeatureVisualFallback({ type, size = "card" }) {
    const isCard = size === "card";
    const label = FALLBACK_LABELS[type] || "Feature preview";

    return (
        <div
            className={isCard ? "pg-feature-card-fallback" : "pg-feature-modal-fallback"}
            role="img"
            aria-label={label}
        >
            <span className="pg-feature-fallback-label">{label}</span>
        </div>
    );
}

export default PoisonGuardFeatureVisualFallback;
