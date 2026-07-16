// ============================================================
// CinNova — AI Tutorials page (/guides)
// Drop-in page component. Assumes the existing CinNova app
// renders the navbar and footer around it.
// ============================================================

import { useState } from 'react';
import './AiTutorialsPage.css';
import SEO from '../components/SEO.jsx';
import { getPublicPageUrl } from "../data/publicPageRoutes.js";
import { siteUrl } from '../data/blogPosts.js';
import { saveSubscriber } from '../data/newsletterService.js';
import {
  weeklyCards,
  starterPrinciples,
  filterCategories,
  guides,
  guideRouteFor,
  claudeWorkflows,
  browseLevels,
  browseTopics,
  roadmapStats,
  roadmapItems,
  languageLinks,
  tutorialCategories,
  aiCompanies,
  featuredCreatorPlatform,
  creatorGroups,
  projectTracks,
  youtubePaths,
  ctaButtons,
} from './aiTutorialsData';

const GUIDES_VISIBLE_LIMIT = 6;

// Preserve the existing SEO system: canonical + CollectionPage schema for the
// /guides route (registered in seoConfig / sitemap).
const PAGE_URL = getPublicPageUrl("ai-tutorials");
const hubSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'AI Tutorials',
  description:
    'Step-by-step AI tutorials for prompting, research, coding, productivity, design, video, business automation, and responsible AI use.',
  url: PAGE_URL,
  publisher: { '@type': 'Organization', name: 'Cin Nova', url: siteUrl },
};

