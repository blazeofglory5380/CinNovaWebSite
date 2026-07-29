#!/usr/bin/env node
/**
 * End-to-end GA4 verification for the production bundle.
 *
 * Serves `dist/` with `vite preview`, drives it with a real Chromium, lets the
 * real gtag.js load, and asserts on the Measurement Protocol hits the tag tries
 * to send:
 *
 *   1. Home (`/`) produces exactly one `page_view`
 *   2. SPA nav to `/?page=news` produces +1
 *   3. SPA nav to `/?page=products` produces +1
 *   4. SPA nav to `/privacy` produces +1
 *   5. Re-tracking the same URL does not duplicate
 *
 * Expected total: 4 page_view events, all with tid=G-CD944CHBK6.
 *
 * The `/g/collect` requests are recorded and then ABORTED, so running this test
 * never writes data into the live GA4 property.
 *
 * Usage: npm run test:analytics
 */

import { spawn } from "node:child_process";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const EXPECTED_ID = process.env.VITE_GA_MEASUREMENT_ID?.trim() || "G-CD944CHBK6";
const PORT = Number(process.env.GA_TEST_PORT || 4177);
const ORIGIN = `http://localhost:${PORT}`;
const COLLECT_PATTERN = /^https:\/\/([a-z0-9-]+\.)?(google-analytics\.com|analytics\.google\.com)\/(g\/)?collect/;

const failures = [];

function check(label, condition, detail = "") {
    if (condition) {
        console.log(`  PASS  ${label}`);
    } else {
        console.log(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
        failures.push(label);
    }
}

async function waitForServer(url, timeoutMs = 60000) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        try {
            const res = await fetch(url, { redirect: "manual" });
            if (res.status < 500) return;
        } catch {
            // Server not up yet.
        }
        await new Promise((resolve) => setTimeout(resolve, 300));
    }
    throw new Error(`Preview server did not start at ${url}`);
}

function startPreview() {
    // Spawn Vite's bin entry with the current Node binary. Invoking `npx`
    // directly fails on Windows, where spawning a `.cmd` without a shell throws
    // EINVAL on modern Node.
    const viteBin = fileURLToPath(new URL("../node_modules/vite/bin/vite.js", import.meta.url));
    const child = spawn(
        process.execPath,
        [viteBin, "preview", "--port", String(PORT), "--strictPort"],
        { stdio: ["ignore", "pipe", "pipe"], shell: false }
    );
    child.stdout.on("data", () => {});
    child.stderr.on("data", (chunk) => process.stderr.write(chunk));
    return child;
}

function parseHit(request) {
    const url = request.url();
    const params = new URL(url).searchParams;
    const hit = {
        url,
        tid: params.get("tid"),
        en: params.get("en"),
        dl: params.get("dl"),
        dt: params.get("dt"),
        // GA4 encodes event params as ep.<name> on the collect query string.
        pagePath: params.get("ep.page_path"),
    };

    // Some gtag collects are POST with the Measurement Protocol fields in the
    // body (often URL-encoded). Merge those so we do not miss `en=page_view`.
    try {
        const post = request.postData();
        if (post) {
            const body = new URLSearchParams(post);
            hit.tid = hit.tid || body.get("tid");
            hit.en = hit.en || body.get("en");
            hit.dl = hit.dl || body.get("dl");
            hit.dt = hit.dt || body.get("dt");
            hit.pagePath = hit.pagePath || body.get("ep.page_path");
        }
    } catch {
        // Ignore body parse failures; query-string fields still apply.
    }

    return hit;
}

function pageViews(hits) {
    return hits.filter((h) => h.en === "page_view");
}

async function waitForHits(hits, predicate, timeoutMs = 25000) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        if (predicate(hits)) return true;
        await new Promise((resolve) => setTimeout(resolve, 250));
    }
    return false;
}

async function spaGoto(page, path) {
    await page.evaluate((nextPath) => {
        window.history.pushState({}, "", nextPath);
        window.dispatchEvent(new PopStateEvent("popstate"));
    }, path);
}

