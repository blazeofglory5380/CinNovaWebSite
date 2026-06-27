import { readFile } from "node:fs/promises";
import path from "node:path";

const MIME_BY_EXT = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
};

export async function prepareImage(imagePath) {
    const absolutePath = path.resolve(imagePath);
    const buffer = await readFile(absolutePath);
    const ext = path.extname(absolutePath).toLowerCase();
    const mimeType = MIME_BY_EXT[ext] || "application/octet-stream";

    return {
        absolutePath,
        fileName: path.basename(absolutePath),
        buffer,
        mimeType,
        base64: buffer.toString("base64"),
        dataUrl: `data:${mimeType};base64,${buffer.toString("base64")}`,
    };
}
