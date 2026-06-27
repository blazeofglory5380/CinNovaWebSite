/**
 * Kiddo production artwork registry.
 *
 * Concept sheets in /public/images/Kiddo/concept/ are design references only —
 * do not auto-crop them. Drop finished PNGs into the library folders below.
 */
const root = "/images/Kiddo";

function asset(relativePath, alt) {
    return {
        src: `${root}/${relativePath}`,
        alt,
    };
}

/** Approved character portraits — add PNGs to public/images/Kiddo/characters/ */
export const kiddoCharacterLibrary = {
    kiki: asset("characters/kiki.png", "Kiki — curious explorer and reading quest guide"),
    spark: asset("characters/spark.png", "Spark — energetic guide for discovery and play"),
    byte: asset("characters/byte.png", "Byte the Pixel Fox — coding and problem-solving friend"),
    professorHoot: asset("characters/professor-hoot.png", "Professor Hoot — wise owl phonics mentor"),
    pennyPanda: asset("characters/penny-panda.png", "Penny Panda — cheerful counting and math coach"),
    captainLeo: asset("characters/captain-leo.png", "Captain Leo — brave adventure leader"),
    splash: asset("characters/splash.png", "Splash — ocean guide for geography and nature"),
    nova: asset("characters/nova.png", "Nova — star captain for science and space missions"),
};

export const kiddoAssets = {
    hero: asset(
        "branding/kiddo-hero.png",
        "Kiddo learning adventure with Kiki, Spark, and friends exploring colorful learning worlds"
    ),
    worlds: {
        alphabetForest: asset(
            "worlds/alphabet-forest.png",
            "Alphabet Forest learning world with letter trees and woodland trails"
        ),
        numberMountain: asset(
            "worlds/math-mountain.png",
            "Number Mountain learning world with golden peaks and counting paths"
        ),
        readingCastle: asset(
            "worlds/pixel-kingdom.png",
            "Reading Castle learning world with story towers and fairy-tale gates"
        ),
        scienceLab: asset(
            "worlds/discovery-lab.png",
            "Science Lab learning world with colorful experiments and discovery stations"
        ),
        oceanDiscovery: asset(
            "worlds/ocean-cove.png",
            "Ocean Discovery learning world with coral reefs and marine friends"
        ),
        spaceExplorer: asset(
            "worlds/novas-dream-studio.png",
            "Space Explorer learning world with rockets, planets, and star missions"
        ),
    },
    /** Landing-page character cards (copy unchanged) → character library PNGs */
    characters: {
        luna: kiddoCharacterLibrary.kiki,
        oliver: kiddoCharacterLibrary.professorHoot,
        nova: kiddoCharacterLibrary.nova,
        coral: kiddoCharacterLibrary.splash,
        max: kiddoCharacterLibrary.pennyPanda,
    },
    gameplay: asset(
        "gameplay/app-preview.png",
        "Kiddo adventure gameplay app preview with quests, streaks, and treasure rewards"
    ),
    parentDashboard: asset(
        "ui/parent-dashboard.png",
        "Kiddo parent dashboard showing weekly progress, insights, and safe mode"
    ),
};
