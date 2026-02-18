import type { CompileMetrics, FabricSpec, RowRun } from '../types';

export function createMetrics(
  rleRows: RowRun[][],
  width: number,
  height: number,
  fabric: FabricSpec,
  mixedColorsUsedOverride?: number
): CompileMetrics {
  const seenBase = new Set<number>();
  const seenMixed = new Set<number>();
  let maxRunsInAnyRow = 0;
  for (const row of rleRows) {
    maxRunsInAnyRow = Math.max(maxRunsInAnyRow, row.length);
    for (const [id] of row) {
      if (id === 0) continue;
      if (id < 100) seenBase.add(id);
      else seenMixed.add(id);
    }
  }
  return {
    distinctBaseColorsUsed: seenBase.size,
    distinctMixedColorsUsed: mixedColorsUsedOverride ?? seenMixed.size,
    maxRunsInAnyRow,
    totalCells: width * height,
    widthCells: width,
    heightCells: height,
    estimatedWidthCm: width / fabric.cellsPerCmX,
    estimatedHeightCm: height / fabric.cellsPerCmY
  };
}
