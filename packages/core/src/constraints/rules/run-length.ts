import type { CompiledOutput, ConstraintIssue } from '../../types';

export function runLengthRule(compiled: CompiledOutput, maxRunsPerRow = 32): ConstraintIssue[] {
  const issues: ConstraintIssue[] = [];
  compiled.rleRows.forEach((row, y) => {
    if (row.length > maxRunsPerRow) {
      issues.push({
        id: 'run-length',
        severity: 'warning',
        message: `Row ${y + 1} has ${row.length} runs; max allowed is ${maxRunsPerRow}.`,
        region: { x: 0, y, w: compiled.widthCells, h: 1 },
        suggestedFixes: [{ kind: 'simplify-row', message: 'Merge nearby color segments in this row.' }]
      });
    }
  });
  return issues;
}
