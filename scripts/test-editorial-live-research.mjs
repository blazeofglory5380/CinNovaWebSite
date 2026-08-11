#!/usr/bin/env node
import assert from "node:assert/strict";
import { normalizeCandidate } from "./editorial/research/providers/normalize.mjs";
import { parseRssXml } from "./editorial/research/providers/rss.mjs";
import { SOURCE_REGISTRY, getActiveSources, getSourceById } from "./editorial/research/sourceRegistry.mjs";
import { assertHttpsUrl, isSafePublicUrl } from "./editorial/research/urlSafety.mjs";
import { classifyFreshness, isFreshEnough } from "./editorial/research/freshness.mjs";
import { clusterCandidates, isCountVariantTemplate } from "./editorial/research/clustering.mjs";
import { assessCorroboration } from "./editorial/research/corroboration.mjs";
import { areLikelySyndicated, detectSyndicationGroup } from "./editorial/research/syndication.mjs";
import { classifyAgainstCinova } from "./editorial/research/cinovaDedupe.mjs";
import { routeCluster } from "./editorial/research/routing.mjs";
import { buildResearchPacket } from "./editorial/research/packetBuilder.mjs";
import { qualifyCluster, runDiscovery } from "./editorial/research/discover.mjs";

const NOW = new Date("2026-07-29T18:00:00.000Z");

function candidate(overrides = {}) {
    return normalizeCandidate({
        sourceId: "nist-news",
        sourceName: "NIST News",
        sourceTier: "TIER_1_PRIMARY",
        sourceUrl: "https://www.nist.gov/news-events/news/rss.xml",
        articleUrl: "https://www.nist.gov/news-events/news/fixture",
        headline: "NIST announces artificial intelligence cybersecurity standards",
        summary: "NIST announced standards for artificial intelligence cybersecurity software.",
        publishedAt: "2026-07-29T16:00:00.000Z",
        scope: ["national"],
        topics: ["ai", "cybersecurity"],
        retrievedAt: NOW,
        guid: "fixture-guid",
        ...overrides,
    });
}

