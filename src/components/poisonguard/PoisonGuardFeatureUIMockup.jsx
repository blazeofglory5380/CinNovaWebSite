function PoisonGuardFeatureUIMockup({ uiType, size = "card", alt }) {
    const isCard = size === "card";
    const rootClass = isCard
        ? `pg-feature-card-ui pg-feature-card-ui--${uiType}`
        : `pg-feature-modal-ui pg-feature-modal-ui--${uiType}`;

    const content = (() => {
        switch (uiType) {
            case "risk-gauge":
                return (
                    <>
                        <p className="pg-ui-eyebrow">Risk assessment</p>
                        <div className="pg-ui-risk-meter" aria-hidden="true">
                            <span className="pg-ui-risk-arc pg-ui-risk-arc--low">Low</span>
                            <span className="pg-ui-risk-arc pg-ui-risk-arc--med pg-ui-risk-arc--active">Medium</span>
                            <span className="pg-ui-risk-arc pg-ui-risk-arc--high">High</span>
                            <span className="pg-ui-risk-needle" />
                        </div>
                        <p className="pg-ui-caption">Lily plant · Monitor closely</p>
                    </>
                );
            case "confidence-score":
                return (
                    <>
                        <div className="pg-ui-row">
                            <span className="pg-ui-label">AI confidence</span>
                            <strong className="pg-ui-stat">98%</strong>
                        </div>
                        <div className="pg-ui-meter-track" aria-hidden="true">
                            <span className="pg-ui-meter-fill" style={{ width: "98%" }} />
                        </div>
                        <p className="pg-ui-caption">Strong match · verify if unsure</p>
                    </>
                );
            case "emergency-guidance":
                return (
                    <>
                        <p className="pg-ui-eyebrow">Poison control</p>
                        <strong className="pg-ui-hotline">1-800-222-1222</strong>
                        <span className="pg-ui-pill">Tap to call</span>
                        <ol className="pg-ui-steps">
                            <li>Stay calm</li>
                            <li>Describe exposure</li>
                            <li>Follow guidance</li>
                        </ol>
                    </>
                );
            case "scan-history":
                return (
                    <>
                        <p className="pg-ui-eyebrow">Scan history</p>
                        <ul className="pg-ui-history">
                            <li>
                                <span>Lily plant</span>
                                <small>High · Today</small>
                            </li>
                            <li>
                                <span>Cleaning spray</span>
                                <small>Low · Yesterday</small>
                            </li>
                            <li>
                                <span>Chocolate</span>
                                <small>Med · 3 days ago</small>
                            </li>
                        </ul>
                    </>
                );
            case "multilingual":
                return (
                    <>
                        <p className="pg-ui-eyebrow">Guidance language</p>
                        <div className="pg-ui-globe" aria-hidden="true" />
                        <div className="pg-ui-lang-grid" aria-hidden="true">
                            <span className="pg-ui-lang pg-ui-lang--active">English</span>
                            <span className="pg-ui-lang">Español</span>
                            <span className="pg-ui-lang">Français</span>
                        </div>
                        <p className="pg-ui-caption">Read instructions in your preferred language</p>
                    </>
                );
            case "privacy-first":
                return (
                    <>
                        <p className="pg-ui-eyebrow">Secure handling</p>
                        <div className="pg-ui-privacy-lock" aria-hidden="true" />
                        <div className="pg-ui-privacy-cloud" aria-hidden="true" />
                        <span className="pg-ui-privacy-badge">Encrypted upload</span>
                        <p className="pg-ui-caption">Minimal retention · privacy-first defaults</p>
                    </>
                );
            default:
                return null;
        }
    })();

    if (!content) return null;

    return (
        <div className={rootClass} role="img" aria-label={alt}>
            {content}
        </div>
    );
}

export default PoisonGuardFeatureUIMockup;
