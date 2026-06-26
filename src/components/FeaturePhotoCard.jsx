import MarketingPhoto from "./MarketingPhoto.jsx";

function FeaturePhotoCard({ image, alt, category, title, description, children }) {
    const body = children || description;

    return (
        <article className="product-card product-card-photo">
            <div className="feature-photo-wrap">
                <MarketingPhoto src={image} alt={alt || title} className="feature-photo-img" />
            </div>
            {category && <p className="product-category">{category}</p>}
            <h3>{title}</h3>
            {body && <p>{body}</p>}
        </article>
    );
}

export default FeaturePhotoCard;
