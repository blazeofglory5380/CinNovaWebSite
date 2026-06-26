function MarketingPhoto({
    src,
    alt = "",
    className = "",
    loading = "lazy",
    fetchPriority,
    objectPosition = "50% 50%",
}) {
    if (!src) return null;

    return (
        <img
            src={src}
            alt={alt}
            className={`marketing-photo${className ? ` ${className}` : ""}`}
            loading={loading}
            decoding="async"
            fetchPriority={fetchPriority}
            style={{ objectPosition }}
        />
    );
}

export default MarketingPhoto;