async function run() {
    assert.ok(SOURCE_REGISTRY.length >= 20 && SOURCE_REGISTRY.length <= 80);
    assert.equal(getSourceById("nist-news").authorityTier, "TIER_1_PRIMARY");
    assert.ok(getActiveSources().every((source) => source.active && source.feedUrl?.startsWith("https://")));
    assert.ok(SOURCE_REGISTRY.some((source) =>
        source.authorityTier === "TIER_3_DISCOVERY_ONLY" || source.authorityTier === "TIER_4_DISCOVERY_ONLY"));
    assert.ok(SOURCE_REGISTRY.filter((source) => source.feedUrl === null).length >= 3);
    assert.ok(getActiveSources().length >= 12, "Phase 2 should activate a broader trusted feed set");
    assert.equal(getSourceById("arxiv-cs-ai").authorityTier, "TIER_3_DISCOVERY_ONLY");
    assert.equal(getSourceById("arxiv-cs-ai").supportsCorroboration, false);
    assert.ok(getSourceById("bbc-technology")?.active);
    assert.ok(getSourceById("reuters-wire") && !getSourceById("reuters-wire").active);

    assert.equal(isSafePublicUrl("https://www.nist.gov/news-events/news/rss.xml"), true);
    for (const unsafe of [
        "http://www.nist.gov/feed",
        "https://localhost/feed",
        "https://127.0.0.1/feed",
        "https://10.1.2.3/feed",
        "https://192.168.1.1/feed",
        "https://[::1]/feed",
        "not a url",
    ]) assert.equal(isSafePublicUrl(unsafe), false, unsafe);
    assert.throws(() => assertHttpsUrl("https://localhost/feed"));

    assert.equal(classifyFreshness("2026-07-29T16:00:00Z", NOW), "BREAKING");
    assert.equal(classifyFreshness("2026-07-29T09:00:00Z", NOW), "CURRENT");
    assert.equal(classifyFreshness("2026-07-27T18:00:00Z", NOW), "RECENT");
    assert.equal(classifyFreshness("2026-07-20T18:00:00Z", NOW), "BACKGROUND");
    assert.equal(classifyFreshness("", NOW), "UNKNOWN");
    assert.equal(isFreshEnough("RECENT", { requireFresh: true }), true);
    assert.equal(isFreshEnough("BACKGROUND", { requireFresh: true }), false);

    const xml = `<rss><channel>
      <item><title><![CDATA[AI &amp; security update]]></title><link>https://example.com/ai-update</link><guid>one</guid><pubDate>Wed, 29 Jul 2026 16:00:00 GMT</pubDate><description>Verified summary</description></item>
      <item><title>Malformed missing link</title></item>
    </channel></rss>`;
    const parsed = parseRssXml(xml, getSourceById("nist-news"), { retrievedAt: NOW });
    assert.equal(parsed.length, 1);
    assert.equal(parsed[0].headline, "AI & security update");
    assert.equal(parsed[0].rawFingerprint.length, 64);

    const primary = candidate();
    const secondary = candidate({
        sourceId: "mit-ai",
        sourceName: "MIT News: Artificial Intelligence",
        sourceTier: "TIER_3_REPUTABLE_SECONDARY",
        sourceUrl: "https://news.mit.edu/rss/topic/artificial-intelligence2",
        articleUrl: "https://news.mit.edu/2026/nist-ai-security",
        headline: "New artificial intelligence cybersecurity standards announced by NIST",
        guid: "different-guid",
    });
    const clusters = clusterCandidates([primary, secondary], { now: NOW });
    assert.equal(clusters.length, 1);
    assert.equal(clusters[0].freshness, "BREAKING");
    const corroboration = assessCorroboration(clusters[0], SOURCE_REGISTRY);
    assert.equal(corroboration.corroborated, true);

    assert.equal(
        isCountVariantTemplate(
            "CISA Adds One Known Exploited Vulnerability to Catalog",
            "CISA Adds Two Known Exploited Vulnerabilities to Catalog",
        ),
        true,
    );
    const kevA = candidate({
        sourceId: "cisa-advisories",
        sourceName: "CISA Cybersecurity Advisories",
        sourceUrl: "https://www.cisa.gov/cybersecurity-advisories/all.xml",
        articleUrl: "https://www.cisa.gov/news-events/alerts/2026/07/29/one",
        headline: "CISA Adds One Known Exploited Vulnerability to Catalog",
        summary: "CISA added one vulnerability.",
        guid: "kev-one",
    });
    const kevB = candidate({
        sourceId: "cisa-advisories",
        sourceName: "CISA Cybersecurity Advisories",
        sourceUrl: "https://www.cisa.gov/cybersecurity-advisories/all.xml",
        articleUrl: "https://www.cisa.gov/news-events/alerts/2026/07/27/two",
        headline: "CISA Adds Two Known Exploited Vulnerabilities to Catalog",
        summary: "CISA added two vulnerabilities.",
        publishedAt: "2026-07-27T16:00:00.000Z",
        guid: "kev-two",
    });
    assert.equal(clusterCandidates([kevA, kevB], { now: NOW }).length, 2);

    const rockwellA = candidate({
        sourceId: "cisa-advisories",
        sourceName: "CISA Cybersecurity Advisories",
        sourceUrl: "https://www.cisa.gov/cybersecurity-advisories/all.xml",
        articleUrl: "https://www.cisa.gov/news-events/ics-advisories/icsa-a",
        headline: "Rockwell Automation ThinManager",
        summary: "Advisory for ThinManager.",
        guid: "rockwell-a",
    });
    const rockwellB = candidate({
        sourceId: "cisa-advisories",
        sourceName: "CISA Cybersecurity Advisories",
        sourceUrl: "https://www.cisa.gov/cybersecurity-advisories/all.xml",
        articleUrl: "https://www.cisa.gov/news-events/ics-advisories/icsa-b",
        headline: "Rockwell Automation FactoryTalk Services Platform",
        summary: "Advisory for FactoryTalk.",
        guid: "rockwell-b",
    });
    assert.equal(clusterCandidates([rockwellA, rockwellB], { now: NOW }).length, 2);

    const curiosityA = candidate({
        sourceId: "nasa-press",
        sourceName: "NASA Press Releases",
        sourceTier: "TIER_1_PRIMARY",
        sourceUrl: "https://www.nasa.gov/rss/dyn/breaking_news.rss",
        articleUrl: "https://science.nasa.gov/photojournal/polygons/",
        headline: "NASA’s Curiosity Discovers a Field of Martian Polygons",
        summary: "Curiosity finds Martian polygons across Valle Grande.",
        guid: "curiosity-a",
    });
    const curiosityB = candidate({
        sourceId: "nasa-press",
        sourceName: "NASA Press Releases",
        sourceTier: "TIER_1_PRIMARY",
        sourceUrl: "https://www.nasa.gov/rss/dyn/breaking_news.rss",
        articleUrl: "https://www.nasa.gov/missions/curiosity-honeycomb/",
        headline: "NASA’s Curiosity Mars Rover Discovers Field of Honeycomb Textures",
        summary: "Curiosity Mars rover discovers honeycomb textures near Martian Valle Grande.",
        guid: "curiosity-b",
    });
    assert.equal(clusterCandidates([curiosityA, curiosityB], { now: NOW }).length, 1);

    const soloTier3 = clusterCandidates([secondary], { now: NOW })[0];
    assert.equal(assessCorroboration(soloTier3, SOURCE_REGISTRY).corroborated, false);
    const soloPrimary = clusterCandidates([primary], { now: NOW })[0];
    assert.equal(assessCorroboration(soloPrimary, SOURCE_REGISTRY).corroborated, true);

    const wireA = candidate({
        sourceId: "ap-wire",
        sourceName: "Associated Press",
        sourceTier: "TIER_2_HIGH_AUTHORITY",
        articleUrl: "https://apnews.com/article/wire-copy",
        summary: "Associated Press report.",
        guid: "wire-copy",
    });
    const wireB = candidate({
        sourceId: "reuters-wire",
        sourceName: "Reuters",
        sourceTier: "TIER_2_HIGH_AUTHORITY",
        articleUrl: "https://www.reuters.com/technology/wire-copy/",
        summary: "Reuters carries an Associated Press report.",
        guid: "wire-copy",
    });
    assert.equal(areLikelySyndicated(wireA, wireB), true);
    assert.ok(detectSyndicationGroup(wireA));
    const wireCluster = clusterCandidates([wireA, wireB], { now: NOW })[0];
    assert.equal(assessCorroboration(wireCluster, SOURCE_REGISTRY).corroborated, false);

    const duplicate = classifyAgainstCinova({
        canonicalTopic: "Meta and BlackRock form El Paso AI data center venture",
        headlineCandidates: ["Meta and BlackRock form El Paso AI data center venture"],
        sources: [primary],
        scope: ["national"],
    }, {
        catalog: [{ slug: "meta-blackrock", title: "Meta and BlackRock form El Paso AI data center venture", location: "National" }],
        drafts: [],
        reports: [],
        blogCatalog: [],
    });
    assert.equal(duplicate.classification, "DUPLICATE");

    assert.equal(routeCluster({ canonicalTopic: "Study analyzes AI software reliability", sources: [secondary] }).route, "BLOG");
    assert.equal(routeCluster({ canonicalTopic: "NIST announces AI security rule", sources: [primary] }).route, "NEWS");
    assert.equal(routeCluster({
        canonicalTopic: "Siemens Mendix Runtime",
        sources: [{
            ...primary,
            sourceId: "cisa-advisories",
            headline: "Siemens Mendix Runtime",
            articleUrl: "https://www.cisa.gov/news-events/ics-advisories/icsa-26-209-02",
            summary: "CISA republished this advisory. Perform proper impact analysis before deploying fixes for the vulnerability.",
        }],
    }).route, "NEWS");
    assert.equal(routeCluster({
        canonicalTopic: "Unverified AI claim",
        sources: [{ ...secondary, sourceTier: "TIER_4_DISCOVERY_ONLY" }],
    }).route, "SKIP");

    const droppedBadUrl = parseRssXml(
        `<rss><channel>
          <item><title>Bad</title><link>javascript:alert(1)</link><pubDate>Wed, 29 Jul 2026 16:00:00 GMT</pubDate></item>
          <item><title>Ok</title><link>https://www.nist.gov/ok</link><pubDate>Wed, 29 Jul 2026 16:00:00 GMT</pubDate></item>
        </channel></rss>`,
        getSourceById("nist-news"),
        { retrievedAt: NOW },
    );
    assert.equal(droppedBadUrl.length, 1);
    assert.equal(droppedBadUrl[0].articleUrl, "https://www.nist.gov/ok");

    const qualifiedCluster = {
        ...clusters[0],
        ...corroboration,
        corroboration,
        route: { route: "NEWS", rationale: "fixture" },
        relevance: 2,
        cinovaClassification: "NEW",
    };
    assert.equal(qualifyCluster(qualifiedCluster).qualified, true);
    const packet = buildResearchPacket({ dateIso: "2026-07-29", qualified: [{ ...qualifiedCluster, qualified: true }] });
    assert.equal(packet.schemaVersion, "10A");
    assert.equal(packet.news.national.title, qualifiedCluster.canonicalTopic);
    assert.equal(packet.news.national.factCheckStatus, "");
    assert.equal(packet.news.national.forceDraft, false);
    assert.deepEqual(packet.news.national.verifiedClaims, []);
    assert.ok(packet.news.national.attributedClaims.length > 0);
    assert.ok(packet.news.national.sources.every((source) => ["official", "verified"].includes(source.type)));

    const emptyPacket = buildResearchPacket({ dateIso: "2026-07-29", qualified: [] });
    assert.equal(emptyPacket.news.local.title, "");
    assert.equal(emptyPacket.news.state.title, "");
    assert.equal(emptyPacket.news.national.title, "");
    assert.equal(emptyPacket.news.international.title, "");
    assert.equal(emptyPacket.blog.title, "");

    const emptyRun = await runDiscovery({
        mode: "fixture",
        fixtureCases: ["empty-run"],
        dateIso: "2026-07-29",
        dryRun: true,
        now: NOW,
        dedupeOptions: { catalog: [], drafts: [], reports: [], blogCatalog: [] },
    });
    assert.equal(emptyRun.candidateCount, 0);
    assert.equal(emptyRun.qualifiedCount, 0);
    assert.equal(emptyRun.packet.news.national.title, "");

    const breakingRun = await runDiscovery({
        mode: "fixture",
        fixtureCases: ["breaking-two-source", "malformed-item", "discovery-only-tier4"],
        dateIso: "2026-07-29",
        dryRun: true,
        now: NOW,
        dedupeOptions: { catalog: [], drafts: [], reports: [], blogCatalog: [] },
    });
    assert.ok(breakingRun.candidateCount >= 3);
    assert.ok(breakingRun.qualifiedCount >= 1);
    assert.ok(breakingRun.clusters.some((cluster) => cluster.route.route === "SKIP" && !cluster.qualified));
    assert.ok(breakingRun.sourceResults.every((result) => result.ok));

    console.log("test:editorial-live-research passed");
}

await run();
