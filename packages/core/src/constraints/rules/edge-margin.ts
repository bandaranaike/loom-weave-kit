import type { CompiledOutput, ConstraintIssue, Zone } from '../../types';
import { inflateRLE } from '../../compile/rle';

function inBorderZone(x: number, y: number, zones?: Zone[]): boolean {
  if (!zones || zones.length === 0) return false;
  return zones.some((z) => {
    const isBorder = z.name.includes('BORDER');
    if (!isBorder) return false;
    return x >= z.x && x < z.x + z.w && y >= z.y && y < z.y + z.h;
  });
}

export function edgeMarginRule(
  compiled: CompiledOutput,
  zones?: Zone[],
  margin = 2
): ConstraintIssue[] {
  const issues: ConstraintIssue[] = [];
  const grid = compiled.grid ?? inflateRLE(compiled.rleRows, compiled.widthCells, compiled.heightCells);
  for (let y = 0; y < compiled.heightCells; y += 1) {
    for (let x = 0; x < compiled.widthCells; x += 1) {
      const nearEdge =
        x < margin || y < margin || x >= compiled.widthCells - margin || y >= compiled.heightCells - margin;
      if (!nearEdge || inBorderZone(x, y, zones)) continue;
      const v = grid[y * compiled.widthCells + x];
      if (v !== 0) {
        issues.push({
          id: 'edge-margin',
          severity: 'warning',
          message: `Color used inside protected edge margin (${margin} cells).`,
          region: { x, y, w: 1, h: 1 },
          suggestedFixes: [{ kind: 'move-inset', message: 'Move details inward from edges.' }]
        });
      }
    }
  }
  return issues;
}
