import { readFile } from "node:fs/promises";
import path from "node:path";

const SPECIES_PROMPT = `You are PoisonGuard hazard identification AI. Analyze the image and identify the most likely plant, animal, or hazardous substance species visible.

Return strict JSON with this shape:
{
  "matches": [
    { "species": "Common Name", "confidence": 0.95 }
  ]
}

Rules:
- Provide exactly 5 matches sorted by confidence descending.
- confidence must be a number between 0 and 1.
- Use common English species names.
- If uncertain, include "Unknown plant" or "Unknown animal" with lower confidence.`;

function parseMatchesPayload(raw) {
    let parsed = raw;

    if (typeof raw === "string") {
        const jsonStart = raw.indexOf("{");
        const jsonEnd = raw.lastIndexOf("}");
        if (jsonStart >= 0 && jsonEnd > jsonStart) {
            parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));
        } else {
            throw new Error("Inference response did not contain JSON");
        }
    }

    const matches = Array.isArray(parsed?.matches) ? parsed.matches : [];
    return matches
        .map((match, index) => ({
            rank: index + 1,
            species: String(match?.species || "Unknown").trim(),
            confidence: Number(match?.confidence ?? 0),
        }))
        .filter((match) => match.species)
        .slice(0, 5);
}

function normalizeMatches(matches) {
    return matches
        .map((match, index) => ({
            rank: index + 1,
            species: match.species,
            confidence: Math.max(0, Math.min(1, Number(match.confidence) || 0)),
        }))
        .slice(0, 5);
}

export async function inferWithCustomApi(preparedImage) {
    const apiUrl = process.env.SCANNER_API_URL;
    const apiKey = process.env.SCANNER_API_KEY;

    if (!apiUrl) {
        return null;
    }

    const form = new FormData();
    form.append(
        "image",
        new Blob([preparedImage.buffer], { type: preparedImage.mimeType }),
        preparedImage.fileName,
    );

    const headers = {};
    if (apiKey) {
        headers.Authorization = `Bearer ${apiKey}`;
    }

    const response = await fetch(apiUrl, {
        method: "POST",
        headers,
        body: form,
    });

    if (!response.ok) {
        throw new Error(`Scanner API failed (${response.status}): ${await response.text()}`);
    }

    const payload = await response.json();
    const matches = normalizeMatches(parseMatchesPayload(payload));

    if (!matches.length) {
        throw new Error("Scanner API returned no species matches");
    }

    return { provider: "scanner-api", matches };
}

export async function inferWithOpenAI(preparedImage) {
    const apiKey = process.env.OPENAI_API_KEY || process.env.SCANNER_OPENAI_API_KEY;
    if (!apiKey) {
        return null;
    }

    const model = process.env.SCANNER_OPENAI_MODEL || "gpt-4o-mini";
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model,
            response_format: { type: "json_object" },
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: SPECIES_PROMPT },
                        {
                            type: "image_url",
                            image_url: { url: preparedImage.dataUrl },
                        },
                    ],
                },
            ],
        }),
    });

    if (!response.ok) {
        throw new Error(`OpenAI inference failed (${response.status}): ${await response.text()}`);
    }

    const payload = await response.json();
    const content = payload?.choices?.[0]?.message?.content;
    const matches = normalizeMatches(parseMatchesPayload(content));

    if (!matches.length) {
        throw new Error("OpenAI inference returned no species matches");
    }

    return { provider: `openai:${model}`, matches };
}

export async function inferWithSidecar(preparedImage) {
    const sidecarPath = `${preparedImage.absolutePath}.sidecar.json`;
    try {
        const raw = await readFile(sidecarPath, "utf8");
        const payload = JSON.parse(raw);
        const matches = normalizeMatches(parseMatchesPayload(payload));
        if (!matches.length) {
            throw new Error(`Sidecar ${sidecarPath} has no matches`);
        }
        return { provider: "sidecar", matches, sidecarPath };
    } catch (error) {
        if (error.code === "ENOENT") {
            return null;
        }
        throw error;
    }
}

export async function inferWithSharedSidecar(preparedImage, sidecarDir) {
    if (!sidecarDir) {
        return null;
    }

    const stem = path.basename(preparedImage.absolutePath, path.extname(preparedImage.absolutePath));
    const sidecarPath = path.resolve(sidecarDir, `${stem}.sidecar.json`);

    try {
        const raw = await readFile(sidecarPath, "utf8");
        const payload = JSON.parse(raw);
        const matches = normalizeMatches(parseMatchesPayload(payload));
        if (!matches.length) {
            throw new Error(`Sidecar ${sidecarPath} has no matches`);
        }
        return { provider: "sidecar-shared", matches, sidecarPath };
    } catch (error) {
        if (error.code === "ENOENT") {
            return null;
        }
        throw error;
    }
}

export async function runInference(preparedImage, options = {}) {
    const providerPreference = options.provider || process.env.SCANNER_INFERENCE_PROVIDER || "auto";
    const sidecarDir = options.sidecarDir || process.env.SCANNER_SIDECAR_DIR;

    const attempts = [];

    if (providerPreference === "sidecar") {
        attempts.push(() => inferWithSidecar(preparedImage));
        attempts.push(() => inferWithSharedSidecar(preparedImage, sidecarDir));
    } else if (providerPreference === "openai") {
        attempts.push(() => inferWithOpenAI(preparedImage));
    } else if (providerPreference === "api") {
        attempts.push(() => inferWithCustomApi(preparedImage));
    } else {
        attempts.push(() => inferWithCustomApi(preparedImage));
        attempts.push(() => inferWithOpenAI(preparedImage));
        attempts.push(() => inferWithSidecar(preparedImage));
        attempts.push(() => inferWithSharedSidecar(preparedImage, sidecarDir));
    }

    const errors = [];
    for (const attempt of attempts) {
        try {
            const result = await attempt();
            if (result) {
                return result;
            }
        } catch (error) {
            errors.push(error.message);
        }
    }

    throw new Error(
        `No inference provider available for ${preparedImage.fileName}. ` +
            `Set SCANNER_API_URL, OPENAI_API_KEY, or provide a .sidecar.json file. ` +
            (errors.length ? `Errors: ${errors.join(" | ")}` : ""),
    );
}
