/**
 * Procedural GLB builder: Real Estate AI farmhouse transformation hero.
 * Output: public/models/product-heroes/realestateai-farmhouse-transformation.glb
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as THREE from "three";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import { NodeIO } from "@gltf-transform/core";
import { KHRONOS_EXTENSIONS } from "@gltf-transform/extensions";
import { dedup, prune, resample } from "@gltf-transform/functions";

if (typeof FileReader === "undefined") {
    global.FileReader = class PolyfillFileReader {
        constructor() {
            this.result = null;
            this.onloadend = null;
        }

        readAsArrayBuffer(blob) {
            blob.arrayBuffer().then((buffer) => {
                this.result = buffer;
                if (this.onloadend) this.onloadend();
            });
        }
    };
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outGlb = path.join(root, "public/models/product-heroes/realestateai-farmhouse-transformation.glb");
const outPoster = path.join(
    root,
    "public/images/product-heroes/posters/realestateai-farmhouse-transformation.png",
);

const ANIM_DURATION = 8;
const PLATFORM_RADIUS = 1.15;
const PLATFORM_HEIGHT = 0.1;

function mat({ color, emissive = 0x000000, emissiveIntensity = 0, metalness = 0.05, roughness = 0.72 }) {
    return new THREE.MeshStandardMaterial({
        color,
        emissive: new THREE.Color(emissive),
        emissiveIntensity,
        metalness,
        roughness,
    });
}

function box(w, h, d, material, x, y, z, parent) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
}

function buildBeforeHouse(parent) {
    const group = new THREE.Group();
    group.name = "BeforeHouse";
    group.position.set(-0.42, PLATFORM_HEIGHT, -0.05);

    const siding = mat({ color: 0x9a8b78, roughness: 0.9 });
    const roof = mat({ color: 0x5c4f45, roughness: 0.85 });
    const trim = mat({ color: 0x7a6d62, roughness: 0.88 });

    box(0.52, 0.38, 0.46, siding, 0, 0.24, 0, group);
    const roofMesh = box(0.58, 0.08, 0.52, roof, 0, 0.5, 0, group);
    roofMesh.rotation.z = 0.12;
    roofMesh.rotation.x = -0.08;

    const porch = box(0.28, 0.06, 0.16, trim, 0.18, 0.1, 0.28, group);
    porch.rotation.x = -0.22;
    box(0.04, 0.18, 0.04, trim, 0.08, 0.16, 0.34, group);
    box(0.04, 0.08, 0.04, trim, 0.28, 0.12, 0.34, group);

    const windowMat = mat({ color: 0x3d4f5f, roughness: 0.35, metalness: 0.2 });
    box(0.1, 0.1, 0.02, windowMat, -0.12, 0.28, 0.24, group);
    box(0.1, 0.1, 0.02, windowMat, 0.12, 0.28, 0.24, group);

    for (let i = 0; i < 8; i++) {
        const blade = new THREE.Mesh(
            new THREE.ConeGeometry(0.04 + Math.random() * 0.03, 0.12 + Math.random() * 0.08, 5),
            mat({ color: 0x4f7a45, roughness: 0.95 }),
        );
        blade.position.set(-0.35 + Math.random() * 0.7, PLATFORM_HEIGHT + 0.04, 0.2 + Math.random() * 0.35);
        blade.rotation.y = Math.random() * Math.PI;
        group.add(blade);
    }

    parent.add(group);
    return group;
}

function buildAfterHouse(parent) {
    const group = new THREE.Group();
    group.name = "AfterHouse";
    group.position.set(0.38, PLATFORM_HEIGHT, -0.02);
    group.scale.setScalar(0.001);

    const siding = mat({ color: 0xf4f6f8, roughness: 0.42 });
    const roof = mat({ color: 0x2f3540, roughness: 0.55, metalness: 0.15 });
    const frame = mat({ color: 0x111827, roughness: 0.35, metalness: 0.35 });
    const glow = mat({ color: 0xfff4df, emissive: 0xffc98a, emissiveIntensity: 1.4, roughness: 0.2 });

    box(0.5, 0.4, 0.44, siding, 0, 0.26, 0, group);
    box(0.56, 0.07, 0.5, roof, 0, 0.52, 0, group);

    const porchDeck = box(0.34, 0.05, 0.18, mat({ color: 0xe8edf2, roughness: 0.5 }), 0.12, 0.08, 0.27, group);
    porchDeck.rotation.x = -0.05;
    box(0.34, 0.04, 0.03, frame, 0.12, 0.16, 0.35, group);
    box(0.03, 0.14, 0.03, frame, -0.04, 0.14, 0.35, group);
    box(0.03, 0.14, 0.03, frame, 0.28, 0.14, 0.35, group);

    box(0.11, 0.14, 0.02, frame, -0.1, 0.3, 0.23, group);
    box(0.11, 0.14, 0.02, frame, 0.1, 0.3, 0.23, group);
    box(0.08, 0.12, 0.015, glow, -0.1, 0.3, 0.245, group);
    box(0.08, 0.12, 0.015, glow, 0.1, 0.3, 0.245, group);

    const shrub = mat({ color: 0x5fa968, roughness: 0.8 });
    for (const [x, z] of [
        [-0.2, 0.3],
        [0.22, 0.28],
        [0.45, 0.05],
    ]) {
        const bush = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 10), shrub);
        bush.position.set(x, PLATFORM_HEIGHT + 0.05, z);
        group.add(bush);
    }

    parent.add(group);
    return group;
}

function buildCouple(parent) {
    const group = new THREE.Group();
    group.name = "Couple";
    group.position.set(0.02, PLATFORM_HEIGHT, 0.52);

    const skin = mat({ color: 0xe8b796, roughness: 0.75 });
    const clothA = mat({ color: 0x3b4f73, roughness: 0.7 });
    const clothB = mat({ color: 0xdb2777, roughness: 0.68 });

    function person(offsetX, clothMat) {
        const personGroup = new THREE.Group();
        personGroup.position.x = offsetX;
        const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.18, 6, 10), clothMat);
        body.position.y = 0.2;
        personGroup.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 12), skin);
        head.position.y = 0.36;
        personGroup.add(head);
        group.add(personGroup);
    }

    person(-0.08, clothA);
    person(0.08, clothB);
    parent.add(group);
    return group;
}

function buildUiPanel(parent, { name, x, y, z, ry, color, emissive, w = 0.34, h = 0.2 }) {
    const group = new THREE.Group();
    group.name = name;
    group.position.set(x, y, z);
    group.rotation.y = ry;

    const glass = mat({
        color: 0xffffff,
        emissive,
        emissiveIntensity: 0.35,
        roughness: 0.15,
        metalness: 0.05,
    });
    const panel = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.012), glass);
    panel.castShadow = true;
    group.add(panel);

    const accent = mat({ color, emissive, emissiveIntensity: 0.8, roughness: 0.3 });
    const bar = new THREE.Mesh(new THREE.BoxGeometry(w * 0.92, 0.028, 0.006), accent);
    bar.position.set(0, h * 0.32, 0.01);
    group.add(bar);

    const chip = new THREE.Mesh(new THREE.BoxGeometry(w * 0.42, 0.05, 0.005), accent);
    chip.position.set(-w * 0.18, -h * 0.12, 0.01);
    group.add(chip);

    const chip2 = new THREE.Mesh(new THREE.BoxGeometry(w * 0.36, 0.05, 0.005), mat({ color: 0x2563eb, emissive: 0x2563eb, emissiveIntensity: 0.7 }));
    chip2.position.set(w * 0.16, -h * 0.12, 0.01);
    group.add(chip2);

    group.scale.setScalar(0.001);
    parent.add(group);
    return group;
}

function buildScene() {
    const scene = new THREE.Scene();
    scene.name = "RealEstateFarmhouseHero";

    const platformMat = mat({ color: 0xf8fafc, roughness: 0.55, metalness: 0.08 });
    const platform = new THREE.Mesh(
        new THREE.CylinderGeometry(PLATFORM_RADIUS, PLATFORM_RADIUS, PLATFORM_HEIGHT, 64),
        platformMat,
    );
    platform.position.y = PLATFORM_HEIGHT / 2;
    platform.receiveShadow = true;
    platform.name = "Platform";
    scene.add(platform);

    const turf = new THREE.Mesh(
        new THREE.CylinderGeometry(PLATFORM_RADIUS * 0.92, PLATFORM_RADIUS * 0.92, 0.02, 48),
        mat({ color: 0x7cb56d, roughness: 0.95 }),
    );
    turf.position.y = PLATFORM_HEIGHT + 0.01;
    scene.add(turf);

    const shadowDisc = new THREE.Mesh(
        new THREE.CircleGeometry(PLATFORM_RADIUS * 1.05, 48),
        mat({ color: 0xd9e2ec, roughness: 1, metalness: 0 }),
    );
    shadowDisc.rotation.x = -Math.PI / 2;
    shadowDisc.position.y = 0.001;
    scene.add(shadowDisc);

    const beforeHouse = buildBeforeHouse(scene);
    const afterHouse = buildAfterHouse(scene);
    const couple = buildCouple(scene);

    const uiAnalysis = buildUiPanel(scene, {
        name: "UiAnalysis",
        x: -0.05,
        y: 0.95,
        z: 0.15,
        ry: -0.25,
        color: 0xec4899,
        emissive: 0xec4899,
        w: 0.38,
        h: 0.22,
    });
    const uiValue = buildUiPanel(scene, {
        name: "UiValue",
        x: 0.72,
        y: 0.82,
        z: 0.05,
        ry: -0.55,
        color: 0x2563eb,
        emissive: 0x2563eb,
        w: 0.3,
        h: 0.18,
    });
    const uiRehab = buildUiPanel(scene, {
        name: "UiRehab",
        x: -0.78,
        y: 0.78,
        z: 0.02,
        ry: 0.45,
        color: 0x10b981,
        emissive: 0x10b981,
        w: 0.28,
        h: 0.16,
    });

    return { scene, beforeHouse, afterHouse, couple, uiPanels: [uiAnalysis, uiValue, uiRehab] };
}

function scaleTracks(object, times, values) {
    const base = object.uuid;
    return ["x", "y", "z"].map(
        (axis) => new THREE.NumberKeyframeTrack(`${base}.scale[${axis}]`, times, values),
    );
}

function buildTransformationClip(beforeHouse, afterHouse, uiPanels) {
    const times = [0, 1.8, 2.2, 5.2, 5.6, ANIM_DURATION];
    const beforeScales = [1, 1, 1, 0.08, 0.08, 0.08];
    const afterScales = [0.001, 0.001, 0.001, 1, 1, 1];
    const uiScales = [0.001, 0.001, 0.001, 1, 1, 1];

    const tracks = [
        ...scaleTracks(beforeHouse, times, beforeScales),
        ...scaleTracks(afterHouse, times, afterScales),
    ];

    for (const panel of uiPanels) {
        tracks.push(...scaleTracks(panel, times, uiScales));
        tracks.push(
            new THREE.NumberKeyframeTrack(
                `${panel.uuid}.position[y]`,
                [0, 2.4, 5.2, ANIM_DURATION],
                [panel.position.y, panel.position.y, panel.position.y + 0.06, panel.position.y + 0.03],
            ),
        );
    }

    return new THREE.AnimationClip("Transformation", ANIM_DURATION, tracks);
}

function exportGlb(scene, animations) {
    const exporter = new GLTFExporter();
    return new Promise((resolve, reject) => {
        exporter.parse(
            scene,
            (result) => {
                if (result instanceof ArrayBuffer) {
                    resolve(Buffer.from(result));
                    return;
                }
                reject(new Error("Expected binary GLB export"));
            },
            (error) => reject(error),
            { binary: true, animations },
        );
    });
}

async function compressGlb(buffer) {
    const io = new NodeIO().registerExtensions(KHRONOS_EXTENSIONS);
    const document = await io.readBinary(buffer);
    await document.transform(dedup(), prune(), resample());
    return Buffer.from(await io.writeBinary(document));
}


async function renderPoster() {
    const existingPoster = outPoster;
    try {
        await fs.access(existingPoster);
        console.log("  Poster: kept existing PNG (re-capture from modelviewer.dev/editor after visual review)");
    } catch {
        const jpgFallback = path.join(root, "public/images/products/cinnova-real-estate-property.jpg");
        await fs.copyFile(jpgFallback, existingPoster.replace(/\.png$/i, ".jpg"));
        console.log("  Poster: wrote JPG fallback (replace with PNG hero still when ready)");
    }
}

async function validateGlb(buffer) {
    const io = new NodeIO().registerExtensions(KHRONOS_EXTENSIONS);
    const doc = await io.readBinary(buffer);
    const root = doc.getRoot();
    const scenes = root.listScenes();
    const animations = root.listAnimations();
    return {
        sceneCount: scenes.length,
        animationCount: animations.length,
        firstAnimation: animations[0]?.getName() || null,
        meshCount: root.listMeshes().length,
        byteLength: buffer.length,
    };
}

async function main() {
    await fs.mkdir(path.dirname(outGlb), { recursive: true });
    await fs.mkdir(path.dirname(outPoster), { recursive: true });

    const { scene, beforeHouse, afterHouse, uiPanels } = buildScene();
    const transformation = buildTransformationClip(beforeHouse, afterHouse, uiPanels);

    let glbBuffer = await exportGlb(scene, [transformation]);
    const rawSize = glbBuffer.length;

    if (glbBuffer.length > 4 * 1024 * 1024) {
        glbBuffer = await compressGlb(glbBuffer);
    } else {
        glbBuffer = await compressGlb(glbBuffer);
    }

    const meta = await validateGlb(glbBuffer);
    if (meta.firstAnimation !== "Transformation") {
        throw new Error(`Expected first animation "Transformation", got "${meta.firstAnimation}"`);
    }
    if (glbBuffer.length > 8 * 1024 * 1024) {
        throw new Error(`GLB exceeds 8 MB maximum (${(glbBuffer.length / 1024 / 1024).toFixed(2)} MB)`);
    }

    await fs.writeFile(outGlb, glbBuffer);
    await renderPoster();

    console.log("Real Estate AI farmhouse hero GLB built.");
    console.log(`  GLB: ${path.relative(root, outGlb)}`);
    console.log(`  Poster: ${path.relative(root, outPoster)}`);
    console.log(`  Raw export: ${(rawSize / 1024).toFixed(1)} KB`);
    console.log(`  Final size: ${(glbBuffer.length / 1024).toFixed(1)} KB (${meta.byteLength} bytes)`);
    console.log(`  Meshes: ${meta.meshCount}, animations: ${meta.animationCount}, first clip: ${meta.firstAnimation}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
