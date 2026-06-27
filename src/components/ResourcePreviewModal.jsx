import { useEffect, useMemo, useRef } from "react";
import ResourceThumbnail from "./ResourceThumbnail.jsx";
import { formatResourceReadTime, withLibraryMeta } from "../data/resources.js";

const FOCUSABLE =
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function ResourcePreviewModal({ resource, onClose, onDownload, onOpenResource, returnFocusRef }) {
    const panelRef = useRef(null);
    const closeBtnRef = useRef(null);
    const libraryResource = useMemo(() => withLibraryMeta(resource), [resource]);

    useEffect(() => {
        const previousFocus = returnFocusRef?.current;
        closeBtnRef.current?.focus();

        function handleKeyDown(event) {
            if (event.key === "Escape") {
                event.preventDefault();
                onClose();
                return;
            }

            if (event.key !== "Tab" || !panelRef.current) return;

            const focusable = [...panelRef.current.querySelectorAll(FOCUSABLE)];
            if (!focusable.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousOverflow;
            previousFocus?.focus?.();
        };
    }, [onClose, returnFocusRef]);

    function handleBackdropClick(event) {
        if (event.target === event.currentTarget) {
            onClose();
        }
    }

    function handleDownload() {
        onClose();
        onDownload?.(resource);
    }

    function handleViewFull() {
        onClose();
        onOpenResource?.(resource);
    }

    const toc = libraryResource.tableOfContents || [];

    return (
        <div className="modal-backdrop resource-preview-backdrop" onClick={handleBackdropClick}>
            <div
                className="modal-panel resource-preview-panel"
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="resource-preview-title"
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    ref={closeBtnRef}
                    type="button"
                    className="modal-close"
                    onClick={onClose}
                    aria-label="Close preview"
                >
                    ×
                </button>

                <div className="resource-preview-layout">
                    <div className="resource-preview-cover">
                        <ResourceThumbnail resource={libraryResource} large={true} imageLoading="eager" imagePriority={true} />
                    </div>

                    <div className="resource-preview-body">
                        <p className="eyebrow">{libraryResource.category.toUpperCase()}</p>
                        <h2 id="resource-preview-title">{resource.title}</h2>
                        <p className="resource-preview-description">{resource.description}</p>

                        <dl className="resource-preview-meta">
                            <div>
                                <dt>Product</dt>
                                <dd>{resource.product}</dd>
                            </div>
                            <div>
                                <dt>Category</dt>
                                <dd>{resource.category}</dd>
                            </div>
                            <div>
                                <dt>Type</dt>
                                <dd>{libraryResource.resourceType}</dd>
                            </div>
                            <div>
                                <dt>Reading time</dt>
                                <dd>{formatResourceReadTime(resource.readTime)}</dd>
                            </div>
                            <div>
                                <dt>Difficulty</dt>
                                <dd>{libraryResource.difficulty}</dd>
                            </div>
                            <div>
                                <dt>File size</dt>
                                <dd>{libraryResource.fileSize}</dd>
                            </div>
                            <div className="resource-preview-meta-wide">
                                <dt>Last updated</dt>
                                <dd>{libraryResource.lastUpdatedLabel}</dd>
                            </div>
                        </dl>

                        {toc.length > 0 && (
                            <nav className="resource-preview-toc" aria-label="Table of contents">
                                <p className="resource-preview-toc-label">Table of contents</p>
                                <ol>
                                    {toc.map((entry) => (
                                        <li key={entry.id}>{entry.label}</li>
                                    ))}
                                </ol>
                            </nav>
                        )}

                        <div className="resource-preview-actions">
                            <button type="button" className="primary-btn" onClick={handleDownload}>
                                ↓ {resource.downloadLabel}
                            </button>
                            <button type="button" className="secondary-btn" onClick={handleViewFull}>
                                View full resource page
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResourcePreviewModal;
