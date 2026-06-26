import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { imageCredits } from "../src/data/imageCredits.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");

/** Additional marketing-only photos (Unsplash, free for commercial use). */
const extraImages = [
    { localPath: "/images/marketing/studynest-smart-notes.jpg", unsplashId: "1434030216411-84b79355571f" },
    { localPath: "/images/marketing/poisonguard-household-chemicals.jpg", unsplashId: "1584622781707-3dd0374a7898" },
    { localPath: "/images/marketing/poisonguard-veterinarian-care.jpg", unsplashId: "1629909613654-27634fc0c7df" },
    { localPath: "/images/marketing/poisonguard-family-emergency.jpg", unsplashId: "1511895421378-f6efd10338c5" },
    { localPath: "/images/marketing/poisonguard-toxic-plants.jpg", unsplashId: "1416879595882-3373a0480b0b" },
    { localPath: "/images/marketing/kiddo-alphabet-learning.jpg", unsplashId: "1503676262908-957e2528782a" },
    { localPath: "/images/marketing/kiddo-reading-practice.jpg", unsplashId: "1606490288574-684b248f7fcb" },
    { localPath: "/images/marketing/kiddo-writing-practice.jpg", unsplashId: "1587652475857-d4d707ba22bd" },
    { localPath: "/images/marketing/kiddo-counting-games.jpg", unsplashId: "1516628951474-5d909850f9d4" },
    { localPath: "/images/marketing/kiddo-math-skills.jpg", unsplashId: "1596464719942-86628f185bd3" },
    { localPath: "/images/marketing/kiddo-shapes-colors.jpg", unsplashId: "1544776143-d35331206729" },
    { localPath: "/images/marketing/kiddo-memory-games.jpg", unsplashId: "1522202176988-66273c2fd55f" },
    { localPath: "/images/marketing/kiddo-interactive-stories.jpg", unsplashId: "1516628951474-5d909850f9d4" },
    { localPath: "/images/marketing/kiddo-parent-dashboard.jpg", unsplashId: "1580894732934-d996ca125da6" },
    { localPath: "/images/marketing/kiddo-progress-tracking.jpg", unsplashId: "1580582932707-520aed937b7b" },
    { localPath: "/images/marketing/kiddo-achievement-rewards.jpg", unsplashId: "1476701133846-f2481a7f0ede" },
    { localPath: "/images/marketing/kiddo-learning-reports.jpg", unsplashId: "1523050854058-75df16f86c7b" },
    { localPath: "/images/marketing/techmate-device-troubleshooting.jpg", unsplashId: "1581092160602-40a08ad37625" },
    { localPath: "/images/marketing/techmate-software-support.jpg", unsplashId: "1461745970192-46b25e7631da" },
    { localPath: "/images/marketing/techmate-network-diagnostics.jpg", unsplashId: "1558494949-ef010cbdcc31" },
    { localPath: "/images/marketing/techmate-error-codes.jpg", unsplashId: "1516321318523-faa3f2d0e4d0" },
    { localPath: "/images/marketing/techmate-repair-guides.jpg", unsplashId: "1581092160602-40a08ad37625" },
    { localPath: "/images/marketing/techmate-help-desk.jpg", unsplashId: "1560252450-82395c87a107" },
    { localPath: "/images/marketing/techmate-knowledge-base.jpg", unsplashId: "1486312338219-68db3cdba6f9" },
    { localPath: "/images/marketing/techmate-ai-chat.jpg", unsplashId: "1531482615713-2fd845976218" },
    { localPath: "/images/marketing/realestate-property-search.jpg", unsplashId: "1560518883-ce09059eeffa" },
    { localPath: "/images/marketing/realestate-mortgage-calculator.jpg", unsplashId: "1560520663-1a9fd2d73620" },
    { localPath: "/images/marketing/realestate-cash-flow.jpg", unsplashId: "1560518883-ce09059eeffa" },
    { localPath: "/images/marketing/realestate-ai-advisor.jpg", unsplashId: "1486406146928-c627a92ad1ab" },
    { localPath: "/images/marketing/realestate-market-intelligence.jpg", unsplashId: "1448632467637-48cac8892443" },
    { localPath: "/images/marketing/realestate-commercial-analysis.jpg", unsplashId: "1486406146928-c627a92ad1ab" },
    { localPath: "/images/marketing/realestate-land-development.jpg", unsplashId: "1503387765928-6a61be93d5f1" },
    { localPath: "/images/marketing/about-practical-ai.jpg", unsplashId: "1677442135703-1787eea5ce01" },
    { localPath: "/images/marketing/about-safety-first.jpg", unsplashId: "1587300003388-59208cc962cb" },
];

function unsplashUrl(photoRef) {
    const id = photoRef.replace(/^photo-/, "");
    return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=82`;
}

function photoIdFromCredit(credit) {
    const match = credit.originalUrl?.match(/photos\/([0-9]+-[a-f0-9]+)/i);
    return match ? match[1] : null;
}

async function downloadImage(localPath, unsplashId) {
    const dest = path.join(publicDir, localPath.replace(/^\//, ""));
    await mkdir(path.dirname(dest), { recursive: true });

    const url = unsplashUrl(unsplashId);
    const response = await fetch(url, { redirect: "follow" });
    if (!response.ok) {
        throw new Error(`Failed ${localPath}: ${response.status} ${response.statusText}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    await writeFile(dest, buffer);
    return dest;
}

const manifest = new Map();

for (const credit of imageCredits) {
    const id = photoIdFromCredit(credit);
    if (id) manifest.set(credit.localPath, id);
}

for (const item of extraImages) {
    manifest.set(item.localPath, item.unsplashId);
}

let ok = 0;
let failed = 0;

for (const [localPath, unsplashId] of manifest.entries()) {
    try {
        const dest = await downloadImage(localPath, unsplashId);
        ok += 1;
        console.log(`✓ ${localPath} → ${path.relative(root, dest)}`);
    } catch (error) {
        failed += 1;
        console.error(`✗ ${localPath}: ${error.message}`);
    }
}

console.log(`\nDone: ${ok} downloaded, ${failed} failed, ${manifest.size} total.`);

if (failed > 0) process.exitCode = 1;
