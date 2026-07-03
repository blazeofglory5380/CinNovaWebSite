# CinNova Motion Library v1.0

Official reusable animation infrastructure for all CinNova products.

**Products covered:** CinNova Website, PoisonGuard, StudyNest, Real Estate AI, TechMate AI, Kiddo, Nightmare Forest

> This package is **standalone**. It does not modify `D:\CinNovaWebSite` or any existing production code.

## Features

- 70+ registered animation presets
- React components: `Motion`, `MotionCard`, `MotionButton`, transitions, AI, dashboard, loaders
- Product-specific modules with typed components
- 3D scene wrappers (Meshy, Three.js, R3F, Unity) — placeholders only
- `prefers-reduced-motion` support
- GPU-accelerated CSS animations
- Tree-shakeable subpath exports

## Quick start

```bash
cd "G:\CinNova Projects\cinnova-motion"
npm install
npm run typecheck
npm run showcase
```

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Usage Guide](docs/USAGE.md)
- [Roadmap](docs/ROADMAP.md)

## Package exports

| Import | Contents |
|--------|----------|
| `@cinnova/motion` | Full library + CSS |
| `@cinnova/motion/motion.css` | Styles only |
| `@cinnova/motion/kiddo` | Kiddo animations |
| `@cinnova/motion/poisonguard` | PoisonGuard animations |
| `@cinnova/motion/studynest` | StudyNest animations |
| `@cinnova/motion/realestate` | Real Estate AI animations |
| `@cinnova/motion/techmate` | TechMate AI animations |
| `@cinnova/motion/nightmare` | Nightmare Forest animations |

## License

Private — CinNova internal use.
