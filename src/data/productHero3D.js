/**
 * CinNova 360-degree product hero assets and copy.
 * GLB models ship later; poster images power the fallback until then.
 */
import { getRealEstateTransformationModels, realEstateHeroAssets } from "./realEstateHeroAssets.js";

const realEstateTransformation = getRealEstateTransformationModels();

export const productHero3DConfigs = {
    home: {
        key: "home",
        modelSrc: "/models/product-heroes/home-ai-customer-communication.glb",
        posterSrc: "/images/product-heroes/posters/home-ai-customer-communication.png",
        alt: "Artificial intelligence interface communicating with a customer in a modern workspace",
        eyebrow: "THE CIN NOVA ECOSYSTEM",
        title: "Practical AI that helps people learn, stay safe, and make better decisions.",
        description:
            "Connected software for education, family safety, technology support, early learning, and real estate, plus free guides and research.",
        ctaText: "Explore Products",
        ctaHref: "/?page=products",
        secondaryCtaText: "Browse Resources",
        secondaryCtaHref: "/?page=resources",
    },
    poisonguard: {
        key: "poisonguard",
        modelSrc: "/models/product-heroes/poisonguard-decaying-poison-oak.glb",
        posterSrc: "/images/product-heroes/posters/poisonguard-decaying-poison-oak.png",
        alt: "Poison oak leaves decaying safely as PoisonGuard analyzes household plant hazards",
        eyebrow: "POISONGUARD",
        title: "Know what you are dealing with before panic sets in.",
        description:
            "Scan unknown substances, understand risk levels, and get clear next-step guidance for families, pets, and schools.",
        ctaText: "Join Waitlist",
        ctaHref: "#waitlist",
        secondaryCtaText: "Safety Resources",
        secondaryCtaHref: "/?page=resources",
    },
    "real-estate": {
        key: "real-estate",
        heroVisual: "transformation",
        posterSrc: realEstateHeroAssets.poster,
        // Reserved for merged single-GLB scene; dual-model paths live in transformation.*
        modelSrc: realEstateTransformation.combinedModelSrc,
        transformation: realEstateTransformation,
        alt: "An aging farmhouse transforming into a modern renovated home with AI property analysis",
        eyebrow: "CIN NOVA REAL ESTATE",
        title: "AI-powered real estate intelligence for investors and builders.",
        description:
            "Analyze deals, model mortgages, forecast cash flow, search properties, and get AI guidance on every investment decision.",
        ctaText: "Join Waitlist",
        ctaHref: "#waitlist",
        secondaryCtaText: "View Features",
        secondaryCtaHref: "#features",
    },
    kiddo: {
        key: "kiddo",
        modelSrc: "/models/product-heroes/kiddo-kids-learning-play.glb",
        posterSrc: "/images/product-heroes/posters/kiddo-kids-learning-play.png",
        alt: "Children playing and learning with the Kiddo early learning app",
        eyebrow: "KIDDO",
        title: "Learning becomes an adventure.",
        description:
            "Colorful worlds for ABCs, reading, math, and curiosity, with a parent dashboard that keeps you confidently in control.",
        ctaText: "Join Waitlist",
        ctaHref: "#waitlist",
        secondaryCtaText: "Explore Worlds",
        secondaryCtaHref: "#worlds",
    },
    studynest: {
        key: "studynest",
        modelSrc: "/models/product-heroes/studynest-campus-library.glb",
        posterSrc: "/images/product-heroes/posters/studynest-campus-library.png",
        alt: "University campus library with modern AI study tools and collaborative learning",
        eyebrow: "STUDYNEST",
        title: "The study workspace that helps learning actually stick.",
        description:
            "Notes, flashcards, quizzes, study guides, and AI tutoring in one place so students spend less time organizing and more time remembering.",
        ctaText: "Join Waitlist",
        ctaHref: "#waitlist",
        secondaryCtaText: "Explore Features",
        secondaryCtaHref: "#features",
    },
    techmate: {
        key: "techmate",
        modelSrc: "/models/product-heroes/techmate-data-center.glb",
        posterSrc: "/images/product-heroes/posters/techmate-data-center.png",
        alt: "Data center servers and cloud infrastructure powering AI technology support",
        eyebrow: "TECHMATE AI",
        title: "AI-powered tech support for every device and problem.",
        description:
            "Instant troubleshooting for devices, software, networks, and error codes without hold music, wait times, or confusion.",
        ctaText: "Join Waitlist",
        ctaHref: "#waitlist",
        secondaryCtaText: "View Features",
        secondaryCtaHref: "#features",
    },
};

export function getProductHero3DConfig(key) {
    return productHero3DConfigs[key] || null;
}
