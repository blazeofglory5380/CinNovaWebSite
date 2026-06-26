function MarketingPhoto({ src, alt = "", className = "", loading = "lazy" }) {
    if (!src) return null;

    return (
        <img
            src={src}
            alt={alt}
            className={`marketing-photo${className ? ` ${className}` : ""}`}
            loading={loading}
            decoding="async"
        />
    );
}

export default MarketingPhoto;
