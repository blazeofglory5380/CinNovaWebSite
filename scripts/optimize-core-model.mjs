/**
 * Optimize the CinNova Core master model into a Draco-compressed web asset.
 *
 *   Master (source of truth, NEVER overwritten):
 *     public/models/cinnova-core/CinNova_AI_Core_v1.0.glb
 *   Web output (derived, safe to regenerate / delete):
 *     public/models/cinnova-core/CinNova_AI_Core_v1.0.web.glb
 *
 * Pipeline: dedup → prune → weld → texture resize+WebP → Draco geometry
 * compression. Draco shrinks mesh data; the texture step handles the bulk of
 * a Meshy export's weight. The master GLB is only read, never written.
 *
 * Run: npm run optimize:core-model
 *
 * Versioning workflow: when a new master ships (e.g. CinNova_AI_Core_v1.1.glb),
 * bump MASTER/WEB below (or pass --in/--out) and re-run — the master always
 * stays the archived original; the .web.glb is the served, derived artifact.
 */
import { stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
// sharp must initialize BEFORE draco3dgltf / @gltf-transform: on Windows their
// native libraries conflict with sharp's libvips DLLs if loaded first
// (ERR_DLOPEN_FAILED). So load sharp here, then import the rest dynamically
// below. Optional — if sharp is unavailable we still ship Draco-geometry-only.
let sharp;
try {
    ({ default: sharp } = await import("sharp"));
    // Actually run the native pipeline so a broken install fails here, not mid-run.
    await sharp({ create: { width: 1, height: 1, channels: 3, background: "#000" } })
        .png()
        .toBuffer();
} catch (e) {
    console.log("[sharp detect] unavailable:", e?.message?.slice(0, 200));
    sharp = null;
}

const { NodeIO } = await import("@gltf-transform/core");
const { ALL_EXTENSIONS } = await import("@gltf-transform/extensions");
const { dedup, prune, weld, draco, textureCompress } = await import("@gltf-transform/functions");
const { default: draco3d } = await import("draco3dgltf");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "public", "models", "cinnova-core");

function argValue(flag, fallback) {
    const i = process.argv.indexOf(flag);
    return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const MASTER = path.join(dir, argValue("--in", "CinNova_AI_Core_v1.0.glb"));
const WEB = path.join(dir, argValue("--out", "CinNova_AI_Core_v1.0.web.glb"));

const mb = (n) => (n / 1024 / 1024).toFixed(2);

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
    "draco3d.decoder": await draco3d.createDecoderModule(),
    "draco3d.encoder": await draco3d.createEncoderModule(),
});

console.log(`Reading master (read-only): ${path.relative(root, MASTER)}`);
const doc = await io.read(MASTER);

const transforms = [dedup(), prune(), weld()];
if (sharp) {
    transforms.push(textureCompress({ encoder: sharp, targetFormat: "webp", resize: [2048, 2048] }));
    console.log("Texture step: WebP + resize(2048) enabled.");
} else {
    console.log("Texture step: skipped (sharp unavailable) — Draco geometry only.");
}
transforms.push(draco());

await doc.transform(...transforms);

await io.write(WEB, doc);

const [m, w] = await Promise.all([stat(MASTER), stat(WEB)]);
console.log(`✓ ${path.relative(root, WEB)}`);
console.log(
    `  master ${mb(m.size)} MB  →  web(draco) ${mb(w.size)} MB  ` +
        `(${(100 - (w.size / m.size) * 100).toFixed(1)}% smaller)`,
);
console.log("  Master GLB untouched (read-only).");
