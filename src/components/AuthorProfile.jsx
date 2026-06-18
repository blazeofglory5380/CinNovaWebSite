import "../App.css";

function AuthorAvatar({ author }) {
    return (
        <div className="author-avatar" aria-hidden="true">
            {author.avatarInitials}
        </div>
    );
}

function AuthorProfile({ author, variant = "inline" }) {
    return (
        <div className={`author-profile author-profile-${variant}`}>
            <AuthorAvatar author={author} />
            <div>
                <p className="product-category">{author.role}</p>
                <h3>{author.name}</h3>
                <p>{author.bio}</p>
                {author.socials?.length > 0 && (
                    <div className="author-social-links">
                        {author.socials.map((social) => (
                            <a key={social.label} href={social.url}>
                                {social.label}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AuthorProfile;
