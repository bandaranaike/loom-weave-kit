# Loom Weave Kit Monorepo

Browser-first TypeScript monorepo for weaving design generation and exports.

## Packages

- `@erbitron/loom-weave-kit` (core)
- `@erbitron/loom-weave-kit-export-canvas` (PNG exporter)
- `@erbitron/loom-weave-kit-react` (React hooks)

## Install

```bash
pnpm add @erbitron/loom-weave-kit
pnpm add @erbitron/loom-weave-kit-export-canvas
pnpm add @erbitron/loom-weave-kit-react
```

## Quickstart

```ts
import {
  createDesign,
  addGridLayer,
  setCell,
  createPalette,
  compileDesign,
  exportSVG,
  exportWeaverSheetText
} from '@erbitron/loom-weave-kit';

let design = createDesign({
  productType: 'SAREE',
  fabricId: 'COTTON',
  widthCells: 120,
  heightCells: 240
});
design = addGridLayer(design, { id: 'g1' });
design = setCell(design, 'g1', 10, 10, 1);

const palette = createPalette([
  { id: 1, name: 'Black', hex: '#000000' },
  { id: 2, name: 'Cream', hex: '#F5F0E7' }
]);

const compiled = compileDesign(design, { palette });
const svg = exportSVG(compiled, palette);
const sheet = exportWeaverSheetText(compiled.rowInstructions);
```

## Mixed Colors

Mixed colors are recipe-based combinations of two base colors with deterministic tile patterns:

- Ratios: `50/50`, `75/25`, `25/75`
- Tile sizes: `2x2`, `4x4`

## Constraints

Constraint checks include:

- Max colors
- Minimum feature width
- Run length per row
- Minimum motif size
- Edge margin
- Product zone validity

## Laravel + React + Inertia (Vite)

- Use ESM imports directly in React/Inertia pages/components.
- Persist `DesignJSON` (and optionally compiled JSON) in DB.
- Render SVG previews on product/detail screens.
- Generate weaver sheet text for print flows.

