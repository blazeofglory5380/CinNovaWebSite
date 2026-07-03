import * as THREE from "three";
import { EARTH_ROTATION_PERIOD_SEC, SCENE_LAYERS } from "./constants.js";
import { createLayeredStarfield } from "./starfield.js";
import { createLighting } from "./lighting.js";
import { createCameraRig } from "./cameraRig.js";
import { loadEarthSystem } from "./earthLoader.js";
import { createBloomPipeline } from "./bloom.js";

const EARTH_ROTATION_SPEED = (Math.PI * 2) / EARTH_ROTATION_PERIOD_SEC;

/**
 * Orchestrates the cinematic Earth hero scene.
 *
 * Extension points (not implemented yet):
 * - `layers.satellites` — floating product worlds (Meshy GLBs)
 * - `layers.core` — CinNova AI Core
 * - `interactives` — hover / click targets
 * - `cameraRig.flyTo()` — camera fly-to animations
 */
export class EarthHeroDirector {
    constructor({ canvas, container, motionReduced, onLoadError }) {
        this.container = container;
        this.motionReduced = motionReduced;
        this.isVisible = true;
        this.disposed = false;

        this.clock = new THREE.Clock();
        this.scene = new THREE.Scene();
        this.layers = {
            [SCENE_LAYERS.SPACE]: new THREE.Group(),
            [SCENE_LAYERS.EARTH]: new THREE.Group(),
            [SCENE_LAYERS.SATELLITES]: new THREE.Group(),
            [SCENE_LAYERS.CORE]: new THREE.Group(),
            [SCENE_LAYERS.FX]: new THREE.Group(),
        };

        Object.values(this.layers).forEach((layer) => this.scene.add(layer));
        this.layers[SCENE_LAYERS.SATELLITES].name = "satellites-layer";
        this.layers[SCENE_LAYERS.CORE].name = "ai-core-layer";

        // Future interactive targets keyed by id (product slug, core node, etc.)
        this.interactives = new Map();

        this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
        this.cameraRig = createCameraRig(this.camera);

        this.renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.08;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.lighting = createLighting(this.scene);
        this.starfield = createLayeredStarfield(this.layers[SCENE_LAYERS.SPACE]);

        this.earthLoader = loadEarthSystem({ onError: onLoadError });
        this.layers[SCENE_LAYERS.EARTH].add(this.earthLoader.system);

        this.bloom = null;
        this.earthLoader.ready
            .then(() => {
                if (this.disposed) return;
                this.bloom = createBloomPipeline(this.renderer, this.scene, this.camera);
                this.resize();
            })
            .catch(() => {
                onLoadError?.();
            });

        this.resizeObserver = new ResizeObserver(() => this.resize());
        this.resizeObserver.observe(container);

        this.visibilityObserver = new IntersectionObserver(
            ([entry]) => {
                this.isVisible = entry.isIntersecting;
                if (this.isVisible) this.clock.getDelta();
            },
            { threshold: 0.08 },
        );
        this.visibilityObserver.observe(container);

        this.animationFrame = 0;
        this.animate = this.animate.bind(this);
        this.animationFrame = window.requestAnimationFrame(this.animate);
    }

    /** Attach a future product world or satellite GLB group. */
    addSatellite(group) {
        this.layers[SCENE_LAYERS.SATELLITES].add(group);
    }

    /** Attach the future CinNova AI Core visual. */
    addCore(group) {
        this.layers[SCENE_LAYERS.CORE].add(group);
    }

    /** Register a mesh for future hover / raycast interactions. */
    registerInteractive(id, object3D) {
        this.interactives.set(id, object3D);
    }

    setMotionReduced(motionReduced) {
        this.motionReduced = motionReduced;
    }

    resize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        if (!width || !height) return;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height, false);
        this.bloom?.setSize(width, height);
    }

    animate() {
        if (!this.disposed) {
            this.animationFrame = window.requestAnimationFrame(this.animate);
        }

        if (!this.isVisible) return;

        const elapsed = this.clock.getElapsedTime();
        const delta = this.clock.getDelta();

        this.starfield.update(elapsed, this.motionReduced);
        this.earthLoader.update(elapsed, this.motionReduced, EARTH_ROTATION_SPEED);
        this.cameraRig.update(elapsed, delta, this.motionReduced);

        if (this.bloom) {
            this.bloom.render();
        } else {
            this.renderer.render(this.scene, this.camera);
        }
    }

    dispose() {
        this.disposed = true;
        window.cancelAnimationFrame(this.animationFrame);
        this.resizeObserver.disconnect();
        this.visibilityObserver.disconnect();

        this.starfield.dispose();
        this.lighting.dispose();
        this.earthLoader.dispose();
        this.bloom?.dispose();
        this.renderer.dispose();
    }
}
