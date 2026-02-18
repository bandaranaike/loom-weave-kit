import type { RowRun } from '../types';

export function exportWeaverSheetTextLines(
  rleRows: RowRun[][],
  colorNamer: (id: number) => string
): string[] {
  return rleRows.map((row, i) => {
    const rowLabel = `Row ${String(i + 1).padStart(4, '0')}`;
    const parts = row.map(([id, count]) => `${colorNamer(id)}(${count})`).join(' ');
    return `${rowLabel}: ${parts}`;
  });
}

export function exportWeaverSheetText(rowInstructions: string[]): string {
  return rowInstructions.join('\n');
}
