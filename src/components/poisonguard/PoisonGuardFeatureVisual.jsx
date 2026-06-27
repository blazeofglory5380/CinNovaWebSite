function PoisonGuardFeatureVisual({ type, size = "card" }) {
    const isLarge = size === "modal";

    switch (type) {
        case "plant-recognition":
            return (
                <div className={`pg-fv pg-fv--plant${isLarge ? " pg-fv--large" : ""}`} aria-hidden="true">
                    <div className="pg-fv-scan-frame">
                        <div className="pg-fv-scan-grid" />
                        <div className="pg-fv-plant-icons">
                            <span className="pg-fv-icon pg-fv-icon--mushroom" />
                            <span className="pg-fv-icon pg-fv-icon--berry" />
                            <span className="pg-fv-icon pg-fv-icon--snake" />
                            <span className="pg-fv-icon pg-fv-icon--leaf" />
                        </div>
                        <div className="pg-fv-scan-line" />
                        <span className="pg-fv-scan-label">Scanning…</span>
                    </div>
                </div>
            );
        case "chemical-safety":
            return (
                <div className={`pg-fv pg-fv--chemical${isLarge ? " pg-fv--large" : ""}`} aria-hidden="true">
                    <div className="pg-fv-bottle pg-fv-bottle--1" />
                    <div className="pg-fv-bottle pg-fv-bottle--2" />
                    <div className="pg-fv-bottle pg-fv-bottle--3" />
                    <div className="pg-fv-spray" />
                    <span className="pg-fv-chemical-tag">Label scan</span>
                </div>
            );
        case "risk-gauge":
            return (
                <div className={`pg-fv pg-fv--gauge${isLarge ? " pg-fv--large" : ""}`} aria-hidden="true">
                    <div className="pg-fv-gauge-ring">
                        <span className="pg-fv-gauge-seg pg-fv-gauge-seg--low">Low</span>
                        <span className="pg-fv-gauge-seg pg-fv-gauge-seg--med">Med</span>
                        <span className="pg-fv-gauge-seg pg-fv-gauge-seg--high">High</span>
                        <span className="pg-fv-gauge-needle" />
                    </div>
                </div>
            );
        case "confidence-score":
            return (
                <div className={`pg-fv pg-fv--confidence${isLarge ? " pg-fv--large" : ""}`} aria-hidden="true">
                    <div className="pg-fv-confidence-head">
                        <span>AI Confidence</span>
                        <strong>98%</strong>
                    </div>
                    <div className="pg-fv-confidence-track">
                        <span className="pg-fv-confidence-fill" />
                    </div>
                    <p className="pg-fv-confidence-note">Strong match · verify if unsure</p>
                </div>
            );
        case "emergency-guidance":
            return (
                <div className={`pg-fv pg-fv--emergency${isLarge ? " pg-fv--large" : ""}`} aria-hidden="true">
                    <div className="pg-fv-phone">
                        <div className="pg-fv-phone-notch" />
                        <p className="pg-fv-phone-title">Poison Control</p>
                        <strong className="pg-fv-phone-number">1-800-222-1222</strong>
                        <span className="pg-fv-phone-cta">Tap to call</span>
                        <ol className="pg-fv-phone-steps">
                            <li>Stay calm</li>
                            <li>Describe exposure</li>
                            <li>Follow guidance</li>
                        </ol>
                    </div>
                </div>
            );
        case "scan-history":
            return (
                <div className={`pg-fv pg-fv--history${isLarge ? " pg-fv--large" : ""}`} aria-hidden="true">
                    <ul className="pg-fv-timeline">
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
                </div>
            );
        case "multilingual":
            return (
                <div className={`pg-fv pg-fv--multilingual${isLarge ? " pg-fv--large" : ""}`} aria-hidden="true">
                    <div className="pg-fv-globe" />
                    <span className="pg-fv-lang pg-fv-lang--en">English</span>
                    <span className="pg-fv-lang pg-fv-lang--es">Español</span>
                    <span className="pg-fv-lang pg-fv-lang--fr">Français</span>
                </div>
            );
        case "privacy-first":
            return (
                <div className={`pg-fv pg-fv--privacy${isLarge ? " pg-fv--large" : ""}`} aria-hidden="true">
                    <div className="pg-fv-cloud" />
                    <div className="pg-fv-lock" />
                    <div className="pg-fv-upload">
                        <span>Encrypted upload</span>
                    </div>
                </div>
            );
        default:
            return null;
    }
}

export default PoisonGuardFeatureVisual;
