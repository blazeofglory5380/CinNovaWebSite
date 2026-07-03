import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { EARTH_MODEL_SRC } from "./constants.js";
import { createAtmosphere } from "./atmosphere.js";

/**
 * Reserved hook for a future cloud shell mesh (e.g. Meshy GLB with alpha clouds).
 * The current cinnova-earth.glb ships as a single surface mesh with no cloud layer.
 */
export function attachCloudLayerIfPresent(earthGroup, meshes) {
    const cloudMesh = meshes.find((mesh) => /cloud/i.test(mesh.name));
    if (!cloudMesh) return null;

    cloudMesh.renderOrder = 1;
    return {
        mesh: cloudMesh,
        update(elapsed, motionReduced) {
            if (motionReduced) return;
            cloudMesh.rotation.y = elapsed * 0.018;
        },
    };
}

function enhanceEarthMaterials(mesh) {
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

    materials.forEach((material) => {
        if (!material?.isMeshStandardMaterial) return;

        material.roughness = Math.min(material.roughness ?? 1, 0.92);
        material.metalness = Math.min(material.metalness ?? 0, 0.08);
        material.envMapIntensity = 0.35;

        // Night-side city lights from the GLB emissive map.
        if (material.emissiveMap) {
            material.emissive = new THREE.Color(0xffc78a);
            material.emissiveIntensity = 1.45;
        }

        material.needsUpdate = true;
    });
}

function normalizeEarthModel(model) {
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const maxAxis = Math.max(size.x, size.y, size.z) || 1;
    const scale = 2.1 / maxAxis;
    model.scale.setScalar(scale);

    const center = box.getCenter(new THREE.Vector3()).multiplyScalar(scale);
    model.position.sub(center);

    return { scale, radius: (maxAxis * scale) / 2 };
}

/**
 * Loads the Earth GLB and prepares child groups for future satellite / core attachments.
 */
export function loadEarthSystem({ onError }) {
    const system = new THREE.Group();
    system.name = "earth-system";

    const spinGroup = new THREE.Group();
    spinGroup.name = "earth-spin";
    system.add(spinGroup);

    const surfaceGroup = new THREE.Group();
    surfaceGroup.name = "earth-surface";
    spinGroup.add(surfaceGroup);

    // The served Earth asset is a Draco-compressed *.web.glb, so a DRACOLoader
    // with the decoder hosted at /draco/ is required to decode geometry. Plain
    // (uncompressed) masters would load without it.
    const loader = new GLTFLoader();
    let dracoLoader = null;
    if (/\.web\.glb$/i.test(EARTH_MODEL_SRC)) {
        dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("/draco/");
        loader.setDRACOLoader(dracoLoader);
    }
    let cloudController = null;
    let atmosphere = null;
    let surfaceMeshes = [];

    const promise = new Promise((resolve, reject) => {
        loader.load(
            EARTH_MODEL_SRC,
            (gltf) => {
                const model = gltf.scene;
                model.name = "earth-model";
                const meshes = [];

                model.traverse((child) => {
                    if (!child.isMesh) return;
                    child.castShadow = true;
                    child.receiveShadow = true;
                    enhanceEarthMaterials(child);
                    meshes.push(child);
                });

                const { radius } = normalizeEarthModel(model);
                surfaceGroup.add(model);
                surfaceMeshes = meshes;

                atmosphere = createAtmosphere(radius);
                spinGroup.add(atmosphere.group);

                cloudController = attachCloudLayerIfPresent(surfaceGroup, meshes);

                resolve({
                    system,
                    surfaceGroup,
                    radius,
                    meshes,
                    cloudController,
                });
            },
            undefined,
            (error) => {
                onError?.(error);
                reject(error);
            },
        );
    });

    return {
        system,
        surfaceGroup,
        ready: promise,
        update(elapsed, motionReduced, rotationSpeed) {
            if (!motionReduced) {
                spinGroup.rotation.y = elapsed * rotationSpeed;
            }
            cloudController?.update(elapsed, motionReduced);
        },
        dispose() {
            atmosphere?.dispose();
            surfaceMeshes.forEach((mesh) => {
                mesh.geometry?.dispose();
                const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                materials.forEach((material) => material?.dispose());
            });
            dracoLoader?.dispose();
        },
    };
}
