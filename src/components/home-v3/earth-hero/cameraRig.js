import * as THREE from "three";

const BASE_POSITION = new THREE.Vector3(0.05, 0.12, 4.35);
const LOOK_AT = new THREE.Vector3(0, 0, 0);

/**
 * Cinematic camera rig with imperceptible drift — no user controls.
 * Future fly-to targets can call `flyTo(target, duration)`.
 */
export function createCameraRig(camera) {
    const state = {
        flyToTarget: null,
        flyToProgress: 0,
        flyToDuration: 0,
        flyToStart: new THREE.Vector3(),
        flyToEnd: new THREE.Vector3(),
        lookAt: LOOK_AT.clone(),
    };

    camera.position.copy(BASE_POSITION);
    camera.lookAt(LOOK_AT);

    return {
        camera,
        state,
        /**
         * Reserved for Phase 3+ camera fly-to animations.
         * @param {THREE.Vector3} targetPosition
         * @param {number} durationSec
         */
        flyTo(targetPosition, durationSec = 2.4) {
            state.flyToStart.copy(camera.position);
            state.flyToEnd.copy(targetPosition);
            state.flyToDuration = durationSec;
            state.flyToProgress = 0;
            state.flyToTarget = targetPosition;
        },
        update(elapsed, delta, motionReduced) {
            if (state.flyToTarget && state.flyToProgress < 1) {
                state.flyToProgress += delta / state.flyToDuration;
                const t = THREE.MathUtils.smoothstep(state.flyToProgress, 0, 1);
                camera.position.lerpVectors(state.flyToStart, state.flyToEnd, t);
                camera.lookAt(state.lookAt);
                return;
            }

            if (motionReduced) {
                camera.position.copy(BASE_POSITION);
                camera.lookAt(LOOK_AT);
                return;
            }

            // Very slow orbital drift + micro float — never fully static.
            const driftX = Math.sin(elapsed * 0.045) * 0.11 + Math.sin(elapsed * 0.013) * 0.04;
            const driftY = Math.cos(elapsed * 0.038) * 0.06 + Math.sin(elapsed * 0.021) * 0.025;
            const driftZ = Math.cos(elapsed * 0.029) * 0.08;

            camera.position.set(
                BASE_POSITION.x + driftX,
                BASE_POSITION.y + driftY,
                BASE_POSITION.z + driftZ,
            );

            state.lookAt.set(
                LOOK_AT.x + Math.sin(elapsed * 0.02) * 0.03,
                LOOK_AT.y + Math.cos(elapsed * 0.017) * 0.02,
                LOOK_AT.z,
            );
            camera.lookAt(state.lookAt);
        },
    };
}
