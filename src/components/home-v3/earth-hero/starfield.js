import * as THREE from "three";
import { STARFIELD_LAYERS } from "./constants.js";

function createSpherePositions(count, radiusMin, radiusMax) {
    const positions = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
        const radius = radiusMin + Math.random() * (radiusMax - radiusMin);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[index * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
}

/**
 * Builds a multi-depth star field. Each layer drifts at a different rate in the
 * director update loop for subtle parallax without visual clutter.
 */
export function createLayeredStarfield(parentGroup) {
    const layers = STARFIELD_LAYERS.map((config) => {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(
                createSpherePositions(config.count, config.radiusMin, config.radiusMax),
                3,
            ),
        );

        const material = new THREE.PointsMaterial({
            color: 0xdce7ff,
            size: config.size,
            transparent: true,
            opacity: config.opacity,
            depthWrite: false,
            sizeAttenuation: true,
        });

        const points = new THREE.Points(geometry, material);
        points.name = `starfield-${config.id}`;
        parentGroup.add(points);

        return { points, geometry, material, config };
    });

    return {
        layers,
        dispose() {
            layers.forEach(({ geometry, material }) => {
                geometry.dispose();
                material.dispose();
            });
        },
        update(elapsed, motionReduced) {
            if (motionReduced) return;
            layers.forEach(({ points, config }) => {
                points.rotation.y = elapsed * config.drift;
                points.rotation.x = Math.sin(elapsed * config.drift * 0.35) * 0.02;
            });
        },
    };
}
