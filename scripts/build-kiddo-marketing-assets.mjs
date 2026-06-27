/**
 * Build interim Kiddo marketing PNGs from approved character portraits.
 * Uses real character library art — not concept-sheet auto-crops or SVG wireframes.
 *
 * Usage: node scripts/build-kiddo-marketing-assets.mjs
 */
import sharp from "sharp";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const kiddoRoot = join(root, "public", "images", "Kiddo");
const charactersDir = join(kiddoRoot, "characters");

const outDirs = ["branding", "worlds", "gameplay", "ui"];
for (const dir of outDirs) {
    const p = join(kiddoRoot, dir);
    if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

async function loadCharacter(name, targetHeight) {
    const path = join(charactersDir, name);
    const img = sharp(path).ensureAlpha();
    const meta = await img.metadata();
    const scale = targetHeight / meta.height;
    const width = Math.round(meta.width * scale);
    return img.resize(width, targetHeight, { fit: "inside" }).png().toBuffer();
}

function linearGradientSvg(width, height, stops, angle = 135) {
    const rad = (angle * Math.PI) / 180;
    const x1 = 50 - Math.cos(rad) * 50;
    const y1 = 50 - Math.sin(rad) * 50;
    const x2 = 50 + Math.cos(rad) * 50;
    const y2 = 50 + Math.sin(rad) * 50;
    const stopTags = stops.map(([offset, color]) => `<stop offset="${offset}%" stop-color="${color}"/>`).join("");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <linearGradient id="g" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">${stopTags}</linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
</svg>`;
    return Buffer.from(svg);
}

async function gradientBg(width, height, stops, angle) {
    return sharp(linearGradientSvg(width, height, stops, angle)).png().toBuffer();
}

async function compositeLayers(width, height, layers) {
    let canvas = sharp({
        create: {
            width,
            height,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
    });

    const composites = [];
    for (const layer of layers) {
        if (layer.type === "gradient") {
            const bg = await gradientBg(layer.w || width, layer.h || height, layer.stops, layer.angle);
            composites.push({ input: bg, top: layer.top ?? 0, left: layer.left ?? 0 });
        } else if (layer.type === "svg") {
            const buf = Buffer.from(layer.svg);
            const img = await sharp(buf).resize(layer.w, layer.h).png().toBuffer();
            composites.push({ input: img, top: layer.top, left: layer.left });
        } else if (layer.type === "character") {
            const img = await loadCharacter(layer.file, layer.height);
            const meta = await sharp(img).metadata();
            composites.push({
                input: img,
                top: layer.top,
                left: layer.left ?? Math.round((width - meta.width) / 2),
            });
        } else if (layer.type === "image") {
            composites.push({ input: layer.input, top: layer.top, left: layer.left });
        }
    }

    return canvas.composite(composites).png({ compressionLevel: 9 }).toBuffer();
}

function hillSvg(width, height, color, opacity = 1) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <path d="M0 ${height * 0.55} C ${width * 0.2} ${height * 0.35}, ${width * 0.45} ${height * 0.62}, ${width * 0.65} ${height * 0.48}
    C ${width * 0.82} ${height * 0.36}, ${width * 0.92} ${height * 0.5}, ${width} ${height * 0.44} L ${width} ${height} L 0 ${height} Z"
    fill="${color}" opacity="${opacity}"/>
</svg>`;
}

function pathSvg(width, height) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <path d="M ${width * 0.08} ${height * 0.72} C ${width * 0.28} ${height * 0.62}, ${width * 0.42} ${height * 0.78}, ${width * 0.58} ${height * 0.66}
    C ${width * 0.74} ${height * 0.54}, ${width * 0.86} ${height * 0.7}, ${width * 0.94} ${height * 0.6}"
    stroke="#f59e0b" stroke-width="18" fill="none" stroke-linecap="round"/>
</svg>`;
}

async function buildHero() {
    const w = 1200;
    const h = 900;
    const sky = await gradientBg(w, h, [
        [0, "#fde68a"],
        [45, "#fda4af"],
        [100, "#a5b4fc"],
    ]);
    const hill1 = await sharp(Buffer.from(hillSvg(w, h, "#34d399", 0.95))).png().toBuffer();
    const hill2 = await sharp(Buffer.from(hillSvg(w, h, "#059669", 0.35))).png().toBuffer();
    const trail = await sharp(Buffer.from(pathSvg(w, h))).png().toBuffer();

    const [kiki, nova, hoot, splash, penny] = await Promise.all([
        loadCharacter("kiki.png", 320),
        loadCharacter("nova.png", 300),
        loadCharacter("professor-hoot.png", 280),
        loadCharacter("splash.png", 260),
        loadCharacter("penny-panda.png", 270),
    ]);

    const out = await sharp(sky)
        .composite([
            { input: hill1, top: 0, left: 0 },
            { input: hill2, top: 0, left: 0 },
            { input: trail, top: 0, left: 0 },
            { input: kiki, top: 420, left: 80 },
            { input: hoot, top: 380, left: 300 },
            { input: nova, top: 350, left: 520 },
            { input: splash, top: 400, left: 760 },
            { input: penny, top: 410, left: 940 },
        ])
        .png({ compressionLevel: 9 })
        .toBuffer();

    const path = join(kiddoRoot, "branding", "kiddo-hero.png");
    writeFileSync(path, out);
    return { file: "branding/kiddo-hero.png", width: w, height: h, bytes: out.length };
}

const worldDefs = [
    {
        file: "alphabet-forest.png",
        character: "kiki.png",
        stops: [
            [0, "#bbf7d0"],
            [55, "#34d399"],
            [100, "#059669"],
        ],
        decor: "#166534",
        label: "Aa",
    },
    {
        file: "number-mountain.png",
        character: "penny-panda.png",
        stops: [
            [0, "#fde68a"],
            [55, "#fbbf24"],
            [100, "#d97706"],
        ],
        decor: "#92400e",
        label: "123",
    },
    {
        file: "reading-castle.png",
        character: "professor-hoot.png",
        stops: [
            [0, "#ddd6fe"],
            [55, "#a78bfa"],
            [100, "#7c3aed"],
        ],
        decor: "#5b21b6",
        label: "📖",
    },
    {
        file: "science-lab.png",
        character: "nova.png",
        stops: [
            [0, "#bae6fd"],
            [55, "#38bdf8"],
            [100, "#0284c7"],
        ],
        decor: "#075985",
        label: "⚗",
    },
    {
        file: "ocean-discovery.png",
        character: "splash.png",
        stops: [
            [0, "#99f6e4"],
            [55, "#2dd4bf"],
            [100, "#0f766e"],
        ],
        decor: "#115e59",
        label: "🐠",
    },
    {
        file: "space-explorer.png",
        character: "captain-leo.png",
        stops: [
            [0, "#c7d2fe"],
            [55, "#818cf8"],
            [100, "#4338ca"],
        ],
        decor: "#312e81",
        label: "★",
    },
];

function worldDecorSvg(w, h, color, label) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <circle cx="${w * 0.15}" cy="${h * 0.2}" r="42" fill="white" opacity="0.22"/>
  <circle cx="${w * 0.82}" cy="${h * 0.16}" r="28" fill="white" opacity="0.18"/>
  <rect x="${w * 0.08}" y="${h * 0.12}" width="${w * 0.22}" height="56" rx="28" fill="${color}" opacity="0.35"/>
  <text x="${w * 0.19}" y="${h * 0.17}" text-anchor="middle" font-family="system-ui,sans-serif" font-size="28" font-weight="800" fill="#ffffff">${label}</text>
</svg>`;
}

