import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { blogImagePool } from "../src/data/blogImageInventory.js";
import { existsSync } from "node:fs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");

function unsplashUrl(photoRef) {
    const id = photoRef.replace(/^photo-/, "");
    return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=82`;
}

async function downloadImage(localPath, unsplashId) {
    const dest = path.join(publicDir, localPath.replace(/^\//, ""));
    if (existsSync(dest)) {
        return { dest, skipped: true };
    }
    await mkdir(path.dirname(dest), { recursive: true });
    const response = await fetch(unsplashUrl(unsplashId), { redirect: "follow" });
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    await writeFile(dest, buffer);
    return { dest, skipped: false };
}

let ok = 0;
let skipped = 0;
let failed = 0;

for (const asset of blogImagePool) {
    if (!asset.localPath.startsWith("/images/blog/")) continue;
    try {
        const { dest, skipped: wasSkipped } = await downloadImage(asset.localPath, asset.unsplashId);
        if (wasSkipped) {
            skipped += 1;
            console.log(`○ ${asset.localPath} (exists)`);
        } else {
            ok += 1;
            console.log(`✓ ${asset.localPath} → ${path.relative(root, dest)}`);
        }
    } catch (error) {
        failed += 1;
        console.error(`✗ ${asset.localPath}: ${error.message}`);
    }
}

console.log(`\nBlog images: ${ok} downloaded, ${skipped} skipped, ${failed} failed.`);
if (failed > 0) process.exitCode = 1;
