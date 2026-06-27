export const poisonGuardWorkflowSteps = [
    "Scan",
    "AI Recognition",
    "Risk Analysis",
    "Guidance",
    "Emergency",
    "Save History",
];

export const poisonGuardFeatures = [
    {
        id: "plant-recognition",
        visualType: "plant-recognition",
        category: "Recognition",
        title: "Plant & animal hazard recognition",
        description: "Identify common plants, foods, and substances that pose risks to people and pets.",
        modalExplanation:
            "Point your camera at a plant, mushroom, berry, or snake. PoisonGuard matches visual patterns against hazard databases and flags species known to be toxic to people or pets.",
        betaLabel: "Available in Free Beta",
    },
    {
        id: "chemical-safety",
        visualType: "chemical-safety",
        category: "Roadmap",
        title: "Chemical safety support",
        description: "Expanding coverage for cleaners, pesticides, automotive fluids, and labeled household chemicals.",
        modalExplanation:
            "Scan product labels on cleaners, detergents, pesticides, and automotive fluids. PoisonGuard reads active ingredients and surfaces household chemical risks before exposure happens.",
        betaLabel: "Expanding in Beta",
    },
    {
        id: "risk-assessment",
        visualType: "risk-gauge",
        category: "Assessment",
        title: "Clear risk levels",
        description: "Low, moderate, and high risk ratings designed for fast decisions under stress.",
        modalExplanation:
            "Every scan returns a clear Low, Medium, or High risk rating with plain-language context so families can decide whether to monitor, call a professional, or act immediately.",
        betaLabel: "Available in Free Beta",
    },
    {
        id: "confidence-score",
        visualType: "confidence-score",
        category: "Transparency",
        title: "Confidence score",
        description: "See how certain the model is so you know when to verify with a professional.",
        modalExplanation:
            "A confidence percentage shows how strongly the model matched your scan. Lower scores encourage contacting poison control or a veterinarian for verification.",
        betaLabel: "Available in Free Beta",
    },
    {
        id: "emergency-guidance",
        visualType: "emergency-guidance",
        category: "Emergency",
        title: "Emergency guidance",
        description: "Step-by-step first-response instructions and direct links to poison control hotlines.",
        modalExplanation:
            "High-risk results surface Poison Control (1-800-222-1222), tap-to-call actions, and step-by-step first-response guidance designed for stressful moments.",
        betaLabel: "Available in Free Beta",
    },
    {
        id: "scan-history",
        visualType: "scan-history",
        category: "History",
        title: "Saved scan history",
        description: "Review past scans and share context with caregivers, vets, or medical professionals.",
        modalExplanation:
            "Scan history keeps a timeline of past checks with substance names, risk levels, and dates — useful for vet visits, school nurses, or follow-up care.",
        betaLabel: "Available in Free Beta",
    },
    {
        id: "multilingual",
        visualType: "multilingual",
        category: "Roadmap",
        title: "Multilingual support",
        description: "Guidance in multiple languages so more households can act quickly and confidently.",
        modalExplanation:
            "Safety guidance will be available in multiple languages so caregivers can read instructions in the language they understand best during an emergency.",
        betaLabel: "Coming in Family Plan",
    },
    {
        id: "privacy-first",
        visualType: "privacy-first",
        category: "Privacy",
        title: "Privacy-conscious image handling",
        description: "Images processed with safety-first defaults — designed to minimize unnecessary retention.",
        modalExplanation:
            "Scans are processed with encrypted upload paths and minimal retention defaults. PoisonGuard is built to help in the moment — not to build advertising profiles.",
        betaLabel: "Available in Free Beta",
    },
];