async function main() {
    console.log(`GA4 e2e check — expecting measurement ID ${EXPECTED_ID}\n`);

    const server = startPreview();
    let browser;

    try {
        await waitForServer(`${ORIGIN}/`);

        browser = await chromium.launch();
        const context = await browser.newContext();

        const hits = [];
        // Record every Measurement Protocol hit, then abort it so the live GA4
        // property never receives synthetic test traffic.
        await context.route(COLLECT_PATTERN, async (route) => {
            hits.push(parseHit(route.request()));
            await route.abort();
        });

        const page = await context.newPage();
        const consoleErrors = [];
        page.on("console", (msg) => {
            if (msg.type() === "error") consoleErrors.push(msg.text());
        });

        // ── 1. Initial load ──────────────────────────────────────────────────
        await page.goto(`${ORIGIN}/`, { waitUntil: "domcontentloaded" });

        const gotFirst = await waitForHits(hits, (h) => h.some((x) => x.en === "page_view"));
        check("initial load sends a page_view hit", gotFirst);

        const tagState = await page.evaluate(() => ({
            dataLayerIsArray: Array.isArray(globalThis.dataLayer),
            gtagType: typeof globalThis.gtag,
            scriptSrc: globalThis.document.getElementById("ga4-script")?.src || null,
            commands: Array.from(globalThis.dataLayer || []).map((args) => Array.from(args)),
        }));

        check("window.dataLayer is initialised", tagState.dataLayerIsArray);
        check("window.gtag is a function", tagState.gtagType === "function");
        check(
            "gtag.js is injected with the expected id",
            tagState.scriptSrc?.includes(EXPECTED_ID),
            String(tagState.scriptSrc)
        );

        const configCommands = tagState.commands.filter((c) => c[0] === "config");
        check(
            "exactly one config command is issued",
            configCommands.length === 1,
            `saw ${configCommands.length}`
        );
        check(
            "config disables the automatic page view",
            configCommands[0]?.[2]?.send_page_view === false
        );
        check(
            "page views are sent as explicit page_view events",
            tagState.commands.some((c) => c[0] === "event" && c[1] === "page_view")
        );

        // Let any stray duplicate arrive before counting.
        await page.waitForTimeout(2000);
        check(
            "initial load sends exactly one page_view",
            pageViews(hits).length === 1,
            `saw ${pageViews(hits).length}`
        );
        check(
            "hit carries the correct measurement id",
            pageViews(hits).every((h) => h.tid === EXPECTED_ID),
            pageViews(hits)
                .map((h) => h.tid)
                .join(", ")
        );
        check(
            "hit page_location matches the loaded route",
            pageViews(hits)[0]?.dl === `${ORIGIN}/`,
            String(pageViews(hits)[0]?.dl)
        );

        // ── 2. Query + clean SPA destinations ────────────────────────────────
        // Home → ?page=news → ?page=products → /privacy  => 4 distinct page_views
        // News uses the real nav button (pushRoute + eager track). Remaining
        // query/clean hops use popstate so React state stays in sync.

        // Blog → News was the failing case; from Home, News still lands on /?page=news.
        await page.getByRole("button", { name: "News", exact: true }).first().click();
        const gotNews = await waitForHits(hits, (h) => pageViews(h).length >= 2);
        check("legacy News query route (/?page=news) sends a page_view", gotNews);
        await page.waitForTimeout(800);

        // Diagnostic: confirm the SPA URL and that dataLayer queued a page_view.
        const newsProbe = await page.evaluate(() => ({
            href: window.location.href,
            commands: Array.from(window.dataLayer || []).map((args) => {
                try {
                    return Array.from(args);
                } catch {
                    return args;
                }
            }),
        }));
        const newsPageViewQueued = newsProbe.commands.some(
            (c) => Array.isArray(c) && c[0] === "event" && c[1] === "page_view"
        );
        check("News navigation lands on /?page=news", /[?&]page=news\b/.test(newsProbe.href) || newsProbe.href.endsWith("/?page=news"), newsProbe.href);
        check("dataLayer contains at least one page_view event command", newsPageViewQueued);

        check(
            "News navigation reaches 2 total page_views",
            pageViews(hits).length === 2,
            `saw ${pageViews(hits).length}; raw=${JSON.stringify(hits.map((h) => ({ en: h.en, dl: h.dl })))}`
        );
        check(
            "News page_view reports /?page=news",
            pageViews(hits)[1]?.dl === `${ORIGIN}/?page=news`,
            String(pageViews(hits)[1]?.dl)
        );

        const routeSteps = [
            { path: "/?page=products", label: "legacy Products query route", expectedCount: 3 },
            { path: "/privacy", label: "Privacy destination", expectedCount: 4 },
        ];

        for (const step of routeSteps) {
            await spaGoto(page, step.path);
            const got = await waitForHits(
                hits,
                (h) => pageViews(h).length >= step.expectedCount
            );
            check(`${step.label} (${step.path}) sends a page_view`, got);

            await page.waitForTimeout(800);
            const views = pageViews(hits);
            check(
                `${step.label} reaches ${step.expectedCount} total page_views`,
                views.length === step.expectedCount,
                `saw ${views.length}`
            );
            check(
                `${step.label} reports the destination location`,
                views[step.expectedCount - 1]?.dl === `${ORIGIN}${step.path}`,
                String(views[step.expectedCount - 1]?.dl)
            );
        }

        await page.waitForTimeout(1500);
        const views = pageViews(hits);
        check("exactly 4 page_view events after the route matrix", views.length === 4, `saw ${views.length}`);
        check(
            "every page_view uses the expected measurement id",
            views.every((h) => h.tid === EXPECTED_ID),
            views.map((h) => h.tid).join(", ")
        );

        const locations = views.map((v) => v.dl);
        check(
            "no duplicate page_view for the same location",
            new Set(locations).size === locations.length,
            locations.join(" | ")
        );

        // Re-track the same destination; dedupe must suppress a 5th page_view.
        const beforeDedupe = pageViews(hits).length;
        await spaGoto(page, "/privacy");
        await page.waitForTimeout(1500);
        check(
            "re-tracking the same URL does not emit a duplicate page_view",
            pageViews(hits).length === beforeDedupe,
            `saw ${pageViews(hits).length}`
        );

        const gaErrors = consoleErrors.filter((t) => t.includes("[GA4]"));
        check("no [GA4] console errors", gaErrors.length === 0, gaErrors.join(" | "));

        console.log(`\nRecorded ${hits.length} Measurement Protocol hit(s):`);
        for (const hit of hits) {
            console.log(
                `  en=${hit.en} tid=${hit.tid} dl=${hit.dl}${hit.pagePath ? ` ep.page_path=${hit.pagePath}` : ""}`
            );
        }
    } finally {
        if (browser) await browser.close();
        server.kill();
    }

    if (failures.length > 0) {
        console.error(`\n${failures.length} check(s) failed.`);
        process.exitCode = 1;
        return;
    }
    console.log("\nAll GA4 checks passed.");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
