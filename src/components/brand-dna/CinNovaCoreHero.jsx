import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import "./CinNovaCoreHero.css";

/*
 * CinNovaCoreHero — cinematic AI Core hero for the CinNova blog (Brand DNA).
 *
 * - Three.js is code-split (CinNovaCoreScene is React.lazy + dynamic three
 *   imports) and only mounts in a capable browser without data-saver.
 * - A CSS emerald orb renders instantly as the fallback/loading state; the
 *   canvas fades in over it once the GLB is ready. If the GLB is missing or
 *   WebGL is unavailable, the orb simply stays (never the Earth model).
 * - Prop-driven copy/CTAs so product pages can reuse the hero. CTAs are
 *   plain callbacks (SPA nav lives in the parent) — no router coupling.
 */

const CinNovaCoreScene = lazy(() => import("./CinNovaCoreScene.jsx"));

const DEFAULT_MODEL_PATH = "/models/cinnova-core/CinNova_AI_Core_v2.web.glb";

function CinNovaCoreHero({
    eyebrow = "CinNova Research · Publication",
    titleA = "CinNova",
    titleB = "Blog",
    subtitle = "Ideas, tutorials, product stories, and AI research from the CinNova ecosystem.",
    primaryCta,
    secondaryCta,
    // Optional stats row. When provided (e.g. homepage), it replaces the default
    // CORE/SIGNAL/STATUS meta strip. Shape: [{ value, label }].
    stats = null,
    modelPath = DEFAULT_MODEL_PATH,
}) {
    const pulseRef = useRef(null);
    const [canRender3D, setCanRender3D] = useState(false);

    useEffect(() => {
        // Gate the 3D bundle: WebGL2-capable browser + no data-saver.
        const saveData = navigator.connection?.saveData;
        setCanRender3D(typeof WebGL2RenderingContext !== "undefined" && !saveData);
    }, []);

    const onPulse = useCallback((v) => {
        if (pulseRef.current) pulseRef.current.textContent = v.toFixed(2);
    }, []);

    return (
        <section className="cn-core-hero" aria-label={`${titleA} ${titleB}`}>
            <div className="cn-core-hero__visual">
                <div className="cn-core-hero__orb" aria-hidden="true" />
                {canRender3D && (
                    <Suspense fallback={null}>
                        <CinNovaCoreScene modelPath={modelPath} onPulse={onPulse} />
                    </Suspense>
                )}
            </div>
            <div className="cn-core-hero__tint" aria-hidden="true" />
            <div className="cn-core-hero__scrim" aria-hidden="true" />
            <div className="cn-core-hero__fade" aria-hidden="true" />

            <div className="cn-core-hero__wrap">
                <div className="cn-core-hero__copy">
                    <span className="bdna-eyebrow">{eyebrow}</span>
                    <h1 className="cn-core-hero__title">
                        {titleA} <b>{titleB}</b>
                    </h1>
                    <p className="cn-core-hero__sub">{subtitle}</p>

                    {(primaryCta || secondaryCta) && (
                        <div className="cn-core-hero__ctas">
                            {primaryCta && (
                                <button
                                    type="button"
                                    className="bdna-btn bdna-btn--solid"
                                    onClick={primaryCta.onClick}
                                >
                                    {primaryCta.label}
                                </button>
                            )}
                            {secondaryCta && (
                                <button
                                    type="button"
                                    className="bdna-btn bdna-btn--ghost"
                                    onClick={secondaryCta.onClick}
                                >
                                    {secondaryCta.label}
                                </button>
                            )}
                        </div>
                    )}

                    {stats && stats.length > 0 ? (
                        <dl className="cn-core-hero__stats">
                            {stats.map((stat) => (
                                <div key={stat.label} className="cn-core-hero__stat">
                                    <dt>{stat.value}</dt>
                                    <dd>{stat.label}</dd>
                                </div>
                            ))}
                        </dl>
                    ) : (
                        <div className="cn-core-hero__meta">
                            <div>CORE <b>V1.0</b></div>
                            <div>SIGNAL <b ref={pulseRef}>1.00</b></div>
                            <div>STATUS <b>ONLINE</b></div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default CinNovaCoreHero;
