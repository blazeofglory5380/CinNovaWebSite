import { useEffect, useMemo, useRef } from "react";
import "./KiddoHero.css";

/*
 * KiddoHero — the animated 3D Kiddo companion hero.
 *
 * The optimized Kiddo GLB (~0.8 MB, Draco + 1K WebP) renders as the hero
 * centerpiece on a dark cinematic CinNova stage. three.js and its addons are
 * DYNAMICALLY imported inside the effect (identical to CinNovaCoreScene), so
 * the library only downloads when this hero actually mounts and a capable
 * browser is present. The Draco decoder is self-hosted at /draco/ (already
 * shipped for the Core/StudyNest heroes).
 *
 * Animation is adapted from the approved "Kiddo animated companion" sample:
 * gentle idle float + squash-and-stretch breathing, smooth cursor follow, a
 * tap/click reaction (bounce / spin / party) with star bursts, blinks, a face
 * glow pulse, and an occasional autonomous emote so Kiddo always feels alive.
 * Everything is gated behind prefers-reduced-motion, capped at a retina pixel
 * ratio, paused offscreen / when the tab is hidden, and fully disposed on
 * unmount. If three, WebGL, or the GLB fail, the CSS companion fallback stays.
 *
 * Every selector is scoped under `.kiddo-hero` (kh- prefixed) so nothing leaks
 * into the rest of the site.
 */

const MODEL_SRC = "/models/kiddo/kiddo-companion.glb";

// Deterministic pseudo-random star field so positions are stable across renders.
function makeStars(count) {
    const rand = (i, salt) => {
        const v = Math.sin(i * 91.7 + salt * 217.3) * 43758.5453;
        return v - Math.floor(v);
    };
    const out = [];
    for (let i = 0; i < count; i += 1) {
        const warm = rand(i, 5) > 0.62;
        out.push({
            left: `${(4 + rand(i, 1) * 92).toFixed(1)}%`,
            top: `${(6 + rand(i, 2) * 88).toFixed(1)}%`,
            size: `${(2 + rand(i, 3) * 3).toFixed(1)}px`,
            dur: `${(6 + rand(i, 4) * 7).toFixed(1)}s`,
            delay: `${(rand(i, 6) * 8).toFixed(1)}s`,
            bg: warm ? "rgba(251, 191, 36, 0.85)" : "rgba(34, 211, 238, 0.85)",
        });
    }
    return out;
}

function smoothScrollTo(href, reduceMotion) {
    if (!href || !href.startsWith("#")) return;
    const target = document.querySelector(href);
    if (!target) return;
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
}

