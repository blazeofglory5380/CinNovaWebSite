import { useState } from "react";
import "./App.css";
import StudyNest from "./pages/StudyNest.jsx";
import PoisonGuard from "./pages/PoisonGuard.jsx";
import RealEstate from "./pages/RealEstate.jsx";
import TechMateAI from "./pages/TechMateAI.jsx";
import Kiddo from "./pages/Kiddo.jsx";
import Pricing from "./pages/Pricing.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Blog from "./pages/Blog.jsx";

const products = [
    {
        name: "StudyNest",
        category: "Education AI",
        icon: "🎓",
        description: "AI-powered studying with notes, flashcards, quizzes, study guides, and tutoring.",
        page: "studynest",
    },
    {
        name: "PoisonGuard",
        category: "Safety Technology",
        icon: "🛡️",
        description: "Poison and chemical safety tools for families, pets, and emergency guidance.",
        page: "poisonguard",
    },
    {
        name: "Kiddo",
        category: "Early Learning",
        icon: "🧸",
        description: "Interactive reading, writing, counting, ABC, and math learning for young children.",
        page: "kiddo",
    },
    {
        name: "TechMate AI",
        category: "Tech Support AI",
        icon: "💻",
        description: "AI troubleshooting assistant for devices, software, apps, and technology problems.",
        page: "techmate",
    },
    {
        name: "Cin Nova Real Estate",
        category: "Real Estate AI",
        icon: "🏡",
        description: "Property analysis, mortgage tools, cash-flow insights, and investment calculators.",
        page: "real-estate",
    },
];

function getButtonLabel(page) {
    if (page === "studynest") return "Open StudyNest";
    if (page === "poisonguard") return "Open PoisonGuard";
    if (page === "real-estate") return "Open Real Estate";
    if (page === "techmate") return "Open TechMate AI";
    if (page === "kiddo") return "Open Kiddo";
    return "Coming Soon";
}

