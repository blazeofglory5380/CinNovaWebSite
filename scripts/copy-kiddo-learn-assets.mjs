/**
 * Copy approved KiddoLearn production assets into CinNova public/images/Kiddo/.
 * Source: G:\KiddoLearn\kiddo-learn\
 *
 * Usage: node scripts/copy-kiddo-learn-assets.mjs
 */
import sharp from "sharp";
import { copyFileSync, mkdirSync, existsSync, unlinkSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const destRoot = join(root, "public", "images", "Kiddo");
const sourceRoot = "G:/KiddoLearn/kiddo-learn";

const worldsSource = join(sourceRoot, "src/assets/images/kiddo-premium-worlds/worlds");
const worldFiles = [
    "alphabet-forest.png",
    "math-mountain.png",
    "discovery-lab.png",
    "ocean-cove.png",
    "novas-dream-studio.png",
    "pixel-kingdom.png",
];

const legacyWorldFiles = [
    "number-mountain.png",
    "reading-castle.png",
    "science-lab.png",
    "ocean-discovery.png",
    "space-explorer.png",
];

const copies = [
    {
        src: join(sourceRoot, "src/assets/images/ChatGPT Image May 31, 2026, 11_29_19 PM.png"),
        dest: join(destRoot, "branding/kiddo-hero.png"),
    },
    {
        src: join(sourceRoot, "public/images/Kiddo/homepage-design.png"),
        dest: join(destRoot, "gameplay/app-preview.png"),
    },
];

function ensureDir(path) {
    mkdirSync(path, { recursive: true });
}

const copied = [];

ensureDir(join(destRoot, "worlds"));
ensureDir(join(destRoot, "branding"));
ensureDir(join(destRoot, "gameplay"));
ensureDir(join(destRoot, "ui"));

for (const file of worldFiles) {
    const src = join(worldsSource, file);
    const dest = join(destRoot, "worlds", file);
    copyFileSync(src, dest);
    copied.push({ from: src, to: dest });
}

for (const file of legacyWorldFiles) {
    const legacy = join(destRoot, "worlds", file);
    if (existsSync(legacy)) {
        unlinkSync(legacy);
        copied.push({ removed: legacy });
    }
}

for (const { src, dest } of copies) {
    copyFileSync(src, dest);
    copied.push({ from: src, to: dest });
}

// Parent dashboard panel from approved concept sheet (no standalone export in KiddoLearn repo).
const conceptPath = join(sourceRoot, "src/assets/images/ChatGPT Image May 31, 2026, 11_29_19 PM.png");
const dashboardDest = join(destRoot, "ui/parent-dashboard.png");
const { width, height } = await sharp(conceptPath).metadata();
const crop = {
    left: Math.round(width * 0.595),
    top: Math.round(height * 0.755),
    width: Math.round(width * 0.185),
    height: Math.round(height * 0.21),
};
await sharp(conceptPath).extract(crop).png({ compressionLevel: 9 }).toFile(dashboardDest);
copied.push({ from: conceptPath, to: dashboardDest, crop });

for (const item of copied) {
    if (item.removed) {
        console.log("removed", item.removed);
    } else if (item.crop) {
        console.log("cropped", item.to, JSON.stringify(item.crop));
    } else {
        console.log("copied", item.to);
    }
}
