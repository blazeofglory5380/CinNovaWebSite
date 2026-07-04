import { useEffect, useRef } from "react";
import "./PoisonGuardHero.css";

/*
 * PoisonGuardHero — full-width cinematic AI hazard-scanning hero.
 *
 * The optimized poisonous-spider GLB floats directly inside the hero
 * background (no card/box): a boxless scan stage with AI radar/ground scan
 * rings, an emerald/cyan shield glow, a scan line, soft particles, and subtle
 * orange hazard accents plus a "Poisonous Spider / 1 hazard flagged" callout.
 * The copy column (headline + subheadline + CTAs) stays on the left.
 *
 * three.js + addons are DYNAMICALLY imported inside the effect (same pattern as
 * CinNovaCoreScene / KiddoHero) so the library only downloads when this hero
 * mounts and a capable browser is present. The Draco decoder is self-hosted at
 * /draco/. Capped pixel ratio, fully disposed on unmount. If three, WebGL, or
 * the GLB fail, no spider is shown — only the cinematic scan environment (there
 * is deliberately no creature/emoji/image placeholder that could flash first).
 *
 * The spider material is fully metallic PBR, so a PMREM RoomEnvironment map is
 * required — without a reflected environment the metal shows no baked detail
 * and reads as a flat purple silhouette. With the env map it renders as the
 * intended black/charcoal body with cyan emissive markings.
 *
 * The spider is a STATIC scanned specimen: rendered once (on load and on
 * resize) in a fixed display pose — no animation loop, no bob/breathe/sway/
 * cursor-follow. All motion lives in the surrounding scan environment (CSS):
 * pulsing radar/ground rings, a sweeping scan line, a soft orange hazard pulse,
 * drifting particles, and a softly glowing callout. Scoped under
 * `.poison-guard-hero`.
 */

const MODEL_SRC = "/models/poisonguard/poisonguard-spider.glb";

// Fixed particle field, kept to the right (scene) half so none land under the
// copy column and read as an accidental stray dot.
const PARTICLES = [
    { left: "58%", top: "62%", size: 4, dur: 9, delay: 0, blue: false },
    { left: "66%", top: "80%", size: 3, dur: 11, delay: 2, blue: true },
    { left: "74%", top: "70%", size: 4, dur: 10, delay: 4, blue: false },
    { left: "55%", top: "84%", size: 3, dur: 12, delay: 1, blue: true },
    { left: "68%", top: "40%", size: 5, dur: 9.5, delay: 3, blue: false },
    { left: "80%", top: "78%", size: 3, dur: 11.5, delay: 5, blue: true },
    { left: "90%", top: "56%", size: 4, dur: 10.5, delay: 2.5, blue: false },
    { left: "84%", top: "88%", size: 4, dur: 13, delay: 6, blue: true },
    { left: "62%", top: "30%", size: 3, dur: 12.5, delay: 4.5, blue: false },
    { left: "78%", top: "24%", size: 3, dur: 11, delay: 1.5, blue: true },
];

