function MarketingPhoto({ src, alt = "", className = "", loading = "lazy", fetchPriority }) {
    if (!src) return null;

    return (
        <img
            src={src}
            alt={alt}
            className={`marketing-photo${className ? ` ${className}` : ""}`}
            loading={loading}
            decoding="async"
            fetchPriority={fetchPriority}
        />
    );
}

export default MarketingPhoto;
