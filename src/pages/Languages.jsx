// Languages — /?page=languages   CSS prefix: lang-
// Lightweight multilingual welcome. All content is static and local — no
// external translation APIs, scripts, or widgets. Only the sections below are
// translated; the rest of the site remains in English for now.
import "../App.css";
import "./Languages.css";
import SEO from "../components/SEO.jsx";
import { siteUrl } from "../data/blogPosts.js";
import { trackLanguageSectionClick, trackLanguageInternalLinkClick } from "../utils/analytics.js";

const PAGE_URL = `${siteUrl}/?page=languages`;

// key -> { href, destPage } so link clicks can report a stable destination_page.
const LINKS = {
    tutorials:  { href: "/?page=ai-tutorials",                    dest: "ai-tutorials" },
    products:   { href: "/products",                              dest: "products" },
    calculator: { href: "/?page=free-rental-property-calculator", dest: "free-rental-property-calculator" },
    realEstate: { href: "/products/real-estate",                  dest: "real-estate" },
    blog:       { href: "/blog",                                  dest: "blog" },
};
const LINK_ORDER = ["tutorials", "products", "calculator", "realEstate", "blog"];

// Language cards (no flags — languages aren't tied to a single country).
const CARDS = [
    { code: "en", label: "English", anchor: "#english" },
    { code: "es", label: "Español", anchor: "#espanol" },
    { code: "fr", label: "Français", anchor: "#francais" },
    { code: "de", label: "Deutsch", anchor: "#deutsch" },
];

// Localized link labels + the "starting point" note for each language.
const SECTIONS = [
    {
        id: "espanol",
        heading: "Bienvenido a CinNova",
        intro:
            "CinNova crea herramientas de IA prácticas y educación sobre IA fácil de entender para personas de todo el mundo. CinNova es independiente y no está afiliada a ninguna empresa de IA.",
        points: [
            "CinNova desarrolla productos de IA prácticos y útiles.",
            "Puedes explorar tutoriales de IA paso a paso para principiantes.",
            "Puedes probar la Calculadora gratuita de Puntuación de Propiedades de Alquiler.",
            "Puedes conocer CinNova Real Estate AI, nuestras herramientas de inversión inmobiliaria.",
        ],
        linkLabels: {
            tutorials: "Tutoriales de IA",
            products: "Productos",
            calculator: "Calculadora de alquiler gratuita",
            realEstate: "IA para bienes raíces",
            blog: "Blog",
        },
        promptGuide: { href: "/?page=ai-prompt-writing-guide-es", dest: "ai-prompt-writing-guide-es", label: "Nuevo: Guía para escribir mejores prompts de IA" },
        researchGuide: { href: "/?page=ai-research-guide-es", dest: "ai-research-guide-es", label: "Nuevo: Guía para usar la IA en la investigación" },
        codingGuide: { href: "/?page=ai-coding-guide-es", dest: "ai-coding-guide-es", label: "Nuevo: Guía para usar la IA en la programación" },
        note: "Esta sección en tu idioma es un punto de partida. Próximamente habrá más páginas traducidas.",
    },
    {
        id: "francais",
        heading: "Bienvenue chez CinNova",
        intro:
            "CinNova conçoit des outils d'IA pratiques et une formation à l'IA accessible aux débutants, pour les personnes du monde entier. CinNova est indépendante et n'est affiliée à aucune entreprise d'IA.",
        points: [
            "CinNova crée des produits d'IA pratiques et utiles.",
            "Vous pouvez explorer des tutoriels d'IA pas à pas pour débutants.",
            "Vous pouvez essayer la Calculatrice gratuite de score de propriété locative.",
            "Vous pouvez découvrir CinNova Real Estate AI, nos outils d'investissement immobilier.",
        ],
        linkLabels: {
            tutorials: "Tutoriels d'IA",
            products: "Produits",
            calculator: "Calculatrice locative gratuite",
            realEstate: "IA pour l'immobilier",
            blog: "Blog",
        },
        promptGuide: { href: "/?page=ai-prompt-writing-guide-fr", dest: "ai-prompt-writing-guide-fr", label: "Nouveau : Guide pour écrire de meilleurs prompts IA" },
        researchGuide: { href: "/?page=ai-research-guide-fr", dest: "ai-research-guide-fr", label: "Nouveau : Guide pour utiliser l'IA dans la recherche" },
        codingGuide: { href: "/?page=ai-coding-guide-fr", dest: "ai-coding-guide-fr", label: "Nouveau : Guide pour utiliser l'IA en programmation" },
        note: "Cette section dans votre langue est un point de départ. D'autres pages traduites arrivent bientôt.",
    },
    {
        id: "deutsch",
        heading: "Willkommen bei CinNova",
        intro:
            "CinNova entwickelt praktische KI-Tools und anfängerfreundliche KI-Bildung für Menschen auf der ganzen Welt. CinNova ist unabhängig und mit keinem KI-Unternehmen verbunden.",
        points: [
            "CinNova entwickelt praktische, nützliche KI-Produkte.",
            "Sie können Schritt-für-Schritt-KI-Tutorials für Anfänger erkunden.",
            "Sie können den kostenlosen Rechner für Mietobjekt-Bewertungen ausprobieren.",
            "Sie können CinNova Real Estate AI, unsere Immobilien-Tools, kennenlernen.",
        ],
        linkLabels: {
            tutorials: "KI-Tutorials",
            products: "Produkte",
            calculator: "Kostenloser Mietrechner",
            realEstate: "KI für Immobilien",
            blog: "Blog",
        },
        promptGuide: { href: "/?page=ai-prompt-writing-guide-de", dest: "ai-prompt-writing-guide-de", label: "Neu: Bessere KI-Prompts schreiben" },
        researchGuide: { href: "/?page=ai-research-guide-de", dest: "ai-research-guide-de", label: "Neu: KI für die Recherche nutzen" },
        codingGuide: { href: "/?page=ai-coding-guide-de", dest: "ai-coding-guide-de", label: "Neu: KI zum Programmieren nutzen" },
        note: "Dieser Abschnitt in Ihrer Sprache ist ein Ausgangspunkt. Weitere übersetzte Seiten folgen bald.",
    },
];

