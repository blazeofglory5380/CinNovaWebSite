import { useRef } from "react";
import PoisonGuardFeatureVisual from "./PoisonGuardFeatureVisual.jsx";

function PoisonGuardFeatureCard({ feature, onOpen }) {
    const buttonRef = useRef(null);

    return (
        <article className="pg-feature-card-v2 product-card product-card-photo">
            <button
                ref={buttonRef}
                type="button"
                className="pg-feature-card-hit"
                aria-label={`Learn more about ${feature.title}`}
                onClick={() => onOpen(feature, buttonRef)}
            >
                <div className="pg-feature-card-visual">
                    <PoisonGuardFeatureVisual type={feature.visualType} size="card" />
                </div>
                <div className="pg-feature-card-copy">
                    {feature.category && <p className="product-category">{feature.category}</p>}
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                    <span className="pg-feature-card-cta">View feature →</span>
                </div>
            </button>
        </article>
    );
}

export default PoisonGuardFeatureCard;
