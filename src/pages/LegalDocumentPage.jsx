import "../App.css";
import "./LegalCenter.css";
import SEO from "../components/SEO.jsx";
import { getPublicPageRoute, getPublicPageUrl } from "../data/publicPageRoutes.js";
import { siteUrl } from "../data/seoConfig.js";
import { buildBreadcrumbSchema, withSchemaGraph } from "../data/schemaHelpers.js";
import {
    LEGAL_CONTACT_EMAIL,
    LEGAL_EFFECTIVE_DATE,
    getLegalDocumentByPageKey,
    getLegalIndex,
} from "../data/legalCenter.js";

function buildSchema(doc, url) {
    return withSchemaGraph(
        {
            "@type": "WebPage",
            name: doc.title,
            description: doc.summary,
            url,
            isPartOf: { "@type": "WebSite", name: "CinNova", url: siteUrl },
            publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
            dateModified: LEGAL_EFFECTIVE_DATE,
        },
        buildBreadcrumbSchema([
            { name: "Home", url: siteUrl },
            { name: "Legal Center", url: getPublicPageUrl("legal") },
            { name: doc.title, url },
        ]),
    );
}

/**
 * One component renders all six /legal/* documents from the registry in
 * legalCenter.js, so a new policy is a data entry plus a route registration —
 * never a new page component that can drift in structure or metadata.
 */
function LegalDocumentPage({ pageKey, onNavigate }) {
    // The router passes the page key; the document registry lives in this chunk.
    const doc = getLegalDocumentByPageKey(pageKey);
    if (!doc) return null;

    const route = getPublicPageRoute(doc.pageKey);
    const url = getPublicPageUrl(doc.pageKey) || `${siteUrl}/legal/${doc.slug}`;
    const siblings = getLegalIndex().filter((item) => item.pageKey !== doc.pageKey);

    return (
        <main className="product-page business-center-page lg-page lg-document">
            <SEO
                title={route?.title || `${doc.title} | Cin Nova`}
                description={route?.description || doc.summary}
                url={url}
                type="website"
                schema={buildSchema(doc, url)}
            />

            <nav className="lg-breadcrumb" aria-label="Breadcrumb">
                <ol>
                    <li>
                        <a href="/" onClick={(e) => { e.preventDefault(); onNavigate?.("home"); }}>Home</a>
                    </li>
                    <li>
                        <a href="/legal" onClick={(e) => { e.preventDefault(); onNavigate?.("legal"); }}>Legal Center</a>
                    </li>
                    <li aria-current="page">{doc.title}</li>
                </ol>
            </nav>

            <article className="section lg-article" aria-labelledby="lg-doc-title">
                <header className="lg-article-head">
                    <p className="eyebrow">LEGAL</p>
                    <h1 id="lg-doc-title">{doc.title}</h1>
                    <p className="lg-summary">{doc.summary}</p>
                    <p className="lg-meta">
                        Effective <time dateTime={LEGAL_EFFECTIVE_DATE}>{LEGAL_EFFECTIVE_DATE}</time> · Questions
                        to <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>
                    </p>
                </header>

                {doc.sections.map((section) => (
                    <section className="lg-section" key={section.heading}>
                        <h2>{section.heading}</h2>
                        {(section.body || []).map((paragraph) => (
                            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                        ))}
                        {section.list?.length > 0 && (
                            <ul>
                                {section.list.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        )}
                    </section>
                ))}

                <footer className="lg-article-foot">
                    <p>
                        This document describes how CinNova operates today. It is not legal advice, and it has
                        not been reviewed by a qualified lawyer. If it is wrong, tell us and it will be
                        corrected.
                    </p>
                </footer>
            </article>

            <section className="section lg-siblings" aria-labelledby="lg-siblings-title">
                <h2 id="lg-siblings-title">Other policies</h2>
                <ul className="lg-index lg-index--compact">
                    {siblings.map((item) => (
                        <li key={item.path}>
                            <a
                                href={item.path}
                                onClick={(event) => {
                                    if (event.metaKey || event.ctrlKey || event.shiftKey) return;
                                    event.preventDefault();
                                    onNavigate?.(item.pageKey);
                                }}
                            >
                                <span className="lg-index-title">{item.title}</span>
                                <span className="lg-index-summary">{item.summary}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
}

export default LegalDocumentPage;
