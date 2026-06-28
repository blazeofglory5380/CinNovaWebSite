import { useState } from "react";
import MarketingPhoto from "../MarketingPhoto.jsx";
import PoisonGuardFeatureUIMockup from "./PoisonGuardFeatureUIMockup.jsx";
import PoisonGuardFeatureVisualFallback from "./PoisonGuardFeatureVisualFallback.jsx";
import { getPoisonGuardFeatureVisual } from "../../data/poisonGuardFeatureImages.js";

function PoisonGuardFeatureVisual({ type, size = "card" }) {
    const visual = getPoisonGuardFeatureVisual(type);
    const [imageError, setImageError] = useState(false);
    const isCard = size === "card";

    if (!visual) {
        return <PoisonGuardFeatureVisualFallback type={type} size={size} />;
    }

    if (visual.kind === "ui") {
        return (
            <PoisonGuardFeatureUIMockup
                uiType={visual.uiType}
                size={size}
                alt={visual.alt}
            />
        );
    }

    if (!visual.imageSrc || imageError) {
        return <PoisonGuardFeatureVisualFallback type={type} size={size} />;
    }

    return (
        <MarketingPhoto
            src={visual.imageSrc}
            alt={visual.alt}
            className={isCard ? "pg-feature-card-img" : "pg-feature-modal-img"}
            objectPosition={visual.objectPosition}
            loading={isCard ? "lazy" : "eager"}
            fetchPriority={isCard ? undefined : "high"}
            onError={() => setImageError(true)}
        />
    );
}

export default PoisonGuardFeatureVisual;
