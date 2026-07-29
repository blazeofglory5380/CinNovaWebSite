import { useEffect, useRef } from "react";

/*
 * CinNovaCoreScene — the living AI Core WebGL stage (Brand DNA).
 *
 * three.js and all addons are DYNAMICALLY imported inside the effect, so the
 * library only downloads when this scene actually mounts (capable browser +
 * GLB present). Nothing static pulls three into the blog bundle.
 *
 * Lighting follows the Style Guide: dark studio base, white key, emerald rim,
 * sapphire refraction fill, gold intelligence-core point light, UnrealBloom
 * for volumetric glow. Particle-flow dust orbits the core. Pointer parallax,
 * idle float, and pulse are disabled under prefers-reduced-motion. The loop
 * pauses offscreen / when the tab is hidden and fully disposes on unmount.
 *
 * If the GLB fails to load or WebGL is unavailable, the effect bails quietly
 * and the CSS orb fallback behind the canvas remains visible.
 */
function CinNovaCoreScene({
    modelPath = "/models/cinnova-core/CinNova_AI_Core_v2.web.glb",
    onPulse,
    onReady,
}) {
    const hostRef = useRef(null);

    useEffect(() => {
        const host = hostRef.current;
        if (!host) return undefined;

        let disposed = false;
        let cleanup = () => {};

        (async () => {
            let THREE, GLTFLoader, EffectComposer, RenderPass, UnrealBloomPass, OutputPass;
            try {
                THREE = await import("three");
                ({ GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js"));
                ({ EffectComposer } = await import("three/addons/postprocessing/EffectComposer.js"));
                ({ RenderPass } = await import("three/addons/postprocessing/RenderPass.js"));
                ({ UnrealBloomPass } = await import("three/addons/postprocessing/UnrealBloomPass.js"));
                ({ OutputPass } = await import("three/addons/postprocessing/OutputPass.js"));
            } catch {
                return; // keep CSS fallback
            }
            if (disposed) return;

            const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

            let renderer;
            try {
                renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            } catch {
                return; // no WebGL — keep CSS fallback
            }
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.05;
            host.appendChild(renderer.domElement);

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);

            const emeraldGlow = new THREE.Color("#3fe8c0");
            const sapphire = new THREE.Color("#1b6cf2");
            const gold = new THREE.Color("#c9a962");

            // Dark studio / museum lighting rig
            const key = new THREE.DirectionalLight(0xeef6f2, 2.2);
            key.position.set(3, 4, 5);
            const rim = new THREE.DirectionalLight(emeraldGlow, 3.0); // emerald rim
            rim.position.set(-5, 1, -4);
            const refraction = new THREE.DirectionalLight(sapphire, 1.4); // sapphire refraction
            refraction.position.set(4, -2, -3);
            const coreLight = new THREE.PointLight(gold, 1.6, 18); // gold intelligence core
            coreLight.position.set(0, 0, 0);
            scene.add(key, rim, refraction, coreLight);
            scene.add(new THREE.HemisphereLight(0x2a4b43, 0x04110d, 0.8));

            const composer = new EffectComposer(renderer);
            composer.addPass(new RenderPass(scene, camera));
            const bloom = new UnrealBloomPass(new THREE.Vector2(2, 2), 0.72, 0.7, 0.6);
            composer.addPass(bloom);
            composer.addPass(new OutputPass());

            const coreGroup = new THREE.Group();
            scene.add(coreGroup);
            let coreMat = null;
            let coreR = 1;
            let ready = false;
            let dracoLoader = null;

            // Particle-flow dust orbiting the core
            const dustUniforms = { uTime: { value: 0 } };
            const dust = (() => {
                const N = 460;
                const pos = new Float32Array(N * 3);
                const seed = new Float32Array(N * 2);
                for (let i = 0; i < N; i++) {
                    const a = Math.random() * Math.PI * 2;
                    const r = 1.5 + Math.random() * 1.1;
                    pos[i * 3] = Math.cos(a) * r;
                    pos[i * 3 + 1] = (Math.random() - 0.5) * 0.5 * r;
                    pos[i * 3 + 2] = Math.sin(a) * r;
                    seed[i * 2] = Math.random() * Math.PI * 2;
                    seed[i * 2 + 1] = 0.25 + Math.random() * 0.6;
                }
                const geo = new THREE.BufferGeometry();
                geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
                geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 2));
                const mat = new THREE.ShaderMaterial({
                    uniforms: {
                        uColor: { value: emeraldGlow },
                        uPR: { value: Math.min(window.devicePixelRatio, 2) },
                        ...dustUniforms,
                    },
                    transparent: true,
                    depthWrite: false,
                    blending: THREE.AdditiveBlending,
                    vertexShader: `
                        attribute vec2 aSeed; uniform float uTime; uniform float uPR;
                        varying float vA;
                        void main(){
                          float ang = uTime * aSeed.y * 0.18;
                          float c = cos(ang), s = sin(ang);
                          vec3 q = vec3(position.x*c - position.z*s, position.y, position.x*s + position.z*c);
                          q.y += sin(uTime*aSeed.y + aSeed.x) * 0.04;
                          vA = 0.5 + 0.5*sin(uTime*aSeed.y*1.6 + aSeed.x*5.0);
                          gl_PointSize = (1.1 + 1.5*vA) * uPR;
                          gl_Position = projectionMatrix * modelViewMatrix * vec4(q, 1.0);
                        }`,
                    fragmentShader: `
                        uniform vec3 uColor; varying float vA;
                        void main(){
                          vec2 c = gl_PointCoord - 0.5;
                          float a = (exp(-dot(c,c)*14.0) - 0.03) * vA * 0.7;
                          if (a <= 0.0) discard;
                          gl_FragColor = vec4(uColor, a);
                        }`,
                });
                const pts = new THREE.Points(geo, mat);
                pts.rotation.x = THREE.MathUtils.degToRad(12);
                coreGroup.add(pts);
                return pts;
            })();

            // Draco-compressed web assets (*.web.glb) need a DRACOLoader with the
            // decoder hosted at /draco/. Plain masters load without it. If the
            // decoder fails to attach, the load errors → CSS fallback stays.
            const gltfLoader = new GLTFLoader();
            if (/\.web\.glb$/i.test(modelPath)) {
                try {
                    const { DRACOLoader } = await import("three/addons/loaders/DRACOLoader.js");
                    dracoLoader = new DRACOLoader();
                    dracoLoader.setDecoderPath("/draco/");
                    gltfLoader.setDRACOLoader(dracoLoader);
                } catch {
                    // keep CSS fallback if the decoder module can't load
                }
            }

            gltfLoader.load(
                modelPath,
                (gltf) => {
                    if (disposed) return;
                    const root = gltf.scene;
                    const box = new THREE.Box3().setFromObject(root);
                    root.position.sub(box.getCenter(new THREE.Vector3()));
                    const size = box.getSize(new THREE.Vector3());
                    coreR = Math.max(size.x, size.y, size.z) * 0.5 || 1;
                    root.traverse((o) => {
                        if (o.isMesh && o.material) {
                            coreMat = o.material;
                            if (coreMat.emissiveMap && coreMat.emissive?.getHex() === 0x000000) {
                                coreMat.emissive.setHex(0xffffff);
                            }
                        }
                    });
                    coreGroup.add(root);
                    dust.scale.setScalar(coreR);
                    onResize();
                    ready = true;
                    host.classList.add("cn-core-scene--ready");
                    onReady?.();
                },
                undefined,
                () => {}, // load error — CSS fallback stays
            );

            // Subtle cursor lean (parallax)
            const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
            const onMove = (e) => {
                pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
                pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
            };
            window.addEventListener("pointermove", onMove, { passive: true });

            function onResize() {
                const w = host.clientWidth || 1;
                const h = host.clientHeight || 1;
                renderer.setSize(w, h);
                composer.setSize(w, h);
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                const wide = w > 760;
                camera.position.set(0, wide ? coreR * 0.12 : -coreR * 0.6, coreR * (wide ? 3.8 : 4.6));
                coreGroup.position.x = wide ? coreR * 1.3 : 0;
                camera.lookAt(coreGroup.position.x * 0.92, 0, 0);
            }
            const ro = new ResizeObserver(onResize);
            ro.observe(host);
            onResize();

            // Render only while visible
            let visible = true;
            const io = new IntersectionObserver(
                (entries) => { visible = entries[0].isIntersecting; },
                { threshold: 0.02 },
            );
            io.observe(host);

            const clock = new THREE.Clock();
            let yaw = 0;
            let statT = 0;
            let raf = 0;

            const animate = () => {
                raf = requestAnimationFrame(animate);
                const dt = Math.min(clock.getDelta(), 0.1);
                if (!visible || document.hidden || !ready) return;
                const t = clock.elapsedTime;

                if (!reduceMotion) {
                    yaw += dt * 0.1;
                    pointer.x += (pointer.tx - pointer.x) * 0.05;
                    pointer.y += (pointer.ty - pointer.y) * 0.05;
                    coreGroup.rotation.y = yaw + pointer.x * 0.16;
                    coreGroup.rotation.x = pointer.y * 0.09;
                    coreGroup.position.y = Math.sin(t * 0.6) * 0.02 * coreR;
                }
                const glow = reduceMotion ? 1.0 : 0.9 + 0.2 * Math.sin(t * 0.9);
                if (coreMat) coreMat.emissiveIntensity = glow;
                coreLight.intensity = 1.2 + 0.6 * (glow - 0.9);
                dustUniforms.uTime.value = t;

                statT += dt;
                if (statT > 0.3) {
                    onPulse?.(glow);
                    statT = 0;
                }
                composer.render();
            };
            animate();

            cleanup = () => {
                cancelAnimationFrame(raf);
                window.removeEventListener("pointermove", onMove);
                ro.disconnect();
                io.disconnect();
                dracoLoader?.dispose();
                composer.dispose?.();
                renderer.dispose();
                renderer.domElement.remove();
                scene.traverse((o) => {
                    o.geometry?.dispose?.();
                    const mats = Array.isArray(o.material) ? o.material : [o.material];
                    mats.forEach((m) => {
                        if (!m) return;
                        Object.values(m).forEach((v) => v?.isTexture && v.dispose());
                        m.dispose?.();
                    });
                });
            };
        })();

        return () => {
            disposed = true;
            cleanup();
        };
    }, [modelPath, onPulse, onReady]);

    return <div ref={hostRef} className="cn-core-scene" aria-hidden="true" />;
}

export default CinNovaCoreScene;
