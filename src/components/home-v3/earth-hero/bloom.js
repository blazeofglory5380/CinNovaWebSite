import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { BLOOM_SETTINGS } from "./constants.js";

/**
 * Lightweight bloom pass — highlights city lights and atmosphere rim without
 * heavy lens-flare post FX.
 */
export function createBloomPipeline(renderer, scene, camera) {
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(1, 1),
        BLOOM_SETTINGS.strength,
        BLOOM_SETTINGS.radius,
        BLOOM_SETTINGS.threshold,
    );
    composer.addPass(bloomPass);

    return {
        composer,
        bloomPass,
        setSize(width, height) {
            composer.setSize(width, height);
            bloomPass.resolution.set(width, height);
        },
        render() {
            composer.render();
        },
        dispose() {
            composer.dispose();
        },
    };
}
