import * as THREE from "three";

/**
 * Single distant sun plus a cool rim fill. Sun is the only shadow caster.
 */
export function createLighting(scene) {
    const rig = new THREE.Group();
    rig.name = "lighting-rig";

    const ambient = new THREE.AmbientLight(0x14233f, 0.14);
    ambient.name = "ambient-fill";

    const sun = new THREE.DirectionalLight(0xfff1df, 2.35);
    sun.name = "sun";
    sun.position.set(14, 4.5, 9);
    sun.target.position.set(0, 0, 0);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 40;
    sun.shadow.camera.left = -3.5;
    sun.shadow.camera.right = 3.5;
    sun.shadow.camera.top = 3.5;
    sun.shadow.camera.bottom = -3.5;
    sun.shadow.bias = -0.00015;
    sun.shadow.normalBias = 0.02;

    const rim = new THREE.DirectionalLight(0x6eb8ff, 0.38);
    rim.name = "rim";
    rim.position.set(-9, 1.2, -6);

    rig.add(ambient, sun, sun.target, rim);
    scene.add(rig);

    return {
        rig,
        sun,
        rim,
        ambient,
        dispose() {
            scene.remove(rig);
        },
    };
}