async function buildWorld(def) {
    const w = 1280;
    const h = 800;
    const bg = await gradientBg(w, h, def.stops, 160);
    const decor = await sharp(Buffer.from(worldDecorSvg(w, h, def.decor, def.label))).png().toBuffer();
    const character = await loadCharacter(def.character, 520);

    const out = await sharp(bg)
        .composite([
            { input: decor, top: 0, left: 0 },
            { input: character, top: 200, left: Math.round(w * 0.34) },
        ])
        .png({ compressionLevel: 9 })
        .toBuffer();

    const path = join(kiddoRoot, "worlds", def.file);
    writeFileSync(path, out);
    return { file: `worlds/${def.file}`, width: w, height: h, bytes: out.length };
}

function uiMockSvg(kind) {
    if (kind === "gameplay") {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1100" viewBox="0 0 900 1100">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fdf4ff"/>
      <stop offset="100%" stop-color="#fde68a"/>
    </linearGradient>
    <filter id="shadow"><feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="#431407" flood-opacity="0.12"/></filter>
  </defs>
  <rect width="900" height="1100" fill="url(#bg)"/>
  <g filter="url(#shadow)">
    <rect x="70" y="70" width="760" height="960" rx="42" fill="#ffffff"/>
    <rect x="110" y="110" width="680" height="88" rx="22" fill="#fef3c7"/>
    <text x="145" y="165" font-family="system-ui,sans-serif" font-size="30" font-weight="800" fill="#92400e">Alphabet Quest</text>
    <circle cx="720" cy="154" r="30" fill="#fbbf24"/><text x="720" y="164" text-anchor="middle" font-size="22" fill="#fff">★</text>
    <path d="M150 430 C280 330 390 500 520 390 C650 280 720 430 780 350" stroke="#f59e0b" stroke-width="12" fill="none" stroke-dasharray="14 10" stroke-linecap="round"/>
    <circle cx="150" cy="430" r="48" fill="#34d399"/><text x="150" y="445" text-anchor="middle" font-size="30" font-weight="800" fill="#fff">A</text>
    <circle cx="520" cy="390" r="48" fill="#fb7185"/><text x="520" y="405" text-anchor="middle" font-size="30" font-weight="800" fill="#fff">B</text>
    <circle cx="780" cy="350" r="48" fill="#a78bfa" opacity="0.5"/><text x="780" y="365" text-anchor="middle" font-size="30" font-weight="800" fill="#fff">C</text>
    <rect x="110" y="700" width="300" height="180" rx="24" fill="#fff7ed"/>
    <text x="145" y="760" font-family="system-ui,sans-serif" font-size="24" font-weight="800" fill="#9a3412">Daily streak</text>
    <circle cx="170" cy="830" r="22" fill="#fbbf24"/><circle cx="230" cy="830" r="22" fill="#fbbf24"/><circle cx="290" cy="830" r="22" fill="#fbbf24"/><circle cx="350" cy="830" r="22" fill="#e5e7eb"/>
    <rect x="450" y="700" width="340" height="180" rx="24" fill="#ede9fe"/>
    <text x="485" y="760" font-family="system-ui,sans-serif" font-size="24" font-weight="800" fill="#5b21b6">Treasure found!</text>
    <text x="485" y="830" font-family="system-ui,sans-serif" font-size="42" font-weight="800" fill="#7c3aed">+50 stars</text>
    <rect x="110" y="910" width="680" height="80" rx="20" fill="#dcfce7"/>
    <text x="145" y="962" font-family="system-ui,sans-serif" font-size="24" font-weight="700" fill="#166534">2 of 3 clues found in Alphabet Forest</text>
  </g>
</svg>`;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1100" viewBox="0 0 900 1100">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fff7ed"/>
      <stop offset="100%" stop-color="#ffedd5"/>
    </linearGradient>
    <filter id="shadow"><feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="#431407" flood-opacity="0.12"/></filter>
  </defs>
  <rect width="900" height="1100" fill="url(#bg)"/>
  <g filter="url(#shadow)">
    <rect x="70" y="70" width="760" height="960" rx="42" fill="#ffffff"/>
    <rect x="110" y="110" width="680" height="78" rx="20" fill="#ffedd5"/>
    <text x="145" y="162" font-family="system-ui,sans-serif" font-size="32" font-weight="800" fill="#9a3412">Emma's Learning Week</text>
    <text x="700" y="162" font-family="system-ui,sans-serif" font-size="22" font-weight="700" fill="#c2410c">Age 5</text>
    <rect x="110" y="220" width="200" height="140" rx="18" fill="#fef3c7"/>
    <text x="140" y="270" font-family="system-ui,sans-serif" font-size="18" font-weight="700" fill="#78350f">Lessons</text>
    <text x="140" y="325" font-family="system-ui,sans-serif" font-size="44" font-weight="800" fill="#92400e">14</text>
    <rect x="330" y="220" width="200" height="140" rx="18" fill="#fce7f3"/>
    <text x="360" y="270" font-family="system-ui,sans-serif" font-size="18" font-weight="700" fill="#9d174d">Learned</text>
    <text x="360" y="325" font-family="system-ui,sans-serif" font-size="36" font-weight="800" fill="#be185d">3h 20m</text>
    <rect x="550" y="220" width="240" height="140" rx="18" fill="#dbeafe"/>
    <text x="580" y="270" font-family="system-ui,sans-serif" font-size="18" font-weight="700" fill="#1e40af">Accuracy</text>
    <text x="580" y="325" font-family="system-ui,sans-serif" font-size="44" font-weight="800" fill="#1d4ed8">92%</text>
    <rect x="110" y="390" width="680" height="220" rx="22" fill="#fff7ed"/>
    <text x="145" y="435" font-family="system-ui,sans-serif" font-size="16" font-weight="800" fill="#c2410c">PARENT INSIGHT</text>
    <text x="145" y="485" font-family="system-ui,sans-serif" font-size="24" fill="#78350f">Reading is Emma's superpower this week.</text>
    <text x="145" y="525" font-family="system-ui,sans-serif" font-size="24" fill="#78350f">Try 10 minutes of counting play tomorrow.</text>
    <rect x="110" y="640" width="320" height="110" rx="18" fill="#dcfce7"/>
    <text x="145" y="705" font-family="system-ui,sans-serif" font-size="22" font-weight="700" fill="#166534">Screen time: 25 min today</text>
    <rect x="470" y="640" width="320" height="110" rx="18" fill="#ede9fe"/>
    <text x="505" y="705" font-family="system-ui,sans-serif" font-size="22" font-weight="700" fill="#5b21b6">Safe mode: ON</text>
    <rect x="110" y="780" width="680" height="180" rx="22" fill="#fef3c7"/>
    <text x="145" y="835" font-family="system-ui,sans-serif" font-size="22" font-weight="800" fill="#92400e">Weekly progress</text>
    <rect x="145" y="860" width="90" height="70" rx="10" fill="#fbbf24"/><rect x="255" y="875" width="90" height="55" rx="10" fill="#fb7185"/>
    <rect x="365" y="845" width="90" height="85" rx="10" fill="#34d399"/><rect x="475" y="870" width="90" height="60" rx="10" fill="#60a5fa"/>
    <rect x="585" y="855" width="90" height="75" rx="10" fill="#a78bfa"/><rect x="695" y="880" width="70" height="50" rx="10" fill="#f472b6"/>
  </g>
</svg>`;
}

async function buildUiMock(kind, relativePath) {
    const svg = uiMockSvg(kind);
    const base = await sharp(Buffer.from(svg)).png().toBuffer();
    const kiki = await loadCharacter("kiki.png", 220);
    const out =
        kind === "gameplay"
            ? await sharp(base)
                  .composite([{ input: kiki, top: 500, left: 560 }])
                  .png({ compressionLevel: 9 })
                  .toBuffer()
            : base;

    const path = join(kiddoRoot, relativePath);
    writeFileSync(path, out);
    const meta = await sharp(out).metadata();
    return { file: relativePath, width: meta.width, height: meta.height, bytes: out.length };
}

const hero = await buildHero();
console.log("built", hero.file, `${hero.width}x${hero.height}`, hero.bytes, "bytes");

for (const def of worldDefs) {
    const result = await buildWorld(def);
    console.log("built", result.file, `${result.width}x${result.height}`, result.bytes, "bytes");
}

const gameplay = await buildUiMock("gameplay", "gameplay/app-preview.png");
console.log("built", gameplay.file, `${gameplay.width}x${gameplay.height}`, gameplay.bytes, "bytes");

const dashboard = await buildUiMock("dashboard", "ui/parent-dashboard.png");
console.log("built", dashboard.file, `${dashboard.width}x${dashboard.height}`, dashboard.bytes, "bytes");
