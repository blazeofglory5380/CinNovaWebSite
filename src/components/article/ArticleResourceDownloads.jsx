import { useState } from "react";
import ResourceEmailGate from "../ResourceEmailGate.jsx";

function ArticleResourceDownloads({ resources = [], onSubscribe }) {
    const [gateResource, setGateResource] = useState(null);

    if (!resources.length) return null;

    return (
        <>
            <div className="article-widget article-downloads">
                <p className="article-widget-eyebrow">FREE DOWNLOADS</p>
                <h3>Turn this article into action</h3>
                <div className="article-download-list">
                    {resources.map((resource) => (
                        <button
                            key={resource.slug}
                            type="button"
                            className="article-download-card"
                            onClick={() => setGateResource(resource)}
                        >
                            <span className="article-download-format">{resource.format}</span>
                            <strong>{resource.title}</strong>
                            <p>{resource.description}</p>
                            <span className="article-download-cta">{resource.downloadLabel || "Download"} →</span>
                        </button>
                    ))}
                </div>
            </div>
            {gateResource && (
                <ResourceEmailGate
                    resource={gateResource}
                    onSubscribe={onSubscribe}
                    onClose={() => setGateResource(null)}
                />
            )}
        </>
    );
}

export default ArticleResourceDownloads;
