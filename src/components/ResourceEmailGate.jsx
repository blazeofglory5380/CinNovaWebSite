import { useState } from "react";
import { downloadResource } from "../data/resources.js";

function ResourceEmailGate({ resource, onSubscribe, onClose }) {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); // idle | loading | success | error

    function handleSubmit(e) {
        e.preventDefault();
        if (!email.trim() || !email.includes("@")) {
            setStatus("error");
            return;
        }
        setStatus("loading");
        onSubscribe?.({
            email,
            source: `Resource: ${resource.title}`,
            tags: [resource.category, resource.product, "Resource Download"],
        });
        downloadResource(resource);
        setStatus("success");
    }

    return (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-panel resource-gate-panel">
                <button className="modal-close" onClick={onClose} aria-label="Close">×</button>

                {status === "success" ? (
                    <div className="resource-gate-success">
                        <div className="resource-gate-success-icon">✓</div>
                        <p className="eyebrow">DOWNLOADING NOW</p>
                        <h2>{resource.title}</h2>
                        <p>
                            Your download has started. Check your downloads folder for{" "}
                            <strong>cin-nova-{resource.slug}.txt</strong>
                        </p>
                        <p className="resource-gate-welcome">
                            You're now subscribed to the Cin Nova newsletter — expect useful guides
                            and product updates in your inbox.
                        </p>
                        <button className="primary-btn" onClick={onClose}>
                            Done
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="resource-gate-header">
                            <div className="resource-gate-meta">
                                <span className="resource-gate-format">{resource.format}</span>
                                <span className="resource-gate-product">{resource.product}</span>
                            </div>
                            <p className="eyebrow">FREE DOWNLOAD</p>
                            <h2>{resource.title}</h2>
                            <p className="resource-gate-desc">{resource.description}</p>
                        </div>

                        <form className="resource-gate-form" onSubmit={handleSubmit} noValidate>
                            <label htmlFor="rg-email">
                                Enter your email to get instant access
                            </label>
                            <div className="resource-gate-input-row">
                                <input
                                    id="rg-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setStatus("idle");
                                    }}
                                    placeholder="you@example.com"
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    className="primary-btn"
                                    disabled={status === "loading"}
                                >
                                    {status === "loading" ? "Starting…" : "↓ Download Free"}
                                </button>
                            </div>
                            {status === "error" && (
                                <p className="resource-gate-error">Please enter a valid email address.</p>
                            )}
                            <p className="resource-gate-note">
                                Free download · Subscribes you to the Cin Nova newsletter · Unsubscribe anytime
                            </p>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default ResourceEmailGate;
