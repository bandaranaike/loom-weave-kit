import type { CompiledOutput, Design } from '../types';
import { serializeDesign } from '../design/serialize';

function stable(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
      a.localeCompare(b)
    );
    const out: Record<string, unknown> = {};
    for (const [k, v] of entries) out[k] = stable(v);
    return out;
  }
  return value;
}

export function exportDesignJSON(design: Design): string {
  return JSON.stringify(stable(serializeDesign(design)));
}

export function exportCompiledJSON(compiled: CompiledOutput): string {
  return JSON.stringify(
    stable({
      widthCells: compiled.widthCells,
      heightCells: compiled.heightCells,
      rleRows: compiled.rleRows,
      rowInstructions: compiled.rowInstructions,
      metrics: compiled.metrics
    })
  );
}
