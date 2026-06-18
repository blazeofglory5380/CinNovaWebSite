function SponsoredDisclosure({ sponsor }) {
    return (
        <div className="sponsored-disclosure" role="note">
            <span className="sponsored-label">Sponsored</span>
            <span className="sponsored-text">
                This article is brought to you by{" "}
                <a
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="sponsored-link"
                >
                    {sponsor.name}
                </a>
                {sponsor.description ? ` — ${sponsor.description}` : ""}
            </span>
        </div>
    );
}

export default SponsoredDisclosure;
