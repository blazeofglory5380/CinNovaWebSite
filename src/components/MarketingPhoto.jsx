function MarketingPhoto({
    src,
    alt = "",
    className = "",
    loading = "lazy",
    fetchPriority,
    width,
    height,
    objectPosition = "50% 50%",
    onError,
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
            width={width}
            height={height}
            style={{ objectPosition }}
            onError={onError}
        />
    );
}

export default MarketingPhoto;
