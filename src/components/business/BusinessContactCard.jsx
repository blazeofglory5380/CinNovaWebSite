function BusinessContactCard({
    title,
    description,
    email = "thin_line_99@yahoo.com",
    ctaLabel = "Contact Cin Nova",
    onCta,
    topics = [],
}) {
    return (
        <article className="bc-contact-card">
            <p className="eyebrow">GET IN TOUCH</p>
            <h3>{title}</h3>
            <p className="bc-contact-desc">{description}</p>
            {topics.length > 0 && (
                <ul className="bc-contact-topics">
                    {topics.map((topic) => (
                        <li key={topic}>{topic}</li>
                    ))}
                </ul>
            )}
            <p className="bc-contact-email">
                Email:{" "}
                <a href={`mailto:${email}`} className="bc-email-link">
                    {email}
                </a>
            </p>
            {onCta && (
                <button type="button" className="primary-btn" onClick={onCta}>
                    {ctaLabel}
                </button>
            )}
        </article>
    );
}

export default BusinessContactCard;
