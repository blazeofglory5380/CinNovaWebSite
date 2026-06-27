function SiteFooter({ onNavigate, onGoBlog, onGoResources, onGoHome }) {
    return (
        <footer className="footer site-footer site-footer-rich">
            <div className="site-footer-brand-col">
                <button type="button" className="brand footer-brand" onClick={onGoHome}>
                    <span className="brand-mark">CN</span>
                    <span>Cin Nova</span>
                </button>
                <p className="site-footer-tagline">
                    Building practical AI products for education, family safety, technology, and real estate.
                </p>
            </div>

            <div className="site-footer-columns">
                <div className="site-footer-col">
                    <p className="site-footer-col-title">Products</p>
                    <button type="button" onClick={() => onNavigate("studynest")}>StudyNest</button>
                    <button type="button" onClick={() => onNavigate("poisonguard")}>PoisonGuard</button>
                    <button type="button" onClick={() => onNavigate("kiddo")}>Kiddo</button>
                    <button type="button" onClick={() => onNavigate("techmate")}>TechMate AI</button>
                    <button type="button" onClick={() => onNavigate("real-estate")}>CinNova Real Estate</button>
                </div>

                <div className="site-footer-col">
                    <p className="site-footer-col-title">Resources</p>
                    <button type="button" onClick={onGoBlog}>Blog</button>
                    <button type="button" onClick={onGoResources}>Library</button>
                    <button type="button" onClick={onGoResources}>Templates</button>
                    <button type="button" onClick={onGoResources}>White Papers</button>
                    <button type="button" onClick={onGoResources}>Case Studies</button>
                    <button type="button" onClick={() => onNavigate("newsletter")}>Newsletter</button>
                </div>

                <div className="site-footer-col">
                    <p className="site-footer-col-title">Business</p>
                    <button type="button" onClick={() => onNavigate("about")}>About CinNova</button>
                    <button type="button" onClick={() => onNavigate("advertise")}>Advertise with CinNova</button>
                    <button type="button" onClick={() => onNavigate("media-kit")}>Media Kit</button>
                    <button type="button" onClick={() => onNavigate("partnerships")}>Partnerships</button>
                    <button type="button" onClick={() => onNavigate("press-center")}>Press Center</button>
                    <button type="button" onClick={() => onNavigate("contact")}>Contact</button>
                </div>

                <div className="site-footer-col">
                    <p className="site-footer-col-title">Legal</p>
                    <button type="button" onClick={() => onNavigate("privacy")}>Privacy</button>
                    <button type="button" onClick={() => onNavigate("terms")}>Terms</button>
                </div>
            </div>

            <div className="footer-bottom site-footer-bottom">
                <p>© 2026 CinNova</p>
                <p>
                    Building practical AI products for education,
                    <br />
                    family safety,
                    <br />
                    technology,
                    <br />
                    and real estate.
                </p>
            </div>
        </footer>
    );
}

export default SiteFooter;
