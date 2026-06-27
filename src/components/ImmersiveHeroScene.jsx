const INTENSITY_CLASS = {
    calm: "immersive-scene--calm",
    medium: "immersive-scene--medium",
    high: "immersive-scene--high",
};

function SceneLayer({ className = "", children }) {
    return <div className={`immersive-scene__layer ${className}`.trim()}>{children}</div>;
}

function FloatingItems({ items, classPrefix }) {
    return items.map((item) => (
        <span
            key={item.id}
            className={`${classPrefix} ${classPrefix}--${item.id}`}
            style={item.style}
            aria-hidden="true"
        />
    ));
}

function PoisonGuardScene() {
    const leaves = [
        { id: "a", style: { top: "12%", left: "8%" } },
        { id: "b", style: { top: "22%", left: "72%" } },
        { id: "c", style: { top: "48%", left: "18%" } },
        { id: "d", style: { top: "34%", left: "88%" } },
        { id: "e", style: { top: "62%", left: "55%" } },
    ];
    const particles = [
        { id: "p1", style: { top: "18%", left: "42%" } },
        { id: "p2", style: { top: "30%", left: "60%" } },
        { id: "p3", style: { top: "52%", left: "30%" } },
        { id: "p4", style: { top: "40%", left: "78%" } },
    ];

    return (
        <>
            <SceneLayer className="immersive-scene__sky immersive-scene__sky--forest" />
            <SceneLayer className="immersive-scene__sun immersive-scene__sun--soft" />
            <SceneLayer className="immersive-scene__hills immersive-scene__hills--forest" />
            <FloatingItems items={leaves} classPrefix="immersive-leaf" />
            <FloatingItems items={particles} classPrefix="immersive-particle immersive-particle--warm" />
            <SceneLayer className="immersive-scene__silhouette immersive-scene__silhouette--plants" />
            <SceneLayer className="immersive-scene__silhouette immersive-scene__silhouette--family" />
        </>
    );
}

function KiddoScene() {
    const stars = [
        { id: "s1", style: { top: "10%", left: "12%" } },
        { id: "s2", style: { top: "16%", left: "78%" } },
        { id: "s3", style: { top: "28%", left: "45%" } },
        { id: "s4", style: { top: "8%", left: "58%" } },
        { id: "s5", style: { top: "20%", left: "90%" } },
    ];
    const clouds = [
        { id: "c1", style: { top: "14%", left: "5%" } },
        { id: "c2", style: { top: "24%", left: "68%" } },
    ];

    return (
        <>
            <SceneLayer className="immersive-scene__gradient immersive-scene__gradient--kiddo" />
            <SceneLayer className="immersive-scene__world-layer immersive-scene__world-layer--1" />
            <SceneLayer className="immersive-scene__world-layer immersive-scene__world-layer--2" />
            <FloatingItems items={clouds} classPrefix="immersive-cloud" />
            <FloatingItems items={stars} classPrefix="immersive-star" />
            <SceneLayer className="immersive-scene__orbit immersive-scene__orbit--kiddo" />
        </>
    );
}

function StudyNestScene() {
    const notes = [
        { id: "n1", style: { top: "20%", left: "70%" } },
        { id: "n2", style: { top: "38%", left: "82%" } },
        { id: "n3", style: { top: "55%", left: "65%" } },
    ];

    return (
        <>
            <SceneLayer className="immersive-scene__desk immersive-scene__desk--studynest" />
            <SceneLayer className="immersive-scene__lamp-glow" />
            <SceneLayer className="immersive-scene__book immersive-scene__book--open" />
            <FloatingItems items={notes} classPrefix="immersive-note-card" />
            <SceneLayer className="immersive-scene__icon immersive-scene__icon--pencil" />
            <SceneLayer className="immersive-scene__icon immersive-scene__icon--bulb" />
        </>
    );
}

function RealEstateScene() {
    const houses = [
        { id: "h1", style: { top: "22%", left: "68%" } },
        { id: "h2", style: { top: "42%", left: "78%" } },
        { id: "h3", style: { top: "32%", left: "58%" } },
    ];
    const heatBlocks = [
        { id: "b1", style: { top: "58%", left: "62%" } },
        { id: "b2", style: { top: "58%", left: "70%" } },
        { id: "b3", style: { top: "58%", left: "78%" } },
        { id: "b4", style: { top: "66%", left: "66%" } },
        { id: "b5", style: { top: "66%", left: "74%" } },
    ];

    return (
        <>
            <SceneLayer className="immersive-scene__grid immersive-scene__grid--city" />
            <FloatingItems items={houses} classPrefix="immersive-house-card" />
            <FloatingItems items={heatBlocks} classPrefix="immersive-heat-block" />
            <SceneLayer className="immersive-scene__chart immersive-scene__chart--line" />
        </>
    );
}

function TechMateScene() {
    const windows = [
        { id: "w1", style: { top: "18%", left: "62%" } },
        { id: "w2", style: { top: "34%", left: "76%" } },
        { id: "w3", style: { top: "50%", left: "68%" } },
    ];

    return (
        <>
            <SceneLayer className="immersive-scene__workspace immersive-scene__workspace--tech" />
            <SceneLayer className="immersive-scene__circuits" />
            <FloatingItems items={windows} classPrefix="immersive-app-window" />
            <SceneLayer className="immersive-scene__orb immersive-scene__orb--ai" />
        </>
    );
}

function HomeScene() {
    const cards = [
        { id: "studynest", style: { top: "18%", left: "58%" } },
        { id: "poisonguard", style: { top: "32%", left: "72%" } },
        { id: "kiddo", style: { top: "48%", left: "64%" } },
        { id: "techmate", style: { top: "28%", left: "84%" } },
        { id: "realestate", style: { top: "44%", left: "80%" } },
    ];

    return (
        <>
            <SceneLayer className="immersive-scene__gradient immersive-scene__gradient--home" />
            <SceneLayer className="immersive-scene__network immersive-scene__network--home" />
            <FloatingItems items={cards} classPrefix="immersive-product-card" />
            <SceneLayer className="immersive-scene__connector immersive-scene__connector--home" />
        </>
    );
}

const SCENE_RENDERERS = {
    home: HomeScene,
    studynest: StudyNestScene,
    poisonguard: PoisonGuardScene,
    kiddo: KiddoScene,
    "real-estate": RealEstateScene,
    techmate: TechMateScene,
};

function ImmersiveHeroScene({ variant = "home", intensity = "calm" }) {
    const Scene = SCENE_RENDERERS[variant] || HomeScene;
    const intensityClass = INTENSITY_CLASS[intensity] || INTENSITY_CLASS.calm;

    return (
        <div
            className={`immersive-scene immersive-scene--${variant} ${intensityClass}`}
            aria-hidden="true"
        >
            <div className="immersive-scene__static-fallback" />
            <Scene />
        </div>
    );
}

export default ImmersiveHeroScene;
