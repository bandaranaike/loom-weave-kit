import type { ConstraintIssue, Design } from '../../types';

export function minMotifSizeRule(design: Design, minCells = 4): ConstraintIssue[] {
  const issues: ConstraintIssue[] = [];
  for (const layer of design.layers) {
    if (layer.kind !== 'motif') continue;
    if (layer.width < minCells || layer.height < minCells) {
      issues.push({
        id: 'min-motif-size',
        severity: 'warning',
        message: `Motif ${layer.id} is smaller than ${minCells}x${minCells}.`,
        region: { x: layer.x, y: layer.y, w: layer.width, h: layer.height }
      });
    }
  }
  return issues;
}
