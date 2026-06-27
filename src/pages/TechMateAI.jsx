import "../App.css";
import NewsletterSignup from "../components/NewsletterSignup.jsx";
import ImmersiveHeroScene from "../components/ImmersiveHeroScene.jsx";
import ProductHeroPhoto from "../components/ProductHeroPhoto.jsx";
import FeaturePhotoCard from "../components/FeaturePhotoCard.jsx";
import { productMarketing } from "../data/marketingImages.js";
import { saveSubscriber } from "../data/newsletterService.js";
import SEO from "../components/SEO.jsx";
import { siteUrl } from "../data/blogPosts.js";

const { hero, features } = productMarketing.techmate;

const techmateSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TechMate AI",
    applicationCategory: "UtilitiesApplication",
    description: "AI-powered tech support and troubleshooting for devices, software, networks, and error codes — no wait times or hold music.",
    operatingSystem: "Web",
    url: `${siteUrl}/?page=techmate`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
};

function TechMateAI() {
    return (
        <div className="product-page">
            <SEO
                title="TechMate AI | AI Tech Support for Every Device — Cin Nova"
                description="TechMate AI gives instant AI-powered troubleshooting for devices, software, networks, and error codes. No hold music, no wait times. In development by Cin Nova."
                url={`${siteUrl}/?page=techmate`}
                type="website"
                schema={techmateSchema}
            />

            {/* ── Hero ───────────────────────────────────────────── */}
            <section className="studynest-hero hero-with-immersive-scene">
                <ImmersiveHeroScene variant="techmate" intensity="calm" />
                <div>
                    <p className="eyebrow">TECHMATE AI</p>
                    <h1>AI-powered tech support for every device and problem.</h1>
                    <p className="hero-text">
                        TechMate AI gives you instant, expert-level troubleshooting for
                        devices, software, networks, and error codes — no hold music,
                        no wait times, no confusion.
                    </p>
                    <div className="hero-actions">
                        <a href="#waitlist" className="primary-btn">Join Waitlist</a>
                        <a href="#features" className="secondary-btn">View Features</a>
                    </div>
                </div>

                <ProductHeroPhoto src={hero.src} alt={hero.alt} />
            </section>

            <section className="section" id="features">
                <div className="section-heading">
                    <p className="eyebrow">FEATURES</p>
                    <h2>Every tech problem solved — from one AI assistant</h2>
                    <p>
                        Whether it's a crashing app, a broken printer, or a full network
                        outage, TechMate AI walks you through the fix step by step.
                    </p>
                </div>

                <div className="product-grid product-grid-photo">
                    {features.map((feature) => (
                        <FeaturePhotoCard key={feature.title} {...feature} />
                    ))}
                </div>
            </section>

            {/* ── Device Troubleshooting + Error Code Preview ──────── */}
            <section className="section showcase-section" id="tools">
                <div className="section-heading">
                    <p className="eyebrow">DEVICE TROUBLESHOOTING &amp; ERROR CODES</p>
                    <h2>Diagnose the problem and know the fix before you call anyone</h2>
                </div>

                <div className="showcase-grid">
                    <div className="showcase-card">
                        <h3>Device Troubleshooting</h3>
                        <div className="chat-user">
                            My laptop shuts down randomly after about 20 minutes of use.
                        </div>
                        <div className="chat-ai">
                            This pattern usually points to one of three causes: overheating,
                            a failing battery, or a corrupt power profile. Let's check them
                            in order.
                            <br /><br />
                            <strong>Step 1:</strong> Open Task Manager → Performance → CPU.
                            If temperature exceeds 95°C during use, thermal paste or fan
                            cleaning is needed.
                            <br />
                            <strong>Step 2:</strong> Run <code>powercfg /batteryreport</code>
                            in Command Prompt. Share the Design Capacity vs Full Charge Capacity.
                        </div>
                    </div>

                    <div className="showcase-card">
                        <h3>Error Code Lookup</h3>
                        <div className="chat-user">
                            WHEA_UNCORRECTABLE_ERROR — Blue Screen on Windows 11
                        </div>
                        <div className="chat-ai">
                            <strong>WHEA_UNCORRECTABLE_ERROR (0x00000124)</strong>
                            <br /><br />
                            This is a hardware-level error, usually RAM, CPU, or a failing
                            drive. Ranked fixes by likelihood:
                            <br /><br />
                            1. Run Windows Memory Diagnostic — most common cause (42%)
                            <br />
                            2. Check for overclocking — reset BIOS to default
                            <br />
                            3. Update chipset and GPU drivers
                            <br />
                            4. Run <code>chkdsk /f /r</code> on all drives
                            <br />
                            5. Reseat RAM sticks if issues persist
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Network Diagnostics + AI Chat Preview ────────────── */}
            <section className="section" id="network">
                <div className="section-heading">
                    <p className="eyebrow">NETWORK &amp; AI CHAT</p>
                    <h2>Fix connectivity issues and get answers instantly</h2>
                </div>

                <div className="showcase-grid">
                    <div className="showcase-card">
                        <h3>Network Diagnostics</h3>
                        <div className="preview-grid" style={{ marginTop: "14px" }}>
                            <div><strong>72 ms</strong><span>Ping to DNS</span></div>
                            <div><strong>84 Mbps</strong><span>Download</span></div>
                            <div><strong>11 Mbps</strong><span>Upload</span></div>
                            <div><strong>3 drops</strong><span>Last 24 hrs</span></div>
                        </div>
                        <div className="preview-note" style={{ marginTop: "14px" }}>
                            <p>AI Diagnosis</p>
                            <h4>Channel Congestion Detected on 2.4 GHz</h4>
                            <span>
                                11 nearby networks on channel 6. Switch router to channel 1
                                or 11, or enable 5 GHz band for this device. Estimated
                                improvement: 40–60% drop reduction.
                            </span>
                        </div>
                    </div>

                    <div className="showcase-card">
                        <h3>AI Chat Assistant</h3>
                        <div className="chat-user">
                            My printer shows as online but won't print anything.
                        </div>
                        <div className="chat-ai">
                            Classic print queue issue. Here's the fastest fix:
                            <br /><br />
                            1. Press <strong>Win + R</strong>, type <code>services.msc</code>, find
                            <strong> Print Spooler</strong> → right-click → Stop
                            <br />
                            2. Navigate to <code>C:\Windows\System32\spool\PRINTERS</code>
                            and delete all files inside (not the folder)
                            <br />
                            3. Go back to services, start Print Spooler again
                            <br />
                            4. Try printing — this resolves the issue in about 85% of cases
                        </div>
                        <div className="chat-user" style={{ marginTop: "10px" }}>
                            That worked! Also, how do I set it as the default printer?
                        </div>
                        <div className="chat-ai">
                            Settings → Bluetooth &amp; devices → Printers &amp; scanners →
                            click your printer → Set as default. Done in under 30 seconds.
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Step-by-Step Guides + IT Help Desk Preview ──────── */}
            <section className="section showcase-section" id="guides">
                <div className="section-heading">
                    <p className="eyebrow">REPAIR GUIDES &amp; IT HELP DESK</p>
                    <h2>Guided repairs for individuals — and AI triage for IT teams</h2>
                </div>

                <div className="showcase-grid">
                    <div className="showcase-card">
                        <h3>Step-by-Step Repair Guide</h3>
                        <div className="flashcard-preview">
                            <p style={{ color: "#1d4ed8", fontWeight: 900, fontSize: "0.8rem", letterSpacing: "1px", marginBottom: "10px" }}>
                                MacBook Pro — Keyboard Not Responding
                            </p>
                            <p style={{ color: "#334155", marginBottom: "8px" }}>
                                <strong>Step 1 of 5</strong> — Soft Reset
                            </p>
                            <p style={{ color: "#64748b", lineHeight: "1.6", fontSize: "0.9rem" }}>
                                Hold <strong style={{ color: "#0f172a" }}>Ctrl + Option + Shift</strong> for 7 seconds,
                                then hold <strong style={{ color: "#0f172a" }}>Power</strong> for 7 more seconds.
                                Release all keys. Wait 5 seconds, then power on normally.
                                This resets the SMC and resolves keyboard freeze in ~60% of cases.
                            </p>
                        </div>
                        <div className="flashcard-preview" style={{ marginTop: "12px" }}>
                            <p style={{ color: "#7c3aed", fontWeight: 900, fontSize: "0.8rem", letterSpacing: "1px", marginBottom: "6px" }}>
                                Step 2 of 5 — NVRAM Reset
                            </p>
                            <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: "1.6" }}>
                                Restart and immediately hold <strong style={{ color: "#0f172a" }}>Option + Cmd + P + R</strong> for
                                20 seconds. Releases on second startup chime. Clears stored input device settings.
                            </p>
                        </div>
                    </div>

                    <div className="showcase-card">
                        <h3>IT Help Desk Assistant</h3>
                        <div className="preview-grid" style={{ marginTop: "14px" }}>
                            <div><strong>134</strong><span>Tickets Today</span></div>
                            <div><strong>91%</strong><span>AI Resolved</span></div>
                            <div><strong>4 min</strong><span>Avg Handle Time</span></div>
                            <div><strong>12</strong><span>Escalated</span></div>
                        </div>
                        <div className="preview-note" style={{ marginTop: "14px" }}>
                            <p>Auto-Triaged Ticket #1,847</p>
                            <h4>Outlook Not Syncing — Microsoft 365 Outage Detected</h4>
                            <span>
                                TechMate AI cross-referenced 14 identical tickets and matched
                                to an active Microsoft 365 outage (EX712934). Auto-reply sent
                                to all affected users with ETA. Zero manual handling required.
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Knowledge Base Preview ───────────────────────────── */}
            <section className="section" id="knowledge">
                <div className="section-heading">
                    <p className="eyebrow">KNOWLEDGE BASE</p>
                    <h2>An AI-organized library of every tech fix that works</h2>
                </div>

                <div className="showcase-grid">
                    <div className="showcase-card">
                        <h3>Software Support</h3>
                        <div className="chat-user">
                            Adobe Premiere crashes on export every time — Windows 11, RTX 4070.
                        </div>
                        <div className="chat-ai">
                            GPU-accelerated export conflicts with Premiere Pro 24.x on RTX
                            40-series are a known issue. Three fixes ranked by success rate:
                            <br /><br />
                            <strong>Fix 1 (67%):</strong> File → Export → change renderer
                            from CUDA to Software Only. Re-export.
                            <br />
                            <strong>Fix 2 (22%):</strong> Update NVIDIA driver to 551.76+
                            via GeForce Experience.
                            <br />
                            <strong>Fix 3 (8%):</strong> Delete Adobe Media Encoder cache at
                            <code> %AppData%\Adobe\Common\Media Cache</code>
                        </div>
                    </div>

                    <div className="showcase-card">
                        <h3>Top Searched Guides This Week</h3>
                        <div className="flashcard-preview">
                            <p style={{ color: "#1d4ed8", fontWeight: 900, fontSize: "0.8rem", letterSpacing: "1px", marginBottom: "12px" }}>
                                TRENDING GUIDES
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {[
                                    ["WIN", "Fix Windows 11 Update Stuck at 35%", "Guide"],
                                    ["IOS", "iPhone Battery Draining Fast — iOS 17", "Guide"],
                                    ["NET", "Starlink Connection Drops Fix", "Guide"],
                                    ["MAC", "macOS Sonoma Slow Performance", "Guide"],
                                    ["PRT", "HP Printer Offline on Wi-Fi — All Models", "Guide"],
                                ].map(([label, title, status]) => (
                                    <div key={title} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #e2e8f0" }}>
                                        <span style={{ color: "#334155", fontSize: "0.88rem" }}>
                                            <span className="guide-row-label">{label}</span> {title}
                                        </span>
                                        <span style={{ color: "#64748b", fontSize: "0.78rem", whiteSpace: "nowrap", marginLeft: "12px" }}>{status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Pricing ─────────────────────────────────────────── */}
            <section className="section pricing-section" id="pricing">
                <div className="section-heading">
                    <p className="eyebrow">PRICING</p>
                    <h2>Tech support that costs less than one service call</h2>
                    <p>Start free, upgrade when your team or device count grows.</p>
                </div>

                <div className="pricing-grid">
                    <div className="pricing-card">
                        <p className="product-category">PERSONAL</p>
                        <h3>Free</h3>
                        <div className="price">$0</div>
                        <p>
                            AI chat assistant, error code lookup, basic troubleshooting guides,
                            and 20 support sessions per month. Perfect for personal devices.
                        </p>
                    </div>

                    <div className="pricing-card featured">
                        <p className="product-category">PRO</p>
                        <h3>TechMate Pro</h3>
                        <div className="price">$9.99/mo</div>
                        <p>
                            Unlimited AI chat, full device troubleshooting, network diagnostics,
                            software support, step-by-step repair guides, and knowledge base
                            access. Best for power users and remote workers.
                        </p>
                    </div>

                    <div className="pricing-card">
                        <p className="product-category">BUSINESS</p>
                        <h3>IT Help Desk</h3>
                        <div className="price">$49/mo</div>
                        <p>
                            Everything in Pro plus the full IT Help Desk Assistant, ticket
                            triage, auto-documentation, multi-user support, and priority
                            response. Built for small IT teams and MSPs.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── CTA / Waitlist ───────────────────────────────────── */}
            <section className="section" id="waitlist">
                <div className="newsletter-card">
                    <p className="eyebrow">JOIN THE WAITLIST</p>
                    <h2>Be first to try TechMate AI when it launches.</h2>
                    <NewsletterSignup
                        onSubscribe={saveSubscriber}
                        source="TechMate AI Waitlist"
                        tags={["TechMate AI", "Waitlist"]}
                        buttonLabel="Join Waitlist"
                    />
                </div>
            </section>

        </div>
    );
}

export default TechMateAI;
