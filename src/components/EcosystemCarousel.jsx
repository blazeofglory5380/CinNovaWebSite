/*
 * EcosystemCarousel — homepage-only sliding product showcase.
 *
 * Renders the same 5 ecosystem GlassCards (identical copy/images/badges/links)
 * inside a CSS-transform track: 3 visible on desktop, 2 on tablet, 1 on mobile.
 * Manual controls only (prev/next + dots) plus pointer swipe — no autoplay.
 * All styling is scoped under `.home-v2__carousel*` on the homepage.
 */
import { useEffect, useRef, useState } from "react";
import GlassCard from "./brand-dna/GlassCard.jsx";
import { normalizeProductStatus } from "../data/products.js";

function computePerView() {
    if (typeof window === "undefined") return 3;
    if (window.matchMedia("(min-width: 1001px)").matches) return 3; // desktop
    if (window.matchMedia("(min-width: 769px)").matches) return 2; // tablet
    return 1; // mobile
}

function EcosystemCarousel({ products, productDetails, openProduct }) {
    const [perView, setPerView] = useState(computePerView);
    const [index, setIndex] = useState(0);
    const drag = useRef({ startX: 0, active: false, moved: false });

    useEffect(() => {
        function onResize() {
            setPerView(computePerView());
        }
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const maxIndex = Math.max(0, products.length - perView);

    // Keep the active index valid when the visible count changes (resize).
    useEffect(() => {
        setIndex((i) => Math.min(i, maxIndex));
    }, [maxIndex]);

    const go = (i) => setIndex(Math.max(0, Math.min(maxIndex, i)));
    const prev = () => go(index - 1);
    const next = () => go(index + 1);

    const pageCount = maxIndex + 1;
    const atStart = index <= 0;
    const atEnd = index >= maxIndex;

    function onPointerDown(e) {
        drag.current = { startX: e.clientX, active: true, moved: false };
    }
    function onPointerMove(e) {
        if (!drag.current.active) return;
        if (Math.abs(e.clientX - drag.current.startX) > 8) drag.current.moved = true;
    }
    function onPointerUp(e) {
        if (!drag.current.active) return;
        const dx = e.clientX - drag.current.startX;
        drag.current.active = false;
        if (dx <= -40) next();
        else if (dx >= 40) prev();
    }
    // Suppress the card navigation click that follows a swipe gesture.
    function onClickCapture(e) {
        if (drag.current.moved) {
            e.preventDefault();
            e.stopPropagation();
            drag.current.moved = false;
        }
    }

    return (
        <div className="home-v2__carousel" style={{ "--eco-per-view": perView }}>
            <div
                className="home-v2__carousel-viewport"
                role="group"
                aria-roledescription="carousel"
                aria-label="CinNova product ecosystem"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerUp}
                onClickCapture={onClickCapture}
            >
                <div
                    className="home-v2__carousel-track"
                    style={{ transform: `translateX(-${(index * 100) / perView}%)` }}
                >
                    {products.map((product) => {
                        const status = normalizeProductStatus(product.status);
                        const audience = productDetails[product.page]?.whoFor?.[0] || product.category;
                        return (
                            <div className="home-v2__carousel-slide" key={product.name}>
                                <GlassCard
                                    className="home-v2__product-card"
                                    media={
                                        product.image ? (
                                            <img src={product.image} alt={product.imageAlt} loading="lazy" decoding="async" />
                                        ) : null
                                    }
                                    onClick={() => openProduct(product.page, product.name)}
                                    aria-label={`${product.name} — learn more`}
                                >
                                    <div className="home-v2__card-meta">
                                        <span className={`home-v2__status home-v2__status--${status.variant}`}>{status.label}</span>
                                        <span className="home-v2__cat">{product.category}</span>
                                    </div>
                                    <h3>{product.name}</h3>
                                    <p>{product.description}</p>
                                    <p className="home-v2__audience"><strong>Audience:</strong> {audience}</p>
                                    <span className="home-v2__cue">Learn More →</span>
                                </GlassCard>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="home-v2__carousel-controls">
                <button
                    type="button"
                    className="home-v2__carousel-arrow"
                    onClick={prev}
                    disabled={atStart}
                    aria-label="Previous products"
                >
                    <span aria-hidden="true">‹</span>
                </button>

                <div className="home-v2__carousel-dots" role="group" aria-label="Product slides">
                    {Array.from({ length: pageCount }).map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            className={`home-v2__carousel-dot${i === index ? " is-active" : ""}`}
                            onClick={() => go(i)}
                            aria-label={`Go to slide ${i + 1} of ${pageCount}`}
                            aria-current={i === index ? "true" : undefined}
                        />
                    ))}
                </div>

                <button
                    type="button"
                    className="home-v2__carousel-arrow"
                    onClick={next}
                    disabled={atEnd}
                    aria-label="Next products"
                >
                    <span aria-hidden="true">›</span>
                </button>
            </div>
        </div>
    );
}

export default EcosystemCarousel;
