import { copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");

/** @type {Array<{ dest: string, source?: string, unsplashId?: string, label: string }>} */
const featureImages = [
    {
        dest: "/images/products/poisonguard-feature-scan.jpg",
        unsplashId: "1556656793-08538906a9f8",
        label: "Hand holding a smartphone running a scanning app interface",
    },
    {
        dest: "/images/products/poisonguard-feature-chemical-safety.jpg",
        unsplashId: "1556228720-195a672e8a03",
        label: "Household cleaning and chemical product bottles on a shelf",
    },
    {
        dest: "/images/products/poisonguard-feature-risk-dashboard.jpg",
        source: "/images/education/ai-tutor-personalized-learning-dashboard.jpg",
        label: "Existing project image — AI tutoring dashboard (risk-style app UI)",
    },
    {
        dest: "/images/products/poisonguard-feature-confidence-score.jpg",
        source: "/images/ai/ai-complete-guide-2026.jpg",
        label: "Existing project image — AI analytics visualization",
    },
    {
        dest: "/images/products/poisonguard-feature-emergency.jpg",
        unsplashId: "1576091160399-112ba8d25d1d",
        label: "Hospital emergency room medical team providing urgent care",
    },
    {
        dest: "/images/products/poisonguard-feature-history.jpg",
        source: "/images/blog/education/student-dashboard-notes-desk.jpg",
        label: "Existing project image — student dashboard with notes and history",
    },
    {
        dest: "/images/products/poisonguard-feature-languages.jpg",
        unsplashId: "1522071820081-009f0129c71c",
        label: "Diverse team collaborating — international communication",
    },
    {
        dest: "/images/products/poisonguard-feature-privacy.jpg",
        source: "/images/blog/datacenters/fiber-optic-network-cables.jpg",
        label: "Existing project image — secure data network infrastructure",
    },
];

function unsplashUrl(photoRef) {
    const id = photoRef.replace(/^photo-/, "");
    return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=82`;
}

async function downloadImage(destPath, unsplashId) {
    const response = await fetch(unsplashUrl(unsplashId), { redirect: "follow" });
    if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    await writeFile(destPath, buffer);
}

async function copyProjectImage(destPath, sourcePath) {
    const absoluteSource = path.join(publicDir, sourcePath.replace(/^\//, ""));
    await copyFile(absoluteSource, destPath);
}

let ok = 0;
let failed = 0;

for (const item of featureImages) {
    const dest = path.join(publicDir, item.dest.replace(/^\//, ""));
    await mkdir(path.dirname(dest), { recursive: true });

    try {
        if (item.source) {
            await copyProjectImage(dest, item.source);
            console.log(`✓ ${item.dest} (copied from ${item.source})`);
        } else if (item.unsplashId) {
            await downloadImage(dest, item.unsplashId);
            console.log(`✓ ${item.dest} (Unsplash ${item.unsplashId})`);
        } else {
            throw new Error("Missing source or unsplashId");
        }
        ok += 1;
    } catch (error) {
        failed += 1;
        console.error(`✗ ${item.dest}: ${error.message}`);
    }
}

console.log(`\nPoisonGuard feature images: ${ok} ready, ${failed} failed.`);

if (failed > 0) process.exitCode = 1;