function LinkRow({ labels, language }) {
    return (
        <div className="lang-links">
            {LINK_ORDER.map((k) => (
                <a
                    key={k}
                    className="lang-link"
                    href={LINKS[k].href}
                    onClick={() => trackLanguageInternalLinkClick({ language, destinationPage: LINKS[k].dest })}
                >
                    {labels[k]} →
                </a>
            ))}
        </div>
    );
}

export default function Languages() {
    return (
        <div className="product-page lang-page">
            <SEO
                title="Choose Your Language | CinNova AI Tools and Tutorials"
                description="Choose a language to learn about CinNova, practical AI products, AI tutorials, and free tools for visitors around the world. Spanish, French, and German starter sections available."
                url={PAGE_URL}
                type="website"
            />

            {/* Hero */}
            <section className="section lang-hero">
                <p className="eyebrow">LANGUAGES · IDIOMAS · LANGUES · SPRACHEN</p>
                <h1>Choose Your Language</h1>
                <p className="lang-sub">
                    CinNova is building practical AI tools and beginner-friendly AI education for people
                    around the world. Start here in your preferred language.
                </p>
                <div className="lang-cards">
                    {CARDS.map((c) => (
                        <a
                            className="lang-card"
                            href={c.anchor}
                            key={c.code}
                            lang={c.code}
                            onClick={() => trackLanguageSectionClick({ language: c.label })}
                        >
                            {c.label}
                        </a>
                    ))}
                </div>
            </section>

            {/* English */}
            <section className="section lang-section" id="english">
                <h2>Welcome to CinNova</h2>
                <p className="lang-intro">
                    CinNova builds practical AI tools and beginner-friendly AI education for people around
                    the world. CinNova is independent and not affiliated with any AI company.
                </p>
                <ul className="lang-list">
                    <li>CinNova builds practical, useful AI products.</li>
                    <li>You can explore beginner-friendly, step-by-step AI tutorials.</li>
                    <li>You can try the free Rental Property Score Calculator.</li>
                    <li>You can explore CinNova Real Estate AI, our real estate investment tools.</li>
                </ul>
                <p className="lang-featured">
                    <a
                        className="lang-featured-link"
                        href="/?page=ai-prompt-writing-guide"
                        onClick={() => trackLanguageInternalLinkClick({ language: "English", destinationPage: "ai-prompt-writing-guide" })}
                    >
                        New: How to Write Better AI Prompts →
                    </a>
                </p>
                <p className="lang-featured">
                    <a
                        className="lang-featured-link"
                        href="/?page=ai-research-guide"
                        onClick={() => trackLanguageInternalLinkClick({ language: "English", destinationPage: "ai-research-guide" })}
                    >
                        New: How to Use AI for Research →
                    </a>
                </p>
                <p className="lang-featured">
                    <a
                        className="lang-featured-link"
                        href="/?page=ai-coding-guide"
                        onClick={() => trackLanguageInternalLinkClick({ language: "English", destinationPage: "ai-coding-guide" })}
                    >
                        New: How to Use AI for Coding →
                    </a>
                </p>
                <LinkRow language="English" labels={{ tutorials: "AI Tutorials", products: "Products", calculator: "Free Rental Calculator", realEstate: "Real Estate AI", blog: "Blog" }} />
                <p className="lang-note">This section is a starting point. More translated pages are coming.</p>
            </section>

            {/* Translated sections */}
            {SECTIONS.map((s) => (
                <section className="section lang-section" id={s.id} key={s.id} lang={s.id === "espanol" ? "es" : s.id === "francais" ? "fr" : "de"}>
                    <h2>{s.heading}</h2>
                    <p className="lang-intro">{s.intro}</p>
                    <ul className="lang-list">
                        {s.points.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                    {s.promptGuide && (
                        <p className="lang-featured">
                            <a
                                className="lang-featured-link"
                                href={s.promptGuide.href}
                                onClick={() => trackLanguageInternalLinkClick({ language: s.id === "espanol" ? "Español" : s.id === "francais" ? "Français" : "Deutsch", destinationPage: s.promptGuide.dest })}
                            >
                                {s.promptGuide.label} →
                            </a>
                        </p>
                    )}
                    {s.researchGuide && (
                        <p className="lang-featured">
                            <a
                                className="lang-featured-link"
                                href={s.researchGuide.href}
                                onClick={() => trackLanguageInternalLinkClick({ language: s.id === "espanol" ? "Español" : s.id === "francais" ? "Français" : "Deutsch", destinationPage: s.researchGuide.dest })}
                            >
                                {s.researchGuide.label} →
                            </a>
                        </p>
                    )}
                    {s.codingGuide && (
                        <p className="lang-featured">
                            <a
                                className="lang-featured-link"
                                href={s.codingGuide.href}
                                onClick={() => trackLanguageInternalLinkClick({ language: s.id === "espanol" ? "Español" : s.id === "francais" ? "Français" : "Deutsch", destinationPage: s.codingGuide.dest })}
                            >
                                {s.codingGuide.label} →
                            </a>
                        </p>
                    )}
                    <LinkRow language={s.id === "espanol" ? "Español" : s.id === "francais" ? "Français" : "Deutsch"} labels={s.linkLabels} />
                    <p className="lang-note">{s.note}</p>
                </section>
            ))}
        </div>
    );
}
