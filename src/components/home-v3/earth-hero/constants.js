/** Shared tuning knobs for the Earth hero prototype. */
export const EARTH_MODEL_SRC = "/models/homepage/cinnova-earth.web.glb";
export const MOBILE_MAX_WIDTH = 768;

/** One full revolution every ~105 seconds (within the 90–120s brief). */
export const EARTH_ROTATION_PERIOD_SEC = 105;

/** Scene layer names — attach future product worlds, AI core, etc. here. */
export const SCENE_LAYERS = {
    SPACE: "space",
    EARTH: "earth",
    SATELLITES: "satellites",
    CORE: "core",
    FX: "fx",
};

export const STARFIELD_LAYERS = [
    { id: "far", count: 2200, radiusMin: 42, radiusMax: 72, size: 0.018, opacity: 0.55, drift: 0.004 },
    { id: "mid", count: 900, radiusMin: 28, radiusMax: 48, size: 0.028, opacity: 0.72, drift: 0.009 },
    { id: "near", count: 320, radiusMin: 18, radiusMax: 32, size: 0.04, opacity: 0.9, drift: 0.015 },
];

export const BLOOM_SETTINGS = {
    strength: 0.22,
    radius: 0.5,
    threshold: 0.9,
};
