# 00 Overview

## Objective

Create a TypeScript pnpm monorepo that publishes:

- `@erbitron/loom-weave-kit`
- `@erbitron/loom-weave-kit-export-canvas`
- `@erbitron/loom-weave-kit-react`

## Non-Negotiables

- ESM-first, tree-shakable packages.
- Strong TypeScript types.
- Browser-first core package (no Node-only dependencies, no DOM globals).
- Laravel + React + Inertia compatibility (Vite preferred).

## Domain Defaults

- Products (cm): Saree, Sarong, Wall Hanger, Pillow Case, Bedsheet.
- Fabrics: Cotton, SilkBlend, Linen, Rayon.
- Palette:
- Base max: 8 (fabric may override)
- Mixed max: 4
- Ratios: `50/50`, `75/25`, `25/75`
- Dither tiles: `2x2`, `4x4` deterministic
- Optional zones with default Saree zones:
- `BORDER_LEFT`, `BORDER_RIGHT`, `PALLU_END`, `BODY`

