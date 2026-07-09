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

/** Approved character portraits — one PNG per character folder under public/images/Kiddo/characters/ */
export const kiddoCharacterLibrary = {
    luna: asset("characters/Luna/kiddo_character_luna_v01.png", "Luna — curious explorer and reading quest guide"),
    oliver: asset("characters/Oliver/kiddo-character-oliver-v01.png", "Oliver — wise owl phonics mentor"),
    nova: asset("characters/Nova/kiddo-character-nova-v01.png", "Nova — star captain for science and space missions"),
    coral: asset("characters/Coral/kiddo-character-coral-v01.png", "Coral — ocean guide for geography and nature"),
    max: asset("characters/Max/kiddo-character-max-v01.png", "Max — cheerful counting and math coach"),
    leo: asset("characters/Leo/kiddo-character-leo-v01.png", "Leo — brave adventurer and writing quest leader"),
    kai: asset("characters/Kai/kiddo-character-kai-v01.png", "Kai — clever guide for puzzles and problem solving"),
};

export const kiddoAssets = {
    hero: asset(
        "branding/kiddo-hero.png",
        "Kiddo learning adventure with Kiki, Spark, and friends exploring colorful learning worlds"
    ),
    worlds: {
        alphabetForest: asset(
            "worlds/AlphabetForest/kiddo-world-alphabet-forest-v01.png",
            "Alphabet Forest learning world with letter trees and woodland trails"
        ),
        numberMountain: asset(
            "worlds/NumberMountain/kiddo-world-number-mountain-v01.png",
            "Number Mountain learning world with golden peaks and counting paths"
        ),
        readingCastle: asset(
            "worlds/ReadingCastle/kiddo-world-reading-castle-v01.png",
            "Reading Castle learning world with story towers and fairy-tale gates"
        ),
        scienceLab: asset(
            "worlds/ScienceLab/kiddo-world-science-lab-v01.png",
            "Science Lab learning world with colorful experiments and discovery stations"
        ),
        oceanDiscovery: asset(
            "worlds/OceanDiscovery/kiddo-world-ocean-discovery-v01.png",
            "Ocean Discovery learning world with coral reefs and marine friends"
        ),
        spaceExplorer: asset(
            "worlds/SpaceExplorer/kiddo-world-space-explorer-v01.png",
            "Space Explorer learning world with rockets, planets, and star missions"
        ),
    },
    /** Landing-page character cards → character library PNGs */
    characters: {
        luna: kiddoCharacterLibrary.luna,
        oliver: kiddoCharacterLibrary.oliver,
        nova: kiddoCharacterLibrary.nova,
        coral: kiddoCharacterLibrary.coral,
        max: kiddoCharacterLibrary.max,
        leo: kiddoCharacterLibrary.leo,
        kai: kiddoCharacterLibrary.kai,
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
