/**
 * Remove neighboring crop artifacts from Kiddo character PNGs.
 * Usage: node scripts/clean-kiddo-character-pngs.mjs
 */
import sharp from "sharp";
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const charactersDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images", "Kiddo", "characters");

/** Extra crop insets after blob removal (pixels from each edge). */
const edgeCrop = {
    "nova.png": { left: 0, right: 0, top: 0, bottom: 0 },
    "captain-leo.png": { left: 0, right: 0, top: 0, bottom: 0 },
    "professor-hoot.png": { left: 0, right: 0, top: 0, bottom: 0 },
};

function isForeground(r, g, b, a) {
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    return a > 30 && lum > 20;
}

function removeArtifactPixels(data, w, h, filename) {
    const out = Buffer.from(data);

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const i = (y * w + x) * 4;
            const r = out[i];
            const g = out[i + 1];
            const b = out[i + 2];
            const a = out[i + 3];
            if (a < 30) continue;

            let remove = false;

            if (filename === "nova.png") {
                // Dark purple telescope / sheet debris (low green, deep violet)
                if (r < 120 && g < 55 && b > 45 && b < 130 && r < b) {
                    remove = true;
                }
                // Upper-left neighboring prop still connected via hair fringe
                if (x < 17 && y < 96) {
                    remove = true;
                }
            } else if (filename === "captain-leo.png") {
                // Stray Nova pink hair + orange wisps beside the telescope
                if (x >= 82 && x <= 112 && y >= 45 && y <= 66) {
                    if (g < 50 && r > 28 && b < 30) {
                        remove = true;
                    }
                    if (r > 140 && g > 70 && g < 210 && b > 70 && b < 210) {
                        remove = true;
                    }
                }
                // Dark brown strip caught above the telescope tip on the right
                if (x >= 135 && y <= 55 && g < 95 && r < 210) {
                    remove = true;
                }
                // Muted brown/orange edge wisps beside the telescope barrel
                if (x >= 147 && y >= 54 && y <= 60 && g < 140 && r < 200 && b < 85) {
                    remove = true;
                }
            } else if (filename === "professor-hoot.png") {
                // Yellow / gold sheet debris on the left (keep cap tassel above the face)
                const isYellow = r > 180 && g > 130 && b < 110;
                if (x < 22 && y > 35 && isYellow) {
                    remove = true;
                }
                if (x < 18 && y > 120 && y < 195) {
                    remove = true;
                }
            }

            if (remove) {
                out[i] = out[i + 1] = out[i + 2] = out[i + 3] = 0;
            }
        }
    }

    return out;
}

function findComponents(data, w, h) {
    const mask = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const i = (y * w + x) * 4;
            mask[y * w + x] = isForeground(data[i], data[i + 1], data[i + 2], data[i + 3]) ? 1 : 0;
        }
    }

    const labels = new Int32Array(w * h);
    const stats = [];
    const stackX = [];
    const stackY = [];

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const idx = y * w + x;
            if (!mask[idx] || labels[idx]) continue;

            const id = stats.length + 1;
            let minX = x;
            let maxX = x;
            let minY = y;
            let maxY = y;
            let count = 0;
            let sumX = 0;
            let sumY = 0;

            stackX.length = 0;
            stackY.length = 0;
            stackX.push(x);
            stackY.push(y);
            labels[idx] = id;

            while (stackX.length) {
                const cx = stackX.pop();
                const cy = stackY.pop();
                count++;
                sumX += cx;
                sumY += cy;
                minX = Math.min(minX, cx);
                maxX = Math.max(maxX, cx);
                minY = Math.min(minY, cy);
                maxY = Math.max(maxY, cy);

                for (const [dx, dy] of [
                    [1, 0],
                    [-1, 0],
                    [0, 1],
                    [0, -1],
                ]) {
                    const nx = cx + dx;
                    const ny = cy + dy;
                    if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
                    const ni = ny * w + nx;
                    if (mask[ni] && !labels[ni]) {
                        labels[ni] = id;
                        stackX.push(nx);
                        stackY.push(ny);
                    }
                }
            }

            stats.push({
                id,
                count,
                minX,
                maxX,
                minY,
                maxY,
                centerX: sumX / count,
                centerY: sumY / count,
            });
        }
    }

    stats.sort((a, b) => b.count - a.count);
    return { labels, stats };
}

function shouldKeepComponent(comp, stats, w, h, filename) {
    const largest = stats[0];
    const relArea = comp.count / largest.count;

    if (comp.id === largest.id) return true;

    // Keep soft ground shadow under the character
    if (comp.centerY > h * 0.82 && relArea < 0.15 && comp.maxX - comp.minX > w * 0.12) {
        return true;
    }

    // Drop tiny specks everywhere
    if (relArea < 0.002) return false;

    if (filename === "nova.png") {
        if (comp.maxX <= 20 && comp.maxY <= 95) return false;
        if (comp.centerX < 22 && comp.maxY < 105 && relArea < 0.03) return false;
        if (comp.maxX <= 26 && comp.minY > 175 && relArea < 0.003) return false;
    } else if (filename === "captain-leo.png") {
        if (comp.minX >= 82 && comp.maxX <= 115 && comp.maxY <= 68 && relArea < 0.02) return false;
        if (comp.minX >= w - 20 && relArea < 0.02) return false;
        if (comp.centerX > w * 0.82 && comp.maxY < h * 0.45 && relArea < 0.02) return false;
        // Upper-left hat is part of Leo — keep large upper components
        if (comp.minY < h * 0.35 && relArea > 0.2) return true;
    } else if (filename === "professor-hoot.png") {
        if (comp.maxX <= 32 && relArea < 0.12) return false;
        if (comp.centerX < 28 && relArea < 0.1) return false;
    }

    return relArea >= 0.004;
}

function removeStrayBlobs(data, w, h, filename) {
    const { labels, stats } = findComponents(data, w, h);
    const keepIds = new Set(stats.filter((comp) => shouldKeepComponent(comp, stats, w, h, filename)).map((c) => c.id));

    const out = Buffer.from(data);
    for (let idx = 0; idx < w * h; idx++) {
        const label = labels[idx];
        if (label && !keepIds.has(label)) {
            const i = idx * 4;
            out[i] = out[i + 1] = out[i + 2] = out[i + 3] = 0;
        }
    }

    return out;
}

async function cleanCharacter(filename) {
    const inputPath = join(charactersDir, filename);
    const { data, info } = await sharp(inputPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const { width: w, height: h } = info;

    let masked = removeArtifactPixels(data, w, h, filename);
    masked = removeStrayBlobs(masked, w, h, filename);

    const crop = edgeCrop[filename];
    const left = crop.left;
    const top = crop.top;
    const width = w - crop.left - crop.right;
    const height = h - crop.top - crop.bottom;

    const cropped = await sharp(masked, { raw: { width: w, height: h, channels: 4 } })
        .extract({ left, top, width, height })
        .png()
        .toBuffer();

    const cleaned = await sharp(cropped)
        .trim({ threshold: 1 })
        .extend({
            top: 8,
            bottom: 8,
            left: 8,
            right: 8,
            background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png({ compressionLevel: 9 })
        .toBuffer();

    writeFileSync(inputPath, cleaned);
    const meta = await sharp(cleaned).metadata();
    return { filename, width: meta.width, height: meta.height, bytes: cleaned.length };
}

const targets = ["nova.png", "captain-leo.png", "professor-hoot.png"];

for (const file of targets) {
    const result = await cleanCharacter(file);
    console.log("cleaned", result.filename, `${result.width}x${result.height}`, `${result.bytes} bytes`);
}
