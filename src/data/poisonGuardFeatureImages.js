/**
 * PoisonGuard feature card photography.
 * Dedicated assets under /images/products/poisonguard-feature-*.jpg
 */
export const poisonGuardFeatureVisuals = {
    "plant-recognition": {
        kind: "photo",
        imageSrc: "/images/products/poisonguard-feature-scan.jpg",
        alt: "Person using a smartphone camera to scan a household plant for hazard identification",
        objectPosition: "50% 45%",
    },
    "chemical-safety": {
        kind: "photo",
        imageSrc: "/images/products/poisonguard-feature-chemical-safety.jpg",
        alt: "Labeled household cleaners, detergents, and chemical bottles stored on a shelf",
        objectPosition: "50% 50%",
    },
    "risk-gauge": {
        kind: "photo",
        imageSrc: "/images/products/poisonguard-feature-risk-dashboard.jpg",
        alt: "Risk assessment dashboard on a laptop showing hazard levels and safety metrics",
        objectPosition: "50% 40%",
    },
    "confidence-score": {
        kind: "photo",
        imageSrc: "/images/products/poisonguard-feature-confidence-score.jpg",
        alt: "AI analytics visualization representing confidence scoring and match accuracy",
        objectPosition: "50% 50%",
    },
    "emergency-guidance": {
        kind: "photo",
        imageSrc: "/images/products/poisonguard-feature-emergency.jpg",
        alt: "Hospital emergency room team providing urgent medical support",
        objectPosition: "50% 35%",
    },
    "scan-history": {
        kind: "photo",
        imageSrc: "/images/products/poisonguard-feature-history.jpg",
        alt: "Student dashboard on a laptop showing organized notes and scan history records",
        objectPosition: "50% 45%",
    },
    multilingual: {
        kind: "photo",
        imageSrc: "/images/products/poisonguard-feature-languages.jpg",
        alt: "Diverse group collaborating together representing multilingual guidance and communication",
        objectPosition: "50% 40%",
    },
    "privacy-first": {
        kind: "photo",
        imageSrc: "/images/products/poisonguard-feature-privacy.jpg",
        alt: "Fiber-optic network cables representing secure, encrypted data handling and privacy",
        objectPosition: "50% 50%",
    },
};

/** @deprecated All feature cards now use photography */
export const poisonGuardUiMockupFeatures = [];

/** Features rendered with real photography */
export const poisonGuardPhotoFeatures = Object.entries(poisonGuardFeatureVisuals)
    .filter(([, visual]) => visual.kind === "photo")
    .map(([visualType, visual]) => ({ visualType, imageSrc: visual.imageSrc }));

export function getPoisonGuardFeatureVisual(visualType) {
    return poisonGuardFeatureVisuals[visualType] ?? null;
}

/** @deprecated use getPoisonGuardFeatureVisual */
export function getPoisonGuardFeatureImage(visualType) {
    const visual = getPoisonGuardFeatureVisual(visualType);
    if (!visual || visual.kind !== "photo") return null;
    return { ...visual, src: visual.imageSrc };
}

export const poisonGuardFeatureImages = poisonGuardFeatureVisuals;
