import { useMemo, useState } from "react";
import "../App.css";
import {
    buildProviderPayload,
    clearSubscribers,
    deleteSubscriber,
    exportSubscribersCsv,
    exportSubscribersJson,
    getSubscriberStats,
    getSubscribers,
    newsletterProviderConfig,
    saveSubscriber,
} from "../data/newsletterService.js";

function downloadFile(filename, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

function NewsletterAdmin() {
    const [subscribers, setSubscribers] = useState(getSubscribers());
    const [email, setEmail] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const stats = getSubscriberStats();

    const filteredSubscribers = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();
        if (!normalizedSearch) return subscribers;

        return subscribers.filter((subscriber) =>
            [subscriber.email, subscriber.source, ...(subscriber.tags || [])]
                .join(" ")
                .toLowerCase()
                .includes(normalizedSearch),
        );
    }, [searchTerm, subscribers]);

    const providerPreview = subscribers[0]
        ? buildProviderPayload(subscribers[0], "mailchimp")
        : buildProviderPayload(
              {
                  email: "reader@example.com",
                  source: "Website",
                  tags: ["Cin Nova"],
                  status: "subscribed",
                  createdAt: new Date().toISOString(),
              },
              "mailchimp",
          );

    function refreshSubscribers() {
        setSubscribers(getSubscribers());
    }

    function handleManualAdd(event) {
        event.preventDefault();
        const result = saveSubscriber({
            email,
            source: "Newsletter Admin",
            tags: ["Manual Add"],
        });

        setEmail("");
        refreshSubscribers();
        setStatusMessage(
            result.status === "existing"
                ? "Subscriber already exists. Their record was updated."
                : "Subscriber added and ready to sync.",
        );
    }

    function handleExportCsv() {
        downloadFile("cin-nova-subscribers.csv", exportSubscribersCsv(subscribers), "text/csv");
    }

    function handleExportJson() {
        downloadFile(
            "cin-nova-subscribers.json",
            exportSubscribersJson(subscribers),
            "application/json",
        );
    }

    function handleDelete(id) {
        deleteSubscriber(id);
        refreshSubscribers();
        setStatusMessage("Subscriber removed.");
    }

    function handleClear() {
        if (!window.confirm("Clear all local newsletter subscribers?")) return;
        clearSubscribers();
        refreshSubscribers();
        setStatusMessage("Local subscriber list cleared.");
    }

    return (
        <main className="product-page newsletter-admin-page">
            <section className="section">
                <div className="section-heading">
                    <p className="eyebrow">NEWSLETTER ADMIN</p>
                    <h2>Newsletter dashboard</h2>
                    <p>
                        Manage signups, export your audience, and prepare subscriber data for
                        Mailchimp or ConvertKit integration.
                    </p>
                </div>

                <div className="newsletter-admin-grid">
                    <article className="newsletter-stat-card">
                        <span>Total Subscribers</span>
                        <strong>{stats.total}</strong>
                    </article>
                    <article className="newsletter-stat-card">
                        <span>Active</span>
                        <strong>{stats.active}</strong>
                    </article>
                    <article className="newsletter-stat-card">
                        <span>Added Today</span>
                        <strong>{stats.addedToday}</strong>
                    </article>
                    <article className="newsletter-stat-card">
                        <span>Ready To Sync</span>
                        <strong>{stats.readyToSync}</strong>
                    </article>
                </div>
            </section>

            <section className="section showcase-section">
                <div className="newsletter-dashboard-layout">
                    <div className="newsletter-panel">
                        <p className="eyebrow">ADD SUBSCRIBER</p>
                        <h3>Manual signup</h3>
                        <form className="newsletter-admin-form" onSubmit={handleManualAdd}>
                            <input
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="subscriber@example.com"
                                required
                            />
                            <button type="submit">Add Subscriber</button>
                        </form>
                        {statusMessage && <p className="newsletter-success">{statusMessage}</p>}
                    </div>

                    <div className="newsletter-panel">
                        <p className="eyebrow">EXPORT LIST</p>
                        <h3>Subscriber exports</h3>
                        <p>
                            Download your audience as CSV for spreadsheets or JSON for migration
                            into a backend, Mailchimp, ConvertKit, or another CRM.
                        </p>
                        <div className="newsletter-admin-actions">
                            <button onClick={handleExportCsv}>Export CSV</button>
                            <button onClick={handleExportJson}>Export JSON</button>
                            <button className="danger-action" onClick={handleClear}>
                                Clear Local List
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="section-heading">
                    <p className="eyebrow">SUBSCRIBER STORAGE</p>
                    <h2>Subscriber list</h2>
                    <p>
                        Current storage uses browser localStorage for this static React build.
                        The data model is ready to send to a serverless API route.
                    </p>
                </div>

                <label className="blog-search newsletter-admin-search">
                    <span>Search subscribers</span>
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Search email, source, or tag..."
                    />
                </label>

                <div className="subscriber-table-wrap">
                    <table className="subscriber-table">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Source</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Provider</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSubscribers.map((subscriber) => (
                                <tr key={subscriber.id}>
                                    <td>{subscriber.email}</td>
                                    <td>{subscriber.source}</td>
                                    <td>{subscriber.status}</td>
                                    <td>{new Date(subscriber.createdAt).toLocaleDateString()}</td>
                                    <td>{subscriber.providerStatus}</td>
                                    <td>
                                        <button onClick={() => handleDelete(subscriber.id)}>
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {!filteredSubscribers.length && (
                                <tr>
                                    <td colSpan="6">No subscribers found yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="section showcase-section">
                <div className="section-heading">
                    <p className="eyebrow">INTEGRATION READY</p>
                    <h2>Mailchimp and ConvertKit structure</h2>
                    <p>
                        Keep API keys on the server. Use these endpoint names and payload shapes
                        when you add Vercel serverless functions.
                    </p>
                </div>

                <div className="newsletter-integration-grid">
                    {Object.values(newsletterProviderConfig).map((provider) => (
                        <article className="newsletter-panel" key={provider.name}>
                            <p className="product-category">{provider.name}</p>
                            <h3>{provider.endpoint}</h3>
                            <p>Server environment variables:</p>
                            <div className="showcase-feature-list">
                                {provider.requiredServerEnv.map((envName) => (
                                    <span key={envName}>{envName}</span>
                                ))}
                            </div>
                        </article>
                    ))}

                    <article className="newsletter-panel newsletter-code-panel">
                        <p className="product-category">Payload Preview</p>
                        <pre>{JSON.stringify(providerPreview, null, 2)}</pre>
                    </article>
                </div>
            </section>
        </main>
    );
}

export default NewsletterAdmin;
