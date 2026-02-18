import { getFabricSpec } from '../fabrics';
import type { CompiledOutput, CompileConfig, Design, Palette } from '../types';
import { exportWeaverSheetTextLines } from '../export/weaver-sheet';
import { ditherPick } from './dithers';
import { createMetrics } from './metrics';
import { rasterizeDesign } from './rasterize';
import { encodeGridRLE } from './rle';

function colorName(id: number, palette: Palette): string {
  const base = palette.base.find((c) => c.id === id);
  if (base) return base.name;
  const mixed = palette.mixed.find((c) => c.id === id);
  if (mixed) return mixed.name;
  return id === 0 ? 'EMPTY' : `C${id}`;
}

function materializeMixedColors(
  grid: Uint16Array,
  width: number,
  height: number,
  palette: Palette
): { grid: Uint16Array; mixedUsed: Set<number> } {
  const out = new Uint16Array(grid);
  const mixedMap = new Map(palette.mixed.map((m) => [m.id, m]));
  const mixedUsed = new Set<number>();
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const idx = y * width + x;
      const id = out[idx];
      const mixed = mixedMap.get(id);
      if (!mixed) continue;
      mixedUsed.add(id);
      out[idx] = ditherPick(mixed.recipe.tile, mixed.recipe.ratio, x, y)
        ? mixed.recipe.a
        : mixed.recipe.b;
    }
  }
  return { grid: out, mixedUsed };
}

export function compileDesign(
  design: Design,
  input: { palette: Palette; config?: CompileConfig }
): CompiledOutput {
  const raster = rasterizeDesign(design, input.palette);
  const mixedMaterialized = materializeMixedColors(
    raster,
    design.widthCells,
    design.heightCells,
    input.palette
  );
  const grid = mixedMaterialized.grid;
  const rleRows = encodeGridRLE(grid, design.widthCells, design.heightCells);
  const fabric = getFabricSpec(design.fabricId);
  const metrics = createMetrics(
    rleRows,
    design.widthCells,
    design.heightCells,
    fabric,
    mixedMaterialized.mixedUsed.size
  );
  const rowInstructions = exportWeaverSheetTextLines(rleRows, (id) => colorName(id, input.palette));
  return {
    widthCells: design.widthCells,
    heightCells: design.heightCells,
    rleRows,
    rowInstructions,
    metrics
  };
}