function KiddoHero({
    // In-page smooth-scroll anchors — both sections live on the Kiddo route:
    // `#worlds` is the first content section, `#product-ecosystem-title` is the
    // ProductEcosystemSection rendered right after <Kiddo /> in App.jsx.
    primaryHref = "#worlds",
    secondaryHref = "#product-ecosystem-title",
    starCount = 26,
}) {
    const hostRef = useRef(null);
    const stars = useMemo(() => makeStars(starCount), [starCount]);

    useEffect(() => {
        const host = hostRef.current;
        if (!host) return undefined;

        let disposed = false;
        let cleanup = () => {};

        (async () => {
            let THREE, GLTFLoader;
            try {
                THREE = await import("three");
                ({ GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js"));
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
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.05;
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            host.appendChild(renderer.domElement);

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);

            // Soft, family-safe lighting: cool emerald/cyan ambience, warm key.
            scene.add(new THREE.HemisphereLight(0xd7fff4, 0x2a1f3a, 1.05));
            const key = new THREE.DirectionalLight(0xfff2dd, 1.7);
            key.position.set(2.5, 4, 3);
            scene.add(key);
            const rimA = new THREE.DirectionalLight(0x3fe8c0, 1.1); // emerald rim
            rimA.position.set(-3, 2, -2.5);
            scene.add(rimA);
            const rimB = new THREE.DirectionalLight(0x8fb8ff, 0.7); // cool fill
            rimB.position.set(3.5, -1, -2);
            scene.add(rimB);
            const warm = new THREE.PointLight(0xffd6a0, 0.85, 18); // warm soft-gold wrap
            warm.position.set(0, 1.5, 2.6);
            scene.add(warm);

            // Character rig — root sits at the floor so squash & stretch pivots at
            // the feet: root hops, lean looks toward the pointer, squash scales.
            const root = new THREE.Group();
            const lean = new THREE.Group();
            const squash = new THREE.Group();
            root.add(lean);
            lean.add(squash);
            scene.add(root);

            let emissives = [];
            let kiddoReady = false;

            const gltfLoader = new GLTFLoader();
            let dracoLoader = null;
            try {
                const { DRACOLoader } = await import("three/addons/loaders/DRACOLoader.js");
                dracoLoader = new DRACOLoader();
                dracoLoader.setDecoderPath("/draco/");
                gltfLoader.setDRACOLoader(dracoLoader);
            } catch {
                // The optimized GLB is Draco-compressed; without the decoder the
                // load errors below and the CSS fallback stays.
            }

            gltfLoader.load(
                MODEL_SRC,
                (gltf) => {
                    if (disposed) return;
                    const model = gltf.scene;

                    // Normalize: ~2.15 units tall, feet on the origin, centered on
                    // x/z. Kiddo is now the sole focus of the stage (the floating
                    // label cards were removed), so it fills more of the frame.
                    const box = new THREE.Box3().setFromObject(model);
                    const size = box.getSize(new THREE.Vector3());
                    model.scale.setScalar(2.15 / (size.y || 1));
                    const box2 = new THREE.Box3().setFromObject(model);
                    model.position.y -= box2.min.y;
                    model.position.x -= (box2.min.x + box2.max.x) / 2;
                    model.position.z -= (box2.min.z + box2.max.z) / 2;

                    model.traverse((o) => {
                        if (o.isMesh && o.material) {
                            o.material.envMapIntensity = 1;
                            if (o.material.emissiveMap) {
                                o.material.emissive = new THREE.Color(0xffffff);
                                emissives.push(o.material);
                            }
                        }
                    });

                    squash.add(model);
                    kiddoReady = true;
                    host.classList.add("kh-stage--ready");
                    if (!reduceMotion) play("bounce");
                },
                undefined,
                () => {}, // load error — CSS fallback stays
            );

            // Star / heart burst sprites — a magical flourish on reaction.
            const burstPool = [];
            const sTex = ["⭐", "\u{1F49B}", "✨", "\u{1F499}"].map((emoji) => {
                const c = document.createElement("canvas");
                c.width = c.height = 96;
                const g = c.getContext("2d");
                g.font = "72px serif";
                g.textAlign = "center";
                g.textBaseline = "middle";
                g.fillText(emoji, 48, 54);
                return new THREE.CanvasTexture(c);
            });
            function burst(n = 12, spread = 1) {
                if (reduceMotion) n = Math.min(n, 5);
                for (let i = 0; i < n; i += 1) {
                    const sp = new THREE.Sprite(
                        new THREE.SpriteMaterial({
                            map: sTex[(Math.random() * sTex.length) | 0],
                            transparent: true,
                            depthWrite: false,
                        }),
                    );
                    sp.position.set(root.position.x, 1.0, root.position.z);
                    sp.scale.setScalar(0.26 + Math.random() * 0.18);
                    sp.userData = {
                        v: new THREE.Vector3(
                            (Math.random() - 0.5) * 3 * spread,
                            2.3 + Math.random() * 2.1,
                            (Math.random() - 0.5) * 2 * spread,
                        ),
                        life: 1,
                    };
                    scene.add(sp);
                    burstPool.push(sp);
                }
            }

            // One-shot reaction moves layered over the idle loop.
            const pick = (a) => a[(Math.random() * a.length) | 0];
            let move = null;
            function play(name) {
                if (!kiddoReady) return;
                move = { name, t: 0, dur: name === "party" ? 2.2 : name === "spin" ? 1.1 : 0.9 };
                if (name === "bounce") burst(9);
                else if (name === "spin") burst(11);
                else burst(22, 1.6);
            }

            // Smooth pointer follow (works for mouse + touch drag).
            const look = { x: 0, y: 0, tx: 0, ty: 0 };
            const onMove = (e) => {
                look.tx = (e.clientX / window.innerWidth - 0.5) * 1.0;
                look.ty = (e.clientY / window.innerHeight - 0.5) * -0.45;
            };
            window.addEventListener("pointermove", onMove, { passive: true });

            // Tap Kiddo → random reaction.
            const ray = new THREE.Raycaster();
            const ndc = new THREE.Vector2();
            const onDown = (e) => {
                if (!kiddoReady) return;
                const rect = renderer.domElement.getBoundingClientRect();
                ndc.set(
                    ((e.clientX - rect.left) / rect.width) * 2 - 1,
                    -((e.clientY - rect.top) / rect.height) * 2 + 1,
                );
                ray.setFromCamera(ndc, camera);
                if (ray.intersectObject(squash, true).length) {
                    play(pick(["bounce", "spin", "party"]));
                }
            };
            renderer.domElement.addEventListener("pointerdown", onDown);

            function onResize() {
                const w = host.clientWidth || 1;
                const h = host.clientHeight || 1;
                renderer.setSize(w, h);
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                // Pull the camera back on narrow stages so Kiddo stays fully framed.
                const wide = w > 620;
                camera.position.set(0, 1.32, wide ? 5.4 : 6.2);
                camera.lookAt(0, 1.08, 0);
            }
            const ro = new ResizeObserver(onResize);
            ro.observe(host);
            onResize();

            let visible = true;
            const io = new IntersectionObserver(
                (entries) => {
                    visible = entries[0].isIntersecting;
                },
                { threshold: 0.02 },
            );
            io.observe(host);

            const clock = new THREE.Clock();
            let t = 0;
            let nextBlink = 2.5;
            let blinkT = -1;
            let nextEmote = 7;
            let raf = 0;
            const eased = (x) => 1 - Math.pow(1 - x, 3);

            const animate = () => {
                raf = requestAnimationFrame(animate);
                const dt = Math.min(clock.getDelta(), 0.05);
                if (!visible || document.hidden) {
                    renderer.render(scene, camera);
                    return;
                }
                t += dt;

                if (kiddoReady) {
                    const idleAmp = reduceMotion ? 0.25 : 1;
                    const bob = Math.sin(t * 2.4) * 0.045 * idleAmp;
                    let sy = 1 + Math.sin(t * 2.4) * 0.035 * idleAmp; // breathe
                    let hop = Math.max(0, bob);
                    let extraYaw = Math.sin(t * 0.7) * 0.06 * idleAmp;
                    let extraRoll = 0;

                    if (move) {
                        move.t += dt;
                        const p = Math.min(move.t / move.dur, 1);
                        if (move.name === "bounce") {
                            const h = Math.abs(Math.sin(p * Math.PI * 2)) * (1 - p * 0.4);
                            hop += h * 0.55;
                            sy *= p < 0.12 ? 1 - 0.25 * (p / 0.12) : 1 + 0.22 * h;
                        } else if (move.name === "spin") {
                            extraYaw += eased(p) * Math.PI * 2;
                            hop += Math.sin(p * Math.PI) * 0.35;
                            sy *= 1 + Math.sin(p * Math.PI) * 0.15;
                        } else {
                            const hz = 5;
                            hop += Math.abs(Math.sin(p * Math.PI * hz)) * 0.4 * (1 - p * 0.5);
                            extraRoll = Math.sin(p * Math.PI * hz * 2) * 0.18 * (1 - p);
                            extraYaw += Math.sin(p * Math.PI * 3) * 0.5;
                            sy *= 1 + Math.sin(p * Math.PI * hz * 2) * 0.1;
                            if (Math.random() < 0.07 && !reduceMotion) burst(2, 1.4);
                        }
                        if (p >= 1) move = null;
                    }

                    const followAmt = reduceMotion ? 0.3 : 1;
                    look.x += (look.tx - look.x) * Math.min(1, dt * 6);
                    look.y += (look.ty - look.y) * Math.min(1, dt * 6);
                    lean.rotation.y = look.x * 0.8 * followAmt + extraYaw;
                    lean.rotation.x = -look.y * 0.5 * followAmt;
                    lean.rotation.z = -look.x * 0.12 * followAmt + extraRoll;

                    squash.scale.set(1 / Math.sqrt(sy), sy, 1 / Math.sqrt(sy));
                    root.position.y = hop;

                    let glow = 1 + Math.sin(t * 1.6) * 0.12;
                    if (blinkT >= 0) {
                        blinkT += dt;
                        const bp = blinkT / 0.14;
                        glow *= bp < 1 ? Math.abs(bp * 2 - 1) * 0.9 + 0.1 : 1;
                        if (bp >= 1) blinkT = -1;
                    } else if (t > nextBlink) {
                        blinkT = 0;
                        nextBlink = t + 1.8 + Math.random() * 3.5;
                    }
                    emissives.forEach((m) => {
                        m.emissiveIntensity = glow;
                    });

                    if (!move && t > nextEmote && !reduceMotion) {
                        play(pick(["bounce", "spin"]));
                        nextEmote = t + 9 + Math.random() * 8;
                    } else if (move) {
                        nextEmote = t + 9 + Math.random() * 8;
                    }
                }

                for (let i = burstPool.length - 1; i >= 0; i -= 1) {
                    const sp = burstPool[i];
                    const u = sp.userData;
                    u.v.y -= 6 * dt;
                    sp.position.addScaledVector(u.v, dt);
                    u.life -= dt * 0.9;
                    sp.material.opacity = Math.max(u.life, 0);
                    sp.material.rotation += dt * 3;
                    if (u.life <= 0 || sp.position.y < -0.2) {
                        scene.remove(sp);
                        sp.material.map = null;
                        sp.material.dispose();
                        burstPool.splice(i, 1);
                    }
                }

                renderer.render(scene, camera);
            };
            animate();

            cleanup = () => {
                cancelAnimationFrame(raf);
                window.removeEventListener("pointermove", onMove);
                renderer.domElement.removeEventListener("pointerdown", onDown);
                ro.disconnect();
                io.disconnect();
                sTex.forEach((tex) => tex.dispose());
                dracoLoader?.dispose();
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

    const reduceMotion =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    return (
        <section className="kiddo-hero" aria-labelledby="kiddo-hero-title">
            {/* ambient background */}
            <div className="kh-bg" aria-hidden="true">
                <div className="kh-glow kh-glow--emerald" />
                <div className="kh-glow kh-glow--cyan" />
                <div className="kh-glow kh-glow--lavender" />
                <div className="kh-glow kh-glow--warm" />
                <div className="kh-grid" />
                <div className="kh-stars">
                    {stars.map((s, i) => (
                        <span
                            key={i}
                            className="kh-star"
                            style={{
                                left: s.left,
                                top: s.top,
                                width: s.size,
                                height: s.size,
                                background: s.bg,
                                boxShadow: `0 0 8px 1px ${s.bg}`,
                                animationDuration: s.dur,
                                animationDelay: s.delay,
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="kh-inner">
                {/* ── copy column ── */}
                <div className="kh-copy">
                    <div className="kh-eyebrow">
                        <span className="kh-eyebrow__dot" />
                        <span className="kh-eyebrow__text">Cin Nova · Kiddo</span>
                    </div>

                    <h1 id="kiddo-hero-title" className="kh-title">
                        Kiddo: A <span className="kh-title__accent">Safer AI Companion</span> for Families
                    </h1>

                    <p className="kh-lede">
                        Kiddo creates a guided AI experience for learning, creativity, stories, and
                        family-safe exploration.
                    </p>

                    <div className="kh-actions">
                        <a
                            href={primaryHref}
                            className="kh-btn kh-btn--primary"
                            onClick={(e) => {
                                if (primaryHref.startsWith("#")) {
                                    e.preventDefault();
                                    smoothScrollTo(primaryHref, reduceMotion);
                                }
                            }}
                        >
                            Explore Kiddo
                        </a>
                        <a
                            href={secondaryHref}
                            className="kh-btn kh-btn--ghost"
                            onClick={(e) => {
                                if (secondaryHref.startsWith("#")) {
                                    e.preventDefault();
                                    smoothScrollTo(secondaryHref, reduceMotion);
                                }
                            }}
                        >
                            View Product Ecosystem
                        </a>
                    </div>
                </div>

                {/* ── companion stage ── */}
                <div className="kh-scene" aria-hidden="true">
                    <div className="kh-shield" />
                    <div className="kh-platform" />
                    {/* WebGL canvas mounts here; CSS companion below is the fallback. */}
                    <div ref={hostRef} className="kh-stage">
                        <div className="kh-fallback">
                            <span className="kh-fallback__buddy">{"\u{1F31F}"}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="kh-fade-bottom" aria-hidden="true" />
        </section>
    );
}

export default KiddoHero;
