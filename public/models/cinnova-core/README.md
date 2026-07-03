# CinNova Core — hero model & optimization pipeline

The AI Core rendered by `CinNovaCoreHero` / `CinNovaCoreScene`.

## Assets in this folder

| File | Role | Tracked? |
| --- | --- | --- |
| `CinNova_AI_Core_v2.glb` | **Current master** — Meshy export. Source of truth. **Never overwrite or hand-edit.** | archive |
| `CinNova_AI_Core_v2.web.glb` | **Current web** — Draco-compressed, derived from the v2 master. **The served artifact** (current `modelPath` default). Safe to delete/regenerate. | derived |
| `cinnova-ai-core-v2.png` | Reference render of the v2 master. | archive |
| `CinNova_AI_Core_v1.0.glb` | Previous master — kept for rollback. | archive |
| `CinNova_AI_Core_v1.0.web.glb` | Previous web — kept for rollback (flip `modelPath` back to this). | derived |
| `cinnova-ai-core-v1-front.png` | Reference render of the v1 master. | archive |

> Do **not** replace the master with a prototype/placeholder asset. The web
> version is always *derived* from the master by the pipeline below.
> Rollback to v1 = point `modelPath` at `CinNova_AI_Core_v1.0.web.glb`.

## Optimization pipeline

Reproducible, master-in / web-out. The master is opened read-only.

```
npm run optimize:core-model
```

Runs `scripts/optimize-core-model.mjs`:

1. `dedup()` — merge duplicate accessors/meshes/textures
2. `prune()` — drop unused nodes/materials/data
3. `weld()` — merge equivalent vertices
4. `textureCompress()` — WebP + resize to 2048 (optional; needs a working `sharp`)
5. `draco()` — **Draco** geometry compression (KHR_draco_mesh_compression)

Tooling: `@gltf-transform/core` + `@gltf-transform/functions`, Draco encoder
via `draco3dgltf`, textures via `sharp`.

### Current result

`CinNova_AI_Core_v2.glb` (~64 MB) → `CinNova_AI_Core_v2.web.glb` (~38 MB),
**Draco geometry only** (39.6% smaller). (v1 was ~40 MB → ~28 MB.) Most of the
remaining weight is textures — enabling the `sharp` texture step (WebP + 2048
resize) is expected to cut this to a few MB. `sharp` was unavailable in the
environment that last generated these files (native binary load failure), so
the texture step was skipped; re-run on a host with a working `sharp` to
capture the texture savings.

## Versioning workflow (future Core releases)

1. Drop the new Meshy master in as `CinNova_AI_Core_v1.1.glb` (keep old masters).
2. Regenerate the web asset:
   ```
   npm run optimize:core-model -- --in CinNova_AI_Core_v1.1.glb --out CinNova_AI_Core_v1.1.web.glb
   ```
3. Point the hero at the new web file via the `modelPath` prop.

The master always stays the archived original; the `.web.glb` is the served,
derived artifact.

## Runtime loading

`CinNovaCoreHero` / `CinNovaCoreScene` take a `modelPath` prop
(default `/models/cinnova-core/CinNova_AI_Core_v2.web.glb`).

- **present** + WebGL + motion allowed → lazy-loads Three.js, renders the Core
  (slow rotate + emerald pulse).
- **missing** / no WebGL / reduced-motion / load error → CSS emerald-orb
  fallback (never the Earth model).

### Draco decoding (wired)

The scene registers a `DRACOLoader` **only** for `*.web.glb` paths; plain
masters load with a bare `GLTFLoader`. The decoder is hosted at `public/draco/`
(`draco_wasm_wrapper.js`, `draco_decoder.wasm`, `draco_decoder.js`) — copied
from `three/examples/jsm/libs/draco/gltf/`; refresh it when `three` is upgraded.

`vercel.json` CSP allows this: `worker-src 'self' blob:` (DRACOLoader's worker)
and `'wasm-unsafe-eval'` in `script-src` (Draco WASM). `public/draco/` is also
excluded from the SPA rewrite so the decoder files are served directly.
