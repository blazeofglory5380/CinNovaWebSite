import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const posterDir = path.join(root, "public", "images", "product-heroes", "posters");
const modelDir = path.join(root, "public", "models", "product-heroes");

const posterSources = {
    "home-ai-customer-communication.png": "public/images/home/homepage-hero-innovation.jpg",
    "poisonguard-decaying-poison-oak.png": "public/images/products/poisonguard-pet-family-safety.jpg",
    "kiddo-kids-learning-play.png": "public/images/products/kiddo-child-learning.jpg",
    "studynest-campus-library.png": "public/images/products/studynest-student-learning.jpg",
    "techmate-data-center.png": "public/images/products/techmate-ai-device-support.jpg",
};

/** Custom 3D-captured poster — never regenerate from a static JPG fallback. */
const preservePosters = new Set(["realestateai-farmhouse-transformation.png"]);

await fs.mkdir(posterDir, { recursive: true });
await fs.mkdir(modelDir, { recursive: true });

for (const posterName of preservePosters) {
    const targetPath = path.join(posterDir, posterName);
    try {
        await fs.access(targetPath);
        console.log(`⊘ ${path.relative(root, targetPath)} (kept — custom poster)`);
    } catch {
        console.warn(`⚠ Missing custom poster: ${posterName}`);
    }
}

for (const [posterName, sourceRelative] of Object.entries(posterSources)) {
    const targetPath = path.join(posterDir, posterName);

    if (preservePosters.has(posterName)) {
        continue;
    }

    const sourcePath = path.join(root, sourceRelative);

    await sharp(sourcePath)
        .resize(1600, 1200, { fit: "cover", position: "centre" })
        .png({ quality: 88, compressionLevel: 9 })
        .toFile(targetPath);

    console.log(`✓ ${path.relative(root, targetPath)}`);
}

console.log("Product hero poster assets ready.");
