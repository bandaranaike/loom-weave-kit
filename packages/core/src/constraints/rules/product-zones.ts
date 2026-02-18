import type { ConstraintIssue, Design } from '../../types';

export function productZonesRule(design: Design): ConstraintIssue[] {
  if (!design.zones || design.zones.length === 0) return [];
  const issues: ConstraintIssue[] = [];
  for (const zone of design.zones) {
    const outside =
      zone.x < 0 ||
      zone.y < 0 ||
      zone.x + zone.w > design.widthCells ||
      zone.y + zone.h > design.heightCells;
    if (outside) {
      issues.push({
        id: 'product-zones',
        severity: 'warning',
        message: `Zone ${zone.name} exceeds design bounds.`,
        region: { x: zone.x, y: zone.y, w: zone.w, h: zone.h }
      });
    }
  }
  return issues;
}
