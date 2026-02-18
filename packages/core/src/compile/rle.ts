import type { RowRun } from '../types';
import { assert } from '../utils/assert';

export function encodeRowRLE(row: Uint16Array): RowRun[] {
  if (row.length === 0) return [];
  const runs: RowRun[] = [];
  let current = row[0];
  let count = 1;
  for (let i = 1; i < row.length; i += 1) {
    if (row[i] === current) {
      count += 1;
    } else {
      runs.push([current, count]);
      current = row[i];
      count = 1;
    }
  }
  runs.push([current, count]);
  return runs;
}

export function encodeGridRLE(grid: Uint16Array, width: number, height: number): RowRun[][] {
  const out: RowRun[][] = [];
  for (let y = 0; y < height; y += 1) {
    out.push(encodeRowRLE(grid.subarray(y * width, (y + 1) * width)));
  }
  return out;
}

export function inflateRLE(rleRows: RowRun[][], w: number, h: number): Uint16Array {
  const out = new Uint16Array(w * h);
  let offset = 0;
  for (const row of rleRows) {
    for (const [colorId, count] of row) {
      for (let i = 0; i < count; i += 1) {
        out[offset++] = colorId;
      }
    }
  }
  assert(offset === w * h, 'RLE does not match expected dimensions.');
  return out;
}