export default function AiTutorialsPage() {
  const [filter, setFilter] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const filteredGuides =
    filter === 'All' ? guides : guides.filter((g) => g.tags.includes(filter));
  const visibleGuides = showAll
    ? filteredGuides
    : filteredGuides.slice(0, GUIDES_VISIBLE_LIMIT);
  const hasHiddenGuides = filteredGuides.length > GUIDES_VISIBLE_LIMIT;

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Wire to the existing CinNova newsletter service (local-first store used
    // across the site by NewsletterSignup).
    try {
      saveSubscriber({ email, source: 'AI Tutorials', tags: ['AI Tutorials'] });
    } catch {
      /* non-fatal — still show confirmation */
    }
    setSubscribed(true);
    setEmail('');
  };

  return (
    <main className="ai-tutorials-page">
      <SEO
        title="AI Tutorials | Step-by-Step Guides for ChatGPT, Claude, Gemini & More"
        description="Browse 19 beginner-friendly AI guides. Find the right step-by-step tutorial for prompting, research, coding, AI tools, and Claude workflows for design, marketing, and video."
        url={PAGE_URL}
        type="website"
        schema={hubSchema}
      />

      {/* ============ 1 · HERO ============ */}
      <section className="ai-tutorials-hero" id="ai-tutorials-hero">
        <div className="ai-tutorials-hero-inner">
          <span className="ai-tutorials-hero-badge">
            <span className="ai-tutorials-hero-badge-dot" />
            Free · AI Education
          </span>
          <h1 className="ai-tutorials-hero-title">AI Tutorials</h1>
          <p className="ai-tutorials-hero-sub">
            Beginner-friendly, step-by-step guides for every major AI platform —
            from writing your first prompt to building full creative and
            business workflows.
          </p>
          <div className="ai-tutorials-hero-ctas">
            <a href="#ai-tutorials-guide-finder" className="ai-tutorials-btn-primary">
              Find the Right AI Guide
            </a>
            <a href="#ai-tutorials-companies" className="ai-tutorials-btn-secondary">
              Browse AI Companies
            </a>
          </div>
          <div className="ai-tutorials-hero-stats">
            <div className="ai-tutorials-stat">
              <div className="ai-tutorials-stat-value">19</div>
              <div className="ai-tutorials-stat-label">Guides available now</div>
            </div>
            <div className="ai-tutorials-stat">
              <div className="ai-tutorials-stat-value">100</div>
              <div className="ai-tutorials-stat-label">Tutorials on the roadmap</div>
            </div>
            <div className="ai-tutorials-stat">
              <div className="ai-tutorials-stat-value">12+</div>
              <div className="ai-tutorials-stat-label">AI platforms covered</div>
            </div>
            <div className="ai-tutorials-stat">
              <div className="ai-tutorials-stat-value">Weekly</div>
              <div className="ai-tutorials-stat-label">New tutorial published</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 2 · NEW TUTORIAL EVERY WEEK ============ */}
      <section className="ai-tutorials-weekly" id="ai-tutorials-weekly">
        <div className="ai-tutorials-container">
          <div className="ai-tutorials-kicker">Fresh every week</div>
          <h2 className="ai-tutorials-h2">New tutorial every week</h2>
          <div className="ai-tutorials-weekly-grid">
            {weeklyCards.map((card) => {
              const isLink = Boolean(card.href);
              const Tag = isLink ? 'a' : 'div';
              const cardClass = [
                'ai-tutorials-card',
                card.status === 'available' && 'ai-tutorials-card--featured',
                card.status !== 'available' && 'ai-tutorials-card--muted',
              ]
                .filter(Boolean)
                .join(' ');
              return (
                <Tag key={card.id} className={cardClass} {...(isLink ? { href: card.href } : {})}>
                  <div className="ai-tutorials-card-topline">
                    <span
                      className={`ai-tutorials-eyebrow ${
                        card.status === 'available' ? 'ai-tutorials-eyebrow--strong' : ''
                      }`}
                    >
                      {card.eyebrow}
                    </span>
                    <span className={`ai-tutorials-pill ai-tutorials-pill--${card.status}`}>
                      {card.statusLabel}
                    </span>
                  </div>
                  <h3 className="ai-tutorials-card-title">{card.title}</h3>
                  <p className="ai-tutorials-card-desc">{card.desc}</p>
                  {card.linkLabel && (
                    <span className="ai-tutorials-card-link">{card.linkLabel}</span>
                  )}
                </Tag>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ 3 · START HERE ============ */}
      <section className="ai-tutorials-start-here" id="ai-tutorials-start-here">
        <div className="ai-tutorials-container">
          <h2 className="ai-tutorials-h2 ai-tutorials-h2--compact">
            Start here — three ideas that make everything easier
          </h2>
          <div className="ai-tutorials-principles-grid">
            {starterPrinciples.map((p) => (
              <div key={p.num} className="ai-tutorials-principle">
                <span className="ai-tutorials-principle-num">{p.num}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 4 · GUIDE FINDER ============ */}
      <section className="ai-tutorials-guide-finder" id="ai-tutorials-guide-finder">
        <div className="ai-tutorials-container">
          <div className="ai-tutorials-kicker">Guide finder</div>
          <h2 className="ai-tutorials-h2">Find the right AI guide</h2>
          <p className="ai-tutorials-section-desc">
            19 beginner-friendly guides, available now. Pick a category to filter.
          </p>
          <div className="ai-tutorials-filters">
            {filterCategories.map((label) => {
              const count =
                label === 'All'
                  ? guides.length
                  : guides.filter((g) => g.tags.includes(label)).length;
              return (
                <button
                  key={label}
                  type="button"
                  className={`ai-tutorials-filter ${
                    filter === label ? 'ai-tutorials-filter--active' : ''
                  }`}
                  onClick={() => {
                    setFilter(label);
                    setShowAll(false);
                  }}
                >
                  {label}
                  <span className="ai-tutorials-filter-count">{count}</span>
                </button>
              );
            })}
          </div>
          <div className="ai-tutorials-guides-grid">
            {visibleGuides.map((g) => (
              <a key={g.slug} href={guideRouteFor(g.slug)} className="ai-tutorials-guide-card">
                <div className="ai-tutorials-guide-tags">
                  <span className="ai-tutorials-tag ai-tutorials-tag--cat">{g.category}</span>
                  <span className="ai-tutorials-tag ai-tutorials-tag--time">{g.time}</span>
                </div>
                <h3>{g.title}</h3>
                <p>{g.desc}</p>
                <span className="ai-tutorials-card-link">Read the guide →</span>
              </a>
            ))}
          </div>
          {(hasHiddenGuides || showAll) && (
            <div className="ai-tutorials-showmore-wrap">
              <button
                type="button"
                className="ai-tutorials-showmore"
                onClick={() => setShowAll((v) => !v)}
              >
                {showAll
                  ? 'Show fewer guides'
                  : `Show all ${filteredGuides.length} guides`}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ============ 5 · CLAUDE WORKFLOW GUIDES ============ */}
      <section className="ai-tutorials-claude-workflows" id="ai-tutorials-claude-workflows">
        <div className="ai-tutorials-container">
          <div className="ai-tutorials-section-head">
            <div>
              <div className="ai-tutorials-kicker">Claude workflows</div>
              <h2 className="ai-tutorials-h2">Claude workflow guides</h2>
            </div>
            <p>
              Use Claude as a planning partner alongside your design, website,
              coding, and video tools.
            </p>
          </div>
          <div className="ai-tutorials-workflow-grid">
            {claudeWorkflows.map((cw) => (
              <a key={cw.slug} href={guideRouteFor(cw.slug)} className="ai-tutorials-workflow-row">
                <span className="ai-tutorials-avatar">{cw.initials}</span>
                <span className="ai-tutorials-workflow-body">
                  <h3>{cw.title}</h3>
                  <p>{cw.desc}</p>
                </span>
                <span className="ai-tutorials-workflow-arrow">→</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 6 · BROWSE BY LEVEL ============ */}
      <section className="ai-tutorials-levels" id="ai-tutorials-levels">
        <div className="ai-tutorials-container">
          <h2 className="ai-tutorials-h2 ai-tutorials-h2--compact">Browse by level</h2>
          <div className="ai-tutorials-levels-grid">
            {browseLevels.map((lv) => (
              <a key={lv.name} href={lv.href} className="ai-tutorials-level-card">
                <span
                  className={`ai-tutorials-level-badge ai-tutorials-level-badge--${lv.modifier}`}
                >
                  {lv.name}
                </span>
                <p>{lv.desc}</p>
                <span className="ai-tutorials-level-link">Browse {lv.name} guides →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 7 · BROWSE BY TOPIC ============ */}
      <section className="ai-tutorials-topics" id="ai-tutorials-topics">
        <div className="ai-tutorials-container">
          <h2 className="ai-tutorials-h2 ai-tutorials-h2--compact">Browse by topic</h2>
          <p className="ai-tutorials-section-desc">
            Green topics have guides available today; gray topics are on the roadmap.
          </p>
          <div className="ai-tutorials-topic-chips">
            {browseTopics.map((tp) => (
              <a
                key={tp.name}
                href={tp.href}
                className={`ai-tutorials-topic-chip ${
                  tp.available ? 'ai-tutorials-topic-chip--available' : ''
                }`}
              >
                <span className="ai-tutorials-topic-dot" />
                {tp.name}
              </a>
            ))}
          </div>
          <div className="ai-tutorials-topic-legend">
            <span>
              <span
                className="ai-tutorials-topic-dot"
                style={{ background: '#0e7a5c' }}
              />
              Guides available
            </span>
            <span>
              <span className="ai-tutorials-topic-dot" />
              Planned
            </span>
          </div>
        </div>
      </section>

      {/* ============ 8 · 100 TUTORIAL ROADMAP ============ */}
      <section className="ai-tutorials-roadmap" id="ai-tutorials-roadmap">
        <div className="ai-tutorials-container">
          <div className="ai-tutorials-roadmap-card">
            <div className="ai-tutorials-roadmap-grid">
              <div>
                <div className="ai-tutorials-kicker">Tutorial roadmap</div>
                <h2>
                  100 tutorials. One a week.
                  <br />
                  Here&apos;s where we are.
                </h2>
                <p className="ai-tutorials-roadmap-lede">
                  The full roadmap spans AI platforms, creator tools, automation,
                  coding, design, business workflows, and project builds.
                </p>
                <div className="ai-tutorials-progress-meta">
                  <strong>19 of 100 published</strong>
                  <span>Updated weekly</span>
                </div>
                <div className="ai-tutorials-progress">
                  <div className="ai-tutorials-progress-bar" style={{ width: '19%' }} />
                </div>
                <div className="ai-tutorials-roadmap-stats">
                  {roadmapStats.map((rs) => (
                    <div
                      key={rs.label}
                      className={`ai-tutorials-roadmap-stat ${
                        rs.highlight ? 'ai-tutorials-roadmap-stat--highlight' : ''
                      }`}
                    >
                      <div className="ai-tutorials-roadmap-stat-value">{rs.value}</div>
                      <div className="ai-tutorials-roadmap-stat-label">{rs.label}</div>
                    </div>
                  ))}
                </div>
                <a href="/blog/category/ai-tutorials" className="ai-tutorials-roadmap-btn">
                  View the full roadmap →
                </a>
              </div>
              <div className="ai-tutorials-roadmap-items">
                <div className="ai-tutorials-roadmap-items-label">Sample roadmap items</div>
                {roadmapItems.map((item) => (
                  <div key={item.title} className="ai-tutorials-roadmap-item">
                    <span
                      className={`ai-tutorials-roadmap-tag ${
                        item.status === 'available'
                          ? 'ai-tutorials-roadmap-tag--available'
                          : ''
                      }`}
                    >
                      {item.tag}
                    </span>
                    <span>
                      <span className="ai-tutorials-roadmap-item-title">{item.title}</span>
                      <span className="ai-tutorials-roadmap-item-meta" style={{ display: 'block' }}>
                        {item.meta}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 9 · LANGUAGES ============ */}
      <section className="ai-tutorials-languages" id="ai-tutorials-languages">
        <div className="ai-tutorials-container">
          <div className="ai-tutorials-languages-bar">
            <div>
              <h2>Available in other languages</h2>
              <p>Starter guides are also published in Spanish, French, and German.</p>
            </div>
            <div className="ai-tutorials-lang-links">
              {languageLinks.map((lg) => (
                <a key={lg.code} href={lg.href} className="ai-tutorials-lang-link">
                  <span className="ai-tutorials-lang-code">{lg.code}</span>
                  {lg.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ 10 · CATEGORIES ============ */}
      <section className="ai-tutorials-categories" id="ai-tutorials-categories">
        <div className="ai-tutorials-container">
          <h2 className="ai-tutorials-h2 ai-tutorials-h2--compact">AI tutorial categories</h2>
          <div className="ai-tutorials-categories-grid">
            {tutorialCategories.map((cat) => (
              <a key={cat.slug} href={cat.href} className="ai-tutorials-category-link">
                {cat.name}
                <span>→</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 11 · AI COMPANIES ============ */}
      <section className="ai-tutorials-companies" id="ai-tutorials-companies">
        <div className="ai-tutorials-container">
          <div className="ai-tutorials-section-head">
            <div>
              <div className="ai-tutorials-kicker">Platforms</div>
              <h2 className="ai-tutorials-h2">AI companies covered</h2>
            </div>
            <p>
              Every guide is written for a specific tool, so instructions match
              what you actually see on screen.
            </p>
          </div>
          <div className="ai-tutorials-companies-grid">
            {aiCompanies.map((c) => (
              <a key={c.name} href={c.href} className="ai-tutorials-company-card">
                <span className={`ai-tutorials-company-logo ai-tutorials-company-logo--${c.logoClass}`}>
                  {c.initials}
                </span>
                <span className="ai-tutorials-company-name">{c.name}</span>
                <span className="ai-tutorials-company-sub">{c.sub}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 12 · AI FOR CREATORS ============ */}
      <section className="ai-tutorials-creators" id="ai-tutorials-creators">
        <div className="ai-tutorials-container">
          <div className="ai-tutorials-kicker">Creator tools</div>
          <h2 className="ai-tutorials-h2">AI for creators</h2>
          <div className="ai-tutorials-creators-grid">
            <a href={featuredCreatorPlatform.href} className="ai-tutorials-creators-featured">
              <span className="ai-tutorials-creators-featured-badge">
                {featuredCreatorPlatform.badge}
              </span>
              <h3>{featuredCreatorPlatform.name}</h3>
              <p>{featuredCreatorPlatform.desc}</p>
              <span className="ai-tutorials-creators-featured-link">
                {featuredCreatorPlatform.linkLabel}
              </span>
            </a>
            <div className="ai-tutorials-creator-groups">
              {creatorGroups.map((grp) => (
                <div key={grp.label} className="ai-tutorials-creator-group">
                  <h3>{grp.label}</h3>
                  <div className="ai-tutorials-creator-chips">
                    {grp.tools.map((tool) => (
                      <a key={tool.name} href={tool.href} className="ai-tutorials-creator-chip">
                        {tool.name}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ 13 · BUILD REAL AI PROJECTS ============ */}
      <section className="ai-tutorials-projects" id="ai-tutorials-projects">
        <div className="ai-tutorials-container">
          <div className="ai-tutorials-section-head">
            <div>
              <div className="ai-tutorials-kicker">Project tracks</div>
              <h2 className="ai-tutorials-h2">Build real AI projects</h2>
            </div>
            <p>
              Multi-tutorial tracks that turn individual guides into finished,
              working systems.
            </p>
          </div>
          <div className="ai-tutorials-projects-grid">
            {projectTracks.map((pt) => (
              <a key={pt.title} href={pt.href} className="ai-tutorials-project-card">
                <div className="ai-tutorials-card-topline">
                  <span className="ai-tutorials-avatar">{pt.initials}</span>
                  <span className="ai-tutorials-project-tag">Planned track</span>
                </div>
                <h3>{pt.title}</h3>
                <p>{pt.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 14 · YOUTUBE LEARNING PATHS ============ */}
      <section className="ai-tutorials-youtube" id="ai-tutorials-youtube">
        <div className="ai-tutorials-container">
          <div className="ai-tutorials-section-head">
            <div>
              <div className="ai-tutorials-kicker">Watch &amp; learn</div>
              <h2 className="ai-tutorials-h2">YouTube learning paths</h2>
            </div>
            <p>
              Curated video paths paired with CinNova checklists and prompts.
              All paths are planned — coming with the video series.
            </p>
          </div>
          <div className="ai-tutorials-youtube-grid">
            {youtubePaths.map((yt) => (
              <div key={yt.name} className="ai-tutorials-youtube-row">
                <span className="ai-tutorials-youtube-icon">▶</span>
                <span className="ai-tutorials-youtube-name">{yt.name}</span>
                <span className="ai-tutorials-youtube-status">Planned</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 15 · FINAL CTA ============ */}
      <section className="ai-tutorials-cta" id="ai-tutorials-cta">
        <div className="ai-tutorials-cta-inner">
          <span className="ai-tutorials-cta-logo">CN</span>
          <h2>Learn AI with CinNova</h2>
          <p className="ai-tutorials-cta-desc">
            One new tutorial every week, plus tools and calculators to put your
            AI skills to work. Join the newsletter to get each guide in your inbox.
          </p>
          <form className="ai-tutorials-newsletter-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              required
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="ai-tutorials-input"
              aria-label="Email address"
            />
            <button type="submit" className="ai-tutorials-subscribe">
              {subscribed ? 'Subscribed ✓' : 'Subscribe'}
            </button>
          </form>
          <div className="ai-tutorials-cta-buttons">
            {ctaButtons.map((btn) => (
              <a key={btn.label} href={btn.href} className="ai-tutorials-cta-btn">
                {btn.label}
              </a>
            ))}
          </div>
          <p className="ai-tutorials-cta-fineprint">
            By subscribing you agree to our <a href="/privacy">Privacy Policy</a>.
          </p>
        </div>
      </section>
    </main>
  );
}
