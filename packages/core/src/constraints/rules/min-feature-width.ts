import type { CompiledOutput, ConstraintIssue, FabricSpec } from '../../types';
import { inflateRLE } from '../../compile/rle';

export function minFeatureWidthRule(compiled: CompiledOutput, fabric: FabricSpec): ConstraintIssue[] {
  const issues: ConstraintIssue[] = [];
  const min = fabric.minFeatureWidthCells;
  const grid = compiled.grid ?? inflateRLE(compiled.rleRows, compiled.widthCells, compiled.heightCells);
  for (let y = 0; y < compiled.heightCells; y += 1) {
    let x = 0;
    while (x < compiled.widthCells) {
      const id = grid[y * compiled.widthCells + x];
      let end = x + 1;
      while (end < compiled.widthCells && grid[y * compiled.widthCells + end] === id) end += 1;
      const run = end - x;
      if (id !== 0 && run < min) {
        issues.push({
          id: 'min-feature-width',
          severity: 'warning',
          message: `Feature width ${run} below minimum ${min}.`,
          region: { x, y, w: run, h: 1 },
          suggestedFixes: [{ kind: 'inflate-feature', message: 'Expand this feature to minimum width.' }]
        });
      }
      x = end;
    }
  }
  return issues;
}