function PoisonGuardHero({
    scanSpeed = 8,
    headingLevel = "h2",
    primaryHref = "#features",
    secondaryHref = "#product-ecosystem-title",
}) {
    const Heading = headingLevel;
    const hostRef = useRef(null);

    useEffect(() => {
        const host = hostRef.current;
        if (!host) return undefined;

        let disposed = false;
        let cleanup = () => {};

        (async () => {
            let THREE, GLTFLoader, RoomEnvironment;
            try {
                THREE = await import("three");
                ({ GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js"));
                ({ RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js"));
            } catch {
                return; // keep CSS fallback
            }
            if (disposed) return;

            let renderer;
            try {
                // The spider is a static scanned specimen — we render on load and
                // on resize only (no animation loop), so preserve the drawing
                // buffer to keep the frame on screen between renders.
                renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
            } catch {
                return; // no WebGL — keep CSS fallback
            }
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.08;
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            host.appendChild(renderer.domElement);

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);

            // The spider material is fully metallic (metalness = 1). A metal
            // surface shows its reflected ENVIRONMENT — without one the baked
            // charcoal detail is invisible and the body only picks up the
            // colored lights (reading as a flat purple silhouette). A neutral
            // PMREM studio environment makes the charcoal/cyan detail appear.
            const pmrem = new THREE.PMREMGenerator(renderer);
            const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
            scene.environment = envTex;
            if ("environmentIntensity" in scene) scene.environmentIntensity = 0.7;
            pmrem.dispose();

            // Dark scan/radar key + accents layered over the environment: neutral
            // key, a subtle emerald rim sheen, and a warm orange hazard accent.
            const key = new THREE.DirectionalLight(0xf2fbff, 1.5);
            key.position.set(2.5, 4, 3);
            scene.add(key);
            const rim = new THREE.DirectionalLight(0x3fe8c0, 0.9); // emerald rim sheen
            rim.position.set(-3.5, 1.5, -2.5);
            scene.add(rim);
            const warn = new THREE.PointLight(0xff7a4a, 0.8, 24); // orange hazard accent
            warn.position.set(2, -1.2, 3.5);
            scene.add(warn);

            const root = new THREE.Group();
            const lean = new THREE.Group();
            root.add(lean);
            scene.add(root);

            let modelRadius = 1;

            const gltfLoader = new GLTFLoader();
            let dracoLoader = null;
            try {
                const { DRACOLoader } = await import("three/addons/loaders/DRACOLoader.js");
                dracoLoader = new DRACOLoader();
                dracoLoader.setDecoderPath("/draco/");
                gltfLoader.setDRACOLoader(dracoLoader);
            } catch {
                // Optimized web GLB may be Draco-compressed; without the decoder
                // the load errors below and the CSS fallback stays.
            }

            gltfLoader.load(
                MODEL_SRC,
                (gltf) => {
                    if (disposed) return;
                    const model = gltf.scene;

                    const box = new THREE.Box3().setFromObject(model);
                    const sphere = box.getBoundingSphere(new THREE.Sphere());
                    model.position.sub(sphere.center);
                    modelRadius = sphere.radius || 1;

                    model.traverse((o) => {
                        if (o.isMesh && o.material) {
                            // Stronger env reflections reveal the charcoal metal;
                            // keep the emissive markings at full intensity.
                            o.material.envMapIntensity = 1.4;
                            if (o.material.emissiveMap) {
                                o.material.emissive = new THREE.Color(0xffffff);
                                o.material.emissiveIntensity = 1.15;
                            }
                            o.material.needsUpdate = true;
                        }
                    });

                    lean.add(model);
                    // Fixed display pose — a calm, slightly-turned scanned
                    // specimen. The spider itself does not animate; only the
                    // surrounding scan environment (CSS) moves.
                    root.rotation.y = 0.16;
                    lean.rotation.x = 0.05;
                    // Frame + render the correct spider into the buffer FIRST
                    // (stage still opacity 0), then flip `ready` to crossfade in a
                    // frame that is already fully framed — never a partial pop-in.
                    onResize();
                    host.classList.add("pgh-stage--ready");
                },
                undefined,
                () => {}, // load error — CSS fallback stays
            );

            const render = () => renderer.render(scene, camera);

            function onResize() {
                const w = host.clientWidth || 1;
                const h = host.clientHeight || 1;
                renderer.setSize(w, h);
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                // Fit the bounding sphere on BOTH axes so the spider never crops
                // on tall/narrow stages; a small factor keeps it large in frame.
                const wide = w > 620;
                const fit = wide ? 0.86 : 1.12;
                const vFov = (camera.fov * Math.PI) / 180;
                const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
                const dist = Math.max(
                    modelRadius / Math.sin(vFov / 2),
                    modelRadius / Math.sin(hFov / 2),
                ) * fit;
                camera.position.set(0, modelRadius * 0.5, dist);
                camera.lookAt(0, 0, 0);
                render();
            }
            const ro = new ResizeObserver(onResize);
            ro.observe(host);
            onResize();

            // Re-render if the tab returns to the foreground (some browsers can
            // drop the composited frame). No continuous animation loop runs.
            const onVisible = () => {
                if (!document.hidden) render();
            };
            document.addEventListener("visibilitychange", onVisible);

            cleanup = () => {
                document.removeEventListener("visibilitychange", onVisible);
                ro.disconnect();
                dracoLoader?.dispose();
                envTex?.dispose();
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
    }, []);

    return (
        <section className="poison-guard-hero pgh--hazard">
            <div className="pgh-glow pgh-glow--a" aria-hidden="true" />
            <div className="pgh-glow pgh-glow--b" aria-hidden="true" />
            {PARTICLES.map((p, i) => (
                <span
                    key={i}
                    className="pgh-particle"
                    aria-hidden="true"
                    style={{
                        left: p.left,
                        top: p.top,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        background: p.blue ? "rgba(77,159,255,0.7)" : "rgba(52,211,153,0.7)",
                        animationDuration: `${p.dur}s`,
                        animationDelay: `${p.delay}s`,
                    }}
                />
            ))}

            {/* full-width scrim so the spider blends into the background and the
                copy stays legible (spans the whole hero → no vertical seam) */}
            <div className="pgh-scrim" aria-hidden="true" />

            {/* ── Boxless spider scan scene, blended into the hero background ── */}
            <div className="pgh-scene" aria-hidden="true">
                <div className="pgh-radar">
                    <span className="pgh-radar__glow" />
                    <span className="pgh-floor-ring pgh-floor-ring--1" />
                    <span className="pgh-floor-ring pgh-floor-ring--2" />
                    <span className="pgh-floor-ring pgh-floor-ring--3" />
                </div>

                {/* soft orange hazard pulse */}
                <span className="pgh-warn-ring pgh-warn-ring--1" />
                <span className="pgh-warn-ring pgh-warn-ring--2" />

                {/* WebGL spider canvas mounts here. It starts hidden (opacity 0)
                    and fades in only once the GLB has loaded AND been framed
                    (host gains `pgh-stage--ready`) — so no unframed/placeholder
                    spider ever flashes. No creature/emoji/image fallback. */}
                <div ref={hostRef} className="pgh-stage" />

                {/* "AI scan initializing" glow shown only while the GLB loads;
                    it fades out once the stage is ready. */}
                <span className="pgh-init" />

                <div className="pgh-scan" style={{ animationDuration: `${scanSpeed}s` }} />

                <div className="pgh-label pgh-label--scan">
                    <span className="pgh-label__dot" />
                    <span className="pgh-label__text">AI Risk Scan</span>
                </div>

                <div className="pgh-callout">
                    <svg className="pgh-callout__icon" viewBox="0 0 24 24">
                        <path d="M12 3.2 22 20.5 H2 Z" />
                        <line x1="12" y1="10" x2="12" y2="15" />
                        <circle cx="12" cy="17.8" r="0.9" />
                    </svg>
                    <span className="pgh-callout__text">
                        <strong>Poisonous Spider</strong>
                        <span className="pgh-callout__sub">
                            <span className="pgh-callout__dot" />
                            1 hazard flagged
                        </span>
                    </span>
                </div>
            </div>

            {/* ── Copy column ── */}
            <div className="pgh-inner">
                <div className="pgh-copy">
                    <div className="pgh-eyebrow">
                        <span className="pgh-eyebrow__dot" />
                        <span className="pgh-eyebrow__text">CinNova · Poison Guard</span>
                    </div>

                    <Heading className="pgh-title">
                        Poison Guard: AI Detection for Poison Risks
                    </Heading>

                    <p className="pgh-lede">
                        Poison Guard helps identify poisonous animals, toxic plants, and
                        hazardous chemicals using AI-powered visual risk detection.
                    </p>

                    <div className="pgh-actions">
                        <a href={primaryHref} className="pgh-btn pgh-btn--primary">
                            Explore Poison Guard
                        </a>
                        <a href={secondaryHref} className="pgh-btn pgh-btn--ghost">
                            View Product Ecosystem
                        </a>
                    </div>

                    <div className="pgh-tags">
                        <span className="pgh-tag">
                            <span className="pgh-tag__dot" style={{ background: "#34D399" }} />
                            Real-time risk scanning
                        </span>
                        <span className="pgh-tag">
                            <span className="pgh-tag__dot" style={{ background: "#4D9FFF" }} />
                            Animals, plants & chemicals
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default PoisonGuardHero;
