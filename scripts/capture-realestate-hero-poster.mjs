/**
 * Capture Real Estate AI hero poster at 1600×1200 from the live /?page=real-estate
 * model-viewer (same ProductHero3D settings and auto-framed camera).
 */
import { chromium } from "playwright";
import { createCanvas, loadImage } from "canvas";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outPoster = path.join(
    root,
    "public/images/product-heroes/posters/realestateai-farmhouse-transformation.png",
);

async function detectDevPort() {
    const preferred = Number(process.env.POSTER_CAPTURE_PORT) || 0;
    const ports = preferred ? [preferred] : [5173, 5174, 5175, 5176, 5177];

    for (const port of ports) {
        try {
            const response = await fetch(`http://localhost:${port}/`, { method: "HEAD" });
            if (response.ok) return port;
        } catch {
            // try next port
        }
    }

    throw new Error("Vite dev server not found. Run npm run dev first.");
}

async function waitForHeroModel(page) {
    await page.waitForSelector("model-viewer.ph3d__viewer", { state: "attached", timeout: 45000 });
    await page.waitForFunction(
        () => {
            const mv = document.querySelector("model-viewer.ph3d__viewer");
            return mv && mv.modelIsVisible;
        },
        { timeout: 45000 },
    );
    await page.waitForTimeout(800);
}

async function readCameraState(page) {
    return page.evaluate(() => {
        const mv = document.querySelector("model-viewer.ph3d__viewer");
        const orbit = mv.getCameraOrbit();
        return {
            thetaDeg: (orbit.theta * 180) / Math.PI,
            phiDeg: (orbit.phi * 180) / Math.PI,
            radiusM: orbit.radius,
            fovDeg: mv.getFieldOfView(),
        };
    });
}

async function main() {
    const port = await detectDevPort();
    const pageUrl = `http://localhost:${port}/?page=real-estate`;

    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });

    console.log(`Using dev server: http://localhost:${port}`);

    await page.goto(pageUrl, { waitUntil: "networkidle" });
    await waitForHeroModel(page);

    await page.evaluate(() => {
        const mv = document.querySelector("model-viewer.ph3d__viewer");
        mv.currentTime = 6.2;
        mv.pause();

        document.body.style.margin = "0";
        document.body.style.background = "linear-gradient(180deg, #ffffff 0%, #f4f7fb 100%)";

        const stage = mv.closest(".ph3d__stage");
        if (stage) {
            stage.style.margin = "0";
            stage.style.width = "1600px";
            stage.style.height = "1200px";
            stage.style.minHeight = "1200px";
            stage.style.borderRadius = "0";
            stage.style.boxShadow = "none";
        }

        mv.style.width = "1600px";
        mv.style.height = "1200px";
        mv.style.display = "block";
    });

    await page.waitForTimeout(1200);
    await waitForHeroModel(page);

    const camera = await readCameraState(page);
    console.log("Matched Real Estate hero camera (use in modelviewer.dev/editor):");
    console.log(
        `  camera-orbit="${camera.thetaDeg.toFixed(1)}deg ${camera.phiDeg.toFixed(1)}deg ${camera.radiusM.toFixed(2)}m"`,
    );
    console.log(`  field-of-view="${camera.fovDeg.toFixed(1)}deg"`);
    console.log('  exposure="1.05" · shadow-intensity="0.45" · environment-image="neutral"');
    console.log("  animation frame: currentTime ≈ 6.2 s (after-state)");

    await page.locator("model-viewer.ph3d__viewer").screenshot({
        path: outPoster,
        type: "png",
        animations: "disabled",
        clip: { x: 0, y: 0, width: 1600, height: 1200 },
    });

    const shot = await loadImage(outPoster);
    const canvas = createCanvas(1600, 1200);
    canvas.getContext("2d").drawImage(shot, 0, 0, 1600, 1200, 0, 0, 1600, 1200);
    await fs.writeFile(outPoster, canvas.toBuffer("image/png"));

    await browser.close();

    const stat = await fs.stat(outPoster);
    console.log(`✓ Poster saved: ${path.relative(root, outPoster)}`);
    console.log(`  File size: ${(stat.size / 1024).toFixed(1)} KB`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