function HomePage({ setPage }) {
    return (
        <main>
            <section className="hero">
                <div>
                    <p className="eyebrow">SOFTWARE • AI • EDUCATION • SAFETY • REAL ESTATE</p>
                    <h1>Building smarter software for everyday life.</h1>
                    <p className="hero-text">
                        Cin Nova creates apps, AI tools, educational platforms, safety products,
                        and digital resources that help people learn, work, stay safe, and make
                        smarter decisions.
                    </p>

                    <div className="hero-actions">
                        <a href="#products" className="primary-btn">Explore Products</a>
                        <button className="secondary-btn" onClick={() => setPage("pricing")}>
                            View Pricing
                        </button>
                    </div>

                    <div className="hero-stats">
                        <div><strong>5+</strong><span>Products</span></div>
                        <div><strong>4</strong><span>Industries</span></div>
                        <div><strong>1</strong><span>Mission</span></div>
                    </div>
                </div>

                <div className="hero-panel">
                    <h3>Cin Nova Ecosystem</h3>
                    {products.map((product) => (
                        <div className="ecosystem-item" key={product.name}>
                            <span>{product.icon}</span>
                            <div>
                                <strong>{product.name}</strong>
                                <p>{product.category}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="section" id="products">
                <div className="section-heading">
                    <p className="eyebrow">FEATURED PRODUCTS</p>
                    <h2>Apps and platforms under the Cin Nova brand</h2>
                    <p>
                        Cin Nova promotes your apps, supports your blog strategy, and helps build
                        an audience for future monetization.
                    </p>
                </div>

                <div className="product-grid">
                    {products.map((product) => (
                        <article className="product-card" key={product.name}>
                            <div className="product-icon">{product.icon}</div>
                            <p className="product-category">{product.category}</p>
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <button
                                onClick={() => {
                                    if (product.page !== "soon") {
                                        setPage(product.page);
                                        window.scrollTo(0, 0);
                                    } else {
                                        alert(`${product.name} page coming soon.`);
                                    }
                                }}
                            >
                                {getButtonLabel(product.page)}
                            </button>
                        </article>
                    ))}
                </div>
            </section>

            <section className="section blog-section" id="blog">
                <div className="section-heading">
                    <p className="eyebrow">BLOG &amp; MEDIA</p>
                    <h2>Articles that help promote the apps and grow traffic</h2>
                    <p>
                        The blog can support app promotion, newsletter growth, affiliate content,
                        and future ad monetization.
                    </p>
                </div>

                <div className="article-grid">
                    <article className="article-card">
                        <span>Education</span>
                        <h3>How AI Is Changing Education</h3>
                        <p>How tools like StudyNest can help students study smarter.</p>
                    </article>
                    <article className="article-card">
                        <span>Technology</span>
                        <h3>Best Productivity Tools for Students</h3>
                        <p>Helpful tools for studying, organizing, and learning faster.</p>
                    </article>
                    <article className="article-card">
                        <span>Real Estate</span>
                        <h3>The Future of Real Estate Technology</h3>
                        <p>How AI can help investors analyze properties and cash flow.</p>
                    </article>
                </div>
            </section>

            <section className="section" id="newsletter">
                <div className="newsletter-card">
                    <p className="eyebrow">JOIN THE NEWSLETTER</p>
                    <h2>Get product updates, blog posts, and launch announcements.</h2>
                    <div className="signup-form">
                        <input type="email" placeholder="Enter your email address" />
                        <button>Subscribe</button>
                    </div>
                </div>
            </section>
        </main>
    );
}

function App() {
    const [page, setPage] = useState("home");

    function goHome() {
        setPage("home");
        window.scrollTo(0, 0);
    }

    return (
        <div className="site">
            <nav className="navbar">
                <button className="brand" onClick={goHome}>
                    <span className="brand-mark">CN</span>
                    <span>Cin Nova</span>
                </button>

                <div className="nav-links">
                    <button onClick={goHome}>Home</button>
                    <a href="#products" onClick={goHome}>Products</a>
                    <button onClick={() => { setPage("blog"); window.scrollTo(0, 0); }}>
                        Blog
                    </button>
                    <button onClick={() => { setPage("pricing"); window.scrollTo(0, 0); }}>
                        Pricing
                    </button>
                    <button onClick={() => { setPage("about"); window.scrollTo(0, 0); }}>
                        About
                    </button>
                    <button onClick={() => { setPage("contact"); window.scrollTo(0, 0); }}>
                        Contact
                    </button>
                    <a href="#newsletter" onClick={goHome}>Newsletter</a>
                </div>

                <button className="nav-cta" onClick={() => { setPage("pricing"); window.scrollTo(0, 0); }}>
                    See Plans
                </button>
            </nav>

            {page === "home" && <HomePage setPage={setPage} />}

            {page === "blog" && <Blog />}

            {page === "pricing" && <Pricing />}

            {page === "about" && <About />}

            {page === "contact" && <Contact />}

            {page === "studynest" && (
                <>
                    <div className="back-bar">
                        <button onClick={goHome}>← Back to Cin Nova</button>
                    </div>
                    <StudyNest />
                </>
            )}

            {page === "poisonguard" && (
                <>
                    <div className="back-bar">
                        <button onClick={goHome}>← Back to Cin Nova</button>
                    </div>
                    <PoisonGuard />
                </>
            )}

            {page === "real-estate" && (
                <>
                    <div className="back-bar">
                        <button onClick={goHome}>← Back to Cin Nova</button>
                    </div>
                    <RealEstate />
                </>
            )}

            {page === "techmate" && (
                <>
                    <div className="back-bar">
                        <button onClick={goHome}>← Back to Cin Nova</button>
                    </div>
                    <TechMateAI />
                </>
            )}

            {page === "kiddo" && (
                <>
                    <div className="back-bar">
                        <button onClick={goHome}>← Back to Cin Nova</button>
                    </div>
                    <Kiddo />
                </>
            )}

            <footer className="footer">
                <p>© 2026 Cin Nova. All Rights Reserved.</p>
            </footer>
        </div>
    );
}

export default App;
