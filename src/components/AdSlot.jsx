import { useState } from "react";
import { houseAds } from "../data/adCreatives.js";

function AdSlot({ placement = "sidebar", onNavigate }) {
    const [ad] = useState(() => {
        const index = placement.length % houseAds.length;
        return houseAds[index];
    });

    if (placement === "sidebar") {
        return (
            <div className="ad-slot ad-slot-sidebar" style={{ "--ad-accent": ad.accent }}>
                <p className="ad-slot-eyebrow">FROM CIN NOVA</p>
                <div className="ad-slot-icon-block">{ad.icon}</div>
                <p className="ad-slot-product">{ad.category}</p>
                <strong className="ad-slot-headline">{ad.headline}</strong>
                <p className="ad-slot-body">{ad.body}</p>
                <button
                    className="ad-slot-cta"
                    onClick={() => onNavigate?.(ad.page)}
                >
                    {ad.cta} →
                </button>
            </div>
        );
    }

    if (placement === "banner") {
        return (
            <div className="ad-slot ad-slot-banner" style={{ "--ad-accent": ad.accent }}>
                <div className="ad-slot-banner-icon">{ad.icon}</div>
                <div className="ad-slot-banner-copy">
                    <p className="ad-slot-eyebrow">FROM CIN NOVA</p>
                    <strong>{ad.headline}</strong>
                    <p>{ad.body}</p>
                </div>
                <button
                    className="ad-slot-cta ad-slot-cta-banner"
                    onClick={() => onNavigate?.(ad.page)}
                >
                    {ad.cta} →
                </button>
            </div>
        );
    }

    if (placement === "inline") {
        return (
            <div className="ad-slot ad-slot-inline" style={{ "--ad-accent": ad.accent }}>
                <div className="ad-slot-inline-left">
                    <span className="ad-slot-inline-icon">{ad.icon}</span>
                    <div>
                        <p className="ad-slot-eyebrow">FROM CIN NOVA</p>
                        <strong>{ad.headline}</strong>
                        <p>{ad.body}</p>
                    </div>
                </div>
                <button
                    className="ad-slot-cta"
                    onClick={() => onNavigate?.(ad.page)}
                >
                    {ad.cta} →
                </button>
            </div>
        );
    }

    return null;
}

export default AdSlot;
