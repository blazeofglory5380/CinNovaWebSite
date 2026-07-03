import * as THREE from "three";

const atmosphereVertexShader = /* glsl */ `
varying vec3 vNormal;
varying vec3 vViewDirection;

void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewDirection = normalize(cameraPosition - worldPosition.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;

const atmosphereFragmentShader = /* glsl */ `
uniform vec3 glowColor;
uniform float glowIntensity;
uniform float falloff;

varying vec3 vNormal;
varying vec3 vViewDirection;

void main() {
    float fresnel = pow(1.0 - max(dot(vNormal, vViewDirection), 0.0), falloff);
    float alpha = fresnel * glowIntensity;
    gl_FragColor = vec4(glowColor, alpha);
}
`;

function createAtmosphereShell(radius, { color, intensity, falloff, opacity }) {
    const geometry = new THREE.SphereGeometry(radius, 72, 72);
    const material = new THREE.ShaderMaterial({
        uniforms: {
            glowColor: { value: new THREE.Color(color) },
            glowIntensity: { value: intensity },
            falloff: { value: falloff },
        },
        vertexShader: atmosphereVertexShader,
        fragmentShader: atmosphereFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.renderOrder = 2;
    mesh.material.opacity = opacity;
    return { mesh, geometry, material };
}

/**
 * Dual-shell atmospheric rim glow — inner cyan haze + outer soft bloom halo.
 */
export function createAtmosphere(radius) {
    // Softer, thinner falloff so the rim reads as glow rather than a hard
    // outline. Higher falloff hugs the limb; lower intensity keeps bloom from
    // over-amplifying the edge into a bright ring.
    const inner = createAtmosphereShell(radius * 1.022, {
        color: 0x8ad0ff,
        intensity: 0.3,
        falloff: 3.6,
        opacity: 1,
    });
    inner.mesh.name = "atmosphere-inner";

    const outer = createAtmosphereShell(radius * 1.055, {
        color: 0x3f8de8,
        intensity: 0.12,
        falloff: 5.6,
        opacity: 1,
    });
    outer.mesh.name = "atmosphere-outer";

    const group = new THREE.Group();
    group.name = "atmosphere";
    group.add(inner.mesh, outer.mesh);

    return {
        group,
        dispose() {
            inner.geometry.dispose();
            inner.material.dispose();
            outer.geometry.dispose();
            outer.material.dispose();
        },
    };
}
