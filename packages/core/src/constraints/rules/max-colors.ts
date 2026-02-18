import type { ConstraintIssue, Design, FabricSpec, Palette } from '../../types';

export function maxColorsRule(
  _design: Design,
  palette: Palette | undefined,
  fabric: FabricSpec
): ConstraintIssue[] {
  if (!palette) return [];
  const issues: ConstraintIssue[] = [];
  if (palette.base.length > fabric.maxPaletteColors) {
    issues.push({
      id: 'max-colors',
      severity: 'error',
      message: `Base colors ${palette.base.length} exceed fabric limit ${fabric.maxPaletteColors}.`,
      suggestedFixes: [{ kind: 'replace-color', message: 'Reduce base color count.' }]
    });
  }
  if (palette.mixed.length > 4) {
    issues.push({
      id: 'max-colors-mixed',
      severity: 'error',
      message: 'Mixed colors exceed max 4.',
      suggestedFixes: [{ kind: 'replace-color', message: 'Reduce mixed color recipes.' }]
    });
  }
  return issues;
}
