import { useState } from "react";

/**
 * Renders Kiddo concept/production artwork with a styled fallback if the file is missing.
 * Swap assets by updating src paths in src/data/kiddoAssets.js.
 */
function KiddoArtwork({
    asset,
    className = "",
    loading = "lazy",
    decoding = "async",
    placeholderLabel,
}) {
    const [failed, setFailed] = useState(false);
    const label = placeholderLabel || asset?.alt || "Kiddo artwork";

    if (!asset?.src || failed) {
        return (
            <div className={`kd-artwork-placeholder ${className}`.trim()} role="img" aria-label={label}>
                <span className="kd-artwork-placeholder-label">{label}</span>
            </div>
        );
    }

    return (
        <img
            src={asset.src}
            alt={asset.alt}
            className={className}
            loading={loading}
            decoding={decoding}
            onError={() => setFailed(true)}
        />
    );
}

export default KiddoArtwork;
